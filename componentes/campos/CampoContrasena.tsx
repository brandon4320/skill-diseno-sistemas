'use client'

import { useId, useState, type ReactNode } from 'react'
import { Check, Eye, EyeSlash, LockSimple, Circle } from '@phosphor-icons/react'
import { cx, FOCO } from '../base/utilidades'
import { EnvoltorioCampo, INPUT, cajaCampo, describedBy, type Mensaje } from './_campo'

export type Requisito = { texto: string; cumple: (v: string) => boolean }
export const REQUISITOS_BASE: Requisito[] = [
  { texto: '10 caracteres o más', cumple: (v) => v.length >= 10 },
  { texto: 'Una mayúscula', cumple: (v) => /[A-ZÁÉÍÓÚÑ]/.test(v) },
  { texto: 'Un número', cumple: (v) => /\d/.test(v) },
]

export type CampoContrasenaProps = {
  rotulo?: ReactNode
  valor: string
  onCambio: (v: string) => void
  /** 'nueva' muestra la fuerza y los requisitos; 'actual' solo el ojo y el aviso de mayúsculas. */
  modo?: 'nueva' | 'actual'
  requisitos?: Requisito[]
  /** "¿La olvidaste?" a la derecha del rótulo. */
  extraRotulo?: ReactNode
  mensaje?: Mensaje | null
  id?: string
  className?: string
}

const NIVELES = [
  { texto: 'Floja', color: 'bg-rojo-texto', tono: 'text-rojo-texto' },
  { texto: 'Mejorable', color: 'bg-ambar-texto', tono: 'text-ambar-texto' },
  { texto: 'Buena', color: 'bg-verde-texto', tono: 'text-verde-texto' },
] as const

/** Contraseña con botón para mostrarla, aviso de Bloq Mayús y, si es nueva, fuerza y requisitos tildables. */
export function CampoContrasena({ rotulo = 'Contraseña', valor, onCambio, modo = 'actual', requisitos = REQUISITOS_BASE, extraRotulo, mensaje, id: idPropio, className }: CampoContrasenaProps) {
  const auto = useId()
  const id = idPropio ?? auto
  const [ver, setVer] = useState(false)
  const [mayus, setMayus] = useState(false)
  const cumplidos = requisitos.filter((r) => r.cumple(valor)).length
  const nivel = valor ? NIVELES[Math.min(NIVELES.length - 1, Math.floor((cumplidos / requisitos.length) * (NIVELES.length - 0.01)))] : null
  const aviso: Mensaje | null = mensaje ?? (mayus ? { tipo: 'aviso', texto: 'Bloq Mayús está activado.' } : null)
  const idReqs = `${id}-reqs`

  return (
    <EnvoltorioCampo id={id} rotulo={rotulo} mensaje={aviso} extraRotulo={extraRotulo} className={cx('w-80 max-sm:w-full', className)}>
      <div data-caja className={cajaCampo(aviso?.tipo === 'error' ? 'error' : 'neutro', 'pr-1')}>
        <LockSimple size={16} aria-hidden className="shrink-0 text-texto-3" />
        <input
          id={id}
          type={ver ? 'text' : 'password'}
          value={valor}
          autoComplete={modo === 'nueva' ? 'new-password' : 'current-password'}
          onChange={(e) => onCambio(e.target.value)}
          onKeyUp={(e) => setMayus(e.getModifierState('CapsLock'))}
          onBlur={() => setMayus(false)}
          aria-invalid={aviso?.tipo === 'error' || undefined}
          aria-describedby={cx(describedBy(id, aviso), modo === 'nueva' && idReqs) || undefined}
          className={cx(INPUT, !ver && valor && 'tracking-[0.15em]')}
        />
        <button
          type="button"
          onClick={() => setVer(!ver)}
          aria-pressed={ver}
          aria-label={ver ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          className={cx('grid size-8 shrink-0 place-items-center rounded-[calc(var(--radius-control)-3px)] text-texto-3 hover:bg-hover hover:text-tinta max-sm:size-11', FOCO)}
        >
          {ver ? <EyeSlash size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
        </button>
      </div>
      {modo === 'nueva' && (
        <div id={idReqs} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex flex-1 gap-1" aria-hidden>
              {NIVELES.map((n, i) => (
                <span key={n.texto} className={cx('h-1 flex-1 rounded-full bg-divisor transition-colors duration-200 motion-reduce:transition-none', nivel && NIVELES.indexOf(nivel) >= i && nivel.color)} />
              ))}
            </div>
            <span aria-live="polite" className={cx('w-20 text-right text-xs', nivel?.tono ?? 'text-texto-3')}>{nivel?.texto ?? ''}</span>
          </div>
          <ul className="flex flex-col gap-1">
            {requisitos.map((r) => {
              const ok = r.cumple(valor)
              return (
                <li key={r.texto} className={cx('flex items-center gap-1.5 text-xs', ok ? 'text-verde-texto' : 'text-texto-3')}>
                  {ok ? <Check size={12} weight="bold" aria-hidden /> : <Circle size={12} aria-hidden />}
                  {r.texto}
                  <span className="sr-only">{ok ? ' (cumplido)' : ' (falta)'}</span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </EnvoltorioCampo>
  )
}
