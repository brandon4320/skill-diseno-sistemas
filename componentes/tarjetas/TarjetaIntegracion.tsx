'use client'
/**
 * TarjetaIntegracion: una conexión con otra app. Ícono en cuadro con el color de la app,
 * qué hace en una oración, estado con palabra (Conectada · Falló · Apagada) y, si falló,
 * la causa con la salida concreta. Apagada: se apaga el dibujo, el texto queda legible.
 */
import type { Icon } from '@phosphor-icons/react'
import { CheckCircleIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { Boton } from '../base/Boton'
import { Interruptor } from '../base/Interruptor'
import { cx } from '../base/utilidades'
import { CajaTarjeta } from './compartido'

export type EstadoIntegracion = 'conectada' | 'fallo' | 'apagada' | 'disponible'

export type TarjetaIntegracionProps = {
  nombre: string
  detalle: string
  que: string
  icono: Icon
  color: string
  estado: EstadoIntegracion
  /** "sincronizó hace 8 min", "Apagada por Ana Ruiz · 2 nov" */
  nota?: string
  /** Solo con estado "fallo": qué pasó y qué hacer. */
  causa?: string
  accion?: { texto: string; onClick: () => void }
  onEncender?: (activa: boolean) => void
}

export function TarjetaIntegracion({ nombre, detalle, que, icono: Icono, color, estado, nota, causa, accion, onEncender }: TarjetaIntegracionProps) {
  const apagada = estado === 'apagada'
  const disponible = estado === 'disponible'
  return (
    <CajaTarjeta
      aria-label={nombre}
      apagada={disponible}
      className={cx(estado === 'fallo' && 'border-rojo-texto/30', disponible && 'border-dashed')}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className={cx('grid size-10 flex-none place-items-center rounded-control text-white', apagada && 'opacity-50 grayscale')}
          style={{ background: color }}
        >
          <Icono size={20} weight="fill" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className={cx('truncate text-sm font-medium', apagada ? 'text-texto-2' : 'text-tinta')}>{nombre}</h3>
          <p className="truncate text-xs text-texto-3">{detalle}</p>
        </div>
        {onEncender && !disponible && (
          <Interruptor aria-label={`${apagada ? 'Encender' : 'Apagar'} ${nombre}`} activo={!apagada} onCambio={onEncender} />
        )}
      </div>
      <p className="text-xs leading-normal text-texto-2">{que}</p>

      {(estado === 'conectada' || estado === 'fallo' || nota) && (
        <p className="flex flex-wrap items-center gap-2 text-xs text-texto-3 tabular-nums">
          {estado === 'conectada' && <span className="inline-flex items-center gap-1 font-medium text-verde-texto"><CheckCircleIcon size={13} weight="fill" aria-hidden />Conectada</span>}
          {estado === 'fallo' && <span className="inline-flex items-center gap-1 font-medium text-rojo-texto"><WarningCircleIcon size={13} weight="fill" aria-hidden />Falló</span>}
          {nota && <span>{estado === 'apagada' ? nota : `· ${nota}`}</span>}
        </p>
      )}

      {estado === 'fallo' && causa && (
        <p role="alert" className="flex items-start gap-3 rounded-control bg-rojo-fondo px-3 py-2.5 text-xs leading-snug text-rojo-texto">
          <WarningCircleIcon size={16} className="mt-px flex-none" aria-hidden />{causa}
        </p>
      )}

      {accion && (
        <div className="mt-auto flex border-t border-divisor pt-3">
          <Boton tamano="chico" variante={estado === 'fallo' || disponible ? 'principal' : 'secundario'} onClick={accion.onClick} className="ml-auto pointer-coarse:h-11">
            {accion.texto}
          </Boton>
        </div>
      )}
    </CajaTarjeta>
  )
}
