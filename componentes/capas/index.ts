// Capas de diseno-sistemas (React 19 + TypeScript + Tailwind v4): lo que se abre encima de la pantalla.
// La hoja lateral y los toasts viven en estructura/ (HojaLateral, ToastProvider); el menú y el tooltip
// simples en base/ (Menu, Tooltip); la confirmación en lugar en estados/ (Confirmacion).

export { Banner, type BannerProps, type TonoBanner, type AccionBanner } from './Banner'
export { PaletaComandos, useAtajoPaleta, type PaletaComandosProps, type ItemComando, type GrupoComando } from './PaletaComandos'
export { HojaInferior, type HojaInferiorProps, type AlturaHoja } from './HojaInferior'
export { TarjetaAlPasar, type TarjetaAlPasarProps } from './TarjetaAlPasar'
export { MenuContextual, type MenuContextualProps, type ItemContextual } from './MenuContextual'
export { CambiosSinGuardar, useAvisoAlSalir, type CambiosSinGuardarProps } from './CambiosSinGuardar'
export { Compartir, type CompartirProps, type Miembro, type Permiso } from './Compartir'
