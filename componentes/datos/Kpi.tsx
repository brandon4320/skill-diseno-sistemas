import type { ElementType, ReactNode } from 'react'
import { ArrowUpRightIcon } from '@phosphor-icons/react/ssr'

type Props = {
  /** Qué es, corto: "Ganado en el mes". Sin "Total de…" ni "Cantidad de…". */
  rotulo: string
  /** Ícono que dice algo (sello para lo ganado, teléfono para seguimientos). Phosphor regular, 16 px. */
  icono?: ReactNode
  /** La cifra. Normalmente <Cuenta hasta={41600} />. null / undefined → "—". */
  valor: ReactNode
  /** Antes de la cifra, en gris y más chico: "US$", "$". */
  unidad?: string
  /** Después de la cifra, en gris y más chico: "%", "días", "h". */
  sufijo?: string
  /** Respecto de qué: "69 % de la meta de US$ 60.000". Obligatorio: un número solo no dice nada. */
  contexto: ReactNode
  /** El dibujo: <Rayitas/>, <Bloques/>, <Curva/>. Toda cifra lleva uno. */
  dibujo?: ReactNode
  /** Pie sobre la bandeja: <Variacion/> o un aviso "2 vencidos". */
  pie?: ReactNode
  /** A la derecha del pie, en gris: "esta semana", "Ver lista". */
  pieDerecha?: ReactNode
  /** Lleva a su lista filtrada. Todo el pie es el enlace y aparece ↗. */
  href?: string
  /** Componente de enlace (por ejemplo `Link` de next/link). Por defecto `<a>`. */
  enlace?: ElementType
  /** El botón ⋯ con su menú. Si no hay acciones, no se pasa: nada de ⋯ decorativos. */
  menu?: ReactNode
  /** Esqueleto con la forma final (§6b). */
  cargando?: boolean
  className?: string
}

/**
 * KPI en bandeja con tarjeta adentro (SKILL.md §1b punto 9, 06 y 07): lo que lo hace "premium".
 *   bandeja bg-suave · radio 20 · padding 4
 *   ├ rótulo con ícono (y ⋯) sobre la bandeja
 *   ├ tarjeta blanca · radio 16 · sombra mínima: cifra display + contexto + dibujo
 *   └ pie sobre la bandeja: variación con período, o alerta; todo el pie lleva a la lista
 * Van en filas de 3 a 6 del mismo alto (la grilla estira la tarjeta con `flex-1`).
 */
export function Kpi({
  rotulo,
  icono,
  valor,
  unidad,
  sufijo,
  contexto,
  dibujo,
  pie,
  pieDerecha,
  href,
  enlace: Enlace = 'a',
  menu,
  cargando = false,
  className = '',
}: Props) {
  const vacio = valor == null || valor === ''
  const pieInterno = (
    <>
      <span className="flex min-w-0 items-center gap-1.5">{pie}</span>
      {(pieDerecha || href) && (
        <span className="ml-auto flex shrink-0 items-center gap-1 text-texto-3 transition-colors group-hover/pie:text-tinta">
          {pieDerecha}
          {href && <ArrowUpRightIcon size={14} aria-hidden className="transition-transform duration-200 ease-(--ease) group-hover/pie:translate-x-px group-hover/pie:-translate-y-px" />}
        </span>
      )}
    </>
  )
  const clasePie = 'flex min-h-[34px] items-center gap-2 px-3 pt-2 pb-1.5 text-xs font-medium text-texto-2'

  return (
    <section
      aria-busy={cargando || undefined}
      className={`flex min-w-0 flex-col rounded-tarjeta border border-borde bg-suave p-1 ${className}`}
    >
      <header className="flex h-9 items-center gap-2 px-3 text-[13px] font-medium text-texto-2">
        {icono && <span className="flex shrink-0 text-texto-3 [&>svg]:size-4">{icono}</span>}
        <h3 className="truncate">{rotulo}</h3>
        {menu && <span className="ml-auto flex">{menu}</span>}
      </header>

      <div className="flex flex-1 flex-col rounded-interno border border-borde bg-superficie px-4 pt-4 pb-4 shadow-min [[data-tema=oscuro]_&]:shadow-none">
        {cargando ? (
          <div aria-hidden>
            <div className="h-[34px] w-2/3 animate-pulse rounded-chip bg-suave motion-reduce:animate-none" />
            <div className="mt-2 h-3 w-1/2 animate-pulse rounded-chip bg-suave motion-reduce:animate-none" />
            <div className="mt-4 h-4 animate-pulse rounded-chip bg-suave motion-reduce:animate-none" />
          </div>
        ) : (
          <>
            <div className="font-display flex items-baseline text-[32px] leading-[1.1] font-medium tracking-[-.03em] text-tinta tabular-nums">
              {unidad && !vacio && <span className="mr-1 text-xl font-normal tracking-normal text-texto-3">{unidad}</span>}
              {vacio ? <span className="text-texto-3">—</span> : valor}
              {sufijo && !vacio && <span className="ml-0.5 text-xl font-normal tracking-normal text-texto-3">{sufijo}</span>}
            </div>
            <div className="mt-0.5 truncate text-xs text-texto-3">{contexto}</div>
            {dibujo && <div className="mt-auto">{dibujo}</div>}
          </>
        )}
      </div>

      {(pie || pieDerecha || href) &&
        (href && !cargando ? (
          <Enlace
            href={href}
            className={`group/pie ${clasePie} rounded-b-interno outline-none focus-visible:ring-2 focus-visible:ring-acento/40`}
          >
            {pieInterno}
          </Enlace>
        ) : (
          <div className={clasePie}>{cargando ? <span className="h-3 w-1/2 animate-pulse rounded-chip bg-borde/60" /> : pieInterno}</div>
        ))}
    </section>
  )
}
