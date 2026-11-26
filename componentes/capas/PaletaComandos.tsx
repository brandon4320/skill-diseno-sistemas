'use client'
/**
 * Paleta de comandos (⌘K): buscar y hacer desde cualquier pantalla.
 *
 * - Input combobox arriba; chips de grupo con su conteo para acotar; lista con aria-activedescendant.
 * - ↑ ↓ mueven, Enter ejecuta, Esc cierra (si hay texto, primero lo borra). El mouse también activa.
 * - Coincidencia marcada con <mark>; sin resultados, la paleta dice qué buscó y ofrece crear.
 * - Cifras con tabular-nums. En celular ocupa el ancho y los chips miden 44 px.
 *
 *   const [abierta, setAbierta] = useState(false)
 *   useAtajoPaleta(() => setAbierta(true))
 *   <PaletaComandos abierta={abierta} onCerrar={() => setAbierta(false)} items={items}
 *     grupos={[{ id: 'facturas', titulo: 'Facturas', icono: ReceiptIcon }, …]} />
 */
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { ArrowElbowDownLeftIcon, MagnifyingGlassIcon, type Icon } from '@phosphor-icons/react'
import { cn, EASE, FOCO, useFocoAtrapado } from './compartido'

export type GrupoComando = { id: string; titulo: string; icono?: Icon }

export type ItemComando = {
  id: string
  titulo: string
  /** Línea chica: "Orbe Retail · $ 4.820.000". */
  meta?: ReactNode
  grupo: string
  icono?: Icon
  /** Color de la entidad para el cuadro del ícono (var(--color-dato-1)…). Sin color, cuadro neutro. */
  color?: string
  /** Palabras extra para encontrarlo. */
  claves?: string
  atajo?: string
  hacer: () => void
}

export type PaletaComandosProps = {
  abierta: boolean
  onCerrar: () => void
  items: ItemComando[]
  grupos?: GrupoComando[]
  placeholder?: string
  /** Sin resultados: qué ofrecer ("Crear cliente «…»"). */
  alNoEncontrar?: (texto: string) => { texto: string; hacer: () => void } | null
}

/** Abre con ⌘K / Ctrl+K. */
export function useAtajoPaleta(abrir: () => void) {
  const ref = useRef(abrir)
  ref.current = abrir
  useEffect(() => {
    const f = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        ref.current()
      }
    }
    document.addEventListener('keydown', f)
    return () => document.removeEventListener('keydown', f)
  }, [])
}

const normal = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function Marcado({ texto, busca }: { texto: string; busca: string }) {
  if (!busca) return <>{texto}</>
  const i = normal(texto).indexOf(normal(busca))
  if (i < 0) return <>{texto}</>
  return (
    <>
      {texto.slice(0, i)}
      <mark className="rounded-[3px] bg-[color-mix(in_oklch,var(--color-dato-4)_34%,transparent)] text-inherit">{texto.slice(i, i + busca.length)}</mark>
      {texto.slice(i + busca.length)}
    </>
  )
}

export function PaletaComandos({ abierta, onCerrar, items, grupos = [], placeholder = 'Buscar o hacer…', alNoEncontrar }: PaletaComandosProps) {
  const [texto, setTexto] = useState('')
  const [grupo, setGrupo] = useState<string | null>(null)
  const [activo, setActivo] = useState(0)
  const caja = useRef<HTMLDivElement>(null)
  const lista = useRef<HTMLDivElement>(null)
  const base = useId()
  useFocoAtrapado(abierta, caja)

  useEffect(() => {
    if (!abierta) {
      setTexto('')
      setGrupo(null)
    }
  }, [abierta])

  const porTexto = useMemo(() => {
    const q = normal(texto.trim())
    return q ? items.filter((it) => normal(`${it.titulo} ${it.claves ?? ''}`).includes(q)) : items
  }, [items, texto])
  const visibles = grupo ? porTexto.filter((it) => it.grupo === grupo) : porTexto

  useEffect(() => setActivo(0), [texto, grupo])
  useEffect(() => {
    lista.current?.querySelector(`[data-i="${activo}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [activo])

  if (!abierta || typeof document === 'undefined') return null

  const ejecutar = (it: ItemComando | undefined) => {
    if (!it) return
    onCerrar()
    it.hacer()
  }
  const crear = visibles.length === 0 && texto.trim() ? alNoEncontrar?.(texto.trim()) ?? null : null

  function teclas(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActivo((a) => Math.min(a + 1, visibles.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActivo((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (crear) {
        onCerrar()
        crear.hacer()
      } else ejecutar(visibles[activo])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      if (texto) setTexto('')
      else onCerrar()
    }
  }

  const idActivo = visibles[activo] ? `${base}-o-${activo}` : undefined

  return createPortal(
    <div className="fixed inset-0 z-50 grid justify-items-center px-4 pt-[12vh] max-md:pt-4" onMouseDown={(e) => e.target === e.currentTarget && onCerrar()}>
      <div aria-hidden className="pointer-events-none fixed inset-0 bg-[color-mix(in_oklch,var(--color-tinta)_24%,transparent)] backdrop-blur-[2px]" />
      <div
        ref={caja}
        role="dialog"
        aria-modal="true"
        aria-label="Paleta de comandos"
        className={cn(
          'relative flex h-fit max-h-[min(560px,80vh)] w-full max-w-[640px] flex-col overflow-hidden rounded-tarjeta border border-borde bg-superficie shadow-flotante',
          'animate-[ds-paleta_200ms_both] motion-reduce:animate-none',
          EASE,
        )}
      >
        <style href="ds-paleta" precedence="ds">{`@keyframes ds-paleta{from{opacity:0;transform:scale(.97) translateY(-4px)}}`}</style>
        <div className="flex h-14 items-center gap-3 border-b border-divisor px-4">
          <MagnifyingGlassIcon size={18} className="text-texto-3" aria-hidden />
          <input
            data-autofoco
            role="combobox"
            aria-expanded="true"
            aria-controls={`${base}-lista`}
            aria-activedescendant={idActivo}
            aria-autocomplete="list"
            aria-label="Buscar"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={teclas}
            placeholder={placeholder}
            className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-tinta outline-none placeholder:text-texto-3"
          />
          <kbd className="rounded-chip border border-borde px-1.5 font-mono text-[11px] text-texto-3 max-md:hidden">esc</kbd>
        </div>
        {grupos.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto border-b border-divisor px-4 py-2.5 [scrollbar-width:none]" role="group" aria-label="Filtrar por tipo">
            {[{ id: '', titulo: 'Todo' } as GrupoComando, ...grupos].map((g) => {
              const on = (grupo ?? '') === g.id
              const n = g.id ? porTexto.filter((it) => it.grupo === g.id).length : porTexto.length
              const GI = g.icono
              return (
                <button
                  key={g.id || 'todo'}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setGrupo(g.id || null)}
                  className={cn(
                    'inline-flex h-7 flex-none items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium whitespace-nowrap max-md:h-11',
                    on ? 'border-tinta bg-tinta text-superficie' : 'border-borde bg-superficie text-texto-2 hover:text-tinta',
                    FOCO,
                  )}
                >
                  {GI && <GI size={13} aria-hidden />}
                  {g.titulo}
                  <span className="tabular-nums">{n}</span>
                </button>
              )
            })}
          </div>
        )}
        <div ref={lista} id={`${base}-lista`} role="listbox" aria-label="Resultados" className="min-h-0 flex-1 overflow-y-auto p-1.5">
          {visibles.map((it, i) => {
            const I = it.icono
            const sel = i === activo
            return (
              <div
                key={it.id}
                id={`${base}-o-${i}`}
                data-i={i}
                role="option"
                aria-selected={sel}
                onPointerMove={() => !sel && setActivo(i)}
                onClick={() => ejecutar(it)}
                className={cn('flex min-h-[52px] items-center gap-3 rounded-control px-2.5 py-1.5', sel && 'bg-[color-mix(in_oklch,var(--color-tinta)_6%,transparent)]')}
              >
                <span
                  className={cn('grid size-8 flex-none place-items-center rounded-chip', it.color ? 'text-white' : 'border border-borde bg-suave text-texto-2')}
                  style={it.color ? { background: `color-mix(in oklch, ${it.color} 64%, #000)` } : undefined}
                  aria-hidden
                >
                  {I && <I size={16} weight={it.color ? 'fill' : 'regular'} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-tinta tabular-nums">
                    <Marcado texto={it.titulo} busca={texto.trim()} />
                  </span>
                  {it.meta && <span className="block truncate text-xs text-texto-2 tabular-nums">{it.meta}</span>}
                </span>
                {sel ? (
                  <ArrowElbowDownLeftIcon size={14} className="text-texto-3 max-md:hidden" aria-hidden />
                ) : (
                  it.atajo && <kbd className="font-mono text-[11px] text-texto-3 max-md:hidden">{it.atajo}</kbd>
                )}
              </div>
            )
          })}
          {visibles.length === 0 && (
            <div className="grid gap-3 px-4 py-6 text-center text-[13px] text-texto-2">
              <p>
                Nada con «<b className="font-medium text-tinta">{texto}</b>»{grupo ? ' en este tipo' : ''}.
              </p>
              {crear && (
                <button
                  type="button"
                  onClick={() => {
                    onCerrar()
                    crear.hacer()
                  }}
                  className={cn('mx-auto inline-flex h-9 items-center rounded-control border border-borde bg-superficie px-3 font-medium text-tinta shadow-min hover:bg-hover max-md:h-11', FOCO)}
                >
                  {crear.texto}
                </button>
              )}
            </div>
          )}
        </div>
        <div className="flex h-10 items-center gap-4 border-t border-divisor px-4 text-[11px] text-texto-3 max-md:hidden">
          <span><kbd className="font-mono">↑↓</kbd> mover</span>
          <span><kbd className="font-mono">↵</kbd> abrir</span>
          <span className="ml-auto tabular-nums">{visibles.length} resultados</span>
        </div>
      </div>
    </div>,
    document.body,
  )
}
