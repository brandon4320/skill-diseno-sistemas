'use client'

import { useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import {
  delta,
  escalaLinda,
  formatear,
  participacion,
  porcentaje,
  tonoDelta,
  variacion,
  type Moneda,
  type NombreFormato,
  type Sentido,
} from './formato'

export type SerieBarra = {
  clave: string
  nombre: string
  /** Color de la serie: `var(--color-dato-1)`, `colorDe(id)`. Máximo 6 series. */
  color: string
}

export type PuntoBarra = {
  /** Lo que va en el eje: "Ene", "S46". */
  etiqueta: string
  /** Nombre largo para el globo y el lector: "enero 2026". Si falta, se usa `etiqueta`. */
  detalle?: string
  valores: Record<string, number | null | undefined>
  /** Período sin cerrar (mes en curso): va rayado y con su pastilla. No se compara como si estuviera completo. */
  parcial?: boolean
}

type Props = {
  series: SerieBarra[]
  datos: PuntoBarra[]
  /** Alto total en px (incluye el eje de abajo). */
  alto?: number
  formato?: NombreFormato
  moneda?: Moneda
  /** Para el color de la comparación del globo. */
  sentido?: Sentido
  /** Serie cuya participación muestra el globo ("Online 42 %"). Por defecto, la primera. */
  principal?: string
  /** Columna activa (controlada). `null` = ninguna. Si no se pasa, la maneja el componente. */
  activo?: number | null
  /** Activa al cargar cuando no es controlada (por ejemplo, el último mes cerrado). */
  activoInicial?: number | null
  onActivo?: (i: number | null) => void
  /** Etiqueta del eje que va en tinta (el período de referencia). */
  destacado?: number
  /** Texto de la pastilla sobre la columna parcial. */
  rotuloParcial?: string
  leyenda?: boolean
  /** Para el lector de pantalla: "Facturación por mes y por unidad, 2026". */
  titulo: string
  className?: string
}

const EASE = 'cubic-bezier(.23,1,.32,1)'
const ABAJO = 26
const SEPARACION = 2

/**
 * Barras apiladas con estado (07 Loops, 08 Finora):
 * - La columna activa queda sólida y el resto baja al 40 %. Globo oscuro con
 *   "total | participación | vs. anterior" (la comparación, del color bueno/malo del negocio).
 * - El período en curso va rayado, con borde punteado y pastilla "Parcial": lo proyectado no se pinta sólido.
 * - Crecen desde la base al aparecer, de a una (40 ms). Sin animación con reduced-motion.
 * - Mouse: pasar. Toque: tocar la columna. Teclado: Tab al gráfico y flechas ←/→, Esc suelta.
 * - El lector de pantalla recibe una tabla oculta con todos los números.
 */
export function BarrasApiladas({
  series,
  datos,
  alto = 230,
  formato = 'montoCorto',
  moneda,
  sentido = 'subir-es-bueno',
  principal,
  activo,
  activoInicial = null,
  onActivo,
  destacado,
  rotuloParcial = 'Parcial',
  leyenda = true,
  titulo,
  className = '',
}: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const caja = useRef<HTMLDivElement>(null)
  const [ancho, setAncho] = useState(640)
  const [propio, setPropio] = useState<number | null>(activoInicial)
  const act = activo !== undefined ? activo : propio
  const elegir = (i: number | null) => {
    if (activo === undefined) setPropio(i)
    onActivo?.(i)
  }

  /* El globo se mide antes de pintar para que nunca se salga del gráfico (en celular puede ir en dos renglones). */
  const tip = useRef<HTMLDivElement>(null)
  const [tipAncho, setTipAncho] = useState(0)
  useLayoutEffect(() => {
    if (tip.current) setTipAncho(tip.current.offsetWidth)
  }, [act, ancho, datos])

  useLayoutEffect(() => {
    const el = caja.current
    if (!el) return
    if (el.clientWidth) setAncho(Math.max(240, el.clientWidth))
    const ro = new ResizeObserver(([e]) => setAncho(Math.max(240, Math.round(e.contentRect.width))))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const totales = useMemo(
    () => datos.map((d) => series.reduce((a, s) => a + Math.max(0, d.valores[s.clave] ?? 0), 0)),
    [datos, series],
  )
  const marcas = escalaLinda(Math.max(0, ...totales))
  const tope = marcas[marcas.length - 1]
  const eje = (v: number) => formatear(v, formato === 'monto' ? 'montoCorto' : formato, { moneda })
  const ejeAncho = Math.max(28, ...marcas.map((m) => eje(m).length * 6.2 + 10))
  const hayParcial = datos.some((d) => d.parcial)
  const arriba = hayParcial ? 30 : 10
  const base = alto - ABAJO
  const escala = (v: number) => (v / tope) * (base - arriba)
  const n = Math.max(1, datos.length)
  const paso = (ancho - ejeAncho) / n
  const b = Math.max(8, Math.min(30, paso * 0.56))
  const r = Math.min(6, b / 3)
  const cadaCuanto = Math.ceil(30 / paso)
  /* En pantallas angostas las etiquetas van salteadas; la activa y la destacada siempre se ven y no se pisan. */
  const prioridad = [act, destacado].filter((p): p is number => p != null)
  const verEtiqueta = (i: number) =>
    prioridad.includes(i)
      ? !(i === destacado && act != null && act !== destacado && Math.abs(act - destacado) < cadaCuanto)
      : i % cadaCuanto === 0 && prioridad.every((p) => Math.abs(p - i) >= cadaCuanto)
  const xDe = (i: number) => ejeAncho + i * paso + (paso - b) / 2
  const fmt = (v: number) => formatear(v, formato, { moneda })
  const serieP = series.find((s) => s.clave === principal) ?? series[0]
  /* La pastilla "Parcial" no se sale del gráfico aunque la columna sea la última. */
  const pastillaAncho = rotuloParcial.length * 7.4 + 16
  const pastillaX = (cx: number) => Math.min(ancho - pastillaAncho / 2 - 1, Math.max(ejeAncho + pastillaAncho / 2, cx))

  const teclas = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const desde = act ?? (e.key === 'ArrowRight' ? -1 : n)
      elegir(Math.max(0, Math.min(n - 1, desde + (e.key === 'ArrowRight' ? 1 : -1))))
    } else if (e.key === 'Escape') elegir(null)
  }

  /* ── globo ── */
  let globo = null
  if (act != null && datos[act]) {
    const d = datos[act]
    const t = totales[act]
    const ant = act > 0 && !d.parcial && !datos[act - 1].parcial ? totales[act - 1] : null
    const vari = ant == null ? null : variacion(t, ant)
    const tono = tonoDelta(vari, sentido)
    const cx = xDe(act) + b / 2
    const estilo: CSSProperties = {
      left: Math.max(0, Math.min(cx - tipAncho / 2, ancho - tipAncho)),
      top: base - escala(t) - (d.parcial ? 30 : 10),
      translate: '0 -100%',
      maxWidth: '100%',
    }
    globo = (
      <div
        aria-hidden
        ref={tip}
        className="pointer-events-none absolute z-10 flex w-max flex-wrap items-center gap-x-2 gap-y-0.5 [&>*]:whitespace-nowrap rounded-chip bg-tinta px-3 py-1.5 text-xs text-superficie tabular-nums shadow-flotante"
        style={estilo}
      >
        <span className="text-superficie/65">{d.detalle ?? d.etiqueta}</span>
        <b className="font-medium">{fmt(t)}</b>
        {serieP && (
          <>
            <span className="text-superficie/30">|</span>
            <span>
              {serieP.nombre} <b className="font-medium">{porcentaje(participacion(Math.max(0, d.valores[serieP.clave] ?? 0), t))}</b>
            </span>
          </>
        )}
        <span className="text-superficie/30">|</span>
        {d.parcial ? (
          <span className="text-superficie/65">sin cerrar</span>
        ) : vari == null ? (
          <span className="text-superficie/65">sin comparación</span>
        ) : (
          <span>
            <b className={`font-medium ${tono === 'bueno' ? 'text-[#4ade80] in-data-[tema=oscuro]:text-[#15803d]' : tono === 'malo' ? 'text-[#f87171] in-data-[tema=oscuro]:text-[#b91c1c]' : 'text-superficie'}`}>{delta(vari)}</b>
            <span className="text-superficie/65"> vs. {datos[act - 1].etiqueta.toLowerCase()}</span>
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={`min-w-0 ${className}`}>
      {leyenda && (
        <ul className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-texto-2" aria-hidden>
          {series.map((s) => (
            <li key={s.clave} className="inline-flex items-center gap-1.5">
              <i className="size-2 rounded-[3px]" style={{ background: s.color }} />
              {s.nombre}
            </li>
          ))}
        </ul>
      )}

      <div
        ref={caja}
        className="relative rounded-control outline-none focus-visible:ring-2 focus-visible:ring-acento/40 focus-visible:ring-offset-4 focus-visible:ring-offset-superficie"
        tabIndex={0}
        role="group"
        aria-label={`${titulo}. Usá las flechas para recorrer.`}
        onKeyDown={teclas}
        onBlur={() => activo === undefined && setPropio(activoInicial)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && elegir(activoInicial)}
      >
        <svg width="100%" height={alto} viewBox={`0 0 ${ancho} ${alto}`} preserveAspectRatio="xMinYMid meet" className="block overflow-visible" aria-hidden>
          <defs>
            {series.map((s) => (
              <pattern key={s.clave} id={`${uid}-${s.clave}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="6" height="6" style={{ fill: s.color, fillOpacity: 0.12 }} />
                <line x1="0" y1="0" x2="0" y2="6" strokeWidth="2.5" style={{ stroke: s.color, strokeOpacity: 0.5 }} />
              </pattern>
            ))}
          </defs>

          {/* grilla y eje */}
          {marcas.map((m, k) => {
            const y = base - escala(m)
            return (
              <g key={m}>
                <line x1={ejeAncho - 2} x2={ancho} y1={y} y2={y} strokeDasharray={k ? '3 4' : undefined} className={k ? 'stroke-divisor' : 'stroke-borde'} />
                <text x={ejeAncho - 10} y={y + 4} textAnchor="end" className="fill-texto-3 font-sans text-xs tabular-nums">
                  {eje(m)}
                </text>
              </g>
            )
          })}

          {/* columnas */}
          {datos.map((d, i) => {
            const x = xDe(i)
            let y = base
            const apagada = act != null && act !== i
            const ver = verEtiqueta(i)
            return (
              <g key={i}>
                <g
                  className="[transition:scale_.8s_var(--ease-barra)_var(--retraso),opacity_.2s_ease] starting:[scale:1_0] motion-reduce:[transition:none]"
                  style={
                    {
                      transformOrigin: `0 ${base}px`,
                      opacity: apagada ? 0.4 : 1,
                      '--retraso': `${i * 40}ms`,
                      '--ease-barra': EASE,
                    } as CSSProperties
                  }
                >
                  {series.map((s) => {
                    const v = Math.max(0, d.valores[s.clave] ?? 0)
                    const h = escala(v) - SEPARACION
                    if (h <= 0.5) return null
                    y -= h + SEPARACION
                    return d.parcial ? (
                      <rect
                        key={s.clave}
                        x={x + 0.5}
                        y={y + 0.5}
                        width={b - 1}
                        height={Math.max(0, h - 1)}
                        rx={r}
                        fill={`url(#${uid}-${s.clave})`}
                        strokeDasharray="3 2"
                        style={{ stroke: s.color, strokeOpacity: 0.55 }}
                      />
                    ) : (
                      <rect key={s.clave} x={x} y={y} width={b} height={h} rx={r} style={{ fill: s.color }} />
                    )
                  })}
                  {d.parcial && (
                    <g transform={`translate(${pastillaX(x + b / 2)}, ${y - 24})`}>
                      <rect x={-pastillaAncho / 2} width={pastillaAncho} height="18" rx="6" className="fill-superficie stroke-borde" />
                      <text y="13" textAnchor="middle" className="fill-texto-2 font-sans text-xs font-medium">
                        {rotuloParcial}
                      </text>
                    </g>
                  )}
                </g>
                {ver && (
                  <text
                    x={x + b / 2}
                    y={alto - 7}
                    textAnchor="middle"
                    className={`font-sans text-xs ${i === act || i === destacado ? 'fill-tinta font-medium' : 'fill-texto-3'}`}
                  >
                    {d.etiqueta}
                  </text>
                )}
                {/* zona de toque: toda la columna, más ancha que la barra */}
                <rect
                  x={ejeAncho + i * paso}
                  y={arriba}
                  width={paso}
                  height={base - arriba}
                  fill="transparent"
                  className="cursor-pointer"
                  onPointerEnter={(e) => e.pointerType === 'mouse' && elegir(i)}
                  onClick={() => elegir(act === i && activo === undefined ? activoInicial : i)}
                />
              </g>
            )
          })}
        </svg>
        {globo}
      </div>

      {/* sr-only va en un div: una tabla no respeta width:1px y desborda la página */}
      <div className="sr-only">
      <table>
        <caption>{titulo}</caption>
        <thead>
          <tr>
            <th scope="col">Período</th>
            {series.map((s) => (
              <th key={s.clave} scope="col">
                {s.nombre}
              </th>
            ))}
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((d, i) => (
            <tr key={i}>
              <th scope="row">
                {d.detalle ?? d.etiqueta}
                {d.parcial ? ` (${rotuloParcial.toLowerCase()})` : ''}
              </th>
              {series.map((s) => (
                <td key={s.clave}>{fmt(d.valores[s.clave] ?? 0)}</td>
              ))}
              <td>{fmt(totales[i])}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}
