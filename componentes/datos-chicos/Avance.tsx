import { CheckIcon } from '@phosphor-icons/react/ssr'
import type { ReactNode } from 'react'
import { cx } from '../base/utilidades'

const pct = (n: number) => `${new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(n)} %`

export type BarraProgresoProps = {
  /** 0 a 100. null = indeterminada (solo mientras no se sabe cuánto falta). */
  valor: number | null
  /** 4 en filas · 6 en tarjetas · 8 protagonista. */
  alto?: 4 | 6 | 8
  rotulo?: ReactNode
  /** A la derecha del rótulo; por defecto "64 %". Al 100 %: "✓ Completo". */
  detalle?: ReactNode
  /** Color del lleno (entidad o dato). Al 100 % pasa a verde. */
  color?: string
  /** Nombre para el lector cuando no hay rótulo visible. */
  etiqueta?: string
  /** Al llegar a 100 pasa a verde con ✓ (por defecto). En un límite de uso, false. */
  verdeAlCompletar?: boolean
  className?: string
}

/**
 * Barra de progreso fina (patrones 7.1 y 7.15): radio completo, pista en suave, rótulo arriba a la
 * izquierda y cifra arriba a la derecha. Server Component (la indeterminada usa una animación CSS:
 * @keyframes indet { from { left: -32% } to { left: 100% } }).
 */
export function BarraProgreso({ valor, alto = 6, rotulo, detalle, color = 'var(--color-acento)', etiqueta, verdeAlCompletar = true, className }: BarraProgresoProps) {
  const v = valor == null ? null : Math.max(0, Math.min(100, valor))
  const lleno = verdeAlCompletar && v === 100
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      {(rotulo || v != null) && (
        <div className="flex items-baseline justify-between gap-2 text-xs text-texto-3">
          {rotulo && <span className="text-[13px] font-medium text-tinta">{rotulo}</span>}
          <span className="tabular-nums">
            {detalle ??
              (lleno ? (
                <span className="inline-flex items-center gap-1 text-verde-texto">
                  <CheckIcon size={13} aria-hidden />
                  Completo
                </span>
              ) : v != null ? (
                <span className="font-medium text-tinta">{pct(v)}</span>
              ) : null)}
          </span>
        </div>
      )}
      <div
        role="progressbar"
        aria-label={etiqueta ?? (typeof rotulo === 'string' ? rotulo : undefined)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={v ?? undefined}
        className="relative overflow-hidden rounded-full bg-suave"
        style={{ height: alto }}
      >
        <i
          className={cx(
            'absolute inset-y-0 left-0 rounded-full transition-[width,background-color] duration-300 ease-[cubic-bezier(.23,1,.32,1)]',
            v == null && 'w-[32%] motion-safe:animate-[indet_1.3s_cubic-bezier(.65,0,.35,1)_infinite]',
          )}
          style={{ width: v == null ? undefined : `${v}%`, background: lleno ? 'var(--color-verde-texto)' : color }}
        />
      </div>
    </div>
  )
}

export type ContraMetaProps = {
  valor: number
  /** La meta o el presupuesto. */
  meta: number
  /** Hasta dónde llega la pista, como múltiplo de la meta (1,4 = 140 %). */
  tope?: number
  /** "Presupuesto $ 8 M": va arriba de la raya. */
  rotuloMeta: string
  /** Formato de las cifras del pie. */
  formato?: (n: number) => string
  /** limite: pasarse es malo (exceso rayado en rojo) · meta: pasarse es bueno (verde). */
  sentido?: 'limite' | 'meta'
  /** Izquierda del pie: "Gastado $ 6,7 M en fletes". */
  rotulo?: ReactNode
  className?: string
}

/**
 * Contra meta con marca (patrones 7.1 y 7.7): la meta es una raya de 2 px en tinta con su rótulo;
 * lo que falta se escribe. Si es un límite, al pasarlo el exceso va rayado en rojo más allá de la
 * marca y el lleno se pone ámbar desde el 90 %.
 */
export function ContraMeta({ valor, meta, tope = 1.4, rotuloMeta, formato = String, sentido = 'limite', rotulo, className }: ContraMetaProps) {
  const p = valor / meta
  const ancho = (x: number) => `${(Math.max(0, x) / tope) * 100}%`
  const marca = ancho(1)
  const colorLleno = sentido === 'meta' ? (p >= 1 ? 'var(--color-verde-texto)' : 'var(--color-acento)') : p >= 0.9 ? 'var(--color-ambar-texto)' : 'var(--color-acento)'
  return (
    <div className={className}>
      <div className="relative pt-[22px]">
        <span className="absolute top-0 -translate-x-1/2 text-[11px] leading-[14px] font-medium whitespace-nowrap text-texto-2" style={{ left: marca }}>
          {rotuloMeta}
        </span>
        <div className="relative h-2.5 rounded-full bg-suave">
          <i className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-300" style={{ width: ancho(Math.min(p, 1)), background: colorLleno }} />
          {sentido === 'limite' && p > 1 && (
            <i
              className="absolute inset-y-0 rounded-r-full bg-[repeating-linear-gradient(45deg,var(--color-rojo-texto)_0_3px,color-mix(in_oklch,var(--color-rojo-texto)_35%,transparent)_3px_6px)]"
              style={{ left: marca, width: ancho(Math.min(p, tope) - 1) }}
            />
          )}
        </div>
        <span aria-hidden className="absolute top-3.5 -bottom-1.5 w-0.5 -translate-x-px rounded-[1px] bg-tinta" style={{ left: marca }} />
      </div>
      <div className="mt-2 flex justify-between gap-2 text-xs text-texto-3 tabular-nums">
        <span>{rotulo}</span>
        {p > 1 ? (
          <span className={cx('font-medium', sentido === 'limite' ? 'text-rojo-texto' : 'text-verde-texto')}>
            {sentido === 'limite' ? 'Pasado por' : 'Meta cumplida +'} {formato(valor - meta)}
          </span>
        ) : (
          <span>
            {sentido === 'limite' ? 'Quedan' : 'Faltan'} <b className="font-medium text-tinta">{formato(meta - valor)}</b>
          </span>
        )}
      </div>
    </div>
  )
}

export type AvanceDosBloquesProps = {
  valor: number
  meta: number
  rotulo: string
  formato?: (n: number) => string
  className?: string
}

/** Avance contra meta en dos bloques de 40 px (patrón 7.8): logrado sólido + faltante rayado y escrito. */
export function AvanceDosBloques({ valor, meta, rotulo, formato = String, className }: AvanceDosBloquesProps) {
  const p = Math.min(100, (valor / meta) * 100)
  return (
    <div className={cx('flex flex-col gap-3', className)}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-display text-[32px] font-medium tracking-[-0.02em] tabular-nums">
          {new Intl.NumberFormat('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format((valor / meta) * 100)} %
        </span>
        <span className="text-[13px] text-texto-3 tabular-nums">{valor >= meta ? 'Meta cumplida' : `Faltan ${formato(meta - valor)}`}</span>
      </div>
      <div aria-hidden className="flex h-10 gap-1">
        <span className="rounded-l-[10px] rounded-r bg-acento transition-[flex-grow] duration-300" style={{ flexGrow: p }} />
        <span
          className="rounded-l rounded-r-[10px] bg-suave bg-[repeating-linear-gradient(45deg,color-mix(in_oklch,var(--color-texto-3)_28%,transparent)_0_2px,transparent_2px_7px)] transition-[flex-grow] duration-300"
          style={{ flexGrow: 100 - p }}
        />
      </div>
      <div className="flex justify-between text-xs text-texto-3 tabular-nums">
        <span>{rotulo}</span>
        <b className="font-medium text-tinta">{formato(meta)}</b>
      </div>
    </div>
  )
}

export type UsoLimiteProps = { usado: number; limite: number; rotulo: string; plan?: string; className?: string }

/** Uso contra límite del plan: acento, ámbar desde el 80 % con el aviso escrito, rojo al pasarse. */
export function UsoLimite({ usado, limite, rotulo, plan, className }: UsoLimiteProps) {
  const p = (usado / limite) * 100
  const tono = p > 100 ? 'rojo' : p >= 80 ? 'ambar' : 'ok'
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <BarraProgreso
        valor={Math.min(100, p)}
        verdeAlCompletar={false}
        rotulo={rotulo}
        detalle={
          <>
            <span className="text-tinta">{usado}</span> de {limite}
          </>
        }
        color={tono === 'rojo' ? 'var(--color-rojo-texto)' : tono === 'ambar' ? 'var(--color-ambar-texto)' : undefined}
      />
      <span className={cx('text-xs', tono === 'rojo' ? 'text-rojo-texto' : tono === 'ambar' ? 'text-ambar-texto' : 'text-texto-3')}>
        {tono === 'rojo' ? `Pasado por ${usado - limite}: cada extra se cobra aparte` : `Quedan ${limite - usado}${plan ? ` en el plan ${plan}` : ''}`}
      </span>
    </div>
  )
}
