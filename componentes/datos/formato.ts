/*
 * Formato de datos (SKILL.md §6c). Todo pasa por acá: nunca `toFixed`, `toLocaleString()`
 * sin idioma ni `new Date()` del navegador para decidir "hoy".
 *
 * - Idioma fijo es-AR: 1.234.567,89
 * - Zona fija America/Argentina/Buenos_Aires: el server corre en UTC y "hoy" tiene que ser el de acá.
 * - Fechas solo-día ("2026-11-17") se leen como día calendario, sin pasar por UTC.
 */

export const IDIOMA = 'es-AR'
export const ZONA = 'America/Argentina/Buenos_Aires'
/** Lo que se muestra cuando no hay dato. Siempre en gris (`text-texto-3`). */
export const VACIO = '—'
/** Espacio fino que no corta: "12,4 %" no se parte en dos renglones. */
export const ESPACIO_FINO = ' '
/** Signo menos tipográfico (no el guion). */
export const MENOS = '−'

export type Moneda = 'ARS' | 'USD'
export type Fecha = Date | string | number
type Nulo = null | undefined

const cacheNum = new Map<string, Intl.NumberFormat>()
const nf = (min = 0, max = min) => {
  const k = `${min}-${max}`
  let f = cacheNum.get(k)
  if (!f) {
    f = new Intl.NumberFormat(IDIOMA, { minimumFractionDigits: min, maximumFractionDigits: max })
    cacheNum.set(k, f)
  }
  return f
}

const esNumero = (n: number | Nulo): n is number => typeof n === 'number' && Number.isFinite(n)

/** "—" para null, undefined, '' y NaN. Nunca "0", "null" ni "undefined". */
export const vacio = (v: unknown): string =>
  v == null || v === '' || (typeof v === 'number' && !Number.isFinite(v)) ? VACIO : String(v)

/** 1.234.567 · con decimales: numero(3.5, 1) → "3,5" */
export const numero = (n: number | Nulo, decimales = 0): string =>
  esNumero(n) ? nf(0, decimales).format(n) : VACIO

/** Símbolo de cada moneda. Si conviven monedas, el código va en gris y nunca se suman. */
export const simbolo = (moneda: Moneda = 'ARS') => (moneda === 'USD' ? 'US$' : '$')

/**
 * Monto en partes, para pintar el símbolo y los centavos en `texto-3` y un paso más chicos:
 * <span className="text-texto-3">{p.simbolo}</span> {p.entero}<span className="text-texto-3">{p.centavos}</span>
 */
export function montoPartes(n: number | Nulo, moneda: Moneda = 'ARS', centavos = false) {
  if (!esNumero(n)) return { signo: '', simbolo: simbolo(moneda), entero: VACIO, centavos: '' }
  const txt = nf(centavos ? 2 : 0).format(Math.abs(n))
  const [entero, dec] = txt.split(',')
  return { signo: n < 0 ? MENOS : '', simbolo: simbolo(moneda), entero, centavos: dec ? `,${dec}` : '' }
}

/** Completo, para tablas: "US$ 18.400" · con centavos: "$ 24.957,81" · negativo: "−$ 1.200" */
export function monto(n: number | Nulo, moneda: Moneda = 'ARS', centavos = false): string {
  if (!esNumero(n)) return VACIO
  const p = montoPartes(n, moneda, centavos)
  return `${p.signo}${p.simbolo} ${p.entero}${p.centavos}`
}

/** Número abreviado sin moneda: 950 → "950" · 40.000 → "40 mil" · 1.234.567 → "1,2 M" · 2.300.000.000 → "2,3 mil M" */
export function numeroCorto(n: number | Nulo): string {
  if (!esNumero(n)) return VACIO
  const a = Math.abs(n), s = n < 0 ? MENOS : ''
  if (a >= 1e9) return `${s}${nf(0, 1).format(a / 1e9)} mil M`
  if (a >= 1e6) return `${s}${nf(0, 1).format(a / 1e6)} M`
  if (a >= 1e4) return `${s}${nf(0, 1).format(a / 1e3)} mil`
  return `${s}${nf(0).format(a)}`
}

/** Para tarjetas y ejes: "US$ 184,2 mil", "$ 1,2 M". En tablas va `monto` completo. */
export const montoCorto = (n: number | Nulo, moneda: Moneda = 'ARS'): string =>
  esNumero(n) ? `${n < 0 ? MENOS : ''}${simbolo(moneda)} ${numeroCorto(Math.abs(n))}` : VACIO

/** 0..100 → "71 %" · porcentaje(12.44, 1) → "12,4 %" */
export const porcentaje = (p: number | Nulo, decimales = 0): string =>
  esNumero(p) ? `${nf(0, decimales).format(p)}${ESPACIO_FINO}%` : VACIO

/** Participación de una parte en un total, sin dividir por cero. */
export const participacion = (parte: number, total: number) => (total ? (parte / total) * 100 : 0)

/** Variación porcentual entre dos valores. null si no hay base para comparar. */
export const variacion = (actual: number | Nulo, anterior: number | Nulo): number | null =>
  esNumero(actual) && esNumero(anterior) && anterior !== 0 ? ((actual - anterior) / Math.abs(anterior)) * 100 : null

export type UnidadDelta = '%' | 'pts' | ''

/** "+12,4 %", "−4 pts", "+3", "0 %". El signo lo pone el número; el color lo decide `tonoDelta`. */
export function delta(p: number | Nulo, unidad: UnidadDelta = '%', decimales = 1): string {
  if (!esNumero(p)) return VACIO
  const r = Number(p.toFixed(decimales))
  const signo = r > 0 ? '+' : r < 0 ? MENOS : ''
  const cola = unidad === '%' ? `${ESPACIO_FINO}%` : unidad ? ` ${unidad}` : ''
  return `${signo}${nf(0, decimales).format(Math.abs(r))}${cola}`
}

/**
 * Para qué lado es bueno que se mueva el número. Lo decide el negocio, no el signo:
 * si baja la mora es bueno (verde); si bajan los ingresos es malo (rojo).
 */
export type Sentido = 'subir-es-bueno' | 'bajar-es-bueno' | 'neutro'
export type TonoDelta = 'bueno' | 'malo' | 'neutro'

export function tonoDelta(p: number | Nulo, sentido: Sentido = 'subir-es-bueno', umbral = 0): TonoDelta {
  if (!esNumero(p) || sentido === 'neutro' || Math.abs(p) <= umbral) return 'neutro'
  return (p > 0) === (sentido === 'subir-es-bueno') ? 'bueno' : 'malo'
}

/* ── Fechas ─────────────────────────────────────────────────────────────── */

const cacheFecha = new Map<string, Intl.DateTimeFormat>()
const df = (o: Intl.DateTimeFormatOptions, zona = ZONA) => {
  const k = zona + JSON.stringify(o)
  let f = cacheFecha.get(k)
  if (!f) {
    f = new Intl.DateTimeFormat(IDIOMA, { timeZone: zona, ...o })
    cacheFecha.set(k, f)
  }
  return f
}

const SOLO_DIA = /^\d{4}-\d{2}-\d{2}$/

/** Lee la fecha. "2026-11-17" queda como día calendario (mediodía UTC, nunca cambia de día al mostrarse). */
export function aFecha(f: Fecha | Nulo): Date | null {
  if (f == null || f === '') return null
  if (typeof f === 'string' && SOLO_DIA.test(f)) return new Date(`${f}T12:00:00Z`)
  const d = f instanceof Date ? f : new Date(f)
  return Number.isNaN(d.getTime()) ? null : d
}

/** Día calendario en la zona: "2026-11-17". Sirve para comparar días sin líos de UTC. */
export function diaClave(f: Fecha, zona = ZONA): string {
  if (typeof f === 'string' && SOLO_DIA.test(f)) return f
  const d = aFecha(f)
  if (!d) return ''
  return df({ year: 'numeric', month: '2-digit', day: '2-digit' }, zona).format(d).split('/').reverse().join('-')
}

/** Hoy en la zona del negocio ("2026-11-17"). Usarlo en el server, nunca el reloj del navegador. */
export const hoy = (zona = ZONA) => diaClave(new Date(), zona)

const diasEntre = (a: string, b: string) =>
  Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 864e5)

const sinPunto = (s: string) => s.replace(/\./g, '')

/** "16:00" (24 h) */
export const hora = (f: Fecha | Nulo, zona = ZONA): string => {
  const d = aFecha(f)
  return d ? df({ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }, zona).format(d) : VACIO
}

/** "9 dic" si es de este año, "9 dic 2025" si no. */
export function fechaCorta(f: Fecha | Nulo, ahora: Fecha = new Date(), zona = ZONA): string {
  const d = aFecha(f)
  if (!d) return VACIO
  const z = typeof f === 'string' && SOLO_DIA.test(f) ? 'UTC' : zona
  const mismoAnio = diaClave(d, z).slice(0, 4) === diaClave(ahora, zona).slice(0, 4)
  // es-AR con año da "9 de dic de 2025": se arma a mano con las partes.
  const p = df({ day: 'numeric', month: 'short', year: 'numeric' }, z).formatToParts(d)
  const parte = (t: Intl.DateTimeFormatPartTypes) => sinPunto(p.find((x) => x.type === t)?.value ?? '')
  return mismoAnio ? `${parte('day')} ${parte('month')}` : `${parte('day')} ${parte('month')} ${parte('year')}`
}

/** "nov 2026" · "nov" si es de este año (ejes y períodos). */
export function mesCorto(f: Fecha | Nulo, conAnio = false, zona = ZONA): string {
  const d = aFecha(f)
  if (!d) return VACIO
  const z = typeof f === 'string' && SOLO_DIA.test(f) ? 'UTC' : zona
  const p = df({ month: 'short', year: 'numeric' }, z).formatToParts(d)
  const mes = sinPunto(p.find((x) => x.type === 'month')?.value ?? '')
  return conAnio ? `${mes} ${p.find((x) => x.type === 'year')?.value ?? ''}` : mes
}

/**
 * Relativa si es cercana, corta si no:
 * "recién", "hace 8 min", "en 20 min", "hoy 16:00", "ayer 16:00", "mañana 09:00",
 * "hace 3 días", "en 5 días", y después "9 dic" / "9 dic 2025".
 * Las fechas solo-día ("2026-11-18") salen sin hora: "mañana", "ayer", "hoy".
 */
export function fechaRelativa(f: Fecha | Nulo, ahora: Fecha = new Date(), zona = ZONA): string {
  const d = aFecha(f)
  const a = aFecha(ahora)
  if (!d || !a) return VACIO
  const soloDia = typeof f === 'string' && SOLO_DIA.test(f)
  const dias = diasEntre(diaClave(a, zona), soloDia ? (f as string) : diaClave(d, zona))

  if (!soloDia) {
    const min = Math.round((d.getTime() - a.getTime()) / 6e4)
    if (Math.abs(min) < 1) return 'recién'
    if (Math.abs(min) < 60) return min < 0 ? `hace ${-min} min` : `en ${min} min`
  }
  const h = soloDia ? '' : ` ${hora(d, zona)}`
  if (dias === 0) return `hoy${h}`
  if (dias === -1) return `ayer${h}`
  if (dias === 1) return `mañana${h}`
  if (Math.abs(dias) <= 6) return dias < 0 ? `hace ${-dias} días` : `en ${dias} días`
  return fechaCorta(f, ahora, zona)
}

/** Días hasta una fecha (negativo = ya pasó). Para "vence en 3 días" / "venció hace 6 días". */
export const diasHasta = (f: Fecha | Nulo, ahora: Fecha = new Date(), zona = ZONA): number | null => {
  const d = aFecha(f)
  if (!d) return null
  const clave = typeof f === 'string' && SOLO_DIA.test(f) ? f : diaClave(d, zona)
  return diasEntre(diaClave(ahora, zona), clave)
}

/* ── Color por entidad ─────────────────────────────────────────────────── */

/**
 * Paleta fija para entidades (clientes, proyectos, personas, servicios). Seis tonos que se
 * distinguen entre sí, leen sobre blanco y sobre #18181b, y no chocan con los de estado.
 * El orden no se cambia nunca: cambiarlo le cambia el color a todo lo que ya existe.
 */
export const PALETA_ENTIDAD = ['#3b6fe0', '#d6336c', '#c8692b', '#25a866', '#7c5ce0', '#0e9aa7'] as const
export type ColorEntidad = (typeof PALETA_ENTIDAD)[number]

/** El mismo id siempre da el mismo color (hash estable, igual en server y cliente). */
export function colorDe(id: string | number): ColorEntidad {
  const s = String(id)
  let h = 7
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return PALETA_ENTIDAD[h % PALETA_ENTIDAD.length]
}

/** Fondo pastel del color (para monogramas y tiles): mezcla al 12 % con la superficie. */
export const fondoDe = (color: string, pct = 12) => `color-mix(in oklch, ${color} ${pct}%, var(--color-superficie, #fff))`

/** Iniciales para el monograma: "Lucía Gómez" → "LG", "Orbe" → "OR". */
export function iniciales(nombre: string | Nulo): string {
  const p = (nombre ?? '').trim().split(/\s+/).filter(Boolean)
  if (!p.length) return '?'
  return (p.length === 1 ? p[0].slice(0, 2) : p[0][0] + p[p.length - 1][0]).toLocaleUpperCase(IDIOMA)
}

/* ── Formatos por nombre (serializables: se pueden pasar de un Server Component a uno de cliente) ── */

export type NombreFormato = 'numero' | 'monto' | 'montoCorto' | 'numeroCorto' | 'porcentaje'

export function formatear(n: number | Nulo, formato: NombreFormato = 'numero', o: { moneda?: Moneda; decimales?: number } = {}): string {
  switch (formato) {
    case 'monto': return monto(n, o.moneda, (o.decimales ?? 0) > 0)
    case 'montoCorto': return montoCorto(n, o.moneda)
    case 'numeroCorto': return numeroCorto(n)
    case 'porcentaje': return porcentaje(n, o.decimales)
    default: return numero(n, o.decimales)
  }
}

/** Escala "linda" para ejes: cortes redondos de 0 al primer múltiplo que cubre el máximo (≈4 tramos). */
export function escalaLinda(max: number, tramos = 4): number[] {
  if (!(max > 0)) return [0, 1]
  const crudo = max / tramos
  const pot = 10 ** Math.floor(Math.log10(crudo))
  const paso = ([1, 2, 2.5, 5, 10].find((m) => m * pot >= crudo) ?? 10) * pot
  const n = Math.max(1, Math.ceil(max / paso - 1e-9))
  return Array.from({ length: n + 1 }, (_, i) => Number((i * paso).toPrecision(12)))
}
