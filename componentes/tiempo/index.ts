/*
 * Calendario y tiempo (React 19 + TS + Tailwind v4): semana con la línea de ahora, evento con
 * tinte y borde, crear en la celda, vista día (VistaSemana con un solo día), mes con píldoras,
 * mini mes, fecha con atajos, agenda en lista, Gantt liviano, línea de tiempo, selector de días
 * de celular, chip de hora, cuenta regresiva, próxima reunión y reprogramar con huecos libres.
 * Importa de ../base/utilidades: copiá base/ junto con esta carpeta.
 * Galería viva: ejemplos/biblioteca/10-tiempo.html
 *
 * Días como "AAAA-MM-DD" y horas como minutos: "hoy" y "ahora" llegan del server (todayAR).
 * Server Component: LineaTiempo. El resto es cliente.
 */
export * from './tiempo'
export { BloqueEvento, type BloqueEventoProps } from './Evento'
export { VistaSemana, LineaAhora, type VistaSemanaProps } from './Semana'
export { VistaMes, Pildora, type VistaMesProps } from './Mes'
export { MiniMes, type MiniMesProps } from './MiniMes'
export { FechaConAtajos, atajosFecha, type FechaConAtajosProps, type AtajoFecha } from './FechaAtajos'
export { AgendaLista, type AgendaListaProps } from './Agenda'
export { GanttLiviano, type GanttLivianoProps, type TareaGantt, type Hito, type EstadoTarea } from './Gantt'
export { LineaTiempo, type LineaTiempoProps, type PasoTiempo, type EstadoPaso } from './LineaTiempo'
export { SelectorDias, type SelectorDiasProps } from './SelectorDias'
export { ChipHora, CuentaRegresiva, ProximaReunion, type ChipHoraProps, type CuentaRegresivaProps, type ProximaReunionProps } from './Hora'
export { ReprogramarHuecos, type ReprogramarHuecosProps, type HuecoElegido } from './Huecos'
