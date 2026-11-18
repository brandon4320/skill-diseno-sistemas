'use client'
/**
 * ItemsRepetibles: renglones que se agregan al final (descripción, cantidad, precio, descuento) con la suma
 * siempre a la vista debajo. Patrón 14.4 · 12-flujos.html#items-repetibles-con-suma
 *
 * - "Agregar renglón" va al pie y enfoca el renglón nuevo; Enter en el último precio agrega otro.
 * - Subtotal por renglón a la derecha; Subtotal, IVA y Total en un bloque alineado a la derecha.
 * - Quitar un renglón no pide confirmación: avisa con deshacer desde afuera (onQuitar).
 * - En celular cada renglón se apila en una tarjeta (descripción arriba, cantidad y precio abajo).
 *
 *   const [items, setItems] = useState<Renglon[]>([{ id: '1', descripcion: 'Módulo oficina', cantidad: 2, precio: 420000 }])
 *   <ItemsRepetibles items={items} onCambio={setItems} iva={0.21} />
 */
import { useEffect, useRef, type KeyboardEvent } from 'react'
import { PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { monto, type Moneda } from '../datos/formato'
import { cx, FOCO, leerNumero } from './compartido'

export type Renglon = { id: string; descripcion: string; cantidad: number; precio: number; descuento?: number }

export type ItemsRepetiblesProps = {
  items: Renglon[]
  onCambio: (items: Renglon[]) => void
  moneda?: Moneda
  /** Alícuota de IVA (0,21). Si falta, no se muestra la fila de IVA. */
  iva?: number
  conDescuento?: boolean
  /** Para avisar con deshacer; si no está, quita sin más. */
  onQuitar?: (r: Renglon, indice: number) => void
  nuevoId?: () => string
}

const subtotal = (r: Renglon) => r.cantidad * r.precio * (1 - (r.descuento ?? 0) / 100)
const CAMPO = cx('h-9 w-full min-w-0 rounded-control border border-borde bg-superficie px-2.5 text-[13px] text-tinta outline-none transition-[border,box-shadow] hover:border-borde-fuerte focus:border-acento focus:ring-[3px] focus:ring-acento/15 max-md:h-11 max-md:text-base')

export function ItemsRepetibles({ items, onCambio, moneda = 'ARS', iva, conDescuento = true, onQuitar, nuevoId = () => crypto.randomUUID() }: ItemsRepetiblesProps) {
  const enfocar = useRef<string | null>(null)
  const raiz = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enfocar.current) return
    raiz.current?.querySelector<HTMLInputElement>(`[data-desc="${enfocar.current}"]`)?.focus()
    enfocar.current = null
  }, [items])

  const cambiar = (id: string, campo: Partial<Renglon>) => onCambio(items.map((r) => (r.id === id ? { ...r, ...campo } : r)))
  const agregar = () => {
    const id = nuevoId()
    enfocar.current = id
    onCambio([...items, { id, descripcion: '', cantidad: 1, precio: 0 }])
  }
  const quitar = (i: number) => {
    const r = items[i]
    onCambio(items.filter((_, k) => k !== i))
    onQuitar?.(r, i)
  }
  const enterAgrega = (e: KeyboardEvent<HTMLInputElement>, i: number) => {
    if (e.key === 'Enter' && i === items.length - 1) { e.preventDefault(); agregar() }
  }

  const sub = items.reduce((a, r) => a + subtotal(r), 0)
  const impuesto = iva ? sub * iva : 0

  return (
    <div ref={raiz} className="flex flex-col gap-4">
      <div role="table" aria-label="Renglones" className="flex flex-col">
        <div role="row" className={cx('hidden gap-2 border-b border-divisor pb-2 text-xs text-texto-3 md:grid', conDescuento ? 'grid-cols-[minmax(0,1fr)_72px_120px_72px_120px_36px]' : 'grid-cols-[minmax(0,1fr)_72px_120px_120px_36px]')}>
          <span role="columnheader">Descripción</span>
          <span role="columnheader" className="text-right">Cant.</span>
          <span role="columnheader" className="text-right">Precio</span>
          {conDescuento && <span role="columnheader" className="text-right">Dto. %</span>}
          <span role="columnheader" className="text-right">Subtotal</span>
          <span role="columnheader"><span className="sr-only">Acciones</span></span>
        </div>
        {items.map((r, i) => (
          <div key={r.id} role="row" className={cx('group grid items-center gap-2 border-b border-divisor py-2.5 max-md:grid-cols-2', conDescuento ? 'md:grid-cols-[minmax(0,1fr)_72px_120px_72px_120px_36px]' : 'md:grid-cols-[minmax(0,1fr)_72px_120px_120px_36px]')}>
            <span role="cell" className="max-md:col-span-2">
              <input data-desc={r.id} className={CAMPO} value={r.descripcion} placeholder="Qué se cobra" aria-label={`Descripción del renglón ${i + 1}`} onChange={(e) => cambiar(r.id, { descripcion: e.target.value })} />
            </span>
            <span role="cell">
              <input className={cx(CAMPO, 'text-right tabular-nums')} inputMode="decimal" value={r.cantidad} aria-label={`Cantidad del renglón ${i + 1}`} onChange={(e) => cambiar(r.id, { cantidad: leerNumero(e.target.value) })} />
            </span>
            <span role="cell">
              <input className={cx(CAMPO, 'text-right tabular-nums')} inputMode="decimal" value={r.precio || ''} placeholder="0" aria-label={`Precio del renglón ${i + 1}`} onChange={(e) => cambiar(r.id, { precio: leerNumero(e.target.value) })} onKeyDown={(e) => enterAgrega(e, i)} />
            </span>
            {conDescuento && (
              <span role="cell" className="max-md:hidden">
                <input className={cx(CAMPO, 'text-right tabular-nums')} inputMode="decimal" value={r.descuento ?? ''} placeholder="0" aria-label={`Descuento del renglón ${i + 1}`} onChange={(e) => cambiar(r.id, { descuento: leerNumero(e.target.value) })} />
              </span>
            )}
            <span role="cell" className="text-right text-[13px] font-medium whitespace-nowrap tabular-nums" aria-live="polite">{monto(subtotal(r), moneda)}</span>
            <span role="cell" className="flex justify-end">
              <button type="button" onClick={() => quitar(i)} aria-label={`Quitar renglón ${i + 1}`} className={cx('grid size-9 place-items-center rounded-control text-texto-3 transition-[opacity,background,color] hover:bg-suave hover:text-rojo-texto md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100 max-md:size-11', FOCO)}>
                <TrashIcon size={16} aria-hidden />
              </button>
            </span>
          </div>
        ))}
        <button type="button" onClick={agregar} className={cx('mt-1 inline-flex min-h-11 items-center gap-1.5 self-start rounded-control px-1 text-[13px] text-texto-2 transition-colors hover:text-tinta', FOCO)}>
          <PlusIcon size={15} aria-hidden />Agregar renglón
        </button>
      </div>

      <dl className="ml-auto flex w-full max-w-[300px] flex-col gap-2 text-[13px]">
        <div className="flex justify-between text-texto-2"><dt>Subtotal</dt><dd className="font-medium text-tinta tabular-nums">{monto(sub, moneda)}</dd></div>
        {iva != null && <div className="flex justify-between text-texto-2"><dt>IVA {Math.round(iva * 100)} %</dt><dd className="font-medium text-tinta tabular-nums">{monto(impuesto, moneda)}</dd></div>}
        <div className="mt-1 flex items-baseline justify-between border-t border-divisor pt-3 text-base text-tinta">
          <dt>Total</dt><dd className="font-display text-xl font-medium tabular-nums">{monto(sub + impuesto, moneda)}</dd>
        </div>
      </dl>
    </div>
  )
}
