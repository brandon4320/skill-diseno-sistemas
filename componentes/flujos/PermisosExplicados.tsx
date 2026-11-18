'use client'
/**
 * PermisosExplicados: un interruptor por área y, debajo de cada nombre, qué significa en la práctica
 * ("Puede ver, crear y cambiar" / "No lo ve, ni en búsquedas"). Patrón 14.20 · 12-flujos.html#permisos-con-explicacion
 *
 * - Modo de acceso global (Solo ver | Ver y actuar) arriba; la consecuencia de cada fila cambia con él.
 * - Las áreas apagadas bajan el ícono, pero los textos mantienen contraste AA.
 * - El foco vuelve al mismo interruptor después de cada cambio.
 *
 *   <PermisosExplicados modo={modo} onModo={setModo} areas={areas} onCambio={(id, on) => …} />
 */
import { Interruptor } from '../base/Interruptor'
import { Segmentado } from '../base/Segmentado'
import type { Icon } from '@phosphor-icons/react'
import { cx } from './compartido'

export type ModoAcceso = 'ver' | 'actuar'
export type AreaPermiso = { id: string; nombre: string; descripcion: string; icono: Icon; color: string; activo: boolean }

const MODOS = [{ valor: 'ver', texto: 'Solo ver' }, { valor: 'actuar', texto: 'Ver y actuar' }] as const

export type PermisosExplicadosProps = {
  areas: AreaPermiso[]
  onCambio: (id: string, activo: boolean) => void
  modo: ModoAcceso
  onModo: (m: ModoAcceso) => void
}

export function PermisosExplicados({ areas, onCambio, modo, onModo }: PermisosExplicadosProps) {
  const consecuencia = (on: boolean) => (!on ? 'No lo ve, ni en búsquedas' : modo === 'actuar' ? 'Puede ver, crear y cambiar' : 'Solo ve; no cambia nada')
  return (
    <div className="flex flex-col gap-3">
      <Segmentado<ModoAcceso> aria-label="Acceso" valor={modo} onCambio={onModo} opciones={MODOS} />
      <ul className="flex flex-col">
        {areas.map(({ id, nombre, descripcion, icono: Ic, color, activo }) => (
          <li key={id} className="flex min-h-[60px] items-center gap-3.5 border-b border-divisor py-2 last:border-0">
            <span aria-hidden className={cx('grid size-8 shrink-0 place-items-center rounded-[10px] transition-opacity', !activo && 'opacity-50')} style={{ background: `color-mix(in oklch, ${color} 14%, var(--color-superficie))`, color }}>
              <Ic size={16} />
            </span>
            <span className="min-w-0 flex-1">
              <b className={cx('block text-[13px] font-medium', activo ? 'text-tinta' : 'text-texto-2')}>{nombre}</b>
              <small className="mt-0.5 block text-xs text-texto-3">{descripcion}</small>
              <small aria-live="polite" className="block text-xs text-texto-3">{consecuencia(activo)}</small>
            </span>
            <Interruptor aria-label={nombre} activo={activo} onCambio={(v) => onCambio(id, v)} />
          </li>
        ))}
      </ul>
    </div>
  )
}
