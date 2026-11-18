'use client'
/**
 * Tabla de automatizaciones: cada fila con su interruptor, las últimas 14 corridas como barritas
 * (rojo solo lo que falló, punteado los días sin corrida), la tasa de éxito, la última corrida,
 * el dueño y "Ejecutar". Las pausadas se apagan en el ícono, el texto sigue legible.
 * Filtro segmentado arriba (Todas · Activas · Con problemas · Pausadas) y vacío con salida.
 * Galería viva: ejemplos/biblioteca/11-ia-automatizaciones.html#tabla-de-automatizaciones
 */
import { useMemo, useState } from 'react'
import { PlayIcon, type Icon } from '@phosphor-icons/react'
import { Avatar, type Persona } from '../base/Avatar'
import { Interruptor } from '../base/Interruptor'
import { Segmentado } from '../base/Segmentado'
import { cx, FOCO } from '../base/utilidades'

/** o = salió bien · x = falló · p = parcial · - = no corrió ese día. */
export type DiaCorrida = 'o' | 'x' | 'p' | '-'

export type Automatizacion = {
  id: string
  nombre: string
  /** Disparador en palabras: "Todos los días 08:00", "2 días después de cerrar". */
  disparador: string
  icono: Icon
  activa: boolean
  /** Texto del problema si lo hay: "Falta conectar el correo". */
  problema?: string | null
  /** 14 días, del más viejo al de hoy. */
  corridas: DiaCorrida[]
  /** "18/11 08:00". */
  ultima?: string
  duenio: Persona
}

export function Corridas14({ dias, className }: { dias: DiaCorrida[]; className?: string }) {
  const corridos = dias.filter((d) => d !== '-')
  const malas = dias.filter((d) => d === 'x').length
  return (
    <span
      role="img"
      aria-label={`${corridos.length} corridas en 14 días, ${malas} ${malas === 1 ? 'falló' : 'fallaron'}`}
      className={cx('inline-flex h-5 items-end gap-[3px]', className)}
    >
      {dias.map((d, i) => (
        <i
          key={i}
          className={cx(
            'w-1 rounded-[2px]',
            d === 'o' && 'h-5 bg-verde-texto/70',
            d === 'p' && 'h-5 bg-ambar-texto',
            d === 'x' && 'h-5 bg-rojo-texto',
            d === '-' && 'h-5 border border-dashed border-borde-fuerte',
          )}
        />
      ))}
    </span>
  )
}

const exito = (d: DiaCorrida[]) => {
  const c = d.filter((x) => x !== '-')
  return c.length ? Math.round((c.filter((x) => x === 'o').length / c.length) * 100) : null
}

type Filtro = 'todas' | 'activas' | 'problemas' | 'pausadas'

export type TablaAutomatizacionesProps = {
  items: Automatizacion[]
  onActivar: (id: string, activa: boolean) => void
  onEjecutar: (id: string) => void
  onAbrir?: (id: string) => void
  className?: string
}

export function TablaAutomatizaciones({ items, onActivar, onEjecutar, onAbrir, className }: TablaAutomatizacionesProps) {
  const [filtro, setFiltro] = useState<Filtro>('todas')
  const lista = useMemo(
    () =>
      items.filter((a) =>
        filtro === 'activas' ? a.activa : filtro === 'pausadas' ? !a.activa : filtro === 'problemas' ? !!a.problema || a.corridas.includes('x') : true,
      ),
    [items, filtro],
  )

  return (
    <div className={cx('overflow-hidden rounded-tarjeta border border-borde bg-superficie shadow-min', className)}>
      <div className="flex flex-wrap items-center gap-3 px-5 pt-4 pb-2">
        <Segmentado<Filtro>
          aria-label="Filtrar automatizaciones"
          valor={filtro}
          onCambio={setFiltro}
          opciones={[
            { valor: 'todas', texto: 'Todas' },
            { valor: 'activas', texto: 'Activas' },
            { valor: 'problemas', texto: 'Con problemas' },
            { valor: 'pausadas', texto: 'Pausadas' },
          ]}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-[13px]">
          <thead>
            <tr className="border-b border-divisor text-left text-xs text-texto-3">
              <th className="px-5 py-2 font-medium">Automatización</th>
              <th className="px-3 py-2 font-medium">Estado</th>
              <th className="px-3 py-2 font-medium">Últimas 14 corridas</th>
              <th className="px-3 py-2 text-right font-medium">Éxito</th>
              <th className="px-3 py-2 font-medium">Última</th>
              <th className="px-3 py-2 font-medium">Dueño</th>
              <th className="px-5 py-2 text-right font-medium">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {lista.map((a) => {
              const Ico = a.icono
              const e = exito(a.corridas)
              return (
                <tr key={a.id} className={cx('border-b border-divisor last:border-0 hover:bg-hover', !a.activa && 'text-texto-3')}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className={cx('grid size-9 shrink-0 place-items-center rounded-control bg-panel text-texto-2', !a.activa && 'opacity-55')}>
                        <Ico size={17} aria-hidden />
                      </span>
                      <div className="min-w-0">
                        {onAbrir ? (
                          <button type="button" onClick={() => onAbrir(a.id)} className={cx('truncate text-left font-medium hover:underline', a.activa ? 'text-tinta' : 'text-texto-2', FOCO)}>
                            {a.nombre}
                          </button>
                        ) : (
                          <b className={cx('block truncate font-medium', a.activa ? 'text-tinta' : 'text-texto-2')}>{a.nombre}</b>
                        )}
                        <small className="block truncate text-xs text-texto-3">{a.disparador}</small>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Interruptor aria-label={`${a.activa ? 'Pausar' : 'Activar'} ${a.nombre}`} activo={a.activa} onCambio={(v) => onActivar(a.id, v)} />
                      <span className={cx('text-xs font-medium', a.problema ? 'text-ambar-texto' : a.activa ? 'text-verde-texto' : 'text-texto-3')}>
                        {a.problema ? a.problema : a.activa ? 'Activa' : 'Pausada'}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <Corridas14 dias={a.corridas} />
                  </td>
                  <td className={cx('px-3 py-3 text-right tabular-nums', e !== null && e < 80 ? 'text-rojo-texto' : 'text-texto-2')}>{e === null ? '—' : `${e} %`}</td>
                  <td className="px-3 py-3 text-xs text-texto-2 tabular-nums">{a.ultima ?? '—'}</td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-2 text-xs text-texto-2">
                      <Avatar persona={a.duenio} tamano="xs" decorativo />
                      {a.duenio.nombre.split(' ')[0]}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      disabled={!a.activa}
                      onClick={() => onEjecutar(a.id)}
                      className={cx(
                        'inline-flex h-7 items-center gap-1.5 rounded-chip px-2.5 text-xs font-medium text-texto-2 hover:bg-suave hover:text-tinta disabled:text-texto-3 disabled:hover:bg-transparent max-md:h-11',
                        FOCO,
                      )}
                    >
                      <PlayIcon size={12} weight="fill" aria-hidden />
                      Ejecutar
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {lista.length === 0 && (
        <p className="px-5 py-10 text-center text-[13px] text-texto-3">
          Ninguna automatización en este filtro.{' '}
          <button type="button" onClick={() => setFiltro('todas')} className={cx('font-medium text-tinta underline-offset-2 hover:underline', FOCO)}>
            Ver todas
          </button>
        </p>
      )}
    </div>
  )
}
