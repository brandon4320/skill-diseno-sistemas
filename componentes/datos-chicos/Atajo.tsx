import { Fragment } from 'react'
import { cx } from '../base/utilidades'

const NOMBRE_TECLA: Record<string, string> = {
  '⌘': 'Comando', '⇧': 'Mayúscula', '⌥': 'Opción', '⌃': 'Control', '↵': 'Enter', '⌫': 'Borrar', Esc: 'Escape', '↑': 'Arriba', '↓': 'Abajo',
}

export type TeclaProps = {
  children: string
  /** chica: 20 px (menús, tooltips) · grande: 28 px (para enseñar un atajo). */
  tamano?: 'chica' | 'grande'
  /** Sobre fondo invertido (tooltip, toast): sin borde, al 22 %. */
  sobreOscuro?: boolean
  /** Apretada (cuando se detecta la tecla): baja 1 px y pierde el borde inferior. */
  apretada?: boolean
  className?: string
}

/** Tecla: mono 11, caja con borde inferior de 2 px. Server Component. */
export function Tecla({ children, tamano = 'chica', sobreOscuro, apretada, className }: TeclaProps) {
  return (
    <kbd
      aria-label={NOMBRE_TECLA[children]}
      className={cx(
        'inline-flex items-center justify-center rounded-[6px] font-mono font-medium transition-[transform,background-color] duration-[120ms]',
        tamano === 'grande' ? 'h-7 min-w-7 rounded-chip px-1.5 text-[13px]' : 'h-5 min-w-5 px-[5px] text-[11px]',
        sobreOscuro ? 'h-[18px] min-w-[18px] bg-[rgb(127_127_127/.22)] text-current' : 'border border-b-2 border-borde bg-superficie text-texto-2',
        apretada && 'translate-y-px border-b bg-suave text-tinta',
        className,
      )}
    >
      {children}
    </kbd>
  )
}

export type AtajoProps = {
  /** Combinación: ['⌘', 'K']. Secuencia: [['G'], ['C']] (se lee "G luego C"). */
  teclas: string[] | string[][]
  tamano?: TeclaProps['tamano']
  sobreOscuro?: boolean
  className?: string
}

/**
 * Atajo de teclado (patrones 11.1 a 11.4): combinaciones juntas (3 px), secuencias con "luego".
 * En menús va a la derecha; en tooltips, al lado del texto.
 */
export function Atajo({ teclas, tamano, sobreOscuro, className }: AtajoProps) {
  const pasos: string[][] = Array.isArray(teclas[0]) ? (teclas as string[][]) : [teclas as string[]]
  return (
    <span className={cx('inline-flex items-center gap-[3px]', className)}>
      {pasos.map((paso, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="mx-1 text-[11px] text-texto-3">luego</span>}
          {paso.map(t => (
            <Tecla key={t} tamano={tamano} sobreOscuro={sobreOscuro}>
              {t}
            </Tecla>
          ))}
        </Fragment>
      ))}
    </span>
  )
}
