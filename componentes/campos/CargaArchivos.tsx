'use client'

import { useId, useRef, useState, type ReactNode } from 'react'
import { ArrowClockwise, CheckCircle, File, FilePdf, FileXls, Image as Imagen, UploadSimple, WarningCircle, X } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

export type ArchivoCarga = {
  id: string
  nombre: string
  bytes: number
  /** 0–100 mientras sube; undefined cuando terminó. */
  progreso?: number
  error?: string
}

export type CargaArchivosProps = {
  rotulo: ReactNode
  archivos: ArchivoCarga[]
  /** Recibe los archivos ya filtrados por tipo y tamaño; los rechazados llegan a onRechazo. */
  onAgregar: (files: File[]) => void
  onQuitar: (id: string) => void
  onReintentar?: (id: string) => void
  onRechazo?: (motivos: string[]) => void
  /** ".pdf,.xlsx,image/*" */
  aceptar?: string
  /** En MB. */
  maxMb?: number
  multiple?: boolean
  /** "PDF o foto del remito, hasta 10 MB". */
  ayuda?: ReactNode
  className?: string
}

const peso = (b: number) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1).replace('.', ',')} MB`)
const iconoDe = (n: string) => (/\.pdf$/i.test(n) ? FilePdf : /\.(xlsx?|csv)$/i.test(n) ? FileXls : /\.(png|jpe?g|webp|heic)$/i.test(n) ? Imagen : File)

function acepta(f: File, aceptar?: string) {
  if (!aceptar) return true
  return aceptar.split(',').map((s) => s.trim().toLowerCase()).some((a) =>
    a.startsWith('.') ? f.name.toLowerCase().endsWith(a) : a.endsWith('/*') ? f.type.startsWith(a.slice(0, -1)) : f.type === a,
  )
}

/** Zona para soltar o elegir archivos (también pegar), con la lista: progreso, error con reintento y quitar. */
export function CargaArchivos({ rotulo, archivos, onAgregar, onQuitar, onReintentar, onRechazo, aceptar, maxMb = 10, multiple = true, ayuda, className }: CargaArchivosProps) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  const [encima, setEncima] = useState(false)

  const recibir = (lista: FileList | File[]) => {
    const ok: File[] = [], malos: string[] = []
    for (const f of Array.from(lista)) {
      if (!acepta(f, aceptar)) malos.push(`${f.name}: ese tipo de archivo no va acá.`)
      else if (f.size > maxMb * 1024 * 1024) malos.push(`${f.name}: pesa ${peso(f.size)}, el máximo es ${maxMb} MB.`)
      else ok.push(f)
    }
    if (ok.length) onAgregar(multiple ? ok : ok.slice(0, 1))
    if (malos.length) onRechazo?.(malos)
  }

  return (
    <div className={cx('flex w-[28rem] max-w-full flex-col gap-1.5', className)}>
      <span id={`${id}-rotulo`} className="text-[13px] font-medium text-texto-2">{rotulo}</span>
      <div
        onDragOver={(e) => { e.preventDefault(); setEncima(true) }}
        onDragLeave={() => setEncima(false)}
        onDrop={(e) => { e.preventDefault(); setEncima(false); recibir(e.dataTransfer.files) }}
        onPaste={(e) => { if (e.clipboardData.files.length) recibir(e.clipboardData.files) }}
        className={cx(
          'flex flex-col items-center gap-1 rounded-tarjeta border border-dashed px-4 py-5 text-center transition-colors duration-150 motion-reduce:transition-none',
          encima ? 'border-acento bg-acento-suave' : 'border-borde-fuerte bg-suave',
        )}
      >
        <UploadSimple size={20} aria-hidden className={encima ? 'text-acento' : 'text-texto-3'} />
        <p className="text-sm text-texto-2">
          Soltá acá o{' '}
          <button type="button" onClick={() => input.current?.click()} aria-describedby={`${id}-rotulo ${id}-ayuda`} className={cx('rounded-chip font-medium text-acento underline-offset-2 hover:underline', FOCO)}>
            elegí {multiple ? 'archivos' : 'un archivo'}
          </button>
        </p>
        <p id={`${id}-ayuda`} className="text-xs text-texto-3">{ayuda ?? `Hasta ${maxMb} MB`}</p>
        <input ref={input} type="file" hidden accept={aceptar} multiple={multiple} onChange={(e) => { if (e.target.files) recibir(e.target.files); e.target.value = '' }} />
      </div>
      {archivos.length > 0 && (
        <ul className="flex flex-col gap-1" aria-live="polite">
          {archivos.map((a) => {
            const Icono = iconoDe(a.nombre)
            const subiendo = a.progreso != null && !a.error
            return (
              <li key={a.id} className={cx('flex items-center gap-2.5 rounded-control border px-2.5 py-2', a.error ? 'border-rojo-texto/40 bg-rojo-fondo' : 'border-borde bg-superficie')}>
                <Icono size={18} weight="duotone" aria-hidden className={a.error ? 'text-rojo-texto' : 'text-texto-2'} />
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="flex items-baseline gap-2">
                    <span className="truncate text-[13px] text-tinta">{a.nombre}</span>
                    <span className="shrink-0 font-mono text-xs text-texto-3">{peso(a.bytes)}</span>
                  </span>
                  {a.error ? (
                    <span className="flex items-center gap-1 text-xs text-rojo-texto"><WarningCircle size={12} weight="fill" aria-hidden />{a.error}</span>
                  ) : subiendo ? (
                    <span role="progressbar" aria-label={`Subiendo ${a.nombre}`} aria-valuenow={a.progreso} aria-valuemin={0} aria-valuemax={100} className="h-1 overflow-hidden rounded-full bg-divisor">
                      <span className="block h-full rounded-full bg-acento transition-[width] duration-200 motion-reduce:transition-none" style={{ width: `${a.progreso}%` }} />
                    </span>
                  ) : null}
                </span>
                {!a.error && !subiendo && <CheckCircle size={16} weight="fill" aria-label="Subido" className="shrink-0 text-verde-texto" />}
                {a.error && onReintentar && (
                  <button type="button" onClick={() => onReintentar(a.id)} aria-label={`Reintentar ${a.nombre}`} className={cx('grid size-7 shrink-0 place-items-center rounded-control text-texto-2 hover:bg-hover max-sm:size-11', FOCO)}>
                    <ArrowClockwise size={14} aria-hidden />
                  </button>
                )}
                <button type="button" onClick={() => onQuitar(a.id)} aria-label={`${subiendo ? 'Cancelar' : 'Quitar'} ${a.nombre}`} className={cx('grid size-7 shrink-0 place-items-center rounded-control text-texto-3 hover:bg-hover hover:text-tinta max-sm:size-11', FOCO)}>
                  <X size={14} aria-hidden />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
