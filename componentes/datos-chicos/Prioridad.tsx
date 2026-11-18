import { ArrowDownIcon, ArrowUpIcon, EqualsIcon, WarningDiamondIcon } from '@phosphor-icons/react/ssr'
import { cx } from '../base/utilidades'

/** 0 sin prioridad · 1 baja · 2 media · 3 alta · 4 urgente */
export type NivelPrioridad = 0 | 1 | 2 | 3 | 4

export const NOMBRE_PRIORIDAD: Record<NivelPrioridad, string> = {
  0: 'Sin prioridad',
  1: 'Baja',
  2: 'Media',
  3: 'Alta',
  4: 'Urgente',
}

export type PrioridadProps = {
  nivel: NivelPrioridad
  /**
   * senal: barras grises + cuadro rojo con "!" para urgente (por defecto) ·
   * flecha: ↓ = ↑ para tablas angostas · icono: solo el dibujo (lleva tooltip afuera).
   */
  variante?: 'senal' | 'flecha' | 'icono'
  className?: string
}

/** Barras de 3 px (5, 8 y 11 de alto). Las llenas en texto-2, las vacías en suave. */
export function Senal({ nivel }: { nivel: 1 | 2 | 3 }) {
  return (
    <span aria-hidden className="inline-flex h-3 w-3.5 shrink-0 items-end gap-0.5">
      {[5, 8, 11].map((h, i) => (
        <i key={h} className={cx('w-[3px] rounded-[1px]', i < nivel ? 'bg-texto-2' : 'bg-suave')} style={{ height: h }} />
      ))}
    </span>
  )
}

function Dibujo({ nivel }: { nivel: NivelPrioridad }) {
  if (nivel === 0)
    return (
      <span aria-hidden className="inline-flex w-3.5 shrink-0 justify-between">
        {[0, 1, 2].map(i => <i key={i} className="size-[3px] rounded-full bg-texto-3" />)}
      </span>
    )
  if (nivel === 4)
    return (
      <span aria-hidden className="grid size-[15px] shrink-0 place-items-center rounded-[4px] bg-rojo-texto font-mono text-[11px] font-bold text-white">
        !
      </span>
    )
  return <Senal nivel={nivel} />
}

/**
 * Prioridad (patrones 6.7 y 10.2): gris para baja, media y alta; solo Urgente lleva color.
 * "Sin prioridad" son tres puntos, nunca un hueco. Server Component.
 */
export function Prioridad({ nivel, variante = 'senal', className }: PrioridadProps) {
  const nombre = NOMBRE_PRIORIDAD[nivel]
  if (variante === 'icono')
    return (
      <span role="img" aria-label={`Prioridad ${nombre.toLowerCase()}`} className={cx('inline-flex items-center', className)}>
        <Dibujo nivel={nivel} />
      </span>
    )
  if (variante === 'flecha') {
    const Icono = nivel === 4 ? WarningDiamondIcon : nivel === 3 ? ArrowUpIcon : nivel === 2 ? EqualsIcon : ArrowDownIcon
    return (
      <span
        className={cx(
          'inline-flex items-center gap-1.5 text-[13px] whitespace-nowrap',
          nivel === 4 ? 'font-medium text-rojo-texto' : nivel === 3 ? 'text-tinta' : 'text-texto-2',
          className,
        )}
      >
        {nivel > 0 && <Icono size={14} weight={nivel === 4 ? 'fill' : 'regular'} aria-hidden />}
        {nombre}
      </span>
    )
  }
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 text-[13px] whitespace-nowrap',
        nivel === 4 ? 'font-medium text-rojo-texto' : nivel === 3 ? 'font-medium text-tinta' : 'text-texto-2',
        className,
      )}
    >
      <Dibujo nivel={nivel} />
      {nombre}
    </span>
  )
}
