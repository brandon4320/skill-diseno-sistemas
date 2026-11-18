'use client'
/**
 * AltaConIndice: alta larga (más de 12 campos) partida en secciones con índice pegajoso que
 * dice el estado de cada una. Patrones 3.11, 5.11 y 12.5 · ejemplos/biblioteca/12-flujos.html#alta-larga-con-indice
 *
 * - Índice de 220 px a la izquierda; en celular pasa a tira horizontal pegajosa de chips de 44 px.
 * - Cada sección es una bandeja (fondo bandeja, radio 16) con su estado a la derecha del título:
 *   "Completa" en gris (sin pastilla), "Faltan 2 datos" ámbar, "Hay un dato mal" rojo.
 * - El índice marca la sección a la vista (scroll spy) y lleva al primer campo al tocarla.
 * - Pie fijo: la causa escrita a la izquierda ("Faltan 3 datos en 2 secciones · 1 error") y el
 *   principal apagado mientras haya causa; si igual lo tocan, lleva a la primera sección con problemas.
 *
 *   <AltaConIndice
 *     secciones={[{ id: 'cliente', titulo: 'Cliente', icono: BuildingsIcon, requeridos: 4, completos: 4, errores: 0, contenido: <CamposCliente/> }, …]}
 *     principal={{ texto: 'Crear contrato', textoEspera: 'Creando…', hacer: crear }}
 *     secundario={{ texto: 'Guardar borrador', hacer: guardar }} />
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { CheckIcon, CheckCircleIcon, WarningIcon, type Icon } from '@phosphor-icons/react'
import { BotonEspera, IconoEstado, cx, FOCO, plural, type EstadoPaso } from './compartido'

export type SeccionAlta = {
  id: string
  titulo: string
  icono?: Icon
  /** Campos obligatorios de la sección y cuántos tienen dato. */
  requeridos: number
  completos: number
  /** Campos con dato inválido (CUIT, correo…). Cada campo muestra su error en el lugar. */
  errores?: number
  opcional?: boolean
  contenido: ReactNode
}

export type AltaConIndiceProps = {
  secciones: SeccionAlta[]
  principal: { texto: string; textoEspera?: string; hacer: () => void | Promise<void> }
  secundario?: { texto: string; hacer: () => void }
  /** "Borrador guardado" / "Guardando…" junto a las migas, si hay autoguardado. */
  estadoGuardado?: ReactNode
  /** Alto del área con scroll en escritorio. */
  alto?: number
}

export function estadoDe(s: SeccionAlta): EstadoPaso {
  if (s.errores) return 'error'
  if (s.opcional) return s.completos >= s.requeridos ? 'listo' : 'pendiente'
  if (s.completos >= s.requeridos) return 'listo'
  return s.completos ? 'falta' : 'pendiente'
}

export function AltaConIndice({ secciones, principal, secundario, estadoGuardado, alto = 600 }: AltaConIndiceProps) {
  const scroll = useRef<HTMLDivElement>(null)
  const refs = useRef<Record<string, HTMLElement | null>>({})
  const [actual, setActual] = useState(secciones[0]?.id)

  useEffect(() => {
    const el = scroll.current
    if (!el) return
    const ver = () => {
      let id = secciones[0]?.id
      for (const s of secciones) {
        const n = refs.current[s.id]
        if (n && n.offsetTop - el.offsetTop - el.scrollTop < 120) id = s.id
      }
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 4) id = secciones[secciones.length - 1]?.id
      setActual(id)
    }
    el.addEventListener('scroll', ver, { passive: true })
    ver()
    return () => el.removeEventListener('scroll', ver)
  }, [secciones])

  const ir = (id: string) => {
    const el = scroll.current, n = refs.current[id]
    if (!el || !n) return
    const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ top: n.offsetTop - el.offsetTop - 16, behavior: quieto ? 'auto' : 'smooth' })
    setTimeout(() => n.querySelector<HTMLElement>('input,select,textarea,button')?.focus({ preventScroll: true }), quieto ? 0 : 350)
  }

  const obligatorias = secciones.filter((s) => !s.opcional)
  const faltan = obligatorias.reduce((a, s) => a + Math.max(0, s.requeridos - s.completos), 0)
  const secFaltan = obligatorias.filter((s) => s.completos < s.requeridos).length
  const errores = secciones.reduce((a, s) => a + (s.errores ?? 0), 0)
  const listas = secciones.filter((s) => estadoDe(s) === 'listo' || (s.opcional && !s.errores)).length
  const causa = [faltan ? `${faltan === 1 ? 'Falta 1 dato' : `Faltan ${faltan} datos`} en ${plural(secFaltan, 'sección', 'secciones')}` : '', errores ? plural(errores, 'error', 'errores') : '']
    .filter(Boolean)
    .join(' · ')

  const irAlProblema = () => {
    const s = secciones.find((x) => !x.opcional && estadoDe(x) !== 'listo')
    if (s) ir(s.id)
  }

  return (
    <div className="overflow-hidden rounded-tarjeta border border-borde bg-superficie">
      <div className="grid md:h-(--alto) md:grid-cols-[220px_minmax(0,1fr)]" style={{ ['--alto' as string]: `${alto}px` }}>
        <nav aria-label="Secciones" className="sticky top-0 z-10 flex gap-1.5 overflow-x-auto border-b border-divisor bg-panel p-2 md:static md:flex-col md:gap-0.5 md:border-r md:border-b-0 md:px-2 md:py-4">
          <span className="hidden px-2 pb-2 text-xs font-medium tracking-wide text-texto-3 uppercase md:block">Secciones</span>
          {secciones.map((s, i) => {
            const e = estadoDe(s)
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={actual === s.id}
                onClick={(ev) => {
                  ev.preventDefault()
                  ir(s.id)
                }}
                className={cx(
                  'flex min-h-11 shrink-0 items-center gap-2 rounded-[10px] px-2 text-[13px] font-medium text-texto-2 hover:bg-hover hover:text-tinta md:min-h-10',
                  actual === s.id && 'bg-superficie text-tinta shadow-min ring-1 ring-borde',
                  FOCO,
                )}
              >
                <IconoEstado estado={e} numero={i + 1} />
                {s.titulo}
                <span className="ml-auto hidden font-mono text-[11px] text-texto-3 md:inline">{s.opcional ? 'opc.' : `${s.completos}/${s.requeridos}`}</span>
              </a>
            )
          })}
          <div className="mt-auto hidden flex-col gap-1.5 border-t border-divisor px-2 pt-3 text-xs text-texto-3 md:flex">
            {listas} de {secciones.length} secciones listas
            <div aria-hidden className="flex gap-[3px]">
              {secciones.map((_, i) => (
                <i key={i} className={cx('h-2 flex-1 rounded-[3px]', i < listas ? 'bg-verde-texto' : 'bg-suave')} />
              ))}
            </div>
          </div>
        </nav>
        <div className="flex min-h-0 min-w-0 flex-col">
          <div ref={scroll} className="flex max-h-[520px] flex-1 flex-col gap-8 overflow-auto p-4 md:max-h-none md:p-6">
            {secciones.map((s, i) => {
              const e = estadoDe(s)
              const Ic = s.icono
              return (
                <section
                  key={s.id}
                  id={s.id}
                  ref={(n) => {
                    refs.current[s.id] = n
                  }}
                  aria-labelledby={`${s.id}-t`}
                  className="rounded-2xl border border-divisor bg-bandeja p-2"
                >
                  <h3 id={`${s.id}-t`} className="flex items-center gap-2 px-2 pt-1.5 pb-2 font-display text-base font-medium">
                    {Ic && <Ic size={16} className="text-texto-3" aria-hidden />}
                    {s.titulo}
                    {s.opcional && <span className="font-sans text-[13px] font-normal text-texto-3">(opcional)</span>}
                    <span className="ml-auto font-sans">
                      {e === 'listo' && (
                        <span className="inline-flex items-center gap-1 text-xs font-normal text-texto-3">
                          <CheckIcon size={12} aria-hidden /> Completa
                        </span>
                      )}
                      {e === 'falta' && <span className="rounded-lg bg-ambar-fondo px-2 py-1 text-xs font-medium text-ambar-texto">{s.requeridos - s.completos === 1 ? 'Falta 1 dato' : `Faltan ${s.requeridos - s.completos} datos`}</span>}
                      {e === 'error' && <span className="rounded-lg bg-rojo-fondo px-2 py-1 text-xs font-medium text-rojo-texto">{s.errores === 1 ? 'Hay un dato mal' : `${s.errores} datos mal`}</span>}
                      {e === 'pendiente' && !s.opcional && <span className="text-xs font-normal text-texto-3">{s.requeridos} datos</span>}
                    </span>
                    <span className="sr-only">Sección {i + 1}</span>
                  </h3>
                  <div className="grid gap-5 rounded-control border border-borde bg-superficie p-4 md:grid-cols-2 md:gap-x-6 md:p-5">{s.contenido}</div>
                </section>
              )
            })}
          </div>
          <div className="flex flex-wrap items-center gap-2 border-t border-divisor bg-superficie px-4 py-3 md:flex-nowrap md:px-5">
            <span id="alta-causa" className="mr-auto flex basis-full items-center gap-1.5 text-xs text-texto-3 md:basis-auto">
              {causa ? <WarningIcon size={14} className="text-ambar-texto" aria-hidden /> : <CheckCircleIcon size={14} className="text-verde-texto" aria-hidden />}
              {causa || 'Todo listo para crear'}
            </span>
            {estadoGuardado}
            {secundario && (
              <button type="button" onClick={secundario.hacer} className={cx('h-[38px] rounded-control border border-borde bg-superficie px-3.5 text-[13px] font-medium shadow-min hover:bg-hover max-md:h-11 max-md:flex-1', FOCO)}>
                {secundario.texto}
              </button>
            )}
            <span className="max-md:flex-1 [&>button]:max-md:w-full" onClickCapture={() => causa && irAlProblema()}>
              <BotonEspera textoEspera={principal.textoEspera ?? 'Guardando…'} hacer={principal.hacer} motivoBloqueo={causa || undefined}>
                {principal.texto}
              </BotonEspera>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
