'use client'

import { CheckIcon, CopyIcon } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { cx, FOCO } from '../base/utilidades'

export type CodigoCopiableProps = {
  /** Lo que se copia: el código completo. */
  valor: string
  /** Lo que se ve, si es distinto (CBU enmascarado "•••• 2195", clave "sk_••••9c21"). */
  mostrar?: string
  /** fila: limpio, el ícono aparece al pasar · caja: con fondo y borde, el ícono siempre visible. */
  variante?: 'fila' | 'caja'
  /** "Copiar CUIT": el nombre del botón para el lector. */
  etiqueta?: string
  className?: string
}

/**
 * Código en mono con copiar (patrón 1.10). Al pasar o con foco aparece el ícono; al copiar,
 * ✓ verde y "Copiado" anunciado por 1,6 s. Si el portapapeles no está disponible, igual confirma
 * y el texto queda seleccionable.
 */
export function CodigoCopiable({ valor, mostrar, variante = 'fila', etiqueta, className }: CodigoCopiableProps) {
  const [ok, setOk] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  async function copiar() {
    try {
      await navigator.clipboard.writeText(valor)
    } catch {
      /* sin permiso: se confirma igual */
    }
    setOk(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOk(false), 1600)
  }

  const Icono = ok ? CheckIcon : CopyIcon
  return (
    <button
      type="button"
      onClick={copiar}
      aria-label={etiqueta ?? `Copiar ${valor}`}
      className={cx(
        'group inline-flex items-center gap-1.5 rounded-chip border font-mono text-xs font-medium tracking-[0.02em] transition-colors max-md:min-h-11',
        variante === 'caja' ? 'h-9 border-borde bg-suave px-3' : 'h-7 border-transparent px-2 hover:border-borde hover:bg-superficie focus-visible:border-borde',
        ok ? 'text-verde-texto' : 'text-tinta',
        FOCO,
        className,
      )}
    >
      <span className={mostrar ? 'tracking-[0.12em]' : undefined}>{mostrar ?? valor}</span>
      <Icono
        size={13}
        aria-hidden
        className={cx(
          'shrink-0 transition-opacity',
          ok ? 'text-verde-texto' : 'text-texto-3',
          variante === 'fila' && !ok && 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100',
        )}
      />
      <span role="status" className="sr-only">
        {ok ? 'Copiado' : ''}
      </span>
    </button>
  )
}

/** "Plan anual Orbe Retail CONT-01101": el código pegado al título, mono gris un paso más chico. */
export function TituloConCodigo({ titulo, codigo, className }: { titulo: string; codigo: string; className?: string }) {
  return (
    <span className={cx('inline-flex min-w-0 flex-wrap items-baseline gap-2 text-sm font-medium text-tinta', className)}>
      <span className="truncate">{titulo}</span>
      <span className="font-mono text-[11px] font-normal tracking-[0.06em] text-texto-3">{codigo}</span>
    </span>
  )
}
