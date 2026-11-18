'use client'
/**
 * Esperando tu OK: lo que un agente preparó y no ejecutó, como borrador con la acción a mano.
 * Principal para mandarlo, Editar en el lugar, Descartar y "Esperando tu OK · hace 4 min" a la
 * derecha. Al aprobar queda el resultado escrito y un Deshacer.
 * Galería viva: ejemplos/biblioteca/11-ia-automatizaciones.html#esperando-tu-ok
 */
import { useState, type ReactNode } from 'react'
import { ArrowCounterClockwiseIcon, CheckIcon, ClockIcon } from '@phosphor-icons/react'
import { Avatar, type Persona } from '../base/Avatar'
import { cx, FOCO } from '../base/utilidades'

export type BorradorAgente = {
  id: string
  agente: Persona
  /** "redactó un recordatorio". */
  accion: string
  /** "Para Mariana Quiroga · Grupo Atlas · FAC-01094". */
  para: ReactNode
  /** "Correo", "Cambio", "Documento". */
  tipo: string
  /** Cuerpo del borrador: texto del correo, el antes → después o el documento. */
  cuerpo: ReactNode
  /** Si el cuerpo es texto: se puede editar en el lugar. */
  textoEditable?: string
  /** Verbo del principal: "Enviar", "Aplicar cambio", "Emitir". */
  verbo: string
  /** Resultado al aprobar: "Enviado a Mariana Quiroga". */
  resultado: string
  hace: string
}

export type TarjetaBorradorProps = {
  borrador: BorradorAgente
  onAprobar: (id: string, textoEditado?: string) => void | Promise<void>
  onDescartar: (id: string) => void
  onDeshacer?: (id: string) => void
  className?: string
}

export function TarjetaBorrador({ borrador: b, onAprobar, onDescartar, onDeshacer, className }: TarjetaBorradorProps) {
  const [editando, setEditando] = useState(false)
  const [texto, setTexto] = useState(b.textoEditable ?? '')
  const [estado, setEstado] = useState<'espera' | 'enviando' | 'hecho'>('espera')

  const aprobar = async () => {
    setEstado('enviando')
    try {
      await onAprobar(b.id, b.textoEditable !== undefined ? texto : undefined)
      setEstado('hecho')
      setEditando(false)
    } catch {
      setEstado('espera')
    }
  }

  return (
    <article className={cx('rounded-tarjeta border border-borde bg-superficie shadow-min', className)} aria-label={`${b.agente.nombre} ${b.accion}`}>
      <header className="flex items-start gap-3 px-5 pt-4">
        <Avatar persona={b.agente} tamano="md" decorativo />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-tinta">
            {b.agente.nombre} {b.accion}
          </p>
          <p className="truncate text-xs text-texto-3">{b.para}</p>
        </div>
        <span className="inline-flex h-[22px] shrink-0 items-center rounded-chip bg-suave px-2 text-xs font-medium text-texto-2">{b.tipo}</span>
      </header>

      <div className="mx-5 mt-3 rounded-[12px] bg-panel px-4 py-3 text-[13px] leading-[1.55] text-tinta tabular-nums">
        {editando && b.textoEditable !== undefined ? (
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={5}
            aria-label="Editar borrador"
            className="block w-full resize-y bg-transparent outline-none"
            autoFocus
          />
        ) : b.textoEditable !== undefined ? (
          <p className="whitespace-pre-wrap">{texto}</p>
        ) : (
          b.cuerpo
        )}
      </div>

      <footer className="flex flex-wrap items-center gap-2 px-5 py-4" aria-live="polite">
        {estado === 'hecho' ? (
          <>
            <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-verde-texto">
              <CheckIcon size={14} weight="bold" aria-hidden />
              {b.resultado}
            </span>
            {onDeshacer && (
              <button
                type="button"
                onClick={() => {
                  onDeshacer(b.id)
                  setEstado('espera')
                }}
                className={cx('ml-auto inline-flex h-7 items-center gap-1.5 rounded-chip px-2 text-xs font-medium text-texto-2 hover:bg-suave hover:text-tinta max-md:h-11', FOCO)}
              >
                <ArrowCounterClockwiseIcon size={13} aria-hidden />
                Deshacer
              </button>
            )}
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={aprobar}
              disabled={estado === 'enviando'}
              className={cx('h-[34px] rounded-control bg-tinta px-4 text-[13px] font-medium text-superficie shadow-principal hover:bg-tinta/90 disabled:opacity-60 max-md:h-11', FOCO)}
            >
              <span className="grid [&>*]:col-start-1 [&>*]:row-start-1">
                <span className={cx(estado === 'enviando' && 'invisible')}>{b.verbo}</span>
                <span className={cx(estado !== 'enviando' && 'invisible')} aria-hidden={estado !== 'enviando'}>
                  Un momento…
                </span>
              </span>
            </button>
            {b.textoEditable !== undefined && (
              <button
                type="button"
                aria-pressed={editando}
                onClick={() => setEditando((e) => !e)}
                className={cx('h-[34px] rounded-control border border-borde bg-superficie px-4 text-[13px] font-medium text-tinta shadow-min hover:bg-hover max-md:h-11', FOCO)}
              >
                {editando ? 'Listo' : 'Editar'}
              </button>
            )}
            <button
              type="button"
              onClick={() => onDescartar(b.id)}
              className={cx('h-[34px] rounded-control px-3 text-[13px] font-medium text-texto-2 hover:bg-suave hover:text-tinta max-md:h-11', FOCO)}
            >
              Descartar
            </button>
            <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-ambar-texto">
              <ClockIcon size={13} aria-hidden />
              Esperando tu OK · {b.hace}
            </span>
          </>
        )}
      </footer>
    </article>
  )
}

/** Cabecera + pila de borradores: "3 esperan tu OK". */
export function BandejaOk({
  borradores,
  ...acciones
}: { borradores: BorradorAgente[] } & Omit<TarjetaBorradorProps, 'borrador' | 'className'>) {
  if (borradores.length === 0) return null
  const n = borradores.length
  return (
    <section aria-label="Esperan tu OK" className="flex flex-col gap-3">
      <header>
        <h3 className="text-sm font-medium text-tinta tabular-nums">
          {n} {n === 1 ? 'espera' : 'esperan'} tu OK
        </h3>
        <p className="text-xs text-texto-3">Los agentes preguntan antes de cambiar algo</p>
      </header>
      {borradores.map((b) => (
        <TarjetaBorrador key={b.id} borrador={b} {...acciones} />
      ))}
    </section>
  )
}
