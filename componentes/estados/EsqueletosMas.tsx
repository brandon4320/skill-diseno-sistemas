'use client'
/**
 * Los esqueletos que faltaban en estructura/Esqueleto.tsx (ahí están Texto, Kpi, Tarjeta y Filas):
 * lista de dos líneas con avatar y ficha de propiedades. Misma regla: la forma final, opacidad que
 * baja hacia abajo y nada si tarda menos de 300 ms (envolvé en <CargaDiferida>).
 *
 *   <CargaDiferida cargando={cargando}><EsqueletoLista filas={4} /></CargaDiferida>
 */
import { Esqueleto } from '../estructura/Esqueleto'

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

/** Lista de dos líneas: avatar 28, título y metadato, como .item / FilaAviso. */
export function EsqueletoLista({ filas = 3, avatar = true, className }: { filas?: number; avatar?: boolean; className?: string }) {
  const anchos = [80, 66, 74, 58, 70]
  return (
    <div role="status" aria-busy="true" className={cn('flex flex-col', className)}>
      <span className="sr-only">Cargando…</span>
      {Array.from({ length: filas }, (_, i) => (
        <div key={i} className="flex gap-3 px-5 py-3" style={{ opacity: 1 - i * 0.15 }}>
          {avatar && <Esqueleto className="size-7 shrink-0 rounded-full" />}
          <div className="flex min-w-0 flex-1 flex-col gap-1.5 pt-0.5">
            <Esqueleto style={{ width: `${anchos[i % anchos.length]}%` }} />
            <Esqueleto className="h-2" style={{ width: `${34 + ((i * 7) % 14)}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

/** Ficha: avatar 40 + nombre, y propiedades clave/valor alineadas (una con forma de pastilla). */
export function EsqueletoFicha({ propiedades = 4, className }: { propiedades?: number; className?: string }) {
  const valores = [70, 52, 0, 40, 60, 46]
  return (
    <div role="status" aria-busy="true" className={cn('flex flex-col gap-4', className)}>
      <span className="sr-only">Cargando ficha…</span>
      <div className="flex items-center gap-3">
        <Esqueleto className="size-10 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-1.5">
          <Esqueleto className="h-3.5" style={{ width: '60%' }} />
          <Esqueleto className="h-2" style={{ width: '40%' }} />
        </div>
      </div>
      <div className="grid grid-cols-[84px_minmax(0,1fr)] items-center gap-x-4 gap-y-3 md:grid-cols-[96px_minmax(0,1fr)]">
        {Array.from({ length: propiedades }, (_, i) => (
          <div key={i} className="contents">
            <Esqueleto className="h-2" style={{ width: 44 + ((i * 11) % 24) }} />
            {valores[i % valores.length] === 0 ? <Esqueleto className="h-[22px] w-24 rounded-chip" /> : <Esqueleto style={{ width: `${valores[i % valores.length]}%` }} />}
          </div>
        ))}
      </div>
    </div>
  )
}
