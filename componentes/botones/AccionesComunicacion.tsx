'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { EnvelopeSimple, Phone, VideoCamera, WhatsappLogo, type Icon } from '@phosphor-icons/react'
import { Tooltip } from '../base/Tooltip'
import { cx, FOCO } from '../base/utilidades'

/**
 * Correo, llamar, Meet y WhatsApp (SKILL.md §1c Ficha): cuadrados de 38 con tooltip que nombra
 * el dato, separados por una rayita del único relleno (`principal`). En celular (`modo="celular"`)
 * pasan a accesos con ícono relleno y rótulo, en grilla de 4.
 * Llamar queda prendido en verde con el tiempo mientras dura; al cortar se llama a `onLlamadaTerminada`
 * con los segundos, para registrarla en la actividad.
 */
export type Contacto = { nombre: string; correo?: string; telefono?: string }

export type AccionesComunicacionProps = {
  contacto: Contacto
  onCorreo?: () => void
  onLlamar?: () => void
  onLlamadaTerminada?: (segundos: number) => void
  onMeet?: () => void
  onWhatsapp?: () => void
  /** El único botón relleno de la cabecera ("Nueva tarea"), a la derecha de la rayita. */
  principal?: ReactNode
  modo?: 'escritorio' | 'celular'
}

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

export function AccionesComunicacion({ contacto, onCorreo, onLlamar, onLlamadaTerminada, onMeet, onWhatsapp, principal, modo = 'escritorio' }: AccionesComunicacionProps) {
  const [llamada, setLlamada] = useState<number | null>(null)
  useEffect(() => {
    if (llamada === null) return
    const t = setInterval(() => setLlamada(s => (s === null ? s : s + 1)), 1000)
    return () => clearInterval(t)
  }, [llamada === null]) // eslint-disable-line react-hooks/exhaustive-deps

  const llamar = () => {
    if (llamada !== null) { onLlamadaTerminada?.(llamada); setLlamada(null); return }
    onLlamar?.(); setLlamada(0)
  }

  const acciones: Array<{ id: string; icono: Icon; rotulo: string; dato: string; hacer?: () => void }> = [
    { id: 'correo', icono: EnvelopeSimple, rotulo: 'Correo', dato: contacto.correo ? `Escribir a ${contacto.correo}` : '', hacer: onCorreo },
    { id: 'llamar', icono: Phone, rotulo: 'Llamar', dato: contacto.telefono ? `Llamar al ${contacto.telefono}` : '', hacer: llamar },
    { id: 'meet', icono: VideoCamera, rotulo: 'Meet', dato: 'Crear reunión de Meet', hacer: onMeet },
    { id: 'whatsapp', icono: WhatsappLogo, rotulo: 'WhatsApp', dato: contacto.telefono ? `WhatsApp · ${contacto.telefono}` : '', hacer: onWhatsapp },
  ].filter(a => a.hacer && a.dato)

  if (modo === 'celular') {
    return (
      <div className="grid max-w-[360px] grid-cols-4 gap-2">
        {acciones.map(({ id, icono: Ico, rotulo, dato, hacer }) => (
          <button
            key={id}
            type="button"
            onClick={hacer}
            aria-label={id === 'llamar' && llamada !== null ? `Cortar llamada, ${mmss(llamada)}` : dato}
            className={cx(
              'flex min-h-[72px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-interno bg-superficie text-xs font-medium text-texto-2',
              'transition-transform duration-150 active:scale-[.96]',
              id === 'llamar' && llamada !== null && 'bg-verde-fondo text-verde-texto',
              FOCO,
            )}
          >
            <Ico size={22} weight="fill" aria-hidden className={id === 'llamar' && llamada !== null ? '' : 'text-acento'} />
            {id === 'llamar' && llamada !== null ? <span className="tabular-nums">{mmss(llamada)}</span> : rotulo}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {acciones.map(({ id, icono: Ico, dato, hacer }) => {
        const enLlamada = id === 'llamar' && llamada !== null
        return (
          <Tooltip key={id} texto={enLlamada ? 'Cortar' : dato.replace(/^(Escribir a|Llamar al) /, '')} describir={false}>
            <button
              type="button"
              onClick={hacer}
              aria-label={enLlamada ? `Cortar llamada con ${contacto.nombre}, ${mmss(llamada)}` : dato}
              className={cx(
                'inline-flex h-[38px] min-w-[38px] cursor-pointer items-center justify-center gap-1.5 rounded-control border text-[13px] font-medium',
                'transition-[background-color,transform] duration-150 active:scale-[.97] pointer-coarse:size-11',
                enLlamada ? 'border-transparent bg-verde-fondo px-3 text-verde-texto' : 'border-borde bg-superficie text-tinta shadow-min hover:bg-hover',
                FOCO,
              )}
            >
              <Ico size={17} weight={enLlamada ? 'fill' : 'regular'} aria-hidden />
              {enLlamada && <span className="tabular-nums">{mmss(llamada)}</span>}
            </button>
          </Tooltip>
        )
      })}
      {principal && (
        <>
          <span aria-hidden className="mx-1 hidden h-[22px] w-px bg-borde sm:block" />
          {principal}
        </>
      )}
    </div>
  )
}
