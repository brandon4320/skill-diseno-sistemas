'use client'
/**
 * Cuadro de escritura del chat: textarea que crece hasta 6 líneas, adjuntar a la izquierda,
 * modelo y Enviar a la derecha. Enter manda, Shift+Enter baja de línea; con la respuesta en
 * curso el botón pasa a Detener. Arriba van los chips de contexto ("FAC-01094 ×").
 * Galería viva: ejemplos/biblioteca/11-ia-automatizaciones.html#cuadro-de-escritura
 */
import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { ArrowUpIcon, CaretDownIcon, PaperclipIcon, StopIcon, XIcon, type Icon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

export type ChipContexto = { id: string; texto: string; icono?: Icon }

export type CuadroEscrituraProps = {
  onEnviar: (texto: string) => void
  /** Mientras el asistente responde: el botón pasa a Detener. */
  respondiendo?: boolean
  onDetener?: () => void
  onAdjuntar?: () => void
  contexto?: ChipContexto[]
  onQuitarContexto?: (id: string) => void
  /** Nombre corto del modelo ("Rápido", "Preciso"); abre el selector. */
  modelo?: string
  onElegirModelo?: () => void
  placeholder?: string
  deshabilitado?: boolean
  className?: string
}

const ALTO_MAX = 6 * 21 + 16

export function CuadroEscritura({
  onEnviar,
  respondiendo = false,
  onDetener,
  onAdjuntar,
  contexto = [],
  onQuitarContexto,
  modelo,
  onElegirModelo,
  placeholder = 'Preguntá o pedí algo…',
  deshabilitado = false,
  className,
}: CuadroEscrituraProps) {
  const [texto, setTexto] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)

  useLayoutEffect(() => {
    const ta = ref.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, ALTO_MAX)}px`
  }, [texto])

  const puedeEnviar = texto.trim().length > 0 && !deshabilitado && !respondiendo

  const enviar = () => {
    if (!puedeEnviar) return
    onEnviar(texto.trim())
    setTexto('')
    ref.current?.focus()
  }

  const tecla = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      enviar()
    }
  }

  return (
    <div
      className={cx(
        'rounded-tarjeta border border-borde bg-superficie shadow-min transition-shadow focus-within:border-borde-fuerte focus-within:shadow-hover',
        deshabilitado && 'bg-panel shadow-none',
        className,
      )}
    >
      {contexto.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-3 pt-3">
          {contexto.map(({ id, texto: t, icono: Ico }) => (
            <span key={id} className="inline-flex h-6 items-center gap-1 rounded-chip bg-suave pr-0.5 pl-2 text-xs font-medium text-texto-2">
              {Ico && <Ico size={12} aria-hidden />}
              <span className="max-w-40 truncate">{t}</span>
              {onQuitarContexto && (
                <button
                  type="button"
                  aria-label={`Quitar ${t}`}
                  onClick={() => onQuitarContexto(id)}
                  className={cx('grid size-5 place-items-center rounded-[5px] text-texto-3 hover:bg-hover hover:text-tinta max-md:-m-3 max-md:size-11', FOCO)}
                >
                  <XIcon size={11} aria-hidden />
                </button>
              )}
            </span>
          ))}
        </div>
      )}
      <textarea
        ref={ref}
        rows={1}
        value={texto}
        disabled={deshabilitado}
        onChange={(e) => setTexto(e.target.value)}
        onKeyDown={tecla}
        placeholder={placeholder}
        aria-label="Mensaje"
        className="block w-full resize-none bg-transparent px-4 pt-3 pb-1 text-[13px] leading-[21px] text-tinta outline-none placeholder:text-texto-3"
      />
      <div className="flex items-center gap-1 px-2 pb-2">
        {onAdjuntar && (
          <button
            type="button"
            aria-label="Adjuntar archivo"
            title="Adjuntar archivo"
            onClick={onAdjuntar}
            className={cx('grid size-7 place-items-center rounded-chip text-texto-3 hover:bg-hover hover:text-tinta max-md:size-11', FOCO)}
          >
            <PaperclipIcon size={16} aria-hidden />
          </button>
        )}
        <span className="ml-auto hidden text-xs text-texto-3 md:inline">
          <kbd className="font-mono">↵</kbd> enviar · <kbd className="font-mono">⇧↵</kbd> nueva línea
        </span>
        {modelo && (
          <button
            type="button"
            onClick={onElegirModelo}
            aria-label={`Modelo: ${modelo}. Cambiar`}
            className={cx(
              'inline-flex h-7 items-center gap-1 rounded-chip px-2 text-xs font-medium text-texto-2 hover:bg-hover hover:text-tinta max-md:h-11',
              !onAdjuntar && 'ml-auto',
              FOCO,
            )}
          >
            {modelo}
            <CaretDownIcon size={12} aria-hidden />
          </button>
        )}
        {respondiendo ? (
          <button
            type="button"
            onClick={onDetener}
            aria-label="Detener respuesta"
            title="Detener"
            className={cx('grid size-8 place-items-center rounded-control bg-tinta text-superficie max-md:size-11', !modelo && 'ml-auto', FOCO)}
          >
            <StopIcon size={14} weight="fill" aria-hidden />
          </button>
        ) : (
          <button
            type="button"
            onClick={enviar}
            disabled={!puedeEnviar}
            aria-label="Enviar"
            title="Enviar"
            className={cx(
              'grid size-8 place-items-center rounded-control transition-colors max-md:size-11',
              !modelo && 'ml-auto',
              puedeEnviar ? 'bg-tinta text-superficie' : 'bg-suave text-texto-3',
              FOCO,
            )}
          >
            <ArrowUpIcon size={16} weight="bold" aria-hidden />
          </button>
        )}
      </div>
    </div>
  )
}
