/**
 * VacioIlustrado: los tres vacíos de §6 Textos con las ilustraciones de la casa.
 *
 * - caso "primera-vez": invita a crear. Título = qué va a aparecer acá; texto con un dato real;
 *   máximo dos botones, uno relleno. Si el módulo es nuevo, `guia` con los pasos.
 * - caso "al-dia": buena noticia sin botón de crear, clima verde. Qué se resolvió y qué viene.
 * - caso "filtro": no es "no hay datos" sino "no hay con este filtro". Nombra el filtro, cuenta lo
 *   que sí existe y ofrece limpiar el que más destraba (`filtros`) y un "¿Quisiste decir…?".
 *
 *   <VacioIlustrado caso="primera-vez" ilustracion="sin-clientes" titulo="Todavía no hay clientes"
 *     texto="Cargá el primero o importá tu planilla: acá aparecen con su saldo."
 *     acciones={<><Boton variante="principal">Nuevo cliente</Boton><Boton>Importar CSV</Boton></>}
 *     guia={<GuiaPasos pasos={[...]} />} />
 */
import type { ReactNode } from 'react'
import { XIcon } from '@phosphor-icons/react'
import { Ilustracion, CLIMA, type TamanoIlustracion } from './Ilustracion'
import type { NombreIlustracion } from './ilustraciones'

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')
const FOCO = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento/45'

export type CasoVacio = 'primera-vez' | 'al-dia' | 'filtro'

export type FiltroActivo = { texto: string; onLimpiar: () => void }

export type VacioIlustradoProps = {
  caso: CasoVacio
  titulo: string
  texto?: ReactNode
  /** Por defecto: sin-resultados para "filtro", sin-tareas para "al-dia", archivo-vacio para el resto. */
  ilustracion?: NombreIlustracion
  /** "pagina" 176 · "hoja" 112 · "fila" 64. */
  tamano?: TamanoIlustracion
  /** Primera vez: hasta dos botones (uno relleno). Al día: como mucho uno de texto ("Ver lo de mañana"). */
  acciones?: ReactNode
  /** Caso filtro: el filtro que más destraba primero. Si hay más de uno, se suma "Limpiar todo". */
  filtros?: FiltroActivo[]
  onLimpiarTodo?: () => void
  /** Caso filtro: "¿Quisiste decir Orbe Retail?". */
  sugerencia?: { texto: string; onUsar: () => void }
  /** Guía de primeros pasos debajo (solo primera vez). */
  guia?: ReactNode
  className?: string
}

const ILUS_DEFECTO: Record<CasoVacio, NombreIlustracion> = { 'primera-vez': 'archivo-vacio', 'al-dia': 'sin-tareas', filtro: 'sin-resultados' }

export function VacioIlustrado({ caso, titulo, texto, ilustracion, tamano = 'hoja', acciones, filtros, onLimpiarTodo, sugerencia, guia, className }: VacioIlustradoProps) {
  const fila = tamano === 'fila' || tamano === 64
  if (fila) {
    return (
      <div role="status" className={cn('flex items-center gap-3 rounded-tarjeta border border-borde bg-superficie px-4 py-3', caso === 'al-dia' && 'bg-[radial-gradient(60%_120%_at_10%_50%,color-mix(in_oklch,var(--color-verde-texto)_8%,transparent),transparent_70%)]', className)}>
        <Ilustracion nombre={ilustracion ?? ILUS_DEFECTO[caso]} tamano="fila" />
        <div className="min-w-0">
          <b className="block text-[13px] font-medium text-tinta">{titulo}</b>
          {texto && <span className="block text-xs text-texto-3">{texto}</span>}
        </div>
        {acciones && <div className="ml-auto flex shrink-0 gap-2">{acciones}</div>}
      </div>
    )
  }
  const grande = tamano === 'pagina' || (typeof tamano === 'number' && tamano >= 160)
  return (
    <div
      role={caso === 'filtro' ? 'status' : undefined}
      className={cn(
        'flex flex-col items-center text-center',
        grande ? 'px-6 py-10' : 'px-5 py-8',
        caso === 'al-dia' ? CLIMA.bueno : CLIMA.neutro,
        className,
      )}
    >
      <Ilustracion nombre={ilustracion ?? ILUS_DEFECTO[caso]} tamano={tamano} aparece={caso === 'al-dia'} />
      <h4 className={cn('mt-2 font-display font-medium tracking-[-.02em] text-tinta', grande ? 'text-xl' : 'text-base')}>{titulo}</h4>
      {texto && <p className="mt-1 max-w-[34ch] text-[13px] leading-normal text-pretty text-texto-2">{texto}</p>}

      {(acciones || (caso === 'filtro' && filtros?.length)) && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {caso === 'filtro' && filtros?.[0] && (
            <button type="button" onClick={filtros[0].onLimpiar} className={cn('inline-flex h-9 items-center gap-1.5 rounded-control border border-borde bg-superficie px-3.5 text-[13px] font-medium shadow-min transition-[background,transform] duration-150 hover:bg-hover active:scale-[.97] max-md:h-11', FOCO)}>
              Limpiar «{filtros[0].texto}»
              <XIcon size={13} className="text-texto-3" />
            </button>
          )}
          {caso === 'filtro' && filtros && filtros.length > 1 && onLimpiarTodo && (
            <button type="button" onClick={onLimpiarTodo} className={cn('inline-flex h-9 items-center rounded-control px-3 text-[13px] font-medium text-texto-2 hover:bg-hover hover:text-tinta max-md:h-11', FOCO)}>
              Limpiar todo
            </button>
          )}
          {acciones}
        </div>
      )}

      {caso === 'filtro' && sugerencia && (
        <p className="mt-3 text-[13px] text-texto-2">
          ¿Quisiste decir{' '}
          <button type="button" onClick={sugerencia.onUsar} className={cn('font-medium text-acento underline underline-offset-[3px] max-md:min-h-11', FOCO)}>
            {sugerencia.texto}
          </button>
          ?
        </p>
      )}
      {guia && <div className="mt-6 w-full max-w-[400px] text-left">{guia}</div>}
    </div>
  )
}

export type PasoGuia = { titulo: string; texto?: string; hecho?: boolean; accion?: ReactNode }

/** Guía de primeros pasos: número gris → círculo verde con ✓; el contador dice cuánto falta. */
export function GuiaPasos({ pasos, rotulo = 'Para empezar', duracion = 'unos 2 min' }: { pasos: PasoGuia[]; rotulo?: string; duracion?: string }) {
  const hechos = pasos.filter((p) => p.hecho).length
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between px-0.5 pb-1 text-xs text-texto-3">
        <span>{rotulo}</span>
        <span className="tabular-nums">
          {hechos} de {pasos.length} · {hechos ? 'falta poco' : duracion}
        </span>
      </div>
      <ol className="flex flex-col gap-1">
        {pasos.map((p, i) => (
          <li key={p.titulo} className="flex items-center gap-3 rounded-control border border-borde bg-superficie px-3 py-2">
            <span
              className={cn(
                'grid size-6 shrink-0 place-items-center rounded-full text-xs font-medium tabular-nums',
                p.hecho ? 'bg-verde-texto text-superficie' : 'bg-suave text-texto-2',
              )}
              aria-hidden
            >
              {p.hecho ? '✓' : i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <b className={cn('block text-[13px] font-medium', p.hecho ? 'text-texto-3' : 'text-tinta')}>
                {p.titulo}
                {p.hecho && <span className="sr-only"> (hecho)</span>}
              </b>
              {p.texto && <span className="block text-xs text-texto-3">{p.texto}</span>}
            </div>
            {!p.hecho && p.accion}
          </li>
        ))}
      </ol>
    </div>
  )
}
