'use client'
/**
 * BarraLateral: va directo sobre el marco, sin caja propia (referencias 02, 06, 07).
 *
 * - Arriba, el espacio (logo + nombre + selector) y el buscador ⌘K.
 * - Grupos con rótulo chico. Ítems de 34 px, ícono gris regular y conteo gris a la derecha.
 * - El ítem activo es una pastilla blanca con sombra mínima y el ícono pasa a fill.
 *   Nunca color de marca en el activo.
 * - Las entidades (proyectos, clientes) llevan su cuadrito de color con el ícono fill en blanco.
 * - Al pie, una tarjeta (meta, plan) y el usuario.
 * - Colapsada: solo íconos, con globo al pasar el mouse o con foco.
 */
import { useState, type FocusEvent, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react'
import {
  ArrowRightIcon,
  CaretUpDownIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  SidebarSimpleIcon,
  SignOutIcon,
  XIcon,
  type Icon,
} from '@phosphor-icons/react'
import { useMarco } from './MarcoApp'
import { colorEntidad, Monograma } from './TarjetaEntidad'

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')
const EASE = 'ease-(--ease)'
const FOCO = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento/45'

export type ItemMenu = {
  id: string
  texto: string
  href: string
  icono: Icon
  /** Cuántos hay (gris, a la derecha). 0 no se muestra. */
  conteo?: number
  activo?: boolean
  /** Si está, es una entidad: cuadrito de este color con el ícono fill en blanco. Usá colorEntidad(id). */
  color?: string
}

export type GrupoMenu = {
  id: string
  /** Sin título, el grupo va primero y sin rótulo. */
  titulo?: string
  items: ItemMenu[]
  /** Botón "+" al lado del rótulo (por ejemplo, "Nuevo proyecto"). */
  accion?: { etiqueta: string; onClick: () => void }
}

export type BarraLateralProps = {
  espacio: { nombre: string; rotulo?: string; logo: ReactNode; onCambiar?: () => void }
  buscar?: { onAbrir: () => void; atajo?: string }
  grupos: GrupoMenu[]
  /** Tarjeta al pie, arriba del usuario (meta del mes, plan). Se oculta colapsada. */
  tarjeta?: ReactNode
  usuario: { nombre: string; rol?: string; foto?: string; onSalir?: () => void }
}

type Globo = { texto: string; x: number; y: number } | null

export function BarraLateral({ espacio, buscar, grupos, tarjeta, usuario }: BarraLateralProps) {
  const { colapsada, alternar, enCajon, cerrarCajon, enlace: Enlace } = useMarco()
  const [globo, setGlobo] = useState<Globo>(null)

  // Globo con position:fixed para que no lo recorte la barra (que tiene overflow oculto al animar el ancho).
  const conGlobo = (texto: string) =>
    colapsada
      ? {
          onMouseEnter: (e: MouseEvent<HTMLElement>) => mostrarGlobo(e.currentTarget, texto),
          onFocus: (e: FocusEvent<HTMLElement>) => mostrarGlobo(e.currentTarget, texto),
          onMouseLeave: () => setGlobo(null),
          onBlur: () => setGlobo(null),
        }
      : {}
  function mostrarGlobo(el: HTMLElement, texto: string) {
    const r = el.getBoundingClientRect()
    setGlobo({ texto, x: r.right + 10, y: r.top + r.height / 2 })
  }

  const botonBarra = enCajon ? (
    <BotonIcono etiqueta="Cerrar menú" onClick={cerrarCajon} icono={XIcon} />
  ) : (
    <BotonIcono
      etiqueta={colapsada ? 'Mostrar barra (⌘\\)' : 'Ocultar barra (⌘\\)'}
      onClick={() => {
        setGlobo(null)
        alternar()
      }}
      icono={SidebarSimpleIcon}
      {...conGlobo(colapsada ? 'Mostrar barra  ⌘\\' : '')}
    />
  )

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* Espacio */}
      <div className={cn('flex items-center gap-2', colapsada && 'flex-col')}>
        <button
          type="button"
          onClick={espacio.onCambiar}
          disabled={!espacio.onCambiar}
          aria-label={colapsada ? `${espacio.nombre}: cambiar de espacio` : undefined}
          {...conGlobo(espacio.nombre)}
          className={cn(
            'flex min-w-0 items-center gap-2 rounded-control border border-borde bg-superficie text-left shadow-min transition-colors',
            colapsada ? 'size-11 justify-center p-0' : 'flex-1 px-3 py-2',
            espacio.onCambiar && 'hover:border-borde-fuerte',
            FOCO,
          )}
        >
          <span className="grid size-[30px] shrink-0 place-items-center overflow-hidden rounded-[10px]">{espacio.logo}</span>
          {!colapsada && (
            <>
              <span className="min-w-0 flex-1">
                {espacio.rotulo && <small className="block text-xs leading-tight text-texto-3">{espacio.rotulo}</small>}
                <b className="font-display block truncate text-base leading-tight font-medium tracking-[-.01em]">{espacio.nombre}</b>
              </span>
              {espacio.onCambiar && <CaretUpDownIcon size={15} className="shrink-0 text-texto-3" />}
            </>
          )}
        </button>
        {(colapsada || enCajon) && botonBarra}
      </div>

      {/* Buscador */}
      {buscar && (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={buscar.onAbrir}
            aria-label="Buscar"
            aria-keyshortcuts="Meta+K Control+K"
            {...conGlobo(`Buscar  ${buscar.atajo ?? '⌘K'}`)}
            className={cn(
              'flex h-9 items-center gap-2 rounded-control border border-borde bg-superficie text-texto-3 transition-colors hover:border-borde-fuerte hover:text-texto-2',
              colapsada ? 'mx-auto w-11 justify-center' : 'flex-1 px-3',
              FOCO,
            )}
          >
            <MagnifyingGlassIcon size={16} />
            {!colapsada && (
              <>
                <span className="text-[13px]">Buscar</span>
                <kbd className="ml-auto rounded-[5px] border border-borde px-1 py-0.5 font-mono text-xs font-medium">{buscar.atajo ?? '⌘K'}</kbd>
              </>
            )}
          </button>
          {!colapsada && !enCajon && botonBarra}
        </div>
      )}
      {!buscar && !colapsada && !enCajon && <div className="-mt-1.5 flex justify-end">{botonBarra}</div>}

      {/* Grupos */}
      <nav className="-mx-1.5 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-1.5 [scrollbar-width:thin]">
        {grupos.map((g, gi) => (
          <div key={g.id} role="group" aria-label={g.titulo}>
            {g.titulo &&
              (colapsada ? (
                gi > 0 && <div aria-hidden className="mx-3 mb-2 h-px bg-borde" />
              ) : (
                <div className="flex h-7 items-center justify-between px-3">
                  <h6 className="text-[11px] font-medium tracking-wider text-texto-3 uppercase">{g.titulo}</h6>
                  {g.accion && (
                    <button
                      type="button"
                      onClick={g.accion.onClick}
                      aria-label={g.accion.etiqueta}
                      title={g.accion.etiqueta}
                      className={cn('-mr-1 grid size-6 place-items-center rounded-chip text-texto-3 hover:bg-tinta/5 hover:text-tinta', FOCO)}
                    >
                      <PlusIcon size={13} />
                    </button>
                  )}
                </div>
              ))}
            <ul className="flex flex-col gap-px">
              {g.items.map((it) => {
                const I = it.icono
                const esEntidad = it.color !== undefined
                return (
                  <li key={it.id}>
                    <Enlace
                      href={it.href}
                      aria-current={it.activo ? 'page' : undefined}
                      aria-label={colapsada ? `${it.texto}${it.conteo ? `, ${it.conteo}` : ''}` : undefined}
                      onClick={enCajon ? cerrarCajon : undefined}
                      {...conGlobo(it.conteo ? `${it.texto} · ${it.conteo}` : it.texto)}
                      className={cn(
                        'group relative flex h-[34px] items-center gap-2 rounded-control text-sm font-medium transition-[background,color,box-shadow] duration-150',
                        colapsada ? 'mx-auto w-11 justify-center' : 'px-3',
                        it.activo
                          ? 'bg-superficie text-tinta shadow-min ring-1 ring-borde'
                          : 'text-tinta/75 hover:bg-tinta/[.045] hover:text-tinta',
                        FOCO,
                      )}
                    >
                      {esEntidad ? (
                        <span className="grid size-5 shrink-0 place-items-center rounded-chip text-white" style={{ background: it.color || colorEntidad(it.id) }}>
                          <I size={11} weight="fill" />
                        </span>
                      ) : (
                        <I size={17} weight={it.activo ? 'fill' : 'regular'} className={cn('shrink-0', it.activo ? 'text-tinta' : 'text-texto-2 group-hover:text-tinta')} />
                      )}
                      {!colapsada && <span className="min-w-0 flex-1 truncate">{it.texto}</span>}
                      {!colapsada && !!it.conteo && <span className="text-xs font-medium text-texto-3 tabular-nums">{it.conteo}</span>}
                      {colapsada && !!it.conteo && !esEntidad && (
                        <i aria-hidden className="absolute top-1.5 right-2 size-1.5 rounded-full bg-texto-3/70" />
                      )}
                    </Enlace>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Pie */}
      {tarjeta && !colapsada && <div className="shrink-0">{tarjeta}</div>}
      <div className={cn('flex shrink-0 items-center gap-2 rounded-control px-1.5 py-1', colapsada && 'flex-col px-0')}>
        <span {...conGlobo(`${usuario.nombre}${usuario.rol ? ` · ${usuario.rol}` : ''}`)} tabIndex={colapsada ? 0 : undefined} className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-acento/45">
          <Monograma nombre={usuario.nombre} foto={usuario.foto} tamano={34} />
        </span>
        {!colapsada && (
          <span className="min-w-0 flex-1">
            <b className="block truncate text-[13px] leading-tight font-medium">{usuario.nombre}</b>
            {usuario.rol && <small className="block truncate text-xs text-texto-3">{usuario.rol}</small>}
          </span>
        )}
        {usuario.onSalir && (
          <button
            type="button"
            onClick={usuario.onSalir}
            aria-label="Salir"
            {...conGlobo('Salir')}
            className={cn('grid size-9 place-items-center rounded-control text-texto-3 hover:bg-tinta/5 hover:text-tinta', FOCO)}
          >
            <SignOutIcon size={17} />
          </button>
        )}
      </div>

      {globo && (
        <span
          role="tooltip"
          className="pointer-events-none fixed z-[60] -translate-y-1/2 rounded-chip bg-tinta px-2 py-1 text-xs font-medium whitespace-pre text-superficie shadow-flotante"
          style={{ left: globo.x, top: globo.y }}
        >
          {globo.texto}
        </span>
      )}
    </div>
  )
}

function BotonIcono({ etiqueta, onClick, icono: I, ...resto }: { etiqueta: string; onClick: () => void; icono: Icon } & HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={etiqueta}
      title={resto.onMouseEnter ? undefined : etiqueta}
      {...resto}
      className={cn('grid size-9 shrink-0 place-items-center rounded-control text-texto-3 transition-colors hover:bg-tinta/5 hover:text-tinta', FOCO)}
    >
      <I size={17} />
    </button>
  )
}

/* ── Tarjeta del pie ────────────────────────────────────────────────────── */

export type TarjetaMetaProps = {
  rotulo: string
  /** La cifra grande: "69 %". */
  cifra: ReactNode
  /** Contexto con cifras: "US$ 41.600 de 60.000 · faltan 13 días". */
  texto: string
  /** 0–100: dibuja rayitas del acento debajo. */
  avance?: number
  enlace?: { texto: string; href: string }
  /** Ilustración de línea arriba a la derecha. Por defecto, un faro de líneas. */
  arte?: ReactNode
}

/** Meta del mes o plan, como la tarjeta "Your plan" de la referencia 06. */
export function TarjetaMeta({ rotulo, cifra, texto, avance, enlace, arte }: TarjetaMetaProps) {
  const { enlace: Enlace } = useMarco()
  const on = avance != null ? Math.round((26 * Math.min(100, Math.max(0, avance))) / 100) : 0
  return (
    <div className="relative overflow-hidden rounded-interno border border-borde bg-superficie p-4">
      <div aria-hidden className="pointer-events-none absolute -top-3.5 -right-4 text-acento opacity-60">
        {arte ?? <ArteFaro />}
      </div>
      <small className="relative text-xs text-texto-3">{rotulo}</small>
      <div className="font-display relative mt-0.5 text-2xl leading-tight font-normal tracking-[-.02em] tabular-nums">{cifra}</div>
      <p className="relative mt-0.5 max-w-[160px] text-xs text-texto-2 tabular-nums">{texto}</p>
      {avance != null && (
        <div className="mt-3 flex h-3 gap-0.5" role="img" aria-label={`${Math.round(avance)} %`}>
          {Array.from({ length: 26 }, (_, i) => (
            <i
              key={i}
              className={cn('flex-1 rounded-[2px] transition-colors duration-500', EASE, i < on ? 'bg-acento' : 'bg-suave')}
              style={{ transitionDelay: `${i * 14}ms` }}
            />
          ))}
        </div>
      )}
      {enlace && (
        <Enlace href={enlace.href} className={cn('mt-3 inline-flex items-center gap-1 rounded-chip text-[13px] font-medium text-tinta hover:gap-1.5 transition-[gap]', FOCO)}>
          {enlace.texto}
          <ArrowRightIcon size={13} />
        </Enlace>
      )}
    </div>
  )
}

function ArteFaro() {
  return (
    <svg width="120" height="112" viewBox="0 0 120 112" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="76" cy="46" r="40" strokeDasharray="2 4" opacity=".55" />
      <circle cx="76" cy="46" r="26" opacity=".45" />
      <path d="M76 6v80M36 46h80" strokeDasharray="1 5" opacity=".5" />
      <path d="M68 92l3-40h10l3 40z" strokeWidth="1.3" />
      <path d="M70 70h12M69.5 80h13" />
      <path d="M71 52h10v-6H71zM73 46v-4h6v4" strokeWidth="1.3" />
      <path d="M81 49l26-10M81 49l26 6" opacity=".7" />
      <circle cx="76" cy="40" r="2" fill="currentColor" />
    </svg>
  )
}
