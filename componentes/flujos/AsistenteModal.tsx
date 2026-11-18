'use client'
/**
 * AsistenteModal: alta corta en 3 a 5 pasos dentro de un modal partido. A la izquierda el formulario del paso
 * con la barra segmentada arriba; a la derecha una ilustración que cambia con lo que se carga.
 * Patrón 14.5 · 12-flujos.html#asistente-en-modal-partido
 *
 * - <dialog> nativo: foco atrapado, Esc cierra, el foco vuelve al botón que lo abrió.
 * - "Atrás" como texto a la izquierda, "Continuar" como único botón lleno; en el último paso el verbo final.
 * - Continuar se apaga con su motivo escrito cuando el paso no está completo.
 * - En celular la ilustración se achica arriba (180 px) y el formulario ocupa el resto.
 *
 *   <AsistenteModal abierto={ver} onCerrar={() => setVer(false)} titulo="Nuevo espacio"
 *     pasos={[{ titulo: 'Nombre', contenido: <Campo…/>, listo: !!nombre }, …]}
 *     ilustracion={(i) => <Vista paso={i} nombre={nombre} />} textoFinal="Crear espacio" onTerminar={crear} />
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { XIcon } from '@phosphor-icons/react'
import { BarraPasos, BotonEspera, cx, FOCO } from './compartido'

export type PasoAsistente = {
  titulo: string
  descripcion?: string
  contenido: ReactNode
  /** false apaga Continuar. */
  listo?: boolean
  /** Por qué no se puede seguir ("Falta el nombre"). */
  falta?: string
}

export type AsistenteModalProps = {
  abierto: boolean
  onCerrar: () => void
  /** Nombre del flujo, para lectores de pantalla y la cabecera. */
  titulo: string
  pasos: PasoAsistente[]
  /** Panel derecho: recibe el paso actual. */
  ilustracion: (paso: number) => ReactNode
  textoFinal: string
  onTerminar: () => void | Promise<void>
}

export function AsistenteModal({ abierto, onCerrar, titulo, pasos, ilustracion, textoFinal, onTerminar }: AsistenteModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const [i, setI] = useState(0)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (abierto && !d.open) { setI(0); d.showModal() }
    if (!abierto && d.open) d.close()
  }, [abierto])

  const paso = pasos[i]
  const ultimo = i === pasos.length - 1
  const seguir = async () => {
    if (!ultimo) return setI(i + 1)
    await onTerminar()
    onCerrar()
  }

  return (
    <dialog
      ref={ref}
      onClose={onCerrar}
      aria-labelledby="asis-titulo"
      className="m-auto w-[min(100%-24px,880px)] overflow-hidden rounded-tarjeta border border-borde bg-superficie p-0 text-tinta shadow-flotante backdrop:bg-tinta/40 backdrop:backdrop-blur-[2px]"
    >
      <div className="grid min-h-[520px] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex flex-col p-8 max-md:order-2 max-md:p-6">
          <div className="mb-8 flex items-center gap-4">
            <BarraPasos total={pasos.length} actual={i} />
            <span className="text-xs text-texto-3 tabular-nums">{i + 1} de {pasos.length}</span>
            <button type="button" onClick={onCerrar} aria-label="Cerrar" className={cx('ml-auto grid size-8 place-items-center rounded-control text-texto-3 hover:bg-suave hover:text-tinta max-md:size-11', FOCO)}>
              <XIcon size={16} aria-hidden />
            </button>
          </div>
          <p id="asis-titulo" className="sr-only">{titulo}</p>
          <h2 className="font-display text-2xl font-medium tracking-tight">{paso.titulo}</h2>
          {paso.descripcion && <p className="mt-2 text-[13px] text-texto-2">{paso.descripcion}</p>}
          <div className="mt-6 flex flex-1 flex-col gap-4">{paso.contenido}</div>
          <div className="mt-8 flex items-center gap-2">
            {i > 0 && (
              <button type="button" onClick={() => setI(i - 1)} className={cx('min-h-11 rounded-control px-3 text-[13px] text-texto-2 hover:bg-suave hover:text-tinta', FOCO)}>Atrás</button>
            )}
            <BotonEspera className="ml-auto" hacer={seguir} textoEspera={ultimo ? 'Creando…' : 'Un momento…'} motivoBloqueo={paso.listo === false ? paso.falta ?? 'Completá este paso para seguir' : undefined}>
              {ultimo ? textoFinal : 'Continuar'}
            </BotonEspera>
          </div>
        </div>
        <div aria-hidden className="relative grid place-items-center overflow-hidden bg-panel p-8 max-md:order-1 max-md:min-h-[180px] max-md:p-6">
          {ilustracion(i)}
        </div>
      </div>
    </dialog>
  )
}
