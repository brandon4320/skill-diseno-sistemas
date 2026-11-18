'use client'
/**
 * MarcoApp: el sistema entero en una caja sobre el lienzo (referencias 02, 06, 07, 13).
 *
 *   lienzo (bg-fondo) → marco (rounded-app, bg-panel, p-2) → [barra lateral | panel (rounded-marco, bg-superficie)]
 *
 * - La barra lateral va directo sobre el marco, sin caja propia. Se colapsa a íconos
 *   con el botón de la barra o con ⌘\ / Ctrl+\ (se recuerda por navegador).
 * - El panel lleva "clima": un degradé muy suave del acento arriba (referencia 08).
 * - Menos de 768 px: sin barra lateral, barra inferior de 4 (la última abre el menú
 *   completo en un cajón) y la acción principal como píldora fija abajo.
 * - Si no hay <ToastProvider> más arriba, MarcoApp pone uno.
 *
 *   <MarcoApp
 *     barraLateral={<BarraLateral … />}
 *     barraInferior={[{ id: 'inicio', texto: 'Inicio', href: '/', icono: HouseIcon, activo: true }, …]}
 *     accionMovil={{ texto: 'Nueva oportunidad', icono: PlusIcon, onClick: abrir }}
 *     enlace={Link}            // next/link o el de tu router; por defecto <a>
 *   >
 *     <BarraSuperior … /><Contenido>…</Contenido>
 *   </MarcoApp>
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ComponentType,
  type ReactNode,
} from 'react'
import { ListIcon, type Icon } from '@phosphor-icons/react'
import { ToastProvider, useToastOpcional } from './Toast'

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')
const EASE = 'ease-(--ease)'
const CLAVE = 'ds-barra-colapsada'

/* ── Contexto ───────────────────────────────────────────────────────────── */

export type EnlaceProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
export type Enlace = ComponentType<EnlaceProps>

const EnlaceA: Enlace = (p) => <a {...p} />

type ContextoMarco = {
  colapsada: boolean
  alternar: () => void
  /** true adentro del cajón del celular (la barra se dibuja completa). */
  enCajon: boolean
  cerrarCajon: () => void
  enlace: Enlace
}

const Contexto = createContext<ContextoMarco>({
  colapsada: false,
  alternar: () => {},
  enCajon: false,
  cerrarCajon: () => {},
  enlace: EnlaceA,
})

/** Sirve también fuera de MarcoApp (devuelve valores por defecto y <a> como enlace). */
export const useMarco = () => useContext(Contexto)

/* ── Tipos ──────────────────────────────────────────────────────────────── */

export type ItemInferior = {
  id: string
  texto: string
  href: string
  icono: Icon
  activo?: boolean
  /** Punto de aviso sobre el ícono (no un número: en celular alcanza con saber que hay). */
  aviso?: boolean
}

export type AccionMovil = {
  texto: string
  icono?: Icon
  onClick?: () => void
  href?: string
}

export type MarcoAppProps = {
  barraLateral: ReactNode
  children: ReactNode
  /** Celular: hasta 4. Con `menuEnBarra` (por defecto) se usan 3 y el cuarto abre el menú. */
  barraInferior?: ItemInferior[]
  menuEnBarra?: boolean
  /** Celular: la acción principal de la pantalla, en píldora fija abajo. */
  accionMovil?: AccionMovil
  /** Estado inicial si el navegador no recuerda otro. */
  colapsadaInicial?: boolean
  /** Degradé suave del acento arriba del panel. */
  clima?: boolean
  enlace?: Enlace
  className?: string
}

/* ── Marco ──────────────────────────────────────────────────────────────── */

export function MarcoApp(props: MarcoAppProps) {
  const hayToast = useToastOpcional()
  const marco = <Marco {...props} />
  return hayToast ? marco : <ToastProvider>{marco}</ToastProvider>
}

function Marco({
  barraLateral,
  children,
  barraInferior,
  menuEnBarra = true,
  accionMovil,
  colapsadaInicial = false,
  clima = true,
  enlace = EnlaceA,
  className,
}: MarcoAppProps) {
  const [colapsada, setColapsada] = useState(colapsadaInicial)
  const [cajon, setCajon] = useState(false)

  // Lo recordado se lee después de montar, para no romper la hidratación.
  useEffect(() => {
    try {
      const v = localStorage.getItem(CLAVE)
      if (v !== null) setColapsada(v === '1')
    } catch {}
  }, [])

  const alternar = useCallback(() => {
    setColapsada((c) => {
      try {
        localStorage.setItem(CLAVE, c ? '0' : '1')
      } catch {}
      return !c
    })
  }, [])

  // ⌘\ o Ctrl+\ colapsa la barra.
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault()
        alternar()
      }
    }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [alternar])

  // Le avisa al Toast cuánto ocupa el pie en celular.
  useEffect(() => {
    const alto = (barraInferior?.length ? 68 : 0) + (accionMovil ? 68 : 0)
    document.documentElement.style.setProperty('--ds-pie-movil', `${alto}px`)
    return () => {
      document.documentElement.style.removeProperty('--ds-pie-movil')
    }
  }, [barraInferior?.length, accionMovil])

  const ctx = useMemo<ContextoMarco>(
    () => ({ colapsada, alternar, enCajon: false, cerrarCajon: () => setCajon(false), enlace }),
    [colapsada, alternar, enlace],
  )

  const items = barraInferior ? barraInferior.slice(0, menuEnBarra ? 3 : 4) : []
  const Enl = enlace

  return (
    <Contexto.Provider value={ctx}>
      <div className={cn('min-h-dvh bg-fondo font-sans text-sm leading-normal text-tinta antialiased md:p-3 lg:p-5', className)}>
        <div
          className={cn(
            'mx-auto grid max-w-[1600px] grid-cols-1 md:grid-cols-[auto_minmax(0,1fr)] md:gap-2',
            'md:rounded-app md:border md:border-borde md:bg-panel md:p-2 md:shadow-[0_30px_60px_-30px_rgb(22_24_29/.25)]',
          )}
        >
          <aside
            aria-label="Navegación principal"
            className={cn(
              'sticky top-5 z-20 hidden h-[calc(100dvh-58px)] self-start overflow-hidden md:flex', // z-20: sticky arma su propio contexto y el globo tiene que pasar por encima del panel
              'transition-[width] duration-300 motion-reduce:transition-none',
              EASE,
              colapsada ? 'w-[68px]' : 'w-[248px]',
            )}
          >
            <div className={cn('flex h-full min-w-0 flex-1 flex-col', colapsada ? 'px-1.5 py-2' : 'px-1.5 py-2')}>{barraLateral}</div>
          </aside>

          <main
            className={cn(
              'relative min-h-dvh min-w-0 overflow-clip bg-superficie md:min-h-[calc(100dvh-58px)] md:rounded-marco md:border md:border-borde',
              !!barraInferior?.length && (accionMovil ? 'pb-[calc(152px+env(safe-area-inset-bottom))]' : 'pb-[calc(84px+env(safe-area-inset-bottom))]'),
              'md:pb-0',
            )}
          >
            {clima && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-[320px] opacity-100 in-data-[tema=oscuro]:opacity-60"
                style={{
                  background:
                    'radial-gradient(70% 120% at 85% -20%, color-mix(in oklch, var(--color-acento) 11%, transparent), transparent 60%),' +
                    'radial-gradient(50% 90% at 10% -30%, color-mix(in oklch, var(--color-dato-3) 7%, transparent), transparent 60%)',
                }}
              />
            )}
            <div className="relative">{children}</div>
          </main>
        </div>

        {/* ── Celular: píldora de acción + barra inferior ── */}
        {accionMovil && <PildoraAccion a={accionMovil} enlace={Enl} conBarra={!!barraInferior?.length} />}
        {barraInferior?.length ? (
          <nav
            aria-label="Navegación"
            className="fixed inset-x-0 bottom-0 z-40 border-t border-borde bg-superficie/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
          >
            <ul className="mx-auto flex h-[68px] max-w-md items-center justify-around px-2">
              {items.map((it) => (
                <li key={it.id}>
                  <Enl
                    href={it.href}
                    aria-current={it.activo ? 'page' : undefined}
                    className="group flex min-h-11 min-w-16 flex-col items-center gap-1 rounded-control focus-visible:outline-2 focus-visible:outline-acento/45"
                  >
                    <IconoInferior icono={it.icono} activo={it.activo} aviso={it.aviso} />
                    <span className={cn('text-xs font-medium', it.activo ? 'text-tinta' : 'text-texto-3')}>{it.texto}</span>
                  </Enl>
                </li>
              ))}
              {menuEnBarra && (
                <li>
                  <button
                    type="button"
                    onClick={() => setCajon(true)}
                    aria-expanded={cajon}
                    className="flex min-h-11 min-w-16 flex-col items-center gap-1 rounded-control focus-visible:outline-2 focus-visible:outline-acento/45"
                  >
                    <IconoInferior icono={ListIcon} />
                    <span className="text-xs font-medium text-texto-3">Menú</span>
                  </button>
                </li>
              )}
            </ul>
          </nav>
        ) : null}

        <Cajon abierto={cajon} onCerrar={() => setCajon(false)} ctx={ctx}>
          {barraLateral}
        </Cajon>
      </div>
    </Contexto.Provider>
  )
}

function IconoInferior({ icono: I, activo, aviso }: { icono: Icon; activo?: boolean; aviso?: boolean }) {
  return (
    <span
      className={cn(
        'relative grid h-8 w-12 place-items-center rounded-full transition-colors duration-200',
        activo ? 'bg-acento-suave text-acento in-data-[tema=oscuro]:bg-acento/20' : 'text-texto-3 group-hover:text-tinta',
      )}
    >
      <I size={20} weight={activo ? 'fill' : 'regular'} />
      {aviso && <i className="absolute top-1 right-3 size-[7px] rounded-full bg-rojo-texto ring-2 ring-superficie" />}
    </span>
  )
}

function PildoraAccion({ a, enlace: Enl, conBarra }: { a: AccionMovil; enlace: Enlace; conBarra: boolean }) {
  const I = a.icono
  const clase = cn(
    'fixed inset-x-4 z-40 flex h-[52px] items-center justify-center gap-2 rounded-full md:hidden',
    'bg-tinta font-medium text-superficie shadow-principal active:scale-[.98] transition-transform duration-150',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento/45',
    EASE,
    conBarra ? 'bottom-[calc(80px+env(safe-area-inset-bottom))]' : 'bottom-[calc(16px+env(safe-area-inset-bottom))]',
  )
  const cont = (
    <>
      {I && <I size={18} weight="bold" />}
      {a.texto}
    </>
  )
  return a.href ? (
    <Enl href={a.href} className={clase}>
      {cont}
    </Enl>
  ) : (
    <button type="button" onClick={a.onClick} className={clase}>
      {cont}
    </button>
  )
}

/** Cajón del celular con el menú completo. Esc cierra; el foco vuelve al botón "Menú". */
function Cajon({ abierto, onCerrar, ctx, children }: { abierto: boolean; onCerrar: () => void; ctx: ContextoMarco; children: ReactNode }) {
  const [montado, setMontado] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const previo = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (abierto) {
      previo.current = document.activeElement as HTMLElement | null
      setMontado(true)
      const r = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
      return () => cancelAnimationFrame(r)
    }
    setVisible(false)
    const t = setTimeout(() => setMontado(false), 280)
    previo.current?.focus?.()
    return () => clearTimeout(t)
  }, [abierto])

  useEffect(() => {
    if (!visible) return
    ref.current?.querySelector<HTMLElement>('a[href],button')?.focus()
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && onCerrar()
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [visible, onCerrar])

  const ctxCajon = useMemo<ContextoMarco>(() => ({ ...ctx, colapsada: false, enCajon: true, cerrarCajon: onCerrar }), [ctx, onCerrar])

  if (!montado) return null
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        onClick={onCerrar}
        className={cn('absolute inset-0 bg-[rgb(10_10_12/.35)] backdrop-blur-[2px] transition-opacity duration-300', visible ? 'opacity-100' : 'opacity-0')}
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        className={cn(
          'absolute inset-y-2 left-2 flex w-[min(86vw,320px)] flex-col overflow-y-auto rounded-tarjeta border border-borde bg-panel px-1.5 py-2 shadow-flotante',
          'transition-transform duration-300 motion-reduce:transition-none',
          EASE,
          visible ? 'translate-x-0' : '-translate-x-[calc(100%+16px)]',
        )}
      >
        {/* El botón de cerrar lo dibuja BarraLateral (en el lugar del de colapsar). */}
        <Contexto.Provider value={ctxCajon}>{children}</Contexto.Provider>
      </div>
    </div>
  )
}

/** Contenido del panel con el padding y el ritmo vertical estándar (24 arriba y 28 a los costados; 16 en celular; bloques a 28). */
export function Contenido({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col gap-7 px-4 pt-4 pb-6 md:px-7 md:pt-6', className)}>{children}</div>
}
