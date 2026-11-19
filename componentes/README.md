# Piezas React de diseno-sistemas

React 19 + TypeScript (strict) + Tailwind v4 + Phosphor 2.1.x. Compilan con `tsc --noEmit` en strict y `jsx: react-jsx`.

17 carpetas, 223 archivos. Cada una tiene su `index.ts`; la columna "Usa" dice qué otras carpetas hay que copiar con ella.

| Carpeta | Qué trae | Usa | Galería |
|---|---|---|---|
| `base/` | Boton, Segmentado, Pastilla, Etiqueta y EtiquetaFiltro, Campo, Interruptor, Avatar, PilaAvatares, CuadroIcono, Menu, Tooltip, utilidades (`cx`, `colorDe`, `iniciales`, `TONOS`, `PALETA_ENTIDAD`, `FOCO`) | nada | todas |
| `datos/` | Kpi, KpiProtagonista, Variacion, Rayitas, Bloques, Anillo, Curva, Cuenta, BarrasApiladas, DosMonedas (ChipMoneda, PieDosMonedas) y `formato.ts` (números y fechas es-AR) | nada | 05-kpis |
| `estructura/` | MarcoApp y Contenido, BarraLateral y TarjetaMeta, BarraSuperior y Cabecera, Seccion, TarjetaEntidad, FilaAviso y EtiquetaDia, Tabla y BotonLote, HojaLateral, Vacio, Esqueleto (Texto, Kpi, Tarjeta, Filas, CargaDiferida), ErrorEnLugar, ToastProvider y useToast | nada | 06-tablas, 13-estados |
| `navegacion/` | SelectorEmpresa, Favoritos, ItemPronto, TarjetaPlan, PuestaEnMarcha, MigasGuardado, VistasGuardadas, PestanasTrabajo, NavSuperior, Paginacion, CargarMas, AtrasAdelante | `base/` | 01-navegacion |
| `botones/` | BotonAccion, BotonDividido, GrupoBotones (BotonDeGrupo, GrupoOpciones), BotonConmutable, BotonConContador, BotonConCausa, BotonPeligro y ConfirmarIrreversible, AccionesFila y FilaConAcciones, EjecutarFila, AgregarAlFinal, AccionesComunicacion, BotonFlotante, PildoraMovil, Pestanas, Tecla, useAtajo, useTeclaMod | `base/` | 02-botones |
| `campos/` | CampoTexto, CampoMoneda, CampoNumero, CampoContrasena, Buscador, TextoLargo, Combobox, SeleccionMultiple, SelectConIcono, CampoFecha, RangoFechas, CampoHora, OpcionesChips, TarjetasOpcion, Miniaturas, ColorEntidad, RenglonParametros, Casilla y CasillasGrupo, Deslizador, CargaArchivos, CodigoUnUso; `_campo.tsx` (EnvoltorioCampo, MensajeCampo), `validacion.ts` (useValidacion, CUIT, correo, celular) y `fechas.ts` | `base/` | 03-campos |
| `datos-chicos/` | Prioridad, Contador, ConInsignia, PuntoNovedad, PuntoPresencia, FiltrosActivos, TooltipLinea, TooltipFicha, Monto, CifraUnidad, CodigoCopiable, FechaRelativa, Vencimiento, Frescura, BarraProgreso, ContraMeta, AvanceDosBloques, UsoLimite, BarraComposicion, MiniBarras, EstadoForma, Resuelto, Fraccion, TiraPasos, CeldaResultado, Bandera, LogoEntidad, CeldaEntidad, MedioPago, Dominio, Tecla, Atajo, NivelBloques, MetaDelDia | `base/`, `datos/` | 04-datos-chicos |
| `kpis/` | KpiLinea, FilaKpis, AnilloPuntos, BarraAntiguedad, MetaProyeccion, Comparativo, KpiRanking, KpiDesglose, KpiSelector, MapaCalor, CompararEntidades, KpiAtencion, KpiCargando, KpiSinDatos | `base/` | 05-kpis |
| `tablas/` | SelectorDensidad, EncabezadoColumna, FiltroFacetas, ConstructorFiltros y ChipsFiltro, PieCalcular, CeldaEditable, BandaGrupo, FilaDetalle, CeldasRicas (LogoEntidad, CeldaEntidad, CeldaTitulo, CeldaMonto, EtiquetaBorde, CeldaModifico) y `calculos.ts` (orden, densidad, totales). Se suman a `estructura/Tabla` | `base/` | 06-tablas |
| `listas/` | FilaTarea, ListaTareas, BloqueTareas, GruposUrgencia, CrearTareaRapida, LineaTiempo, HiloComentarios, HistorialHechos, ListaPorDia, CentroNotificaciones, FilaArchivo, ListaArchivos, Carpetas, FilaPersona, FilaConexion, RegistroCorridas, PasosConChecks, ListaEnCurso, PestanasEstado, ListaFiltrable; `_lista.tsx` (CabeceraGrupo, Desvanecido, useFlip) | `base/`, `estructura/` | 07-listas |
| `tarjetas/` | TarjetaPersona, TarjetaOportunidad, TarjetaKanban y ColumnaKanban, TarjetaProceso, TarjetaIntegracion, TarjetaDocumento y HojaTipo, TarjetaPlanUso, TarjetaReunion, Sugerencias y TarjetaSugerencias; `compartido.tsx` (CajaTarjeta, BarraUso, miles) | `base/` | 08-tarjetas |
| `capas/` | Banner, PaletaComandos y useAtajoPaleta, HojaInferior, TarjetaAlPasar, MenuContextual, CambiosSinGuardar y useAvisoAlSalir, Compartir | nada | 09-capas |
| `tiempo/` | VistaSemana (y vista día) con LineaAhora, BloqueEvento, VistaMes, MiniMes, FechaConAtajos, AgendaLista, GanttLiviano, LineaTiempo, SelectorDias, ChipHora, CuentaRegresiva, ProximaReunion, ReprogramarHuecos y `tiempo.ts` (días AAAA-MM-DD, minutos) | `base/` | 10-tiempo |
| `ia-automatizaciones/` | CuadroEscritura, MensajeUsuario, MensajeAsistente, RazonamientoPlegable, Sugerencias, TarjetaBorrador, BandejaOk, FilaAgente, AgentesPorEstado, AgentesQueTeNecesitan, ReglasOracion, ProgramacionDosLineas, TrazaCascada, TablaAutomatizaciones, Corridas14 | `base/` | 11-ia-automatizaciones |
| `flujos/` | AltaConIndice, ResumenLateral y BandaElegido, ItemsRepetibles, AsistenteModal, CrearTarea, InvitarEquipo, ImportarCsv (+ `leerCsv`), ListaControl, VistaPreviaLote, ResultadoLote, ResolverAmbiguedad, UsoContraLimite, CompararPlanes, PermisosExplicados; `compartido.tsx` (ChipsOpcion, TarjetasOpcion, BarraPasos, IconoEstado, BotonEspera) | `base/`, `datos/` | 12-flujos |
| `estados/` | Ilustracion y `ilustraciones.ts`, VacioIlustrado y GuiaPasos, EsqueletoLista, EsqueletoFicha, ContenidoAnterior, ProcesoLargo, PildoraProceso, ResultadoProceso, NotaError, ErrorBloqueIlustrado, ErrorKpi, AvisoConexion, DatoViejo, useConexion, useColaSinConexion, SinPermisos, CausaBloqueo, DatoOculto, ExitoGrande, ConfirmarEnLugar, BotonMantener, ConfirmarEscribiendo, useAutoguardado, EstadoGuardado, BarraCambios | `estructura/` | 13-estados |
| `celular/` | BarraInferior, CabeceraSaludo y CabeceraDetalle, TarjetaAnillo y TarjetaMonto, AccesosRapidos, CarruselKpis, ListaPorDia, FilaDeslizable, HojaInferior, HojaAcciones, SelectorDias, FiltrosDeslizables, BuscadorCompleto, MontoGrande, FotoConSello y BandejaFotos, Firma, TarjetasCel y BarraSeleccion, FichaSegmentada, PendienteSubir y ResumenSenal (+ PildoraMovil y BotonFlotante reexportados). MontoGrande usa `@keyframes sacudir` (ver abajo) | `base/`, `botones/` | 14-celular |

Las galerías viven en `ejemplos/biblioteca/` (abrir con `cd ejemplos && python3 -m http.server`, ver el README de la skill).

## 1. Dependencias

```bash
npm i @phosphor-icons/react@2.1.10
# ya tenés react@19, react-dom@19, tailwindcss@4 y, en TS, @types/react@19
```

## 2. Copiar

Copiá la carpeta que necesitás junto con las de su columna "Usa". Lo más simple es copiar todas: compilan juntas sin choques porque cada una se importa por su `index.ts`. Lo mínimo para una pantalla es `base/`, `datos/` y `estructura/`:

```bash
DS=~/.claude/skills/diseno-sistemas
mkdir -p src/components/ds
cp -R $DS/componentes/base $DS/componentes/datos $DS/componentes/estructura src/components/ds/
cp $DS/tokens.css src/app/tokens.css
```

Si el proyecto no usa `src/`, cambiá las rutas. Si `marcas.local.md` define acento o tinte para ese sistema, ajustá `tokens.css` después de copiarlo.

## 3. CSS

En la hoja global de Tailwind (por ejemplo `app/globals.css`):

```css
@import "tailwindcss";
@import "./tokens.css";

:root { --acento: #4f46e5; } /* el de la marca; sin esto queda grafito */
```

- Tailwind v4 escanea solo lo que no está en `.gitignore`. Si copiaste las piezas fuera del proyecto o en una carpeta ignorada, sumá `@source "../ruta/a/ds";`.
- Fuentes: Geist (interfaz, títulos y cifras) y Geist Mono. Con `next/font/google` (`Geist`, `Geist_Mono`), cargalas y apuntá `--font-sans` y `--font-display` a Geist y `--font-mono` a Geist Mono.
- Oscuro: `data-tema="oscuro"` en `<html>`. Nunca `dark:`.

## 4. Importar

Cada carpeta tiene su `index.ts`. Importá desde la carpeta, nunca juntes varias en un `export *`: hay nombres repetidos entre carpetas (`Sugerencias`, `ListaPorDia`, `LineaTiempo`, `SelectorDias`, `HojaInferior`, `Tecla`, `LogoEntidad`, `Miembro`…) y `estructura/` repite a propósito `Pastilla`, `Bloques`, `Curva`, `PALETA_ENTIDAD`, `Tono`, `GrupoMenu` e `ItemMenu` para poder usarse sola, y los nombres chocan.

```tsx
import { Boton, Pastilla, Segmentado } from '@/components/ds/base'
import { Kpi, Cuenta, Rayitas, formatear } from '@/components/ds/datos'
import { MarcoApp, Contenido, Tabla, Vacio, ToastProvider } from '@/components/ds/estructura'
import { PlusIcon } from '@phosphor-icons/react'

<Boton variante="principal" icono={PlusIcon}>Nueva factura</Boton>
<Kpi rotulo="Cobrado en el mes" unidad="$" valor={<Cuenta hasta={41600} />} contexto="69 % de la meta" dibujo={<Rayitas pct={69} />} />
```

- **Server Components:** Kpi, KpiProtagonista, Variacion, Rayitas, Bloques, Anillo, Curva, Pastilla, CuadroIcono, Seccion y Vacio no llevan `'use client'`. El resto sí. A un Server Component pasale formatos por nombre (`formato="montoCorto"`), no funciones.
- **Enlaces:** `MarcoApp`, `Kpi` y `KpiProtagonista` aceptan `enlace` (por ejemplo `Link` de `next/link`); el marco lo pasa a la barra lateral, la cabecera y las tarjetas de entidad. Por defecto usan `<a>`.
- **Toasts:** envolvé la app con `<ToastProvider>` y usá `useToast()`.

## 5. Probar que compilan

```bash
mkdir -p /tmp/comp-check && cd /tmp/comp-check
npm init -y >/dev/null && npm i react@19 react-dom@19 @types/react@19 @types/react-dom@19 typescript@5 @phosphor-icons/react@2.1.10
mkdir -p src && for d in ~/.claude/skills/diseno-sistemas/componentes/*/; do cp -R "${d%/}" src/; done
# tsconfig: strict, jsx react-jsx, moduleResolution Bundler, lib DOM, noUnusedLocals, noUnusedParameters
npx tsc --noEmit -p .
```

Con `noUncheckedIndexedAccess` prendido salen avisos de índices (Curva, BarrasApiladas, utilidades, Menu, Segmentado): si el proyecto lo usa, excluí la carpeta de esa regla o agregá las guardas.

## 6. Reglas que ya cumplen (SKILL.md v2)

- Colores, radios, sombras y curva solo de `tokens.css` (`text-texto-3`, `rounded-tarjeta`, `shadow-min`, `ease-(--ease)`). Los espacios usan la escala de Tailwind que coincide con `--espacio-*` (0.5 = 2, 1 = 4, 1.5 = 6, 2 = 8, 3 = 12, 4 = 16, 5 = 20, 6 = 24, 7 = 28, 10 = 40); 3.5 (14) solo en el gap entre tarjetas.
- Letra en la escala 11 / 12 / 13 / 14 / 16 / 20 / 24 / 32 / 40; 11 solo en el rótulo de grupo del menú. Pesos 300–500, sin 600 ni 700.
- Excepciones a propósito: iniciales de Avatar `xs` y `sm` (8,5 y 10 px; el nombre va en `aria-label`) y radios de 2–5 px en piezas de dibujo, casillas de 16 px y `kbd`.

## Animación de celular

`celular/MontoGrande` sacude cuando se pasa del tope. Sumá a la hoja global:

```css
@keyframes sacudir { 0%,100% { transform: translateX(0) } 25% { transform: translateX(-6px) } 75% { transform: translateX(6px) } }
```
