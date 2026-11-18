/*
 * KPIs (React 19 + TS + Tailwind v4): las piezas de ejemplos/biblioteca/05-kpis.html que no
 * están ya en datos/ (Kpi, KpiProtagonista, Rayitas, Bloques, Anillo, Curva, DosMonedas,
 * Variacion, Cuenta) ni en datos-chicos/ (BarraComposicion, AvanceDosBloques, ContraMeta).
 * Importa de ../base: copiá base/, datos/, datos-chicos/ y kpis/ juntas. Tokens de tokens.css.
 *
 * Server Components: KpiLinea, MetaProyeccion, Comparativo, KpiRanking, KpiDesglose, MapaCalor,
 * KpiAtencion, KpiCargando, KpiSinDatos.
 * Cliente: FilaKpis, AnilloPuntos, BarraAntiguedad, KpiSelector, CompararEntidades (usa Avatar).
 */
export { KpiLinea, type KpiLineaProps } from './KpiLinea'
export { FilaKpis, type FilaKpisProps, type MetricaFila } from './FilaKpis'
export { AnilloPuntos, type AnilloPuntosProps, type PorcionPuntos } from './AnilloPuntos'
export { BarraAntiguedad, type BarraAntiguedadProps, type TramoAntiguedad } from './BarraAntiguedad'
export { MetaProyeccion, type MetaProyeccionProps } from './MetaProyeccion'
export { Comparativo, type ComparativoProps } from './Comparativo'
export { KpiRanking, type KpiRankingProps, type FilaRanking } from './KpiRanking'
export { KpiDesglose, type KpiDesgloseProps, type RenglonDesglose, type MiniKpi } from './KpiDesglose'
export { KpiSelector, type KpiSelectorProps, type OpcionSelector } from './KpiSelector'
export { MapaCalor, type MapaCalorProps } from './MapaCalor'
export { CompararEntidades, type CompararEntidadesProps, type EntidadComparada } from './CompararEntidades'
export { KpiAtencion, KpiCargando, KpiSinDatos, type KpiAtencionProps, type KpiSinDatosProps } from './KpiEstados'
