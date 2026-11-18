// Utilidades de calendario y tiempo. Sin dependencias, sin zona horaria:
// los días viajan como "AAAA-MM-DD" y las horas como minutos desde medianoche.
// "Hoy" y "ahora" llegan siempre del server (todayAR), nunca del navegador.

/** Día de calendario: "2026-11-18". */
export type Dia = string
/** Minutos desde las 00:00 (0–1440). */
export type Minutos = number

/** Tipos de evento con su color fijo (galería: 10-tiempo.html, "Evento con tinte y borde"). */
export type TipoEvento = 'cliente' | 'interno' | 'entrega' | 'visita' | 'cobro'

export const COLOR_TIPO: Record<TipoEvento, string> = {
  cliente: 'var(--e1, #3b6fe0)',
  cobro: 'var(--e2, #d6336c)',
  visita: 'var(--e3, #c8692b)',
  entrega: 'var(--e4, #25a866)',
  interno: 'var(--e5, #7c5ce0)',
}

export const NOMBRE_TIPO: Record<TipoEvento, string> = {
  cliente: 'Cliente',
  interno: 'Interno',
  entrega: 'Entrega',
  visita: 'Visita',
  cobro: 'Cobro',
}

export type EstadoEvento = 'confirmado' | 'tentativo' | 'cancelado'

export type EventoTiempo = {
  id: string
  titulo: string
  dia: Dia
  inicio: Minutos
  fin: Minutos
  tipo: TipoEvento
  estado?: EstadoEvento
  /** Todo el día: va en la franja de arriba, no en la grilla. */
  todoElDia?: boolean
  lugar?: string
  /** Nombres de quienes van (se muestran como iniciales). */
  personas?: string[]
}

/** Momento actual que manda el server. */
export type Ahora = { dia: Dia; min: Minutos }

export const DIAS_CORTOS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'] as const
export const DIAS_LARGOS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'] as const
export const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'] as const
export const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'] as const

const partes = (d: Dia) => {
  const [a = 1970, m = 1, n = 1] = d.split('-').map(Number)
  return { a, m, n }
}
const utc = (d: Dia) => {
  const { a, m, n } = partes(d)
  return new Date(Date.UTC(a, m - 1, n))
}
const aDia = (f: Date): Dia => f.toISOString().slice(0, 10)

export const sumarDias = (d: Dia, n: number): Dia => {
  const f = utc(d)
  f.setUTCDate(f.getUTCDate() + n)
  return aDia(f)
}
export const diferenciaDias = (a: Dia, b: Dia) => Math.round((utc(a).getTime() - utc(b).getTime()) / 86400000)
/** 0 = domingo … 6 = sábado. */
export const diaSemana = (d: Dia) => utc(d).getUTCDay()
export const numeroDia = (d: Dia) => partes(d).n
export const mesDe = (d: Dia) => partes(d).m - 1
export const anioDe = (d: Dia) => partes(d).a
export const primeroDelMes = (d: Dia): Dia => d.slice(0, 8) + '01'
export const sumarMeses = (d: Dia, n: number): Dia => {
  const { a, m } = partes(d)
  const f = new Date(Date.UTC(a, m - 1 + n, 1))
  return aDia(f)
}
/** Lunes de la semana del día. */
export const lunesDe = (d: Dia): Dia => sumarDias(d, -((diaSemana(d) + 6) % 7))
export const semanaDe = (d: Dia, dias = 7): Dia[] => Array.from({ length: dias }, (_, i) => sumarDias(lunesDe(d), i))
/** Grilla de 6 semanas que arranca en lunes, para un mes. */
export const grillaMes = (mes: Dia): Dia[] => {
  const inicio = lunesDe(primeroDelMes(mes))
  return Array.from({ length: 42 }, (_, i) => sumarDias(inicio, i))
}

/** 570 → "09:30". */
export const hm = (m: Minutos) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(Math.round(m % 60)).padStart(2, '0')}`
/** 90 → "1 h 30 min"; 45 → "45 min"; 120 → "2 h". */
export const duracion = (m: Minutos) => {
  const h = Math.floor(m / 60)
  const r = Math.round(m % 60)
  if (!h) return `${r} min`
  return r ? `${h} h ${r} min` : `${h} h`
}
/** "en 12 min", "en 2 h", "hace 5 min". */
export const relativo = (m: Minutos) => {
  const a = Math.abs(Math.round(m))
  const t = a < 60 ? `${a} min` : a % 60 ? `${Math.floor(a / 60)} h ${a % 60} min` : `${a / 60} h`
  return m >= 0 ? `en ${t}` : `hace ${t}`
}
/** "mié 18 nov". */
export const fechaCorta = (d: Dia) => `${DIAS_CORTOS[diaSemana(d)]} ${numeroDia(d)} ${MESES_CORTOS[mesDe(d)]}`
/** "miércoles 18 de noviembre". */
export const fechaLarga = (d: Dia) => `${DIAS_LARGOS[diaSemana(d)]} ${numeroDia(d)} de ${MESES[mesDe(d)]}`
/** "Hoy", "Mañana", "Ayer" o la fecha corta. */
export const fechaHablada = (d: Dia, hoy: Dia) => {
  const n = diferenciaDias(d, hoy)
  return n === 0 ? 'Hoy' : n === 1 ? 'Mañana' : n === -1 ? 'Ayer' : fechaCorta(d)
}
export const rangoDias = (a: Dia, b: Dia) =>
  mesDe(a) === mesDe(b)
    ? `${numeroDia(a)} – ${numeroDia(b)} ${MESES_CORTOS[mesDe(b)]}`
    : `${numeroDia(a)} ${MESES_CORTOS[mesDe(a)]} – ${numeroDia(b)} ${MESES_CORTOS[mesDe(b)]}`

export type Momento = 'pasado' | 'encurso' | 'futuro'
export const momentoDe = (e: Pick<EventoTiempo, 'dia' | 'inicio' | 'fin'>, ahora?: Ahora): Momento => {
  if (!ahora) return 'futuro'
  const d = diferenciaDias(e.dia, ahora.dia)
  if (d < 0 || (d === 0 && e.fin <= ahora.min)) return 'pasado'
  if (d === 0 && e.inicio <= ahora.min) return 'encurso'
  return 'futuro'
}

/** Reparte los eventos que se pisan en columnas lado a lado (como Google Calendar). */
export function columnas<T extends Pick<EventoTiempo, 'inicio' | 'fin'>>(eventos: T[]): Array<T & { col: number; cols: number }> {
  const orden = [...eventos].sort((a, b) => a.inicio - b.inicio || b.fin - a.fin)
  const salida: Array<T & { col: number; cols: number }> = []
  let grupo: Array<T & { col: number; cols: number }> = []
  let finGrupo = -1
  const cerrar = () => {
    const n = Math.max(1, ...grupo.map(g => g.col + 1))
    grupo.forEach(g => (g.cols = n))
    salida.push(...grupo)
    grupo = []
  }
  for (const e of orden) {
    if (e.inicio >= finGrupo && grupo.length) cerrar()
    const ocupadas = new Set(grupo.filter(g => g.fin > e.inicio).map(g => g.col))
    let col = 0
    while (ocupadas.has(col)) col++
    grupo.push({ ...e, col, cols: 1 })
    finGrupo = Math.max(finGrupo, e.fin)
  }
  if (grupo.length) cerrar()
  return salida
}

/** Huecos libres de un día entre `desde` y `hasta`, de al menos `minimo` minutos. */
export function huecos(eventos: Array<Pick<EventoTiempo, 'inicio' | 'fin'>>, desde: Minutos, hasta: Minutos, minimo: Minutos) {
  const ocupado = [...eventos].sort((a, b) => a.inicio - b.inicio)
  const libres: Array<{ inicio: Minutos; fin: Minutos }> = []
  let cursor = desde
  for (const e of ocupado) {
    if (e.inicio - cursor >= minimo) libres.push({ inicio: cursor, fin: Math.min(e.inicio, hasta) })
    cursor = Math.max(cursor, e.fin)
  }
  if (hasta - cursor >= minimo) libres.push({ inicio: cursor, fin: hasta })
  return libres
}

export const iniciales = (nombre: string) => {
  const p = nombre.trim().split(/\s+/).filter(Boolean)
  if (!p.length) return '·'
  if (p.length === 1) return (p[0] ?? '').slice(0, 2).toUpperCase()
  return ((p[0] ?? '')[0]! + (p[p.length - 1] ?? '')[0]!).toUpperCase()
}

export const describirEvento = (e: EventoTiempo, ahora?: Ahora) => {
  const m = momentoDe(e, ahora)
  const hora = e.todoElDia ? 'todo el día' : `${hm(e.inicio)} a ${hm(e.fin)}`
  const est = e.estado === 'cancelado' ? ', cancelado' : e.estado === 'tentativo' ? ', sin confirmar' : ''
  const cuando = m === 'encurso' ? ', en curso' : m === 'pasado' ? ', ya pasó' : ''
  return `${e.titulo}, ${fechaLarga(e.dia)}, ${hora}${e.lugar ? ', ' + e.lugar : ''}${est}${cuando}`
}
