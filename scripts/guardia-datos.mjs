#!/usr/bin/env node
/*
 * guardia-datos.mjs: frena un overhaul que tocó la vinculación de datos.
 *
 *   node scripts/guardia-datos.mjs [--base main] [--hasta <ref>] [--json] [--estricto]
 *                                  [--permitir "texto"]... [--solo <carpeta>]... [--detalle]
 *
 * Corre parado dentro del repo del sistema (no el de la skill). Compara la base (por defecto
 * el punto donde la rama se separó de main) contra el árbol actual, incluidos los cambios sin
 * commit y los archivos nuevos sin agregar. De cada .ts/.tsx/.js/.jsx tocado saca las
 * "firmas de datos" de antes y de después: URLs de API, métodos, cuerpos enviados, query keys,
 * hooks de datos, server actions, loaders, consultas (Supabase, SQL), campos de formulario y su
 * validación, parámetros de la URL, rutas, props de tipos exportados, permisos, ids de prueba
 * y eventos de analítica.
 *
 * Las firmas se comparan en conjunto, no archivo por archivo: si una firma se muda de
 * Cobranzas.tsx a useCobranzas.ts, está bien (se informa como "movida"). Si desaparece de todos
 * lados o cambia, falla con código 1 y dice archivo, línea, antes y después.
 *
 * Sin dependencias: solo Node 18+ y git. Es una red de seguridad por patrones, no un
 * compilador: no reemplaza al typecheck, a las pruebas ni a mirar la pestaña de red.
 *
 * Códigos de salida: 0 pasa · 1 cambió o desapareció una firma de datos · 2 error de uso o de git.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, extname, basename } from 'node:path';

/* ───────────── argumentos ───────────── */
const args = process.argv.slice(2);
const flag = n => args.includes(n);
const valores = n => args.flatMap((a, i) => (a === n && args[i + 1] !== undefined ? [args[i + 1]] : []));
const valor = (n, def) => valores(n)[0] ?? def;

if (flag('--ayuda') || flag('-h') || flag('--help')) {
  console.log(`Uso: node guardia-datos.mjs [opciones]   (parado en el repo del sistema)

  --base REF       contra qué comparar (por defecto main, o master, o HEAD). Si es una rama,
                   usa el punto donde tu rama se separó de ella (merge-base).
  --directo        compara contra REF tal cual, sin merge-base
  --hasta REF      compara contra otro commit en vez del árbol actual (para CI en un PR)
  --solo RUTA      revisa solo los archivos bajo esa carpeta (se puede repetir)
  --ignorar TXT    saltea los archivos cuya ruta contiene TXT (se puede repetir). Los tipos
                   generados (database.types.ts, *.gen.ts, "@generated") ya se saltean solos
  --listar         muestra todas las firmas de antes y de después (para entender un reporte)
  --permitir TXT   acepta a propósito las firmas que contienen TXT (se puede repetir).
                   También lee .guardia-datos-permitir en la raíz del repo (una por línea, # comenta)
  --estricto       también falla con firmas nuevas y con firmas que quedaron con menos usos
  --detalle        lista las firmas movidas y las nuevas una por una
  --json           salida en JSON (para otro agente o CI)`);
  process.exit(0);
}

const JSON_OUT = flag('--json');
const ESTRICTO = flag('--estricto');
const DETALLE = flag('--detalle');
const DIRECTO = flag('--directo');
const HASTA = valor('--hasta', null);
const SOLO = valores('--solo').map(s => s.replace(/^\.\//, '').replace(/\/$/, ''));
const EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.mts', '.cts']);

function git(a, { permitirFallo = false } = {}) {
  try {
    return execFileSync('git', a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 256 * 1024 * 1024 });
  } catch (e) {
    if (permitirFallo) return null;
    const msg = (e.stderr || e.message || '').toString().trim();
    salirConError(`git ${a.join(' ')} falló: ${msg}`);
  }
}
function salirConError(m) {
  if (JSON_OUT) console.log(JSON.stringify({ ok: false, error: m }));
  else console.error(`guardia-datos: ${m}`);
  process.exit(2);
}

const raiz = git(['rev-parse', '--show-toplevel'], { permitirFallo: true })?.trim();
if (!raiz) salirConError('no estoy dentro de un repo git. Corré el script parado en el repo del sistema.');
process.chdir(raiz);

const existeRef = r => git(['rev-parse', '--verify', '--quiet', `${r}^{commit}`], { permitirFallo: true }) !== null;
let baseNombre = valor('--base', null);
if (!baseNombre) baseNombre = ['main', 'master', 'origin/main', 'origin/master'].find(existeRef) || 'HEAD';
if (!existeRef(baseNombre)) salirConError(`no encuentro la base "${baseNombre}". Probá con --base <rama o commit>.`);
if (HASTA && !existeRef(HASTA)) salirConError(`no encuentro --hasta "${HASTA}".`);

let base = git(['rev-parse', baseNombre]).trim();
const esRama = git(['show-ref', '--verify', '--quiet', `refs/heads/${baseNombre}`], { permitirFallo: true }) !== null
  || git(['show-ref', '--verify', '--quiet', `refs/remotes/${baseNombre}`], { permitirFallo: true }) !== null;
if (esRama && !DIRECTO) {
  const mb = git(['merge-base', baseNombre, HASTA || 'HEAD'], { permitirFallo: true });
  if (mb) base = mb.trim();
}

/* ───────────── archivos tocados ───────────── */
const diff = git(['diff', '--name-status', '-M', '-z', base, ...(HASTA ? [HASTA] : []), '--']);
const tocados = []; // { antes: ruta|null, despues: ruta|null }
{
  const p = diff.split('\0').filter(s => s !== '');
  for (let i = 0; i < p.length; ) {
    const st = p[i++];
    if (st.startsWith('R') || st.startsWith('C')) { const a = p[i++], b = p[i++]; tocados.push({ antes: a, despues: b }); }
    else if (st === 'A') tocados.push({ antes: null, despues: p[i++] });
    else if (st === 'D') tocados.push({ antes: p[i++], despues: null });
    else { const a = p[i++]; tocados.push({ antes: a, despues: a }); }
  }
}
if (!HASTA) {
  const sueltos = git(['ls-files', '--others', '--exclude-standard', '-z']).split('\0').filter(Boolean);
  for (const s of sueltos) tocados.push({ antes: null, despues: s });
}
// Los tipos generados (supabase gen types, graphql codegen) cambian por una migración, no por un overhaul.
const GENERADO = /(\.gen|\.generated|database\.types|supabase\.types)\.[cm]?[tj]sx?$|(^|\/)types\/(database|supabase)\.ts$|(^|\/)(__generated__|generated)\//;
const IGNORAR = valores('--ignorar');
const esCodigo = r => r && EXT.has(extname(r)) && !r.includes('node_modules/') && !GENERADO.test(r) && !IGNORAR.some(i => r.includes(i))
  && (!SOLO.length || SOLO.some(s => r === s || r.startsWith(s + '/')));
const conCodigo = tocados.filter(t => esCodigo(t.antes) || esCodigo(t.despues));

const leerAntes = r => git(['show', `${base}:${r}`], { permitirFallo: true }) ?? '';
const leerDespues = r => (HASTA ? git(['show', `${HASTA}:${r}`], { permitirFallo: true }) ?? '' : existsSync(r) ? readFileSync(r, 'utf8') : '');

/* ───────────── lectura del código ───────────── */
// Borra comentarios (deja espacios para que las posiciones y las líneas sigan iguales).
// Respeta strings y template literals con ${ } anidados.
function sinComentarios(src) {
  const out = src.split('');
  const n = src.length;
  const pila = [];
  let estado = 'codigo';
  for (let i = 0; i < n; ) {
    const c = src[i], d = src[i + 1];
    if (estado === 'codigo') {
      if (c === '/' && d === '/') { estado = 'linea'; continue; }
      if (c === '/' && d === '*') { out[i] = out[i + 1] = ' '; i += 2; estado = 'bloque'; continue; }
      if (c === "'" || c === '"') { estado = c; i++; continue; }
      if (c === '`') { estado = 'tpl'; i++; continue; }
      if (pila.length) {
        if (c === '{') pila[pila.length - 1]++;
        else if (c === '}') {
          if (pila[pila.length - 1] === 0) { pila.pop(); estado = 'tpl'; i++; continue; }
          pila[pila.length - 1]--;
        }
      }
      i++; continue;
    }
    if (estado === 'linea') { if (c === '\n') estado = 'codigo'; else out[i] = ' '; i++; continue; }
    if (estado === 'bloque') {
      if (c === '*' && d === '/') { out[i] = out[i + 1] = ' '; i += 2; estado = 'codigo'; continue; }
      if (c !== '\n') out[i] = ' ';
      i++; continue;
    }
    if (estado === "'" || estado === '"') {
      if (c === '\\') { i += 2; continue; }
      if (c === estado || c === '\n') estado = 'codigo'; // un apóstrofo suelto en JSX no se come el archivo
      i++; continue;
    }
    if (estado === 'tpl') {
      if (c === '\\') { i += 2; continue; }
      if (c === '`') { estado = 'codigo'; i++; continue; }
      if (c === '$' && d === '{') { pila.push(0); estado = 'codigo'; i += 2; continue; }
      i++; continue;
    }
  }
  return out.join('');
}

// Índice del cierre que corresponde a la apertura en t[i] ( ( [ { ), o -1.
function cierre(t, i) {
  const par = { '(': ')', '[': ']', '{': '}' };
  const pila = [par[t[i]]];
  for (let j = i + 1; j < t.length; j++) {
    const c = t[j];
    if (c === "'" || c === '"' || c === '`') {
      for (j++; j < t.length && t[j] !== c; j++) { if (t[j] === '\\') j++; else if (c !== '`' && t[j] === '\n') break; }
      continue;
    }
    if (par[c]) pila.push(par[c]);
    else if (c === pila[pila.length - 1]) { pila.pop(); if (!pila.length) return j; }
  }
  return -1;
}

// Parte en el nivel 0 por los separadores dados. `angulos` cuenta < > (tipos genéricos).
function partir(s, seps, angulos = false) {
  const partes = [];
  let nivel = 0, desde = 0;
  for (let j = 0; j < s.length; j++) {
    const c = s[j];
    if (c === "'" || c === '"' || c === '`') {
      for (j++; j < s.length && s[j] !== c; j++) if (s[j] === '\\') j++;
      continue;
    }
    if ('([{'.includes(c) || (angulos && c === '<')) nivel++;
    else if (')]}'.includes(c) || (angulos && c === '>' && s[j - 1] !== '=')) nivel--;
    else if (nivel === 0 && seps.includes(c)) { partes.push(s.slice(desde, j)); desde = j + 1; }
  }
  partes.push(s.slice(desde));
  return partes.map(p => p.trim()).filter(Boolean);
}

const compacto = s => s.replace(/\s+/g, ' ').replace(/\s*([(){}[\],:;=<>|&?!.+*/-])\s*/g, '$1').trim();
const plantilla = s => s.replace(/\$\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g, '${}');
// String literal para meter dentro de otra regex: `n` es el número de grupo de la comilla.
const str = n => "(['\"\\x60])((?:\\\\.|(?!\\" + n + ")[^\\\\\\n])*)\\" + n;

// Claves de primer nivel de un objeto literal (contenido sin las llaves).
function clavesDeObjeto(cuerpo) {
  return partir(cuerpo, [',']).map(p => {
    if (p.startsWith('...')) return '...' + compacto(p.slice(3));
    const m = p.match(/^(?:async\s+)?(?:get\s+|set\s+)?([\w$]+|'[^']*'|"[^"]*"|\[[^\]]+\])\s*(?:\??\s*:|\()/);
    if (m) return m[1].replace(/^['"]|['"]$/g, '');
    if (/^[\w$]+$/.test(p)) return p;
    return null;
  }).filter(Boolean);
}

// Los mensajes de validación son texto de interfaz: se pueden cambiar. La regla no.
function sinMensajes(expr) {
  const S = String.raw`(?:'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|\x60(?:\\.|[^\x60\\])*\x60)`;
  return expr
    .replace(new RegExp(String.raw`\b(message|required_error|invalid_type_error|description)\s*:\s*${S}`, 'g'), "$1:'…'")
    .replace(new RegExp(String.raw`(\.(?:min|max|length|gt|gte|lt|lte|regex|multipleOf|startsWith|endsWith|includes|refine|superRefine)\((?:[^()]|\([^()]*\))*?),\s*(?:${S}|\{[^{}]*\})\s*\)`, 'g'), '$1)')
    .replace(new RegExp(String.raw`(\.(?:email|url|uuid|cuid2?|ulid|nonempty|positive|negative|nonnegative|nonpositive|int|finite|datetime|date|time|ip|trim|required|typeError))\(\s*(?:${S}|\{[^{}]*\})\s*\)`, 'g'), '$1()');
}

const ETIQUETA_CAMPO = /^(input|select|textarea|button|form|fieldset|output|Controller|Field|FormField|FormItem|Campo\w*|Entrada\w*|Selector\w*|Interruptor\w*|\w*(?:Input|Select|Field|Textarea|Check|Radio|Switch|Combo|Picker|Upload|Archivo|Fecha|Date|Monto|Money|Numero|Number|Toggle|Slider|Option)\w*)$/;
const HOOKS = String.raw`use(?:[A-Z]\w*?)?(?:Query|Queries|Mutation)|useSWR\w*|useLoaderData|useRouteLoaderData|useActionData|useFetcher|useFetchers|useSubmit|useNavigation|useActionState|useFormState|useFormStatus|useOptimistic|useForm|useFieldArray|useController|useSearchParams|useParams|useQueryClient|useRouter|usePathname|useSelector|useDispatch|useStore|useSession|useUser|useAuth`;
const HOOK_VISUAL = /^use(Media|Theme|Tema|Marco|Toast|Modal|Dialog|Hover|Click|Outside|Window|Scroll|Resize|Animation|Animacion|Motion|Breakpoint|IsMobile|Mobile|Celular|Dark|Oscuro|Disclosure|Toggle|Ref|Id|Focus|Foco|Keyboard|Teclado|Hotkey|Atajo|Debounce|Interval|Timeout|Mounted|Layout|Sidebar|Menu|Tooltip|Popover|Copy|Clipboard|Local|Prefers|Reduced)/;
const OBJ_API = String.raw`(?:api|axios|http|https|client|cliente|apiClient|request|ky|ofetch|instance|instancia|servicio|service|\w+Api|\w+Client)`;
const IMPORT_DATOS = /(^|\/)(api|apis|hooks?|queries|query|datos|data|services?|servicios?|actions?|acciones|server|db|supabase|trpc|fetchers?|loaders?|repos?|repositorio|store|stores)(\/|\.|$)/i;

/* ───────────── extracción de firmas ───────────── */
// Cada firma: { tipo, valor, linea }. El "tipo" agrupa el reporte.
function firmas(fuente, archivo) {
  if (!fuente) return [];
  if (/@generated|auto-?generated|do not edit|no editar/i.test(fuente.slice(0, 400))) return [];
  const t = sinComentarios(fuente);
  const saltos = [];
  for (let i = 0; i < t.length; i++) if (t[i] === '\n') saltos.push(i);
  const linea = pos => { let lo = 0, hi = saltos.length; while (lo < hi) { const m = (lo + hi) >> 1; if (saltos[m] < pos) lo = m + 1; else hi = m; } return lo + 1; };
  const r = [];
  const add = (tipo, v, pos) => { if (v != null && String(v).trim() !== '') r.push({ tipo, valor: String(v).trim(), linea: linea(pos) }); };
  const cada = (re, fn) => { for (const m of t.matchAll(re)) fn(m); };

  // directivas
  cada(/^\s*(['"])use (server|client)\1/gm, m => add('directiva', `'use ${m[2]}'`, m.index));
  const esServidor = /^\s*(['"])use server\1/m.test(t);

  // URLs de API como string en cualquier lado
  cada(new RegExp(String.raw`(['"\x60])((?:https?:\/\/[^'"\x60\s]*)?\/(?:api|rest|graphql|trpc)(?:\/|\?|\1)[^'"\x60\n]*)\1`, 'g'),
    m => add('api', plantilla(m[2]), m.index));
  // primer argumento de fetch / axios / api.get… (string o template)
  cada(new RegExp(String.raw`\b((?:fetch|\$fetch|axios|${OBJ_API}\.(?:get|post|put|patch|delete|del|request|head)))\s*(?:<[^()]*?>)?\s*\(\s*${str(2)}`, 'g'),
    m => add('api', `${m[1].replace(/^\w+(Api|Client)\./, 'api.')} ${plantilla(m[3])}`, m.index));
  // fetch(variable): al menos que siga existiendo la llamada con esa variable
  cada(/\b(fetch|\$fetch|axios)\s*\(\s*([A-Za-z_$][\w$.]*)\s*[,)]/g, m => add('api', `${m[1]}(${m[2]})`, m.index));
  // método HTTP
  cada(/\bmethod\s*:\s*(['"`])(\w+)\1/g, m => add('metodo', m[2].toUpperCase(), m.index));

  // cuerpos enviados: claves de objetos en JSON.stringify / mutate / insert / update / post…
  cada(new RegExp(String.raw`\b(JSON\.stringify|mutate|mutateAsync|trigger|insert|update|upsert|submit|${OBJ_API}\.(?:post|put|patch))\s*\(`, 'g'), m => {
    const ab = m.index + m[0].length - 1;
    const ce = cierre(t, ab);
    if (ce < 0) return;
    const argsTxt = t.slice(ab + 1, ce);
    const nombre = m[1].replace(/^\w+(Api|Client)\./, 'api.');
    for (const a of partir(argsTxt, [','])) {
      if (!a.startsWith('{')) continue;
      const fin = cierre(a, 0);
      if (fin < 0) continue;
      for (const k of clavesDeObjeto(a.slice(1, fin))) add('cuerpo', `${nombre} → ${k}`, m.index);
    }
  });

  // query keys
  cada(/\b(queryKey|mutationKey)\s*:\s*\[/g, m => {
    const ab = m.index + m[0].length - 1, ce = cierre(t, ab);
    if (ce > 0) add('query-key', `${m[1]} ${compacto(plantilla(t.slice(ab, ce + 1)))}`, m.index);
  });
  // useQuery(['x', id], …) estilo v3 / useSWR('/api/x' | ['k', id], …)
  cada(/\b(use(?:Query|InfiniteQuery|SWR\w*|Mutation))\s*(?:<[^()]*?>)?\s*\(\s*([[`'"])/g, m => {
    const ini = m.index + m[0].length - 1;
    let fin = m[2] === '[' ? cierre(t, ini) : t.indexOf(m[2], ini + 1);
    if (fin > 0) add('query-key', `${m[1]} ${compacto(plantilla(t.slice(ini, fin + 1)))}`, m.index);
  });
  cada(/\b(invalidateQueries|refetchQueries|setQueryData|getQueryData|cancelQueries|removeQueries|resetQueries|prefetchQuery|mutate)\s*\(\s*\[/g, m => {
    const ab = m.index + m[0].length - 1, ce = cierre(t, ab);
    if (ce > 0) add('query-key', `${m[1]} ${compacto(plantilla(t.slice(ab, ce + 1)))}`, m.index);
  });

  // hooks de datos (con la cadena que los precede: trpc.cobros.list.useQuery)
  cada(new RegExp(String.raw`((?:[\w$]+\??\.)*)\b(${HOOKS})\s*(?:<[^()]*?>)?\s*\(`, 'g'),
    m => add('hook', `${m[1].replace(/\?/g, '').replace(/^(React|react)\./, '')}${m[2]}`, m.index));

  // hooks propios importados del proyecto (useUsuario, useCobros…), menos los visuales
  const propios = new Set();
  cada(/\bimport\s+(?:([\w$]+)\s*,?\s*)?(?:\{([^}]*)\})?\s*from\s*(['"])((?:\.|@\/|~\/)[^'"]*)\3/g, m => {
    const ns = [m[1], ...(m[2] || '').split(',').map(x => x.trim().split(/\s+as\s+/).pop())].filter(Boolean);
    for (const n of ns) if (/^use[A-Z]/.test(n) && !HOOK_VISUAL.test(n) && !new RegExp(`^(?:${HOOKS})$`).test(n)) propios.add(n);
  });
  if (propios.size) cada(new RegExp(String.raw`\b(${[...propios].join('|')})\s*(?:<[^()]*?>)?\s*\(`, 'g'), m => add('hook', m[1], m.index));

  // imports de módulos de datos (la ruta cambia si el archivo se muda: se compara el nombre)
  cada(/\bimport\s+(?:type\s+)?([\w$]+\s*,?\s*)?(?:\{([^}]*)\})?\s*from\s*(['"])([^'"]+)\3/g, m => {
    const ruta = m[4];
    if (!IMPORT_DATOS.test(ruta.replace(/^(\.\.?\/)+|^[@~]\//, ''))) return;
    if (/^type\b/.test(m[0].slice(6).trim())) return;
    const nombres = [];
    if (m[1]) nombres.push(m[1].replace(/[,\s]/g, ''));
    if (m[2]) for (const p of m[2].split(',')) { const n = p.trim().replace(/^type\s+/, ''); if (n && !p.trim().startsWith('type ')) nombres.push(n.split(/\s+as\s+/)[0].trim()); }
    for (const n of nombres) if (n && !/^[A-Z]/.test(n)) add('import-datos', `${n} ← ${basename(ruta)}`, m.index);
  });

  // server actions y cargadores
  cada(/\b(action|formAction)\s*=\s*\{\s*([\w$.]+)/g, m => add('accion-servidor', `${m[1]}={${m[2]}}`, m.index));
  if (esServidor) cada(/\bexport\s+(?:default\s+)?(?:async\s+)?(?:function\s+([\w$]+)|const\s+([\w$]+)\s*=)/g, m => add('accion-servidor', `export ${m[1] || m[2]}`, m.index));
  cada(/\bexport\s+(?:async\s+)?(?:function\s+|const\s+|let\s+)(loader|action|clientLoader|clientAction|getServerSideProps|getStaticProps|getStaticPaths|generateStaticParams|generateMetadata|revalidate|dynamic|dynamicParams|fetchCache|runtime|preferredRegion|maxDuration)\b/g,
    m => add('cargador', m[1], m.index));
  cada(/\b(revalidatePath|revalidateTag|updateTag|refresh)\s*\(\s*(['"`])([^'"`]*)\2/g, m => add('cargador', `${m[1]}(${plantilla(m[3])})`, m.index));

  // consultas: Supabase / PostgREST y SQL
  cada(/\.(from|rpc|select|order|eq|neq|gt|gte|lt|lte|in|is|like|ilike|match|contains|filter|or|not|range|textSearch|channel)\s*\(\s*(['"`])((?:\\.|(?!\2)[^\\])*)\2(?:\s*,\s*(?:(['"`])((?:\\.|(?!\4)[^\\\n])*)\4|(true|false|null|-?\d+(?:\.\d+)?)))?/g,
    m => add('consulta', `.${m[1]}(${compacto(plantilla(m[3]))}${m[5] != null ? `, '${m[5]}'` : m[6] != null ? `, ${m[6]}` : ''})`, m.index));
  cada(/\b(prepare|query|execute|sql|raw)\s*\(\s*(['"`])((?:\\.|(?!\2)[^\\])*?\b(?:select|insert|update|delete|with)\b(?:\\.|(?!\2)[^\\])*)\2/gi,
    m => add('consulta', `${m[1]}: ${compacto(plantilla(m[3])).toLowerCase()}`, m.index));
  cada(/\bsql\s*`((?:\\.|[^`\\])*)`/g, m => add('consulta', `sql: ${compacto(plantilla(m[1])).toLowerCase()}`, m.index));

  // campos de formulario
  cada(/\bname\s*=\s*(?:(['"])([^'"\n]+)\1|\{\s*(['"`])([^'"`\n]+)\3\s*\})/g, m => {
    const antes = t.slice(Math.max(0, m.index - 600), m.index);
    const tag = antes.match(/<([A-Za-z][\w.]*)(?![\s\S]*<[A-Za-z])/);
    const nombreTag = tag ? tag[1].split('.').pop() : '';
    if (ETIQUETA_CAMPO.test(nombreTag)) add('campo', `name="${plantilla(m[2] ?? m[4])}"`, m.index);
  });
  cada(/\b(register|setValue|resetField|setError|clearErrors|trigger)\s*\(\s*(['"`])([^'"`]+)\2/g,
    m => add('campo', `${m[1] === 'register' ? 'register' : m[1]}("${m[3]}")`, m.index));
  cada(/\buse(?:Controller|Field)\s*\(\s*\{[^}]*?\bname\s*:\s*(['"`])([^'"`]+)\1/g, m => add('campo', `name="${m[2]}"`, m.index));
  cada(/\b(?:formData|fd|datos|form|data)\.(get|getAll|append|set|has)\s*\(\s*(['"`])([^'"`]+)\2/g, m => add('campo', `formData.${m[1]}("${m[3]}")`, m.index));

  // esquemas (zod / yup / valibot): campo + regla (sin los mensajes)
  cada(/\b(z|zod|yup|v|Yup)\s*\.\s*(object|strictObject|looseObject)\s*\(\s*\{/g, m => {
    const ab = m.index + m[0].length - 1, ce = cierre(t, ab);
    if (ce < 0) return;
    const prev = t.slice(Math.max(0, m.index - 160), m.index).match(/\b(?:const|let|var)\s+([\w$]+)\s*(?::[^=\n]*)?=\s*$/);
    const esquema = prev ? prev[1] : 'esquema';
    for (const p of partir(t.slice(ab + 1, ce), [','])) {
      const k = p.match(/^([\w$]+|'[^']*'|"[^"]*")\s*:\s*([\s\S]+)$/);
      if (k) add('esquema', `${esquema}.${k[1].replace(/^['"]|['"]$/g, '')}: ${compacto(sinMensajes(k[2]))}`, m.index);
      else if (p.startsWith('...')) add('esquema', `${esquema}.${compacto(p)}`, m.index);
    }
  });
  cada(/\.(extend|merge|pick|omit|required|partial)\s*\(\s*\{/g, m => {
    const ab = m.index + m[0].length - 1, ce = cierre(t, ab);
    if (ce > 0) for (const k of clavesDeObjeto(t.slice(ab + 1, ce))) add('esquema', `.${m[1]} → ${k}`, m.index);
  });

  // parámetros de la URL
  cada(/\b(?:searchParams|params|query|sp|parametros|urlParams|search)\??\.(get|getAll|set|has|delete|append)\s*\(\s*(['"`])([^'"`]+)\2/g,
    m => add('parametro', `${m[1]}("${m[3]}")`, m.index));
  cada(/\b(searchParams|params)\??\.(?!get\b|getAll\b|set\b|has\b|delete\b|append\b|toString\b|entries\b|keys\b|values\b|forEach\b|size\b|then\b)([\w$]+)/g,
    m => add('parametro', `${m[1]}.${m[2]}`, m.index));
  cada(/\bconst\s*\{([^}]*)\}\s*=\s*(?:await\s+)?(?:props\.)?(searchParams|params)\b/g, m => {
    for (const k of clavesDeObjeto(m[1])) add('parametro', `${m[2]}.${k.split(':')[0].trim()}`, m.index);
  });
  cada(/[?&]([\w-]+)=/g, m => {
    // ?tab= / &foco= dentro de un string
    const lin = t.slice(t.lastIndexOf('\n', m.index) + 1, t.indexOf('\n', m.index) === -1 ? t.length : t.indexOf('\n', m.index));
    if (/['"`]/.test(lin)) add('parametro', `?${m[1]}=`, m.index);
  });

  // rutas
  cada(/\b(path|href|to|pathname|redirectTo|callbackUrl)\s*[:=]\s*\{?\s*(['"`])((?:\\.|(?!\2)[^\\\n])*)\2/g, m => {
    const v = m[3] ?? '';
    if (v.startsWith('/') && !v.startsWith('//')) add('ruta', `${m[1] === 'path' ? 'path' : 'link'} ${plantilla(v)}`, m.index);
  });
  cada(/\b(push|replace|prefetch|redirect|permanentRedirect|navigate|withFocus|conFoco)\s*\(\s*(['"`])(\/[^'"`\n]*)\2/g,
    m => add('ruta', `${m[1]}(${plantilla(m[3])})`, m.index));

  // permisos y condiciones de visibilidad
  cada(/\b(puede[A-ZÁÉÍÓÚ]\w*|can[A-Z]\w*|(?:has|tiene)(?:Permiso|Permission|Rol|Role|Acceso|Access|Scope)\w*|(?:is|es)(?:Admin|Owner|Director|Dueno|Dueño|Super\w*|Gerente|Manager|Staff|Contador|Supervisor)\w*)\b(\s*\(\s*(['"`])[^'"`]+\3\s*\))?/g,
    m => {
      // Se cuentan los USOS (la condición que esconde o muestra algo). Definirlo, devolverlo
      // desde el hook o pasarlo como prop no cuenta: si no, mudar el permiso a un hook
      // inflaría los conteos y taparía un botón que quedó sin su condición.
      const antes = t.slice(Math.max(0, m.index - 40), m.index), despues = t.slice(m.index + m[0].length, m.index + m[0].length + 40);
      const esFuncion = !!m[2];
      const def = !esFuncion && (/\b(?:const|let|var|function)\s+$/.test(antes) || /^\s*\??\s*(?:=(?!=|>)|:)/.test(despues) || /\.$/.test(antes));
      const paso = !esFuncion && /[{,(]\s*$/.test(antes) && /^\s*[,})]/.test(despues) && !/(?:&&|\|\||\?|!)\s*[{(]?\s*$/.test(antes) && !/\bif\s*\(\s*$/.test(antes);
      if (def) add('permiso', `${compacto(m[0])} (definición)`, m.index);
      else if (!paso) add('permiso', compacto(m[0]), m.index);
    });
  cada(/\b((?:[\w$]+\??\.)*(?:rol|role|roles|permisos|permissions|scope|scopes|perfil\.rol|user\.role))\s*(===|!==|==|!=)\s*(['"`])([^'"`]+)\3/g,
    m => add('permiso', `${m[1].replace(/\?/g, '').split('.').slice(-1)[0]} ${m[2].slice(0, 2) === '!=' ? '!==' : '==='} '${m[4]}'`, m.index));
  cada(/(['"`])([^'"`\n]+)\1\s*(===|!==|==|!=)\s*((?:[\w$]+\??\.)*(?:rol|role))\b/g,
    m => add('permiso', `${m[4].split('.').slice(-1)[0]} ${m[3].slice(0, 2) === '!=' ? '!==' : '==='} '${m[2]}'`, m.index));
  cada(/\b(roles|permisos|permissions|scopes|rolesPermitidos)\s*\.\s*(includes|has|some)\s*\(\s*(['"`])([^'"`]+)\3/g,
    m => add('permiso', `${m[1]}.${m[2]}('${m[4]}')`, m.index));
  cada(/\[\s*((?:(['"`])[^'"`]+\2\s*,?\s*)+)\]\s*\.\s*includes\s*\(\s*((?:[\w$]+\??\.)*(?:rol|role))\s*\)/g,
    m => add('permiso', `[${compacto(m[1])}].includes(${m[3].split('.').slice(-1)[0]})`, m.index));
  cada(/\b(can|cannot|puede|requireRole|requerirRol|requirePermission|requerirPermiso|checkPermission|autorizar|authorize|assertRole|exigirRol|soloRol|conPermiso)\s*\(\s*([^)]*)\)/g,
    m => add('permiso', `${m[1]}(${compacto(m[2])})`, m.index));

  // ganchos de pruebas, anclas y analítica
  cada(/\b(data-(?:testid|test-id|test|cy|qa|pw|focus|foco))\s*=\s*\{?\s*(['"`])([^'"`]+)\2/g, m => add('prueba', `${m[1]}="${plantilla(m[3])}"`, m.index));
  cada(/\bgetBy(?:TestId)\s*\(\s*(['"`])([^'"`]+)\1/g, m => add('prueba', `data-testid="${m[2]}"`, m.index));
  cada(/\b(track|capture|logEvent|sendEvent|registrarEvento|evento|trackEvent|reportEvent)\s*\(\s*(['"`])([^'"`]+)\2/g, m => add('analitica', `${m[1]}("${m[3]}")`, m.index));
  cada(/\bgtag\s*\(\s*(['"])event\1\s*,\s*(['"])([^'"]+)\2/g, m => add('analitica', `gtag("${m[3]}")`, m.index));
  cada(/\bid\s*=\s*(['"])([A-Za-z][\w-]*)\1/g, m => add('ancla', `id="${m[2]}"`, m.index));

  // props de tipos exportados
  cada(/\bexport\s+(?:declare\s+)?(?:interface\s+([\w$]+)(?:<[^{]*?>)?(?:\s+extends\s+[^{]+)?\s*\{|type\s+([\w$]+)(?:<[^=]*?>)?\s*=\s*\{)/g, m => {
    const nombre = m[1] || m[2];
    const ab = m.index + m[0].length - 1, ce = cierre(t, ab);
    if (ce < 0) return;
    const partes = partir(t.slice(ab + 1, ce), [';', ',', '\n'], true);
    const miembros = [];
    for (const p of partes) {
      if (/^(readonly\s+)?([\w$]+|'[^']*'|"[^"]*"|\[[^\]]+\])\s*\??\s*[:(]/.test(p) || !miembros.length) miembros.push(p);
      else miembros[miembros.length - 1] += ' ' + p;
    }
    for (const p of miembros) {
      const k = p.match(/^(?:readonly\s+)?([\w$]+|'[^']*'|"[^"]*"|\[[^\]]+\])\s*(\??)\s*([:(][\s\S]*)$/);
      if (k) add('tipo', `${nombre}.${k[1]}${k[2]}${compacto(k[3]).replace(/^:/, ': ')}`, m.index);
    }
  });

  return r.map(f => ({ ...f, archivo }));
}

/* ───────────── comparar ───────────── */
const antes = [], despues = [];
for (const t of conCodigo) {
  if (esCodigo(t.antes)) antes.push(...firmas(leerAntes(t.antes), t.antes));
  if (esCodigo(t.despues)) despues.push(...firmas(leerDespues(t.despues), t.despues));
}

if (flag('--listar')) {
  for (const [titulo, lista] of [['ANTES', antes], ['DESPUÉS', despues]]) {
    console.log(`── ${titulo} (${lista.length})`);
    for (const f of lista) console.log(`  ${f.tipo.padEnd(15)} ${f.valor}   ${f.archivo}:${f.linea}`);
  }
  process.exit(0);
}

// Permitidos: --permitir y .guardia-datos-permitir
const permitidos = [...valores('--permitir')];
if (existsSync(join(raiz, '.guardia-datos-permitir'))) {
  for (const l of readFileSync(join(raiz, '.guardia-datos-permitir'), 'utf8').split('\n')) {
    const s = l.replace(/#.*$/, '').trim();
    if (s) permitidos.push(s);
  }
}
const estaPermitida = f => permitidos.some(p => `${f.tipo} ${f.valor}`.includes(p) || f.valor.includes(p));

// Tipos que solo avisan (nunca frenan solos): un id de HTML suele ser de accesibilidad.
const SOLO_AVISO = new Set(['ancla']);

const clave = f => `${f.tipo}\u0000${f.valor}`;
const agrupar = lista => { const m = new Map(); for (const f of lista) { const k = clave(f); if (!m.has(k)) m.set(k, []); m.get(k).push(f); } return m; };
const gA = agrupar(antes), gD = agrupar(despues);

const desaparecidas = [], nuevas = [], menosUsos = [], movidas = [];
for (const [k, la] of gA) {
  const ld = gD.get(k) || [];
  if (!ld.length) desaparecidas.push(...la.slice(0, 1).map(f => ({ ...f, usos: la.length })));
  else {
    if (ld.length < la.length) menosUsos.push({ ...la[0], antesUsos: la.length, despuesUsos: ld.length, despuesArchivo: ld[0].archivo });
    const archA = new Set(la.map(f => f.archivo)), archD = new Set(ld.map(f => f.archivo));
    if ([...archA].some(a => !archD.has(a)) || [...archD].some(a => !archA.has(a)))
      movidas.push({ ...la[0], de: [...archA], a: [...archD] });
  }
}
for (const [k, ld] of gD) if (!gA.has(k)) nuevas.push({ ...ld[0], usos: ld.length });

// Emparejar desaparecidas con nuevas del mismo tipo ("cambió X → Y")
const bigramas = s => { const b = new Set(); for (let i = 0; i < s.length - 1; i++) b.add(s.slice(i, i + 2)); return b; };
const parecido = (a, b) => { const A = bigramas(a), B = bigramas(b); if (!A.size || !B.size) return a === b ? 1 : 0; let c = 0; for (const x of A) if (B.has(x)) c++; return (2 * c) / (A.size + B.size); };
const renombres = new Map(conCodigo.filter(t => t.antes && t.despues).map(t => [t.antes, t.despues]));
const libres = new Set(nuevas);
const cambios = [];
for (const d of desaparecidas) {
  let mejor = null, puntos = 0;
  for (const n of libres) {
    if (n.tipo !== d.tipo) continue;
    let p = parecido(d.valor, n.valor);
    if (n.archivo === d.archivo || n.archivo === renombres.get(d.archivo)) p += 0.15;
    if (p > puntos) { puntos = p; mejor = n; }
  }
  if (mejor && puntos >= 0.45) { libres.delete(mejor); cambios.push({ ...d, despues: mejor }); }
  else cambios.push({ ...d, despues: null });
}

// Un .select() que solo suma columnas no rompe lo que ya se leía: avisa, no frena.
const columnas = v => { const m = v.match(/^\.select\(([\s\S]*)\)$/); return m ? partir(m[1], [',']) : null; };
const amplia = c => {
  if (c.tipo !== 'consulta' || !c.despues) return false;
  const a = columnas(c.valor), d = columnas(c.despues.valor);
  return !!(a && d && a.every(x => d.includes(x)));
};
const ampliadas = cambios.filter(c => amplia(c) && !estaPermitida(c));
const frenan = cambios.filter(c => !SOLO_AVISO.has(c.tipo) && !amplia(c) && !estaPermitida(c));
const permitidasUsadas = cambios.filter(c => estaPermitida(c));
const avisosAncla = cambios.filter(c => SOLO_AVISO.has(c.tipo) && !estaPermitida(c));
const nuevasSueltas = [...libres].filter(n => !estaPermitida(n));
// Un permiso que se usa en menos lugares casi siempre es un botón que quedó sin su condición.
const FRENA_SI_BAJA = new Set(['permiso']);
const bajasQueFrenan = menosUsos.filter(m => FRENA_SI_BAJA.has(m.tipo) && !estaPermitida(m));
const menosUsosVivos = menosUsos.filter(m => !FRENA_SI_BAJA.has(m.tipo) && !estaPermitida(m));
const extraEstricto = ESTRICTO ? nuevasSueltas.length + menosUsosVivos.length : 0;
const ok = frenan.length === 0 && bajasQueFrenan.length === 0 && extraEstricto === 0;

/* ───────────── reporte ───────────── */
const corto = s => (s.length > 140 ? s.slice(0, 137) + '…' : s);
const ref = git(['rev-parse', '--short', base]).trim();

if (JSON_OUT) {
  console.log(JSON.stringify({
    ok,
    base: { nombre: baseNombre, commit: ref },
    hasta: HASTA || 'árbol actual',
    archivos: conCodigo.map(t => t.despues || t.antes),
    firmas: { antes: antes.length, despues: despues.length },
    frenan: [
      ...frenan.map(c => ({ tipo: c.tipo, archivo: c.archivo, linea: c.linea, antes: c.valor, despues: c.despues ? { valor: c.despues.valor, archivo: c.despues.archivo, linea: c.despues.linea } : null })),
      ...bajasQueFrenan.map(m => ({ tipo: m.tipo, archivo: m.archivo, linea: m.linea, antes: m.valor, usosAntes: m.antesUsos, usosDespues: m.despuesUsos })),
    ],
    avisos: {
      anclas: avisosAncla.map(c => ({ archivo: c.archivo, linea: c.linea, antes: c.valor, despues: c.despues?.valor ?? null })),
      nuevas: nuevasSueltas.map(n => ({ tipo: n.tipo, valor: n.valor, archivo: n.archivo, linea: n.linea })),
      menosUsos: menosUsosVivos.map(m => ({ tipo: m.tipo, valor: m.valor, antes: m.antesUsos, despues: m.despuesUsos })),
    },
    permitidas: permitidasUsadas.map(c => ({ tipo: c.tipo, valor: c.valor })),
    movidas: movidas.map(m => ({ tipo: m.tipo, valor: m.valor, de: m.de, a: m.a })),
    ampliadas: ampliadas.map(c => ({ archivo: c.archivo, linea: c.linea, antes: c.valor, despues: c.despues.valor })),
    estricto: ESTRICTO,
  }, null, 2));
  process.exit(ok ? 0 : 1);
}

const B = s => (process.stdout.isTTY ? `\x1b[1m${s}\x1b[0m` : s);
const R = s => (process.stdout.isTTY ? `\x1b[31m${s}\x1b[0m` : s);
const V = s => (process.stdout.isTTY ? `\x1b[32m${s}\x1b[0m` : s);
const A = s => (process.stdout.isTTY ? `\x1b[33m${s}\x1b[0m` : s);
const G = s => (process.stdout.isTTY ? `\x1b[2m${s}\x1b[0m` : s);

console.log(`guardia-datos · base ${baseNombre} (${ref}) → ${HASTA || 'árbol actual'}`);
console.log(G(`${tocados.length} archivos tocados · ${conCodigo.length} con código · ${antes.length} firmas antes · ${despues.length} después`));
console.log('');

if (frenan.length) {
  console.log(R(B(`FALLA · ${frenan.length} firma${frenan.length === 1 ? '' : 's'} de datos ${frenan.length === 1 ? 'cambió o desapareció' : 'cambiaron o desaparecieron'}`)));
  const porTipo = new Map();
  for (const c of frenan) { if (!porTipo.has(c.tipo)) porTipo.set(c.tipo, []); porTipo.get(c.tipo).push(c); }
  for (const [tipo, lista] of porTipo) {
    console.log('');
    console.log(B(`  ${tipo}`));
    for (const c of lista) {
      if (c.despues) {
        console.log(`    ${c.archivo}:${c.linea} · cambió`);
        console.log(`      antes:   ${corto(c.valor)}`);
        console.log(`      después: ${corto(c.despues.valor)}  ${G(`(${c.despues.archivo}:${c.despues.linea})`)}`);
      } else {
        console.log(`    ${c.archivo}:${c.linea} · desapareció${c.usos > 1 ? ` (${c.usos} usos)` : ''}`);
        console.log(`      antes:   ${corto(c.valor)}`);
        console.log(`      después: —`);
      }
    }
  }
  console.log('');
  console.log(G('  Si el cambio es a propósito y lo aprobó el dueño de los datos: --permitir "<texto de la firma>"'));
  console.log(G('  o una línea en .guardia-datos-permitir. Si no, volvé a poner la firma como estaba.'));
  console.log('');
}

if (bajasQueFrenan.length) {
  console.log(R(B(`FALLA · ${bajasQueFrenan.length} permiso${bajasQueFrenan.length === 1 ? '' : 's'} con menos usos que antes`)));
  for (const m of bajasQueFrenan) {
    console.log(`    ${m.archivo}:${m.linea} · ${corto(m.valor)}: ${m.antesUsos} usos antes, ${m.despuesUsos} después`);
  }
  console.log(G('  Casi siempre es una acción que se mudó (al menú ⋯, a la hoja) sin su condición. Si se juntaron dos usos en uno'));
  console.log(G('  a propósito, --permitir "<permiso>".'));
  console.log('');
}

const avisos = [];
for (const c of ampliadas) {
  const a = columnas(c.valor), d = columnas(c.despues.valor);
  avisos.push(`consulta ampliada (${c.archivo}:${c.linea}): .select suma ${d.filter(x => !a.includes(x)).join(', ')}; lo que ya se leía sigue igual`);
}
for (const c of avisosAncla) avisos.push(`ancla ${c.despues ? `cambió ${c.valor} → ${c.despues.valor}` : `desapareció ${c.valor}`} (${c.archivo}:${c.linea}): fijate que ningún link #${c.valor.slice(4, -1)} ni prueba la use`);
for (const m of menosUsosVivos) avisos.push(`${m.tipo} con menos usos: ${corto(m.valor)} (${m.antesUsos} → ${m.despuesUsos}): ¿se perdió un lugar donde se usaba?`);
if (nuevasSueltas.length) {
  if (DETALLE || nuevasSueltas.length <= 8) for (const n of nuevasSueltas) avisos.push(`nueva ${n.tipo}: ${corto(n.valor)} (${n.archivo}:${n.linea})`);
  else avisos.push(`${nuevasSueltas.length} firmas nuevas (usá --detalle para verlas): un overhaul no suele sumar endpoints, rutas ni campos`);
}
if (avisos.length) {
  console.log(A(B(`Avisos${ESTRICTO ? ' (con --estricto, frenan)' : ' (no frenan)'} · ${avisos.length}`)));
  for (const a of avisos) console.log(`  · ${a}`);
  console.log('');
}
if (permitidasUsadas.length) {
  console.log(G(`Permitidas a propósito · ${permitidasUsadas.length}`));
  for (const c of permitidasUsadas) console.log(G(`  · ${c.tipo}: ${corto(c.valor)}${c.despues ? ` → ${corto(c.despues.valor)}` : ' → —'}`));
  console.log('');
}
if (movidas.length) {
  // Por archivo: de dónde salieron y a dónde llegaron (solo la diferencia, no la lista entera).
  const rutas = new Map();
  for (const m of movidas) {
    const salen = m.de.filter(x => !m.a.includes(x)), llegan = m.a.filter(x => !m.de.includes(x));
    const k = !salen.length ? `también en ${llegan.join(', ')}` : !llegan.length ? `ya no en ${salen.join(', ')} (sigue en otros)` : `${salen.join(', ')} → ${llegan.join(', ')}`;
    rutas.set(k, (rutas.get(k) || 0) + 1);
  }
  console.log(G(`Movidas (están bien) · ${movidas.length} firmas cambiaron de archivo`));
  const filas = [...rutas].sort((x, y) => y[1] - x[1]);
  for (const [k, n] of DETALLE ? filas : filas.slice(0, 6)) console.log(G(`  · ${n} · ${corto(k)}`));
  if (!DETALLE && filas.length > 6) console.log(G(`  · … ${filas.length - 6} grupos más (--detalle)`));
  if (DETALLE) for (const m of movidas) console.log(G(`      ${m.tipo}: ${corto(m.valor)}`));
  console.log('');
}

if (ok) console.log(V(B(`PASA · ningún dato, endpoint, campo, ruta ni permiso desapareció o cambió${permitidasUsadas.length ? ' (fuera de lo permitido)' : ''}`)));
else if (!frenan.length && !bajasQueFrenan.length) console.log(R(B(`FALLA (--estricto) · hay firmas nuevas o con menos usos`)));
console.log(G('Esto mira patrones, no ejecuta nada: corré también el typecheck, las pruebas y compará la pestaña de red.'));
process.exit(ok ? 0 : 1);
