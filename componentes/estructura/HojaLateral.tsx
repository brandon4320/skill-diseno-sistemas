'use client'
/**
 * HojaLateral: las ediciones secundarias se abren al costado, sin cambiar de página
 * (referencia 01, "Notification preferences"). En celular sube desde abajo.
 *
 * - 420 px, flotando a 8 px del borde, radio 20, sombra flotante.
 * - Cabecera: ícono en cuadro de tono, título display, una línea de alcance, ×.
 * - Pie estándar: "Volver a lo predeterminado" como enlace a la izquierda; Cancelar (borde)
 *   y Guardar (relleno) a la derecha. Guardar dice "Guardando…" sin cambiar de ancho; si falla,
 *   el error queda en el pie y lo cargado no se pierde.
 * - Foco atrapado adentro, Esc cierra, el foco vuelve a quien la abrió, la página no scrollea.
 *   Para elegir el primer campo con foco, marcalo con data-autofoco.
 *
 *   <HojaLateral abierta={abierta} onCerrar={cerrar} titulo="Avisos" descripcion="Se aplica solo a vos."
 *     icono={BellSimpleIcon} pie={{ restaurar: { texto: 'Volver a lo predeterminado', hacer: restaurar },
 *     guardar: { texto: 'Guardar', hacer: guardar } }}>
 *     …campos…
 *   </HojaLateral>
 */
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { XIcon, type Icon } from '@phosphor-icons/react'
import { ErrorEnLugar } from './ErrorEnLugar'
import { TONO_PASTILLA, type Tono } from './TarjetaEntidad'

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')
const EASE = 'ease-(--ease)'
const FOCO = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento/45'
const ENFOCABLES =
  'a[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

export type PieHoja = {
  restaurar?: { texto: string; hacer: () => void }
  /** Por defecto "Cancelar". */
  cancelar?: string
  guardar?: {
    texto: string
    /** Por defecto "Guardando…". */
    textoGuardando?: string
    /** Si resuelve, la hoja se cierra. Si tira error, el mensaje queda en el pie. */
    hacer: () => void | Promise<void>
    /** Nunca un botón apagado sin decir por qué: si está, se muestra y Guardar se apaga. */
    motivoBloqueo?: string
  }
}

export type HojaLateralProps = {
  abierta: boolean
  onCerrar: () => void
  titulo: string
  /** Una línea de alcance: "Se aplica solo a vos. El administrador define los de la empresa." */
  descripcion?: string
  icono?: Icon
  tono?: Tono
  children: ReactNode
  /** Pie estándar (objeto) o uno propio (nodo). */
  pie?: PieHoja | ReactNode
  /** En px, escritorio. Entre 380 y 440. */
  ancho?: number
}

const esPieEstandar = (p: unknown): p is PieHoja =>
  !!p && typeof p === 'object' && !('$$typeof' in p) && ('guardar' in p || 'restaurar' in p || 'cancelar' in p)

export function HojaLateral({ abierta, onCerrar, titulo, descripcion, icono: Icono, tono = 'azul', children, pie, ancho = 420 }: HojaLateralProps) {
  const [montada, setMontada] = useState(false)
  const [visible, setVisible] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [anchoGuardar, setAnchoGuardar] = useState<number>()
  const panel = useRef<HTMLDivElement>(null)
  const botonGuardar = useRef<HTMLButtonElement>(null)
  const previo = useRef<HTMLElement | null>(null)
  const idTitulo = useId()
  const idDesc = useId()

  const cerrar = () => {
    if (!guardando) onCerrar()
  }

  // Montar → entrar; salir → desmontar al terminar la transición.
  useEffect(() => {
    if (abierta) {
      previo.current = document.activeElement as HTMLElement | null
      setMontada(true)
      setError(null)
      let r2 = 0
      const r1 = requestAnimationFrame(() => {
        r2 = requestAnimationFrame(() => setVisible(true))
      })
      return () => {
        cancelAnimationFrame(r1)
        cancelAnimationFrame(r2)
      }
    }
    setVisible(false)
    const t = setTimeout(() => {
      setMontada(false)
      previo.current?.focus?.()
    }, 280)
    return () => clearTimeout(t)
  }, [abierta])

  // Foco inicial, scroll bloqueado.
  useEffect(() => {
    if (!montada) return
    const p = panel.current
    const primero = p?.querySelector<HTMLElement>('[data-autofoco]') ?? p?.querySelector<HTMLElement>('input,select,textarea') ?? p
    primero?.focus({ preventScroll: true })
    const antes = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = antes
    }
  }, [montada])

  function teclas(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') {
      e.stopPropagation()
      cerrar()
      return
    }
    if (e.key !== 'Tab' || !panel.current) return
    const f = [...panel.current.querySelectorAll<HTMLElement>(ENFOCABLES)].filter((el) => el.offsetParent !== null)
    if (!f.length) return
    const [primero, ultimo] = [f[0], f[f.length - 1]]
    if (e.shiftKey && (document.activeElement === primero || document.activeElement === panel.current)) {
      e.preventDefault()
      ultimo.focus()
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault()
      primero.focus()
    }
  }

  async function guardar(g: NonNullable<PieHoja['guardar']>) {
    if (guardando || g.motivoBloqueo) return
    setAnchoGuardar(botonGuardar.current?.offsetWidth)
    setGuardando(true)
    setError(null)
    try {
      await g.hacer()
      setGuardando(false)
      onCerrar()
    } catch (err) {
      setGuardando(false)
      setError(err instanceof Error && err.message ? err.message : 'Revisá la conexión y probá de nuevo.')
    }
  }

  if (!montada || typeof document === 'undefined') return null

  const pieEstandar = esPieEstandar(pie) ? pie : null

  return createPortal(
    <div className="fixed inset-0 z-50" onKeyDown={teclas}>
      <div
        aria-hidden
        onClick={cerrar}
        className={cn(
          'absolute inset-0 bg-[rgb(10_10_12/.28)] backdrop-blur-[2px] transition-opacity duration-300',
          visible ? 'opacity-100' : 'opacity-0',
        )}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        aria-describedby={descripcion ? idDesc : undefined}
        tabIndex={-1}
        style={{ ['--ancho-hoja' as string]: `${ancho}px` }}
        className={cn(
          'absolute flex flex-col overflow-hidden border border-borde bg-superficie shadow-flotante outline-none',
          // Celular: hoja que sube desde abajo.
          'inset-x-0 bottom-0 max-h-[92dvh] rounded-t-[24px] pb-[env(safe-area-inset-bottom)]',
          // Escritorio: flotando a la derecha.
          'md:inset-x-auto md:top-2 md:right-2 md:bottom-2 md:max-h-none md:w-[var(--ancho-hoja)] md:rounded-tarjeta md:pb-0',
          'transition-transform duration-300 motion-reduce:transition-none',
          EASE,
          visible ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-[calc(100%+16px)] md:translate-y-0',
        )}
      >
        <span aria-hidden className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-borde-fuerte md:hidden" />

        <div className="flex shrink-0 items-start gap-3 border-b border-divisor px-5 pt-4 pb-4 md:pt-5">
          {Icono && (
            <span className={cn('grid size-[38px] shrink-0 place-items-center rounded-control', TONO_PASTILLA[tono])}>
              <Icono size={18} />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h2 id={idTitulo} className="font-display text-xl leading-tight font-medium tracking-[-.01em]">
              {titulo}
            </h2>
            {descripcion && (
              <p id={idDesc} className="mt-0.5 text-[13px] text-texto-3">
                {descripcion}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar"
            className={cn('-mt-1 -mr-2 grid size-10 shrink-0 place-items-center rounded-control text-texto-3 transition-colors hover:bg-hover hover:text-tinta', FOCO)}
          >
            <XIcon size={16} />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-5 py-4">{children}</div>

        {pieEstandar ? (
          <div className="shrink-0 border-t border-divisor bg-suave/60 px-5 py-3">
            {error && <ErrorEnLugar variante="linea" className="mb-3" titulo="No se guardó." texto={error} />}
            {pieEstandar.guardar?.motivoBloqueo && !error && <p className="mb-3 text-xs text-texto-2">{pieEstandar.guardar.motivoBloqueo}</p>}
            <div className="flex items-center gap-2">
              {pieEstandar.restaurar && (
                <button
                  type="button"
                  onClick={pieEstandar.restaurar.hacer}
                  disabled={guardando}
                  className={cn('mr-auto rounded-chip text-[13px] font-medium text-acento hover:underline hover:underline-offset-4 disabled:opacity-50', FOCO)}
                >
                  {pieEstandar.restaurar.texto}
                </button>
              )}
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={cerrar}
                  disabled={guardando}
                  className={cn(
                    'inline-flex h-11 items-center rounded-control border border-borde bg-superficie px-4 text-[13px] font-medium shadow-min transition-[background,transform] duration-150 hover:bg-hover active:scale-[.97] disabled:opacity-50 md:h-[38px]',
                    FOCO,
                  )}
                >
                  {pieEstandar.cancelar ?? 'Cancelar'}
                </button>
                {pieEstandar.guardar && (
                  <button
                    ref={botonGuardar}
                    type="button"
                    onClick={() => pieEstandar.guardar && guardar(pieEstandar.guardar)}
                    disabled={guardando || !!pieEstandar.guardar.motivoBloqueo}
                    aria-busy={guardando}
                    style={guardando && anchoGuardar ? { minWidth: anchoGuardar } : undefined}
                    className={cn(
                      'inline-flex h-11 items-center justify-center rounded-control bg-tinta px-4 text-[13px] font-medium text-superficie shadow-principal transition-[filter,transform] duration-150 hover:brightness-110 active:scale-[.97] md:h-[38px]',
                      'disabled:cursor-not-allowed disabled:opacity-50 aria-busy:cursor-progress aria-busy:opacity-100',
                      FOCO,
                    )}
                  >
                    {guardando ? (pieEstandar.guardar.textoGuardando ?? 'Guardando…') : pieEstandar.guardar.texto}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : pie ? (
          <div className="shrink-0 border-t border-divisor bg-suave/60 px-5 py-3">{pie as ReactNode}</div>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}
