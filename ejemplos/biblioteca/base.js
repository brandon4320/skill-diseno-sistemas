/*
 * Biblioteca de diseno-sistemas · base.js
 * Cargalo al final del <body>, ANTES del script propio de la página:
 *   <script src="base.js"></script>
 *   <script> /* tu demo, usando bib.* *\/ </script>
 * Así "Ver código" captura el HTML de cada demo tal como lo escribiste, antes de que tu script lo cambie.
 * Todo vive en window.bib. Nada de esto guarda datos: localStorage solo para el tema (try/catch).
 */
(function () {
  'use strict';
  const doc = document, root = doc.documentElement;
  const $ = (s, el = doc) => el.querySelector(s);
  const $$ = (s, el = doc) => [...el.querySelectorAll(s)];
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ZONA = 'America/Argentina/Buenos_Aires';
  /* "Hoy" fijo para que las demos den siempre lo mismo: miércoles 18 nov 2026, 15:42 en Argentina */
  const HOY = new Date('2026-11-18T15:42:00-03:00');

  /* ───────── fuente de cada demo, capturada antes de tocar el DOM (para "Ver código") ───────── */
  const FUENTES = new Map();
  $$('.lamina').forEach(lam => { const demo = $(lam.dataset.codigoDe || '.demo', lam); if (demo) FUENTES.set(lam, demo.innerHTML); });

  /* ───────── almacenamiento por persona (nunca datos) ───────── */
  function leer(clave, def = null) { try { const v = localStorage.getItem(clave); return v === null ? def : JSON.parse(v); } catch { return def; } }
  function guardar(clave, valor) { try { localStorage.setItem(clave, JSON.stringify(valor)); } catch {} }

  /* ───────── tema claro / oscuro recordado ───────── */
  const CLAVE_TEMA = 'bib-tema';
  function aplicarTema(t) {
    root.dataset.tema = t;
    $$('[data-tema-boton] button,[data-t]').forEach(b => {
      if (!b.dataset.t) return;
      const on = b.dataset.t === t;
      b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
    });
    doc.dispatchEvent(new CustomEvent('bib:tema', { detail: t }));
  }
  function tema(t) { if (t) { guardar(CLAVE_TEMA, t); aplicarTema(t); } return root.dataset.tema || 'claro'; }
  (function iniciarTema() {
    const guardado = leer(CLAVE_TEMA);
    const inicial = guardado || root.dataset.tema || (matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro');
    // si la cabecera no trae selector, se agrega uno en .bib-cab .der
    const der = $('.bib-cab .der');
    if (der && !$('[data-tema-boton]')) {
      der.insertAdjacentHTML('beforeend', '<div class="seg" data-tema-boton role="group" aria-label="Tema">' +
        '<button type="button" data-t="claro" aria-label="Tema claro" data-tip="Claro"><i class="ph ph-sun"></i></button>' +
        '<button type="button" data-t="oscuro" aria-label="Tema oscuro" data-tip="Oscuro"><i class="ph ph-moon"></i></button></div>');
    }
    $$('[data-tema-boton] button').forEach(b => b.addEventListener('click', () => tema(b.dataset.t)));
    aplicarTema(inicial);
  })();

  /* ───────── formato es-AR (como componentes/datos/formato.ts) ───────── */
  const nf = (min, max = min) => new Intl.NumberFormat('es-AR', { minimumFractionDigits: min, maximumFractionDigits: max });
  const MENOS = '−', FINO = ' ';
  const SIMBOLO = { ARS: '$', USD: 'US$', EUR: '€', BRL: 'R$', CNY: '¥' };
  const fmt = {
    numero(n, dec = 0) { return n == null || isNaN(n) ? '—' : nf(dec).format(n).replace('-', MENOS); },
    /** "184,2 mil" · "1,2 M" · "980" */
    corto(n) {
      if (n == null || isNaN(n)) return '—';
      const a = Math.abs(n), s = n < 0 ? MENOS : '';
      if (a >= 1e6) return s + nf(0, 1).format(a / 1e6) + ' M';
      if (a >= 1e3) return s + nf(0, 1).format(a / 1e3) + ' mil';
      return s + nf(0).format(a);
    },
    /** monto(18400,'USD') → "US$ 18.400,00"; {centavos:false} · {corto:true} → "US$ 18,4 mil" */
    monto(n, moneda = 'ARS', o = {}) {
      if (n == null || isNaN(n)) return '—';
      const sim = SIMBOLO[moneda] || moneda, s = n < 0 ? MENOS : '';
      const cuerpo = o.corto ? fmt.corto(Math.abs(n)) : nf(o.centavos === false ? 0 : 2).format(Math.abs(n));
      return `${s}${sim} ${cuerpo}`;
    },
    /** el mismo monto con la moneda y los centavos en gris: <span class="monto"><span class="u">US$</span>18.400<span class="cent">,00</span></span> */
    montoHTML(n, moneda = 'ARS', o = {}) {
      if (n == null || isNaN(n)) return '<span class="gris">—</span>';
      const sim = SIMBOLO[moneda] || moneda, s = n < 0 ? MENOS : '';
      if (o.corto) return `<span class="monto">${s}<span class="u">${sim}</span>${fmt.corto(Math.abs(n))}</span>`;
      const [ent, dec] = nf(o.centavos === false ? 0 : 2).format(Math.abs(n)).split(',');
      return `<span class="monto">${s}<span class="u">${sim}</span>${ent}${dec ? `<span class="cent">,${dec}</span>` : ''}</span>`;
    },
    /** pct(12.4) → "+12,4 %"; pct(-4,{dec:0}) → "−4 %"; {signo:false} sin + */
    pct(n, o = {}) {
      if (n == null || isNaN(n)) return '—';
      const dec = o.dec ?? (Number.isInteger(n) ? 0 : 1);
      const s = n > 0 && o.signo !== false ? '+' : n < 0 ? MENOS : '';
      return `${s}${nf(dec).format(Math.abs(n))}${FINO}%`;
    },
    /** "9 dic" o "9 dic 2025" si es de otro año (día calendario, sin pasar por UTC si viene "YYYY-MM-DD") */
    fecha(d, o = {}) {
      d = aFecha(d); if (!d) return '—';
      const mismoAnio = partes(d).anio === partes(HOY).anio;
      const t = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short', ...(mismoAnio && !o.anio ? {} : { year: 'numeric' }), timeZone: ZONA }).format(d);
      return t.replace(/\./g, '').replace(' de ', ' ').replace(' de ', ' ');
    },
    hora(d) { d = aFecha(d); return d ? new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: ZONA }).format(d) : '—'; },
    /** "recién" · "hace 8 min" · "hace 3 h" · "ayer 16:00" · "mañana 09:00" · "en 3 días" · "hace 6 días" · "9 dic" */
    relativa(d, ahora = HOY) {
      d = aFecha(d); if (!d) return '—';
      const seg = (d - ahora) / 1000, abs = Math.abs(seg);
      const dias = difDias(d, ahora);
      if (abs < 60) return 'recién';
      if (abs < 3600 && dias === 0) return seg < 0 ? `hace ${Math.round(abs / 60)} min` : `en ${Math.round(abs / 60)} min`;
      if (dias === 0) return seg < 0 ? `hace ${Math.round(abs / 3600)} h` : `hoy ${fmt.hora(d)}`;
      if (dias === -1) return `ayer ${fmt.hora(d)}`;
      if (dias === 1) return `mañana ${fmt.hora(d)}`;
      if (dias < 0 && dias >= -6) return `hace ${-dias} días`;
      if (dias > 0 && dias <= 6) return `en ${dias} días`;
      return fmt.fecha(d);
    },
    /** días calendario entre d y hoy (negativo = pasado) */
    dias(d, ahora = HOY) { d = aFecha(d); return d ? difDias(d, ahora) : null; },
    plural(n, uno, muchos) { return `${fmt.numero(n)} ${n === 1 ? uno : muchos}`; },
  };
  function aFecha(d) {
    if (d == null) return null;
    if (d instanceof Date) return d;
    if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) return new Date(d + 'T12:00:00-03:00');
    const x = new Date(d); return isNaN(x) ? null : x;
  }
  function partes(d) {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: ZONA }).formatToParts(d).map(x => [x.type, x.value]));
    return { anio: +p.year, mes: +p.month, dia: +p.day };
  }
  function difDias(a, b) { const x = partes(a), y = partes(b); return Math.round((Date.UTC(x.anio, x.mes - 1, x.dia) - Date.UTC(y.anio, y.mes - 1, y.dia)) / 864e5); }

  /* ───────── color por entidad ───────── */
  const PALETA = ['--e1', '--e2', '--e3', '--e4', '--e5', '--e6'];
  function colorDe(id) { let h = 0; for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return `var(${PALETA[h % PALETA.length]})`; }
  function monograma(nombre) { return String(nombre).trim().split(/\s+/).filter(p => p.length > 2 || /^[A-ZÁÉÍÓÚ]/.test(p)).slice(0, 2).map(p => p[0]).join('').toUpperCase() || '?'; }
  /** <span class="av" style="--ent:…">OR</span> */
  function avatar(nombre, o = {}) { return `<span class="av${o.clase ? ' ' + o.clase : ''}" style="--ent:${o.color || colorDe(o.id || nombre)}" ${o.titulo === false ? 'aria-hidden="true"' : `role="img" aria-label="${escapar(nombre)}"`}>${monograma(nombre)}</span>`; }

  /* ───────── dibujos ───────── */
  /** curva suave (Catmull-Rom → Bézier) para puntos [[x,y],…] → atributo d */
  function curva(p) {
    if (!p.length) return '';
    let d = `M${p[0][0].toFixed(1)},${p[0][1].toFixed(1)}`;
    for (let i = 0; i < p.length - 1; i++) {
      const a = p[i - 1] || p[i], b = p[i], c = p[i + 1], e = p[i + 2] || c;
      d += ` C${(b[0] + (c[0] - a[0]) / 6).toFixed(1)},${(b[1] + (c[1] - a[1]) / 6).toFixed(1)} ${(c[0] - (e[0] - b[0]) / 6).toFixed(1)},${(c[1] - (e[1] - b[1]) / 6).toFixed(1)} ${c[0].toFixed(1)},${c[1].toFixed(1)}`;
    }
    return d;
  }
  let idSvg = 0;
  /**
   * linea(svg, valores, {color, ancho, alto, marca, blanco, area, animar, aria})
   * Sparkline con área degradé, trazo de 2 px que no se estira y un punto marcado (por defecto el anteúltimo, nunca pegado al borde).
   */
  function linea(svg, v, o = {}) {
    const w = o.ancho || 300, h = o.alto || 64, col = o.color || 'var(--acento)';
    const mx = Math.max(...v), mn = Math.min(...v), rango = mx - mn || 1;
    const p = v.map((x, i) => [i * w / (v.length - 1), h - 6 - (x - mn) / rango * (h - 16)]);
    const d = curva(p), id = 'bibg' + (++idSvg), m = o.marca ?? Math.max(1, v.length - 2);
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`); svg.setAttribute('preserveAspectRatio', 'none');
    if (o.aria) { svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', o.aria); } else svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = `<defs><linearGradient id="${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" style="stop-color:${col};stop-opacity:${o.blanco ? .28 : .22}"/><stop offset="1" style="stop-color:${col};stop-opacity:0"/></linearGradient></defs>` +
      (o.area === false ? '' : `<path class="area" d="${d} L${w},${h} L0,${h}Z" fill="url(#${id})"/>`) +
      `<path class="trazo" d="${d}" fill="none" style="stroke:${col}" stroke-width="2" stroke-linecap="round" vector-effect="non-scaling-stroke" pathLength="1"/>` +
      (m === false ? '' : `<circle class="pto" cx="${p[m][0]}" cy="${p[m][1]}" r="4" style="fill:${o.blanco ? '#fff' : 'var(--superficie)'};stroke:${o.blanco ? '#4a41dc' : col}" stroke-width="2.5" vector-effect="non-scaling-stroke"/>`);
    if (!quieto && o.animar !== false) {
      const t = svg.querySelector('.trazo');
      t.style.strokeDasharray = 1; t.style.strokeDashoffset = 1;
      t.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 900, easing: 'cubic-bezier(.23,1,.32,1)' }).onfinish = () => { t.style.strokeDasharray = 'none'; t.style.strokeDashoffset = 0; };
      svg.querySelector('.area')?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: 300, fill: 'backwards' });
      svg.querySelector('.pto')?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, delay: 800, fill: 'backwards' });
    }
    return { puntos: p, d };
  }
  /** rayitas hasta el valor: ticks(el, 34, 23, 'var(--e4)') */
  function ticks(el, total, llenos, color = 'var(--acento)') { el.innerHTML = Array.from({ length: total }, (_, i) => `<i style="--i:${i};${i < llenos ? `background:${color}` : ''}"></i>`).join(''); el.setAttribute('aria-hidden', 'true'); }
  /** bloques "3 de 10": bloques(el, 10, 3, 'var(--e1)') */
  function bloques(el, total, llenos, color = 'var(--acento)') { el.innerHTML = Array.from({ length: total }, (_, i) => `<i style="${i < llenos ? `background:${color}` : ''}"></i>`).join(''); el.setAttribute('aria-hidden', 'true'); }
  /** anillo SVG: anillo(62, 0.6, {grosor:6, color, fondo, texto:'60 %'}) → string */
  function anillo(tam, frac, o = {}) {
    const g = o.grosor || 6, r = (tam - g) / 2, L = 2 * Math.PI * r;
    return `<svg width="${tam}" height="${tam}" viewBox="0 0 ${tam} ${tam}" ${o.aria ? `role="img" aria-label="${escapar(o.aria)}"` : 'aria-hidden="true"'}><circle cx="${tam / 2}" cy="${tam / 2}" r="${r}" fill="none" style="stroke:${o.fondo || 'var(--suave)'}" stroke-width="${g}"/><circle cx="${tam / 2}" cy="${tam / 2}" r="${r}" fill="none" style="stroke:${o.color || 'var(--acento)'}" stroke-width="${g}" stroke-linecap="round" stroke-dasharray="${L.toFixed(1)}" stroke-dashoffset="${(L * (1 - frac)).toFixed(1)}" transform="rotate(-90 ${tam / 2} ${tam / 2})"/>${o.texto ? `<text x="50%" y="50%" dy=".35em" text-anchor="middle" style="fill:${o.colorTexto || 'var(--tinta)'};font-family:var(--display);font-size:${Math.round(tam / 4.4)}px;font-weight:500">${o.texto}</text>` : ''}</svg>`;
  }

  /* ───────── cifras que cuentan ───────── */
  /** cuenta(el, hasta, {desde, dur:700, formato:n=>…}) — el valor final ya tiene que estar en el HTML */
  function cuenta(el, hasta, o = {}) {
    const f = o.formato || (n => fmt.numero(n, o.dec || 0));
    if (quieto) { el.textContent = f(hasta); return; }
    const desde = o.desde ?? 0, dur = o.dur || 700, t0 = performance.now();
    const paso = t => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = f(desde + (hasta - desde) * e); if (k < 1) requestAnimationFrame(paso); };
    requestAnimationFrame(paso);
  }

  /* ───────── utilidades de texto ───────── */
  function escapar(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function sinAcentos(s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function slug(s) { return sinAcentos(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

  /* ───────── aria-live ───────── */
  const vivo = doc.createElement('div'); vivo.className = 'sr'; vivo.setAttribute('aria-live', 'polite'); doc.body.appendChild(vivo);
  function anunciar(t) { vivo.textContent = ''; setTimeout(() => { vivo.textContent = t; }, 30); }

  /* ───────── toast global con Deshacer ───────── */
  const pila = doc.createElement('div'); pila.className = 'toasts'; pila.setAttribute('role', 'region'); pila.setAttribute('aria-label', 'Avisos');
  doc.body.appendChild(pila);
  const ICONO_TOAST = { ok: 'ph-check', error: 'ph-warning-circle', info: 'ph-info' };
  /**
   * toast({titulo, detalle, tipo:'ok'|'error'|'info', icono, deshacer: fn | {texto, fn}, accion:{texto, fn}, duracion})
   * 5 s (8 s con Deshacer), se pausa con mouse, foco o pestaña oculta; máximo 3 apilados. Devuelve {cerrar}.
   */
  function toast(o) {
    if (typeof o === 'string') o = { titulo: o };
    const tipo = o.tipo || 'ok';
    const des = typeof o.deshacer === 'function' ? { texto: 'Deshacer', fn: o.deshacer } : o.deshacer;
    const dur = o.duracion || (des ? 8000 : 5000);
    const el = doc.createElement('div'); el.className = 'toast'; el.setAttribute('role', tipo === 'error' ? 'alert' : 'status');
    el.innerHTML = `<span class="okc ${tipo}"><i class="ph ${o.icono || ICONO_TOAST[tipo]}" style="font-size:16px"></i></span><div class="tx"><b>${o.titulo}</b>${o.detalle ? `<small>${o.detalle}</small>` : ''}</div>` +
      (des ? `<button type="button" class="btn chico texto deshacer">${des.texto}</button>` : '') +
      (o.accion ? `<button type="button" class="btn chico texto deshacer accion">${o.accion.texto}</button>` : '') +
      `<button type="button" class="btn ic chico texto cierra" aria-label="Cerrar aviso"><i class="ph ph-x"></i></button><i class="tiempo" style="animation-duration:${dur}ms"></i>`;
    while (pila.children.length >= 3) quitar(pila.firstElementChild);
    pila.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('ver')));
    let resto = dur, inicio = Date.now(), timer = setTimeout(cerrar, resto), pausado = false;
    function pausar() { if (pausado) return; pausado = true; clearTimeout(timer); resto -= Date.now() - inicio; el.classList.add('pausa'); }
    function seguir() { if (!pausado) return; pausado = false; inicio = Date.now(); timer = setTimeout(cerrar, Math.max(1500, resto)); el.classList.remove('pausa'); }
    el.addEventListener('mouseenter', pausar); el.addEventListener('mouseleave', seguir);
    el.addEventListener('focusin', pausar); el.addEventListener('focusout', seguir);
    const vis = () => (doc.hidden ? pausar() : seguir()); doc.addEventListener('visibilitychange', vis);
    function cerrar() { clearTimeout(timer); doc.removeEventListener('visibilitychange', vis); quitar(el); }
    el.querySelector('.cierra').onclick = cerrar;
    if (des) el.querySelector('.deshacer:not(.accion)').onclick = () => { cerrar(); des.fn(); };
    if (o.accion) el.querySelector('.accion').onclick = () => { cerrar(); o.accion.fn(); };
    el._cerrar = cerrar;
    return { cerrar, el };
  }
  function quitar(el) {
    if (!el || el.classList.contains('sale')) return;
    el.classList.add('sale'); el.classList.remove('ver');
    setTimeout(() => el.remove(), quieto ? 0 : 200);
  }

  /* ───────── controles genéricos ───────── */
  // segmentados: .seg (salvo el del tema y los que tengan data-manual). Evento "cambio" con detail = data-v o texto.
  $$('.seg:not([data-tema-boton]):not([data-manual])').forEach(s => {
    const bs = $$('button', s);
    bs.forEach(b => { if (!b.hasAttribute('aria-pressed')) b.setAttribute('aria-pressed', b.classList.contains('on')); });
    bs.forEach(b => b.addEventListener('click', () => {
      bs.forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
      s.dispatchEvent(new CustomEvent('cambio', { detail: b.dataset.v ?? b.textContent.trim(), bubbles: true }));
    }));
  });
  // pestañas: .pestanas (role=tablist si no lo tiene)
  $$('.pestanas:not([data-manual])').forEach(p => {
    const bs = $$('button', p); p.setAttribute('role', 'tablist');
    bs.forEach(b => { b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', b.classList.contains('on')); });
    bs.forEach(b => b.addEventListener('click', () => {
      bs.forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
      p.dispatchEvent(new CustomEvent('cambio', { detail: b.dataset.v ?? b.textContent.trim(), bubbles: true }));
    }));
  });
  // casillas, checks e interruptores: alternan aria-checked y emiten "cambio"
  doc.addEventListener('click', e => {
    const c = e.target.closest('.toggle,.check,.casilla');
    if (!c || c.hasAttribute('data-manual')) return;
    const v = c.getAttribute('aria-checked') !== 'true';
    c.setAttribute('aria-checked', v);
    c.closest('.paso')?.classList.toggle('hecho', v);
    c.dispatchEvent(new CustomEvent('cambio', { detail: v, bubbles: true }));
  });

  /* ───────── tooltip: data-tip="Texto" (+ data-atajo="⌘K") ───────── */
  const tip = doc.createElement('div'); tip.className = 'tip'; tip.setAttribute('role', 'tooltip'); tip.id = 'bib-tip'; doc.body.appendChild(tip);
  let tipDe = null, tipTimer;
  function mostrarTip(el) {
    tipDe = el; clearTimeout(tipTimer);
    tip.innerHTML = escapar(el.dataset.tip) + (el.dataset.atajo ? `<span class="atajo">${escapar(el.dataset.atajo)}</span>` : '');
    const r = el.getBoundingClientRect();
    tip.style.left = '0px'; tip.style.top = '0px'; tip.classList.add('ver');
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    let x = r.left + r.width / 2 - tw / 2, y = r.top - th - 8;
    if (y < 8) y = r.bottom + 8;
    x = Math.max(8, Math.min(innerWidth - tw - 8, x));
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
    el.setAttribute('aria-describedby', 'bib-tip');
  }
  function ocultarTip() { tip.classList.remove('ver'); tipDe?.removeAttribute('aria-describedby'); tipDe = null; }
  doc.addEventListener('pointerover', e => { if (e.pointerType === 'touch') return; const el = e.target.closest('[data-tip]'); if (el && el !== tipDe) mostrarTip(el); });
  doc.addEventListener('pointerout', e => { const el = e.target.closest('[data-tip]'); if (el && !el.contains(e.relatedTarget)) tipTimer = setTimeout(ocultarTip, 60); });
  doc.addEventListener('focusin', e => { const el = e.target.closest('[data-tip]'); if (el && el.matches(':focus-visible')) mostrarTip(el); });
  doc.addEventListener('focusout', e => { if (e.target.closest('[data-tip]')) ocultarTip(); });
  addEventListener('scroll', ocultarTip, { passive: true });

  /* ───────── menús: <button data-menu="#id"> + <div class="menu" id="id" hidden> ───────── */
  let menuAbierto = null;
  function abrirMenu(boton, menu) {
    cerrarMenu();
    menu.hidden = false; menu.style.position = 'fixed'; menu.style.zIndex = 50;
    const r = boton.getBoundingClientRect(), mw = menu.offsetWidth, mh = menu.offsetHeight;
    let x = boton.dataset.menuLado === 'izq' ? r.left : r.right - mw, y = r.bottom + 6;
    if (y + mh > innerHeight - 8) y = r.top - mh - 6;
    menu.style.left = Math.max(8, Math.min(innerWidth - mw - 8, x)) + 'px'; menu.style.top = Math.max(8, y) + 'px';
    boton.setAttribute('aria-expanded', 'true');
    menuAbierto = { boton, menu };
    menu.animate?.([{ opacity: 0, transform: `translateY(${quieto ? 0 : -4}px) scale(.98)` }, { opacity: 1, transform: 'none' }], { duration: 140, easing: 'cubic-bezier(.23,1,.32,1)' });
    const items = itemsMenu(menu); marcar(items, 0);
  }
  function itemsMenu(menu) { return $$('button:not([aria-disabled=true]),a', menu); }
  function marcar(items, i) { items.forEach((x, j) => x.toggleAttribute('data-activo', j === i)); items[i]?.focus({ preventScroll: true }); }
  function cerrarMenu(devolver) {
    if (!menuAbierto) return;
    const { boton, menu } = menuAbierto; menu.hidden = true; boton.setAttribute('aria-expanded', 'false'); menuAbierto = null;
    if (devolver) boton.focus();
  }
  $$('[data-menu]').forEach(b => {
    const menu = $(b.dataset.menu); if (!menu) return;
    menu.hidden = true; menu.setAttribute('role', 'menu');
    $$('button,a', menu).forEach(x => x.setAttribute('role', 'menuitem'));
    doc.body.appendChild(menu); // fuera de todo contenedor con transform
    b.setAttribute('aria-haspopup', 'menu'); b.setAttribute('aria-expanded', 'false');
    b.addEventListener('click', e => { e.stopPropagation(); menuAbierto?.menu === menu ? cerrarMenu(true) : abrirMenu(b, menu); });
    menu.addEventListener('click', e => { const it = e.target.closest('[role=menuitem]'); if (it && it.getAttribute('aria-disabled') !== 'true') cerrarMenu(true); });
    menu.addEventListener('pointermove', e => { const it = e.target.closest('[role=menuitem]'); if (it) { const items = itemsMenu(menu); const i = items.indexOf(it); if (i >= 0) items.forEach((x, j) => x.toggleAttribute('data-activo', j === i)); } });
  });
  doc.addEventListener('click', e => { if (menuAbierto && !menuAbierto.menu.contains(e.target)) cerrarMenu(); });
  doc.addEventListener('keydown', e => {
    if (menuAbierto) {
      const items = itemsMenu(menuAbierto.menu); let i = items.findIndex(x => x.hasAttribute('data-activo'));
      if (e.key === 'ArrowDown') { e.preventDefault(); marcar(items, (i + 1) % items.length); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); marcar(items, (i - 1 + items.length) % items.length); }
      else if (e.key === 'Home') { e.preventDefault(); marcar(items, 0); }
      else if (e.key === 'End') { e.preventDefault(); marcar(items, items.length - 1); }
      else if (e.key === 'Escape' || e.key === 'Tab') { cerrarMenu(e.key === 'Escape'); }
      else if (e.key.length === 1) { const j = items.findIndex((x, k) => k > i && sinAcentos(x.textContent.trim()).startsWith(sinAcentos(e.key))); if (j >= 0) marcar(items, j); }
      return;
    }
    if (e.key === 'Escape') { if (tipDe) ocultarTip(); const ult = pila.lastElementChild; if (ult && ult._cerrar) ult._cerrar(); }
  });

  /* ───────── destello al llegar a una fila ───────── */
  function destellar(el) { if (!el) return; el.classList.remove('destello'); void el.offsetWidth; el.classList.add('destello'); el.scrollIntoView({ block: 'center', behavior: quieto ? 'auto' : 'smooth' }); }

  /* ───────── "Ver código" en cada lámina ───────── */
  function limpiarCodigo(html) {
    const lineas = html.replace(/^\s*\n/, '').replace(/\s+$/, '').split('\n');
    const sangria = Math.min(...lineas.filter(l => l.trim()).map(l => l.match(/^\s*/)[0].length));
    return lineas.map(l => l.slice(sangria)).join('\n');
  }
  function resaltar(src) {
    return escapar(src)
      .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="cm">$1</span>')
      .replace(/(&lt;\/?)([a-z][\w-]*)/g, '$1<span class="tg">$2</span>')
      .replace(/ ([\w:-]+)=(&quot;.*?&quot;)/g, ' <span class="at">$1</span>=<span class="vl">$2</span>');
  }
  const laminas = $$('.lamina');
  laminas.forEach((lam, n) => {
    if (!lam.id) lam.id = slug($('h2', lam)?.textContent || 'pieza-' + (n + 1));
    const demo = $(lam.dataset.codigoDe || '.demo', lam);
    if (!demo || lam.hasAttribute('data-sin-codigo')) return;
    const fuente = limpiarCodigo(FUENTES.get(lam) ?? demo.innerHTML);
    let cuerpo = $('.lamina-cuerpo', lam);
    if (!cuerpo) { cuerpo = doc.createElement('div'); cuerpo.className = 'lamina-cuerpo'; demo.before(cuerpo); cuerpo.appendChild(demo); }
    let pie = $('.lamina-pie', cuerpo);
    if (!pie) { pie = doc.createElement('div'); pie.className = 'lamina-pie'; cuerpo.appendChild(pie); }
    if (!$('.nota', pie)) pie.insertAdjacentHTML('afterbegin', '<span class="nota"></span>');
    const idc = lam.id + '-codigo';
    pie.insertAdjacentHTML('beforeend', `<button type="button" class="btn chico texto copia" hidden><i class="ph ph-copy"></i>Copiar</button><button type="button" class="btn chico ver-codigo" aria-expanded="false" aria-controls="${idc}"><i class="ph ph-code"></i>Ver código</button>`);
    cuerpo.insertAdjacentHTML('beforeend', `<div class="codigo" id="${idc}"><div><pre tabindex="0" aria-label="Código de ${escapar($('h2', lam)?.textContent || 'la pieza')}"><code>${resaltar(fuente)}</code></pre></div></div>`);
    const btn = $('.ver-codigo', pie), copia = $('.copia', pie), cod = $('.codigo', cuerpo);
    cod.inert = true;
    btn.addEventListener('click', () => {
      const abre = !lam.classList.contains('con-codigo');
      lam.classList.toggle('con-codigo', abre); btn.setAttribute('aria-expanded', abre); cod.inert = !abre;
      btn.lastChild.textContent = abre ? 'Ocultar código' : 'Ver código'; copia.hidden = !abre;
    });
    copia.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(fuente); toast({ titulo: 'Código copiado', detalle: $('h2', lam)?.textContent.trim() }); }
      catch { toast({ tipo: 'error', titulo: 'No pudimos copiar', detalle: 'Seleccioná el código y copialo a mano' }); }
    });
  });

  /* ───────── índice lateral que marca dónde estás ───────── */
  (function indice() {
    const pag = $('.bib-pag'); if (!pag || !laminas.length) return;
    let ind = $('.bib-indice', pag);
    if (!ind) { ind = doc.createElement('aside'); ind.className = 'bib-indice'; pag.prepend(ind); }
    ind.setAttribute('aria-label', 'Piezas de esta página');
    if (!ind.children.length) {
      const volver = ind.dataset.volver || 'index.html';
      ind.innerHTML = `<a class="volver" href="${volver}"><i class="ph ph-arrow-left"></i>Biblioteca</a><span class="rotulo-menu">${escapar(ind.dataset.titulo || 'En esta página')}</span>` +
        laminas.map((l, i) => `<a class="it" href="#${l.id}"><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="trunca">${escapar(l.dataset.nombre || $('h2', l)?.childNodes[0]?.textContent.trim() || l.id)}</span></a>`).join('');
    }
    const links = $$('a.it', ind);
    const porId = Object.fromEntries(links.map(a => [a.hash.slice(1), a]));
    let actual = null;
    function marcarActual(id) {
      if (id === actual || !porId[id]) return; actual = id;
      links.forEach(a => a.setAttribute('aria-current', a === porId[id]));
      const a = porId[id];
      if (ind.scrollWidth > ind.clientWidth + 4) ind.scrollTo({ left: a.offsetLeft - 24, behavior: quieto ? 'auto' : 'smooth' });
      else if (a.offsetTop < ind.scrollTop || a.offsetTop > ind.scrollTop + ind.clientHeight - 40) ind.scrollTo({ top: a.offsetTop - 80 });
    }
    // la actual es la última lámina cuyo borde de arriba pasó el 30 % de la ventana (al fondo, la última)
    let pendiente = false;
    function espiar() {
      pendiente = false;
      const corte = innerHeight * 0.3; let id = laminas[0].id;
      for (const l of laminas) { if (l.getBoundingClientRect().top <= corte) id = l.id; else break; }
      if (innerHeight + scrollY >= doc.documentElement.scrollHeight - 4) id = laminas[laminas.length - 1].id;
      marcarActual(id);
    }
    addEventListener('scroll', () => { if (!pendiente) { pendiente = true; requestAnimationFrame(espiar); } }, { passive: true });
    addEventListener('resize', espiar);
    const desborda = () => ind.classList.toggle('desborda', ind.scrollHeight > ind.clientHeight + 4);
    desborda(); addEventListener('resize', desborda);
    if (location.hash && porId[location.hash.slice(1)]) marcarActual(location.hash.slice(1)); else espiar();
    addEventListener('hashchange', () => { const id = location.hash.slice(1); marcarActual(id); });
  })();

  /* ───────── cifras con data-cuenta (y data-dec) al cargar ───────── */
  $$('[data-cuenta]').forEach(el => { const fin = +el.dataset.cuenta; if (!isNaN(fin)) cuenta(el, fin, { dec: +el.dataset.dec || 0 }); });

  window.bib = {
    $, $$, quieto, HOY, ZONA,
    tema, leer, guardar,
    fmt, colorDe, monograma, avatar,
    curva, linea, ticks, bloques, anillo, cuenta,
    toast, anunciar, destellar, abrirMenu, cerrarMenu,
    escapar, sinAcentos, slug,
  };
})();
