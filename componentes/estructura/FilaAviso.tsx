'use client'
/**
 * FilaAviso: fila de dos líneas de una bandeja de avisos o actividad (referencia 01).
 *
 *   [•] [tile] Título · detalle                                   [⋯]
 *              Módulo · ID · monto · hace 8 min
 *              [Aprobar] [Abrir]
 *
 * - Punto del acento a la izquierda si no está leída.
 * - Tile de 36 px con el fondo del estado al 10 %.
 * - La acción va EN la fila (máximo 2). Solo se rellena la que resuelve una decisión.
 * - Éxito en el lugar: la fila se tiñe de verde tenue, el botón pasa a pastilla "✓ Aprobado"
 *   y sale un toast con Deshacer. La fila no desaparece en el momento.
 * - Si falla, el error queda en la fila con Reintentar.
 * - Menú ⋯ por grupos: lo reversible arriba, silenciar en el medio, borrar al final.
 */
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { CheckIcon, DotsThreeIcon, type Icon } from '@phosphor-icons/react'
import { ErrorEnLugar } from './ErrorEnLugar'
import { Pastilla, TONO_PASTILLA, type Tono } from './TarjetaEntidad'
import { useToastOpcional } from './Toast'

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')
const EASE = 'ease-(--ease)'
const FOCO = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento/45'

export type AccionAviso = {
  texto: string
  icono?: Icon
  /** Rellena (acento). Solo para la que resuelve la decisión pendiente. */
  principal?: boolean
  hacer: () => void | Promise<void>
  /** Mientras corre: "Aprobando…". Por defecto "Guardando…". */
  textoGuardando?: string
  /** Si está, el éxito se ve en la fila: la acción pasa a pastilla verde con este texto ("Aprobado"). */
  exito?: string
  /** Toast al terminar: qué pasó (con ID y monto) y la consecuencia. */
  toast?: { titulo: string; detalle?: string }
  /** Si está, el toast lleva Deshacer y la fila vuelve a como estaba. */
  deshacer?: () => void | Promise<void>
}

export type OpcionMenu = {
  texto: string
  icono?: Icon
  /** "⌘U". Va a la derecha, en mono. */
  atajo?: string
  hacer: () => void
  peligro?: boolean
}

export type FilaAvisoProps = {
  tono: Tono
  icono: Icon
  /** En lugar del tile: un Monograma o el logo del proveedor (Gmail) en cuadro blanco. */
  avatar?: ReactNode
  titulo: ReactNode
  /** Va pegado al título, en gris normal: "· PR-0241 · Estudio Norte". */
  detalle?: ReactNode
  /** "Propuestas · 12 % sobre US$ 18.400 · hace 8 min". */
  meta: ReactNode
  leido?: boolean
  acciones?: AccionAviso[]
  /** Grupos separados por línea. */
  menu?: OpcionMenu[][]
  className?: string
}

type Fase = { tipo: 'quieta' } | { tipo: 'guardando'; i: number; ancho: number } | { tipo: 'hecha'; i: number } | { tipo: 'error'; i: number }

export function FilaAviso({ tono, icono: Icono, avatar, titulo, detalle, meta, leido = true, acciones = [], menu, className }: FilaAvisoProps) {
  const [fase, setFase] = useState<Fase>({ tipo: 'quieta' })
  const toast = useToastOpcional()
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const visibles = acciones.slice(0, 2)

  async function ejecutar(i: number) {
    const a = visibles[i]
    if (!a || fase.tipo === 'guardando') return
    setFase({ tipo: 'guardando', i, ancho: refs.current[i]?.offsetWidth ?? 0 })
    try {
      await a.hacer()
      setFase(a.exito ? { tipo: 'hecha', i } : { tipo: 'quieta' })
      if (a.toast && toast)
        toast.exito(a.toast.titulo, {
          detalle: a.toast.detalle,
          deshacer: a.deshacer
            ? async () => {
                await a.deshacer?.()
                setFase({ tipo: 'quieta' })
              }
            : undefined,
        })
    } catch {
      setFase({ tipo: 'error', i })
    }
  }

  const hecha = fase.tipo === 'hecha'

  return (
    <div
      className={cn(
        'group/fila relative flex gap-3 px-5 py-3 transition-colors duration-500',
        EASE,
        hecha ? 'bg-verde-fondo/60' : 'hover:bg-hover',
        className,
      )}
    >
      {!leido && <span aria-label="Sin leer" className="absolute top-[26px] left-[7px] size-1.5 rounded-full bg-acento" />}
      {avatar ?? (
        <span className={cn('grid size-9 shrink-0 place-items-center rounded-control', TONO_PASTILLA[tono])}>
          <Icono size={17} />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="text-sm leading-snug font-medium text-tinta">
          {titulo}
          {detalle && <span className="font-normal text-texto-2"> {detalle}</span>}
        </div>
        <div className="mt-0.5 truncate text-xs text-texto-3 tabular-nums">{meta}</div>

        {visibles.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {visibles.map((a, i) => {
              if (hecha && fase.i === i)
                return (
                  <span key={i} className="animate-[ds-aparecer_.35s_cubic-bezier(.23,1,.32,1)] motion-reduce:animate-none">
                    <Pastilla tono="verde" punto={false}>
                      <CheckIcon size={12} weight="bold" />
                      {a.exito}
                    </Pastilla>
                  </span>
                )
              // Hecha la principal, las otras que resolvían lo mismo se van; queda la neutra (Abrir).
              if (hecha && a.principal) return null
              const guardando = fase.tipo === 'guardando' && fase.i === i
              const I = a.icono
              return (
                <button
                  key={i}
                  ref={(el) => {
                    refs.current[i] = el
                  }}
                  type="button"
                  onClick={() => ejecutar(i)}
                  disabled={fase.tipo === 'guardando'}
                  aria-busy={guardando}
                  style={guardando && fase.ancho ? { minWidth: fase.ancho } : undefined}
                  className={cn(
                    'inline-flex h-8 items-center justify-center gap-1.5 rounded-chip px-3 text-xs font-medium whitespace-nowrap md:h-7',
                    'transition-[transform,background,opacity] duration-150 active:scale-[.97] disabled:cursor-progress',
                    EASE,
                    a.principal
                      ? 'bg-acento text-white shadow-[inset_0_1px_0_rgb(255_255_255/.18),0_2px_6px_-2px_color-mix(in_oklch,var(--color-acento)_60%,transparent)] hover:brightness-110'
                      : 'border border-borde bg-superficie shadow-min hover:bg-hover',
                    fase.tipo === 'guardando' && !guardando && 'opacity-50',
                    FOCO,
                  )}
                >
                  {I && !guardando && <I size={14} weight={a.principal ? 'bold' : 'regular'} />}
                  {guardando ? (a.textoGuardando ?? 'Guardando…') : a.texto}
                </button>
              )
            })}
          </div>
        )}

        {fase.tipo === 'error' && (
          <ErrorEnLugar
            variante="linea"
            className="mt-2"
            titulo={`No se pudo ${visibles[fase.i]?.texto.toLowerCase() ?? 'completar'}.`}
            texto="No cambió nada."
            onReintentar={() => ejecutar(fase.i)}
          />
        )}
      </div>

      {menu && menu.length > 0 && <MenuFila grupos={menu} />}

      <style href="ds-aparecer" precedence="ds">{`@keyframes ds-aparecer{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:none}}`}</style>
    </div>
  )
}

/** Rótulo de grupo temporal: Hoy / Ayer / Esta semana. */
export function EtiquetaDia({ children }: { children: ReactNode }) {
  return <div className="px-5 pt-2 pb-0.5 text-xs font-medium text-texto-3">{children}</div>
}

/* ── Menú ⋯ ─────────────────────────────────────────────────────────────── */

function MenuFila({ grupos }: { grupos: OpcionMenu[][] }) {
  const [abierto, setAbierto] = useState(false)
  const caja = useRef<HTMLDivElement>(null)
  const boton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!abierto) return
    caja.current?.querySelector<HTMLElement>('[role=menuitem]')?.focus()
    const fuera = (e: PointerEvent) => {
      if (!caja.current?.contains(e.target as Node) && !boton.current?.contains(e.target as Node)) setAbierto(false)
    }
    document.addEventListener('pointerdown', fuera)
    return () => document.removeEventListener('pointerdown', fuera)
  }, [abierto])

  function cerrar(volverFoco = true) {
    setAbierto(false)
    if (volverFoco) boton.current?.focus()
  }

  function teclas(e: KeyboardEvent<HTMLDivElement>) {
    const items = [...(caja.current?.querySelectorAll<HTMLElement>('[role=menuitem]') ?? [])]
    const i = items.indexOf(document.activeElement as HTMLElement)
    if (e.key === 'Escape') {
      e.preventDefault()
      cerrar()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      items[(i + 1) % items.length]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      items[(i - 1 + items.length) % items.length]?.focus()
    } else if (e.key === 'Tab') cerrar(false)
  }

  return (
    <div className="relative shrink-0 self-start">
      <button
        ref={boton}
        type="button"
        aria-label="Más acciones"
        aria-haspopup="menu"
        aria-expanded={abierto}
        onClick={() => setAbierto((a) => !a)}
        className={cn(
          '-mt-1 -mr-2 grid size-9 place-items-center rounded-control text-texto-3 transition-colors hover:bg-suave hover:text-tinta',
          abierto && 'bg-suave text-tinta',
          FOCO,
        )}
      >
        <DotsThreeIcon size={18} weight="bold" />
      </button>
      {abierto && (
        <div
          ref={caja}
          role="menu"
          onKeyDown={teclas}
          className={cn(
            'absolute top-9 right-0 z-30 w-60 origin-top-right rounded-interno border border-borde bg-superficie p-1 shadow-flotante',
            'animate-[ds-aparecer_.18s_cubic-bezier(.23,1,.32,1)] motion-reduce:animate-none',
          )}
        >
          {grupos.map((g, gi) => (
            <div key={gi} role="group" className={cn(gi > 0 && 'mt-1 border-t border-divisor pt-1')}>
              {g.map((o) => {
                const I = o.icono
                return (
                  <button
                    key={o.texto}
                    type="button"
                    role="menuitem"
                    tabIndex={-1}
                    onClick={() => {
                      cerrar()
                      o.hacer()
                    }}
                    className={cn(
                      'flex h-9 w-full items-center gap-2 rounded-chip px-3 text-left text-[13px] font-medium outline-none',
                      o.peligro ? 'text-rojo-texto hover:bg-rojo-fondo focus:bg-rojo-fondo' : 'text-tinta hover:bg-hover focus:bg-hover',
                    )}
                  >
                    {I && <I size={16} className={o.peligro ? '' : 'text-texto-2'} />}
                    <span className="flex-1 truncate">{o.texto}</span>
                    {o.atajo && <kbd className="font-mono text-xs text-texto-3">{o.atajo}</kbd>}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
