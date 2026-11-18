'use client'

import { useEffect, useRef, useState, type ComponentProps } from 'react'
import { CheckCircle, CircleNotch, Stop, type Icon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

/**
 * Botón que hace algo asíncrono y muestra los tres tiempos en la MISMA celda (el ancho no salta):
 *   reposo ("Aprobar") → cargando ("Aprobando…", aria-busy, sin perder el foco) → éxito.
 * Al terminar puede volver solo (`despues="volver"`, 1,4 s) o quedarse como pastilla verde
 * "✓ Aprobado" (`despues="pastilla"`, éxito en el lugar: la fila no desaparece).
 * Con `detener`, mientras carga, al pasar el mouse dice "Detener" y un clic lo corta.
 * SKILL.md §5 Acciones (Guardando, Éxito en el lugar).
 */
export type BotonAccionProps = Omit<ComponentProps<'button'>, 'children' | 'onClick'> & {
  /** Verbo + objeto, ≤ 3 palabras ("Aprobar", "Emitir factura"). */
  texto: string
  /** Gerundio ("Aprobando…"). */
  gerundio: string
  /** Participio ("Aprobado"). Mismo nombre que el toast y el historial. */
  participio: string
  icono?: Icon
  variante?: 'principal' | 'secundario'
  tamano?: 'normal' | 'chico'
  /** Lo que hace. Si rechaza, el botón vuelve a reposo (el error lo muestra quien llama). */
  accion: (senal: AbortSignal) => Promise<unknown>
  despues?: 'volver' | 'pastilla'
  /** Muestra "Detener" al pasar mientras corre y aborta la señal al hacer clic. */
  detener?: boolean
  /** Para Deshacer desde el toast: cambiar a false devuelve el botón a reposo. */
  hecho?: boolean
  onTerminar?: () => void
}

type Fase = 'reposo' | 'cargando' | 'exito'

export function BotonAccion({
  texto, gerundio, participio, icono: Ico, variante = 'principal', tamano = 'normal',
  accion, despues = 'volver', detener, hecho, onTerminar, className, ...resto
}: BotonAccionProps) {
  const [fase, setFase] = useState<Fase>(hecho ? 'exito' : 'reposo')
  const control = useRef<AbortController | null>(null)
  const chico = tamano === 'chico'
  const px = chico ? 14 : 17

  useEffect(() => { if (hecho === false) setFase('reposo'); if (hecho) setFase('exito') }, [hecho])
  useEffect(() => {
    if (fase !== 'exito' || despues !== 'volver') return
    const t = setTimeout(() => setFase('reposo'), 1400)
    return () => clearTimeout(t)
  }, [fase, despues])
  useEffect(() => () => control.current?.abort(), [])

  const alClick = async () => {
    if (fase === 'cargando') { if (detener) control.current?.abort(); return }
    if (fase === 'exito') return
    control.current = new AbortController()
    setFase('cargando')
    try {
      await accion(control.current.signal)
      if (control.current.signal.aborted) return setFase('reposo')
      setFase('exito'); onTerminar?.()
    } catch { setFase('reposo') }
  }

  const pastilla = fase === 'exito' && despues === 'pastilla'
  const capa = 'col-start-1 row-start-1 inline-flex items-center transition-opacity duration-150'
  const gap = chico ? 'gap-1' : 'gap-2'

  return (
    <button
      type="button"
      {...resto}
      onClick={alClick}
      aria-busy={fase === 'cargando' || undefined}
      aria-disabled={pastilla || resto['aria-disabled'] || undefined}
      aria-live="polite"
      className={cx(
        'group relative inline-grid shrink-0 cursor-pointer place-items-center font-medium whitespace-nowrap select-none',
        'transition-[transform,background-color,color,box-shadow,border-color] duration-200 ease-(--ease)',
        'active:scale-[.97] motion-reduce:transition-none motion-reduce:active:scale-100 aria-busy:cursor-progress',
        chico ? 'h-7 rounded-chip px-2.5 text-xs pointer-coarse:min-h-11' : 'h-[38px] rounded-control px-3.5 text-[13px] pointer-coarse:min-h-11',
        pastilla
          ? 'cursor-default border border-transparent bg-verde-fondo text-verde-texto active:scale-100'
          : variante === 'principal'
            ? 'border border-tinta bg-tinta text-superficie shadow-principal hover:bg-tinta/90'
            : 'border border-borde bg-superficie text-tinta shadow-min hover:bg-hover',
        FOCO,
        className,
      )}
    >
      <span className={cx(capa, gap, fase !== 'reposo' && 'invisible opacity-0')}>
        {Ico && <Ico size={px} aria-hidden className="-ml-0.5" />}{texto}
      </span>
      <span className={cx(capa, gap, fase !== 'cargando' && 'invisible opacity-0', detener && 'group-hover:invisible group-hover:opacity-0')}>
        <CircleNotch size={px} aria-hidden className="-ml-0.5 animate-spin motion-reduce:animate-none" />{gerundio}
      </span>
      {detener && (
        <span className={cx(capa, gap, 'invisible opacity-0', fase === 'cargando' && 'group-hover:visible group-hover:opacity-100')}>
          <Stop size={px} aria-hidden className="-ml-0.5" />Detener
        </span>
      )}
      <span className={cx(capa, gap, fase !== 'exito' && 'invisible opacity-0')}>
        <CheckCircle size={px} weight={pastilla ? 'regular' : 'bold'} aria-hidden className="-ml-0.5" />{participio}
      </span>
    </button>
  )
}
