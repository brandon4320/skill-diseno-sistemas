'use client'
/**
 * ContenidoAnterior: al cambiar de filtro, página o vista, lo que ya estaba queda a la vista.
 * Si la respuesta llega antes de 300 ms no pasa nada; si tarda, lo anterior baja al 55 % (sin clics)
 * y una barrita de 2 px corre arriba. Cuando llega lo nuevo entra con desenfoque (300 ms).
 * Nunca el panel en blanco entre dos estados.
 *
 *   const { data, isFetching } = useQuery(...)   // con placeholderData: keepPreviousData
 *   <ContenidoAnterior cargando={isFetching} clave={filtro}>
 *     <ListaFacturas facturas={data} />
 *   </ContenidoAnterior>
 */
import { useEffect, useState, type ReactNode } from 'react'

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

function Estilo() {
  return (
    <style href="ds-contenido-anterior" precedence="ds">{`
@keyframes ds-barrita{from{left:-36%}to{left:100%}}
@keyframes ds-desenfoque{from{opacity:0;filter:blur(6px)}}
.ds-barrita::before{content:"";position:absolute;top:0;bottom:0;width:36%;border-radius:2px;background:var(--color-acento);animation:ds-barrita 1.1s cubic-bezier(.65,0,.35,1) infinite}
.ds-llega{animation:ds-desenfoque 300ms cubic-bezier(.23,1,.32,1) both}
@media (prefers-reduced-motion:reduce){.ds-barrita::before{animation:none;left:0;width:100%;opacity:.5}.ds-llega{animation:none}}
`}</style>
  )
}

export type ContenidoAnteriorProps = {
  cargando: boolean
  /** Cambia cuando llega contenido nuevo (filtro, página): dispara el desenfoque de entrada. */
  clave?: string | number
  /** Umbral para mostrar la carga. Por defecto 300 ms. */
  demora?: number
  /** Texto para lectores de pantalla. */
  etiqueta?: string
  children: ReactNode
  className?: string
}

export function ContenidoAnterior({ cargando, clave, demora = 300, etiqueta = 'Actualizando…', children, className }: ContenidoAnteriorProps) {
  const [mostrar, setMostrar] = useState(false)
  useEffect(() => {
    if (!cargando) {
      setMostrar(false)
      return
    }
    const t = setTimeout(() => setMostrar(true), demora)
    return () => clearTimeout(t)
  }, [cargando, demora])

  return (
    <div className={cn('relative', className)} aria-busy={cargando || undefined}>
      <Estilo />
      <div aria-hidden className={cn('ds-barrita pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden transition-opacity duration-200', mostrar ? 'opacity-100' : 'opacity-0')} />
      {mostrar && <span className="sr-only" role="status">{etiqueta}</span>}
      <div key={clave} className={cn('transition-opacity duration-[240ms]', mostrar ? 'pointer-events-none opacity-55' : 'ds-llega')}>
        {children}
      </div>
    </div>
  )
}
