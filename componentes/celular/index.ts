// Piezas de celular de diseno-sistemas (React 19 + TypeScript + Tailwind v4).
// Vivas en ejemplos/biblioteca/14-celular.html. La píldora fija y el botón flotante viven en
// botones/ y se reexportan acá para tener todo el celular en un solo import.
// HojaInferior y BuscadorCompleto usan <dialog> nativo. MontoGrande usa `@keyframes sacudir` (está en componentes/README.md).

export { BarraInferior, type BarraInferiorProps, type DestinoBarra } from './BarraInferior'
export { CabeceraSaludo, CabeceraDetalle, type CabeceraDetalleProps, type BotonCabecera } from './CabeceraCelular'
export { TarjetaAnillo, TarjetaMonto, type TarjetaAnilloProps, type TarjetaMontoProps } from './TarjetaProtagonista'
export { AccesosRapidos, type AccesoRapido } from './AccesosRapidos'
export { CarruselKpis, type KpiCarrusel } from './CarruselKpis'
export { ListaPorDia, type ListaPorDiaProps, type DiaLista, type ItemDia } from './ListaPorDia'
export { FilaDeslizable, type FilaDeslizableProps, type AccionDeslizable } from './FilaDeslizable'
export { HojaInferior, type HojaInferiorProps } from './HojaInferior'
export { HojaAcciones, type HojaAccionesProps, type AccionHoja } from './HojaAcciones'
export { SelectorDias, type SelectorDiasProps, type DiaSelector } from './SelectorDias'
export { FiltrosDeslizables, type FiltrosDeslizablesProps, type ChipFiltro } from './FiltrosDeslizables'
export { BuscadorCompleto, type BuscadorCompletoProps, type ResultadoBusqueda } from './BuscadorCompleto'
export { MontoGrande, type MontoGrandeProps } from './MontoGrande'
export { FotoConSello, BandejaFotos, type FotoCampo, type EstadoFoto } from './FotoConSello'
export { Firma, type FirmaProps } from './Firma'
export { TarjetasCel, BarraSeleccion, type TarjetasCelProps, type BarraSeleccionProps, type FilaTarjeta } from './TarjetasCel'
export { FichaSegmentada, type SeccionFicha } from './FichaSegmentada'
export { PendienteSubir, ResumenSenal, type ResumenSenalProps } from './SinSenal'
export { PildoraMovil, type PildoraMovilProps } from '../botones/PildoraMovil'
export { BotonFlotante, type BotonFlotanteProps, type OpcionFlotante } from '../botones/BotonFlotante'
