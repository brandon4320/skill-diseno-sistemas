'use client'

// Validación según SKILL.md §5: primer chequeo al salir (o al intentar guardar), desde ahí en vivo.
// Nunca rojo mientras se escribe la primera vez; el botón principal no se apaga.
import { useCallback, useMemo, useRef, useState } from 'react'
import type { Mensaje } from './_campo'

/** Una regla devuelve null si está bien, o el mensaje (error frena, aviso no). */
export type Regla<V> = (valor: V, todos: Record<string, unknown>) => Omit<Mensaje, 'accion'> & { usar?: string } | null

export type UseValidacionOpciones<C extends string> = {
  valores: Record<C, string>
  reglas: Partial<Record<C, Regla<string>>>
  /** Para la corrección como botón: escribe el valor sugerido. */
  alCorregir?: (campo: C, valor: string) => void
}

/**
 * const v = useValidacion({ valores, reglas, alCorregir })
 * <CampoX mensaje={v.mensaje('cuit')} {...v.eventos('cuit')} />
 * <form onSubmit={e => { e.preventDefault(); if (v.intentar()) guardar() }}>  ← si falta algo, enfoca el primero
 * {v.faltan > 0 && <>Faltan {v.faltan} para crear · <button onClick={v.irAlPrimero}>Revisar</button></>}
 */
export function useValidacion<C extends string>({ valores, reglas, alCorregir }: UseValidacionOpciones<C>) {
  const [tocados, setTocados] = useState<Set<C>>(() => new Set())
  const [intentado, setIntentado] = useState(false)
  const refs = useRef(new Map<C, HTMLElement | null>())

  const evaluar = useCallback((c: C) => reglas[c]?.(valores[c] ?? '', valores) ?? null, [reglas, valores])

  const mensaje = useCallback(
    (c: C): Mensaje | null => {
      if (!tocados.has(c) && !intentado) return null
      const r = evaluar(c)
      if (!r) return null
      const { usar, ...resto } = r
      return usar && alCorregir ? { ...resto, accion: { texto: `Usar ${usar}`, alUsar: () => alCorregir(c, usar) } } : resto
    },
    [tocados, intentado, evaluar, alCorregir],
  )

  const campos = Object.keys(reglas) as C[]
  const conError = useMemo(() => campos.filter((c) => evaluar(c)?.tipo === 'error'), [campos, evaluar])

  const eventos = (c: C) => ({
    ref: (el: HTMLElement | null) => { refs.current.set(c, el) },
    onBlur: () => { if ((valores[c] ?? '').trim()) setTocados((t) => (t.has(c) ? t : new Set(t).add(c))) },
  })

  const irAlPrimero = () => {
    const el = refs.current.get(conError[0] as C)
    if (!el) return
    el.focus({ preventScroll: true })
    el.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    el.closest('[data-caja]')?.animate?.(
      [{ transform: 'translateX(0)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(0)' }],
      { duration: 320, easing: 'cubic-bezier(.23,1,.32,1)' },
    )
  }

  /** Al intentar guardar: marca todo y, si falta algo, va al primero. Devuelve true si se puede guardar. */
  const intentar = () => {
    setIntentado(true)
    if (conError.length) { requestAnimationFrame(irAlPrimero); return false }
    return true
  }

  const reiniciar = () => { setTocados(new Set()); setIntentado(false) }

  return { mensaje, eventos, intentar, irAlPrimero, reiniciar, faltan: intentado ? conError.length : 0 }
}

/* ───────── reglas y correcciones comunes ───────── */

/** Dígito verificador del CUIT/CUIL con los 10 primeros números. */
export function digitoCuit(diez: string) {
  const w = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]
  const s = w.reduce((a, p, i) => a + p * Number(diez[i]), 0)
  const r = 11 - (s % 11)
  return r === 11 ? 0 : r === 10 ? 9 : r
}
export const formatearCuit = (d: string) => `${d.slice(0, 2)}-${d.slice(2, 10)}-${d.slice(10)}`

export const reglaCuit: Regla<string> = (v) => {
  const d = v.replace(/\D/g, '')
  if (!d) return { tipo: 'error', texto: 'Falta el CUIT.' }
  if (d.length < 11) return { tipo: 'error', texto: `Faltan ${11 - d.length} ${11 - d.length === 1 ? 'número' : 'números'}: son 11.` }
  if (d.length > 11) return { tipo: 'error', texto: `Sobran ${d.length - 11}: son 11 números.` }
  const dv = digitoCuit(d)
  return dv === Number(d[10]) ? null : { tipo: 'error', texto: `El último número no coincide: termina en ${dv}.`, usar: formatearCuit(d.slice(0, 10) + dv) }
}

const DOMINIOS = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com.ar', 'live.com.ar']
function distancia(a: string, b: string) {
  const m = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array<number>(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) m[0][j] = j
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
  return m[a.length][b.length]
}

/** "sofia@orbe.con.ar" → "sofia@orbe.com.ar"; usa también los dominios de tus clientes. */
export function sugerirCorreo(v: string, dominiosConocidos: readonly string[] = []) {
  const [usuario, dom] = v.trim().toLowerCase().split('@')
  if (!usuario || !dom) return null
  let d = dom.replace(/\.con(\.|$)/, '.com$1').replace(/\.cm(\.|$)/, '.com$1')
  const lista = [...dominiosConocidos, ...DOMINIOS]
  if (!lista.includes(d)) {
    const cerca = lista.map((x) => [x, distancia(d, x)] as const).sort((a, b) => a[1] - b[1])[0]
    if (cerca && cerca[1] <= 2) d = cerca[0]
  }
  return d !== dom ? `${usuario}@${d}` : null
}

export const reglaCorreo = (dominios: readonly string[] = []): Regla<string> => (v) => {
  const s = v.trim()
  if (!s) return { tipo: 'error', texto: 'Falta el correo.' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s)) return { tipo: 'error', texto: s.includes('@') ? 'Le falta el dominio completo, como empresa.com.ar.' : 'Le falta la @.' }
  const sug = sugerirCorreo(s, dominios)
  return sug ? { tipo: 'aviso', texto: `¿Es ${sug}?`, usar: sug } : null
}

/** "0291 15 456 7890" → "+54 9 291 456-7890" (celular argentino), o null si no tiene 10 números. */
export function normalizarCelular(v: string) {
  let d = v.replace(/\D/g, '').replace(/^54/, '').replace(/^9/, '').replace(/^0/, '')
  const m = d.match(/^(\d{2,4})15(\d{6,8})$/)
  if (m && (m[1] + m[2]).length === 10) d = m[1] + m[2]
  if (d.length !== 10) return null
  const largoArea = d.startsWith('11') ? 2 : 3
  const area = d.slice(0, largoArea), n = d.slice(largoArea)
  return `+54 9 ${area} ${n.slice(0, -4)}-${n.slice(-4)}`
}
