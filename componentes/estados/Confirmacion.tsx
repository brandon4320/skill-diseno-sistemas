'use client'
/**
 * Confirmar sin modal. Lo reversible no se confirma: se hace y el toast trae Deshacer.
 *
 * - ConfirmarEnLugar: lo irreversible de una fila (anular una factura con CAE). El botón se abre en
 *   "¿Anular FAC-01098? [Anular factura] [Cancelar]" ahí mismo, con una rayita que se consume en 5 s
 *   y vuelve sola. El que confirma repite la acción; nunca "Sí" ni "OK". Esc cancela.
 * - BotonMantener: lo grave pero frecuente (borrar una plantilla): mantener apretado 1,2 s, con el
 *   relleno avanzando; soltar antes no hace nada. Anda con mouse, toque y Espacio/Enter.
 * - ConfirmarEscribiendo: lo más grave (borrar un espacio entero): escribir el nombre habilita.
 */
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { CircleNotchIcon, TrashIcon, XCircleIcon, type Icon } from '@phosphor-icons/react'

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')
const FOCO = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento/45'
const CHICO = 'inline-flex h-7 items-center gap-1 rounded-chip px-2.5 text-xs font-medium whitespace-nowrap transition-[background,transform] duration-150 active:scale-[.97] max-md:h-11'

function Estilo() {
  return (
    <style href="ds-confirmar" precedence="ds">{`
@keyframes ds-reloj{to{transform:scaleX(0)}}
@keyframes ds-desenfoque{from{opacity:0;filter:blur(6px)}}
.ds-reloj{animation:ds-reloj linear forwards;transform-origin:left}
.ds-abre{animation:ds-desenfoque 240ms cubic-bezier(.23,1,.32,1) both}
.ds-mantener::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--color-rojo-fondo);transform:scaleX(0);transform-origin:left;transition:transform 200ms cubic-bezier(.23,1,.32,1)}
.ds-mantener[data-cargando]::before{transform:scaleX(1);transition:transform var(--ds-mantener,1200ms) linear}
@media (prefers-reduced-motion:reduce){.ds-abre{animation:none}}
`}</style>
  )
}

export type ConfirmarEnLugarProps = {
  /** Texto del botón cerrado: "Anular". */
  accion: string
  /** El que confirma repite la acción: "Anular factura". */
  confirmar: string
  /** "¿Anular FAC-01098? Genera la nota de crédito." */
  pregunta: ReactNode
  onConfirmar: () => Promise<void> | void
  /** Gerundio mientras corre: "Anulando…". */
  enCurso?: string
  icono?: Icon
  /** Vuelve sola a los N ms. Por defecto 5000. */
  espera?: number
}

export function ConfirmarEnLugar({ accion, confirmar, pregunta, onConfirmar, enCurso = 'Procesando…', icono: I = XCircleIcon, espera = 5000 }: ConfirmarEnLugarProps) {
  const [fase, setFase] = useState<'cerrado' | 'abierto' | 'corriendo'>('cerrado')
  const cancelarRef = useRef<HTMLButtonElement>(null)
  const abrirRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (fase !== 'abierto') return
    cancelarRef.current?.focus()
    const t = setTimeout(() => setFase('cerrado'), espera)
    return () => clearTimeout(t)
  }, [fase, espera])
  const cerrar = () => {
    setFase('cerrado')
    requestAnimationFrame(() => abrirRef.current?.focus())
  }
  async function si() {
    setFase('corriendo')
    try {
      await onConfirmar()
    } finally {
      setFase('cerrado')
    }
  }
  if (fase === 'cerrado')
    return (
      <button ref={abrirRef} type="button" onClick={() => setFase('abierto')} className={cn(CHICO, 'border border-borde bg-superficie text-rojo-texto shadow-min hover:bg-hover', FOCO)}>
        <I size={14} aria-hidden />
        {accion}
      </button>
    )
  if (fase === 'corriendo')
    return (
      <span className={cn(CHICO, 'min-w-[120px] border border-borde bg-superficie text-texto-2')} aria-busy="true">
        <CircleNotchIcon size={14} className="animate-spin motion-reduce:animate-none" />
        {enCurso}
      </span>
    )
  return (
    <div role="group" aria-label="Confirmar" className="ds-abre relative flex flex-wrap items-center gap-2" onKeyDown={(e) => e.key === 'Escape' && cerrar()}>
      <Estilo />
      <span className="text-xs text-texto-2">{pregunta}</span>
      <button type="button" onClick={si} className={cn(CHICO, 'bg-rojo-texto text-superficie hover:bg-rojo-texto/90', FOCO)}>
        {confirmar}
      </button>
      <button ref={cancelarRef} type="button" onClick={cerrar} className={cn(CHICO, 'text-texto-2 hover:bg-hover hover:text-tinta', FOCO)}>
        Cancelar
      </button>
      <i aria-hidden className="ds-reloj absolute inset-x-0 -bottom-1.5 h-0.5 rounded-full bg-rojo-texto/50" style={{ animationDuration: `${espera}ms` }} />
    </div>
  )
}

export type BotonMantenerProps = {
  children: ReactNode
  onCompleto: () => void
  /** Tiempo a mantener. Por defecto 1200 ms. */
  duracion?: number
  /** Texto para lectores y para cuando se suelta antes. */
  ayuda?: string
  className?: string
}

export function BotonMantener({ children, onCompleto, duracion = 1200, ayuda = 'Mantené apretado para confirmar. Soltá antes y no pasa nada.', className }: BotonMantenerProps) {
  const [cargando, setCargando] = useState(false)
  const t = useRef<ReturnType<typeof setTimeout>>(undefined)
  const idAyuda = useId()
  const empezar = () => {
    setCargando(true)
    t.current = setTimeout(() => {
      setCargando(false)
      onCompleto()
    }, duracion)
  }
  const soltar = () => {
    clearTimeout(t.current)
    setCargando(false)
  }
  useEffect(() => () => clearTimeout(t.current), [])
  return (
    <>
      <Estilo />
      <button
        type="button"
        aria-describedby={idAyuda}
        data-cargando={cargando || undefined}
        style={{ ['--ds-mantener' as string]: `${duracion}ms` }}
        onPointerDown={(e) => {
          e.preventDefault()
          empezar()
        }}
        onPointerUp={soltar}
        onPointerLeave={soltar}
        onPointerCancel={soltar}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
            e.preventDefault()
            empezar()
          }
        }}
        onKeyUp={(e) => (e.key === ' ' || e.key === 'Enter') && soltar()}
        className={cn('ds-mantener relative isolate inline-flex h-[38px] min-w-44 touch-none items-center justify-center gap-2 overflow-hidden rounded-control border border-borde bg-superficie px-3.5 text-[13px] font-medium text-rojo-texto shadow-min select-none max-md:h-11 max-md:w-full', FOCO, className)}
      >
        <TrashIcon size={16} aria-hidden />
        {children}
      </button>
      <span id={idAyuda} className="sr-only">
        {ayuda}
      </span>
    </>
  )
}

export type ConfirmarEscribiendoProps = {
  /** Lo que hay que escribir, tal cual: "Estudio Faro". */
  nombre: string
  /** Consecuencia en cifras: "Se borran 214 clientes, 1.032 facturas y sus archivos. No se puede deshacer." */
  consecuencia: ReactNode
  /** Texto del botón: "Borrar espacio". */
  accion: string
  onConfirmar: () => void
}

export function ConfirmarEscribiendo({ nombre, consecuencia, accion, onConfirmar }: ConfirmarEscribiendoProps) {
  const [valor, setValor] = useState('')
  const id = useId()
  const ok = valor.trim() === nombre
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-texto-3">{consecuencia}</p>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-[13px] font-medium text-texto-2">
          Escribí <b className="text-tinta">{nombre}</b> para confirmar
        </label>
        <input id={id} value={valor} onChange={(e) => setValor(e.target.value)} autoComplete="off" spellCheck={false} className={cn('h-10 rounded-control border border-borde-fuerte bg-superficie px-3 text-sm shadow-min outline-none focus:border-acento focus:ring-[3px] focus:ring-acento/20 max-md:h-[52px] max-md:text-base')} />
      </div>
      <button
        type="button"
        aria-disabled={!ok}
        onClick={() => ok && onConfirmar()}
        className={cn('inline-flex h-[38px] items-center justify-center gap-2 rounded-control bg-rojo-texto px-3.5 text-[13px] font-medium text-superficie transition-opacity aria-disabled:cursor-not-allowed aria-disabled:opacity-45 max-md:h-11', FOCO)}
      >
        <TrashIcon size={16} aria-hidden />
        {accion}
      </button>
    </div>
  )
}
