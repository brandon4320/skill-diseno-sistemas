import { CheckIcon, CircleNotchIcon, WarningIcon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

/**
 * Migas con estado de guardado (01-navegacion · 11): en un editor no hay botón Guardar. Junto a las
 * migas, "✓ Guardado" gris de 12, "Guardando…" mientras escribe y en ámbar lo que no subió.
 * Las migas largas se cortan al medio con "…" (quedan la primera y las dos últimas).
 */
export type Miga = { texto: string; href?: string }
export type EstadoGuardado = 'guardado' | 'guardando' | 'sin-subir'

export type MigasGuardadoProps = {
  migas: readonly Miga[]
  estado?: EstadoGuardado
  /** "hace 2 min". */
  cuando?: string
  onReintentar?: () => void
  /** Desde cuántas migas se corta al medio. */
  maximo?: number
}

export function MigasGuardado({ migas, estado, cuando, onReintentar, maximo = 4 }: MigasGuardadoProps) {
  const cortar = migas.length > maximo
  const visibles: (Miga | null)[] = cortar ? [migas[0], null, ...migas.slice(-2)] : [...migas]
  return (
    <div className="flex min-w-0 items-center gap-3">
      <nav aria-label="Ubicación" className="min-w-0">
        <ol className="flex min-w-0 items-center gap-1.5 text-[13px]">
          {visibles.map((m, i) => {
            const ultima = i === visibles.length - 1
            return (
              <li key={i} className={cx('flex min-w-0 items-center gap-1.5', ultima ? 'shrink' : 'shrink-0')}>
                {i > 0 && <span className="text-texto-3" aria-hidden>/</span>}
                {m === null ? (
                  <span className="text-texto-3" title={migas.slice(1, -2).map(x => x.texto).join(' / ')}>…</span>
                ) : ultima ? (
                  <span aria-current="page" className="truncate font-medium text-tinta">{m.texto}</span>
                ) : (
                  <a href={m.href} className={cx('max-w-40 truncate rounded-[6px] text-texto-2 hover:text-tinta', FOCO)}>{m.texto}</a>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
      {estado && (
        <span role="status" className={cx('inline-flex shrink-0 items-center gap-1 text-xs', estado === 'sin-subir' ? 'text-ambar-texto' : 'text-texto-3')}>
          {estado === 'guardado' && <><CheckIcon weight="bold" className="size-3" aria-hidden />Guardado{cuando && <span className="hidden sm:inline"> · {cuando}</span>}</>}
          {estado === 'guardando' && <><CircleNotchIcon className="size-3 animate-spin motion-reduce:animate-none" aria-hidden />Guardando…</>}
          {estado === 'sin-subir' && (
            <>
              <WarningIcon weight="fill" className="size-3" aria-hidden />Sin subir
              {onReintentar && <button type="button" onClick={onReintentar} className={cx('ml-1 cursor-pointer font-medium underline underline-offset-2', FOCO)}>Reintentar</button>}
            </>
          )}
        </span>
      )}
    </div>
  )
}
