// Fechas como día calendario (sin horas ni UTC) para los campos de fecha, rango y hora.

export const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'] as const
export const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'] as const
export const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'] as const

/** Feriados por "AAAA-MM-DD" → nombre. Pasalos desde el sistema (cambian por año). */
export type Feriados = Record<string, string>

export const diaDe = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
export const masDias = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
export const mismoDia = (a?: Date | null, b?: Date | null) => !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
export const finDeMes = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0)
export const clave = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const diferenciaDias = (a: Date, b: Date) => Math.round((diaDe(a).getTime() - diaDe(b).getTime()) / 864e5)

/** "18 dic" (con año si no es el de hoy). */
export function fechaCorta(d: Date, hoy = new Date()) {
  return `${d.getDate()} ${MESES_CORTOS[d.getMonth()]}${d.getFullYear() !== hoy.getFullYear() ? ' ' + d.getFullYear() : ''}`
}
/** "viernes 18 dic". */
export const fechaLarga = (d: Date, hoy = new Date()) => `${DIAS[d.getDay()]} ${fechaCorta(d, hoy)}`
/** "18/12/2026". */
export const fechaNumerica = (d: Date) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
/** "hoy", "mañana", "en 30 días", "hace 3 días". */
export function relativa(d: Date, hoy = new Date()) {
  const n = diferenciaDias(d, hoy)
  return n === 0 ? 'hoy' : n === 1 ? 'mañana' : n === -1 ? 'ayer' : n > 0 ? `en ${n} días` : `hace ${-n} días`
}

/** Días hábiles entre a y b (inclusive), sin fines de semana ni feriados. */
export function habiles(a: Date, b: Date, feriados: Feriados = {}) {
  let n = 0
  for (let d = diaDe(a); d <= b; d = masDias(d, 1)) if (d.getDay() % 6 !== 0 && !feriados[clave(d)]) n++
  return n
}

const sinAcentos = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/**
 * Lee una fecha escrita como se dice: "hoy", "mañana", "pasado", "vie", "+30", "en 15 días",
 * "fin de mes", "15/12", "15-12-26", "15/12/2026". Sin año, toma la próxima vez que cae.
 * Devuelve null si está vacío y 'invalida' si no se entiende o no existe (31/11).
 */
export function interpretarFecha(texto: string, hoy = new Date()): Date | null | 'invalida' {
  const s = sinAcentos(texto.trim()).replace(/\s+/g, ' ')
  const base = diaDe(hoy)
  if (!s) return null
  if (s === 'hoy') return base
  if (s === 'manana') return masDias(base, 1)
  if (s === 'pasado' || s === 'pasado manana') return masDias(base, 2)
  if (s === 'fin de mes' || s === 'fin') return finDeMes(base)
  let m = s.match(/^(?:\+|en )(\d{1,3})(?: ?d| dias?)?$/)
  if (m) return masDias(base, Number(m[1]))
  const dias = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab']
  const i = dias.findIndex((d) => s.startsWith(d) && s.length <= 9)
  if (i >= 0) return masDias(base, (i - base.getDay() + 7) % 7 || 7)
  m = s.match(/^(\d{1,2})[/\-. ](\d{1,2})(?:[/\-. ](\d{2,4}))?$/)
  if (!m) return 'invalida'
  const dia = Number(m[1]), mes = Number(m[2])
  let anio = m[3] ? Number(m[3]) : base.getFullYear()
  if (anio < 100) anio += 2000
  let f = new Date(anio, mes - 1, dia)
  if (!m[3] && f < base) f = new Date(anio + 1, mes - 1, dia)
  return f.getMonth() === mes - 1 && f.getDate() === dia ? f : 'invalida'
}

/** "930" → 570 (minutos), "14" → 840, "14:15" / "1415" → 855. null si no es una hora. */
export function interpretarHora(texto: string): number | null {
  const s = texto.replace(/\s|hs?\.?$/gi, '')
  let m: RegExpMatchArray | string[] | null = s.match(/^(\d{1,2})(?:[:.,h]?(\d{2}))?$/)
  if (!m) {
    const d = s.replace(/\D/g, '')
    if (d.length === 3 || d.length === 4) m = ['', d.slice(0, -2), d.slice(-2)]
  }
  if (!m) return null
  const h = Number(m[1]), min = Number(m[2] || 0)
  return h < 24 && min < 60 ? h * 60 + min : null
}

/** 570 → "09:30". */
export const horaTexto = (min: number) => `${String(Math.floor(min / 60) % 24).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`
