/**
 * Piezas de estructura de diseno-sistemas (React 19 + TS + Tailwind v4 + @phosphor-icons/react).
 * Requisitos: los tokens de ../../tokens.css en tu CSS de Tailwind (`@import "tailwindcss"; @import "./tokens.css";`)
 * y las fuentes Geist, Geist y Geist Mono cargadas.
 */
export { MarcoApp, Contenido, useMarco } from './MarcoApp'
export type { MarcoAppProps, ItemInferior, AccionMovil, Enlace, EnlaceProps } from './MarcoApp'

export { BarraLateral, TarjetaMeta } from './BarraLateral'
export type { BarraLateralProps, GrupoMenu, ItemMenu, TarjetaMetaProps } from './BarraLateral'

export { BarraSuperior, BotonBarra, Cabecera, BotonPrincipal, BotonSecundario, saludoDelDia } from './Cabecera'
export type { CabeceraProps, Cifra, Miga } from './Cabecera'

export { Seccion, BotonChico } from './Seccion'
export type { SeccionProps } from './Seccion'

export { TarjetaEntidad, Pastilla, Bloques, Curva, Monograma, colorEntidad, PALETA_ENTIDAD, TONO_PASTILLA } from './TarjetaEntidad'
export type { TarjetaEntidadProps, PasoEntidad, Tono } from './TarjetaEntidad'

export { FilaAviso, EtiquetaDia } from './FilaAviso'
export type { FilaAvisoProps, AccionAviso, OpcionMenu } from './FilaAviso'

export { Tabla, BotonLote } from './Tabla'
export type { TablaProps, Columna, TipoColumna, Alineacion, RolMovil } from './Tabla'

export { HojaLateral } from './HojaLateral'
export type { HojaLateralProps, PieHoja } from './HojaLateral'

export { Vacio } from './Vacio'
export type { VacioProps, DibujoVacio } from './Vacio'

export { Esqueleto, EsqueletoTexto, EsqueletoKpi, EsqueletoTarjeta, EsqueletoFilas, CargaDiferida } from './Esqueleto'

export { ErrorEnLugar } from './ErrorEnLugar'
export type { ErrorEnLugarProps } from './ErrorEnLugar'

export { ToastProvider, useToast, useToastOpcional } from './Toast'
export type { ApiToast, ToastEntrada, TonoToast } from './Toast'
