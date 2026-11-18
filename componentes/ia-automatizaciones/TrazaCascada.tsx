'use client'
/**
 * Traza en cascada: para depurar una corrida lenta. Barras de 8 px por tipo sobre una línea de
 * tiempo con 5 marcas, la duración pegada a la barra, subpasos con sangría bajo chevron (árbol
 * con flechas) y un panel con dónde empieza y su entrada/salida en JSON.
 * Galería viva: ejemplos/biblioteca/11-ia-automatizaciones.html#traza-en-cascada
 */
import { useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { CaretDownIcon, type Icon } from '@phosphor-icons/react'
import { cx, FOCO, PALETA_ENTIDAD } from '../base/utilidades'

export type TramoTraza = {
  id: string
  nombre: string
  icono: Icon
  /** ms desde el inicio de la corrida. */
  inicio: number
  duracion: number
  /** Índice de color de la paleta de entidades, por tipo de paso. */
  tipo: number
  error?: boolean
  entrada?: unknown
  salida?: unknown
  hijos?: TramoTraza[]
}

export type TrazaCascadaProps = {
  /** "RUN-0214". */
  id: string
  /** "Hoy 08:00 · programada · FAC-01094". */
  meta: string
  tramos: TramoTraza[]
  className?: string
}

type Fila = TramoTraza & { nivel: number; padre: boolean }

const seg = (ms: number) => `${(ms / 1000).toLocaleString('es-AR', { maximumFractionDigits: 2 })} s`

export function TrazaCascada({ id, meta, tramos, className }: TrazaCascadaProps) {
  const [cerrados, setCerrados] = useState<Set<string>>(new Set())
  const [sel, setSel] = useState<string>(tramos[0]?.id ?? '')
  const arbol = useRef<HTMLDivElement>(null)

  const total = useMemo(() => {
    let fin = 0
    const rec = (t: TramoTraza[]) => t.forEach((x) => { fin = Math.max(fin, x.inicio + x.duracion); if (x.hijos) rec(x.hijos) })
    rec(tramos)
    return fin || 1
  }, [tramos])

  const filas = useMemo(() => {
    const out: Fila[] = []
    const rec = (t: TramoTraza[], nivel: number) =>
      t.forEach((x) => {
        out.push({ ...x, nivel, padre: !!x.hijos?.length })
        if (x.hijos?.length && !cerrados.has(x.id)) rec(x.hijos, nivel + 1)
      })
    rec(tramos, 0)
    return out
  }, [tramos, cerrados])

  const elegido = filas.find((f) => f.id === sel)

  const alternar = (fid: string, abrir?: boolean) =>
    setCerrados((c) => {
      const n = new Set(c)
      const cerrar = abrir === undefined ? !n.has(fid) : !abrir
      if (cerrar) n.add(fid)
      else n.delete(fid)
      return n
    })

  const enfocar = (fid: string) => {
    setSel(fid)
    requestAnimationFrame(() => arbol.current?.querySelector<HTMLElement>(`[data-id="${fid}"]`)?.focus())
  }

  const tecla = (e: KeyboardEvent, f: Fila, i: number) => {
    if (e.key === 'ArrowDown' && filas[i + 1]) { e.preventDefault(); enfocar(filas[i + 1].id) }
    else if (e.key === 'ArrowUp' && filas[i - 1]) { e.preventDefault(); enfocar(filas[i - 1].id) }
    else if (e.key === 'ArrowRight' && f.padre) { e.preventDefault(); alternar(f.id, true) }
    else if (e.key === 'ArrowLeft' && f.padre) { e.preventDefault(); alternar(f.id, false) }
  }

  return (
    <div className={cx('overflow-hidden rounded-tarjeta border border-borde bg-superficie shadow-min', className)}>
      <header className="flex flex-wrap items-baseline gap-x-3 border-b border-divisor px-5 py-3">
        <b className="font-mono text-[13px] font-medium text-tinta">{id}</b>
        <span className="text-xs text-texto-3">{meta}</span>
        <span className="ml-auto text-xs text-texto-2 tabular-nums">Terminó · {seg(total)} en total</span>
      </header>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <div className="grid h-8 grid-cols-[minmax(0,130px)_minmax(0,1fr)] items-center border-b border-divisor px-5 font-mono text-[11px] text-texto-3 md:grid-cols-[minmax(0,230px)_minmax(0,1fr)]">
            <span>Paso</span>
            <span className="relative h-full">
              {[0, 0.25, 0.5, 0.75, 1].map((k) => (
                <span key={k} className="absolute top-1/2 -translate-y-1/2 tabular-nums" style={{ left: `${k * 100}%`, transform: `translate(${k === 1 ? '-100%' : k === 0 ? '0' : '-50%'},-50%)` }}>
                  {seg(total * k)}
                </span>
              ))}
            </span>
          </div>
          <div ref={arbol} role="tree" aria-label="Pasos de la corrida">
            {filas.map((f, i) => {
              const Ico = f.icono
              const color = f.error ? 'var(--color-rojo-texto)' : PALETA_ENTIDAD[f.tipo % PALETA_ENTIDAD.length]
              const izq = (f.inicio / total) * 100
              const ancho = Math.max((f.duracion / total) * 100, 0.6)
              return (
                <div
                  key={f.id}
                  data-id={f.id}
                  role="treeitem"
                  aria-level={f.nivel + 1}
                  aria-selected={f.id === sel}
                  aria-expanded={f.padre ? !cerrados.has(f.id) : undefined}
                  tabIndex={f.id === sel ? 0 : -1}
                  onClick={() => { setSel(f.id); if (f.padre) alternar(f.id) }}
                  onKeyDown={(e) => tecla(e, f, i)}
                  className={cx(
                    'grid h-10 cursor-pointer grid-cols-[minmax(0,130px)_minmax(0,1fr)] items-center px-5 transition-colors max-md:h-11 md:grid-cols-[minmax(0,230px)_minmax(0,1fr)]',
                    f.id === sel ? 'bg-acento-suave' : 'hover:bg-hover',
                    FOCO,
                  )}
                >
                  <span className="flex min-w-0 items-center gap-1.5 text-[13px]" style={{ paddingLeft: f.nivel * 20 }}>
                    {f.padre ? (
                      <CaretDownIcon size={11} aria-hidden className={cx('w-5 shrink-0 text-texto-3 transition-transform', cerrados.has(f.id) && '-rotate-90')} />
                    ) : (
                      <span className="w-5 shrink-0" />
                    )}
                    <Ico size={15} className="shrink-0 text-texto-3" aria-hidden />
                    <span className={cx('truncate', f.error ? 'text-rojo-texto' : 'text-tinta')}>{f.nombre}</span>
                  </span>
                  <span className="relative h-full">
                    {[25, 50, 75].map((k) => (
                      <i key={k} aria-hidden className="absolute inset-y-0 w-px bg-divisor" style={{ left: `${k}%` }} />
                    ))}
                    <span className="absolute top-1/2 flex -translate-y-1/2 items-center gap-1.5" style={{ left: `${izq}%`, width: `calc(${ancho}% + 64px)` }}>
                      <span className="h-2 rounded-full" style={{ width: `calc(100% - 64px)`, minWidth: 3, background: color }} />
                      <span className="font-mono text-[11px] whitespace-nowrap text-texto-2 tabular-nums">{seg(f.duracion)}</span>
                    </span>
                  </span>
                </div>
              )
            })}
          </div>
        </div>
        {elegido && (
          <aside aria-label={`Detalle de ${elegido.nombre}`} className="flex min-w-0 flex-col gap-3 border-t border-divisor bg-panel p-5 lg:border-t-0 lg:border-l">
            <b className="text-[13px] font-medium text-tinta">{elegido.nombre}</b>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs tabular-nums">
              <dt className="text-texto-3">Empieza en</dt>
              <dd className="text-texto-2">{seg(elegido.inicio)} · {Math.round((elegido.inicio / total) * 100)} % de la corrida</dd>
              <dt className="text-texto-3">Duración</dt>
              <dd className="text-texto-2">{seg(elegido.duracion)}</dd>
            </dl>
            {(['entrada', 'salida'] as const).map((k) =>
              elegido[k] === undefined ? null : (
                <div key={k} className="flex min-w-0 flex-col gap-1">
                  <span className="font-mono text-[11px] font-medium tracking-[.06em] text-texto-3 uppercase">{k}</span>
                  <pre className="max-h-48 overflow-auto rounded-[12px] border border-divisor bg-superficie p-3 font-mono text-[11px] leading-[1.6] text-texto-2">
                    {JSON.stringify(elegido[k], null, 2)}
                  </pre>
                </div>
              ),
            )}
          </aside>
        )}
      </div>
    </div>
  )
}
