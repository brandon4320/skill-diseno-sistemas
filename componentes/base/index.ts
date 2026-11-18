// Piezas base del lenguaje diseno-sistemas (React 19 + TypeScript + Tailwind v4).
// Requieren tokens.css cargado (clases bg-superficie, text-tinta, border-borde…) y @phosphor-icons/react.

export { Boton, type BotonProps, type VarianteBoton, type TamanoBoton } from './Boton'
export { Segmentado, type SegmentadoProps, type OpcionSegmentado } from './Segmentado'
export { Pastilla, type PastillaProps } from './Pastilla'
export { Etiqueta, EtiquetaFiltro, type EtiquetaProps, type EtiquetaFiltroProps } from './Etiqueta'
export { Campo, type CampoProps } from './Campo'
export { Interruptor, type InterruptorProps } from './Interruptor'
export { Avatar, type AvatarProps, type Persona, type TamanoAvatar, type PresenciaAvatar } from './Avatar'
export { PilaAvatares, type PilaAvataresProps } from './PilaAvatares'
export { CuadroIcono, type CuadroIconoProps, type TamanoCuadro } from './CuadroIcono'
export { Menu, type MenuProps, type ItemMenu, type GrupoMenu, type PropsDisparador } from './Menu'
export { Tooltip, type TooltipProps, type LadoTooltip } from './Tooltip'
export { cx, colorDe, iniciales, TONOS, PALETA_ENTIDAD, FOCO, type Tono } from './utilidades'
