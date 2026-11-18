/**
 * Ilustracion: los dibujos de ilustraciones/ pegados en línea, nunca como <img>, para que tomen
 * el trazo de `color`, el acento de --ilus-acento y el papel de --ilus-papel (cambian con el tema).
 *
 *   <Ilustracion nombre="sin-clientes" tamano="pagina" />   // 176 px: página o tarjeta grande
 *   <Ilustracion nombre="sin-reuniones" tamano="hoja" />    // 112 px: hoja lateral o bloque
 *   <Ilustracion nombre="sin-tareas" tamano="fila" />       // 64 px: fila o aviso
 *
 * `aparece` la hace entrar con resorte (éxito, "al día"). Es decorativa: aria-hidden siempre,
 * el sentido lo da el título que la acompaña.
 */
import { useId, useMemo, type CSSProperties } from 'react'
import { ILUSTRACIONES, type NombreIlustracion } from './ilustraciones'

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

const TAMANOS = { pagina: 176, hoja: 112, fila: 64 } as const
export type TamanoIlustracion = keyof typeof TAMANOS | number

export type IlustracionProps = {
  nombre: NombreIlustracion
  tamano?: TamanoIlustracion
  /** Entra con resorte (escala .92 → 1 en 320 ms). Para éxito y "al día". */
  aparece?: boolean
  className?: string
}

/** Estilos de las ilustraciones: tokens de color y las animaciones que traen algunos dibujos. */
export function EstiloIlustraciones() {
  return (
    <style href="ds-ilustraciones" precedence="ds">{`
:root{--ilus-acento:var(--acento,#4f46e5);--ilus-trazo:color-mix(in oklch,var(--acento,#4f46e5) 30%,var(--color-texto-3));--ilus-papel:var(--color-superficie);--ilus-clima:color-mix(in oklch,var(--acento,#4f46e5) 7%,transparent)}
[data-tema='oscuro']{--ilus-acento:color-mix(in oklch,var(--acento,#4f46e5) 62%,white);--ilus-trazo:color-mix(in oklch,var(--acento,#4f46e5) 28%,#6b6b75);--ilus-clima:color-mix(in oklch,var(--acento,#4f46e5) 12%,transparent)}
.ds-ilus{color:var(--ilus-trazo);display:block;flex:none}
.ds-ilus svg{display:block;width:100%;height:auto;overflow:visible}
.ds-ilus .ilus-gira{transform-box:view-box;transform-origin:100px 76px;animation:ds-ilus-gira 9s linear infinite}
.ds-ilus .ilus-cae{animation:ds-ilus-cae 1.1s linear infinite}
.ds-ilus .ilus-haz{animation:ds-ilus-haz 2.8s cubic-bezier(.23,1,.32,1) infinite alternate}
.ds-ilus.ds-aparece svg{animation:ds-ilus-pop 320ms cubic-bezier(.34,1.56,.64,1) both}
@keyframes ds-ilus-gira{to{transform:rotate(360deg)}}
@keyframes ds-ilus-cae{to{stroke-dashoffset:-8.8}}
@keyframes ds-ilus-haz{from{opacity:.35}to{opacity:1}}
@keyframes ds-ilus-pop{from{opacity:0;transform:scale(.92)}}
@media (prefers-reduced-motion:reduce){.ds-ilus *{animation:none!important}}
`}</style>
  )
}

export function Ilustracion({ nombre, tamano = 'hoja', aparece, className }: IlustracionProps) {
  const id = useId().replace(/[^a-zA-Z0-9-]/g, '')
  // Cada instancia con sus propios ids de patrón (si no, dos rayados en la misma página se pisan).
  const html = useMemo(() => ILUSTRACIONES[nombre].replace(/(id="|url\(#)(ray-[\w-]+)/g, `$1$2-${id}`), [nombre, id])
  const ancho = typeof tamano === 'number' ? tamano : TAMANOS[tamano]
  const estilo: CSSProperties = { width: ancho }
  return (
    <>
      <EstiloIlustraciones />
      <span
        aria-hidden
        className={cn('ds-ilus', aparece && 'ds-aparece', className)}
        style={estilo}
        // Contenido propio y fijo (ilustraciones.ts), no viene de la persona.
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  )
}

/** Fondo de clima detrás de la ilustración: acento al 7 % (12 % en oscuro), verde si es éxito, rojo si es error. */
export const CLIMA = {
  neutro: 'bg-[radial-gradient(70%_55%_at_50%_28%,var(--ilus-clima),transparent_70%)]',
  bueno: 'bg-[radial-gradient(70%_55%_at_50%_28%,color-mix(in_oklch,var(--color-verde-texto)_9%,transparent),transparent_70%)]',
  malo: 'bg-[radial-gradient(70%_55%_at_50%_28%,color-mix(in_oklch,var(--color-rojo-texto)_8%,transparent),transparent_70%)]',
} as const
