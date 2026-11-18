/*
 * Piezas de estados del lenguaje diseno-sistemas (React 19 + TS + Tailwind v4, ilustraciones SVG propias).
 * Complementan estructura/ (Esqueleto, Vacio, ErrorEnLugar) y salen de ejemplos/biblioteca/13-estados.html.
 * Requieren los tokens de `tokens.css` y `@phosphor-icons/react`.
 *
 * Server Components: Ilustracion, VacioIlustrado, ExitoGrande.
 * Cliente ('use client'): el resto (esqueletos, carga diferida, proceso largo, error, sin conexión,
 * sin permisos, confirmación, guardado automático).
 * La validación de formularios vive en campos/validacion.ts y la frescura de los datos en datos-chicos/Frescura.
 */
export * from './ilustraciones'
export * from './Ilustracion'
export * from './VacioIlustrado'
export * from './EsqueletosMas'
export * from './ContenidoAnterior'
export * from './ProcesoLargo'
export * from './NotaError'
export * from './SinConexion'
export * from './SinPermisos'
export * from './Exito'
export * from './Confirmacion'
export * from './Guardado'
