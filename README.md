# Skill `diseno-sistemas`

Lenguaje visual y de UX para sistemas de gestión (CRM, ERP, tableros internos, portales B2B), en escritorio y celular, para usar con **Claude Code**. Sale del análisis de 20 interfaces de referencia (y 69 tweets de diseñadores) y trae reglas, tokens, piezas en React + Tailwind v4, pantallas de ejemplo, guías por tema y dos scripts: uno que revisa una pantalla y otro que frena un rediseño si toca los datos.

Sirve para dos cosas: **crear** pantallas nuevas y hacer el **overhaul** de un sistema que ya está en producción sin romper cómo lee y escribe los datos.

## Instalar

```bash
git clone <este-repo> ~/.claude/skills/diseno-sistemas
```

Reiniciá Claude Code. La skill se activa sola cuando le pedís crear, rediseñar o revisar una pantalla (tablero, tabla, pipeline, formulario, ficha, calendario, ajustes, celular…), o la llamás con `/diseno-sistemas`.

Para los scripts hace falta Node 18 o más. `revisar.mjs` además necesita Playwright (abajo). `guardia-datos.mjs` solo necesita git.

## Qué trae

| Carpeta / archivo | Para qué |
|---|---|
| `SKILL.md` | Las reglas, en un solo lugar: principios, cuándo leer qué, los dos modos (crear y overhaul), espacios y legibilidad, marco, vida, tipografía, color, superficies, piezas, textos, íconos, movimiento, accesibilidad, antipatrones y la lista para antes de entregar. Si algo de otra carpeta lo contradice, manda `SKILL.md`. |
| `tokens.css` | Variables de Tailwind v4 con nombres en español: colores, letras, radios, espacios (`--espacio-*`), sombras y modo oscuro. |
| `guias/` | Un tema por archivo, con valores y antes/después: `jerarquia-y-espacios.md` (la más importante), `textos.md`, `iconos.md`, `graficos.md`, `movimiento.md`, `documentos.md`, `rediseno.md` (pasar una pantalla vieja al lenguaje), `overhaul.md` y `overhaul-ejemplo.md` (remodelar un sistema en producción sin tocar los datos). |
| `ejemplos/` | HTML autocontenidos que se abren en el navegador: `tablero-crm.html`, `componentes.html` (galería de piezas), `antes-despues.html`, `graficos.html`, `iconos.html`, `ilustraciones.html`, `movimiento.html`; en `pantallas/` una por tipo (lista, vistas de datos, pipeline, ficha, formulario, ajustes, calendario, login, celular); en `documentos/` factura, presupuesto, informe y correo; en `biblioteca/` la biblioteca completa (abajo). Más `recetas-tailwind.md`. Todos usan una marca inventada. |
| `componentes/` | Piezas en React 19 + TypeScript + Tailwind v4, listas para copiar, en 17 carpetas: `base/` (botón, campo, segmentado, pastilla, menú, avatar…), `datos/` (KPI, protagonista, curva, barras apiladas, anillo, formato de números y fechas), `estructura/` (marco, barra lateral, cabecera, tabla, hoja lateral, toast, vacío, esqueleto, error en el lugar) y una por categoría de la biblioteca (`navegacion/`, `botones/`, `campos/`, `datos-chicos/`, `kpis/`, `tablas/`, `listas/`, `tarjetas/`, `capas/`, `tiempo/`, `ia-automatizaciones/`, `flujos/`, `estados/`, `celular/`). Índice y dependencias en `componentes/README.md`. |
| `ilustraciones/` | 12 SVG de línea para vacíos, error, bienvenida, éxito y procesos largos. Toman el color del sistema por variables CSS: pegalos en línea, no como `<img>`. |
| `scripts/` | `revisar.mjs` y `guardia-datos.mjs` (abajo). Detalle completo en `scripts/README.md`. |
| `referencias/` | Las 20 capturas de referencia (lista abajo). Son de sus autores y van solo como material de estudio, no para copiar. |
| `analisis/` | El análisis de cada tema de las referencias, con valores estimados: `01`–`15` por tema, `16-espacio-y-pantalla.md` (spacing medido y cómo llenan la pantalla), `17-claro-oscuro.md` (la misma pantalla en claro y oscuro, elemento por elemento) y `18-tweets-66-69.md`; en `tweets/` los 65 tweets anteriores. |

### Referencias

| # | Archivo | Qué muestra | Para qué se mira |
|---|---|---|---|
| 01 | `01-axon-notificaciones.jpg` | Centro de avisos | Listas de 2 líneas, acción en la fila |
| 02–05 | `02-closecrm-*.jpg` … `05-…` | Reuniones, contacto y ajustes de un CRM | Calendario, ficha, ajustes en dos niveles |
| 06 | `06-gr8r-home.jpg` | Inicio con tarjetas de proyecto | Vida, tarjetas de entidad, bandeja con tarjeta |
| 07 | `07-loops-ingresos.jpg` | Ingresos con tabla y gráfico | KPIs, tabla de pagos, estados |
| 08 | `08-finora-gastos.jpg` | Gastos con protagonista | Protagonista de acento, cuadros de ícono |
| 09, 11, 12 | `09-movil-tareas.jpg`, `11-…`, `12-…` | Celular | Cifra protagonista, accesos, píldora fija |
| 10 | `10-escuela-agenda.jpg` | Agenda | Bloques por duración |
| 13 | `13-tessera-dashboard.jpg` | Tablero | Grilla de KPIs con anillos |
| 14 | `14-solexa-oscuro.jpg` | Monitoreo en oscuro | Capas por luminosidad |
| 15 | `15-orbitly-chat.jpg` | Chat en 3 columnas con panel de información | Columna fluida + paneles fijos, compositor abajo |
| 16 | `16-loops-reporte.jpg` | Reporte con vista previa A4 y panel Compartir | Vista previa + panel fijo de 340 con la acción principal |
| 17 | `17-brick-timeline.jpg` | Cronograma de obras con "Needs attention" y "Starts today" arriba | Lo urgente arriba con su arreglo; días que llenan el ancho |
| 18 | `18-brick-timeline-2.jpg` | El mismo cronograma, segunda versión | Tarjeta de proyecto con resumen fijo; desplazamiento de escritorio con aviso |
| 19 | `19-halo-roadmap.jpg` | Roadmap con Gantt, anillos, carga del equipo e hitos | Grilla que hereda columnas, Gantt denso, carga contra el límite |
| 20 | `20-saffron-claro-oscuro.jpg` | Hoja de cuadros de un video: el mismo tablero denso en claro y oscuro con un deslizador | Spacing real a 1440 y mapeo claro → oscuro |

## Biblioteca de piezas: `ejemplos/biblioteca/`

299 piezas vivas en 14 categorías (navegación, botones, campos, datos chicos, KPIs, tablas, listas, tarjetas, capas, tiempo, IA y automatizaciones, flujos, estados y celular), cada una con su regla, su sección de `SKILL.md` y el botón "Ver código". La portada (`index.html`) tiene un buscador (`/` o ⌘K) que lleva directo a la lámina. La versión React de cada categoría está en la carpeta del mismo nombre en `componentes/`.

Las páginas cargan `base.css` y `base.js`, así que abrilas con un servidor local, no con doble clic:

```sh
cd ~/.claude/skills/diseno-sistemas/ejemplos && python3 -m http.server
# y abrí http://localhost:8000/biblioteca/
```

## Ajustarla a tu marca

- Cambiá `--acento` y el tinte de los neutros en `tokens.css` (receta en OKLCH en el comentario de arriba). El resto vale igual para cualquier marca.
- Si manejás varias marcas, creá `marcas.local.md` en la carpeta de la skill con el acento, el tinte y las reglas propias de cada una. La skill lo lee primero. Está en `.gitignore`: no se comparte.

## Revisar una pantalla: `scripts/revisar.mjs`

Abre la pantalla en Chromium, mide los estilos y devuelve una nota de 0 a 100 con cada problema, su selector y la sugerencia: un solo botón relleno, dos voces tipográficas, radios y tamaños en la escala, contraste AA, toques de 44 px, estado solo con color, cifras tabulares, nombres accesibles, desborde a 390 px, **componentes que se deslizan de costado en el celular** (salvo carruseles con encastre o `data-carrusel`), contenido cortado en el borde, errores de consola y, con `--oscuro`, blanco puro sobre negro, colores de estado sin versión oscura y sombras como única separación.

Instalá Playwright una vez, fuera de la carpeta de la skill:

```sh
mkdir -p /tmp/pw && cd /tmp/pw && npm init -y && npm i playwright && npx playwright install chromium
```

Y corrélo así:

```sh
export PLAYWRIGHT_DIR=/tmp/pw/node_modules/playwright
node ~/.claude/skills/diseno-sistemas/scripts/revisar.mjs http://localhost:3000/cobranzas   # 1440 + pasada a 390
node ~/.claude/skills/diseno-sistemas/scripts/revisar.mjs pantalla.html --celular            # pasada principal a 390
node ~/.claude/skills/diseno-sistemas/scripts/revisar.mjs pantalla.html --oscuro             # tema oscuro
node ~/.claude/skills/diseno-sistemas/scripts/revisar.mjs pantalla.html --json --minimo 85   # sale con 1 si queda debajo
```

85 o más en 1440, 390 y oscuro: lista para comparar a ojo contra las referencias. Entre 65 y 84: corregir. Menos de 65: rehacer. El revisor mide reglas, no el gusto: no sabe si la pantalla tiene vida ni si se ve tan bien como las referencias.

## Overhaul sin romper datos: `scripts/guardia-datos.mjs`

Para remodelar un sistema en producción. Se corre parado en el repo del sistema y compara la base contra tu rama (incluidos los cambios sin commit). Saca de cada archivo tocado sus **firmas de datos** (llamadas a la API y su cuerpo, query keys, hooks de datos, server actions, consultas, `name` de campos, validación, rutas y parámetros, tipos exportados, permisos, `data-testid` y analítica) y frena si alguna cambió o desapareció. Si solo se mudó de archivo, pasa.

```sh
node ~/.claude/skills/diseno-sistemas/scripts/guardia-datos.mjs                     # contra main, desde donde salió tu rama
node ~/.claude/skills/diseno-sistemas/scripts/guardia-datos.mjs --solo app/cobranzas # solo una carpeta
node ~/.claude/skills/diseno-sistemas/scripts/guardia-datos.mjs --base main --hasta HEAD --json   # en CI
```

Sale con 0 si pasa, 1 si cambió una firma, 2 si hay un error de uso o de git. Un cambio aprobado a propósito va en `.guardia-datos-permitir` en la raíz del repo, con el motivo y quién lo aprobó. No ve condiciones nuevas que no sean de permiso ni cambios del servidor: va junto con el typecheck, las pruebas y la lista de comportamiento de `guias/overhaul.md`.

## Cómo pedirle cosas

- "Armá la pantalla de cobranzas con esta skill" → modo crear: parte del ejemplo más parecido y termina con el revisor.
- "Hacele un overhaul a este sistema sin tocar los datos" → modo overhaul: relevamiento, tokens con alias, marco y pantalla por pantalla con la guardia en cada commit.
- "Revisá esta pantalla con diseno-sistemas" → revisor + lista de `SKILL.md` §8.
