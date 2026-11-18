// IA y automatizaciones (React 19 + TypeScript + Tailwind v4 con tokens.css + @phosphor-icons/react).
// Galería viva: ejemplos/biblioteca/11-ia-automatizaciones.html

export { CuadroEscritura, type CuadroEscrituraProps, type ChipContexto } from './CuadroEscritura'
export {
  MensajeUsuario,
  MensajeAsistente,
  RazonamientoPlegable,
  Sugerencias,
  type MensajeAsistenteProps,
  type Valoracion,
  type PasoHerramienta,
  type RazonamientoPlegableProps,
  type Sugerencia,
} from './Conversacion'
export { TarjetaBorrador, BandejaOk, type BorradorAgente, type TarjetaBorradorProps } from './EsperandoOk'
export {
  FilaAgente,
  AgentesPorEstado,
  AgentesQueTeNecesitan,
  type Agente,
  type EstadoAgente,
  type FilaAgenteProps,
  type PedidoAgente,
} from './Agentes'
export {
  ReglasOracion,
  ProgramacionDosLineas,
  type ReglasOracionProps,
  type Condicion,
  type CampoRegla,
  type OpcionRegla,
  type Operador,
} from './ReglasOracion'
export { TrazaCascada, type TrazaCascadaProps, type TramoTraza } from './TrazaCascada'
export {
  TablaAutomatizaciones,
  Corridas14,
  type TablaAutomatizacionesProps,
  type Automatizacion,
  type DiaCorrida,
} from './TablaAutomatizaciones'
