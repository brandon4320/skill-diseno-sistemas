'use client'
/**
 * TarjetaDocumento: archivo o contrato. Hoja con la esquina doblada y el tipo (PDF, DOC, XLS)
 * en una etiqueta oscurecida para que el blanco llegue a 4,5:1; nombre, tamaño y fecha; si es
 * contrato, quién firmó y quién falta.
 */
import { Avatar, type Persona } from '../base/Avatar'
import { Pastilla } from '../base/Pastilla'
import { cx, FOCO } from '../base/utilidades'
import { CajaTarjeta } from './compartido'

export type TipoDocumento = 'PDF' | 'DOC' | 'XLS' | 'IMG' | 'ZIP'

const COLOR_TIPO: Record<TipoDocumento, string> = {
  PDF: 'var(--color-dato-5)', DOC: 'var(--color-dato-1)', XLS: 'var(--color-dato-3)', IMG: 'var(--color-dato-2)', ZIP: 'var(--color-texto-3)',
}

export function HojaTipo({ tipo }: { tipo: TipoDocumento }) {
  const c = COLOR_TIPO[tipo]
  return (
    <span className="relative block h-11 w-9 flex-none" aria-label={tipo} role="img">
      <svg viewBox="0 0 36 44" className="size-full" aria-hidden>
        <path d="M4.5.5h19l12 12v27a4 4 0 0 1-4 4h-27a4 4 0 0 1-4-4v-35a4 4 0 0 1 4-4z" fill="var(--color-superficie)" stroke="var(--color-borde-fuerte)" />
        <path d="M23.5.5v8a4 4 0 0 0 4 4h8" fill="none" stroke="var(--color-borde-fuerte)" />
      </svg>
      <span
        aria-hidden
        className="absolute bottom-1.5 -left-1 h-4 rounded px-1 font-mono text-[11px] leading-4 font-medium text-white"
        style={{ background: `color-mix(in oklch, ${c} 70%, #000)` }}
      >
        {tipo}
      </span>
    </span>
  )
}

export type Firmante = { persona: Persona; firmo: boolean }

export type TarjetaDocumentoProps = {
  nombre: string
  tipo: TipoDocumento
  /** "1,2 MB · 14 nov" */
  meta: string
  firmantes?: readonly Firmante[]
  onAbrir?: () => void
}

export function TarjetaDocumento({ nombre, tipo, meta, firmantes, onAbrir }: TarjetaDocumentoProps) {
  const faltan = firmantes?.filter(f => !f.firmo).length ?? 0
  return (
    <CajaTarjeta clickeable={!!onAbrir} className="relative gap-3" aria-label={nombre}>
      <div className="flex items-center gap-4">
        <HojaTipo tipo={tipo} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium text-tinta">
            {onAbrir ? (
              <button type="button" onClick={onAbrir} className={cx('truncate text-left after:absolute after:inset-0 after:rounded-tarjeta', FOCO)}>{nombre}</button>
            ) : nombre}
          </h3>
          <p className="truncate text-xs text-texto-3 tabular-nums">{meta}</p>
        </div>
      </div>
      {firmantes && firmantes.length > 0 && (
        <div className="flex items-center gap-3 border-t border-divisor pt-3">
          <ul className="flex -space-x-1.5" aria-label="Firmantes">
            {firmantes.map(f => (
              <li key={f.persona.id} className={cx(!f.firmo && 'opacity-50 grayscale')} title={`${f.persona.nombre}: ${f.firmo ? 'firmó' : 'falta'}`}>
                <Avatar persona={f.persona} tamano="sm" anillo />
              </li>
            ))}
          </ul>
          <span className="ml-auto">
            {faltan === 0 ? <Pastilla tono="verde">Firmado</Pastilla> : <Pastilla tono="ambar">{faltan === 1 ? 'Falta 1 firma' : `Faltan ${faltan} firmas`}</Pastilla>}
          </span>
        </div>
      )}
    </CajaTarjeta>
  )
}
