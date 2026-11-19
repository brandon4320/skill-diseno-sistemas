'use client'
/**
 * BarraSuperior + Cabecera: lo primero del panel.
 *
 * BarraSuperior (56 px, línea abajo): migas "Sección › Página" con el padre en gris
 * y, a la derecha, buscador, avisos y avatar. En celular, solo la página y una flecha al padre.
 *
 * Cabecera: antetítulo chico (la fecha), título display grande y liviano, subtítulo con
 * CIFRAS REALES del estado ("12 por facturar · 3 vencidas", nunca una descripción) y las
 * acciones a la derecha, con un solo botón relleno.
 *
 *   <Cabecera
 *     antetitulo="Martes 17 de noviembre"
 *     titulo={saludoDelDia(hora)} nombre="Ana"
 *     cifras={[{ valor: 12, texto: 'por facturar', href: '/facturas?estado=pendiente' },
 *              { valor: 3, texto: 'vencidas', tono: 'rojo', href: '/facturas?estado=vencida' }]}
 *     acciones={<><BotonSecundario …/><BotonPrincipal …/></>}
 *   />
 */
import { Fragment, type ReactNode } from 'react'
import { CaretLeftIcon, CaretRightIcon, type Icon } from '@phosphor-icons/react'
import { useMarco } from './MarcoApp'

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')
const FOCO = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento/45'

/* ── Barra superior ─────────────────────────────────────────────────────── */

export type Miga = { texto: string; href?: string; icono?: Icon }

export function BarraSuperior({ migas, derecha, className }: { migas: Miga[]; derecha?: ReactNode; className?: string }) {
  const { enlace: Enlace } = useMarco()
  const actual = migas[migas.length - 1]
  const padre = [...migas].reverse().find((m, i) => i > 0 && m.href)

  return (
    <div className={cn('relative flex h-14 items-center gap-3 border-b border-divisor px-4 md:h-[58px] md:px-7', className)}>
      {/* Escritorio: el camino completo */}
      <nav aria-label="Migas" className="hidden min-w-0 md:block">
        <ol className="flex items-center gap-2 text-sm font-medium text-texto-3">
          {migas.map((m, i) => {
            const ultima = i === migas.length - 1
            const I = m.icono
            const cont = (
              <>
                {I && <I size={16} />}
                <span className="truncate">{m.texto}</span>
              </>
            )
            return (
              <Fragment key={`${m.texto}-${i}`}>
                {i > 0 && (
                  <li aria-hidden>
                    <CaretRightIcon size={12} />
                  </li>
                )}
                <li className="flex min-w-0 items-center">
                  {ultima ? (
                    <span aria-current="page" className="flex min-w-0 items-center gap-2 text-tinta">
                      {cont}
                    </span>
                  ) : m.href ? (
                    <Enlace href={m.href} className={cn('flex min-w-0 items-center gap-2 rounded-chip transition-colors hover:text-tinta', FOCO)}>
                      {cont}
                    </Enlace>
                  ) : (
                    <span className="flex min-w-0 items-center gap-2">{cont}</span>
                  )}
                </li>
              </Fragment>
            )
          })}
        </ol>
      </nav>

      {/* Celular: flecha al padre + la página */}
      <div className="flex min-w-0 items-center gap-1 md:hidden">
        {padre?.href && (
          <Enlace
            href={padre.href}
            aria-label={`Volver a ${padre.texto}`}
            className={cn('-ml-2 grid size-10 place-items-center rounded-full text-texto-2 hover:bg-hover', FOCO)}
          >
            <CaretLeftIcon size={18} />
          </Enlace>
        )}
        <span className="font-display truncate text-base font-medium tracking-[-.01em]">{actual?.texto}</span>
      </div>

      {derecha && <div className="ml-auto flex shrink-0 items-center gap-2">{derecha}</div>}
    </div>
  )
}

/** Botón cuadrado de 36 px de la barra superior (avisos, IA). Con punto rojo si hay algo. */
export function BotonBarra({ icono: I, etiqueta, onClick, aviso }: { icono: Icon; etiqueta: string; onClick?: () => void; aviso?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={aviso ? `${etiqueta} (hay nuevos)` : etiqueta}
      title={etiqueta}
      className={cn(
        'relative grid size-10 place-items-center rounded-control border border-borde bg-superficie text-texto-2 shadow-min transition-colors hover:bg-hover hover:text-tinta md:size-9',
        FOCO,
      )}
    >
      <I size={17} />
      {aviso && <i aria-hidden className="absolute top-2 right-[9px] size-[7px] rounded-full bg-rojo-texto ring-2 ring-superficie" />}
    </button>
  )
}

/* ── Cabecera ───────────────────────────────────────────────────────────── */

export type Cifra = {
  valor: ReactNode
  texto: string
  /** Solo para lo que exige actuar (rojo) o está por vencer (ámbar). Lo normal no se colorea. */
  tono?: 'rojo' | 'ambar' | 'verde'
  /** Toda cifra lleva a su lista filtrada. */
  href?: string
}

export type CabeceraProps = {
  /** Chico, arriba: la fecha en el inicio, o el tipo de ficha ("Cliente"). */
  antetitulo?: ReactNode
  titulo: ReactNode
  /** Con nombre, el título es saludo: "Buenas tardes, **Ana**". */
  nombre?: string
  /** "saludo" 40 px peso 300 (inicio); "pagina" 30 px peso 400 (el resto). */
  tamano?: 'saludo' | 'pagina'
  cifras?: Cifra[]
  /** Para lo que no es una cifra suelta. Va después de las cifras. */
  subtitulo?: ReactNode
  acciones?: ReactNode
  /** Si la pantalla usa la píldora fija de MarcoApp (accionMovil), las acciones no se repiten en celular. */
  ocultarAccionesEnCelular?: boolean
  className?: string
}

const TONO_CIFRA = { rojo: 'text-rojo-texto', ambar: 'text-ambar-texto', verde: 'text-verde-texto' } as const

export function Cabecera({ antetitulo, titulo, nombre, tamano, cifras, subtitulo, acciones, ocultarAccionesEnCelular, className }: CabeceraProps) {
  const { enlace: Enlace } = useMarco()
  const t = tamano ?? (nombre ? 'saludo' : 'pagina')

  return (
    <header className={cn('flex flex-col gap-4 md:flex-row md:items-end md:gap-6', className)}>
      <div className="min-w-0 flex-1">
        {antetitulo && <small className="block text-[13px] font-medium text-texto-2">{antetitulo}</small>}
        <h1
          className={cn(
            'font-display text-balance text-tinta',
            !!antetitulo && 'mt-1.5',
            t === 'saludo'
              ? 'text-[32px] leading-[1.08] font-medium tracking-[-.035em] md:text-[40px]'
              : 'text-2xl leading-[1.12] font-normal tracking-[-.03em] md:text-[32px]',
          )}
        >
          {titulo}
          {nombre && (
            <>
              , <b className="font-medium">{nombre}</b>
            </>
          )}
        </h1>
        {(cifras?.length || subtitulo) && (
          <p className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-texto-2 tabular-nums">
            {cifras?.map((c, i) => {
              const cont = (
                <>
                  <b className={cn('font-medium', c.tono ? TONO_CIFRA[c.tono] : 'text-tinta')}>{c.valor}</b> {c.texto}
                </>
              )
              return (
                <Fragment key={`${c.texto}-${i}`}>
                  {i > 0 && <span aria-hidden className="text-texto-3">·</span>}
                  {c.href ? (
                    <Enlace
                      href={c.href}
                      className={cn('rounded-chip underline decoration-borde-fuerte decoration-1 underline-offset-[5px] transition-colors hover:text-tinta hover:decoration-current', FOCO)}
                    >
                      {cont}
                    </Enlace>
                  ) : (
                    <span>{cont}</span>
                  )}
                </Fragment>
              )
            })}
            {subtitulo && (
              <>
                {cifras?.length ? <span aria-hidden className="text-texto-3">·</span> : null}
                <span>{subtitulo}</span>
              </>
            )}
          </p>
        )}
      </div>
      {acciones && <div className={cn('shrink-0 flex-wrap items-center gap-2', ocultarAccionesEnCelular ? 'hidden md:flex' : 'flex')}>{acciones}</div>}
    </header>
  )
}

/**
 * "Buenos días" / "Buenas tardes" / "Buenas noches".
 * Pasale la hora de Argentina calculada en el servidor (Vercel corre en UTC):
 *   const hora = Number(new Intl.DateTimeFormat('es-AR', { hour: 'numeric', hourCycle: 'h23', timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date()))
 */
export function saludoDelDia(hora: number) {
  if (hora >= 5 && hora < 13) return 'Buenos días'
  if (hora >= 13 && hora < 20) return 'Buenas tardes'
  return 'Buenas noches'
}

/* ── Botones de cabecera ────────────────────────────────────────────────── */

const BASE_BTN = cn(
  'inline-flex h-11 items-center justify-center gap-2 rounded-control px-4 text-[13px] font-medium whitespace-nowrap md:h-[38px]',
  'transition-[transform,box-shadow,background] duration-150 ease-(--ease) active:scale-[.97] motion-reduce:transform-none',
  FOCO,
)

/** El único relleno de la pantalla. Negro (bg-tinta), con brillo arriba. */
export function BotonPrincipal({ icono: I, children, onClick, type = 'button' }: { icono?: Icon; children: ReactNode; onClick?: () => void; type?: 'button' | 'submit' }) {
  return (
    <button type={type} onClick={onClick} className={cn(BASE_BTN, 'bg-tinta text-superficie shadow-principal hover:brightness-110')}>
      {I && <I size={17} />}
      {children}
    </button>
  )
}

export function BotonSecundario({ icono: I, children, onClick }: { icono?: Icon; children: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cn(BASE_BTN, 'border border-borde bg-superficie shadow-min hover:bg-hover')}>
      {I && <I size={17} />}
      {children}
    </button>
  )
}
