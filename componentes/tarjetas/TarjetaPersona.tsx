'use client'
/**
 * TarjetaPersona: quién es y cuánto tiene encima. Avatar con presencia, rol, tres cifras
 * (abiertas · vencidas · hechas en 7 días) y las dos próximas tareas. Las vencidas en rojo
 * solo si hay; en cero quedan grises.
 */
import { Avatar, type Persona, type PresenciaAvatar } from '../base/Avatar'
import { cx } from '../base/utilidades'
import { CajaTarjeta } from './compartido'

export type TareaPersona = { id: string; titulo: string; cuando: string; vencida?: boolean }

export type TarjetaPersonaProps = {
  persona: Persona
  rol: string
  presencia?: PresenciaAvatar
  /** "Presencial", "Remoto"… */
  modalidad?: string
  abiertas: number
  vencidas: number
  hechas7d: number
  proximas: readonly TareaPersona[]
  onAbrir?: () => void
  onAbrirTarea?: (id: string) => void
}

export function TarjetaPersona({
  persona, rol, presencia, modalidad, abiertas, vencidas, hechas7d, proximas, onAbrir, onAbrirTarea,
}: TarjetaPersonaProps) {
  const cifras = [
    { r: 'Abiertas', v: abiertas, alerta: false },
    { r: 'Vencidas', v: vencidas, alerta: vencidas > 0 },
    { r: 'Hechas 7 d', v: hechas7d, alerta: false },
  ]
  return (
    <CajaTarjeta aria-label={`${persona.nombre}, ${rol}`}>
      <div className="flex items-center gap-3">
        <Avatar persona={persona} tamano="lg" presencia={presencia} decorativo />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium text-tinta">
            {onAbrir ? (
              <button type="button" onClick={onAbrir} className="truncate text-left hover:underline pointer-coarse:min-h-11">
                {persona.nombre}
              </button>
            ) : persona.nombre}
          </h3>
          <p className="truncate text-xs text-texto-3">{rol}</p>
        </div>
        {modalidad && <span className="rounded-chip bg-suave px-2 py-0.5 text-xs text-texto-2">{modalidad}</span>}
      </div>

      <dl className="grid grid-cols-3 gap-2 rounded-interno bg-panel p-3">
        {cifras.map(c => (
          <div key={c.r} className="min-w-0">
            <dt className="truncate text-[11px] text-texto-3">{c.r}</dt>
            <dd className={cx('text-base font-medium tabular-nums', c.alerta ? 'text-rojo-texto' : 'text-tinta')}>{c.v}</dd>
          </div>
        ))}
      </dl>

      {proximas.length > 0 ? (
        <div className="flex flex-col gap-1">
          <p className="text-xs text-texto-3">Lo próximo</p>
          <ul className="flex flex-col">
            {proximas.slice(0, 2).map(t => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => onAbrirTarea?.(t.id)}
                  className="flex h-9 w-full items-center gap-3 rounded-chip px-1 text-left text-[13px] hover:bg-hover pointer-coarse:min-h-11"
                >
                  <span className="min-w-0 flex-1 truncate text-tinta">{t.titulo}</span>
                  <span className={cx('text-xs tabular-nums', t.vencida ? 'text-rojo-texto' : 'text-texto-3')}>{t.cuando}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-[13px] text-texto-3">Sin nada abierto</p>
      )}
    </CajaTarjeta>
  )
}
