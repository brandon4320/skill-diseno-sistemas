'use client'
/**
 * Esqueleto: cargando con la forma final, nunca un spinner en el medio de la pantalla.
 * Bloques bg-suave con un brillo que pasa. Si la carga dura menos de 300 ms no se muestra
 * nada (envolvé en <CargaDiferida>), así no parpadea.
 *
 *   <CargaDiferida cargando={cargando}>
 *     <EsqueletoFilas filas={6} columnas={5} />
 *   </CargaDiferida>
 */
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

/** React 19 deduplica y sube este <style> al <head> (href + precedence). */
function EstiloBrillo() {
  return (
    <style href="ds-brillo" precedence="ds">{`
.ds-brillo{position:relative;overflow:hidden;isolation:isolate}
.ds-brillo::after{content:"";position:absolute;inset:0;transform:translateX(-100%);
  background:linear-gradient(90deg,transparent,color-mix(in oklch,var(--color-superficie) 65%,transparent),transparent);
  animation:ds-brillo 1.5s cubic-bezier(.4,0,.2,1) infinite}
@keyframes ds-brillo{to{transform:translateX(100%)}}
@media (prefers-reduced-motion:reduce){.ds-brillo::after{animation:none;opacity:0}}
`}</style>
  )
}

export function Esqueleto({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <>
      <EstiloBrillo />
      <span aria-hidden className={cn('ds-brillo block h-3 rounded-chip bg-suave', className)} style={style} />
    </>
  )
}

/** Envoltorio accesible: avisa "Cargando…" a lectores de pantalla una sola vez. */
function Cargando({ children, etiqueta = 'Cargando…', className }: { children: ReactNode; etiqueta?: string; className?: string }) {
  return (
    <div role="status" aria-busy="true" className={className}>
      <span className="sr-only">{etiqueta}</span>
      {children}
    </div>
  )
}

/** Líneas de texto de largo variado (la última más corta). */
export function EsqueletoTexto({ lineas = 3, className }: { lineas?: number; className?: string }) {
  return (
    <Cargando className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lineas }, (_, i) => (
        <Esqueleto key={i} style={{ width: i === lineas - 1 ? '55%' : `${92 - i * 6}%` }} />
      ))}
    </Cargando>
  )
}

/** KPI en bandeja: rótulo, tarjeta con cifra y dibujo, pie. */
export function EsqueletoKpi({ className }: { className?: string }) {
  return (
    <Cargando className={cn('flex flex-col rounded-tarjeta border border-borde bg-suave p-1', className)}>
      <div className="flex items-center gap-2 px-3 pt-3 pb-3">
        <Esqueleto className="size-4 rounded-[5px] bg-borde/60" />
        <Esqueleto className="h-2.5 w-24 bg-borde/60" />
      </div>
      <div className="rounded-interno border border-borde bg-superficie px-4 pt-4 pb-4 shadow-min">
        <Esqueleto className="h-7 w-32 rounded-chip" />
        <Esqueleto className="mt-3 h-2.5 w-40" />
        <Esqueleto className="mt-4 h-4 w-full rounded-chip" />
      </div>
      <div className="flex justify-between px-3 pt-3 pb-2">
        <Esqueleto className="h-2.5 w-20 bg-borde/60" />
        <Esqueleto className="h-2.5 w-16 bg-borde/60" />
      </div>
    </Cargando>
  )
}

/** Tarjeta de entidad: cabecera, título, avance, curva y pasos. */
export function EsqueletoTarjeta({ className }: { className?: string }) {
  return (
    <Cargando className={cn('overflow-hidden rounded-tarjeta border border-borde bg-superficie', className)}>
      <div className="px-5 pt-4 pb-4">
        <div className="flex justify-between">
          <Esqueleto className="h-[22px] w-14 rounded-chip" />
          <Esqueleto className="h-[22px] w-24 rounded-chip" />
        </div>
        <Esqueleto className="mt-4 h-5 w-3/4 rounded-chip" />
        <Esqueleto className="mt-3 h-2.5 w-full" />
        <Esqueleto className="mt-1.5 h-2.5 w-2/3" />
        <Esqueleto className="mt-5 h-[7px] w-full rounded-[3px]" />
      </div>
      <div className="border-y border-divisor px-5 py-3">
        <Esqueleto className="h-14 w-full rounded-control" />
      </div>
      <div className="flex flex-col gap-3 px-5 py-4">
        {[80, 64, 72].map((w) => (
          <div key={w} className="flex items-center gap-2">
            <Esqueleto className="size-[18px] rounded-full" />
            <Esqueleto className="h-2.5" style={{ width: `${w}%` }} />
          </div>
        ))}
      </div>
    </Cargando>
  )
}

/** Filas de tabla en escritorio y tarjetas de 2 líneas en celular, como la Tabla real. */
export function EsqueletoFilas({ filas = 5, columnas = 4, className }: { filas?: number; columnas?: number; className?: string }) {
  const anchos = [38, 62, 30, 46, 54, 34]
  return (
    <Cargando className={className}>
      <div className="hidden md:block">
        <div className="flex h-9 items-center gap-6 rounded-control bg-suave px-3">
          {Array.from({ length: columnas }, (_, c) => (
            <Esqueleto key={c} className={cn('h-2 bg-borde/70', c === columnas - 1 && 'ml-auto')} style={{ width: 48 + (c % 3) * 14 }} />
          ))}
        </div>
        {Array.from({ length: filas }, (_, f) => (
          <div key={f} className="flex h-[46px] items-center gap-6 border-b border-divisor px-3 last:border-0">
            {Array.from({ length: columnas }, (_, c) => (
              <Esqueleto
                key={c}
                className={cn(c === columnas - 1 && 'ml-auto', c === 2 && 'h-[22px] rounded-chip')}
                style={{ width: `${anchos[(f + c) % anchos.length] / (c === columnas - 1 ? 3 : 2.2)}%`, opacity: 1 - f * 0.08 }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex flex-col divide-y divide-divisor md:hidden">
        {Array.from({ length: Math.min(filas, 5) }, (_, f) => (
          <div key={f} className="flex flex-col gap-2 py-4" style={{ opacity: 1 - f * 0.1 }}>
            <div className="flex justify-between gap-6">
              <Esqueleto className="h-3" style={{ width: `${anchos[f % anchos.length] + 10}%` }} />
              <Esqueleto className="h-3 w-16" />
            </div>
            <div className="flex gap-2">
              <Esqueleto className="h-[22px] w-20 rounded-chip" />
              <Esqueleto className="h-2.5 w-24 self-center" />
            </div>
          </div>
        ))}
      </div>
    </Cargando>
  )
}

/** Muestra `children` (el esqueleto) solo si la carga pasa los `demora` ms. */
export function CargaDiferida({ cargando, demora = 300, children }: { cargando: boolean; demora?: number; children: ReactNode }) {
  const [mostrar, setMostrar] = useState(false)
  useEffect(() => {
    if (!cargando) {
      setMostrar(false)
      return
    }
    const t = setTimeout(() => setMostrar(true), demora)
    return () => clearTimeout(t)
  }, [cargando, demora])
  return cargando && mostrar ? <>{children}</> : null
}
