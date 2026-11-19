'use client'

import { useId, useState, type ReactNode } from 'react'
import { cx, FOCO } from '../base/utilidades'
import { EnvoltorioCampo, INPUT, cajaCampo, describedBy, numeroAR, type Mensaje } from './_campo'

export type Moneda = 'ARS' | 'USD'
const SIMBOLO: Record<Moneda, string> = { ARS: '$', USD: 'US$' }

/** "1.250.000,5" o "1250000.5" → 1250000.5; null si está vacío o no es número. */
export function leerMonto(texto: string): number | null {
  const s = texto.replace(/[^\d,.-]/g, '')
  if (!s) return null
  const coma = s.lastIndexOf(','), punto = s.lastIndexOf('.')
  const decimal = coma > punto ? ',' : punto > -1 && s.length - punto - 1 !== 3 ? '.' : coma > -1 ? ',' : ''
  const limpio = decimal ? s.split(decimal).map((p, i, a) => (i === a.length - 1 ? p : p.replace(/[.,]/g, ''))).join('.') : s.replace(/[.,]/g, '')
  const n = Number(limpio)
  return Number.isFinite(n) ? n : null
}

export type CampoMonedaProps = {
  rotulo: ReactNode
  valor: number | null
  onCambio: (valor: number | null) => void
  moneda: Moneda
  /** Si se pasa, la moneda se elige con el botón de adentro del campo. */
  onMoneda?: (m: Moneda) => void
  /** Tipo de cambio para mostrar la equivalencia debajo ("≈ US$ 1.020"). */
  tipoCambio?: number
  decimales?: number
  opcional?: boolean
  ayuda?: ReactNode
  mensaje?: Mensaje | null
  /** Botón "Todo" para cargar el saldo completo. */
  maximo?: { valor: number; texto?: string }
  grande?: boolean
  id?: string
  className?: string
}

/** Monto con la moneda pegada adentro, separador de miles al salir y la equivalencia debajo. */
export function CampoMoneda({
  rotulo, valor, onCambio, moneda, onMoneda, tipoCambio, decimales = 2, opcional, ayuda, mensaje, maximo, grande, id: idPropio, className,
}: CampoMonedaProps) {
  const auto = useId()
  const id = idPropio ?? auto
  const [texto, setTexto] = useState<string | null>(null)
  const mostrado = texto ?? (valor == null ? '' : numeroAR(valor, decimales))
  const otra: Moneda = moneda === 'ARS' ? 'USD' : 'ARS'
  const equivalencia =
    tipoCambio && valor != null ? `≈ ${SIMBOLO[otra]} ${numeroAR(moneda === 'ARS' ? valor / tipoCambio : valor * tipoCambio, 0)} · TC ${numeroAR(tipoCambio, 2)}` : null

  return (
    <EnvoltorioCampo id={id} rotulo={rotulo} opcional={opcional} ayuda={ayuda ?? equivalencia} mensaje={mensaje} className={cx('w-64 max-sm:w-full', grande && 'w-80', className)}>
      <div data-caja className={cajaCampo(mensaje?.tipo ?? 'neutro', cx('pl-1', grande && 'h-14 max-sm:h-14'))}>
        {onMoneda ? (
          <button
            type="button"
            onClick={() => onMoneda(otra)}
            aria-label={`Moneda: ${moneda}. Cambiar a ${otra}`}
            className={cx('h-8 shrink-0 rounded-[calc(var(--radius-control)-3px)] bg-suave px-2 font-mono text-[13px] text-texto-2 hover:bg-hover max-sm:h-11', FOCO)}
          >
            {SIMBOLO[moneda]}
          </button>
        ) : (
          <span className="shrink-0 pl-2 font-mono text-[13px] text-texto-3 select-none">{SIMBOLO[moneda]}</span>
        )}
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          value={mostrado}
          onChange={(e) => { setTexto(e.target.value); onCambio(leerMonto(e.target.value)) }}
          onFocus={() => setTexto(valor == null ? '' : String(valor).replace('.', ','))}
          onBlur={() => setTexto(null)}
          aria-invalid={mensaje?.tipo === 'error' || undefined}
          aria-describedby={describedBy(id, mensaje, ayuda ?? equivalencia)}
          className={cx(INPUT, 'text-right font-mono tabular-nums', grande && 'text-2xl font-medium max-sm:text-2xl')}
        />
        {maximo && (
          <button
            type="button"
            onClick={() => onCambio(maximo.valor)}
            className={cx('h-7 shrink-0 rounded-chip border border-borde px-2 text-xs text-texto-2 hover:bg-hover max-sm:h-11', FOCO)}
          >
            {maximo.texto ?? 'Todo'}
          </button>
        )}
      </div>
    </EnvoltorioCampo>
  )
}
