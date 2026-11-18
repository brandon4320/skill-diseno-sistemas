'use client'

import {
  Fragment,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type Ref,
} from 'react'
import { DotsThree, type Icon } from '@phosphor-icons/react'
import { Boton } from './Boton'
import { cx } from './utilidades'

export type ItemMenu = {
  id: string
  texto: string
  icono?: Icon
  /** Atajo que se muestra a la derecha ("U", "⌘⌫"). Solo se muestra: el atajo global lo registra la pantalla. */
  atajo?: string
  /** "peligro" solo para borrar o desconectar, y siempre en el último grupo. */
  tono?: 'normal' | 'peligro'
  alElegir: () => void
}

/** Grupos en orden: lo reversible arriba, silenciar u ocultar en el medio, ajustes o borrar al final. */
export type GrupoMenu = { id: string; rotulo?: string; items: readonly ItemMenu[] }

/** Lo que recibe un disparador propio para quedar conectado al menú. */
export type PropsDisparador = {
  ref: Ref<HTMLButtonElement>
  id: string
  'aria-haspopup': 'menu'
  'aria-expanded': boolean
  'aria-controls': string
  onClick: () => void
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void
}

export type MenuProps = {
  grupos: readonly GrupoMenu[]
  /** Nombre del botón ⋯ ("Acciones de FAC-01101"). */
  rotulo?: string
  alinear?: 'inicio' | 'fin'
  lado?: 'abajo' | 'arriba'
  tamano?: 'normal' | 'chico'
  /** Otro disparador (botón con texto, avatar). Tiene que pasar todas las props al <button>. */
  disparador?: (props: PropsDisparador) => ReactElement
  className?: string
}

/**
 * Menú ⋯ con grupos separados por línea y atajos a la derecha.
 * Teclado (patrón WAI-ARIA "menu button"): Enter/Espacio/↓ abre en el primero, ↑ en el último;
 * ↑↓ recorren en círculo, Inicio/Fin, una letra salta al ítem que empieza con ella,
 * Esc cierra y devuelve el foco, Tab cierra. En celular se abre como hoja desde abajo.
 */
export function Menu({
  grupos,
  rotulo = 'Más acciones',
  alinear = 'fin',
  lado = 'abajo',
  tamano = 'normal',
  disparador,
  className,
}: MenuProps) {
  const base = useId()
  const idBoton = `${base}-boton`
  const idMenu = `${base}-menu`
  const [abierto, setAbierto] = useState(false)
  const [activo, setActivo] = useState(0)
  const caja = useRef<HTMLDivElement>(null)
  const boton = useRef<HTMLButtonElement>(null)
  const items = useRef<(HTMLButtonElement | null)[]>([])
  const todos = grupos.flatMap((g) => g.items)

  const abrir = (desde: 'primero' | 'ultimo') => {
    setActivo(desde === 'primero' ? 0 : todos.length - 1)
    setAbierto(true)
  }
  const cerrar = (devolverFoco: boolean) => {
    setAbierto(false)
    if (devolverFoco) boton.current?.focus()
  }

  // El foco sigue al ítem activo.
  useEffect(() => {
    if (abierto) items.current[activo]?.focus()
  }, [abierto, activo])

  // Click afuera cierra sin robar el foco a lo que se clickeó.
  useEffect(() => {
    if (!abierto) return
    const afuera = (e: PointerEvent) => {
      if (!caja.current?.contains(e.target as Node)) cerrar(false)
    }
    document.addEventListener('pointerdown', afuera)
    return () => document.removeEventListener('pointerdown', afuera)
  }, [abierto])

  const teclaBoton = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      abrir('primero')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      abrir('ultimo')
    }
  }

  const teclaMenu = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = todos.length
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        return setActivo((i) => (i + 1) % n)
      case 'ArrowUp':
        e.preventDefault()
        return setActivo((i) => (i - 1 + n) % n)
      case 'Home':
        e.preventDefault()
        return setActivo(0)
      case 'End':
        e.preventDefault()
        return setActivo(n - 1)
      case 'Escape':
        e.preventDefault()
        e.stopPropagation()
        return cerrar(true)
      case 'Tab':
        return setAbierto(false)
    }
    // Búsqueda por primera letra, empezando después del activo.
    if (e.key.length === 1 && /\S/.test(e.key) && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const letra = e.key.toLocaleLowerCase('es')
      for (let k = 1; k <= n; k++) {
        const j = (activo + k) % n
        if (todos[j].texto.toLocaleLowerCase('es').startsWith(letra)) return setActivo(j)
      }
    }
  }

  const elegir = (item: ItemMenu) => {
    cerrar(true)
    item.alElegir()
  }

  const propsDisparador: PropsDisparador = {
    ref: boton,
    id: idBoton,
    'aria-haspopup': 'menu',
    'aria-expanded': abierto,
    'aria-controls': idMenu,
    onClick: () => (abierto ? cerrar(false) : abrir('primero')),
    onKeyDown: teclaBoton,
  }

  let indice = -1

  return (
    <div ref={caja} className={cx('relative inline-flex', className)}>
      {disparador ? (
        disparador(propsDisparador)
      ) : (
        <Boton
          {...propsDisparador}
          variante="texto"
          tamano={tamano}
          icono={DotsThree}
          aria-label={rotulo}
          tooltip={false}
          className={abierto ? 'bg-suave text-tinta' : undefined}
        />
      )}

      {abierto && (
        <>
          {/* Velo solo en celular, donde el menú es una hoja desde abajo. */}
          <div aria-hidden className="fixed inset-0 z-40 bg-tinta/20 sm:hidden" onPointerDown={() => cerrar(false)} />
          <div
            id={idMenu}
            role="menu"
            aria-labelledby={idBoton}
            aria-orientation="vertical"
            onKeyDown={teclaMenu}
            className={cx(
              'z-50 min-w-56 rounded-control border border-borde bg-superficie p-1 shadow-flotante outline-none',
              'transition-[opacity,scale,translate] duration-150 ease-(--ease) motion-reduce:transition-none',
              'starting:scale-95 starting:opacity-0',
              // Escritorio: flotante junto al botón.
              'sm:absolute',
              lado === 'abajo' ? 'sm:top-full sm:mt-1.5' : 'sm:bottom-full sm:mb-1.5',
              alinear === 'fin' ? 'sm:right-0' : 'sm:left-0',
              lado === 'abajo'
                ? alinear === 'fin' ? 'sm:origin-top-right' : 'sm:origin-top-left'
                : alinear === 'fin' ? 'sm:origin-bottom-right' : 'sm:origin-bottom-left',
              // Celular: hoja abajo, a todo el ancho, con toques de 44 px.
              'max-sm:fixed max-sm:inset-x-3 max-sm:bottom-[max(12px,env(safe-area-inset-bottom))] max-sm:origin-bottom max-sm:rounded-tarjeta max-sm:p-1.5',
              'max-sm:starting:translate-y-4 max-sm:starting:scale-100',
            )}
          >
            {grupos.map((g, gi) => (
              <Fragment key={g.id}>
                {gi > 0 && <div role="separator" className="mx-1 my-1 h-px bg-divisor" />}
                <div role="group" aria-labelledby={g.rotulo ? `${base}-g-${g.id}` : undefined}>
                  {g.rotulo && (
                    <div id={`${base}-g-${g.id}`} className="px-3 pt-1.5 pb-1 text-[11px] font-medium text-texto-3">
                      {g.rotulo}
                    </div>
                  )}
                  {g.items.map((item) => {
                    const i = ++indice
                    const Icono = item.icono
                    const peligro = item.tono === 'peligro'
                    return (
                      <button
                        key={item.id}
                        ref={(el) => {
                          items.current[i] = el
                        }}
                        type="button"
                        role="menuitem"
                        tabIndex={-1}
                        data-activo={i === activo || undefined}
                        onClick={() => elegir(item)}
                        onPointerMove={() => i !== activo && setActivo(i)}
                        className={cx(
                          'flex h-8 w-full cursor-pointer items-center gap-2 rounded-chip px-3 text-left text-[13px] font-medium outline-none max-sm:h-11',
                          // El resaltado sigue al índice activo (teclado y mouse), no a :focus.
                          peligro ? 'text-rojo-texto data-activo:bg-rojo-fondo' : 'text-tinta data-activo:bg-suave',
                        )}
                      >
                        {Icono && (
                          <Icono size={16} aria-hidden className={cx('shrink-0', !peligro && 'text-texto-3')} />
                        )}
                        <span className="flex-1 truncate">{item.texto}</span>
                        {item.atajo && (
                          <kbd className="pl-4 font-mono text-xs font-medium text-texto-3 max-sm:hidden">{item.atajo}</kbd>
                        )}
                      </button>
                    )
                  })}
                </div>
              </Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
