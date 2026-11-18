// Botones y acciones de diseno-sistemas (React 19 + TypeScript + Tailwind v4).
// Lo básico (principal, secundario, texto, chico, solo ícono, cargando con ancho fijo, atajo) ya está en
// base/Boton; el segmentado en base/Segmentado; el menú ⋯ en base/Menu. Acá van las piezas que faltaban.
// Vivas en ejemplos/biblioteca/02-botones.html.

export { BotonAccion, type BotonAccionProps } from './BotonAccion'
export { BotonDividido, type BotonDivididoProps } from './BotonDividido'
export { GrupoBotones, BotonDeGrupo, GrupoOpciones, type BotonDeGrupoProps, type OpcionGrupo } from './GrupoBotones'
export { BotonConmutable, type BotonConmutableProps } from './BotonConmutable'
export { BotonConContador, type BotonConContadorProps } from './BotonConContador'
export { BotonConCausa, type BotonConCausaProps } from './BotonConCausa'
export { BotonPeligro, ConfirmarIrreversible, type ConfirmarIrreversibleProps } from './ConfirmarIrreversible'
export { AccionesFila, FilaConAcciones } from './AccionesFila'
export { EjecutarFila, type EjecutarFilaProps } from './EjecutarFila'
export { AgregarAlFinal, type AgregarAlFinalProps } from './AgregarAlFinal'
export { AccionesComunicacion, type AccionesComunicacionProps, type Contacto } from './AccionesComunicacion'
export { BotonFlotante, type BotonFlotanteProps, type OpcionFlotante } from './BotonFlotante'
export { PildoraMovil, type PildoraMovilProps } from './PildoraMovil'
export { Pestanas, type PestanasProps, type Pestana } from './Pestanas'
export { Tecla, useAtajo, useTeclaMod } from './Atajo'
