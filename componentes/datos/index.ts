/*
 * Piezas de datos del lenguaje diseno-sistemas (React 19 + TS + Tailwind v4, SVG propio).
 * Requieren los tokens de `tokens.css` (bg-suave, text-texto-3, --color-dato-*, …) y
 * `@phosphor-icons/react` (se importa desde '@phosphor-icons/react/ssr', sirve en Server Components).
 *
 * Server Components: Kpi, KpiProtagonista, Variacion, Rayitas, Bloques, Anillo, Curva.
 * Cliente ('use client'): Cuenta, BarrasApiladas.
 */
export * from './formato'
export { Cuenta } from './Cuenta'
export { Kpi } from './Kpi'
export { KpiProtagonista } from './KpiProtagonista'
export { Variacion } from './Variacion'
export { Rayitas } from './Rayitas'
export { Bloques } from './Bloques'
export { Anillo } from './Anillo'
export { Curva } from './Curva'
export { BarrasApiladas, type SerieBarra, type PuntoBarra } from './BarrasApiladas'
