/*
 * Datos chicos (React 19 + TS + Tailwind v4): lo que va dentro de una celda, una fila o el pie
 * de una tarjeta. Completa a base/ y datos/: Pastilla, Etiqueta, Avatar, PilaAvatares, Tooltip,
 * Variacion, Anillo, Bloques, Rayitas y Curva (sparkline) ya están allá y no se repiten.
 * Importa de ../base/utilidades y ../datos/formato: copiá las tres carpetas juntas.
 * Galería viva: ejemplos/biblioteca/04-datos-chicos.html
 *
 * Server Components: Prioridad, PuntoPresencia, ConPresencia, Monto, CifraUnidad, FechaRelativa,
 * Vencimiento, BarraProgreso, ContraMeta, AvanceDosBloques, UsoLimite, EstadoForma, Resuelto,
 * Fraccion, TiraPasos, CeldaResultado, Bandera, LogoEntidad, CeldaEntidad, MedioPago, Dominio,
 * Tecla, Atajo, MetaDelDia.
 * Cliente: Contador, ConInsignia, PuntoNovedad, FiltrosActivos, TooltipLinea, TooltipFicha,
 * CodigoCopiable, TituloConCodigo, Frescura, BarraComposicion, MiniBarras, NivelBloques.
 *
 * Keyframes que hay que sumar a la hoja global (Presencia `vivo` y BarraProgreso indeterminada):
 *   @keyframes latido { 0% { transform: scale(.6); opacity: .7 } 100% { transform: scale(1.6); opacity: 0 } }
 *   @keyframes indet { from { left: -32% } to { left: 100% } }
 */
export { Prioridad, Senal, NOMBRE_PRIORIDAD, type PrioridadProps, type NivelPrioridad } from './Prioridad'
export { Contador, ConInsignia, PuntoNovedad, type ContadorProps, type ConInsigniaProps, type TonoContador } from './Contador'
export { PuntoPresencia, ConPresencia, TEXTO_PRESENCIA, type PuntoPresenciaProps, type EstadoPresencia } from './Presencia'
export { FiltrosActivos, type FiltrosActivosProps, type FiltroActivo } from './FiltrosActivos'
export { TooltipLinea, TooltipFicha, type TooltipLineaProps, type TooltipFichaProps, type FilaTooltip } from './TooltipDatos'
export { Monto, CifraUnidad, abreviar, type MontoProps, type CifraUnidadProps, type MonedaAmplia } from './Monto'
export { CodigoCopiable, TituloConCodigo, type CodigoCopiableProps } from './CodigoCopiable'
export { FechaRelativa, Vencimiento, type FechaRelativaProps, type VencimientoProps } from './Fechas'
export { Frescura, type FrescuraProps } from './Frescura'
export {
  BarraProgreso,
  ContraMeta,
  AvanceDosBloques,
  UsoLimite,
  type BarraProgresoProps,
  type ContraMetaProps,
  type AvanceDosBloquesProps,
  type UsoLimiteProps,
} from './Avance'
export { BarraComposicion, MiniBarras, type BarraComposicionProps, type Parte } from './Composicion'
export {
  EstadoForma,
  FormaEstado,
  Resuelto,
  Fraccion,
  TiraPasos,
  CeldaResultado,
  type EstadoTarea,
  type CeldaResultadoProps,
  type ValorResultado,
} from './Estados'
export {
  Bandera,
  LogoEntidad,
  CeldaEntidad,
  MedioPago,
  Dominio,
  NOMBRE_PAIS,
  type Pais,
  type LogoEntidadProps,
  type TipoPago,
} from './Marcadores'
export { Tecla, Atajo, type TeclaProps, type AtajoProps } from './Atajo'
export { NivelBloques, MetaDelDia, type NivelBloquesProps } from './NivelBloques'
