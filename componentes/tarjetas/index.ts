// Tarjetas del lenguaje diseno-sistemas (React 19 + TypeScript + Tailwind v4).
// Usan base/ (Avatar, Boton, Pastilla, Interruptor, PilaAvatares). La tarjeta de entidad
// (proyecto con bloques, curva y pasos) vive en estructura/TarjetaEntidad.

export { CajaTarjeta, BarraUso, miles } from './compartido'
export { TarjetaPersona, type TarjetaPersonaProps, type TareaPersona } from './TarjetaPersona'
export { TarjetaOportunidad, type TarjetaOportunidadProps, type ResultadoOportunidad } from './TarjetaOportunidad'
export { TarjetaKanban, ColumnaKanban, type TarjetaKanbanProps, type ColumnaKanbanProps, type TareaKanban, type EtiquetaKanban } from './Kanban'
export { TarjetaProceso, type TarjetaProcesoProps, type EstadoProceso, type PasoProceso } from './TarjetaProceso'
export { TarjetaIntegracion, type TarjetaIntegracionProps, type EstadoIntegracion } from './TarjetaIntegracion'
export { TarjetaDocumento, HojaTipo, type TarjetaDocumentoProps, type TipoDocumento, type Firmante } from './TarjetaDocumento'
export { TarjetaPlanUso, type TarjetaPlanUsoProps, type ParteUso } from './TarjetaPlanUso'
export { TarjetaReunion, type TarjetaReunionProps } from './TarjetaReunion'
export { Sugerencias, TarjetaSugerencias, type SugerenciasProps, type TarjetaSugerenciasProps, type Sugerencia } from './SugerenciaDescartable'
