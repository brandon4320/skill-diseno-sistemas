'use client'
/**
 * ResumenLateral + BandaElegido: todo alta con plata (cotización, contrato) lleva su resumen fijo
 * a la derecha y lo ya elegido en una banda arriba. Patrones 14.2 y 14.3 · 12-flujos.html#resumen-vivo-lateral
 *
 * - Filas rótulo + subtítulo gris / monto a la derecha; los negativos con menos tipográfico.
 * - Total a 32/500 que rueda (700 ms, ease-out) desde el valor anterior hasta el nuevo.
 * - Nota de lo que falta sumar, aviso ámbar solo si hay urgencia real, un único botón a todo el ancho.
 * - Pegajoso a 16 px del borde superior en escritorio; en celular baja debajo del formulario.
 *
 *   <div className="grid gap-3.5 lg:grid-cols-[minmax(0,1fr)_300px]">
 *     <Formulario/>
 *     <ResumenLateral filas={filas} moneda="ARS" nota="El IVA y el IPC se suman al facturar."
 *       pie={`${monto(porMes)} por mes`} accion={{ texto: 'Continuar a condiciones', hacer: seguir }} />
 *   </div>
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { WarningIcon, type Icon } from '@phosphor-icons/react'
import { monto, type Moneda } from '../datos/formato'
import { BotonEspera, cx, FOCO } from './compartido'

export type FilaResumen = { rotulo: string; detalle?: string; monto: number }

export type ResumenLateralProps = {
  titulo?: string
  filas: FilaResumen[]
  moneda?: Moneda
  rotuloTotal?: string
  /** Segunda línea bajo el total: "$ 1.120.000 por mes · 2 módulos". */
  pie?: ReactNode
  /** Qué falta sumar: "El flete y los extras se suman después". */
  nota?: string
  /** Urgencia real ("Quedan 2 a este precio"). Nunca de relleno. */
  aviso?: string
  /** Control chico arriba a la derecha (p. ej. Segmentado ARS | USD). */
  extra?: ReactNode
  accion: { texto: string; textoEspera?: string; hacer: () => void | Promise<void> }
  secundaria?: { texto: string; hacer: () => void }
}

/** Cifra que rueda desde el valor anterior. Respeta reduced-motion. */
function useRueda(valor: number, dur = 700) {
  const [v, setV] = useState(valor)
  const desde = useRef(valor)
  useEffect(() => {
    const ini = desde.current
    desde.current = valor
    if (ini === valor || matchMedia('(prefers-reduced-motion: reduce)').matches) return setV(valor)
    const t0 = performance.now()
    let raf = 0
    const paso = (t: number) => {
      const k = Math.min(1, (t - t0) / dur)
      setV(ini + (valor - ini) * (1 - Math.pow(1 - k, 3)))
      if (k < 1) raf = requestAnimationFrame(paso)
    }
    raf = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(raf)
  }, [valor, dur])
  return v
}

export function ResumenLateral({ titulo = 'Resumen hasta ahora', filas, moneda = 'ARS', rotuloTotal = 'Total', pie, nota, aviso, extra, accion, secundaria }: ResumenLateralProps) {
  const total = filas.reduce((a, f) => a + f.monto, 0)
  const rodando = useRueda(total)
  const [u, ...resto] = monto(rodando, moneda).split(' ')
  return (
    <aside aria-label={titulo} className="flex flex-col gap-3 rounded-tarjeta border border-borde bg-superficie p-5 lg:sticky lg:top-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-base font-medium">{titulo}</h3>
        {extra}
      </div>
      <div className="flex flex-col gap-3" aria-live="polite">
        {filas.map((f) => (
          <div key={f.rotulo} className="flex items-baseline justify-between gap-2 text-[13px]">
            <div className="min-w-0">
              {f.rotulo}
              {f.detalle && <small className="mt-0.5 block text-xs text-texto-3">{f.detalle}</small>}
            </div>
            <span className="font-medium whitespace-nowrap tabular-nums">{f.monto < 0 ? `−${monto(-f.monto, moneda)}` : monto(f.monto, moneda)}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-0.5 border-t border-divisor pt-3">
        <span className="text-xs text-texto-3">{rotuloTotal}</span>
        <span className="font-display text-[32px] leading-tight font-medium tracking-tight tabular-nums">
          <span className="mr-1 text-lg text-texto-3">{u}</span>
          {resto.join(' ')}
        </span>
        {pie && <span className="text-xs text-texto-3 tabular-nums">{pie}</span>}
      </div>
      {nota && <p className="text-xs text-texto-3">{nota}</p>}
      {aviso && (
        <p className="flex items-start gap-2 rounded-[10px] bg-ambar-fondo px-3 py-2 text-xs text-ambar-texto">
          <WarningIcon size={15} className="mt-px shrink-0" aria-hidden />
          {aviso}
        </p>
      )}
      <BotonEspera ancho textoEspera={accion.textoEspera ?? 'Guardando…'} hacer={accion.hacer}>
        {accion.texto}
      </BotonEspera>
      {secundaria && (
        <button type="button" onClick={secundaria.hacer} className={cx('min-h-8 self-center text-[13px] text-texto-2 underline underline-offset-[3px]', FOCO)}>
          {secundaria.texto}
        </button>
      )}
    </aside>
  )
}

export type BandaElegidoProps = {
  /** Lo elegido en pasos previos: ["Orbe Retail", "Bahía Blanca", "desde 1 dic"]. */
  partes: ReactNode[]
  icono?: Icon
  onCambiar: () => void
}

/** Banda de una línea (radio 24) con lo ya elegido y "Cambiar": nunca obligues a volver atrás. */
export function BandaElegido({ partes, icono: Ic, onCambiar }: BandaElegidoProps) {
  return (
    <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-3xl border border-borde bg-superficie py-1 pr-2 pl-4 text-[13px] shadow-min">
      {Ic && <Ic size={16} className="text-texto-3" aria-hidden />}
      {partes.map((p, i) => (
        <span key={i} className={cx('flex items-center gap-2', i === 0 ? 'font-medium' : 'text-texto-3')}>
          {i > 0 && <span aria-hidden className="hidden h-4 w-px bg-borde md:block" />}
          {p}
        </span>
      ))}
      <button type="button" onClick={onCambiar} className={cx('ml-auto h-7 rounded-lg px-2.5 text-xs font-medium text-texto-2 hover:bg-hover hover:text-tinta max-md:h-11', FOCO)}>
        Cambiar
      </button>
    </div>
  )
}
