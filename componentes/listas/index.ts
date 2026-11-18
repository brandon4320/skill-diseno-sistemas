/*
 * Listas (React 19 + TS + Tailwind v4): tareas, actividad, comentarios, archivos, personas,
 * corridas, pasos, conexiones y filtros. Importa de ../base y de ../estructura/FilaAviso
 * (CentroNotificaciones): copiá esas carpetas junto con esta.
 * Galería viva: ejemplos/biblioteca/07-listas.html
 *
 * La Fila de aviso con acción y EtiquetaDia viven en estructura/FilaAviso (no se repiten acá).
 * Todas son de cliente ('use client').
 */
export { plural, CabeceraGrupo, Desvanecido, useFlip, type CabeceraGrupoProps, type DesvanecidoProps } from './_lista'
export {
  FilaTarea,
  ListaTareas,
  BloqueTareas,
  GruposUrgencia,
  CrearTareaRapida,
  BarrasPrioridad,
  CasillaTarea,
  entenderTarea,
  type Tarea,
  type PrioridadTarea,
  type FilaTareaProps,
  type ListaTareasProps,
  type BloqueTareasProps,
  type GrupoUrgencia,
  type GruposUrgenciaProps,
  type CrearTareaRapidaProps,
  type TareaEntendida,
} from './Tareas'
export {
  LineaTiempo,
  HiloComentarios,
  HistorialHechos,
  ListaPorDia,
  type EventoActividad,
  type TipoEvento,
  type LineaTiempoProps,
  type Comentario,
  type Reaccion,
  type HiloComentariosProps,
  type Hecho,
  type HistorialHechosProps,
  type DiaLista,
  type ListaPorDiaProps,
} from './Actividad'
export { CentroNotificaciones, type Aviso, type CanalEntrega, type CentroNotificacionesProps } from './CentroNotificaciones'
export { FilaArchivo, ListaArchivos, Carpetas, IconoArchivo, type Archivo, type Carpeta, type FilaArchivoProps, type ListaArchivosProps, type CarpetasProps } from './Archivos'
export { FilaPersona, FilaConexion, type Miembro, type Rol, type FilaPersonaProps, type Conexion, type FilaConexionProps } from './Personas'
export {
  RegistroCorridas,
  PasosConChecks,
  ListaEnCurso,
  type Corrida,
  type ResultadoCorrida,
  type RegistroCorridasProps,
  type Paso,
  type PasosConChecksProps,
  type ItemEnCurso,
  type ListaEnCursoProps,
} from './Procesos'
export { PestanasEstado, ListaFiltrable, type PestanaEstado, type PestanasEstadoProps, type ListaFiltrableProps } from './Filtros'
