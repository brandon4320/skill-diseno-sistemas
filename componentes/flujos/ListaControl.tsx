'use client'
/**
 * ListaControl ("Primeros pasos"): pasos de puesta en marcha con avance, uno abierto a la vez con su acción,
 * y sugerencias que se descartan. Patrón 14.11 · 12-flujos.html#lista-de-control
 *
 * - El avance se escribe ("2 de 5") y se dibuja en una barra fina; los hechos quedan tachados en gris con ✓ verde.
 * - El primer pendiente se abre solo; cada paso abierto muestra una línea de por qué y un único botón.
 * - Al completar todo la tarjeta se cierra con un festejo corto y se puede ocultar.
 * - Las sugerencias son pastillas con su × (44 px en celular).
 *
 *   <ListaControl pasos={[{ id: 'logo', titulo: 'Subí el logo', detalle: 'Sale en cotizaciones y facturas', hecho: true }, …]}
 *     onHacer={(id) => abrir(id)} sugerencias={[{ id: 'cel', texto: 'Instalar en el celular', icono: DeviceMobileIcon }]} onDescartar={…} />
 */
import { useId, useState } from 'react'
import { CaretDownIcon, CheckIcon, ConfettiIcon, XIcon, type Icon } from '@phosphor-icons/react'
import { cx, FOCO } from './compartido'

export type PasoControl = { id: string; titulo: string; detalle?: string; hecho: boolean; accion?: string }
export type Sugerencia = { id: string; texto: string; icono: Icon }

export type ListaControlProps = {
  titulo?: string
  pasos: PasoControl[]
  onHacer: (id: string) => void
  sugerencias?: Sugerencia[]
  onDescartar?: (id: string) => void
  onOcultar?: () => void
}

export function ListaControl({ titulo = 'Primeros pasos', pasos, onHacer, sugerencias = [], onDescartar, onOcultar }: ListaControlProps) {
  const tid = useId()
  const hechos = pasos.filter((p) => p.hecho).length
  const [abierto, setAbierto] = useState<string | null>(() => pasos.find((p) => !p.hecho)?.id ?? null)
  const completo = hechos === pasos.length

  return (
    <section aria-labelledby={tid} className="rounded-tarjeta border border-borde bg-superficie p-5">
      <div className="flex items-center gap-3">
        <h3 id={tid} className="font-display text-base font-medium">{titulo}</h3>
        <span className="ml-auto text-xs text-texto-3 tabular-nums">{hechos} de {pasos.length}</span>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-suave" role="progressbar" aria-valuemin={0} aria-valuemax={pasos.length} aria-valuenow={hechos} aria-label="Avance">
        <div className="h-full rounded-full bg-verde-texto transition-[width] duration-500 ease-(--ease)" style={{ width: `${(hechos / pasos.length) * 100}%` }} />
      </div>

      {completo ? (
        <div className="mt-5 flex items-center gap-3 rounded-control bg-verde-fondo p-4 text-[13px] text-verde-texto">
          <ConfettiIcon size={20} aria-hidden />
          <span className="flex-1">Listo: el espacio quedó armado.</span>
          {onOcultar && <button type="button" onClick={onOcultar} className={cx('min-h-9 rounded-control px-2 font-medium hover:bg-verde-texto/10 max-md:min-h-11', FOCO)}>Ocultar</button>}
        </div>
      ) : (
        <ul className="mt-3 flex flex-col">
          {pasos.map((p) => {
            const on = abierto === p.id
            return (
              <li key={p.id} className="border-b border-divisor last:border-0">
                <button type="button" aria-expanded={on} onClick={() => setAbierto(on ? null : p.id)} className={cx('flex min-h-11 w-full items-center gap-3 py-2 text-left text-[13px]', FOCO)}>
                  <span className={cx('grid size-[18px] shrink-0 place-items-center rounded-full border-[1.5px]', p.hecho ? 'border-verde-texto bg-verde-texto text-white' : 'border-borde-fuerte')}>
                    {p.hecho && <CheckIcon size={11} weight="bold" aria-hidden />}
                  </span>
                  <span className={cx('flex-1', p.hecho ? 'text-texto-3 line-through' : 'font-medium text-tinta')}>
                    {p.titulo}<span className="sr-only">{p.hecho ? ' (hecho)' : ' (pendiente)'}</span>
                  </span>
                  <CaretDownIcon size={14} aria-hidden className={cx('text-texto-3 transition-transform', on && 'rotate-180')} />
                </button>
                {on && (
                  <div className="flex flex-wrap items-center gap-3 pb-3 pl-[30px] text-[13px] text-texto-2">
                    {p.detalle && <span className="flex-1">{p.detalle}</span>}
                    {!p.hecho && (
                      <button type="button" onClick={() => onHacer(p.id)} className={cx('h-8 rounded-control bg-tinta px-3 text-xs font-medium text-superficie shadow-principal hover:bg-tinta/90 max-md:h-11', FOCO)}>
                        {p.accion ?? 'Hacerlo ahora'}
                      </button>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}

      {sugerencias.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {sugerencias.map(({ id, texto, icono: Ic }) => (
            <span key={id} className="inline-flex h-[34px] items-center gap-2 rounded-full border border-borde bg-superficie pr-1 pl-3 text-[13px] max-md:h-11">
              <Ic size={15} className="text-texto-3" aria-hidden />{texto}
              {onDescartar && (
                <button type="button" onClick={() => onDescartar(id)} aria-label={`Descartar sugerencia: ${texto}`} className={cx('grid size-[26px] place-items-center rounded-full text-texto-3 hover:bg-suave hover:text-tinta max-md:size-11', FOCO)}>
                  <XIcon size={13} aria-hidden />
                </button>
              )}
            </span>
          ))}
        </div>
      )}
    </section>
  )
}
