'use client'
/**
 * Toast + useToast: el éxito se cuenta abajo a la derecha, con qué pasó, el ID,
 * la consecuencia y Deshacer. Va oscuro sobre claro y gris carbón sobre oscuro.
 *
 *   <ToastProvider>{app}</ToastProvider>
 *   const toast = useToast()
 *   toast.exito('Descuento aprobado · PR-0241', {
 *     detalle: 'Lucía ya puede enviar la propuesta',
 *     deshacer: () => desaprobar('PR-0241'),
 *   })
 *
 * Reglas: dura 5 s (8 s si tiene Deshacer), se pausa al pasar el mouse o con foco,
 * máximo 3 a la vista, y en celular sube por encima de la barra inferior.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { CheckIcon, InfoIcon, WarningCircleIcon, XIcon, type Icon } from '@phosphor-icons/react'

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')
const EASE = 'ease-(--ease)'

export type TonoToast = 'exito' | 'error' | 'info'

export type ToastEntrada = {
  /** Qué pasó, con el ID y el monto si hay: "Factura FAC-01101 cobrada · US$ 18.400". */
  titulo: string
  /** La consecuencia: "Quedó en Cobranzas". */
  detalle?: string
  tono?: TonoToast
  /** Si está, aparece "Deshacer". Si falla, el toast lo dice. */
  deshacer?: () => void | Promise<void>
  /** Una acción extra que no sea deshacer ("Ver", "Abrir"). */
  accion?: { texto: string; hacer: () => void }
  /** En ms. Por defecto 5000, u 8000 si hay Deshacer. */
  duracion?: number
}

type ToastVivo = ToastEntrada & { id: number; version: number }

export type ApiToast = {
  mostrar: (t: ToastEntrada) => number
  exito: (titulo: string, o?: Omit<ToastEntrada, 'titulo' | 'tono'>) => number
  error: (titulo: string, o?: Omit<ToastEntrada, 'titulo' | 'tono'>) => number
  info: (titulo: string, o?: Omit<ToastEntrada, 'titulo' | 'tono'>) => number
  cerrar: (id: number) => void
}

const ContextoToast = createContext<ApiToast | null>(null)

/** Para usar adentro de <ToastProvider>. Tira error si falta, así no se pierde un éxito. */
export function useToast(): ApiToast {
  const api = useContext(ContextoToast)
  if (!api) throw new Error('useToast() necesita <ToastProvider> más arriba en el árbol.')
  return api
}

/** Igual que useToast pero devuelve null si no hay proveedor (para piezas reutilizables). */
export function useToastOpcional(): ApiToast | null {
  return useContext(ContextoToast)
}

const TONO: Record<TonoToast, { icono: Icon; caja: string }> = {
  exito: { icono: CheckIcon, caja: 'bg-[rgb(31_157_92/.22)] text-[#4ade80]' },
  error: { icono: WarningCircleIcon, caja: 'bg-[rgb(217_63_63/.22)] text-[#f87171]' },
  info: { icono: InfoIcon, caja: 'bg-white/10 text-white/80' },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [lista, setLista] = useState<ToastVivo[]>([])
  const [listo, setListo] = useState(false)
  const sig = useRef(1)

  useEffect(() => setListo(true), [])

  const cerrar = useCallback((id: number) => setLista((l) => l.filter((t) => t.id !== id)), [])

  const mostrar = useCallback((t: ToastEntrada) => {
    const id = sig.current++
    setLista((l) => [...l, { ...t, id, version: 0 }].slice(-3))
    return id
  }, [])

  const actualizar = useCallback((id: number, t: ToastEntrada) => {
    setLista((l) => l.map((x) => (x.id === id ? { ...t, id, version: x.version + 1 } : x)))
  }, [])

  const api = useMemo<ApiToast>(
    () => ({
      mostrar,
      cerrar,
      exito: (titulo, o) => mostrar({ ...o, titulo, tono: 'exito' }),
      error: (titulo, o) => mostrar({ ...o, titulo, tono: 'error' }),
      info: (titulo, o) => mostrar({ ...o, titulo, tono: 'info' }),
    }),
    [mostrar, cerrar],
  )

  return (
    <ContextoToast.Provider value={api}>
      {children}
      {listo &&
        createPortal(
          <section
            aria-label="Avisos"
            className={cn(
              'pointer-events-none fixed z-[70] flex flex-col items-stretch gap-2',
              // En celular, arriba de la barra inferior y la píldora de acción (MarcoApp fija --ds-pie-movil).
              'inset-x-4 bottom-[calc(var(--ds-pie-movil,0px)+16px+env(safe-area-inset-bottom))]',
              'md:inset-x-auto md:right-6 md:bottom-6 md:w-[400px]',
            )}
          >
            <EstiloToast />
            {lista.map((t) => (
              <TarjetaToast
                key={`${t.id}-${t.version}`}
                t={t}
                onCerrar={() => cerrar(t.id)}
                onReemplazar={(n) => actualizar(t.id, n)}
              />
            ))}
          </section>,
          document.body,
        )}
    </ContextoToast.Provider>
  )
}

function TarjetaToast({
  t,
  onCerrar,
  onReemplazar,
}: {
  t: ToastVivo
  onCerrar: () => void
  onReemplazar: (n: ToastEntrada) => void
}) {
  const duracion = t.duracion ?? (t.deshacer ? 8000 : 5000)
  const [dentro, setDentro] = useState(false)
  const [saliendo, setSaliendo] = useState(false)
  const [pausado, setPausado] = useState(false)
  const [deshaciendo, setDeshaciendo] = useState(false)
  const restante = useRef(duracion)
  const inicio = useRef(0)
  const reloj = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const salir = useCallback(() => {
    setSaliendo(true)
    setTimeout(onCerrar, 200)
  }, [onCerrar])

  // Entrada en el próximo cuadro para que la transición corra.
  useEffect(() => {
    const r = requestAnimationFrame(() => setDentro(true))
    return () => cancelAnimationFrame(r)
  }, [])

  // Cuenta regresiva que se pausa con el mouse, el foco o la pestaña oculta.
  useEffect(() => {
    const oculto = typeof document !== 'undefined' && document.visibilityState === 'hidden'
    if (pausado || oculto || deshaciendo) return
    inicio.current = Date.now()
    reloj.current = setTimeout(salir, restante.current)
    return () => {
      clearTimeout(reloj.current)
      restante.current = Math.max(600, restante.current - (Date.now() - inicio.current))
    }
  }, [pausado, deshaciendo, salir])

  useEffect(() => {
    const vis = () => setPausado(document.visibilityState === 'hidden')
    document.addEventListener('visibilitychange', vis)
    return () => document.removeEventListener('visibilitychange', vis)
  }, [])

  async function deshacer() {
    if (!t.deshacer) return
    setDeshaciendo(true)
    try {
      await t.deshacer()
      onReemplazar({ titulo: 'Listo, se deshizo', detalle: t.titulo, tono: 'info', duracion: 2600 })
    } catch {
      onReemplazar({ titulo: 'No se pudo deshacer', detalle: 'Quedó como estaba. Probá desde la ficha.', tono: 'error' })
    }
  }

  const { icono: Icono, caja } = TONO[t.tono ?? 'exito']

  return (
    <div
      role={t.tono === 'error' ? 'alert' : 'status'}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
      onKeyDown={(e) => e.key === 'Escape' && salir()}
      className={cn(
        'pointer-events-auto relative flex items-center gap-3 overflow-hidden rounded-interno py-3 pr-3 pl-4',
        'bg-[#16181d] text-white shadow-flotante in-data-[tema=oscuro]:bg-[#26262b] in-data-[tema=oscuro]:ring-1 in-data-[tema=oscuro]:ring-white/10',
        'transition-[transform,opacity] duration-300 motion-reduce:transition-none',
        EASE,
        dentro && !saliendo ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-[.98] opacity-0',
      )}
    >
      <span className={cn('grid size-[30px] shrink-0 place-items-center rounded-[10px]', caja)}>
        <Icono size={16} weight="bold" />
      </span>
      <div className="min-w-0 flex-1">
        <b className="block truncate text-[13px] font-medium">{t.titulo}</b>
        {t.detalle && <small className="block truncate text-xs text-white/60">{t.detalle}</small>}
      </div>
      {t.accion && (
        <button
          type="button"
          onClick={() => {
            t.accion?.hacer()
            salir()
          }}
          className="h-8 shrink-0 rounded-chip px-3 text-[13px] font-medium text-white/85 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white/50"
        >
          {t.accion.texto}
        </button>
      )}
      {t.deshacer && (
        <button
          type="button"
          onClick={deshacer}
          disabled={deshaciendo}
          className="h-8 shrink-0 rounded-chip px-3 text-[13px] font-medium text-[color-mix(in_oklch,var(--color-acento)_35%,white)] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white/50 disabled:opacity-60"
        >
          {deshaciendo ? 'Deshaciendo…' : 'Deshacer'}
        </button>
      )}
      <button
        type="button"
        onClick={salir}
        aria-label="Cerrar aviso"
        className="grid size-8 shrink-0 place-items-center rounded-chip text-white/50 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white/50"
      >
        <XIcon size={14} />
      </button>
      {/* Hilo que se consume: se ve cuánto queda, se frena con la pausa. */}
      <span
        aria-hidden
        className="ds-toast-hilo absolute inset-x-0 bottom-0 h-[2px] origin-left bg-white/25"
        style={{ animationDuration: `${duracion}ms`, animationPlayState: pausado || deshaciendo ? 'paused' : 'running' }}
      />
    </div>
  )
}

/** React 19 deduplica y sube este <style> al <head> (href + precedence). */
function EstiloToast() {
  return (
    <style href="ds-toast" precedence="ds">{`
@keyframes ds-toast-hilo{from{transform:scaleX(1)}to{transform:scaleX(0)}}
.ds-toast-hilo{animation-name:ds-toast-hilo;animation-timing-function:linear;animation-fill-mode:forwards}
@media (prefers-reduced-motion:reduce){.ds-toast-hilo{display:none}}
`}</style>
  )
}
