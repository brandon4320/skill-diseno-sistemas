/**
 * Piezas de tablas avanzadas (06-tablas.html) para React 19 + TS + Tailwind v4 + @phosphor-icons/react.
 * La tabla base (columnas tipadas, orden, selección con barra de lote, vacío/cargando/error,
 * tarjetas en el celular) vive en ../estructura/Tabla.tsx; estas piezas se suman a ella o a
 * una <table> propia. Requieren los tokens de ../../tokens.css.
 */
export { ciclarOrden, ordenarFilas, calcular, formatoMonto, ALTO_FILA, NOMBRE_CALCULO } from './calculos'
export type { Orden, Direccion, Densidad, Calculo, ValorCelda } from './calculos'

export { SelectorDensidad, type SelectorDensidadProps } from './SelectorDensidad'
export { EncabezadoColumna, ariaSort, type EncabezadoColumnaProps } from './EncabezadoColumna'
export { FiltroFacetas, type FiltroFacetasProps, type GrupoFacetas, type OpcionFaceta, type EleccionFacetas } from './FiltroFacetas'
export { ConstructorFiltros, ChipsFiltro, OPERADORES } from './ConstructorFiltros'
export type { ConstructorFiltrosProps, ChipsFiltroProps, CampoFiltro, Condicion, Union, TipoCampo } from './ConstructorFiltros'
export { PieCalcular, type PieCalcularProps } from './PieCalcular'
export { CeldaEditable, type CeldaEditableProps, type TipoEditor } from './CeldaEditable'
export { BandaGrupo, FilaDetalle, gravedadFila, type BandaGrupoProps, type FilaDetalleProps, type Gravedad } from './FilasExtra'
export { LogoEntidad, CeldaEntidad, CeldaTitulo, CeldaMonto, EtiquetaBorde, CeldaModifico } from './CeldasRicas'
