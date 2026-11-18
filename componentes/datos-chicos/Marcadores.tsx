import { ArrowsLeftRightIcon, BankIcon, CreditCardIcon, LinkSimpleIcon, QrCodeIcon } from '@phosphor-icons/react/ssr'
import type { ReactNode } from 'react'
import { colorDe, cx, iniciales } from '../base/utilidades'

/* ── Banderas: SVG propio de 18×13, con borde de 1 px al 12 % de la tinta ── */

export type Pais = 'AR' | 'UY' | 'CL' | 'BR' | 'PY' | 'ES' | 'US' | 'CN'

export const NOMBRE_PAIS: Record<Pais, string> = {
  AR: 'Argentina', UY: 'Uruguay', CL: 'Chile', BR: 'Brasil', PY: 'Paraguay', ES: 'España', US: 'Estados Unidos', CN: 'China',
}

const DIBUJO: Record<Pais, ReactNode> = {
  AR: (<><rect width="18" height="13" fill="#74acdf" /><rect y="4.33" width="18" height="4.33" fill="#fff" /><circle cx="9" cy="6.5" r="1.3" fill="#f6b40e" /></>),
  UY: (<><rect width="18" height="13" fill="#fff" />{[1.44, 4.33, 7.22, 10.1].map(y => <rect key={y} y={y} width="18" height="1.44" fill="#0038a8" />)}<rect width="7.5" height="7.2" fill="#fff" /><circle cx="3.75" cy="3.6" r="1.7" fill="#fcd116" /></>),
  CL: (<><rect width="18" height="13" fill="#fff" /><rect y="6.5" width="18" height="6.5" fill="#d52b1e" /><rect width="6.5" height="6.5" fill="#0039a6" /><path d="M3.25 1.6l.55 1.7h1.8l-1.45 1.05.55 1.7-1.45-1.05-1.45 1.05.55-1.7L.9 3.3h1.8z" fill="#fff" /></>),
  BR: (<><rect width="18" height="13" fill="#009b3a" /><path d="M9 1.6 16.2 6.5 9 11.4 1.8 6.5z" fill="#fedf00" /><circle cx="9" cy="6.5" r="2.6" fill="#002776" /></>),
  PY: (<><rect width="18" height="13" fill="#fff" /><rect width="18" height="4.33" fill="#d52b1e" /><rect y="8.67" width="18" height="4.33" fill="#0038a8" /><circle cx="9" cy="6.5" r="1.4" fill="none" stroke="#2e7d32" strokeWidth=".6" /></>),
  ES: (<><rect width="18" height="13" fill="#aa151b" /><rect y="3.25" width="18" height="6.5" fill="#f1bf00" /></>),
  US: (<><rect width="18" height="13" fill="#fff" />{[0, 2, 4, 6, 8, 10, 12].map(y => <rect key={y} y={y} width="18" height="1" fill="#b22234" />)}<rect width="7.6" height="7" fill="#3c3b6e" /></>),
  CN: (<><rect width="18" height="13" fill="#de2910" /><path d="M3.4 1.7l.6 1.8h1.9l-1.5 1.1.6 1.8-1.6-1.1-1.5 1.1.6-1.8L1 3.5h1.9z" fill="#ffde00" /></>),
}

/** Bandera de 18×13 antes del país (patrón 1.13). Con `conNombre`, el nombre al lado en texto-2. */
export function Bandera({ pais, conNombre, className }: { pais: Pais; conNombre?: boolean; className?: string }) {
  const svg = (
    <svg
      viewBox="0 0 18 13"
      role={conNombre ? undefined : 'img'}
      aria-label={conNombre ? undefined : NOMBRE_PAIS[pais]}
      aria-hidden={conNombre ? true : undefined}
      className="h-[13px] w-[18px] shrink-0 overflow-hidden rounded-[2px] ring-1 ring-tinta/12"
    >
      {DIBUJO[pais]}
    </svg>
  )
  if (!conNombre) return <span className={cx('inline-flex', className)}>{svg}</span>
  return (
    <span className={cx('inline-flex items-center gap-2 whitespace-nowrap text-texto-2', className)}>
      {svg}
      {NOMBRE_PAIS[pais]}
    </span>
  )
}

/* ── Logo de entidad: monograma en cuadro del color fijo de la entidad ── */

export type LogoEntidadProps = {
  /** Id estable: define el color. */
  id: string
  nombre: string
  /** solido: fondo oscurecido + letras blancas · claro: pastel al 14 % + letras del color · redondo: como solido, en círculo. */
  forma?: 'solido' | 'claro' | 'redondo'
  /** 16 · 20 (por defecto) · 24 px. */
  tamano?: 16 | 20 | 24
  className?: string
}

/** Logo de entidad en celda (patrón 1.13). El sólido se oscurece al 74 % para que el blanco llegue a 4,5:1. */
export function LogoEntidad({ id, nombre, forma = 'claro', tamano = 20, className }: LogoEntidadProps) {
  const c = colorDe(id)
  const estilo =
    forma === 'claro'
      ? { background: `color-mix(in oklch, ${c} 14%, var(--color-superficie))`, color: `color-mix(in oklch, ${c} 70%, var(--color-tinta))` }
      : { background: `color-mix(in oklch, ${c} 74%, black)`, color: '#fff' }
  return (
    <span
      aria-hidden
      className={cx(
        'grid shrink-0 place-items-center text-[11px] font-semibold tracking-[-0.04em]',
        forma === 'redondo' ? 'rounded-full' : tamano === 16 ? 'rounded-[5px]' : 'rounded-[6px]',
        className,
      )}
      style={{ ...estilo, width: tamano, height: tamano }}
    >
      {tamano > 16 ? iniciales(nombre) : null}
    </span>
  )
}

/** Empresa en una celda: logo + nombre en 500. */
export function CeldaEntidad({ id, nombre, forma }: { id: string; nombre: string; forma?: LogoEntidadProps['forma'] }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2 font-medium">
      <LogoEntidad id={id} nombre={nombre} forma={forma} />
      <span className="truncate">{nombre}</span>
    </span>
  )
}

/* ── Medio de pago y dominio ── */

export type TipoPago = 'tarjeta' | 'transferencia' | 'giro' | 'qr'
const ICONO_PAGO = { tarjeta: CreditCardIcon, transferencia: BankIcon, giro: ArrowsLeftRightIcon, qr: QrCodeIcon } as const

/** "▭ Visa •• 4242": tarjetita de 24×16 con borde + el texto. Sin logos de marcas. */
export function MedioPago({ tipo, children, className }: { tipo: TipoPago; children: ReactNode; className?: string }) {
  const Icono = ICONO_PAGO[tipo]
  return (
    <span className={cx('inline-flex items-center gap-2 whitespace-nowrap', className)}>
      <span aria-hidden className="grid h-4 w-6 shrink-0 place-items-center rounded-[3px] border border-borde bg-superficie">
        <Icono size={12} className="text-texto-2" />
      </span>
      {children}
    </span>
  )
}

/** Dominio con eslabón gris adelante; enlace sin subrayado hasta pasar. */
export function Dominio({ dominio, href, className }: { dominio: string; href?: string; className?: string }) {
  const cuerpo = (
    <>
      <LinkSimpleIcon size={13} aria-hidden className="text-texto-3" />
      {dominio}
    </>
  )
  const clase = cx('inline-flex items-center gap-1 whitespace-nowrap text-texto-2', className)
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className={cx(clase, 'hover:text-tinta hover:underline')}>
      {cuerpo}
    </a>
  ) : (
    <span className={clase}>{cuerpo}</span>
  )
}
