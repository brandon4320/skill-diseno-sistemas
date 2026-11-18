'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'
import { Plus, type Icon } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'

/**
 * Botón flotante del celular (SKILL.md §9): solo en colecciones donde la acción es crear y
 * NUNCA junto a la píldora. Extendido arriba ("+ Crear"), círculo de 56 al bajar 24 px, se
 * esconde pasados 160 px bajando y vuelve al subir. Con `opciones` (máx. 3) abre un menú de
 * abajo hacia arriba con 30 ms entre cada una, baja el fondo y el + gira a ×.
 * Va dentro de un contenedor `relative`; sobre la barra inferior (bottom 88 px).
 */
export type OpcionFlotante = { id: string; texto: string; icono: Icon; hacer: () => void }

export type BotonFlotanteProps = {
  texto: string
  /** Sin opciones, el clic llama a esto directamente. */
  onClick?: () => void
  opciones?: readonly OpcionFlotante[]
  /** Contenedor que scrollea (por defecto, la ventana). */
  scroll?: RefObject<HTMLElement | null>
}

export function BotonFlotante({ texto, onClick, opciones, scroll }: BotonFlotanteProps) {
  const [corto, setCorto] = useState(false)
  const [oculto, setOculto] = useState(false)
  const [abierto, setAbierto] = useState(false)
  const ultimo = useRef(0)
  const primera = useRef<HTMLButtonElement>(null)
  const boton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const el: HTMLElement | Window = scroll?.current ?? window
    const leer = () => {
      const y = el instanceof Window ? el.scrollY : el.scrollTop
      setCorto(y > 24)
      setOculto(y > 160 && y > ultimo.current)
      ultimo.current = y
    }
    el.addEventListener('scroll', leer, { passive: true })
    return () => el.removeEventListener('scroll', leer)
  }, [scroll])

  useEffect(() => { if (abierto) primera.current?.focus() }, [abierto])

  const cerrar = () => { setAbierto(false); boton.current?.focus() }
  const lista = opciones?.slice(0, 3) ?? []

  return (
    <>
      {lista.length > 0 && (
        <div
          aria-hidden
          onClick={() => setAbierto(false)}
          className={cx('absolute inset-0 z-20 bg-fondo/70 backdrop-blur-[3px] transition-opacity duration-200', abierto ? 'opacity-100' : 'pointer-events-none opacity-0')}
        />
      )}
      {lista.length > 0 && (
        <div
          role="menu"
          aria-label={texto}
          hidden={!abierto}
          onKeyDown={e => { if (e.key === 'Escape') { e.stopPropagation(); cerrar() } }}
          className="absolute right-4 bottom-[156px] z-30 flex flex-col-reverse items-end gap-2"
        >
          {lista.map((o, i) => (
            <button
              key={o.id}
              ref={i === 0 ? primera : undefined}
              role="menuitem"
              type="button"
              onClick={() => { setAbierto(false); o.hacer() }}
              style={{ animationDelay: `${i * 30}ms` }}
              className={cx(
                'flex h-11 cursor-pointer items-center gap-2 rounded-full bg-superficie pr-4 pl-3 text-sm font-medium text-tinta shadow-flotante',
                'animate-[entra_240ms_var(--ease)_both] motion-reduce:animate-none',
                FOCO,
              )}
            >
              <o.icono size={17} aria-hidden className="text-acento" />
              {o.texto}
            </button>
          ))}
        </div>
      )}
      <button
        ref={boton}
        type="button"
        aria-label={abierto ? 'Cerrar opciones' : texto}
        aria-expanded={lista.length ? abierto : undefined}
        onClick={() => (lista.length ? setAbierto(a => !a) : onClick?.())}
        className={cx(
          'absolute right-4 bottom-[88px] z-30 flex h-14 min-w-14 cursor-pointer items-center justify-center rounded-full bg-acento text-sm font-medium text-white',
          'shadow-[0_10px_24px_-8px_color-mix(in_oklch,var(--color-acento)_70%,transparent),0_2px_6px_rgb(23_23_33/.18)]',
          'transition-[transform,padding] duration-300 ease-(--ease) active:scale-95 motion-reduce:transition-none',
          corto || abierto ? 'px-0' : 'px-[18px]',
          oculto && !abierto && 'translate-y-[140px] scale-90',
          FOCO,
        )}
      >
        <Plus size={22} aria-hidden className={cx('transition-transform duration-200 ease-[cubic-bezier(.34,1.56,.64,1)]', abierto && 'rotate-45')} />
        <span
          aria-hidden
          className={cx('overflow-hidden whitespace-nowrap transition-[max-width,opacity,margin] duration-300 ease-(--ease)', corto || abierto ? 'ml-0 max-w-0 opacity-0' : 'ml-2 max-w-[120px] opacity-100')}
        >
          {texto}
        </span>
      </button>
    </>
  )
}
