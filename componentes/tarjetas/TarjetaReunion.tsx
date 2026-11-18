'use client'
/**
 * TarjetaReunion: la próxima reunión con cuenta regresiva viva (cambia cada minuto, cada
 * segundo en los últimos 5), agenda numerada, lugar y asistentes. A 5 min del inicio el botón
 * "Unirme" pasa a principal; terminada, la tarjeta queda en gris legible.
 */
import { useEffect, useState } from 'react'
import { MapPinIcon, VideoCameraIcon } from '@phosphor-icons/react'
import { Boton } from '../base/Boton'
import { PilaAvatares } from '../base/PilaAvatares'
import type { Persona } from '../base/Avatar'
import { cx } from '../base/utilidades'
import { CajaTarjeta } from './compartido'

export type TarjetaReunionProps = {
  titulo: string
  cliente: string
  inicio: Date
  fin: Date
  agenda?: readonly string[]
  lugar: { tipo: 'virtual' | 'presencial'; texto: string }
  asistentes: readonly Persona[]
  onUnirme?: () => void
}

const dos = (n: number) => String(n).padStart(2, '0')
const hora = (d: Date) => d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })

function useAhora(cadaMs: number) {
  const [ahora, setAhora] = useState(() => Date.now())
  useEffect(() => { const t = setInterval(() => setAhora(Date.now()), cadaMs); return () => clearInterval(t) }, [cadaMs])
  return ahora
}

export function TarjetaReunion({ titulo, cliente, inicio, fin, agenda, lugar, asistentes, onUnirme }: TarjetaReunionProps) {
  const falta0 = inicio.getTime() - Date.now()
  const ahora = useAhora(falta0 < 5 * 60_000 ? 1000 : 30_000)
  const falta = inicio.getTime() - ahora
  const enCurso = falta <= 0 && fin.getTime() > ahora
  const terminada = fin.getTime() <= ahora
  const pronto = falta > 0 && falta < 5 * 60_000

  let reloj = ''
  if (terminada) reloj = 'Terminó'
  else if (enCurso) reloj = 'En curso'
  else {
    const m = Math.floor(falta / 60_000), s = Math.floor((falta % 60_000) / 1000)
    reloj = m >= 60 ? `en ${Math.floor(m / 60)} h ${dos(m % 60)} min` : pronto ? `en ${m}:${dos(s)}` : `en ${m} min`
  }

  const Lugar = lugar.tipo === 'virtual' ? VideoCameraIcon : MapPinIcon
  return (
    <CajaTarjeta aria-label={`${titulo}, ${reloj}`}>
      <div className="flex items-center gap-3">
        <span className="text-xs text-texto-3">Próxima reunión</span>
        <span
          aria-live="polite"
          className={cx(
            'ml-auto rounded-chip px-2 py-0.5 text-xs font-medium tabular-nums',
            pronto || enCurso ? 'bg-ambar-fondo text-ambar-texto' : 'bg-suave text-texto-2',
          )}
        >
          {reloj}
        </span>
      </div>
      <div className="min-w-0">
        <h3 className={cx('truncate text-base font-medium', terminada ? 'text-texto-2' : 'text-tinta')}>{titulo} · {cliente}</h3>
        <p className="text-xs text-texto-2 tabular-nums">{hora(inicio)} – {hora(fin)}</p>
      </div>
      {agenda && agenda.length > 0 && (
        <ol className="flex flex-col gap-1.5 text-[13px]">
          {agenda.map((a, i) => (
            <li key={a} className="flex gap-3">
              <span className="font-mono text-xs leading-5 text-texto-2">{dos(i + 1)}</span>
              <span className="text-tinta">{a}</span>
            </li>
          ))}
        </ol>
      )}
      <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-divisor pt-3">
        <span className="inline-flex min-w-0 items-center gap-1.5 text-xs text-texto-2"><Lugar size={14} aria-hidden /><span className="truncate">{lugar.texto}</span></span>
        <PilaAvatares personas={asistentes} tamano="xs" max={4} rotulo="Asistentes" />
        {onUnirme && !terminada && lugar.tipo === 'virtual' && (
          <Boton tamano="chico" variante={pronto || enCurso ? 'principal' : 'secundario'} onClick={onUnirme} className="ml-auto pointer-coarse:h-11">
            Unirme
          </Boton>
        )}
      </div>
    </CajaTarjeta>
  )
}
