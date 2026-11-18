'use client'

import {
  cloneElement,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
} from 'react'
import { cx } from '../base/utilidades'

type Hijo = ReactElement<{
  'aria-describedby'?: string
  onPointerEnter?: (e: PointerEvent) => void
  onPointerLeave?: (e: PointerEvent) => void
  onFocus?: (e: FocusEvent) => void
  onBlur?: (e: FocusEvent) => void
}>

function useCapa(retardo: number) {
  const [visible, setVisible] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => {
    if (!visible) return
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setVisible(false)
    document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [visible])
  useEffect(() => () => clearTimeout(timer.current), [])
  const abrir = (ya = false) => {
    clearTimeout(timer.current)
    if (ya) setVisible(true)
    else timer.current = setTimeout(() => setVisible(true), retardo)
  }
  const cerrar = () => {
    clearTimeout(timer.current)
    setVisible(false)
  }
  return { visible, abrir, cerrar }
}

function conDisparadores(hijo: Hijo, id: string, abrir: (ya?: boolean) => void, cerrar: () => void) {
  return cloneElement(hijo, {
    'aria-describedby': id,
    onPointerEnter: (e: PointerEvent) => {
      hijo.props.onPointerEnter?.(e)
      if (e.pointerType !== 'touch') abrir()
    },
    onPointerLeave: (e: PointerEvent) => {
      hijo.props.onPointerLeave?.(e)
      cerrar()
    },
    onFocus: (e: FocusEvent) => {
      hijo.props.onFocus?.(e)
      abrir(true)
    },
    onBlur: (e: FocusEvent) => {
      hijo.props.onBlur?.(e)
      cerrar()
    },
  })
}

const CAPA =
  'pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 transition-[opacity,transform] duration-[120ms] ease-[cubic-bezier(.23,1,.32,1)]'

export type TooltipLineaProps = {
  /** Partes separadas por barras finas: [<><b>$ 42,8 M</b> gastado</>, <>Parte <b>20 %</b></>]. */
  partes: ReactNode[]
  retardo?: number
  /** Un solo elemento enfocable (la barra del gráfico, la celda). */
  children: Hijo
}

/**
 * Tooltip con datos en una línea oscura (ref. 08): valor · parte · comparación,
 * separados por barras de 1×12 px al 25 %. Para gráficos.
 */
export function TooltipLinea({ partes, retardo = 0, children }: TooltipLineaProps) {
  const id = useId()
  const { visible, abrir, cerrar } = useCapa(retardo)
  return (
    <span className="relative inline-flex">
      {conDisparadores(children, id, abrir, cerrar)}
      <span
        id={id}
        role="tooltip"
        className={cx(
          CAPA,
          'flex items-center gap-2 rounded-[10px] bg-tinta px-3 py-1.5 text-xs whitespace-nowrap text-superficie tabular-nums shadow-flotante [&_b]:font-semibold',
          visible ? 'opacity-100' : 'translate-y-1 opacity-0',
        )}
      >
        {partes.map((p, i) => (
          <span key={i} className="inline-flex items-center gap-2">
            {i > 0 && <span aria-hidden className="h-3 w-px bg-current opacity-25" />}
            <span>{p}</span>
          </span>
        ))}
      </span>
    </span>
  )
}

export type FilaTooltip = { rotulo: string; valor: ReactNode }

export type TooltipFichaProps = {
  titulo: string
  subtitulo?: ReactNode
  /** Cuadrito o avatar de la entidad. */
  marca?: ReactNode
  /** 3 a 4 filas rótulo · valor. Más que eso va a la ficha. */
  filas: FilaTooltip[]
  /** 300 ms: no salta al pasar el mouse de largo por la tabla. */
  retardo?: number
  children: Hijo
}

/**
 * Tarjeta clara sobre un dato de tabla (patrón 7.5): 248 px, cabecera con la entidad,
 * filas rótulo · valor tabular. Se abre con mouse (300 ms) o foco de teclado; nunca con toque.
 * El dato que la tiene va subrayado punteado.
 */
export function TooltipFicha({ titulo, subtitulo, marca, filas, retardo = 300, children }: TooltipFichaProps) {
  const id = useId()
  const { visible, abrir, cerrar } = useCapa(retardo)
  return (
    <span className="relative inline-flex">
      {conDisparadores(children, id, abrir, cerrar)}
      <span
        id={id}
        role="tooltip"
        className={cx(
          CAPA,
          'w-[248px] rounded-control border border-borde bg-superficie px-4 py-3 text-xs shadow-flotante',
          visible ? 'opacity-100' : 'translate-y-1 opacity-0',
        )}
      >
        <span className="mb-2 flex items-center gap-2 border-b border-divisor pb-2">
          {marca}
          <span className="min-w-0">
            <b className="block truncate text-[13px] font-medium text-tinta">{titulo}</b>
            {subtitulo && <small className="block text-[11px] text-texto-3">{subtitulo}</small>}
          </span>
        </span>
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5">
          {filas.map(f => (
            <span key={f.rotulo} className="contents">
              <dt className="text-texto-3">{f.rotulo}</dt>
              <dd className="text-right font-medium text-tinta tabular-nums">{f.valor}</dd>
            </span>
          ))}
        </dl>
      </span>
    </span>
  )
}
