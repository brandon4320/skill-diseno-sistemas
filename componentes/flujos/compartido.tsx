'use client'
/**
 * Piezas chicas que comparten los flujos: chips-botón (3.8), tarjetas de opción (3.9),
 * barra de pasos segmentada (13.2), ícono de estado de sección y botón que espera con ancho fijo.
 * Ver ejemplos/biblioteca/12-flujos.html.
 */
import { useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { CheckIcon, CircleNotchIcon, XIcon, type Icon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

export { cx, FOCO }

/* ───────── Chips-botón: 2 a 6 opciones dentro de un formulario ───────── */
export type OpcionChip<V extends string> = { valor: V; texto: ReactNode }

type ChipsUnoProps<V extends string> = {
  opciones: OpcionChip<V>[]
  valor: V | null
  onCambio: (v: V) => void
  multiple?: false
  etiqueta: string
}
type ChipsVariosProps<V extends string> = {
  opciones: OpcionChip<V>[]
  valor: V[]
  onCambio: (v: V[]) => void
  multiple: true
  etiqueta: string
}
export type ChipsOpcionProps<V extends string> = ChipsUnoProps<V> | ChipsVariosProps<V>

/** Chips de 32 px, radio 8; el elegido en blanco con sombra mínima. Multi: cuadradito de 6 px delante. */
export function ChipsOpcion<V extends string>(p: ChipsOpcionProps<V>) {
  const on = (v: V) => (p.multiple ? p.valor.includes(v) : p.valor === v)
  const tocar = (v: V) => {
    if (p.multiple) p.onCambio(on(v) ? p.valor.filter((x) => x !== v) : [...p.valor, v])
    else p.onCambio(v)
  }
  return (
    <div role="group" aria-label={p.etiqueta} className="flex flex-wrap gap-2">
      {p.opciones.map((o) => (
        <button
          key={o.valor}
          type="button"
          aria-pressed={on(o.valor)}
          onClick={() => tocar(o.valor)}
          className={cx(
            'inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium transition-colors max-md:h-11',
            on(o.valor)
              ? 'border-borde-fuerte bg-superficie text-tinta shadow-min'
              : 'border-borde text-texto-2 hover:bg-hover hover:text-tinta',
            FOCO,
          )}
        >
          {p.multiple && <span aria-hidden className={cx('size-1.5 rounded-[2px]', on(o.valor) ? 'bg-tinta' : 'bg-borde-fuerte')} />}
          {o.texto}
        </button>
      ))}
    </div>
  )
}

/* ───────── Tarjetas de opción: 2 a 5 elecciones con explicación ───────── */
export type OpcionTarjeta<V extends string> = {
  valor: V
  titulo: string
  descripcion?: string
  icono?: Icon
  recomendada?: boolean
}
export type TarjetasOpcionProps<V extends string> = {
  opciones: OpcionTarjeta<V>[]
  valor: V
  onCambio: (v: V) => void
  etiqueta: string
  /** 'filas' (por defecto) o 'grilla' para tarjetas de ~105×60 en 3 columnas. */
  disposicion?: 'filas' | 'grilla'
}

/** Elegida por borde del acento + fondo 6 %, nunca por relleno. Flechas para moverse, como un radio. */
export function TarjetasOpcion<V extends string>({ opciones, valor, onCambio, etiqueta, disposicion = 'filas' }: TarjetasOpcionProps<V>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const tecla = (e: KeyboardEvent, i: number) => {
    const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]
    if (!d) return
    e.preventDefault()
    const j = (i + d + opciones.length) % opciones.length
    refs.current[j]?.focus()
    onCambio(opciones[j].valor)
  }
  return (
    <div role="radiogroup" aria-label={etiqueta} className={cx(disposicion === 'grilla' ? 'grid grid-cols-3 gap-2 max-md:grid-cols-1' : 'flex flex-col gap-2')}>
      {opciones.map((o, i) => {
        const on = o.valor === valor
        const Ic = o.icono
        return (
          <button
            key={o.valor}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onCambio(o.valor)}
            onKeyDown={(e) => tecla(e, i)}
            className={cx(
              'flex min-h-14 w-full items-center gap-3 rounded-control border bg-superficie py-2 pr-4 pl-3 text-left transition-colors hover:bg-hover',
              on ? 'border-acento bg-acento/[.06] ring-[.5px] ring-acento ring-inset' : 'border-borde',
              FOCO,
            )}
          >
            {Ic && (
              <span className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-suave text-texto-2">
                <Ic size={16} aria-hidden />
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-medium text-tinta">
                {o.titulo}
                {o.recomendada && <span className="ml-1.5 rounded-md bg-azul-fondo px-1.5 py-px text-[11px] font-medium text-azul-texto">Recomendado</span>}
              </span>
              {o.descripcion && <span className="mt-0.5 block text-xs leading-snug text-texto-3">{o.descripcion}</span>}
            </span>
            <span aria-hidden className={cx('size-[18px] shrink-0 rounded-full border-borde-fuerte transition-[border]', on ? 'border-[5px] border-acento' : 'border-[1.5px]')} />
          </button>
        )
      })}
    </div>
  )
}

/* ───────── Barra de pasos segmentada ───────── */
export function BarraPasos({ total, actual, className }: { total: number; actual: number; className?: string }) {
  return (
    <div aria-hidden className={cx('flex flex-1 gap-1', className)}>
      {Array.from({ length: total }, (_, i) => (
        <i key={i} className="relative h-[3px] max-w-[84px] flex-1 overflow-hidden rounded-sm bg-tinta/15">
          <span className={cx('absolute inset-0 origin-left bg-tinta transition-transform duration-300 ease-(--ease)', i <= actual ? 'scale-x-100' : 'scale-x-0')} />
        </i>
      ))}
    </div>
  )
}

/* ───────── Estado de una sección o paso ───────── */
export type EstadoPaso = 'pendiente' | 'falta' | 'error' | 'listo'

/** Círculo de 18 px: número gris, ! ámbar, × rojo o ✓ verde. Nunca solo color: cada uno cambia el signo. */
export function IconoEstado({ estado, numero, tamano = 18 }: { estado: EstadoPaso; numero: number; tamano?: number }) {
  const base = 'grid shrink-0 place-items-center rounded-full border-[1.5px] font-mono text-[11px] transition-colors'
  const s = { width: tamano, height: tamano }
  if (estado === 'listo') return <span style={s} className={cx(base, 'border-verde-texto bg-verde-texto text-white')}><CheckIcon size={11} weight="bold" aria-hidden /></span>
  if (estado === 'error') return <span style={s} className={cx(base, 'border-rojo-texto bg-rojo-fondo text-rojo-texto')}><XIcon size={11} weight="bold" aria-hidden /></span>
  if (estado === 'falta') return <span style={s} className={cx(base, 'border-ambar-texto bg-ambar-fondo text-ambar-texto')}>!</span>
  return <span style={s} className={cx(base, 'border-borde-fuerte text-texto-3')}>{numero}</span>
}

/* ───────── Botón que espera con ancho fijo ───────── */
export type BotonEsperaProps = {
  children: ReactNode
  textoEspera: string
  /** Si devuelve una promesa, el botón queda en espera hasta que resuelva. */
  hacer: () => void | Promise<void>
  variante?: 'principal' | 'secundario' | 'texto'
  chico?: boolean
  icono?: Icon
  /** Si está, el botón se ve apagado y el motivo queda escrito (aria-describedby). */
  motivoBloqueo?: string
  ancho?: boolean
  className?: string
}

export function BotonEspera({ children, textoEspera, hacer, variante = 'principal', chico, icono: Ic, motivoBloqueo, ancho, className }: BotonEsperaProps) {
  const [esperando, setEsperando] = useState(false)
  const [min, setMin] = useState<number>()
  const ref = useRef<HTMLButtonElement>(null)
  useLayoutEffect(() => {
    if (!esperando && ref.current) setMin(ref.current.offsetWidth)
  }, [children, esperando])
  const id = useRef(`motivo-${Math.random().toString(36).slice(2, 8)}`).current
  const click = async () => {
    if (motivoBloqueo || esperando) return
    setEsperando(true)
    try {
      await hacer()
    } finally {
      setEsperando(false)
    }
  }
  return (
    <>
      <button
        ref={ref}
        type="button"
        onClick={click}
        aria-busy={esperando || undefined}
        aria-disabled={!!motivoBloqueo || undefined}
        aria-describedby={motivoBloqueo ? id : undefined}
        style={{ minWidth: esperando ? min : undefined }}
        className={cx(
          'inline-flex items-center justify-center gap-2 rounded-control border font-medium whitespace-nowrap transition active:scale-[.97]',
          chico ? 'h-7 rounded-lg px-2.5 text-xs' : 'h-[38px] px-3.5 text-[13px] max-md:h-11',
          variante === 'principal' && 'border-tinta bg-tinta text-superficie shadow-principal hover:bg-tinta/90',
          variante === 'secundario' && 'border-borde bg-superficie text-tinta shadow-min hover:bg-hover',
          variante === 'texto' && 'border-transparent text-texto-2 hover:bg-hover hover:text-tinta',
          motivoBloqueo && 'cursor-not-allowed opacity-45 active:scale-100',
          ancho && 'w-full',
          FOCO,
          className,
        )}
      >
        {esperando ? <CircleNotchIcon size={14} className="animate-spin" aria-hidden /> : Ic && <Ic size={chico ? 14 : 16} aria-hidden />}
        {esperando ? textoEspera : children}
      </button>
      {motivoBloqueo && <span id={id} className="sr-only">{motivoBloqueo}</span>}
    </>
  )
}

/** Separa "1 renglón" / "3 renglones" sin errores de plural. */
export const plural = (n: number, uno: string, varios: string) => `${n.toLocaleString('es-AR')} ${n === 1 ? uno : varios}`

/** "1.240.000,50" o "1240000" → número. */
export const leerNumero = (s: string): number => {
  const v = parseFloat(s.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.'))
  return Number.isNaN(v) ? 0 : v
}
