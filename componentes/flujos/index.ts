/*
 * Flujos del lenguaje diseno-sistemas (React 19 + TS + Tailwind v4 con tokens.css + @phosphor-icons/react).
 * Salen de ejemplos/biblioteca/12-flujos.html. Todos son de cliente ('use client').
 *
 * Altas: AltaConIndice (larga con índice), ResumenLateral + BandaElegido, ItemsRepetibles, AsistenteModal, CrearTarea.
 * Equipo y datos: InvitarEquipo, ImportarCsv (+ leerCsv), ListaControl.
 * Acciones masivas: VistaPreviaLote, ResultadoLote. El proceso largo vive en estados/ProcesoLargo.
 * Decisiones: ResolverAmbiguedad, UsoContraLimite, CompararPlanes, PermisosExplicados.
 * Piezas chicas compartidas: ChipsOpcion, TarjetasOpcion, BarraPasos, IconoEstado, BotonEspera.
 */
export * from './compartido'
export * from './AltaConIndice'
export * from './ResumenLateral'
export * from './ItemsRepetibles'
export * from './AsistenteModal'
export * from './CrearTarea'
export * from './InvitarEquipo'
export * from './ImportarCsv'
export * from './ListaControl'
export * from './LoteYResultado'
export * from './ResolverAmbiguedad'
export * from './PlanesYUso'
export * from './PermisosExplicados'
