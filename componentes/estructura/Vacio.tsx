/**
 * Vacio: toda lista tiene el suyo. Ilustración de línea chica en el tinte del acento,
 * una frase que dice QUÉ va a aparecer acá y el botón que lo crea.
 *
 *   <Vacio
 *     dibujo="lista"
 *     titulo="Todavía no hay oportunidades"
 *     texto="Cargá la primera y aparece en el pipeline con su etapa."
 *     accion={<BotonPrincipal icono={PlusIcon}>Nueva oportunidad</BotonPrincipal>}
 *   />
 *
 * Si lo que deja la lista vacía es un filtro, decilo y ofrecé limpiarlo (prop `filtro`):
 * eso no es "no hay datos", es "no hay con este filtro".
 */
import type { ReactNode } from 'react'
import { XIcon } from '@phosphor-icons/react'

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

export type DibujoVacio = 'lista' | 'busqueda' | 'bandeja' | 'calendario' | 'archivos'

export type VacioProps = {
  titulo: string
  texto?: ReactNode
  accion?: ReactNode
  dibujo?: DibujoVacio | ReactNode
  /** Cuando un filtro es lo que deja la lista vacía. */
  filtro?: { texto: string; onLimpiar: () => void }
  compacto?: boolean
  className?: string
}

export function Vacio({ titulo, texto, accion, dibujo = 'lista', filtro, compacto, className }: VacioProps) {
  const arte = typeof dibujo === 'string' ? <Dibujo tipo={(filtro ? 'busqueda' : dibujo) as DibujoVacio} /> : dibujo
  return (
    <div className={cn('flex flex-col items-center gap-2 text-center', compacto ? 'px-4 py-4' : 'px-6 py-8', className)}>
      {!compacto && <div className="mb-1 text-acento">{arte}</div>}
      <h4 className="font-display text-base font-medium tracking-[-.01em] text-tinta">{titulo}</h4>
      {texto && <p className="max-w-72 text-[13px] text-pretty text-texto-2">{texto}</p>}
      {(filtro || accion) && (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          {filtro && (
            <button
              type="button"
              onClick={filtro.onLimpiar}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-borde bg-superficie pr-3 pl-3 text-xs font-medium shadow-min transition-colors hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento/45"
            >
              Limpiar «{filtro.texto}»
              <XIcon size={12} className="text-texto-3" />
            </button>
          )}
          {accion}
        </div>
      )}
    </div>
  )
}

/** Dibujos de línea, 112×76, con currentColor (heredan el acento) en dos intensidades. */
function Dibujo({ tipo }: { tipo: DibujoVacio }) {
  const comun = {
    width: 112,
    height: 76,
    viewBox: '0 0 112 76',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.2,
    strokeLinecap: 'round' as const,
    'aria-hidden': true,
  }
  const mas = (x: number, y: number) => (
    <g>
      <circle cx={x} cy={y} r="9" fill="var(--color-superficie)" />
      <path d={`M${x} ${y - 4}v8M${x - 4} ${y}h8`} />
    </g>
  )
  switch (tipo) {
    case 'busqueda':
      return (
        <svg {...comun}>
          <rect x="14" y="14" width="66" height="46" rx="10" strokeDasharray="3 4" opacity=".45" />
          <path d="M28 30h30M28 40h20" opacity=".45" />
          <circle cx="72" cy="44" r="13" fill="var(--color-superficie)" />
          <path d="M81.5 53.5 92 64" strokeWidth="2" />
          <path d="M67 44h10" opacity=".7" />
        </svg>
      )
    case 'bandeja':
      return (
        <svg {...comun}>
          <path d="M22 40 32 18h48l10 22v18a6 6 0 0 1-6 6H28a6 6 0 0 1-6-6z" opacity=".5" strokeDasharray="3 4" />
          <path d="M22 40h18l4 7h24l4-7h18" />
          <path d="M44 28h24M48 34h16" opacity=".5" />
          {mas(88, 16)}
        </svg>
      )
    case 'calendario':
      return (
        <svg {...comun}>
          <rect x="18" y="16" width="70" height="48" rx="10" strokeDasharray="3 4" opacity=".5" />
          <path d="M18 30h70M34 10v10M72 10v10" opacity=".5" />
          <rect x="30" y="38" width="12" height="9" rx="3" />
          <path d="M50 42h10M68 42h8M30 54h8M46 54h14" opacity=".45" />
          {mas(90, 18)}
        </svg>
      )
    case 'archivos':
      return (
        <svg {...comun}>
          <path d="M30 14h30l14 14v36a6 6 0 0 1-6 6H30a6 6 0 0 1-6-6V20a6 6 0 0 1 6-6z" strokeDasharray="3 4" opacity=".5" />
          <path d="M60 14v10a4 4 0 0 0 4 4h10" opacity=".5" />
          <path d="M34 42h26M34 50h18" opacity=".5" />
          {mas(80, 58)}
        </svg>
      )
    default:
      return (
        <svg {...comun}>
          <rect x="18" y="14" width="74" height="46" rx="10" strokeDasharray="3 4" opacity=".5" />
          <circle cx="32" cy="30" r="4" opacity=".6" />
          <path d="M42 30h34M32 44h4M42 44h22" opacity=".5" />
          {mas(88, 16)}
        </svg>
      )
  }
}
