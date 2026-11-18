/**
 * Seccion: título display de 17 px + conteo gris + acciones chicas a la derecha.
 * Las secciones se separan con aire (28 px, lo pone <Contenido>), nunca con una línea gruesa
 * ni un fondo de color. Sin descripción: si hace falta explicar la sección, el título está mal.
 *
 *   <Seccion titulo="Proyectos en curso" conteo={4} acciones={<BotonChico icono={PlusIcon}>Nuevo</BotonChico>}>
 *     <div className="grid gap-3.5 md:grid-cols-2 xl:grid-cols-4">…</div>
 *   </Seccion>
 */
import { useId, type ReactNode } from 'react'
import type { Icon } from '@phosphor-icons/react'

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

export type SeccionProps = {
  titulo: string
  conteo?: number
  /** Selector segmentado, "Filtrar", "+ Nuevo", "Ver todo". Botones chicos. */
  acciones?: ReactNode
  /** Para anclas (#proyectos) y para que los botones lleven a la sección. */
  id?: string
  children: ReactNode
  className?: string
}

export function Seccion({ titulo, conteo, acciones, id, children, className }: SeccionProps) {
  const auto = useId()
  const idTitulo = `${id ?? auto}-titulo`
  return (
    <section id={id} aria-labelledby={idTitulo} className={cn('min-w-0 scroll-mt-6', className)}>
      <div className="mb-3 flex min-h-8 flex-wrap items-center gap-x-3 gap-y-2">
        <h2 id={idTitulo} className="font-display text-base font-medium tracking-[-.01em]">
          {titulo}
        </h2>
        {conteo != null && <span className="font-medium text-texto-3 tabular-nums">{conteo}</span>}
        {acciones && <div className="ml-auto flex items-center gap-2">{acciones}</div>}
      </div>
      {children}
    </section>
  )
}

/** Botón chico de 28 px (32 en celular) para las acciones de sección y de fila. */
export function BotonChico({
  icono: I,
  children,
  onClick,
  etiqueta,
}: {
  icono?: Icon
  children?: ReactNode
  onClick?: () => void
  /** Obligatoria si el botón es solo ícono. */
  etiqueta?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={etiqueta}
      title={children ? undefined : etiqueta}
      className={cn(
        'inline-flex h-8 items-center gap-1.5 rounded-chip border border-borde bg-superficie px-3 text-xs font-medium whitespace-nowrap shadow-min md:h-7',
        'transition-[transform,background] duration-150 ease-(--ease) hover:bg-hover active:scale-[.97]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento/45',
        !children && 'w-8 justify-center px-0 md:w-7',
      )}
    >
      {I && <I size={14} />}
      {children}
    </button>
  )
}
