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
                (lo mismo si la página trae data-pantalla="galeria" en <body>)
  --json        salida en JSON (para otro script o agente)
  --minimo N    sale con código 1 si la nota queda por debajo de N`);
  process.exit(objetivo ? 0 : 2);
}

const CELULAR = flag('--celular');
const ANCHO = CELULAR ? 390 : parseInt(valor('--ancho', '1440'), 10) || 1440;
const ALTO = parseInt(valor('--alto', CELULAR ? '844' : '900'), 10);
const OSCURO = flag('--oscuro');
const JSON_OUT = flag('--json');
let GALERIA = flag('--galeria'); // también se prende con data-pantalla="galeria" en <body> (ver abajo)
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
      // lo elegido de un grupo (filtro activo, día elegido, pestaña) es un estado, no una acción
      if (b.matches('[aria-pressed=true],[aria-selected=true],[aria-checked=true],[aria-current]:not([aria-current=false]),[role=tab],[role=radio],[role=switch],[role=option]')) continue;
      const s = getComputedStyle(b), bc = color(s.backgroundColor);
      const bi = s.backgroundImage && s.backgroundImage !== 'none' && !/url\(/.test(s.backgroundImage);
      if (bc[3] < 0.5 && !bi) continue;
      const propio = bi ? fondo(b).c : sobre(bc, fondo(b.parentElement).c);
      const debajo = fondo(b.parentElement).c;
      if (ratio(propio, debajo) < 2.2) continue; // blanco sobre blanco, pastilla de segmentado: no es relleno
      const r = b.getBoundingClientRect();
      if (r.height > 96) continue; // una tarjeta entera clickeable (protagonista, ficha) no es un botón
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

    /* ── 11b. scroll horizontal interno (tabla, kanban, Gantt que se deslizan de costado) ── */
    // Un contenedor que scrollea de costado solo vale si es un carrusel a propósito: con encastre
    // (scroll-snap-type) o marcado con data-carrusel (y entonces tiene que tener indicador).
    const esCarrusel = el => el.hasAttribute('data-carrusel') || el.closest('[data-lienzo]') || (getComputedStyle(el).scrollSnapType || 'none') !== 'none';
    // plegado: dentro de un padre que recorta y mide 0 (panel "Ver código" cerrado, acordeón): no se ve
    const plegado = el => { for (let e = el.parentElement; e && e !== document.body && e !== de; e = e.parentElement) { const s = getComputedStyle(e); if (s.overflowX !== 'visible' || s.overflowY !== 'visible') { const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return true; } } return false; };
    const scrollers = vis.filter(el => {
      if (el === document.body || el === de) return false;
      const s = getComputedStyle(el);
      if (!['auto', 'scroll'].includes(s.overflowX)) return false;
      return el.scrollWidth > el.clientWidth + 1 && !plegado(el);
    });
    const scrollerSinCarrusel = scrollers.filter(el => !esCarrusel(el));
    res.scrollInterno = scrollerSinCarrusel.filter(el => !scrollerSinCarrusel.some(p => p !== el && p.contains(el))).slice(0, 8)
      .map(el => ({ selector: sel(el), ancho: Math.round(el.clientWidth), contenido: Math.round(el.scrollWidth) }));
    res.carruseles = scrollers.length - scrollerSinCarrusel.length;

    /* ── 11c. contenido que se sale de la pantalla (cortado, sin scroll que lo muestre) ── */
    const dentroDeScroll = el => { for (let e = el.parentElement; e && e !== document.body && e !== de; e = e.parentElement) { if (['auto', 'scroll'].includes(getComputedStyle(e).overflowX)) return true; } return false; };
    const fijo = el => { for (let e = el; e && e !== de; e = e.parentElement) { if (getComputedStyle(e).position === 'fixed') return true; } return false; };
    const cortados = [...new Set([...conTexto, ...clickeables])].filter(el => {
      if (el.closest('[aria-hidden=true],[inert],[data-lienzo]')) return false; // lienzo con paneo a propósito (flujo de nodos, mapa)
      const r = el.getBoundingClientRect();
      const parcial = (r.right > vw + 1 && r.left < vw - 1) || (r.left < -1 && r.right > 1);
      if (!parcial) return false;        // del todo afuera = hoja o menú cerrado fuera de pantalla
      if (dentroDeScroll(el)) return false; // lo cubre 11b
      // truncado a propósito ("…" o line-clamp) por un padre que entra en la pantalla: no se sale.
      // Recortado por un overflow:hidden sin "…": sí está cortado, aunque el padre entre.
      let izq = r.left, der = r.right, elipsis = false;
      for (let e = el; e && e !== document.body && e !== de; e = e.parentElement) {
        const s = getComputedStyle(e);
        if (s.textOverflow === 'ellipsis' || (s.webkitLineClamp && s.webkitLineClamp !== 'none')) elipsis = true;
        if (e === el || s.overflowX === 'visible') continue;
        const pr = e.getBoundingClientRect(); izq = Math.max(izq, pr.left); der = Math.min(der, pr.right);
        if (elipsis) break;
      }
      if (elipsis && der <= vw + 1 && izq >= -1) return false;
      return !fijo(el);
    });
    res.cortados = cortados.filter(el => !cortados.some(p => p !== el && p.contains(el))).slice(0, 8)
      .map(el => { const r = el.getBoundingClientRect(); return { selector: sel(el), sobra: Math.round(Math.max(r.right - vw, -r.left)), texto: recorte(textoPropio(el) || el.getAttribute('aria-label') || '') }; });
  }

  /* ── 13. oscuro: blanco puro sobre negro puro, estados sin versión oscura, sombras como única separación ── */
  if (o.pasada === 'principal' && o.oscuro && lum(fondo(document.body).c) > 0.4) {
    res.oscuro = { sinTema: true, fondo: hex(fondo(document.body).c) }; // la página no tiene oscuro: no sigue midiendo
  } else if (o.pasada === 'principal' && o.oscuro) {
    const puro = new Map(), sinVersion = new Map(), sombras = [];
    for (const el of conTexto) {
      const s = getComputedStyle(el), f = fondo(el);
      if (f.imagen) continue;
      const tc = color(s.color);
      if (!tc[3]) continue;
      const texto = sobre([...tc.slice(0, 3), tc[3] * opacidad(el)], f.c);
      // #fff sobre #000: vibra y cansa; tinta #fafafa sobre lienzo #0a0a0b
      if (Math.min(...texto.slice(0, 3)) >= 253 && Math.max(...f.c.slice(0, 3)) <= 3) {
        const k = firma(el); if (!puro.has(k)) puro.set(k, { firma: k, cantidad: 0, ejemplos: [] });
        const g = puro.get(k); g.cantidad++; if (g.ejemplos.length < 2) g.ejemplos.push(sel(el));
      }
      // color de estado o de dato igual al del claro y con contraste bajo en oscuro
      const claro = el.__rvClaro;
      if (claro && satur(texto) > 0.3 && hex(tc) === claro) {
        const r = ratio(texto, f.c), fs = parseFloat(s.fontSize);
        const pide = fs >= 24 ? 3 : 4.5;
        if (r < pide) {
          const k = `${claro}|${hex(f.c)}`;
          if (!sinVersion.has(k)) sinVersion.set(k, { color: claro, fondo: hex(f.c), ratio: Math.round(r * 100) / 100, cantidad: 0, ejemplos: [] });
          const g = sinVersion.get(k); g.cantidad++; if (g.ejemplos.length < 2) g.ejemplos.push(`${sel(el)}  «${recorte(textoPropio(el))}»`);
        }
      }
    }
    // tarjetas separadas solo por sombra: en oscuro la sombra no se ve
    for (const el of vis) {
      const s = getComputedStyle(el), r = el.getBoundingClientRect();
      if (r.width < 120 || r.height < 56 || s.position === 'fixed') continue;
      if (!s.boxShadow || s.boxShadow === 'none') continue;
      const capas = [...s.boxShadow.matchAll(/(rgba?\([^)]*\)|#[0-9a-f]+)\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+([\d.]+)px(?:\s+(-?[\d.]+)px)?(\s+inset)?/gi)]
        .map(m => ({ c: color(m[1]), blur: +m[4], spread: +(m[5] || 0), inset: !!m[6] }));
      if (!capas.some(c => c.blur > 0 && !c.inset && c.c[3] > 0.02)) continue;
      const borde = ['Top', 'Right', 'Bottom', 'Left'].some(l => parseFloat(s[`border${l}Width`]) >= 1 && color(s[`border${l}Color`])[3] > 0.1)
        || capas.some(c => c.blur === 0 && c.spread >= 1 && c.c[3] > 0.1); // anillo de 1 px hecho con sombra
      if (borde) continue;
      const propio = fondo(el).c, debajo = el.parentElement ? fondo(el.parentElement).c : [0, 0, 0, 1];
      if (ratio(propio, debajo) >= 1.12) continue; // ya se separa por luminosidad
      sombras.push({ selector: sel(el), medida: `${Math.round(r.width)}×${Math.round(r.height)}`, fondo: hex(propio), debajo: hex(debajo) });
    }
    res.oscuro = { puro: [...puro.values()], sinVersion: [...sinVersion.values()], sombras: sombras.slice(0, 8), totalSombras: sombras.length };
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
        // > 40 px de diferencia: cada una toma el alto de su contenido (§4i), está bien; entre 3 y 40 parece un error
        if (dif > 2 && dif <= 40) S.alturas.push({ selector: sel(p) + ' > ' + g.firma, cantidad: g.items.length, dif: r1(dif), altos: altos.map(Math.round) });
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

  /* ── 14. aire muerto: tarjetas con huecos, filas estiradas, pliegue y íconos agrandados ── */
  if (o.pasada === 'principal') {
    const vh = innerHeight;
    const enFlujo = el => { const p = getComputedStyle(el).position; return p !== 'absolute' && p !== 'fixed'; };
    const tieneCaja = el => {
      const s = getComputedStyle(el);
      if (color(s.backgroundColor)[3] > 0.05) return true;
      if (s.backgroundImage && s.backgroundImage !== 'none') return true;
      if (s.boxShadow && s.boxShadow !== 'none' && !/inset/.test(s.boxShadow)) return true;
      return ['Top', 'Right', 'Bottom', 'Left'].some(l => parseFloat(s['border' + l + 'Width']) >= 1 && s['border' + l + 'Style'] !== 'none' && color(s['border' + l + 'Color'])[3] > 0.1);
    };
    const claseDe = el => (typeof el.className === 'string' ? el.className : '') + ' ' + (el.id || '');
    const CLASE_TARJETA = /(^|[-_ ])(card|tarjeta|kpi|bandeja|panel|tile|caja|bloque|metrica|stat|heroe|protagonista)s?([-_ ]|$)/i;
    // zonas que crecen a propósito: columnas de kanban, zonas para soltar, lienzos, calendarios
    const LIBRE = /(^|[-_ ])(kanban|kcol|columna|col|etapa|lane|soltar|dropzone|lienzo|canvas|calendario|cal|cel|celda|dia|semana|mes|hora|franja|slot|hueco|chat|conversacion|mensajes|hilo|firma|mapa|nave|sidebar|lateral|menu)s?([-_ ]|$)/i;
    // marcos de presentación: el panel de una app de muestra, un teléfono, el escenario de una demo (alto fijo a propósito)
    const MARCO = (o.galeria || document.body.dataset.pantalla === 'galeria') ? /(panel|app|marco|escena|escenario|demo|lamina|tel|cel|pant|movil|lienzo|hoja|stage|frame|mock|dispositivo)/i
      : /(^|\s)([a-z]{1,4}-)?(panel|app|marco|escena|escenario|demo|lamina|lamina-cuerpo|tel|pant|pantalla|movil|lienzo|hoja|stage|frame|dispositivo)(\s|$)/i;
    // lo que muestra a propósito cómo NO se hace (antes/después, simetría) no se cuenta
    const ejemploMalo = el => !!el.closest('.antes,.mal,[data-antes],[data-mal],[data-ver=antes] .antes');
    // la pantalla entera dentro de un marco (la vista de un teléfono de muestra) cuenta como el marco
    const llenaMarco = el => { const p = el.parentElement; if (!p || !MARCO.test(claseDe(p))) return false; return el.getBoundingClientRect().height >= p.getBoundingClientRect().height * 0.9; };
    const libre = el => !!el.closest('[data-alto-libre],[data-lienzo],[data-carrusel]') || LIBRE.test(claseDe(el)) || MARCO.test(claseDe(el)) || ejemploMalo(el) || llenaMarco(el)
      || [1, 2].some(k => { let e = el; for (let i = 0; i < k && e; i++) e = e.parentElement; return e && /(^|[-_ ])(kanban|kcol|columna|col|lane)s?([-_ ]|$)/i.test(claseDe(e)); });
    const dentroSvg = el => !!el.parentElement?.closest('svg');
    const SOLIDO = 'svg,img,canvas,video,iframe,input,select,textarea,button,progress,meter,hr,picture,object';
    // en el flujo cuenta aunque esté en opacidad 0 (lo que aparece al hacer scroll ya ocupa su lugar)
    const ocupa = el => { if (getComputedStyle(el).display === 'contents') return true; if (!el.getClientRects().length) return false; const q = el.getBoundingClientRect(); if (q.width < 1 || q.height < 1) return false; const v = getComputedStyle(el).visibility; return v !== 'hidden' && v !== 'collapse'; };
    const textoRects = n => { const rg = document.createRange(); rg.selectNodeContents(n); return [...rg.getClientRects()].filter(rr => rr.width > 0 && rr.height > 0); };
    // alto real del contenido de un elemento: texto, dibujos, controles y cajas con fondo o borde
    function extension(el, prof = 0) {
      const r = el.getBoundingClientRect();
      if (el.matches(SOLIDO)) return [r.top, r.bottom];
      if (prof > 0 && enFlujo(el) && getComputedStyle(el).display !== 'contents' && tieneCaja(el)) return [r.top, r.bottom];
      let t = Infinity, b = -Infinity;
      for (const n of el.childNodes) {
        if (n.nodeType === 3 && n.textContent.trim()) { for (const rr of textoRects(n)) { t = Math.min(t, rr.top); b = Math.max(b, rr.bottom); } }
        else if (n.nodeType === 1 && !dentroSvg(n) && (enFlujo(n) ? ocupa(n) : visible(n)) && !/^(SCRIPT|STYLE|TEMPLATE|BR)$/.test(n.tagName)) {
          const e = prof >= 10 ? (q => [q.top, q.bottom])(n.getBoundingClientRect()) : extension(n, prof + 1);
          if (e) { t = Math.min(t, e[0]); b = Math.max(b, e[1]); }
        }
      }
      return t < b ? [t, b] : null;
    }
    const caja = el => { const r = el.getBoundingClientRect(), s = getComputedStyle(el); return { r, s, it: r.top + parseFloat(s.borderTopWidth) + parseFloat(s.paddingTop), ib: r.bottom - parseFloat(s.borderBottomWidth) - parseFloat(s.paddingBottom) }; };
    // una tarjeta visible: con fondo, borde o sombra; no el panel de toda la página
    const esCaja = el => {
      const r = el.getBoundingClientRect();
      if (r.width < 120 || r.height < 56 || !tieneCaja(el)) return false;
      if (r.width > vw * 0.6 && r.height > vh * 0.75) return false; // panel, sección o página entera
      if (/^(BODY|HTML|MAIN|HEADER|NAV|ASIDE|FOOTER|TABLE|TBODY|THEAD|TR|TD|TH|UL|OL|FORM|DIALOG|DETAILS|BUTTON|A|LABEL|INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) return false;
      if (el.closest('dialog:not([open]),[aria-hidden=true],[hidden]')) return false;
      return true;
    };
    const candidatas = vis.filter(el => esCaja(el) && !libre(el) && el.getBoundingClientRect().top < scrollY + document.documentElement.scrollHeight);
    const A = { huecos: [], filas: [], iconos: [], pliegue: null };

    /* a) filas de tarjetas estiradas: alto natural (align-self:start) contra el alto real */
    const estiradas = new Set();
    const contFila = vis.filter(el => { const s = getComputedStyle(el); return s.display.includes('grid') || (s.display.includes('flex') && !s.flexDirection.startsWith('column')); });
    for (const p of contFila) {
      const hijos = [...p.children].filter(c => visible(c) && enFlujo(c) && esCaja(c) && !libre(c));
      if (hijos.length < 2) continue;
      const filas = [];
      for (const h of hijos) { const r = h.getBoundingClientRect(); let g = filas.find(x => Math.abs(x.top - r.top) <= 2); if (!g) filas.push(g = { top: r.top, items: [] }); g.items.push(h); }
      for (const g of filas) {
        if (g.items.length < 2) continue;
        const reales = g.items.map(h => h.getBoundingClientRect().height);
        const antes = g.items.map(h => h.style.getPropertyValue('align-self'));
        const prio = g.items.map(h => h.style.getPropertyPriority('align-self'));
        g.items.forEach(h => h.style.setProperty('align-self', 'start', 'important'));
        const naturales = g.items.map(h => h.getBoundingClientRect().height);
        g.items.forEach((h, i) => { if (antes[i]) h.style.setProperty('align-self', antes[i], prio[i]); else h.style.removeProperty('align-self'); });
        const exceso = reales.map((a, i) => a - naturales[i]);
        const sobrados = exceso.filter(e => e > 60).length;
        if (sobrados >= Math.ceil(g.items.length / 2)) {
          g.items.forEach((h, i) => { if (exceso[i] > 60) estiradas.add(h); });
          const alta = naturales.indexOf(Math.max(...naturales));
          const necesitan = naturales.filter((_, i) => exceso[i] > 60).sort((a, b) => a - b);
          A.filas.push({ selector: sel(p), cantidad: g.items.length, alto: Math.round(Math.max(...reales)), necesitan: Math.round(necesitan[Math.floor(necesitan.length / 2)]),
            exceso: Math.round(Math.max(...exceso)), culpable: `${sel(g.items[alta])} (${Math.round(naturales[alta])} px)` });
        }
      }
    }

    /* b) hueco vertical sin contenido dentro de una tarjeta (arriba, entre hijos o abajo) */
    const vistos = new Map();
    for (const el of candidatas) {
      if ([...estiradas].some(e => e === el || e.contains(el))) continue; // ya cuenta como fila estirada
      const s = getComputedStyle(el);
      if (/url\(/.test(s.backgroundImage)) continue;                          // foto de fondo: el hueco es la foto
      if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight + 1) continue; // lista con scroll: está llena
      const { r, it, ib } = caja(el);
      if (ib - it < 80) continue;
      const tramos = [];
      for (const n of el.childNodes) {
        if (n.nodeType === 3 && n.textContent.trim()) for (const rr of textoRects(n)) tramos.push([rr.top, rr.bottom]);
        else if (n.nodeType === 1 && !dentroSvg(n) && (enFlujo(n) ? ocupa(n) : visible(n)) && !/^(SCRIPT|STYLE|TEMPLATE|BR)$/.test(n.tagName)) {
          // lo absoluto cuenta solo si dibuja algo (un gráfico al pie), no un brillo decorativo
          const abs = !enFlujo(n);
          const e = abs ? (n.matches(SOLIDO) || n.querySelector(SOLIDO) || n.innerText.trim() ? extension(n, 1) : null) : extension(n, 1);
          if (e) tramos.push(e);
        }
      }
      if (!tramos.length) continue;
      tramos.sort((a, b) => a[0] - b[0]);
      let cursor = it, mayor = 0, donde = '', total = 0;
      const anotar = (h, d) => { if (h > 0) total += h; if (h > mayor) { mayor = h; donde = d; } };
      tramos.forEach((t, i) => { if (t[0] > cursor) anotar(t[0] - cursor, i === 0 ? 'arriba' : 'entre hijos'); cursor = Math.max(cursor, t[1]); });
      anotar(ib - cursor, 'abajo');
      if (mayor <= 60 && !(total > 100 && mayor > 40)) continue;
      const k = firma(el);
      if (!vistos.has(k)) { vistos.set(k, { firma: k, cantidad: 0, mayor: 0, donde, alto: Math.round(r.height), ejemplos: [] }); A.huecos.push(vistos.get(k)); }
      const g = vistos.get(k); g.cantidad++;
      if (mayor > g.mayor) { g.mayor = Math.round(mayor); g.donde = donde; g.alto = Math.round(r.height); }
      if (g.ejemplos.length < 2) g.ejemplos.push(sel(el));
    }

    /* c) íconos de tamaño anormal (> 32 px) que no son ilustración, gráfico, logo ni avatar */
    const NO_ICONO = /(graf|chart|spark|curva|linea|barra|ilus|anillo|ring|dona|donut|gauge|mapa|map|logo|avatar|foto|marca|plano|lienzo|flujo|qr|firma)/i;
    const VB_ICONO = /^0 0 (16|20|24|32|48|256) (16|20|24|32|48|256)$/;
    for (const ic of document.querySelectorAll('svg, i[class*="ph"]')) {
      if (ic.tagName === 'svg' && ic.parentElement?.closest('svg')) continue;
      if (!visible(ic) || ic.closest('[data-ilustracion],[aria-label*="gráfico" i]')) continue;
      let esIcono;
      if (ic.tagName === 'I') esIcono = true;
      else {
        const vb = (ic.getAttribute('viewBox') || '').trim().replace(/\s+/g, ' ');
        const usa = ic.querySelector('use')?.getAttribute('href') || ic.querySelector('use')?.getAttribute('xlink:href') || '';
        esIcono = VB_ICONO.test(vb) || /^#?(ph|i|ico|icono)[-_]/i.test(usa.replace(/^#/, '#'));
        if (ic.querySelector('text,polyline,circle[r] ~ circle[r] ~ circle[r],pattern,linearGradient,foreignObject')) esIcono = false; // tiene ejes, series o patrones: es un gráfico
        if (ic.querySelectorAll('path,rect,circle,line,polygon,ellipse').length > 14) esIcono = false;   // muchas piezas: ilustración
      }
      if (!esIcono) continue;
      let anc = ic, ruido = false;
      for (let i = 0; anc && i < 4; anc = anc.parentElement, i++) if (NO_ICONO.test(claseDe(anc)) || NO_ICONO.test(anc.getAttribute?.('aria-label') || '')) { ruido = true; break; }
      if (ruido) continue;
      const ri = ic.getBoundingClientRect();
      if (ejemploMalo(ic)) continue;
      const tam = ic.tagName === 'I' ? parseFloat(getComputedStyle(ic).fontSize) : Math.max(ri.width, ri.height);
      if (tam <= 32) continue;
      // un ícono que es el dibujo de un vacío (sin ilustración a mano) se avisa igual: §6 Ilustraciones
      const p = ic.parentElement, rp = p.getBoundingClientRect();
      const k = firma(p) + ' > ' + firma(ic);
      const prev = A.iconos.find(x => x.firma === k);
      if (prev) { prev.cantidad++; continue; }
      A.iconos.push({ firma: k, cantidad: 1, medida: `${Math.round(ri.width)}×${Math.round(ri.height)}`, caja: `${Math.round(rp.width)}×${Math.round(rp.height)}`,
        desborda: ri.width > rp.width + 0.5 || ri.height > rp.height + 0.5, ejemplo: sel(ic) });
    }

    /* d) arriba del pliegue: cuánto de la primera pantalla es contenido y qué se alcanza a ver */
    if (scrollY === 0) {
      const zona = document.querySelector('main,[role=main]') || document.querySelector('.contenido,.principal,.pag,.pagina,.page,.panel') || document.body;
      const rz = zona.getBoundingClientRect();
      const x0 = Math.max(0, rz.left), x1 = Math.min(vw, rz.right), y0 = Math.max(0, rz.top), y1 = Math.min(vh, rz.bottom);
      const PASO = 12, cols = Math.max(1, Math.floor((x1 - x0) / PASO)), filasG = Math.max(1, Math.floor((y1 - y0) / PASO));
      const marca = new Uint8Array(cols * filasG);
      const pintar = (q, m = 6) => {
        const a = Math.max(0, Math.floor((q.left - m - x0) / PASO)), b = Math.min(cols - 1, Math.floor((q.right + m - x0) / PASO));
        const c = Math.max(0, Math.floor((q.top - m - y0) / PASO)), d = Math.min(filasG - 1, Math.floor((q.bottom + m - y0) / PASO));
        for (let y = c; y <= d; y++) for (let x = a; x <= b; x++) marca[y * cols + x] = 1;
      };
      const enZona = q => q.bottom > y0 && q.top < y1 && q.right > x0 && q.left < x1;
      for (const el of vis) {
        if (!zona.contains(el)) continue;
        const q = el.getBoundingClientRect(); if (!enZona(q)) continue;
        if (el.matches(SOLIDO)) { pintar(q); continue; }
        for (const n of el.childNodes) if (n.nodeType === 3 && n.textContent.trim()) for (const rr of textoRects(n)) if (enZona(rr)) pintar(rr);
      }
      for (const sv of zona.querySelectorAll('svg')) if (!sv.parentElement.closest('svg') && visible(sv)) { const q = sv.getBoundingClientRect(); if (enZona(q)) pintar(q); }
      const util = Math.round(marca.reduce((a, v) => a + v, 0) / marca.length * 100);
      // tipo de pantalla: data-pantalla manda; si no, KPIs arriba = tablero, tabla o lista larga = lista, pestañas = ficha
      // la fila de KPIs: la primera fila (mismo top) con 2 o más tarjetas de KPI en la primera pantalla
      const KPI = /(^|[-_ ])(kpi|metrica|stat|heroe|protagonista)s?([-_ ]|$)/i, FILA_KPI = /(^|[-_ ])(kpis|metricas|stats|fila-kpis)([-_ ]|$)/i;
      const candK = vis.filter(el => el.getBoundingClientRect().top < vh && esCaja(el) && !ejemploMalo(el) && (KPI.test(claseDe(el)) || (el.parentElement && FILA_KPI.test(claseDe(el.parentElement)))))
        .sort((x, y) => x.getBoundingClientRect().top - y.getBoundingClientRect().top);
      let kpis = [];
      for (const k of candK) { const t = k.getBoundingClientRect().top; const fila = candK.filter(x => Math.abs(x.getBoundingClientRect().top - t) <= 2); if (fila.length >= 2) { kpis = fila; break; } }
      const filasLista = [...document.querySelectorAll('tbody tr, [role=row]:not(thead [role=row]), [data-fila], .fila')].filter(f => visible(f) && !f.closest('thead') && zona.contains(f) && f.getBoundingClientRect().height >= 20);
      const pestanas = document.querySelector('[role=tablist],.pestanas,.tabs');
      const tipo = document.body.dataset.pantalla || document.documentElement.dataset.pantalla || (document.querySelector('.hoja-a4,[data-documento]') ? 'documento' : '') ||
        (kpis.length >= 2 ? 'tablero' : filasLista.length >= 8 ? 'lista' : pestanas && visible(pestanas) ? 'ficha' : 'otra');
      const kpiFondo = kpis.length ? Math.round(Math.max(...kpis.map(k => k.getBoundingClientRect().bottom))) : null;
      const kpiTope = kpis.length ? Math.round(Math.min(...kpis.map(k => k.getBoundingClientRect().top))) : null;
      const filasVisibles = filasLista.filter(f => f.getBoundingClientRect().bottom <= vh).length;
      const pestanasTope = pestanas && visible(pestanas) ? Math.round(pestanas.getBoundingClientRect().top) : null;
      A.pliegue = { util, tipo, alto: vh, kpiTope, kpiFondo, filasVisibles, filasTotales: filasLista.length, pestanasTope };
    }
    res.aire = A;
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
    // La pasada principal en oscuro arranca en claro para anotar el color de cada texto de color
    // (estados, deltas, datos) y después pasa a oscuro: así ve los que no tienen versión oscura.
    colorScheme: OSCURO && tipo !== 'principal' ? 'dark' : 'light', locale: 'es-AR',
  });
  const page = await ctx.newPage();
  const errores = [];
  page.on('pageerror', e => errores.push(String(e.message).split('\n')[0]));
  page.on('console', m => { if (m.type() === 'error') errores.push(m.text().split('\n')[0]); });
  await page.goto(url, { waitUntil: 'load', timeout: 45000 });
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  if (OSCURO && tipo === 'principal') {
    await page.waitForTimeout(1600);
    await page.evaluate(() => {
      const cv = Object.assign(document.createElement('canvas'), { width: 1, height: 1 }), cx = cv.getContext('2d', { willReadFrequently: true });
      const hex = str => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = str; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return '#' + [d[0], d[1], d[2]].map(v => v.toString(16).padStart(2, '0')).join(''); };
      for (const el of document.body.querySelectorAll('*')) {
        if ([...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) el.__rvClaro = hex(getComputedStyle(el).color);
      }
    });
    await page.emulateMedia({ colorScheme: 'dark' });
  }
  if (OSCURO) await page.evaluate(() => { document.documentElement.dataset.tema = 'oscuro'; document.documentElement.classList.add('dark'); });
  await page.waitForTimeout(1600); // cuentas, barras y líneas que se dibujan al cargar (y la transición de tema)
  const datos = await page.evaluate(analizar, { pasada: tipo, oscuro: OSCURO, galeria: GALERIA });
  const captura = `/tmp/revisar-${nombre}-${ancho}${OSCURO ? '-oscuro' : ''}.png`;
  await page.screenshot({ path: captura, fullPage: true }).catch(() => {});
  await ctx.close();
  return { ...datos, captura, errores };
}

const principal = await pasada('principal', ANCHO, ALTO, CELULAR);
if (principal.aire?.pliegue?.tipo === 'galeria') GALERIA = true; // la página se declara catálogo: data-pantalla="galeria"
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
// Una sola familia de texto (Geist) en dos papeles, más la mono. Ver SKILL.md §2.
if (F.familiasTexto.length >= 2) add('aviso', 'Más de una familia de texto', 5, `Familias de texto: ${F.familiasTexto.join(', ')}.`, 'Geist para interfaz, títulos y cifras (con peso y tracking distintos) y Geist Mono para códigos.');
if (F.cuerpo && !/geist/i.test(F.cuerpo)) add('aviso', 'Letra del sistema', 3, `El texto usa ${F.cuerpo}.`, 'La letra de la skill es Geist (y Geist Mono para códigos), salvo que la marca exija otra.');
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
else if (cel.cortados.length) add('falla', 'Se sale de la pantalla a 390 px', tope(cel.cortados.length, 3, 12),
  `${cel.cortados.length === 1 ? 'Un texto o control queda cortado' : `${cel.cortados.length} textos o controles quedan cortados`} en el borde de la pantalla${D.tapado ? ' (body/html esconde el desborde)' : ''}.`,
  'Nada con ancho fijo sin max-w-full; hijos de flex y grid con min-w-0; grillas con minmax(0,1fr); textos largos con truncate o break-words. No escondas el desborde con overflow:hidden.',
  cel.cortados.map(c => `${c.selector} (sobra ${c.sobra} px)${c.texto ? ` «${c.texto}»` : ''}`));
else if (D.tapado) add('aviso', 'Contenido cortado a 390 px', 5,
  'No hay scroll de costado porque body/html lo esconde, pero hay elementos que se salen y quedan cortados.',
  'Arreglá el ancho de esos elementos en vez de esconder el desborde.', D.culpables.map(c => `${c.selector} (sobra ${c.sobra} px)`));

// 11b. scroll horizontal dentro de un componente (SKILL.md §6e)
if (cel.scrollInterno.length) add('falla', 'Scroll de costado dentro de un componente a 390 px', tope(cel.scrollInterno.length, 4, 15),
  cel.scrollInterno.map(s => `${s.contenido} px de contenido en ${s.ancho} px`).join(' · ') + ': hay que deslizar de costado para ver el componente entero.',
  'En celular nada se desliza de costado: tabla → tarjetas, kanban → una etapa a la vez con segmentado, timeline/Gantt → lista por día, KPIs → 1–2 columnas. Si es un carrusel a propósito, scroll-snap-type: x mandatory + indicador (puntos o "2 de 5") y data-carrusel en el contenedor.',
  cel.scrollInterno.map(s => s.selector));

// 13. oscuro
if (OSCURO && principal.oscuro?.sinTema) add('aviso', 'Oscuro · la página no cambia', 6,
  `Con data-tema="oscuro" y prefers-color-scheme: dark el fondo sigue claro (${principal.oscuro.fondo}).`,
  'Sumá el bloque oscuro de tokens.css (.dark, [data-tema=\'oscuro\']) y sacá los colores escritos a mano: todo sale de variables.');
else if (OSCURO && principal.oscuro) {
  const O = principal.oscuro;
  if (O.puro.length) add('aviso', 'Oscuro · blanco puro sobre negro puro', tope(O.puro.reduce((a, p) => a + p.cantidad, 0), 0.5, 4),
    O.puro.map(p => `${p.firma} ×${p.cantidad}`).join(' · ') + ': #fff sobre #000 vibra y cansa la vista.',
    'Tinta #fafafa sobre lienzo #0a0a0b y superficies que suben de luz (#111113 → #18181b → #1f1f22). Ver tokens.css, bloque oscuro.',
    O.puro.flatMap(p => p.ejemplos.slice(0, 1)));
  if (O.sinVersion.length) add('aviso', 'Oscuro · color sin versión oscura', tope(O.sinVersion.reduce((a, p) => a + p.cantidad, 0), 1, 8),
    O.sinVersion.map(p => `${p.color} sobre ${p.fondo} = ${p.ratio}:1 ×${p.cantidad}`).join(' · ') + ': el mismo color que en claro y no llega a AA.',
    'Estados y deltas con su versión oscura, más clara y menos saturada (verde #4ade80, rojo #f87171, ámbar #fbbf24, azul #60a5fa): salen de variables que cambian con [data-tema=oscuro], nunca escritos a mano.',
    O.sinVersion.flatMap(p => p.ejemplos.slice(0, 1)));
  if (O.totalSombras) add('aviso', 'Oscuro · sombra como única separación', tope(O.totalSombras, 1, 5),
    `${O.totalSombras === 1 ? 'Una tarjeta o panel se separa' : `${O.totalSombras} tarjetas o paneles se separan`} del fondo solo con sombra (en oscuro no se ve).`,
    'En oscuro la capa de arriba es más clara (escalera de superficies) y lleva borde de 1 px (#2a2a2e); la sombra se apaga.',
    O.sombras.map(s => `${s.selector} (${s.medida}, ${s.fondo} sobre ${s.debajo})`));
}

// 12. simetría y alineación (aviso; descuento proporcional con tope total de 10)
{
  const Sm = principal.simetria, partes = [];
  const parte = (regla, puntos, detalle, sugerencia, ejemplos) => partes.push({ regla, puntos, detalle, sugerencia, ejemplos });
  if (Sm.alturas.length) parte('Simetría · hermanos de distinto alto', tope(Sm.alturas.length, 1.5, 4),
    Sm.alturas.map(a => `${a.cantidad} piezas en una fila con ${a.dif} px de diferencia (${a.altos.join(' / ')})`).join(' · '),
    'Hermanas con contenido parecido miden lo mismo: grid con align-items:stretch y el pie con margin-top:auto (el hueco que queda no pasa de ~40 px). Si una necesita mucho más, cada una toma su alto (align-items:start, §4i).',
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

// 14. aire muerto y densidad vertical (SKILL.md §4i)
{
  const Ai = principal.aire;
  if (Ai.filas.length) {
    const grave = Ai.filas.some(f => f.exceso >= 120);
    add(grave ? 'falla' : 'aviso', 'Aire muerto · fila estirada', tope(Ai.filas.length, grave ? 6 : 3, grave ? 12 : 6),
      Ai.filas.map(f => `fila de ${f.cantidad} que mide ${f.alto} px cuando la mayoría necesita ~${f.necesitan} (hasta ${f.exceso} px de blanco); la estira ${f.culpable}`).join(' · '),
      'Las tarjetas toman el alto de su contenido: align-items:start en la grilla, o compactá la pieza alta (protagonista con la curva de alto fijo, lista recortada a "+N más"). Si la fila se iguala, el contenido se reparte (pie pegado abajo) y no queda un hueco de más de ~40 px.',
      Ai.filas.map(f => f.selector));
  }
  if (Ai.huecos.length) {
    const grave = Ai.huecos.some(h => h.mayor >= 120);
    const n = Ai.huecos.reduce((a, h) => a + h.cantidad, 0);
    add(grave ? 'falla' : 'aviso', 'Aire muerto · hueco dentro de la tarjeta', tope(n, grave ? 4 : 1.5, grave ? 12 : 6),
      Ai.huecos.map(h => `${h.firma} (${h.alto} px de alto) con ${h.mayor} px vacíos ${h.donde} ×${h.cantidad}`).join(' · '),
      'Sacá el alto fijo o el min-height, o llená el hueco con algo útil: una línea de contexto ("Sin movimientos desde el 12 nov"), el detalle del número, la lista de los 3 primeros. Un vacío va compacto dentro de la tarjeta, nunca media pantalla. Si es una zona para soltar o un lienzo, marcá el contenedor con data-alto-libre.',
      Ai.huecos.flatMap(h => h.ejemplos.slice(0, 1)));
  }
  const P = Ai.pliegue;
  if (P && !CELULAR && !GALERIA && !['documento', 'galeria', 'formulario', 'acceso', 'lectura'].includes(P.tipo)) {
    const faltas = [];
    if (P.tipo === 'tablero' && P.kpiFondo !== null && P.kpiFondo > P.alto - 240)
      faltas.push(`los KPIs terminan en ${P.kpiFondo} px de ${P.alto}: quedan menos de 240 px para el bloque principal`);
    if (P.tipo === 'tablero' && P.kpiFondo !== null && P.kpiFondo - P.kpiTope > 205)
      faltas.push(`la fila de KPIs mide ${P.kpiFondo - P.kpiTope} px (tope 200: simple 104–128, con dibujo 140–170, en bandeja con rótulo y pie ≤ 200)`);
    if (P.tipo === 'tablero' && P.kpiTope !== null && P.kpiTope > 300)
      faltas.push(`los KPIs empiezan recién en ${P.kpiTope} px: la cabecera ocupa demasiado`);
    if (P.tipo === 'lista' && P.filasTotales >= 8 && P.filasVisibles < 8)
      faltas.push(`solo ${P.filasVisibles} filas de ${P.filasTotales} arriba del pliegue (piso: 8)`);
    if (P.tipo === 'ficha' && P.pestanasTope !== null && P.pestanasTope > P.alto - 160)
      faltas.push(`las pestañas empiezan en ${P.pestanasTope} px: no se ve la primera pestaña`);
    const umbral = P.tipo === 'tablero' || P.tipo === 'lista' ? 45 : 30;
    if (P.util < umbral) faltas.push(`solo el ${P.util} % de la primera pantalla tiene contenido (piso ${umbral} % para ${P.tipo === 'otra' ? 'esta pantalla' : 'un ' + P.tipo})`);
    if (faltas.length) add('aviso', 'Aire muerto · arriba del pliegue', Math.min(6, faltas.length * 2.5),
      `A ${ANCHO}×${P.alto}: ${faltas.join(' · ')}.`,
      'Sin scrollear tiene que verse (§4i): tablero = cabecera + KPIs + 240 px del bloque principal; lista = filtros + 8–10 filas; ficha = cabecera + datos clave + primera pestaña. Cabecera de una fila (≤ 96 en vistazo), KPIs de ≤ 200 px, protagonista con la curva de 48–64. Si la pantalla es un formulario, un acceso o algo para leer, marcala con data-pantalla en <body>.');
  }
  if (Ai.iconos.length) {
    const n = Ai.iconos.reduce((a, i) => a + i.cantidad, 0);
    add(Ai.iconos.some(i => i.desborda) ? 'falla' : 'aviso', 'Ícono de tamaño anormal', tope(n, Ai.iconos.some(i => i.desborda) ? 3 : 1.5, 6),
      Ai.iconos.map(i => `${i.firma} a ${i.medida} px en una caja de ${i.caja}${i.desborda ? ' (se sale de su cuadro)' : ''} ×${i.cantidad}`).join(' · '),
      'Íconos de 13 a 22 px (§6 Íconos). Si un ícono creció solo, buscá una regla genérica como `.tarjeta svg{width:100%;height:40px}` pensada para un gráfico: los estilos de gráficos van con clase propia (.curva, .grafico svg) y nunca sobre `svg` dentro de una tarjeta con íconos. Un vacío o una bienvenida llevan una ilustración de ilustraciones/, no un ícono agrandado (o marcá el svg con data-ilustracion).',
      Ai.iconos.slice(0, 5).map(i => i.ejemplo));
  }
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
    fuentes: F.uso.map(u => u.familia), display: F.display, cuerpo: F.cuerpo, botonesRellenos: principal.rellenos.length, carruselesCelular: cel.carruseles, pliegue: principal.aire.pliegue },
  problemas, capturas: [principal.captura, cel.captura],
};

if (JSON_OUT) console.log(JSON.stringify(salida, null, 2));
else {
  const tty = process.stdout.isTTY;
  const c = (cod, t) => (tty ? `\x1b[${cod}m${t}\x1b[0m` : t);
  const barra = n => '█'.repeat(Math.round(n / 5)) + '░'.repeat(20 - Math.round(n / 5));
  console.log(`\n${c('1', 'Revisión de pantalla')}  ${url}`);
  console.log(`${ANCHO} px${CELULAR ? ' (celular)' : ''}${OSCURO ? ' · oscuro' : ''} · ${principal.totalTextos} textos · fuentes: ${F.uso.map(u => u.familia).join(', ')}`);
  const Pl = principal.aire.pliegue;
  if (Pl) console.log(`Primera pantalla (${Pl.tipo}): ${Pl.util} % con contenido${Pl.kpiFondo !== null ? ` · KPIs de ${Pl.kpiTope} a ${Pl.kpiFondo} px` : ''}${Pl.filasTotales ? ` · ${Pl.filasVisibles} de ${Pl.filasTotales} filas a la vista` : ''}`);
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
