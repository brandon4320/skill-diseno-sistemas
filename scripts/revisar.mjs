#!/usr/bin/env node
/*
 * revisar.mjs: revisor automático de pantallas contra las reglas de diseno-sistemas (SKILL.md).
 *
 *   node scripts/revisar.mjs <url|archivo.html> [--ancho 1440] [--celular] [--oscuro] [--galeria] [--json] [--minimo 80]
 *
 * Abre la página con Playwright (Chromium), espera fuentes y animaciones de carga y mide con
 * estilos computados. Siempre hace dos pasadas: la principal (al --ancho, o a 390 con --celular)
 * y una a 390 px para desborde horizontal y toques de 44 px. Devuelve nota 0-100, la lista de
 * problemas con selector y sugerencia, y las capturas en /tmp.
 */
import { createRequire } from 'node:module';
import { existsSync, statSync } from 'node:fs';
import { resolve, basename, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execSync } from 'node:child_process';

/* ───────────── argumentos ───────────── */
const args = process.argv.slice(2);
const flag = n => args.includes(n);
const valor = (n, def) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : def; };
const objetivo = args.find((a, i) => !a.startsWith('--') && !['--ancho', '--minimo', '--alto'].includes(args[i - 1]));

if (!objetivo || flag('--ayuda') || flag('-h')) {
  console.log(`Uso: node scripts/revisar.mjs <url|archivo.html> [opciones]

  --ancho N     ancho de la pasada principal (por defecto 1440)
  --celular     la pasada principal va a 390 px como celular (táctil)
  --oscuro      pone data-tema="oscuro" en <html> y prefers-color-scheme: dark
  --galeria     catálogo de piezas: no cuenta botones rellenos (una galería muestra varios a propósito)
  --json        salida en JSON (para otro script o agente)
  --minimo N    sale con código 1 si la nota queda por debajo de N`);
  process.exit(objetivo ? 0 : 2);
}

const CELULAR = flag('--celular');
const ANCHO = CELULAR ? 390 : parseInt(valor('--ancho', '1440'), 10) || 1440;
const ALTO = parseInt(valor('--alto', CELULAR ? '844' : '900'), 10);
const OSCURO = flag('--oscuro');
const JSON_OUT = flag('--json');
const GALERIA = flag('--galeria');
const MINIMO = valor('--minimo', null);

let url = objetivo;
if (!/^(https?|file):\/\//i.test(objetivo)) {
  const p = resolve(objetivo);
  if (!existsSync(p) || !statSync(p).isFile()) { console.error(`No encuentro el archivo: ${p}`); process.exit(2); }
  url = pathToFileURL(p).href;
}
const nombre = (basename(objetivo.split('?')[0]).replace(/\.html?$/i, '') || 'pagina').replace(/[^\w.-]+/g, '-').slice(0, 40);

/* ───────────── cargar playwright sin dependencia fija ───────────── */
async function cargarPlaywright() {
  const candidatos = [];
  if (process.env.PLAYWRIGHT_DIR) candidatos.push(process.env.PLAYWRIGHT_DIR);
  for (const base of [process.cwd(), import.meta.dirname || '.']) {
    try { candidatos.push(createRequire(join(base, 'x.js')).resolve('playwright')); } catch {}
  }
  try { candidatos.push(join(execSync('npm root -g', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(), 'playwright')); } catch {}
  try { return await import('playwright'); } catch {}
  for (const c of candidatos) {
    try {
      const ruta = existsSync(join(c, 'package.json')) ? createRequire(join(c, 'x.js')).resolve(c) : c;
      return await import(pathToFileURL(ruta).href);
    } catch {}
  }
  console.error(`No encontré Playwright. Instalalo fuera del repo de la skill y apuntá el revisor ahí:

  mkdir -p /tmp/pw && cd /tmp/pw && npm init -y && npm i playwright
  npx playwright install chromium
  PLAYWRIGHT_DIR=/tmp/pw/node_modules/playwright node <ruta>/scripts/revisar.mjs <url|archivo.html>

(o corré el revisor parado en /tmp/pw: lo encuentra solo)`);
  process.exit(3);
}

/* ───────────── análisis dentro de la página ───────────── */
// Se serializa y corre en el navegador: no puede usar nada de afuera.
function analizar(o) {
  const vw = innerWidth;
  const res = {};
  const ESCALA_LETRA = [11, 12, 13, 14, 16, 20, 24, 32, 40];
  const ESCALA_RADIO = [7, 8, 9, 10, 11, 12, 16, 20, 24, 26];
  const ICONOS = /phosphor|icon|material|fontawesome|font awesome|lucide/i;

  /* utilidades */
  const cv = Object.assign(document.createElement('canvas'), { width: 1, height: 1 });
  const cx = cv.getContext('2d', { willReadFrequently: true });
  const cacheColor = new Map();
  function color(str) {
    if (!str || str === 'transparent' || str === 'none') return [0, 0, 0, 0];
    if (cacheColor.has(str)) return cacheColor.get(str);
    cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = str; cx.fillRect(0, 0, 1, 1);
    const d = cx.getImageData(0, 0, 1, 1).data, c = [d[0], d[1], d[2], d[3] / 255];
    cacheColor.set(str, c); return c;
  }
  const sobre = (a, b) => { const al = a[3] + b[3] * (1 - a[3]); if (!al) return [0, 0, 0, 0]; return [0, 1, 2].map(i => (a[i] * a[3] + b[i] * b[3] * (1 - a[3])) / al).concat(al); };
  const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const hex = c => '#' + c.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
  const satur = c => { const [r, g, b] = c.slice(0, 3).map(v => v / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; return mx === mn ? 0 : (mx - mn) / (1 - Math.abs(2 * l - 1)); };
  const enSvg = el => !!el.closest('svg');

  function opacidad(el) { let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity); return o; }
  function visible(el) {
    if (!el.getClientRects().length) return false;
    const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false;
    const s = getComputedStyle(el); if (s.visibility === 'hidden' || s.visibility === 'collapse') return false;
    if (r.bottom < -2000 || r.right < -500 || r.left > vw + 2000) return false;
    return opacidad(el) > 0.05;
  }
  function sel(el) {
    const partes = [];
    for (let e = el, i = 0; e && e.nodeType === 1 && i < 4; e = e.parentElement, i++) {
      if (e.id) { partes.unshift('#' + CSS.escape(e.id)); break; }
      if (e === document.body) { partes.unshift('body'); break; }
      let s = e.tagName.toLowerCase();
      const cls = [...e.classList].filter(c => !/^(on|ver|ok|activo|active|hecho)$/.test(c)).slice(0, 2);
      if (cls.length) s += '.' + cls.map(c => CSS.escape(c)).join('.');
      const p = e.parentElement;
      if (p && !cls.length) { const her = [...p.children].filter(x => x.tagName === e.tagName); if (her.length > 1) s += `:nth-of-type(${her.indexOf(e) + 1})`; }
      partes.unshift(s);
    }
    return partes.join(' > ');
  }
  const firma = el => el.tagName.toLowerCase() + [...el.classList].filter(c => !/^(on|ver|ok|activo|active|hecho)$/.test(c)).slice(0, 2).map(c => '.' + c).join('');
  const textoPropio = el => [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').replace(/\s+/g, ' ').trim();
  const recorte = t => (t.length > 48 ? t.slice(0, 46) + '…' : t);
  const primeraFamilia = f => f.split(',')[0].trim().replace(/^["']|["']$/g, '');

  /* fondo efectivo: compone capas hacia arriba hasta una opaca */
  function fondo(el) {
    const capas = []; let aprox = false, imagen = false;
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      const s = getComputedStyle(e);
      const bi = s.backgroundImage;
      if (bi && bi !== 'none') {
        if (/url\(/.test(bi)) { imagen = true; break; }
        const cols = (bi.match(/(rgba?|oklch|oklab|lab|lch|color|hsla?)\([^()]*(\([^()]*\)[^()]*)*\)|#[0-9a-f]{3,8}\b/gi) || []).map(color).filter(c => c[3] > 0.25);
        if (cols.length) { const m = [0, 1, 2, 3].map(i => cols.reduce((a, c) => a + c[i], 0) / cols.length); capas.push(m); aprox = true; }
      }
      const bc = color(s.backgroundColor);
      if (bc[3] > 0) capas.push(bc);
      if (capas.length && capas[capas.length - 1][3] >= 0.999) break;
    }
    let r = [255, 255, 255, 1];
    for (let i = capas.length - 1; i >= 0; i--) r = sobre(capas[i], r);
    return { c: [...r.slice(0, 3), 1], aprox, imagen };
  }

  /* ── recolectar elementos ── */
  const todos = [...document.body.querySelectorAll('*')].filter(el => !/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|HEAD|META|LINK|BR)$/.test(el.tagName));
  const vis = todos.filter(el => !enSvg(el) && visible(el));
  const conTexto = vis.filter(el => textoPropio(el).length > 0 && !ICONOS.test(getComputedStyle(el).fontFamily));

  const SEMANTICO = 'a[href],button,input:not([type=hidden]),select,textarea,summary,[role=button],[role=link],[role=tab],[role=checkbox],[role=switch],[role=menuitem],[onclick],[tabindex]:not([tabindex="-1"])';
  const clickeables = vis.filter(el => {
    if (el.disabled || el.getAttribute('aria-disabled') === 'true') return false;
    if (el.matches(SEMANTICO)) return true;
    if (getComputedStyle(el).cursor !== 'pointer') return false;
    const p = el.parentElement;
    if (p && getComputedStyle(p).cursor === 'pointer') return false; // cursor se hereda: quedarse con el de más afuera
    if (el.closest(SEMANTICO)) return false; // ya está adentro de un botón o enlace
    return true;
  });

  /* ── 1. botones rellenos ── */
  if (o.pasada === 'principal') {
    const botones = vis.filter(el => el.matches('button,[role=button],input[type=submit],input[type=button],a[class*=btn],a[class*=boton],a[class*=button]'));
    const rellenos = [], chicos = [];
    for (const b of botones) {
      const s = getComputedStyle(b), bc = color(s.backgroundColor);
      const bi = s.backgroundImage && s.backgroundImage !== 'none' && !/url\(/.test(s.backgroundImage);
      if (bc[3] < 0.5 && !bi) continue;
      const propio = bi ? fondo(b).c : sobre(bc, fondo(b.parentElement).c);
      const debajo = fondo(b.parentElement).c;
      if (ratio(propio, debajo) < 2.2) continue; // blanco sobre blanco, pastilla de segmentado: no es relleno
      const r = b.getBoundingClientRect();
      const item = { selector: sel(b), texto: recorte(b.innerText.trim() || b.getAttribute('aria-label') || ''), alto: Math.round(r.height), color: hex(propio) };
      (r.height >= 32 ? rellenos : chicos).push(item);
    }
    res.rellenos = rellenos; res.rellenosChicos = chicos;
  }

  /* ── 2. fuentes ── */
  if (o.pasada === 'principal') {
    const uso = new Map(), titulos = new Map();
    let cuerpo = null, max = 0;
    for (const el of conTexto) {
      const s = getComputedStyle(el), fam = primeraFamilia(s.fontFamily), n = textoPropio(el).length, fs = parseFloat(s.fontSize);
      uso.set(fam, (uso.get(fam) || 0) + n);
      if (fs >= 20 || /^H[12]$/.test(el.tagName)) titulos.set(fam, (titulos.get(fam) || 0) + n);
    }
    for (const [f, n] of uso) if (n > max) { max = n; cuerpo = f; }
    const cargadas = new Set([...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replace(/^["']|["']$/g, '')));
    const declaradas = new Set([...document.fonts].map(f => f.family.replace(/^["']|["']$/g, '')));
    const esMono = f => /mono|code|courier|consolas|menlo/i.test(f);
    res.fuentes = {
      uso: [...uso].sort((a, b) => b[1] - a[1]).map(([familia, caracteres]) => ({ familia, caracteres, cargada: cargadas.has(familia) || !declaradas.has(familia) })),
      cuerpo,
      display: [...titulos].filter(([f]) => f !== cuerpo && !esMono(f)).sort((a, b) => b[1] - a[1]).map(([f]) => f)[0] || null,
      familiasTexto: [...uso.keys()].filter(f => !esMono(f)),
      noCargadas: [...declaradas].filter(f => !cargadas.has(f) && uso.has(f)),
    };
  }

  /* ── 3. radios ── */
  if (o.pasada === 'principal') {
    const fuera = new Map();
    for (const el of vis) {
      const s = getComputedStyle(el), r = el.getBoundingClientRect();
      const esquinas = [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomRightRadius, s.borderBottomLeftRadius];
      const lado = Math.min(r.width, r.height);
      let rad = 0;
      for (const e of esquinas) {
        const v = e.split(' ')[0];
        const px = v.endsWith('%') ? (parseFloat(v) / 100) * lado : parseFloat(v);
        if (px > rad) rad = px;
      }
      if (!rad) continue;
      if (rad >= lado / 2 - 1) continue;                   // redondo o píldora
      if (rad <= 6 && lado <= 24) continue;                 // rayitas, ticks, kbd, marcas chicas
      const red = Math.round(rad * 2) / 2;
      if (ESCALA_RADIO.includes(red)) continue;
      const sugerido = ESCALA_RADIO.reduce((a, b) => (Math.abs(b - red) < Math.abs(a - red) ? b : a));
      const k = red;
      if (!fuera.has(k)) fuera.set(k, { radio: red, sugerido, cantidad: 0, ejemplos: [] });
      const g = fuera.get(k); g.cantidad++; if (g.ejemplos.length < 3) g.ejemplos.push(sel(el));
    }
    res.radios = [...fuera.values()].sort((a, b) => b.cantidad - a.cantidad);
  }

  /* ── 4. contraste AA ── */
  if (o.pasada === 'principal') {
    const pares = new Map(); let sobreImagen = 0, revisados = 0;
    for (const el of conTexto) {
      if (el.closest('[disabled],[aria-disabled=true]')) continue;
      const s = getComputedStyle(el);
      const f = fondo(el);
      if (f.imagen) { sobreImagen++; continue; }
      const tc = color(s.color); if (!tc[3]) continue;
      const op = opacidad(el);
      const texto = sobre([...tc.slice(0, 3), tc[3] * op], f.c);
      const r = ratio(texto, f.c);
      const fs = parseFloat(s.fontSize), peso = parseInt(s.fontWeight, 10) || 400;
      const grande = fs >= 24 || (fs >= 18.66 && peso >= 700);
      const pide = grande ? 3 : 4.5;
      revisados++;
      if (r + 0.005 >= pide) continue;
      const k = `${hex(texto)}|${hex(f.c)}|${grande}`;
      if (!pares.has(k)) pares.set(k, { texto: hex(texto), fondo: hex(f.c), ratio: Math.round(r * 100) / 100, pide, grande, aprox: f.aprox, cantidad: 0, ejemplos: [] });
      const g = pares.get(k); g.cantidad++; if (g.ejemplos.length < 3) g.ejemplos.push(`${sel(el)}  «${recorte(textoPropio(el))}»`);
    }
    res.contraste = { revisados, sobreImagen, pares: [...pares.values()].sort((a, b) => a.ratio - b.ratio) };
  }

  /* ── 5. toques chicos (pasada celular) ── */
  if (o.pasada === 'celular') {
    const chicos = new Map();
    for (const el of clickeables) {
      if (el.matches('input[type=hidden]')) continue;
      const r = el.getBoundingClientRect();
      if (r.width >= 44 && r.height >= 44) continue;
      // enlace dentro de un párrafo: excepción de WCAG para texto en línea
      if (el.tagName === 'A' && getComputedStyle(el).display === 'inline' && el.parentElement && el.parentElement.innerText.trim().length > el.innerText.trim().length + 12) continue;
      // casilla o radio con su etiqueta clickeable grande
      if (el.matches('input[type=checkbox],input[type=radio]') && el.closest('label') && el.closest('label').getBoundingClientRect().height >= 44) continue;
      const k = firma(el);
      if (!chicos.has(k)) chicos.set(k, { firma: k, cantidad: 0, medida: `${Math.round(r.width)}×${Math.round(r.height)}`, ejemplos: [] });
      const g = chicos.get(k); g.cantidad++; if (g.ejemplos.length < 2) g.ejemplos.push(sel(el));
    }
    res.toques = [...chicos.values()].sort((a, b) => b.cantidad - a.cantidad);

    /* ── 11. desborde horizontal ── */
    const de = document.documentElement;
    const ancho = Math.max(de.scrollWidth, document.body.scrollWidth);
    const recorta = el => { for (let e = el.parentElement; e && e !== document.body && e !== de; e = e.parentElement) { const s = getComputedStyle(e); if (s.overflowX !== 'visible' || s.overflow === 'hidden' || s.overflow === 'clip') return true; } return false; };
    const culpables = vis.filter(el => {
      const r = el.getBoundingClientRect();
      if (!(r.right > vw + 1 || r.left < -1)) return false;
      if (getComputedStyle(el).position === 'fixed') return false;
      return !recorta(el);
    });
    const externos = culpables.filter(el => !culpables.some(p => p !== el && p.contains(el)));
    const bodyOculta = ['hidden', 'clip'].includes(getComputedStyle(document.body).overflowX) || ['hidden', 'clip'].includes(getComputedStyle(de).overflowX);
    res.desborde = { anchoPagina: ancho, ventana: vw, hay: ancho > vw + 1, tapado: ancho <= vw + 1 && bodyOculta && externos.length > 0,
      culpables: externos.slice(0, 8).map(el => { const r = el.getBoundingClientRect(); return { selector: sel(el), sobra: Math.round(Math.max(r.right - vw, -r.left)) }; }) };
  }

  /* ── 6. estado solo con color ── */
  if (o.pasada === 'principal') {
    const solo = [];
    for (const el of vis) {
      if (el.children.length && el.innerText.trim()) continue;
      const s = getComputedStyle(el), r = el.getBoundingClientRect(), bc = color(s.backgroundColor);
      const porClase = /(^|[-_ ])(chip|pill|badge|pastilla|estado|status|dot|punto)([-_ ]|$)/i.test(typeof el.className === 'string' ? el.className : '');
      const punto = r.width <= 12 && r.height <= 12 && Math.abs(r.width - r.height) <= 2 && parseFloat(s.borderTopLeftRadius) >= Math.min(r.width, r.height) / 2 - 1 && bc[3] > 0.5 && satur(bc) > 0.3;
      if (!porClase && !punto) continue;
      if (el.innerText.trim() || el.getAttribute('aria-label') || el.getAttribute('title') || el.querySelector('[aria-label],img[alt]:not([alt=""])')) continue;
      if (porClase && !(bc[3] > 0.3 && satur(bc) > 0.2) && !punto) continue;
      const conNombre = e => e && (e.innerText.trim() || e.getAttribute('aria-label') || e.getAttribute('title'));
      const boton = clickeables.find(c => c !== el && c.contains(el));
      if (boton) { if (conNombre(boton)) continue; }           // punto de aviso sobre un botón: el botón tiene que decirlo
      else if (conNombre(el.parentElement) || conNombre(el.parentElement?.parentElement)) continue; // barra o rayita al lado de su cifra
      solo.push({ selector: sel(el), color: hex(bc), medida: `${Math.round(r.width)}×${Math.round(r.height)}` });
    }
    res.soloColor = solo;
  }

  /* ── 7. montos sin tabular-nums ── */
  if (o.pasada === 'principal') {
    const MONTO = /(US\$|U\$S|\$|€|£|R\$|ARS|USD)\s?[\d.,]*\d|\d{1,3}(\.\d{3})+(,\d+)?|\d+,\d+|\d\s?%/;
    const sinTab = new Map();
    for (const el of conTexto) {
      const t = textoPropio(el);
      if (t.length > 80) continue;
      const s = getComputedStyle(el), fs = parseFloat(s.fontSize);
      const cifra = /^[+\-−]?\s?[\d.,]+$/.test(t) && fs >= 20;
      if (!MONTO.test(t) && !cifra) continue;
      if (/tabular-nums/.test(s.fontVariantNumeric) || /mono/i.test(s.fontFamily)) continue;
      const k = firma(el);
      if (!sinTab.has(k)) sinTab.set(k, { firma: k, cantidad: 0, ejemplos: [], pisado: false });
      const g = sinTab.get(k); g.cantidad++; if (el.closest('.num,[class*="tabular"]')) g.pisado = true; if (g.ejemplos.length < 2) g.ejemplos.push(`${sel(el)}  «${recorte(t)}»`);
    }
    res.tabular = [...sinTab.values()].sort((a, b) => b.cantidad - a.cantidad);
  }

  /* ── 8. imágenes sin alt ── */
  if (o.pasada === 'principal') {
    res.sinAlt = [...document.querySelectorAll('img:not([alt]),input[type=image]:not([alt])')].filter(visible).map(el => ({ selector: sel(el), src: recorte((el.getAttribute('src') || '').split('/').pop()) }));
  }

  /* ── 9. botones de ícono sin nombre ── */
  if (o.pasada === 'principal') {
    const sinNombre = new Map();
    for (const el of clickeables) {
      if (el.matches('input:not([type=button]):not([type=submit]):not([type=image]),select,textarea')) continue;
      if (el.innerText.replace(/[\s​]/g, '')) continue;
      if (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.getAttribute('title')) continue;
      if (el.querySelector('img[alt]:not([alt=""]),[aria-label],svg title')) continue;
      if (el.tagName === 'INPUT' && el.value) continue;
      if (el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`)) continue;
      const k = firma(el);
      if (!sinNombre.has(k)) sinNombre.set(k, { firma: k, cantidad: 0, ejemplos: [], icono: (el.querySelector('[class*="ph-"]')?.className.match(/ph-[\w-]+/g) || []).filter(c => c !== 'ph-fill').pop() || null });
      const g = sinNombre.get(k); g.cantidad++; if (g.ejemplos.length < 2) g.ejemplos.push(sel(el));
    }
    res.sinNombre = [...sinNombre.values()];

    /* clickeable que no es botón ni enlace: no llega el teclado */
    const sinTeclado = new Map();
    for (const el of clickeables) {
      if (el.matches(SEMANTICO.replace('[onclick],', ''))) continue;
      if (el.closest('a[href],button,[role=button],[role=link]')) continue;
      const k = firma(el);
      if (!sinTeclado.has(k)) sinTeclado.set(k, { firma: k, cantidad: 0, ejemplos: [] });
      const g = sinTeclado.get(k); g.cantidad++; if (g.ejemplos.length < 2) g.ejemplos.push(sel(el));
    }
    res.sinTeclado = [...sinTeclado.values()].sort((a, b) => b.cantidad - a.cantidad);
  }

  /* ── 10. tamaños de letra ── */
  if (o.pasada === 'principal') {
    const fuera = new Map();
    for (const el of conTexto) {
      const fs = Math.round(parseFloat(getComputedStyle(el).fontSize) * 100) / 100;
      if (ESCALA_LETRA.includes(fs) || (fs >= 36 && fs <= 44 && Number.isInteger(fs))) continue;
      if (!fuera.has(fs)) fuera.set(fs, { tamano: fs, sugerido: ESCALA_LETRA.reduce((a, b) => (Math.abs(b - fs) < Math.abs(a - fs) ? b : a)), cantidad: 0, ejemplos: [] });
      const g = fuera.get(fs); g.cantidad++; if (g.ejemplos.length < 2) g.ejemplos.push(`${sel(el)}  «${recorte(textoPropio(el))}»`);
    }
    res.letras = [...fuera.values()].sort((a, b) => b.cantidad - a.cantidad);
    res.totalTextos = conTexto.length;
  }

  /* ── 12. simetría y alineación ── */
  if (o.pasada === 'principal') {
    const S = { alturas: [], pies: [], padding: new Map(), iconos: new Map(), bordes: [], anchos: [], subpixel: { cantidad: 0, total: 0, ejemplos: [] }, dobles: [] };
    const r1 = v => Math.round(v * 10) / 10;
    const enFlujo = el => { const p = getComputedStyle(el).position; return p !== 'absolute' && p !== 'fixed'; };
    const hijosVis = el => [...el.children].filter(c => !enSvg(c) && visible(c) && enFlujo(c) && !/^(SCRIPT|STYLE|TEMPLATE|BR)$/.test(c.tagName));
    const tieneCaja = el => {
      const s = getComputedStyle(el);
      if (color(s.backgroundColor)[3] > 0.05) return true;
      if (s.backgroundImage && s.backgroundImage !== 'none') return true;
      if (s.boxShadow && s.boxShadow !== 'none' && !/inset/.test(s.boxShadow)) return true;
      return ['Top', 'Right', 'Bottom', 'Left'].some(l => parseFloat(s['border' + l + 'Width']) >= 1 && s['border' + l + 'Style'] !== 'none' && color(s['border' + l + 'Color'])[3] > 0.1);
    };
    // para bordes izquierdos: un divisor (solo borde arriba o abajo) no es un borde que se vea a la izquierda
    const cajaIzq = el => {
      const s = getComputedStyle(el);
      if (color(s.backgroundColor)[3] > 0.05 || (s.backgroundImage && s.backgroundImage !== 'none')) return true;
      if (s.boxShadow && s.boxShadow !== 'none' && !/inset/.test(s.boxShadow)) return true;
      return parseFloat(s.borderLeftWidth) >= 1 && s.borderLeftStyle !== 'none' && color(s.borderLeftColor)[3] > 0.1;
    };
    const CLASE_TARJETA = /(^|[-_ ])(card|tarjeta|kpi|bandeja|panel|tile|caja|bloque|metrica|stat)s?([-_ ]|$)/i;
    const claseDe = el => (typeof el.className === 'string' ? el.className : '');
    const esTarjeta = el => { const r = el.getBoundingClientRect(); return r.width >= 120 && r.height >= 56 && (tieneCaja(el) || CLASE_TARJETA.test(claseDe(el))); };

    /* a) hermanos de una misma fila: mismo alto y pies a la misma altura */
    const contenedores = vis.filter(el => { const s = getComputedStyle(el); return (s.display.includes('grid') || (s.display.includes('flex') && !s.flexDirection.startsWith('column'))); });
    for (const p of contenedores) {
      const hijos = hijosVis(p).filter(esTarjeta);
      if (hijos.length < 2) continue;
      // agrupar por fila (top casi igual) y por clase (mismo tipo de pieza)
      const filas = [];
      for (const h of hijos) {
        const r = h.getBoundingClientRect(), f = firma(h);
        let g = filas.find(x => Math.abs(x.top - r.top) <= 2 && x.firma === f);
        if (!g) filas.push(g = { top: r.top, firma: f, items: [] });
        g.items.push(h);
      }
      for (const g of filas) {
        if (g.items.length < 2) continue;
        const rs = g.items.map(h => h.getBoundingClientRect());
        if (rs.some(r => r.height > 520)) continue; // columnas de kanban, paneles largos: su alto depende del contenido
        const altos = rs.map(r => r.height), dif = Math.max(...altos) - Math.min(...altos);
        if (dif > 2) S.alturas.push({ selector: sel(p) + ' > ' + g.firma, cantidad: g.items.length, dif: r1(dif), altos: altos.map(Math.round) });
        else {
          // mismo alto: ¿el último hijo (pie) cae a la misma altura en todos?
          const ult = g.items.map(h => { const hs = hijosVis(h); return hs.length >= 2 ? hs[hs.length - 1] : null; });
          const tipo = e => e.tagName + '.' + (e.classList[0] || ''); // mismo tipo de pie aunque cambie el estado (.baja, .ok)
          if (ult.some(u => !u) || new Set(ult.map(tipo)).size > 1) continue;
          // un pie que empieza a la misma altura (y crece hacia abajo) o termina a la misma altura (margin-top:auto) está bien
          const ru = ult.map(u => u.getBoundingClientRect());
          const bajos = ru.map((u, i) => rs[i].bottom - u.bottom), altosP = ru.map((u, i) => u.top - rs[i].top);
          const difP = Math.min(Math.max(...bajos) - Math.min(...bajos), Math.max(...altosP) - Math.min(...altosP));
          if (difP > 2) S.pies.push({ selector: sel(p) + ' > ' + g.firma + ' > ' + firma(ult[0]), cantidad: g.items.length, dif: r1(difP) });
        }
      }
    }

    /* b) padding asimétrico en botones, pastillas y tarjetas */
    const PASTILLA = /(^|[-_ ])(chip|pill|badge|pastilla|tag|etiqueta|btn|boton|button)s?([-_ ]|$)/i;
    for (const el of vis) {
      const rb = el.getBoundingClientRect();
      const esBoton = (el.matches('button,[role=button],a[class*=btn],a[class*=boton]') || PASTILLA.test(claseDe(el))) && rb.height <= 48;
      const tarjeta = !esBoton && CLASE_TARJETA.test(claseDe(el)) && esTarjeta(el);
      if (!esBoton && !tarjeta) continue;
      if (!tieneCaja(el)) continue;                    // sin fondo ni borde el padding no se ve
      if (esBoton && !el.innerText.trim()) continue; // botón de solo ícono: lo cubre el centro de íconos
      const s = getComputedStyle(el);
      const pt = parseFloat(s.paddingTop), pb = parseFloat(s.paddingBottom), pl = parseFloat(s.paddingLeft), pr = parseFloat(s.paddingRight);
      const apilado = s.display.includes('flex') && s.flexDirection.startsWith('column'); // número con punto abajo, ícono sobre rótulo
      let dv = apilado ? 0 : Math.abs(pt - pb), dh = Math.abs(pl - pr);
      if (tarjeta) { if (!Math.min(pt, pb)) dv = 0; if (!Math.min(pl, pr)) dh = 0; } // tarjeta de lista: las filas llevan su padding
      let malo = dv > 1 || dh > 1;
      if (malo && esBoton && dv <= 1) {
        // gráfico a un lado: el ícono (12/14) o el avatar de una pastilla de persona (3/10) compensan su peso visual
        const primero = el.firstElementChild, ultimo = el.lastElementChild;
        const ic = e => e && (e.matches('svg,img,i[class*="ph"],[class*="icon"],[class*="ico"],[class*="av"]') || (!!e.querySelector?.('svg,img,i[class*="ph"]') && !e.innerText.trim()));
        const avatar = e => e && e.getBoundingClientRect().height >= rb.height * 0.6 && parseFloat(getComputedStyle(e).borderTopLeftRadius) >= e.getBoundingClientRect().height / 2 - 1;
        const lado = (ic(primero) && pl < pr && primero) || (ic(ultimo) && pr < pl && ultimo);
        if (lado && (dh <= 4 || (avatar(lado) && dh <= 10))) malo = false;
      }
      if (!malo) continue;
      const k = firma(el);
      if (!S.padding.has(k)) S.padding.set(k, { firma: k, cantidad: 0, medida: `${pt} ${pr} ${pb} ${pl}`, ejemplos: [] });
      const g = S.padding.get(k); g.cantidad++; if (g.ejemplos.length < 2) g.ejemplos.push(sel(el));
    }

    /* c) ícono descentrado en su cuadro de 24–48 */
    const iconos = [...document.querySelectorAll('svg, i[class*="ph"]')].filter(el => !(el.tagName === 'svg' && el.parentElement?.closest('svg')) && visible(el));
    for (const ic of iconos) {
      const p = ic.parentElement; if (!p) continue;
      const rp = p.getBoundingClientRect();
      if (rp.width < 24 || rp.width > 48 || Math.abs(rp.width - rp.height) > 1) continue;
      if (p.innerText.trim()) continue; // con texto adentro no es un cuadro de ícono
      if (hijosVis(p).length !== 1) continue;
      const ri = ic.getBoundingClientRect();
      if (ri.width < 8 || ri.width > rp.width - 4) continue; // ícono que llena el cuadro: es la pieza, no algo centrado
      const ps = getComputedStyle(p);
      const cx = (rp.left + parseFloat(ps.borderLeftWidth) + rp.right - parseFloat(ps.borderRightWidth)) / 2;
      const cy = (rp.top + parseFloat(ps.borderTopWidth) + rp.bottom - parseFloat(ps.borderBottomWidth)) / 2;
      const dx = (ri.left + ri.right) / 2 - cx, dy = (ri.top + ri.bottom) / 2 - cy;
      if (Math.max(Math.abs(dx), Math.abs(dy)) <= 1.5) continue;
      const k = firma(p) + ' > ' + firma(ic);
      if (!S.iconos.has(k)) S.iconos.set(k, { firma: k, cantidad: 0, desvio: `${r1(dx)}, ${r1(dy)}`, ejemplos: [] });
      const g = S.iconos.get(k); g.cantidad++; if (g.ejemplos.length < 2) g.ejemplos.push(sel(ic));
    }

    /* d) bordes izquierdos casi alineados (1–6 px) entre bloques apilados */
    // borde izquierdo visual: la caja si tiene fondo o borde; si no, el primer texto o ícono. {x, caja}
    function izqVisual(el, prof = 0) {
      const r = el.getBoundingClientRect(), s = getComputedStyle(el);
      if (parseFloat(s.marginLeft) < 0 && prof > 0) return null;               // ícono colgado a propósito (asa de arrastre)
      if (prof > 0 && cajaIzq(el)) return { x: r.left, caja: true };
      if (el.matches('svg,i[class*="ph"]')) return { x: r.left, caja: false };                 // un ícono se lee como texto
      if (el.matches('img,input,select,textarea,canvas,video')) return { x: r.left, caja: true };
      if (prof > 0 && /center|right|end/.test(s.textAlign) && !s.display.includes('flex') && !s.display.includes('grid')) return null;
      if ((s.display.includes('flex') && !s.flexDirection.startsWith('column') || s.display.includes('grid')) && /center|end|right/.test(s.justifyContent)) return null;
      let mejor = null;
      const sumar = v => { if (v && (!mejor || v.x < mejor.x)) mejor = v; };
      for (const n of el.childNodes) {
        if (n.nodeType === 3 && n.textContent.trim()) {
          const rg = document.createRange(); rg.selectNodeContents(n);
          for (const rr of rg.getClientRects()) if (rr.width > 0) { sumar({ x: rr.left, caja: false }); break; }
        } else if (n.nodeType === 1 && !enSvg(n) && visible(n) && enFlujo(n)) {
          sumar(prof >= 5 ? { x: n.getBoundingClientRect().left, caja: true } : izqVisual(n, prof + 1));
        }
      }
      return mejor;
    }
    const desenvolver = el => { let e = el; for (let i = 0; i < 4; i++) { const hs = hijosVis(e); if (hs.length === 1 && !tieneCaja(hs[0])) e = hs[0]; else break; } return e; };
    const main = document.querySelector('main,[role=main]') || document.querySelector('.contenido,.principal,.pag,.pagina,.page');
    const raices = new Set();
    if (main && visible(main)) raices.add(desenvolver(main));
    for (const el of vis) if (tieneCaja(el) && CLASE_TARJETA.test(claseDe(el)) && el.getBoundingClientRect().width >= 200) raices.add(desenvolver(el));
    for (const raiz of raices) {
      const s = getComputedStyle(raiz);
      if (s.display.includes('flex') && !s.flexDirection.startsWith('column')) continue;
      if (s.display.includes('grid') && s.gridTemplateColumns.split(' ').length > 1) continue;
      // cada bloque aporta su caja (si la tiene) y su primer texto o ícono (si no es otra caja)
      const bloques = hijosVis(raiz).map(h => {
        const r = h.getBoundingClientRect(), xs = [];
        if (cajaIzq(h)) xs.push(r.left);
        const v = izqVisual(h, 0); if (v && (!v.caja || !cajaIzq(h))) xs.push(v.x);
        return { h, r, xs };
      }).filter(b => b.xs.length && b.r.width > 40);
      const vistos = new Set();
      for (let i = 0; i < bloques.length; i++) for (let j = i + 1; j < bloques.length; j++) {
        const a = bloques[i], b = bloques[j];
        if (!(a.r.bottom <= b.r.top + 1 || b.r.bottom <= a.r.top + 1)) continue; // solo apilados
        let d = Infinity, xa = 0, xb = 0;
        for (const p of a.xs) for (const q of b.xs) { const k = Math.abs(p - q); if (k < d) { d = k; xa = p; xb = q; } }
        if (d <= 1 || d > 6) continue; // 1 px es el borde de una caja: se tolera
        const k = firma(a.h) + '|' + firma(b.h); if (vistos.has(k)) continue; vistos.add(k);
        S.bordes.push({ selector: `${sel(a.h)} (x ${r1(xa)})  ↔  ${firma(b.h)} (x ${r1(xb)})`, dif: r1(d) });
      }
    }

    /* d2) botones hermanos que llenan la fila con anchos distintos */
    for (const p of contenedores) {
      const bs = hijosVis(p);
      if (bs.length < 2 || bs.length > 4 || !bs.every(b => b.matches('button,a,[role=button]') && tieneCaja(b) && b.getBoundingClientRect().height >= 28)) continue;
      const ps = getComputedStyle(p), rp = p.getBoundingClientRect(), rs = bs.map(b => b.getBoundingClientRect());
      if (rs.some(r => Math.abs(r.top - rs[0].top) > 2)) continue;
      const izq = rp.left + parseFloat(ps.borderLeftWidth) + parseFloat(ps.paddingLeft), der = rp.right - parseFloat(ps.borderRightWidth) - parseFloat(ps.paddingRight);
      if (Math.abs(rs[0].left - izq) > 1 || Math.abs(rs[rs.length - 1].right - der) > 1) continue; // no llenan la fila: alineados a un lado está bien
      // tienen que estar estirados (grid, o flex con flex-grow): si cada botón mide lo que su texto, el ancho distinto es natural
      const estirado = ps.display.includes('grid') ? bs.every(b => /auto|normal|stretch/.test(getComputedStyle(b).justifySelf) && /normal|stretch|legacy/.test(ps.justifyItems))
        : bs.every(b => parseFloat(getComputedStyle(b).flexGrow) > 0);
      if (!estirado) continue;
      const an = rs.map(r => r.width), dif = Math.max(...an) - Math.min(...an);
      if (dif > 2) S.anchos.push({ selector: sel(p), dif: r1(dif), anchos: an.map(Math.round) });
    }

    /* e) bordes de 1 px duplicados entre hermanos pegados */
    for (const p of contenedores) {
      const hs = hijosVis(p); if (hs.length < 2) continue;
      for (let i = 0; i + 1 < hs.length; i++) {
        const a = hs[i], b = hs[i + 1], ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(), sa = getComputedStyle(a), sb = getComputedStyle(b);
        const borde = (s, l) => parseFloat(s['border' + l + 'Width']) >= 1 && s['border' + l + 'Style'] !== 'none' && color(s['border' + l + 'Color'])[3] > 0.1;
        const pegadosX = Math.abs(ra.right - rb.left) < 0.5 && Math.abs(ra.top - rb.top) < 2 && borde(sa, 'Right') && borde(sb, 'Left');
        const pegadosY = Math.abs(ra.bottom - rb.top) < 0.5 && Math.abs(ra.left - rb.left) < 2 && borde(sa, 'Bottom') && borde(sb, 'Top');
        if (pegadosX || pegadosY) { S.dobles.push({ selector: sel(a) + '  +  ' + firma(b) }); break; }
      }
    }

    /* f) subpíxeles en piezas con borde de 1 px (borde borroso) */
    for (const el of vis) {
      const s = getComputedStyle(el);
      if (!['Top', 'Left'].some(l => parseFloat(s['border' + l + 'Width']) === 1 && s['border' + l + 'Style'] !== 'none' && color(s['border' + l + 'Color'])[3] > 0.1)) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 16 || r.height < 16) continue;
      S.subpixel.total++;
      const frac = v => Math.abs(v - Math.round(v)) > 0.2;
      // Chromium ajusta los bordes al píxel salvo cuando hay un transform con decimales (translate(-50%) sobre un ancho impar)
      const conTransform = [el, el.parentElement].some(e => { const t = e && getComputedStyle(e).transform; return t && t !== 'none' && !/^matrix\(1, 0, 0, 1, 0, 0\)$/.test(t); });
      if (conTransform && (frac(r.top + scrollY) || frac(r.left))) { S.subpixel.cantidad++; if (S.subpixel.ejemplos.length < 3) S.subpixel.ejemplos.push(`${sel(el)} (${r1(r.left)}, ${r1(r.top + scrollY)})`); }
    }

    res.simetria = { ...S, padding: [...S.padding.values()], iconos: [...S.iconos.values()] };
  }
  return res;
}

/* ───────────── correr ───────────── */
const mod = await cargarPlaywright();
const pw = mod.chromium ? mod : mod.default;
let navegador;
try { navegador = await pw.chromium.launch(); }
catch (e1) {
  try { navegador = await pw.chromium.launch({ channel: 'chrome' }); }
  catch {
    console.error(`No pude abrir Chromium.\n${String(e1.message).split('\n')[0]}\n\nInstalalo con:  npx playwright install chromium`);
    process.exit(3);
  }
}

async function pasada(tipo, ancho, alto, movil) {
  const ctx = await navegador.newContext({
    viewport: { width: ancho, height: alto }, deviceScaleFactor: movil ? 2 : 1, isMobile: movil, hasTouch: movil,
    colorScheme: OSCURO ? 'dark' : 'light', locale: 'es-AR',
  });
  const page = await ctx.newPage();
  const errores = [];
  page.on('pageerror', e => errores.push(String(e.message).split('\n')[0]));
  page.on('console', m => { if (m.type() === 'error') errores.push(m.text().split('\n')[0]); });
  await page.goto(url, { waitUntil: 'load', timeout: 45000 });
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  if (OSCURO) await page.evaluate(() => { document.documentElement.dataset.tema = 'oscuro'; document.documentElement.classList.add('dark'); });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1600); // cuentas, barras y líneas que se dibujan al cargar
  const datos = await page.evaluate(analizar, { pasada: tipo });
  const captura = `/tmp/revisar-${nombre}-${ancho}${OSCURO ? '-oscuro' : ''}.png`;
  await page.screenshot({ path: captura, fullPage: true }).catch(() => {});
  await ctx.close();
  return { ...datos, captura, errores };
}

const principal = await pasada('principal', ANCHO, ALTO, CELULAR);
const cel = await pasada('celular', 390, 844, true);
await navegador.close();

/* ───────────── problemas y nota ───────────── */
const problemas = [];
const add = (nivel, regla, puntos, detalle, sugerencia, ejemplos = []) => problemas.push({ nivel, regla, puntos, detalle, sugerencia, ejemplos });
const tope = (lista, porCada, max) => Math.min(max, lista * porCada);

// 1. botones rellenos
if (principal.rellenos.length > 1 && !GALERIA) {
  add('falla', 'Un solo botón relleno', 10,
    `${principal.rellenos.length} botones rellenos de 32 px o más: ${principal.rellenos.map(b => `«${b.texto}»`).join(', ')}`,
    'Dejá relleno solo el principal (arriba a la derecha). El resto, con borde y sombra mínima (.btn). Las acciones de fila rellenas van chicas (24–28 px).',
    principal.rellenos.map(b => `${b.selector} (${b.alto} px, ${b.color})`));
} else if (!GALERIA && principal.rellenos.length === 0 && principal.rellenosChicos.length === 0) {
  add('aviso', 'Acción principal', 2, 'No hay ningún botón relleno: la pantalla no dice cuál es la acción principal.', 'Si la pantalla tiene una acción principal, rellenala (negro o acento) arriba a la derecha.');
}
if (principal.rellenosChicos.length > 2 && !GALERIA) {
  add('aviso', 'Acciones de fila', 2, `${principal.rellenosChicos.length} botones chicos rellenos a la vista.`, 'Solo se rellena la acción de fila que resuelve una decisión pendiente (Aprobar, Cobrar), como máximo 2 por fila.', principal.rellenosChicos.slice(0, 4).map(b => `${b.selector} «${b.texto}»`));
}

// 2. fuentes
const F = principal.fuentes;
if (F.familiasTexto.length <= 1) add('falla', 'Dos voces tipográficas', 8, `Toda la página usa una sola familia: ${F.cuerpo || '—'}.`, 'Sumá una display (Outfit, General Sans, Satoshi) para títulos y cifras, y dejá Plus Jakarta Sans o Manrope para la interfaz.');
else if (!F.display) add('falla', 'Letra display', 6, `Los títulos y cifras grandes usan la misma familia que el texto (${F.cuerpo}).`, 'Títulos de página a 36–44 px en peso 400 y cifras de KPI en la display (Outfit).');
if (F.familiasTexto.length >= 3) add('aviso', 'Tres o más familias', 5, `Familias de texto: ${F.familiasTexto.join(', ')}.`, 'Quedate con display + interfaz + una mono.');
if (F.noCargadas.length) add('aviso', 'Fuente sin cargar', 4, `Declaradas pero no cargadas: ${F.noCargadas.join(', ')} (se ve la de respaldo).`, 'Revisá el <link> de Google Fonts y los pesos pedidos.');

// 3. radios
if (principal.radios.length) add('aviso', 'Radios fuera de la escala', tope(principal.radios.length, 1, 8),
  principal.radios.map(r => `${r.radio}px ×${r.cantidad} → ${r.sugerido}`).join(' · '),
  'Radios en capas: 26 marco · 20 panel/tarjeta · 16 tarjeta en bandeja · 11–12 control · 7–9 pastilla (24 en celular). Interno ≈ externo − padding.',
  principal.radios.flatMap(r => r.ejemplos.slice(0, 1).map(e => `${r.radio}px  ${e}`)));

// 4. contraste
const malos = principal.contraste.pares.filter(p => p.ratio < 3);
const flojos = principal.contraste.pares.filter(p => p.ratio >= 3);
if (malos.length) add('falla', 'Contraste AA', tope(malos.length, 3, 20),
  malos.map(p => `${p.texto} sobre ${p.fondo} = ${p.ratio}:1 (pide ${p.pide}) ×${p.cantidad}${p.aprox ? ' ~degradé' : ''}`).join(' · '),
  'Subí el gris: texto-2 para lo que hay que leer; texto-3 solo para metadatos y oscurecido hasta 4,5:1 sobre su fondo.',
  malos.flatMap(p => p.ejemplos.slice(0, 2)));
if (flojos.length) add('aviso', 'Contraste justo', tope(flojos.length, 1, 8),
  flojos.map(p => `${p.texto} sobre ${p.fondo} = ${p.ratio}:1 (pide ${p.pide}) ×${p.cantidad}${p.aprox ? ' ~degradé' : ''}`).join(' · '),
  'Entre 3 y 4,5:1 solo pasa en texto grande (24 px o más). Oscurecé el gris o agrandá el texto.',
  flojos.flatMap(p => p.ejemplos.slice(0, 1)));

// 5. toques
if (cel.toques.length) add('falla', 'Toques de 44 px en celular', tope(cel.toques.reduce((a, t) => a + t.cantidad, 0), 0.5, 12),
  cel.toques.map(t => `${t.firma} ${t.medida} ×${t.cantidad}`).join(' · '),
  'A menos de 768 px los botones, íconos y casillas miden 44×44 como mínimo (min-height/min-width o padding; el área se puede agrandar con ::after sin cambiar el dibujo).',
  cel.toques.slice(0, 6).flatMap(t => t.ejemplos.slice(0, 1)));

// 6. solo color
if (principal.soloColor.length) add('falla', 'Estado solo con color', tope(principal.soloColor.length, 3, 9),
  `${principal.soloColor.length} puntos o pastillas de color sin palabra ni etiqueta.`,
  'Pastilla = punto + palabra ("Vencida"). Si es un punto de aviso sobre un ícono, el botón lleva aria-label que lo diga ("Avisos, 3 sin leer").',
  principal.soloColor.slice(0, 5).map(s => `${s.selector} (${s.color}, ${s.medida})`));

// 7. tabular
if (principal.tabular.length) add('aviso', 'Cifras sin tabular-nums', tope(principal.tabular.length, 1, 8),
  principal.tabular.map(t => `${t.firma} ×${t.cantidad}${t.pisado ? ' (tiene .num y igual no es tabular)' : ''}`).join(' · '),
  'Montos, porcentajes y cifras con font-variant-numeric: tabular-nums (clase .num), alineados a la derecha en tablas.' +
    (principal.tabular.some(t => t.pisado) ? ' Ojo: el atajo `font: 500 30px var(--display)` vuelve font-variant-numeric a normal y pisa al .num heredado; poné tabular-nums después del font: o usá font-size/font-weight sueltos.' : ''),
  principal.tabular.slice(0, 6).flatMap(t => t.ejemplos.slice(0, 1)));

// 8. alt
if (principal.sinAlt.length) add('falla', 'Imágenes sin alt', tope(principal.sinAlt.length, 2, 8),
  `${principal.sinAlt.length} <img> sin atributo alt.`, 'alt="" si es decorativa (avatar al lado del nombre); alt con lo que muestra si informa.',
  principal.sinAlt.slice(0, 4).map(i => `${i.selector} (${i.src})`));

// 9. ícono sin nombre
const nSinNombre = principal.sinNombre.reduce((a, t) => a + t.cantidad, 0);
if (nSinNombre) add('falla', 'Botón de ícono sin aria-label', tope(nSinNombre, 2, 10),
  principal.sinNombre.map(t => `${t.firma}${t.icono ? ` (${t.icono})` : ''} ×${t.cantidad}`).join(' · '),
  'Todo botón de solo ícono lleva aria-label y tooltip (title o el tooltip del sistema): aria-label="Avisos".',
  principal.sinNombre.flatMap(t => t.ejemplos.slice(0, 1)));
if (principal.sinTeclado.length) add('aviso', 'Clickeable sin teclado', tope(principal.sinTeclado.length, 1, 6),
  principal.sinTeclado.map(t => `${t.firma} ×${t.cantidad}`).join(' · '),
  'Lo que se clickea es <button> o <a href>. Un <div> con cursor de mano no llega con Tab ni con Enter.',
  principal.sinTeclado.slice(0, 5).flatMap(t => t.ejemplos.slice(0, 1)));

// 10. letras
if (principal.letras.length) add('aviso', 'Tamaños de letra fuera de escala', tope(principal.letras.length, 1, 8),
  principal.letras.map(l => `${l.tamano}px ×${l.cantidad} → ${l.sugerido}`).join(' · '),
  'Escala 11 / 12 / 13 / 14 / 16 / 20 / 24 / 32 / 40 (títulos grandes 36–44). Una tarjeta no mezcla más de 3 tamaños.',
  principal.letras.slice(0, 5).flatMap(l => l.ejemplos.slice(0, 1)));

// 11. desborde
const D = cel.desborde;
if (D.hay) add('falla', 'Desborde horizontal a 390 px', 15,
  `La página mide ${D.anchoPagina} px de ancho en una ventana de ${D.ventana}: aparece scroll de costado.`,
  'A menos de 768 px: una columna, márgenes de 16, grillas a 1fr, textos largos con truncate o min-width:0 en los hijos de flex/grid, tablas pasadas a tarjetas.',
  D.culpables.map(c => `${c.selector} (sobra ${c.sobra} px)`));
else if (D.tapado) add('aviso', 'Contenido cortado a 390 px', 5,
  'No hay scroll de costado porque body/html lo esconde, pero hay elementos que se salen y quedan cortados.',
  'Arreglá el ancho de esos elementos en vez de esconder el desborde.', D.culpables.map(c => `${c.selector} (sobra ${c.sobra} px)`));

// 12. simetría y alineación (aviso; descuento proporcional con tope total de 10)
{
  const Sm = principal.simetria, partes = [];
  const parte = (regla, puntos, detalle, sugerencia, ejemplos) => partes.push({ regla, puntos, detalle, sugerencia, ejemplos });
  if (Sm.alturas.length) parte('Simetría · hermanos de distinto alto', tope(Sm.alturas.length, 1.5, 4),
    Sm.alturas.map(a => `${a.cantidad} piezas en una fila con ${a.dif} px de diferencia (${a.altos.join(' / ')})`).join(' · '),
    'Las tarjetas de una misma fila miden lo mismo: grid con align-items:stretch (el valor por defecto) y sin height fija ni align-items:start en el padre.',
    Sm.alturas.slice(0, 4).map(a => a.selector));
  if (Sm.pies.length) parte('Simetría · pies a distinta altura', tope(Sm.pies.length, 1.5, 3),
    Sm.pies.map(p => `${p.cantidad} tarjetas del mismo alto con el pie corrido ${p.dif} px`).join(' · '),
    'Tarjeta en flex-direction:column y el pie con margin-top:auto; o grid-template-rows:subgrid si las zonas internas tienen que caer a la misma altura.',
    Sm.pies.slice(0, 4).map(p => p.selector));
  if (Sm.padding.length) parte('Simetría · padding asimétrico', tope(Sm.padding.reduce((a, p) => a + p.cantidad, 0), 0.5, 3),
    Sm.padding.map(p => `${p.firma} (${p.medida}) ×${p.cantidad}`).join(' · '),
    'Arriba = abajo e izquierda = derecha. En botones, alto fijo y padding solo lateral; la única excepción es el ícono a un lado (12/14).',
    Sm.padding.slice(0, 4).flatMap(p => p.ejemplos.slice(0, 1)));
  if (Sm.iconos.length) parte('Simetría · ícono descentrado', tope(Sm.iconos.reduce((a, p) => a + p.cantidad, 0), 0.5, 3),
    Sm.iconos.map(i => `${i.firma} corrido (${i.desvio}) px ×${i.cantidad}`).join(' · '),
    'Cuadro con display:grid; place-items:center y el ícono con line-height:1 (o display:block). Tamaños pares: 16 en 32, 18 en 36, 20 en 40.',
    Sm.iconos.slice(0, 4).flatMap(i => i.ejemplos.slice(0, 1)));
  if (Sm.bordes.length) parte('Simetría · bordes casi alineados', tope(Sm.bordes.length, 1, 4),
    Sm.bordes.map(b => `${b.dif} px`).join(' · ') + ' entre bloques apilados que deberían compartir el borde izquierdo.',
    'Un solo borde izquierdo por columna: título, filtros, tarjetas y primera columna de la tabla en la misma x. O alineados, o claramente adentro (16 o más).',
    Sm.bordes.slice(0, 4).map(b => b.selector));
  if (Sm.dobles.length) parte('Simetría · borde de 1 px duplicado', tope(Sm.dobles.length, 1, 2),
    `${Sm.dobles.length} pares de piezas pegadas con borde las dos: se ve una línea de 2 px.`,
    'Borde en un solo lado (border-left:0 en la segunda), gap con divisor, o box-shadow:0 0 0 1px en lugar de border.',
    Sm.dobles.slice(0, 4).map(d => d.selector));
  if (Sm.anchos.length) parte('Simetría · botones de distinto ancho', tope(Sm.anchos.length, 1, 2),
    Sm.anchos.map(a => `${a.anchos.join(' / ')} px (${a.dif} px de diferencia)`).join(' · ') + ': botones que llenan la fila con anchos distintos.',
    'Dos botones que ocupan todo el ancho van iguales (grid-template-columns:1fr 1fr); si no, alineados a la derecha con su ancho natural.',
    Sm.anchos.slice(0, 4).map(a => a.selector));
  if (Sm.subpixel.cantidad) parte('Simetría · bordes en medio píxel', tope(Sm.subpixel.cantidad, 0.5, 1),
    `${Sm.subpixel.cantidad} piezas con borde de 1 px quedan en posiciones con decimales por un transform (el borde se ve borroso).`,
    'Centrá con grid/flex en vez de translate(-50%,-50%), o redondeá la medida (ancho par). Los transform de animación tienen que terminar en valores enteros.',
    Sm.subpixel.ejemplos);
  const suma = partes.reduce((a, p) => a + p.puntos, 0), escala = suma > 10 ? 10 / suma : 1;
  for (const p of partes) add('aviso', p.regla, Math.round(p.puntos * escala * 10) / 10, p.detalle, p.sugerencia, p.ejemplos);
}

// errores de JS
const errs = [...new Set([...principal.errores, ...cel.errores])];
if (errs.length) add('aviso', 'Errores en la consola', Math.min(6, errs.length * 2), errs.slice(0, 4).join(' · '), 'Una pantalla con errores de JS puede quedar a medio dibujar: revisalos antes de entregar.');

const nota = Math.max(0, Math.round(100 - problemas.reduce((a, p) => a + p.puntos, 0)));
problemas.sort((a, b) => (a.nivel === b.nivel ? b.puntos - a.puntos : a.nivel === 'falla' ? -1 : 1));

const salida = {
  url, nota, ancho: ANCHO, oscuro: OSCURO,
  resumen: { fallas: problemas.filter(p => p.nivel === 'falla').length, avisos: problemas.filter(p => p.nivel === 'aviso').length,
    textosRevisados: principal.totalTextos, contrasteSobreImagen: principal.contraste.sobreImagen,
    fuentes: F.uso.map(u => u.familia), display: F.display, cuerpo: F.cuerpo, botonesRellenos: principal.rellenos.length },
  problemas, capturas: [principal.captura, cel.captura],
};

if (JSON_OUT) console.log(JSON.stringify(salida, null, 2));
else {
  const tty = process.stdout.isTTY;
  const c = (cod, t) => (tty ? `\x1b[${cod}m${t}\x1b[0m` : t);
  const barra = n => '█'.repeat(Math.round(n / 5)) + '░'.repeat(20 - Math.round(n / 5));
  console.log(`\n${c('1', 'Revisión de pantalla')}  ${url}`);
  console.log(`${ANCHO} px${CELULAR ? ' (celular)' : ''}${OSCURO ? ' · oscuro' : ''} · ${principal.totalTextos} textos · fuentes: ${F.uso.map(u => u.familia).join(', ')}`);
  const colNota = nota >= 85 ? '32' : nota >= 65 ? '33' : '31';
  console.log(`\nNota ${c('1;' + colNota, String(nota))}/100  ${c(colNota, barra(nota))}  ${salida.resumen.fallas} fallas · ${salida.resumen.avisos} avisos\n`);
  if (!problemas.length) console.log('Sin problemas detectados. Igual mirala al lado de las referencias 06, 07, 08 y 14.\n');
  for (const p of problemas) {
    console.log(`${p.nivel === 'falla' ? c('31', '✗ FALLA') : c('33', '! aviso')}  ${c('1', p.regla)}  ${c('2', `−${p.puntos}`)}`);
    console.log(`   ${p.detalle}`);
    for (const e of p.ejemplos.slice(0, 6)) console.log(c('2', `   · ${e}`));
    console.log(`   → ${p.sugerencia}\n`);
  }
  console.log(`Capturas: ${salida.capturas.join('  ')}\n`);
}

if (MINIMO !== null && nota < Number(MINIMO)) process.exit(1);
