// Campos de formulario de diseno-sistemas (React 19 + TypeScript + Tailwind v4).
// Ejemplo vivo: ejemplos/biblioteca/03-campos.html. Requieren tokens.css y @phosphor-icons/react.
// El interruptor con explicación ya está en base/ (Interruptor con rótulo y descripcion).

export { EnvoltorioCampo, MensajeCampo, cajaCampo, describedBy, numeroAR, sinAcentos, type EstadoCampo, type Mensaje, type EnvoltorioProps } from './_campo'
export { useValidacion, reglaCuit, reglaCorreo, sugerirCorreo, normalizarCelular, digitoCuit, formatearCuit, type Regla, type UseValidacionOpciones } from './validacion'
export * from './fechas'

export { CampoTexto, ANCHOS, type CampoTextoProps, type AnchoCampo } from './CampoTexto'
export { CampoMoneda, leerMonto, type CampoMonedaProps, type Moneda } from './CampoMoneda'
export { CampoNumero, type CampoNumeroProps } from './CampoNumero'
export { CampoContrasena, REQUISITOS_BASE, type CampoContrasenaProps, type Requisito } from './CampoContrasena'
export { Buscador, type BuscadorProps } from './Buscador'
export { TextoLargo, type TextoLargoProps } from './TextoLargo'
export { Combobox, type ComboboxProps, type OpcionCombo } from './Combobox'
export { SeleccionMultiple, type SeleccionMultipleProps, type OpcionMultiple } from './SeleccionMultiple'
export { SelectConIcono, type SelectConIconoProps, type OpcionSelect } from './SelectConIcono'
export { CampoFecha, ATAJOS_FECHA, type CampoFechaProps, type AtajoFecha } from './CampoFecha'
export { RangoFechas, ATAJOS_RANGO, type RangoFechasProps, type Rango, type AtajoRango } from './RangoFechas'
export { CampoHora, type CampoHoraProps } from './CampoHora'
export {
  OpcionesChips, TarjetasOpcion, Miniaturas, ColorEntidad,
  type OpcionesChipsProps, type OpcionChip, type TarjetasOpcionProps, type OpcionTarjeta, type MiniaturasProps, type OpcionMiniatura, type ColorEntidadProps,
} from './Opciones'
export { RenglonParametros, ParametroNumero, ParametroSelect, type RenglonParametrosProps, type ParametroNumeroProps, type ParametroSelectProps } from './RenglonParametros'
export { Casilla, CasillasGrupo, type CasillaProps, type CasillasGrupoProps, type ItemCasilla } from './Casillas'
export { Deslizador, type DeslizadorProps, type MarcaDeslizador } from './Deslizador'
export { CargaArchivos, type CargaArchivosProps, type ArchivoCarga } from './CargaArchivos'
export { CodigoUnUso, type CodigoUnUsoProps } from './CodigoUnUso'
