---
name: diseno-sistemas
description: Lenguaje visual y de UX para sistemas de gestión (CRM, ERP, tableros internos, portales B2B), en escritorio y celular, con tokens, piezas React + Tailwind v4, ejemplos HTML, guías y dos scripts (revisor visual y guardia de datos). Sacado de 20 referencias analizadas por agentes (espacios medidos y claro/oscuro medido cuadro por cuadro). Usar SIEMPRE al crear, rediseñar, hacer un overhaul o revisar una pantalla de un sistema nuevo o existente (tablero, dashboard, tabla, lista, pipeline, kanban, ficha, calendario, formulario, alta, ajustes, login, hoja lateral, documento imprimible, correo o vista de celular) y al decidir colores, tipografía, espacios, radios, estados, botones, íconos, gráficos, textos o movimiento.
---

# Diseño de sistemas, versión 2

Un solo lenguaje para todos los sistemas de gestión de una empresa. **Neutro en la base, vivo en los datos**: el marco (fondos, menú, bordes, textos) es calmo y del mismo tinte; encima, los datos llevan color, forma y movimiento. Varios sistemas se sienten de la misma familia porque comparten tokens, letras, radios, estados y piezas. Por sistema cambian solo **el acento y el tinte de los neutros**.

**Principios (en este orden cuando chocan):**
1. **No romper datos ni comportamiento.** En un sistema existente, lo visual se cambia; lo que se pide, se manda y se permite, no (§0b).
2. **Una pantalla, una pregunta. Un bloque, un foco. Un texto, un trabajo.** El título y la primera fila contestan la pregunta.
3. **Fricción cero:** una acción principal por pantalla, la acción de la fila en la fila, deshacer antes que confirmar, todo botón que lleva a una lista te deja parado en la fila.
4. **Legible antes que lindo:** nada debajo de 12 px, nada debajo de 4,5:1, lo relacionado más cerca que lo distinto (§4).
5. **Vivo:** sin gráficos, sin color por entidad y sin protagonista, la pantalla se siente muerta (§1b).
6. **Sin textos de relleno:** fuera taglines, ayudas obvias y rótulos secundarios. Si hacen falta para entender, el layout está mal.

**Precedencia:** si existe `marcas.local.md` en esta carpeta, leelo primero: el acento, el tinte y las reglas de cada marca mandan sobre los valores de ejemplo. Después manda este archivo. Si una guía o un ejemplo dice otra cosa (un 15, 17 o 28 px, un corte en 860 px), corregí hacia lo que dice acá.

## Cuándo leer qué

Rutas relativas a esta carpeta; los números sueltos (`06`, `07`…) son las capturas `referencias/NN-*.jpg`. Abrí siempre el ejemplo del mismo tipo de pantalla y superalo.

| Tarea | Leé | Abrí / usá |
|---|---|---|
| Cualquier pantalla | este archivo, `guias/jerarquia-y-espacios.md` | `tokens.css`, `06`, `07`, `08`, `14` (piso de terminación) |
| Tablero / dashboard | §1, §1b, §5 KPI y Gráficos | `ejemplos/tablero-crm.html`, `componentes/datos/Kpi.tsx`, `KpiProtagonista.tsx` |
| Lista, tabla, cobranzas | §5 Listas y tablas | `ejemplos/pantallas/lista-cobranzas.html`, `componentes/estructura/Tabla.tsx`, `01`, `07` |
| Colección grande con vistas (tabla, kanban, galería) | §5 Vistas de datos | `ejemplos/pantallas/vistas-de-datos.html` |
| Pipeline / kanban | §5 Pipeline | `ejemplos/pantallas/pipeline.html` |
| Ficha de cliente o entidad | §1 Ficha | `ejemplos/pantallas/ficha-cliente.html`, `03` |
| Formulario o alta larga | §5 Formularios | `ejemplos/pantallas/formulario-alta.html`, `componentes/base/Campo.tsx`, `componentes/estructura/HojaLateral.tsx` |
| Ajustes, permisos, integraciones | §5 Ajustes | `ejemplos/pantallas/ajustes.html`, `04`, `05` |
| Calendario / agenda | §5 Calendario | `ejemplos/pantallas/calendario.html`, `02`, `10` |
| Login / acceso (entrar, invitación, código, elegir empresa, sesión vencida) | §5 Acceso, `guias/acceso.md` | `ejemplos/pantallas/login-variantes.html` (5 diseños × 7 estados), `ejemplos/pantallas/login.html` |
| Arrastre que cambia un resultado (fecha, ponderado, carga) | §1c.5, §5 Pipeline | `ejemplos/arrastre-con-impacto.html` |
| Celular | §5 Celular, §6e (nunca de costado) | `ejemplos/pantallas/celular.html`, `09`, `11`, `12` |
| Aprovechar la pantalla: anchos, paneles fijos, densidad, lo urgente arriba | §4h, `analisis/16-espacio-y-pantalla.md` | `15`–`20` |
| Cronograma, Gantt, roadmap, carga del equipo | §4h, §5 Calendario | `17`, `18`, `19` |
| Chat o conversación con panel de información | §4h | `15` |
| Reporte con vista previa y envío | §4h, §5 Documentos | `16` |
| Modo oscuro | §5 Oscuro, `analisis/17-claro-oscuro.md` | `14`, `20` (el mismo tablero en claro y oscuro), `tokens.css` |
| Gráficos | §5 Gráficos, `guias/graficos.md` | `ejemplos/graficos.html`, `componentes/datos/` |
| Dos monedas (moneda local y dólares) | §5 Dos monedas | `ejemplos/dos-monedas.html`, `componentes/datos/DosMonedas.tsx` |
| Textos de interfaz | §6 Textos, `guias/textos.md` | — |
| Íconos | §6 Íconos, `guias/iconos.md` | `ejemplos/iconos.html` |
| Vacío, error, bienvenida | §6 Ilustraciones, §6b | `ilustraciones/*.svg`, `ejemplos/ilustraciones.html`, `componentes/estructura/Vacio.tsx` |
| Movimiento | §6f, `guias/movimiento.md` | `ejemplos/movimiento.html` |
| Factura, presupuesto, informe, correo | §5 Documentos, `guias/documentos.md` | `ejemplos/documentos/` |
| Rediseñar una pantalla existente | §0b, `guias/rediseno.md` | `ejemplos/antes-despues.html` |
| Overhaul de un sistema en producción | §0b, `guias/overhaul.md`, `guias/overhaul-ejemplo.md` | `scripts/guardia-datos.mjs` |
| Código React + Tailwind v4 | §6g, `ejemplos/recetas-tailwind.md` | `componentes/base/`, `componentes/datos/`, `componentes/estructura/` |
| Revisar antes de entregar | §8, `scripts/README.md` | `scripts/revisar.mjs` |
| Patrón concreto con medidas (tabla, vista, lote, proceso, ⌘K, menú, kanban, carga del equipo, facturación, oscuro) | §1c, `guias/patrones-de-referencia.md` (Top 25 al final, tabla de lo que no se copia) | — |
| Buscar una pieza concreta (biblioteca completa por categoría) | — | `ejemplos/biblioteca/index.html`: 14 categorías, 299 piezas vivas con su regla y su código. Abrir con un servidor local porque usa `base.css` y `base.js` (`cd ejemplos && python3 -m http.server`, después `localhost:8000/biblioteca/`) |
| La misma pieza en React | `componentes/README.md` (índice por carpeta y qué carpetas copiar juntas) | `componentes/` (17 carpetas: `base/`, `datos/`, `estructura/` y una por categoría de la biblioteca) |
| Profundizar un tema | `analisis/01-estructura.md` … `18-tweets-66-69.md` | `ejemplos/componentes.html` (galería de piezas) |

## Receta rápida

1. Decidí el modo: **crear** (§0a) u **overhaul** (§0b).
2. Escribí la pregunta de la pantalla y clasificá todo en **Actuar / Saber / Consultar** (`guias/jerarquia-y-espacios.md` §1).
3. Abrí la referencia y el ejemplo de ese tipo de pantalla.
4. Definí acento y tinte (`tokens.css`, `marcas.local.md`).
5. Marco: barra lateral sobre el lienzo, panel con migas (§1).
6. Cabecera: título grande y firme (Geist 500), subtítulo con cifras reales, un solo botón relleno.
7. Fila de 3–6 KPIs: uno protagonista, el resto en bandeja con tarjeta adentro, cada uno con su dibujo.
8. Cuerpo: tarjetas de entidad para lo que está en curso, tabla o lista para el resto, panel de contexto a la derecha.
9. Espacios con la tabla de §4a; escalera tipográfica de 5 niveles (§4e).
10. Vida (§1b): color por entidad, caras, un gráfico con estado, movimiento al cargar.
11. Estados vacío, cargando y error (§6b); textos según `guias/textos.md`.
12. Probá a 1280, 1440, 1920, a 360/390/414 (sin nada que se deslice de costado) y en oscuro; pasá `scripts/revisar.mjs` y la lista de §8.

---

## 0. Dos modos

### 0a. Crear una pantalla nueva
- Partí del ejemplo más parecido de `ejemplos/pantallas/` y de las piezas de `componentes/`; no arranques de una hoja en blanco.
- Datos de ejemplo realistas y del rubro (nombres, montos con centavos, fechas cercanas, monedas mezcladas), nunca "Lorem" ni "Cliente 1".
- Antes de dibujar, escribí la pregunta, las tres pilas y la densidad (§4c).
- Terminada = revisor ≥ 85 en las tres pasadas, estados completos y comparada al lado de 06, 07, 08 y 14 sin verse más pobre.

### 0b. Overhaul de un sistema existente
**Regla:** el overhaul cambia cómo se ve y cómo se ordena; nunca qué se pide, qué se manda, a quién se le muestra ni a dónde lleva. Antes de tocar código, leé `guias/overhaul.md` (código) y `guias/rediseno.md` (relevamiento, mapeo, informe).

- **Intocable** (se puede mudar de archivo, no renombrar ni "limpiar"): llamadas a la API, método y claves del cuerpo; hooks de datos y query keys; server actions, loaders y `revalidatePath`; consultas y sus filtros; rutas, URLs, `?parametros` y `#anclas`; `name` de campos y su validación (los mensajes sí se reescriben); tipos exportados; permisos y condiciones de visibilidad; estado de negocio; `data-testid`, `data-focus`, eventos de analítica; atajos, impresión y exportación.
- **Se puede cambiar:** JSX de presentación, clases y tokens, layout, orden y agrupación de bloques, piezas visuales, textos, íconos, animaciones, estado visual.
- **Zona gris, solo con OK anotado:** sacar un dato de la vista (se muda a ficha, ⋯ o pestaña, nunca se borra), sumar un parámetro de URL (los viejos siguen llegando), partir o juntar pantallas (la ruta vieja redirige), cambiar un orden por defecto del cliente, un total que cambia (por ejemplo, dejar de sumar monedas), un `data-testid` que se mueve.
- **Guardia obligatoria:** `node scripts/guardia-datos.mjs --base main` da PASA antes de entregar cada commit. Lo cambiado a propósito va en `.guardia-datos-permitir` con motivo y OK de quién. Nunca se apaga la guardia.
- **Orden por fases:** 0 relevar (capturas 1440/390/oscuro con los mismos datos y fecha fija, inventario de datos y acciones, lista de comportamiento, red grabada) → 1 tokens con alias → 2 marco → 3 pantalla por pantalla, de la más usada a la menos → 4 limpieza.
- **Dentro de cada pantalla:** 3a extraer los datos a `use<Pantalla>.ts` sin cambiar un píxel (guardia PASA, capturas idénticas) → 3b vista nueva detrás de bandera o ruta paralela, que lee del mismo cargador y consume solo lo que devuelve el hook, con adaptadores puros → 3c una semana con dos o tres personas → 3d para todos; la vieja se borra en un commit aparte. Las tandas visuales siguen `guias/rediseno.md` §5: tokens → marco → cabecera → piezas → vida → celular y oscuro. Una tanda = un commit que se revierte solo; nunca tokens globales y piezas de una pantalla en el mismo commit.
- **Nada de comportamiento perdido:** cada acción, filtro, vacío, carga, error, permiso, link de entrada y atajo de antes sigue existiendo (lista en [x]). Lo que se muda al ⋯ o a una hoja se lleva su condición de permiso. Un modal se cambia por Deshacer solo si el servidor ya permite revertir; si no, queda y se anota como pendiente.
- **Tokens:** migrar con alias (variables viejas apuntando a las nuevas, en el mismo selector del tema) y cambiar clases pantalla por pantalla; nunca un `sed` global. En shadcn, `accent` es el hover: nunca lo apuntes al acento de marca.
- **"No rompí nada"** = typecheck, lint, pruebas y build verdes; la misma red en la tarea principal (URLs, métodos, cuerpos); cada rol ve y hace lo mismo (cuentas de prueba); revisor ≥ 85 en 1440, 390 y oscuro; la tarea principal con igual o menos clics; informe de `guias/rediseno.md` §9 en el repo con capturas.
- **Agentes en paralelo:** uno por pantalla en su rama, dueño solo de su carpeta; `tokens.css`, `lib/`, tipos y piezas compartidas congelados en manos de un coordinador; cada agente entrega la guardia con `--solo <carpeta>`; un revisor re-audita hasta que no quede nada.

---

## 1. Marco de la app (referencias 02, 03, 07, 13)
- Lienzo `bg-fondo`. La barra lateral va **directo sobre el lienzo**, de 240–256 px (248 en `MarcoApp`), colapsable a 68 px con ⌘\ y recordada en `localStorage` con try/catch. Por debajo de 1280 px pasa a riel de íconos.
- Contenido en un panel `bg-panel`, radio `--radius-marco`, separado 8 px del borde y de la barra, borde 1 px. Arriba del panel, opcional, un degradé muy suave del tinte (clima).
- **Barra lateral:** logo o selector de empresa arriba; buscador ⌘K; grupos con rótulo de 11 px `texto-3` en mayúscula y `tracking-wider`; ítems de 32–36 px con ícono 17 gris y conteo gris a la derecha; ítem activo en pastilla `bg-superficie` con sombra mínima (o `bg-tinta text-superficie`) e ícono fill, nunca color de marca; entidades con cuadradito de color; usuario al pie.
- **Barra superior del panel:** 56–58 px con `border-b`. Migas "Sección / **Página**" (padre en gris) a la izquierda; ⌘K, avisos (con `aria-label` que diga cuántos) y avatar a la derecha. En celular: flecha al padre y título.
- **Cabecera:** título display (§2); subtítulo `texto-2` con **cifras reales del estado** unidas con " · " ("12 por facturar · 3 vencidas"), lo que exige actuar primero y coloreado solo en esa pieza; cada cifra lleva a su lista filtrada. Acciones a la derecha, alineadas abajo con el título.
- **Orden vertical fijo:** cabecera → filtros que cambian los KPIs (período) → KPIs → cuerpo (lo de hoy primero) → consulta. Nunca KPIs debajo de una tabla ni filtros debajo de lo que filtran.
- **Cuerpo con contexto:** `grid-cols-[minmax(0,1fr)_340px]` (panel fijo de 320–380): el trabajo a la izquierda, el contexto o lo siguiente a la derecha (§4h). En celular la derecha baja, salvo que sea de la pila Actuar: entonces sube arriba de todo.
- **Ficha:** 3 columnas `minmax(244px,.85fr) minmax(0,1.7fr) minmax(272px,.95fr)`: datos y contactos / actividad en pestañas con conteo / resumen que abre con su protagonista. Medí que las pestañas entren a 1440; si no, pasá los secundarios de la cabecera a íconos con tooltip antes de achicar letra. Cabecera de ficha: cuadro con el color de la entidad, nombre display, pastillas, subtítulo con cifras; correo, teléfono, Meet y nueva tarea como íconos de 38 px con tooltip, separados por una rayita del único botón relleno. Actividad: compositor arriba (bandeja con caja blanca, tipos en chips), línea de tiempo con un color fijo por tipo y lo que trae el evento en línea. Detalle en `ejemplos/pantallas/ficha-cliente.html`.
- **Grillas declaradas:** KPIs `repeat(4,1fr)` o `1.25fr repeat(3,1fr)` con protagonista; tarjetas de entidad 4 → 2 (< 1280) → 1 (< 768). Todo hijo de grilla lleva `min-w-0`.

## 1b. Vida (lo que hace que no sea una planilla prolija)
Mirá 06, 07, 08 y 14. Todo tablero lleva al menos 5 de estos recursos:

1. **Color por entidad.** Cada proyecto, cliente, persona o servicio tiene color fijo de la paleta de datos, asignado con `colorDe(id)` / `colorEntidad(id)`, nunca a mano. Si hay 6 o menos a la vista, fijalo para que no repitan tono. Aparece en el monograma (al 15 %), el cuadradito con ícono fill blanco, la barra de avance, el sparkline y la rayita de 3 px de la tabla.
2. **Toda cifra con un dibujo:** sparkline con área degradé, rayitas hasta el % (07), bloques "3 de 10" (06) o anillo (09, 13, 14). Un número solo es un número muerto.
3. **Un protagonista por pantalla:** tarjeta con degradé del acento, cifra grande blanca y línea blanca con un punto marcado (08, 09). Como máximo una.
4. **Tarjetas de entidad** para lo que está en curso (06): pastilla de prioridad y etiquetas, título con descripción de 2 líneas, bloques "3 de 6 hechas · Vence 15 dic", sparkline, "Próximos pasos" con checks y "+ Agregar".
5. **Gente con cara:** foto, avatar ilustrado o monograma pastel. Pilas superpuestas con borde de 2,5 px y "+N". Equipo en tarjetas con barra de carga.
6. **Gráficos con estado:** lo activo sólido, el resto rayado o tenue; tooltip oscuro; período en curso rayado.
7. **Fondo con clima:** degradé muy suave del tinte arriba del panel, o foto o ilustración en la franja de cabecera (14) o en una tarjeta de promo (06). Nunca foto detrás de cifras o tablas.
8. **Movimiento con propósito:** cifras que cuentan (700 ms), barras que crecen, líneas que se dibujan (900 ms), tarjeta que sube 2 px al pasar el mouse, éxito en el lugar. Detalle en §6f.
9. **Bandeja con tarjeta adentro** (lo que se ve premium): bandeja `bg-suave` radio 20 y padding 4; arriba, sobre la bandeja, rótulo con ícono y ⋯ (07); adentro, tarjeta `superficie` radio 16 con el número y su dibujo; abajo, sobre la bandeja, pie con ícono, contexto y delta (06). Mismo patrón para los íconos: cuadro blanco de 36–40 px con borde y sombra mínima (08).
10. **Aire:** lo premium respira. Si se ve apretado, sacá cosas antes que achicar (§4).

**Límite:** el color vive en los datos, las entidades y un protagonista. El marco sigue neutro.

## 1c. Reglas transversales (valen en todas las pantallas)
Sacadas de `guias/patrones-de-referencia.md`; el cómo con medidas está ahí, el detalle de cada pieza en §5.

1. **La vista es del usuario.** Densidad (28 / 36 / 44), columnas visibles, orden, anchos y filtros se guardan por persona y por tabla (§6g). El panel Vista muestra el valor actual de cada ajuste en el primer nivel ("Densidad · Compacta ›") y el botón de filtros dice cuántos hay activos.
2. **El estado es forma + color + palabra**, idéntico en menú, fila y panel. Lo normal o resuelto va en gris sin pastilla; solo lo que exige actuar lleva color, y siempre con el motivo después de una raya ("Bloqueado — falta remito").
3. **Ningún aviso sin acción.** Cada problema aparece en todos los niveles donde se ve, con el botón que lo resuelve, y además en una lista de control. Deshabilitado, solo con la causa escrita al lado o cuando es obvia por la posición (§5 Acciones).
4. **Todo proceso se ve correr en el lugar.** Pasos con ícono por estado (punteado / girando / ✓ / ✕), tiempo en mono y "n/N". El resultado se escribe en verbos y cifras ("Facturó 12 · 1 sin correr: falta X") y queda un registro de las corridas. Nunca un spinner que tape la pantalla. Si una corrida falla por un límite, el límite se dibuja como raya rotulada sobre el dato y la barra pasa a rojo desde la raya; el paso fallido muestra el código en mono, un mensaje claro y los datos de entrada con la línea culpable resaltada. Reintentar crea una corrida nueva con código propio y la anterior queda en el registro.
5. **Consecuencia antes de actuar.** Una acción masiva muestra antes una vista previa con datos reales y la fila "sin asignar" en rojo. Una opción cuyo efecto no se ve lleva vista previa en vivo o una línea gris con la consecuencia. **Al arrastrar algo que cambia un resultado, la consecuencia se ve antes de soltar:** pastilla pegada debajo de la tarjeta con el destino + "antes → después" + delta coloreado por bueno o malo; conteos −1/+1 en origen y destino; un límite superado en rojo con palabra; si no cambia nada, la pastilla lo dice. Al soltar, la cabecera y el toast repiten la consecuencia con Deshacer (`ejemplos/arrastre-con-impacto.html`).
6. **No se navega para ver o editar:** hoja lateral que empuja la tabla sin taparla, modal con el contexto ya cargado (y "Crear otra" en las altas) o ⌘K. Dentro de un módulo el marco queda quieto; nunca un panel en blanco entre dos estados: esqueleto con la propia interfaz en fantasma o el contenido anterior hasta que llega el nuevo.
7. **Los conteos dicen algo.** En pestañas de estado, punto + nombre + conteo, también en 0 (sirven de leyenda); en el menú, con verbo ("2 te necesitan", "3 vencidas"), en ámbar o rojo solo si exige actuar; en el subtítulo, número en `tinta` + rótulo gris. Toda tabla con montos lleva pie fijo con "N registros" y el total del filtro, una línea por moneda.
8. **El color tiene dueño.** Cada entidad, su color fijo por id en todo el sistema (§1b). En un gráfico, color solo en lo nombrado en la leyenda; el resto, grises escalonados.
9. **El movimiento explica.** Al ordenar o filtrar, las filas viajan a su lugar en 200–300 ms; la cascada de entrada solo en la primera visita, ≤ 8 piezas y completa antes de 600 ms; los números que cambian ruedan dígito por dígito; lo que llega en vivo entra desde un desenfoque de 6 px a 0 en ~300 ms. Nada en bucle detrás de los datos (§6f).
10. **El oscuro es el mismo layout con otros tokens.** El botón principal pasa a blanco, los estados usan su versión oscura (más clara y menos saturada) y las capas se separan por luminosidad y borde, sin sombras (§5 Oscuro).

## 2. Tipografía (análisis 02)
- **Geist en todo y Geist Mono para códigos.** Una sola familia con dos papeles: **interfaz** (400–500 a 13–14 px) y **títulos y cifras** (500–600, tracking cerrado). Geist Mono para códigos (FAC-01101, CUIT, B/L) y, en monitoreo, cifras. Se eligió el 18/11/2026 comparando contra Outfit + Plus Jakarta, Manrope + Inter y Space Grotesk + IBM Plex sobre la misma pantalla: las letras de trazo fino o en 300 se pierden en un sistema denso; Geist se lee firme a 13 px y sus cifras quedan compactas. Otra familia solo si la marca la exige (y entonces una sola, con su mono). Cargá Geist con `next/font/google` (`Geist`, `Geist_Mono`) o Google Fonts (`family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500`).
- **Escala única:** 11 / 12 / 13 / 14 / 16 / 20 / 24 / 32 / 40, y 36–44 para títulos display grandes (48 solo para el monto de un formulario en celular). Si una guía o ejemplo usa 15, 17 o 28, usá el escalón vecino de la escala.
- **Pesos:** 500 en títulos de página y de 36 o más (nunca 300: se pierde), 600 en lo destacado del título (el nombre del saludo); 400 texto; 500 nombres, rótulos y acciones; 600 en cifras protagonistas. Nada de 700. Por tarjeta, ≤ 3 tamaños y ≤ 2 pesos (más el 600 de la cifra).
- **Tracking:** −0,025 a −0,035 em en títulos y cifras de 20 o más (Geist abre de más en tamaños grandes); `tracking-wider` solo en el rótulo de grupo del menú.
- **Títulos grandes y firmes:** saludo o título de inicio 36–44/500 (el nombre en 600); título de página 24–32/500; título de sección 16–20/500 con conteo gris; nombre de tarjeta 16–20/500.
- **Dato = rótulo arriba y valor abajo** (§4e). Nunca "Rótulo: valor" en la misma línea dentro de una ficha (sí en leyendas y metadatos).
- **Cifras:** `tabular-nums`, a la derecha en tablas (encabezado incluido). Moneda, centavos y unidad en `texto-3`, un paso más chicos (la moneda al 60–65 % de la cifra): `US$ 24.957`<span>,81</span>. En tablas, centavos completos pero igual en gris; en celular, sin centavos.
- **Mayúscula** solo en el rótulo de grupo del menú. Encabezados de tabla, botones y pestañas en tipo oración.
- **Corte de líneas:** títulos con `text-wrap: balance` (sin una palabra sola en la última línea); párrafos y descripciones con `text-wrap: pretty`.
- **Nunca el atajo `font:`** sobre algo con cifras: resetea `font-variant-numeric`. Usá `font-size` y `font-weight` sueltos o repetí `tabular-nums` después.

## 3. Color (análisis 03)
- **Tres planos** `fondo` → `panel` → `superficie`; la profundidad sale del tono (2–4 % de luz entre planos), un borde de 1 px y sombras mínimas.
- **Neutro no quiere decir gris:** cada sistema elige un tinte (de marca o de uso: violeta, azulado, azul marino, cálido, frío, oscuro para monitoreo) y lo usa en toda la rampa (fondo, panel, bordes y los tres textos) con croma bajo (OKLCH C ≤ 0,02; hasta ~0,03 en el lienzo). Receta en el comentario de `tokens.css`. Nunca dos tintes en un sistema. Un fondo con tono o un menú oscuro de marca apagado valen si el contenido sigue en superficies claras.
- **Textos:** `tinta` / `texto-2` / `texto-3` del mismo tinte. Prohibido `#000` sobre `#fff`. **`texto-3` (#646979, 4,8:1) es el gris más claro para cualquier texto, placeholders incluidos.** `--color-deshabilitado` (#a1a1aa) solo para íconos decorativos y bordes punteados, nunca para texto que se lee.
- **Un solo acento por sistema** (color de marca; si no hay, grafito `#18181b`): botón principal, toggle, foco, punto de no leído, pestaña activa del celular, indicadores de arrastre. Nunca en títulos, fondos de tarjeta ni el menú.
- **Estados = pastilla:** fondo al 10 % + texto saturado + punto de 6 px, siempre con palabra. Colores de `tokens.css` (los de algunos ejemplos son más claros y no pasan AA).
  - Verde: hecho, cobrado, en línea. Ámbar: pendiente, parcial, por vencer. Rojo: vencido, falló, sin conexión. Azul: en curso, informativo. Gris: borrador, anulado, reintegrado.
  - Nombres estándar por entidad en `guias/textos.md` §12.
- **Lo normal no se colorea.** Rojo solo para lo que exige actuar; más de 3 rojos en pantalla se agrupan en un aviso.
- **Paleta de datos** (`dato-1…6`, máximo 6 por gráfico) solo en gráficos, avance, entidades e íconos de tipo; en tablas, como rayita de 3 px, nunca pintando la fila. Los cuadros de tipo usan las familias de `guias/iconos.md` §6.
- **Lo proyectado, parcial o no seleccionado va rayado o al 30–40 %; lo real, sólido.**
- **Conteo final:** neutros + 1 acento + estados + ≤ 6 de datos/tipo a la vista.
- **Vidrio** (`rgb(255 255 255/.14)` + borde `.24` + `backdrop-filter`) solo en pastillas y bandejas sobre un panel de color, y en el pie fijo de un formulario. El dato va siempre en tarjeta sólida.

---

## 4. Espacios y legibilidad

La jerarquía hace que se entienda. Detalle, antes/después y pruebas en `guias/jerarquia-y-espacios.md` §2, §4–§8, §11.

### 4a. Entre X e Y van N px
Solo valores de `--espacio-*` (`tokens.css`). La única excepción literal es el **14 del gap entre tarjetas**. Nada de 10, 18, 22, 30 inventados.

| Entre… | Valor | Variable |
|---|---|---|
| Rótulo ↔ su valor | 2–4 | `--espacio-1` / `--espacio-2` |
| Cifra ↔ su contexto ("69 % de la meta") | 2–4 | `--espacio-1` / `--espacio-2` |
| Título ↔ subtítulo o metadato | 4 | `--espacio-2` |
| Rótulo de campo ↔ campo; campo ↔ ayuda o error | 6 | `--espacio-3` |
| Chips entre sí | 6 | `--espacio-3` |
| Ícono ↔ texto | 8 (4 junto a texto de 12 o en botón chico) | `--espacio-4` (`--espacio-2`) |
| Botones entre sí; ítems de menú | 8 | `--espacio-4` |
| Ítem ↔ ítem del mismo grupo | 8–12, o la altura de fila | `--espacio-4` / `--espacio-5` |
| Rótulo del KPI ↔ cifra | 8 | `--espacio-4` |
| Título de sección ↔ su contenido | 12 | `--espacio-5` |
| Piezas dentro de una tarjeta (gap interno) | 12 | `--espacio-5` |
| Entre campos de un formulario | 20 (16 en hoja o denso) | `--espacio-7` (`--espacio-6`) |
| Grupo ↔ grupo dentro de una tarjeta | 16–24 | `--espacio-6` / `--espacio-8` |
| Grupo ↔ grupo de un formulario | 24 + rótulo de grupo (o banda fina) | `--espacio-8` |
| Bandeja ↔ tarjeta interna | 4 | `--espacio-2` |
| Padding de tarjeta | 16 (densa, operación, celular); 20 (normal); 24 (vistazo, protagonista) | `--espacio-6` / `-7` / `-8` |
| Rótulo de bandeja (ícono + rótulo + ⋯ sobre la bandeja) | fila de 32–36 | — |
| Padding del panel | vistazo: 24 arriba y abajo, 28 a los costados · operación: 20 (medido en 20) · celular: 16 | `--espacio-8` + `--espacio-9` · `--espacio-7` · `--espacio-6` |
| Título de página ↔ primer bloque | 16–24 | `--espacio-6` / `--espacio-8` |
| Entre tarjetas hermanas (gap de grilla) | 14 vistazo; 12 operación y celular | literal / `--espacio-5` |
| Entre bloques grandes (KPIs → cuerpo) | 28 vistazo; **16 operación** (medido en 19 y 20) | `--espacio-9` / `--espacio-6` |
| Aire sobre un título de sección | 40 vistazo; 28 operación y celular; 16 si el bloque es una bandeja con su rótulo | `--espacio-10` / `--espacio-9` / `--espacio-6` |
| Panel lateral fijo (contexto) | 320–380 de ancho (340 por defecto) | — |
| Márgenes laterales en celular | 16 | `--espacio-6` |

### 4b. Proximidad
- **Adentro ≤ la mitad de afuera.** Si un título está a 16 de lo suyo y a 16 de lo anterior, flota.
- El título de sección nunca es simétrico: 40 (o 28) arriba, 12 abajo.
- El rótulo está a 2–4 de su valor y a 16 o más del dato siguiente.
- Padding interno ≤ espacio entre bloques: una tarjeta con 20 de padding vive en un gap de 14 y a 28 del bloque siguiente.
- **En operación, la bandeja reemplaza al aire.** Cuando cada bloque es una bandeja con su rótulo arriba (padding 4, fila de 32–36), 16 entre bloques y 12 entre columnas alcanzan (ref. 20: todo el ritmo es 16 vertical y 12 horizontal, y respira). Con bloques sueltos sin bandeja, volvé a 28.
- **Separá con la herramienta más débil que alcance:** aire → divisor 1 px → banda o bandeja → tarjeta → título de sección + aire. Nunca dos fuertes juntas para lo mismo; nunca tres niveles de cajas con borde. Una tarjeta = un tema.
- **Topes por bloque** (si hay más, "+N más" o "Ver todo"): KPIs 3–6 por fila; pasos visibles 3–5; filas en tarjeta de lista 5–7; etiquetas 2; piezas de metadato 3; series 3–6; avatares en pila 3–4. Tabla completa en `guias/jerarquia-y-espacios.md` §4.

### 4c. Densidad y alto de filas
| Uso | Alto de fila | Padding tarjeta | Letra base | Cifras |
|---|---|---|---|---|
| Vistazo (inicio, dirección) | 36–40 (pasos) | 20–24 | 13–14 | 32–40 |
| Operación (cobranzas, pipeline, avisos) | tabla 28 / 36 / 44 (36 por defecto) · 56–64 lista de 2 líneas | 16–20 | 13–14 | 24–32 |
| Consulta (historial, caja, registro) | tabla 28 / 36 / 44 (28 o 36 por defecto) | 16 | 13 | 14 en la tabla |
| Monitoreo (pantalla siempre abierta) | tarjetas de 180–200 en grilla de 4 | 16 | 12–13 | 32 mono |
| Planificación (cronograma, Gantt, roadmap) | Gantt 30–32 · lista "necesita atención" 36–40 · carga y hitos 40–48 | 16 | 13–14 | 18–20 en KPI compacto con anillo |
| Celular | 56–64 (toque ≥ 44) | 16 | 14–16 | 32–36 |

Ítem de menú 32–36; botón 36–38 (chico 28; 44 en celular); campo 36–40 (52 en celular). Una sola densidad por zona; en tablas la elige la persona (§1c.1); la densidad se logra con altura y padding, nunca con letra de menos de 12. Lo premium respira, lo operativo rinde: elegí por el uso.

### 4d. Legibilidad
- **Interlineado por tamaño:** cifras de 24 o más 1,05–1,1; títulos de 16–44 1,15–1,25; texto de filas y controles (13–14) 1,35–1,4; párrafos y descripciones 1,5; metadatos de 12 1,35.
- **Ancho de línea:** texto corrido a 64–72 caracteres (`max-width:68ch`); ayuda de campo una línea (~70); descripción de tarjeta 2 líneas con `line-clamp`.
- **Mínimo 12 px** para todo lo que se lee. 11 solo en el rótulo de grupo del menú y la unidad de una cifra. Inputs a 16 px en celular (si no, iOS hace zoom).
- **Contraste AA:** texto ≥ 4,5:1 sobre su fondo real (bandeja incluida); cifras de 24 o más e íconos que informan ≥ 3:1. `texto-3` es el piso, y nunca para algo que haga falta para decidir.
- **Truncá el final, nunca el principio**; el texto completo vive en la ficha o en un tooltip. Si no entra, recortá con "+N más" o "Ver todo" antes que achicar.
- **Alineación:** un solo borde izquierdo por columna (título, KPIs, secciones y primera columna de la tabla en la misma x); el texto se alinea al texto, no al ícono; nada centrado en escritorio salvo estados vacíos; columnas fijas para tile, avatar, fecha y ⋯; tarjetas de una fila con la misma altura y el pie pegado abajo.

### 4e. Escalera tipográfica y dónde va el énfasis
**Pesan tres cosas: el dato, la acción y el nombre. Todo lo demás va en gris.**

| Nivel | Qué | Letra | Peso | Color |
|---|---|---|---|---|
| 1. Protagonista | La cifra o el título que contesta el bloque | 32–40 (24 en KPI denso) | 500–600 | `tinta` |
| 2. Nombre | Título de tarjeta, entidad, título de fila | 16–20 display / 13–14 en fila | 500 | `tinta` |
| 3. Texto | La frase de un aviso, un paso | 13–14 | 400 | `tinta` (descripción: `texto-2`) |
| 4. Rótulo | Rótulo de KPI y de campo, encabezado de tabla | 12–13 | 500 | `texto-2` |
| 5. Metadato | Cuándo, dónde, cuántos, unidad, moneda | 12 | 400 | `texto-3` |

- Un nivel 1 por bloque. Para subir un texto de nivel, cambiá **una** palanca (posición > tamaño > color > peso).
- Más de 3 textos en `tinta` 500 por tarjeta: bajá los que sobran a gris.
- **Rótulo gris arriba, valor negro abajo, nunca al revés** (la ref. 03 lo tiene invertido).
- **Quién manda según la pregunta:** ¿cuánto? el número; ¿qué pasó / qué hago? la frase, con el importe adentro en 500; ¿quién? el nombre, con el monto a la derecha en el mismo peso; ¿cómo va? el avance; ¿cuándo? la hora.
- **Un foco por bloque:** si una cifra y una alerta compiten, la cifra queda en `tinta` y el rojo baja al pie con palabra. Probalo con `filter:blur(4px)` (una mancha por bloque) y `grayscale(1)` (la jerarquía sigue sin color).
- **Fila:** nombre → dato → estado → cuándo → acción. Primera palabra distintiva ("Casa Lumen · Web", no al revés); código en mono `texto-3` dentro del metadato (salvo tablas de comprobantes, donde el código es el nombre); la fecha se pinta solo si apura (vencida rojo 500, hoy `tinta` 500).
- **Recorridos:** F en listas y fichas (lo urgente en las primeras filas, montos encolumnados a la derecha); Z en tableros, cabeceras y hojas (qué es arriba a la izquierda, acción arriba a la derecha, salida abajo a la derecha); I en celular (cifra, lo de hoy, acción fija abajo).
- Tabla de 23 tipos de bloque con su énfasis: `guias/jerarquia-y-espacios.md` §9.

### 4g. Simetría y alineación (`guias/simetria.md` · `ejemplos/simetria.html`)
Lo premium se nota en que todo cae en su lugar. Un desfase de 2 px se ve aunque nadie sepa decir qué está mal.
- **Bordes comunes.** Todo bloque de una columna arranca en la misma x: títulos de sección, tarjetas, tablas y filtros comparten borde izquierdo. Lo mismo a la derecha con acciones, montos y ⋯. Nada "casi alineado": o está en la línea o está claramente adentro (16 o más).
- **Padding simétrico.** En tarjetas y botones, el padding de arriba es igual al de abajo y el de la izquierda igual al de la derecha. Si el contenido de abajo es un pie, el pie lleva su propio padding simétrico. Excepción: el ícono de un botón con texto (izquierda 12, derecha 14 compensa visualmente).
- **Filas de hermanos iguales.** Las tarjetas de una misma fila tienen el mismo alto (`grid` + `align-items:stretch`) y sus partes internas caen a la misma altura. Título con título, número con número y pie con pie (subgrid, o alto fijo por zona). El pie va pegado abajo (`margin-top:auto`) aunque una tarjeta tenga menos contenido.
- **Anchos que se repiten.** Las columnas de una grilla son iguales salvo que haya un protagonista declarado (1.25fr). Dos botones lado a lado al pie de una capa tienen el mismo ancho o están alineados a la derecha, nunca uno largo y otro corto centrados. Los íconos de una lista van en una columna de ancho fijo.
- **Centro óptico.** Ícono centrado en su cuadro (`display:grid; place-items:center`, mismo tamaño par: 16 en 32, 18 en 36, 20 en 40). Los íconos con peso a un lado se corren 1 px hacia el lado liviano (play →, flechas). Texto y ícono en la misma línea: `align-items:center`. Si mezclan tamaños de letra, alineá por la línea base (`align-items:baseline`).
- **Números alineados.** En columnas de cifras: `tabular-nums`, todos a la derecha, mismos decimales. En una fila de KPIs, las cifras caen en la misma línea base.
- **Ritmo parejo.** El espacio entre hermanos es siempre el mismo (gap, nunca márgenes sueltos). Si en una lista una fila tiene una línea y otra dos, el alto mínimo es el mismo y el contenido se centra verticalmente.
- **Radios concéntricos.** Radio interno = radio externo − padding. Una tarjeta de 20 con padding 4 lleva adentro una de 16.
- **Simetría con intención.** Centrado solo en piezas aisladas (vacíos, acceso, modal, éxito). Lo que se lee de corrido va alineado a la izquierda. Una cabecera con algo a la izquierda y algo a la derecha alinea los dos al mismo eje vertical (centro o base, el mismo en toda la app).
- **Bordes de 1 px que coinciden.** Bordes de celdas, divisores y tarjetas pegadas no se duplican (2 px) ni dejan medio píxel borroso. Usá `box-shadow` interno o `border-collapse` en tablas y medidas enteras.
- **Comprobación.** Pasá `revisar.mjs`, que mide bordes izquierdos, altos de hermanos, padding asimétrico y centro de íconos. Mirá la captura con una grilla de 4 px encima (`?grilla` en los ejemplos, o un `repeating-linear-gradient` temporal).

### 4f. Superficies, radios y sombras (análisis 04)
**Radios en capas** (interno ≈ externo − padding), solo los de `tokens.css`:

| Elemento | Radio | Variable |
|---|---|---|
| Marco de la app | 26 | `--radius-app` |
| Panel principal, tarjeta, bandeja, hoja | 20 (20–24 en celular) | `--radius-marco` / `--radius-tarjeta` |
| Tarjeta dentro de la bandeja; tarjeta de kanban | 16 | `--radius-interno` |
| Botón, campo, buscador, ícono en cuadro | 12 (cuadro de 32: 10) | `--radius-control` |
| Botón chico, pastilla, etiqueta, cuadradito de entidad | 7–8; redonda para filtros y deltas | `--radius-chip` |

- **Borde** siempre 1 px `borde` (`borde-fuerte` en campos). Nada de 2 px ni bordes de color salvo el foco y el hueco punteado de arrastre.
- **Sombras del tono de la tinta, nunca negras:** mínima (`--shadow-min`) en botones con borde, tarjeta interna, ítem activo y cuadros de ícono; hover (`--shadow-hover` + subir 2 px) en tarjetas clickeables; flotante (`--shadow-flotante`) en menú, hoja, modal, toast y barras flotantes; `--shadow-principal` en el botón relleno. Una tarjeta quieta va con borde, sin sombra grande.
- **Subdividir** con bandas a todo el ancho (`border-t` o fondo `suave`) o bandeja + tarjeta blanca; métricas en fila con `divide-x`. Nunca tarjeta dentro de tarjeta con borde.

### 4h. Aprovechar la pantalla (`analisis/16-espacio-y-pantalla.md` · referencias 15–20)
Las referencias llenan el ancho sin huecos y nunca obligan a buscar el contenido de costado. Un sistema que deja franjas vacías en 1920 o que hace deslizar en el celular está mal armado, no "limpio".

- **Llenar el ancho con `fr` y `minmax`.** Columna de trabajo fluida `minmax(0,1fr)` + panel de contexto fijo de **320–380** (340 por defecto; 20: 338, 16: ~340, 19: ~288). KPIs a todo el ancho: iguales `repeat(4,minmax(0,1fr))` o según su contenido (`minmax(0,1.85fr) minmax(0,1.85fr) minmax(0,1fr)` en 20). Grillas de tiempo divididas en `1fr` para que el último día o semana toque el borde: `140px repeat(5,minmax(0,1fr))` (17), `170px repeat(10,minmax(0,1fr))` (19).
- **La grilla de abajo hereda las columnas de arriba.** Si hay 4 KPIs, el cuerpo es `3fr 1fr` y el panel derecho mide lo mismo que el cuarto KPI (19): todos los bordes coinciden.
- **Nada de contenido centrado y angosto.** Prohibido un `max-width: 960px; margin: auto` para una pantalla de trabajo. El ancho de lectura se limita **adentro** (texto corrido a 68ch, formulario a su ancho por campo), no en el contenedor de la página. Lo único que va centrado es lo que representa un objeto aislado: la hoja A4 de una vista previa (16), un vacío, el acceso.
- **Crecer de 1280 a 1920 sin huecos.** Lo que crece es la columna fluida (gráfico, tabla, cronograma, conversación); los paneles laterales quedan fijos y las grillas se estiran. Probá a 1280, 1440 y 1920: no puede aparecer una franja vacía a la derecha ni una tarjeta estirada con el contenido pegado a la izquierda (en ese caso, más columnas o más datos por fila, nunca más aire). Por encima de ~1680, una grilla de tarjetas suma una columna (`repeat(auto-fill,minmax(280px,1fr))`) antes que agrandarlas.
- **Densidad según la tarea** (§4c): lo que se lee (chat, reporte, ficha) respira; lo que se recorre (cronograma, roadmap, cobranzas, monitoreo) va denso, con filas de 30–40 y bandejas con rótulo en vez de aire. Una zona, una densidad.
- **Lo urgente arriba, con su arreglo en la fila.** Toda pantalla de planificación u operación abre con un bloque **"Requiere atención" + "Empieza hoy"** (o "Vence hoy") lado a lado (≈ 57/43 o 50/50, filas de 36–40) antes del cronograma o la tabla (17, 18). Cada fila dice el motivo con ícono ("Vencida · venció 27 oct · 75 %", "Fechas al revés · 5 nov – 12 oct") y, si se arregla ahí, el botón ("Corregir fechas"). Si está vacío, una línea "Nada pendiente hoy" y se pliega.
- **Cabecera compacta en operación:** título 20–24 con subtítulo de cifras reales y las acciones en la misma fila (36); el primer bloque a 16–24.
- **Escritorio puede desplazar de costado solo con aviso.** Un cronograma más largo que la pantalla (18) se desliza con barra visible, columna de nombres fija y un chip que dice qué quedó afuera ("‹ 6 vencidas"). En celular, nunca (§6e).

---

## 5. Piezas

### Botones rellenos: la regla
- **Un solo botón relleno por pantalla**, arriba a la derecha (en celular, la píldora fija).
- **Más uno por capa que cierra una decisión:** hoja lateral, modal, panel de detalle abierto por la persona (eligió una fila o un evento), barra de "cambios sin guardar" y barra de selección múltiple (su principal va en blanco sobre la barra oscura).
- **Mientras haya una capa abierta, el relleno de la pantalla pasa a borde.** Nunca dos rellenos compitiendo a la vista.
- Un panel de contexto fijo que ya está al cargar (la "Próxima reunión" del calendario) no es capa: su botón va con borde, salvo que sea la acción principal de la pantalla; entonces es el relleno único y la cabecera va con borde.
- Las acciones de fila rellenas (24–28 px) no cuentan: solo la que resuelve una decisión pendiente (Aprobar, Cobrar), máximo 2 visibles por fila.

### Tarjeta KPI (06, 07, 13, 14 · `componentes/datos/Kpi.tsx`)
- **Rótulo + número + contexto**, siempre; número en `tinta`, display 500; el color va solo en el delta, la pastilla o la barra.
- **Delta** con período ("+12 % vs. octubre"), flecha ↗/↘ y color por **bueno o malo para el negocio** (`sentido="bajar-es-bueno"` en mora, gastos, días de cobro), nunca por el signo.
- Si hay algo vencido, el pie lleva ícono de alerta y texto rojo con cuántos ("2 vencidas · Requiere atención"); el número sigue negro.
- Avance contra meta: barra de 3–6 px, rayitas con marca de "esperado a hoy" o "3 de 6". Nunca una torta.
- Filas de 3–6 del mismo tamaño; cada KPI lleva a su lista filtrada (pie clickeable con ↗) y la deja destellando.
- Sin valor: "—" en gris; cargando: esqueleto con la forma del KPI.

### Dos monedas (`componentes/datos/DosMonedas.tsx` · `ejemplos/dos-monedas.html`)
Cuando un sistema maneja moneda local y dólares, la segunda moneda **no es una nota al pie**: "$ 45,7 M" grande y "y US$ 4.700" chiquito abajo hace que los dólares no se vean.
- **Lado a lado, mismo tamaño.** Dos columnas iguales separadas por una línea de 1 px: la moneda local a la izquierda y los dólares a la derecha, cada una con su cifra, su contexto y su propio dibujo (barra, curva). Si la tarjeta es angosta (menos de ~320 px) o en celular, una arriba de la otra, también del mismo tamaño.
- **Chip de moneda** (`ARS`, `USD`, mono 10,5 px) arriba de cada cifra, con un color fijo por moneda en todo el sistema (por ejemplo, la local azul y el dólar verde). Ese color no se usa para otra cosa (ni para entidades ni para estados).
- **Nunca se suman entre sí**, ni "pasadas" a una sola moneda con un tipo de cambio: el usuario quiere ver las dos. Si una está en cero se muestra igual ("US$ 0"), así se sabe que se miró.
- **El pie también va partido** en dos mitades alineadas con las columnas ("+60 d: $ 27,2 M" | "Nada a +60 días"). El link de la tarjeta sube al rótulo, a la derecha.
- **Una cifra que no es plata** (cantidad de facturas, ocupación) va una sola vez; lo que sí es plata dentro de esa tarjeta (lo que falta facturar) va partido por moneda en el pie.
- **Pantallas de plata (caja, tesorería):** arriba una bandeja por moneda para el saldo y otra por moneda para lo que entró y salió en el período, en una grilla simétrica (2 o 4 columnas). Los montos van completos, sin abreviar.
- Con las dos columnas, cada bandeja necesita más ancho: en un tablero pasan a ser de a 3 por fila y la protagonista va arriba a todo el ancho.

### Listas y tablas (01, 07 · `componentes/estructura/Tabla.tsx`, `ejemplos/pantallas/lista-cobranzas.html`)
- **Tabla:** sin líneas verticales; encabezado 12 px `texto-2` en `bg-suave` o solo hairline (uno por sistema), fijo y ordenable con `aria-sort`; filas en tres densidades (28 / 36 / 44) con `divide-divisor`; primera columna fija con fondo sólido; pie fijo con "N registros" y total del filtro (§1c.7); montos a la derecha; ≤ 2 pastillas por fila; rayita de 3 px del color de la entidad; códigos en mono; anulado tachado en gris; 5–8 columnas (el resto en "Columnas" y en la ficha).
- **Filtros pegados a la tabla**, dentro de su tarjeta: segmentado con conteo, chips con conteo y búsqueda (`/` enfoca, sin acentos). Arriba de los KPIs va solo lo que cambia los KPIs.
- **Resumen vivo** al lado de los filtros: "18 facturas · $ 20.970.000 · US$ 11.200". **Nunca sumes monedas distintas**; `moneda` por fila.
- **Lista de actividad o avisos:** filas de 2 líneas (56–64), tile de 32–40 con fondo de estado al 10 %, título y metadato, acción en línea, ⋯. Agrupadas "Hoy / Ayer / Esta semana"; no leído = punto de acento de 6 px y "78 sin leer · Marcar todo leído".
- **Orden de trabajo:** vencido → hoy → mañana → después → sin fecha; lo hecho al final o detrás de "3 hechas".
- **Agrupar** por la entidad que decide la acción (cliente), grupos ordenados por urgencia; cabecera de grupo con casilla de estado intermedio, cuadro de color, "N facturas · M vencidas", rayitas por ítem del color de su estado, total alineado a la columna de montos y responsable.
- **Selección múltiple:** barra oscura flotante abajo al centro con cantidad, total de lo elegido y ≤ 3 acciones más ×; Esc limpia, shift+clic hace rango. En celular reemplaza a la píldora.
- **Toda fila abre su hoja de detalle** con clic o Enter, y la hoja se recorre con ↑/↓ sin cerrarla; historial armado de los datos reales y notas internas.
- **Después de una acción, la fila queda visible** aunque el filtro ya no la incluya, hasta que cambie el filtro.
- Cobro parcial = barra verde de 3 px bajo el saldo, nunca otra pastilla. Terminado = check verde relleno; las tareas no se tachan.
- `vacio` es obligatorio en `<Tabla>`; al llevar a una lista, `enfocar={id}` centra la fila y destella 2 s.

### Vistas de datos (`ejemplos/pantallas/vistas-de-datos.html`)
- Colección grande = barra de vistas Tabla / Lista / Kanban / Galería + vistas guardadas con nombre y "+ Vista" (su menú explica cada tipo en una línea). Cada vista guarda filtros, agrupación y orden; todas leen el mismo arreglo filtrado y escriben por la misma función.
- **La grilla tipo planilla es la única excepción a "sin líneas verticales"**: divisores verticales casi invisibles, número de fila que cambia por casilla al pasar el mouse, ícono gris por encabezado, entidad y casillas fijas a la izquierda con sombra solo si hay scroll, ancho por arrastre del borde (doble clic restablece), columnas que se mueven arrastrando el encabezado y menú de columna con clic.
- Filtros como chips que se leen como frase: "Responsable es [avatar] Ana Ruiz ×"; también "Agrupado por País ×"; al final "+ Filtro", "Limpiar", "Mostrando 8 de 32".
- Grupos plegables con conteo en mono y suma; se pliegan con `grid-template-rows` 1fr → 0fr y `overflow:clip` (no `hidden`, que rompe las columnas fijas). Pie "Calcular" por columna.
- Borrar en lote mueve a la papelera con toast y Deshacer (foto previa); nunca confirmación.

### Acciones (01, 02, 06 · análisis 10 · `componentes/base/Boton.tsx`)
- Secundarios `bg-superficie border`, 36–38 px, radio 12, ícono 17 + texto 13–14/500. Chico 28 px radio 8. Celular 44.
- **Texto:** verbo + objeto, ≤ 3 palabras; el que confirma repite la acción ("Anular factura"), nunca "Sí", "Aceptar" ni "OK".
- **Menú ⋯** con grupos: reversible arriba, silenciar u ocultar al medio, ajustes o borrar al final (tono peligro); atajos a la derecha. Editar y Eliminar van al ⋯, nunca visibles en cada fila. En celular el ⋯ abre hoja desde abajo con filas de 44 y sin atajos.
- **Acciones rápidas** secundarias de una fila aparecen con hover **y** `:focus-within`, superpuestas con un degradé del fondo; en celular, siempre visibles.
- **Guardando:** el botón recibe `cargando` desde el primer render, fija su ancho, pasa a gerundio ("Guardando…") con `aria-busy` y sin perder el foco.
- **Éxito en el lugar:** la fila se tiñe de verde tenue, el botón pasa a pastilla "✓ Aprobado", nada desaparece en el momento; toast abajo a la derecha con participio + código + monto, la consecuencia ("Quedó en Cobranzas"), **Deshacer** y ×; 5 s (8 s con Deshacer), se pausa con mouse, foco o pestaña oculta; máximo 3 apilados.
- **Optimista lo chico y reversible:** tildar, mover, archivar o renombrar se ven hechos al instante y vuelven atrás solos si el servidor falla, con toast "No se guardó · Reintentar". El toast con Deshacer lleva una barrita de 2 px que se vacía (`linear`) y se pausa con el mouse o el foco.
- **Deshacer antes que confirmar.** Modal solo para lo irreversible, con la consecuencia y el botón que repite la acción.
- **Nunca un control deshabilitado sin decir por qué.** Deshabilitado solo con la causa escrita al lado, o cuando es obvia por la posición ("Mover a la izquierda" en la primera columna, que queda en su lugar al 40 %). Si no aplica, no se muestra; si espera tiempo, contador ("Podés pedir otro en 0:28"); si falta algo, el botón dice qué y lleva ahí.
- "+ Agregar …" al final de su propia lista, en gris. Correo, teléfono y Meet como botones cuadrados de ícono con tooltip.

### Selector segmentado y pestañas (`componentes/base/Segmentado.tsx`)
- Todo cambio de vista o período de 2–4 opciones (y toda elección de 2–3 en un formulario) va en segmentado: riel `bg-suave`, activa en pastilla `bg-superficie` con sombra mínima que se desliza (sin animar en el primer pintado). En oscuro, la activa sube un escalón (`bg-superficie` con borde sobre el riel `bg-suave`, como en la ref. 20); la pastilla clara invertida (`bg-tinta text-superficie`) queda para el selector fuerte de la pantalla (período del tablero, tema).
- Pestañas con conteo gris ("Actividad 16"); el conteo de la activa va invertido y se actualiza en el momento. Si no entran en el celular, se acomodan en una grilla de 2–3 columnas (el indicador se mueve en x e y) o las que sobran van a "Más ▾"; nunca un riel que se desliza de costado (§6e).

### Formularios (01, 04 · análisis 11 · `ejemplos/pantallas/formulario-alta.html`)
- Ediciones secundarias en **hoja lateral derecha** de 420 px (380–440), sin cambiar de página; en celular sube desde abajo. Pie: "Volver a lo predeterminado" a la izquierda; Cancelar (borde) y Guardar (relleno) a la derecha.
- Rótulo siempre visible arriba; el placeholder es un ejemplo, nunca el rótulo. **Se marca lo opcional ("· opcional"), no lo obligatorio**: sin asteriscos.
- **Ancho del campo según el dato** (fecha y CUIT cortos, cliente y notas largos). Moneda o unidad dentro del campo como pastilla; montos formateados al salir.
- **Validación:** el primer chequeo al salir de un campo con texto o al intentar guardar; desde ahí, en vivo, y el error se va apenas el valor es válido. Nunca rojo mientras se escribe por primera vez; lo que falta y nadie tocó va en gris hasta que se intente crear. Error debajo del campo, con ícono, `aria-invalid` y `aria-describedby`.
- **Mensajes con el dato concreto y la corrección como botón** ("¿Es sofia@orbe.com.ar? Usar ese"). Ámbar para lo que no frena; rojo solo para lo que impide guardar.
- **El botón principal no se apaga por campos que faltan:** si falta algo, baja al primer problema, lo enfoca y lo sacude; el pie dice "Faltan 2 para crear · Revisar".
- **Altas largas (5+ secciones):** menú plegado a riel de 60 px; índice pegajoso de ~200 px con estado por sección (anillo, check, "!" y meta concreta), formulario y resumen vivo pegajoso de 320–344 px. Borrador automático a los ~900 ms con "Cambios sin guardar / Guardando… / Guardado hace N s"; Cancelar vacía y ofrece Deshacer. Debajo de 1280 el índice pasa a tira de chips.
- Ítems repetibles con rayita de color propio (repetida en el resumen), subtotal vivo, "+ Agregar ítem" al pie y quitar con Deshacer.
- Combobox con búsqueda sin acentos, teclado completo y "Crear «texto»"; fecha que se puede escribir o elegir, con atajos. Los selects llevan ícono; las opciones binarias son toggles con su explicación debajo.

### Ajustes (04, 05 · `ejemplos/pantallas/ajustes.html`)
- Dos niveles: columna interna con grupos (Personal / Empresa / Integraciones) y contenido a la derecha; en celular, las secciones como pastillas que se acomodan en líneas arriba del contenido (o una lista que abre cada sección), nunca un riel de costado.
- **Sin Guardar por sección:** cada edición marca el campo y su ítem del menú interno con un punto de acento (rojo si necesita atención) y levanta la barra flotante "Tenés cambios sin guardar · N cambios en Perfil y Notificaciones", con Descartar (con Deshacer) y Guardar cambios (⌘S). Esa barra es la capa: el relleno de la cabecera pasa a borde.
- Lo que se aplica al instante (tema, vista) no pasa por la barra; lo que cambia datos de otros sí. Acciones sobre una persona o integración (invitar, suspender, conectar) se ejecutan en el momento con toast y Deshacer.
- **Preferencias por canal:** tarjeta por canal con su destino real e interruptor; tabla de casillas evento × canal con casilla maestra de estado intermedio y "6 de 10"; un canal apagado deja su columna al 30 % sin perder lo elegido.
- Toggles con su explicación debajo y su valor vigente. Uso contra un límite: real sólido, proyección rayada, línea del límite rotulada, barra apilada por módulo + "Libre".
- Integración: logo en cuadro blanco con borde, estado en pastilla, cuenta en mono, curva de 7 días si está conectada, aviso rojo con "Reconectar" si falló, costo real si está disponible.
- Tu propio rol, como texto con candado y el motivo al pasar el mouse.

### Calendario (02, 10 · `ejemplos/pantallas/calendario.html`)
- Eventos en pastel por tipo con texto `tinta` y el ícono del proveedor, o tarjeta `superficie` con borde; nunca saturados. Los chips de tipo son la leyenda (mismo pastel, punto y conteo, se apagan al tocarlos).
- **Hoy:** un solo bloque negro (la cabecera del día), la columna teñida al 3–4 % y la línea de "ahora" solo en esa columna con la hora en mono (hora de Argentina).
- **Estado por forma:** sin confirmar rayado con borde punteado; pasado al 55 %. El estado nunca cambia el pastel del tipo.
- Bloque según duración: < 45 min una línea; 45–74 título y rango; ≥ 75 título en 2 líneas. Superpuestos en carriles.
- **Próxima reunión** es el protagonista: tarjeta de acento con cuenta regresiva ("en 50 min") y la línea del día. Pie: Reprogramar (borde) y la acción según proveedor (Unirme / Cómo llegar / Llamar); pasada, solo "Agendar seguimiento". Aplicá la regla de rellenos de arriba.
- Reprogramar despliega 2–3 huecos libres en común en el panel, sin modal. Hover en un hueco: casilla punteada "+ 10:30"; clic crea borrador con Deshacer.
- Filtros por persona y tipo: chips redondos, activo en negro con ✓.

### Pipeline (`ejemplos/pantallas/pipeline.html`)
- Cada columna es una bandeja: punto de la etapa, nombre y conteo; monto total que cuenta, ponderado y barrita de participación; tarjetas de radio 16 adentro. Las 5 columnas entran a 1440 (≥ 200 px cada una); en celular, una etapa a la vez: carrusel a propósito con encastre al 84 % (`data-carrusel`), indicador "Propuesta · 3 de 5" con puntos, la leyenda de etapas en 2 columnas que lleva a cada una, y el encastre se apaga mientras se arrastra. Alternativa: segmentado de etapas y una columna visible.
- Etapas abiertas en una rampa de un solo tono, de claro a oscuro; solo Ganada en verde.
- Tarjeta: cuadradito del cliente, código mono, monto con moneda gris, anillo de probabilidad; pie en dos líneas con la fecha relativa arriba (vencida en rojo con ícono) y la próxima acción abajo.
- Arrastre con pointer events (no HTML5 drag): copia que vuela (`rotate:2deg; scale:1.03`), hueco punteado de acento, vecinos con FLIP de 240 ms, autoscroll en bordes, Esc cancela; en el dedo, toque largo de ~230 ms. Alternativa por teclado (Mayúscula + ←/→ cambia de etapa) y anuncio en `aria-live`.
- **Mientras se arrastra**, la pastilla de la tarjeta dice qué pasa con el ponderado del mes o con la fecha (§1c.5). Si una tarea define la fecha de entrega, lleva rayita roja de 3 px y "Define la fecha"; las del camino crítico, rayita verde, con leyenda.
- Todo cambio de etapa: toast con qué cambió ("probabilidad 30 % → 75 %") y Deshacer. Ganada tiñe de verde con sello ~4 s; Perdida es una zona que aparece solo al arrastrar.
- Barra apilada: rótulo de tramo solo si mide ≥ 96 px reales; clic en tramo o leyenda lleva a la columna con destello.

### Acceso (`guias/acceso.md` · `ejemplos/pantallas/login-variantes.html` · `ejemplos/pantallas/login.html`)
- **Una columna de formulario de 360–440 px con orden fijo:** logo y nombre del sistema arriba (un solo enlace secundario a la derecha) → título 32/500 con un verbo o una pregunta → bajada solo si trae un dato → aviso del servidor → campos → "Recordarme" → principal a todo el ancho → "o" → proveedores → salida alternativa → pie con el estado del sistema ("● Todo en línea").
- **El panel de al lado elige el diseño; el formulario no cambia.** Marca (panel oscuro con el signo de la marca y rayas de 1 px al 6–8 %): **por defecto en sistemas internos**. Imagen (foto real de la operación con velo y un dato del día): solo con fotos propias. Pasos (hasta 3 apilados): invitaciones y primera vez. Centrado (tarjeta de 476 sobre puntos): lo que llega por correo (código, invitación, recuperar). Puntos (la operación tramada en puntos). Lista de beneficios solo en productos que se venden. En celular, solo el formulario.
- **Siete estados, todos en el lugar y sin modal:** entrar, error (qué pasó, intentos que quedan y la salida; nunca se borra lo escrito), bloqueo (con cuenta regresiva), código, elegir empresa, invitación y sesión vencida (el correo ya puesto; vuelve a donde estaba).
- **Código:** un solo `<input autocomplete="one-time-code" inputmode="numeric">` dibujado como 6 casillas; pegar o el autocompletado del celular lo llenan de un toque; reenviar con contador.
- **Elegir empresa** solo si hay 2 o más (con una, entra directo): filas con cuadro de color, nombre, rol y último ingreso.
- **Proveedores** lado a lado y del mismo ancho, solo los que de verdad se usan.
- `autocomplete` en todos los campos (`username`, `current-password`, `new-password`), `inputmode="email"`, `autocapitalize="off"`; campos de 44 en escritorio y **52 con letra de 16 en celular**; foco automático solo en escritorio. Al cambiar de estado, el foco pasa al título nuevo (`tabindex="-1"`).
- **El panel no vende:** sin slogans, fotos de stock ni montos del negocio.

### Celular (09, 11, 12 · análisis 12 · `ejemplos/pantallas/celular.html`)
- Fondo `fondo` del sistema, tarjetas `superficie` radio 20–24 sin borde, márgenes de 16, gap 12.
- Arriba: saludo o título con botones circulares de 40 (área 44); debajo, **la cifra protagonista** de 32–36 con su delta. Lo primero que se ve es lo que hay que hacer hoy.
- Accesos rápidos en grilla de 3–4 (ícono fill + rótulo); secciones con "Ver todo"; filas con tile de 40, dos líneas y monto a la derecha.
- **Acción principal:** píldora del acento a todo el ancho, fija abajo, 52–56 px con `pb-[env(safe-area-inset-bottom)]`. Si falta algo, nunca deshabilitada: dice qué falta en gris ("Cerrar visita · faltan 3 + firma") y lleva ahí. En colecciones donde la acción es crear, puede ser un botón flotante "+"; nunca los dos.
- **Barra inferior** de 4 destinos, cápsula flotante de 64 px a 16 de los bordes: activo en pastilla de acento suave con ícono fill y texto, el resto solo ícono; degradé del fondo detrás.
- Toasts arriba de la barra y de la píldora (`--ds-pie-movil`). Toques ≥ 44 px.
- Lo que pasa en una pantalla actualiza las otras (contadores, anillos, KPIs). La falta de señal se muestra en el dato ("1 sin subir" en ámbar), no en un cartel.
- **Fotos con su versión borrosa mientras cargan** (desenfoque de 16–20 px, escala 1,1, fundido de 320 ms al llegar la buena); nunca una caja gris.
- **Tarjeta que crece a ficha** con View Transitions (320 ms, `--ease-mover`); la hoja inferior se arrastra desde el agarre y desde su cabecera.
- Monto en celular: 40–48 centrado, moneda y centavos en gris, formato en vivo, impacto contra el tope debajo (cargado sólido, este rayado).

### Gráficos (05, 07, 08, 14 · `guias/graficos.md` · `ejemplos/graficos.html`)
- **Primero la pregunta**, después el tipo (`guias/graficos.md` §1). Si la respuesta es un número, va un KPI con dibujo.
- Arriba de todo gráfico, la cifra con su delta y período: la conclusión antes del dibujo.
- Ejes mínimos, grilla tenue, sin bordes; leyenda arriba con punto + nombre (+ valor); sparklines sin ejes dentro de tarjetas.
- Dona solo con 2–4 partes, en un tono escalonado; 5–6, barra de reparto; más, ranking con "Otros". Más de 5 barras verticales en celular pasan a horizontales.
- **Estados del dato por forma:** parcial rayado con chip "Mes en curso" (su tooltip dice "sin cerrar", sin comparar); proyectado punteado con punto hueco; período anterior gris punteado; meta como rayita.
- Tooltip oscuro (invertido en oscuro) con ≤ 3 datos: valor | detalle | comparación coloreada por bueno o malo; se abre con mouse, foco y toque; se mide para no salirse.
- SVG al ancho real y redibujado al redimensionar; nunca `preserveAspectRatio="none"` con texto. Con estirado: `vector-effect:non-scaling-stroke` y el punto y el globo en HTML encima. El punto marcado nunca pegado al borde.
- Todo gráfico con ejes: teclado (Tab, flechas, Esc), "Ver como tabla", `aria-label` con la conclusión y una tabla `sr-only` dentro de un div.

### Oscuro (14, 20 · `analisis/17-claro-oscuro.md` · bloque oscuro de `tokens.css`)
El oscuro es **el mismo layout con otros tokens**: mismas posiciones, tamaños, radios, letras y paleta de datos. Lo que cambia es la luz de cada capa, los estados, los grises de datos y la forma de separar. Medido sobre la ref. 20, que muestra la misma pantalla en los dos modos con un deslizador.
- **Escalera de superficies**, ~7 de luz por capa, lo de arriba más claro: lienzo `#0a0a0b` → panel `#111113` → bandeja (`suave`) `#18181b` → tarjeta (`superficie`) `#1f1f22` → hover y capa flotante `#26262a` → borde `#2a2a2e`. **La tarjeta siempre más clara que su bandeja** (como en claro, donde la bandeja es más oscura que la tarjeta blanca); si la bandeja queda más clara, la tarjeta se ve hundida.
- **Nunca `#fff` sobre `#000`** (vibra y cansa): tinta `#fafafa`, lienzo `#0a0a0b`. Los tres textos mantienen su contraste del claro: tinta 15,8:1, `texto-2` 8:1, `texto-3` ≥ 5:1 sobre la tarjeta y la bandeja.
- **Estados y deltas con versión oscura**, más clara y menos saturada (verde `#4ade80`, ámbar `#fbbf24`, rojo `#f87171`, azul `#60a5fa`) y pastilla al 12–20 %. El del claro sobre oscuro no se lee (rojo `#b91c1c` sobre la tarjeta: 2,5:1) y el del oscuro sobre blanco tampoco (verde `#4ade80`: 1,7:1). Por eso **ningún color escrito a mano**: avatares, rayitas, pastillas, deltas e íconos de tipo salen de variables que cambian con `[data-tema=oscuro]`; cuadros de tipo al 18 %.
- **Bordes en vez de sombras.** En oscuro la sombra no se ve: cada tarjeta, campo y control lleva borde de 1 px (+11 de luz sobre su fondo) y las sombras se apagan (`--shadow-min: none`). Las capas flotantes (menú, hoja, modal, toast) suben un escalón (`hover`) y llevan `borde-fuerte`; la sombra negra larga es solo un extra.
- **AA en los dos modos**, medido sobre el fondo real (bandeja incluida). La ref. 20 no pasa en sus metadatos (2,7:1 en claro, 3,3:1 en oscuro), en su verde del claro (2,6:1) ni en su rojo del oscuro (2,5:1): eso no se copia.
- **Gráficos:** conservan sus colores de datos (≥ 3:1 sobre la tarjeta oscura). Baja todo lo que no es dato: grilla a ≤ 1,1:1 (`#26262a` sobre `#1f1f22`), barras "no elegidas", pistas y rayado a `#2a2a2e`–`#3f3f46` (`--color-dato-6`), líneas guía (meta) más oscuras, no más brillantes. Los escalones pastel de un anillo o barra se mezclan con la superficie, no con blanco, para no brillar más que el dato fuerte.
- **Qué se invierte y qué sube.** Se invierte lo único y fuerte: botón principal (blanco con texto oscuro), tooltip, insignia de conteo, opción activa del selector de tema (`bg-tinta text-superficie`). Lo elegido dentro de un grupo (ítem activo del menú, opción del segmentado, pestaña) **no se invierte**: sube un escalón (`superficie` sobre `suave`) con borde, salvo que sea la única selección de la pantalla.
- **Logos e imágenes con fondo.** Un logo oscuro sobre fondo oscuro desaparece: va en cuadro blanco con borde en los dos modos. Fotos con radio, sin sombra; foto de cabecera solo en la franja de ~150 px con degradé hacia el fondo y controles en pastillas translúcidas.
- Barras normales en gris claro; se colorean solo con un estado o como dato nombrado en la leyenda.

### Documentos y correos (`guias/documentos.md` · `ejemplos/documentos/`)
- Hoja A4 (210 × 297 mm) con `@page{size:A4;margin:12mm 14mm 14mm}` y "Hoja N de M" en las cajas del margen.
- El oscuro vive dentro de `@media screen`: papel y PDF siempre claros. Al imprimir, fuera sombras, radios y lo `.solo-pantalla`; `print-color-adjust:exact` en todo color que deba salir.
- Animaciones con estado final como base (si la impresión las corta, quedan completas).
- Páginas fijas: una `.hoja` por página con `break-after:page`; largo variable: `break-inside:avoid` y `thead{display:table-header-group}`. Imprimí a PDF y contá las hojas.
- El total es el único bloque relleno; cada concepto dice por qué se cobra; el estado cambia el contenido (cobrada reemplaza "Cómo pagar").
- Informe con titular que dice la conclusión y 2–3 cifras reales debajo.
- Correos: tablas de 600 px con estilos en línea, sin íconos de fuente, SVG, flex ni variables; un solo botón con versión VML; oscuro con clases `em-*` y `[data-ogsc]`.

---

## 6. Textos e íconos (análisis 14)

### Textos (`guias/textos.md`)
- **Voseo y tipo oración**, sin signos de exclamación ni emojis. El dato primero; una idea por frase; el sistema se hace cargo ("No pudimos…"); nombres, no categorías.
- **Mismo nombre para lo mismo** en botón, pastilla, filtro, toast e historial ("Registrar cobro" → "Cobro registrado").
- **Límites:** botón 3 palabras; ítem de menú 2; título de página 3; subtítulo 3 datos; toast 60 caracteres; metadato 3 piezas con " · "; pastilla 1–2 palabras; ayuda una línea; error 2 frases.
- **Títulos** funcionales que nombran; el subtítulo cuenta cómo está. Saludo solo en el inicio, según la hora de Argentina.
- **Errores:** qué pasó + qué hacer, en el lugar, sin códigos a la vista; si los datos quedaron a salvo, decilo.
- **Toast:** participio + código + monto; consecuencia; Deshacer. Prohibido "exitosamente", "correctamente", "¡Listo!".
- **Estados:** nombres estándar en el género de la entidad ("Cobrada" / "Cobrado"); "Por + verbo" para lo que espera acción ("Por cobrar").
- **Vacíos, tres casos:** primera vez (invita a crear), al día (buena noticia sin botón de crear), filtro sin resultados (nombra el filtro y ofrece limpiarlo).
- **Plurales resueltos en el código**; nunca "(s)", "null", "undefined", "N/A".
- Sin jerga de base de datos ("registro", "ítem", "usuario", "entidad"): el objeto real o la persona por su nombre.
- Metadatos útiles ("3 de 6 hechas · Vence 9 dic", "vuelve mañana 09:00"). Sin taglines ni ayudas obvias.

### Íconos (`guias/iconos.md` · `ejemplos/iconos.html`)
- **Un solo juego: Phosphor 2.1.x**, solo *regular* y *fill*. Nunca thin, light, bold ni duotone; nunca mezclar juegos.
- **Un concepto, un ícono:** buscalo en el mapa de `guias/iconos.md` §7. Un ícono nunca representa dos conceptos. Para uno nuevo, verificá que exista y sumalo al mapa y al `MAPA` de `ejemplos/iconos.html` con su "No usar".
- **Fill solo en:** el ítem activo (menú, barra inferior), sobre fondo de color sólido (cuadradito de entidad, botón principal) y accesos rápidos del celular.
- **Tamaños:** 13 en texto, 14–15 en pies y botones chicos, 17 en menú y botones, 16 en cuadro de 32, 18 en uno de 36, 19–20 en uno de 40. Nunca más de 22.
- **Grises por defecto.** Color solo dentro de un cuadro: de tipo (familia al 12 %, 18 % en oscuro), de estado, de entidad (fill blanco) o logo de proveedor con su color dentro de un cuadro blanco con borde. Sueltos con color, solo `trend-up`/`trend-down` y el `warning-circle` del pie del KPI.
- El cuadro dice el **tipo**; la pastilla dice el **estado**. Solo los avisos que son un estado usan cuadro de estado. Una variante de cuadro por lista.
- Cada ícono dice algo (billetera para el valor del pipeline, sello para lo ganado, diana para la tasa). Avatares: foto, ilustrado o monograma pastel.

### Ilustraciones (`ilustraciones/*.svg` · `ejemplos/ilustraciones.html`)
- Todo vacío, error o momento (bienvenida, éxito, proceso largo) usa las de `ilustraciones/`; nunca un ícono suelto agrandado ni otro estilo. Para una nueva: viewBox 200×160, trazo 1,3 redondeado, círculo guía punteado r 58, piso en y=128, una cara rayada, un solo elemento en acento.
- **Pegalas en línea** (`<svg>` en el HTML o JSX), nunca `<img>`. Variables en `:root`: `--ilus-trazo: color-mix(in oklch, var(--acento) 30%, var(--texto-3))`, `--ilus-acento: var(--acento)` (en oscuro, 62 % con blanco), `--ilus-papel: var(--superficie)`. Si se repite en la página, renombrá el id del `<pattern>`.
- Tamaño: 160–180 en página o tarjeta, 96–120 en hoja o panel, 64 en fila; menos, ícono.
- Detrás, un `radial-gradient` del acento al 7 % (12 % en oscuro; verde si es éxito). Nunca fondo lleno.

## 6b. Vacío, cargando y error (toda pantalla los tiene)
- **Cargando:** esqueletos con la forma final y brillo que pasa; nada si tarda menos de 300 ms (`CargaDiferida`); nunca spinner en el medio. Proceso largo: ilustración animada + barra con avance, cantidad y tiempo restante + "Podés seguir usando el sistema".
- **Vacío:** ilustración, título display 20/500, una frase con un dato real y como máximo dos botones, uno relleno. Los tres casos de §6 Textos; con filtro, "Limpiar «X»".
- **Error:** en el lugar, no en modal (`ErrorEnLugar`: `bloque` reemplaza lo que no llegó, `banda` arriba de datos viejos, `linea` en una fila o pie). Qué pasó y "Reintentar"; los datos que ya estaban quedan a la vista; nota mono gris con código y hora ("ERR-504 · 17 nov 15:42") y el detalle técnico detrás de "Ver detalle".
- **Guardando:** ancho fijo y gerundio; después éxito en el lugar.
- **Sin conexión:** en el dato o en la barra ("Sin conexión · se guarda al volver"), nunca un cartel que tape.

## 6c. Formato de datos (`componentes/datos/formato.ts`)
- Todo número y fecha sale de `formato.ts` (es-AR, zona America/Argentina/Buenos_Aires). Nada de `toLocaleString()` suelto ni `new Date()` del navegador para decidir "hoy"; las fechas `YYYY-MM-DD` son día calendario, sin pasar por UTC.
- **Números:** `1.234.567,89`. En tarjetas, abreviados ("US$ 184,2 mil", "$ 1,2 M"); en tablas, completos.
- **Moneda:** siempre con símbolo o código; si conviven monedas, el código en gris y **nunca se suman**.
- **Fechas:** relativas si son cercanas ("hace 2 min", "ayer 16:00", "mañana"), cortas si no ("9 dic", "9 dic 2025" si es de otro año). 24 h.
- **Porcentajes y deltas:** "+12,4 %" con espacio fino, signo menos tipográfico, flecha y período.
- **Vacíos:** "—" en gris; nunca "0" si no hay dato.
- Pasá los formatos por nombre (`formato="montoCorto"`), nunca como función, para poder usar el componente desde un Server Component.

## 6d. Accesibilidad
- Contraste AA (§4d). El estado nunca va solo por color: palabra, ícono o forma.
- Foco visible en todo lo clickeable: anillo de 2 px del acento con 2 px de separación (`focus-visible:ring-2 ring-acento/40 ring-offset-2`).
- **Todo lo clickeable es `<button>` o `<a href>`**, nunca un `div` con cursor de mano. Casillas de tildar: `<button role="checkbox" aria-checked aria-label="…">`.
- Botones de solo ícono con `aria-label` (obligatorio por tipo) y tooltip; el tooltip se abre con mouse o foco de teclado, nunca con el toque, y pasa sin espera al vecino. Un punto de aviso sobre un ícono exige que el botón lo diga ("Avisos, 3 sin leer").
- Toques de 44 × 44 a menos de 768 px; si el dibujo es más chico, agrandá el área con `::after` o padding.
- Teclado: ⌘K busca, `/` enfoca la búsqueda, Esc cierra y devuelve el foco, Enter confirma, flechas en listas y menús (Inicio/Fin, salto por letra). El resaltado del menú sigue un índice activo (`data-activo`) compartido por teclado y mouse, no `:focus`.
- Hojas y modales: portal, foco atrapado, Esc cierra, el foco vuelve a quien la abrió, la página no scrollea.
- Cambios por arrastre o en lote se anuncian en `aria-live`. Imágenes con `alt` (`alt=""` si son decorativas); ilustraciones `aria-hidden`.
- `prefers-reduced-motion`: sin cuentas ni dibujos; el estado final se ve igual.

## 6e. Del escritorio al celular
- **Cortes únicos:** < 1280 px los KPIs y las tarjetas de entidad pasan a 2, el panel lateral baja y la barra lateral pasa a riel de íconos; **< 768 px es celular**. Si un ejemplo usa otro corte, manda este.
- Celular: sin barra lateral (barra inferior de 4), una columna con márgenes de 16, acción principal en la píldora fija y **no repetida en la cabecera** (`ocultarAccionesEnCelular`).

**Regla dura: en el celular NADA se desliza de costado.** Ni la página ni un componente adentro: tabla, kanban, cronograma, Gantt, fila de KPIs, riel de filtros, pestañas, índice, código. Deslizar de costado para ver el resto de un componente es fricción y esconde datos (pasó en un CRM real: había que arrastrar de costado por componentes enormes). La única excepción es un **carrusel a propósito**: `scroll-snap-type: x mandatory`, cada elemento con `scroll-snap-align`, un indicador visible ("2 de 5" o puntos) y `data-carrusel` en el contenedor. Se usa solo cuando ver una cosa por vez es la tarea (etapas del pipeline, días de una semana, fotos), nunca para meter algo que no entra. La otra excepción es un **lienzo con paneo** (flujo de nodos, mapa, plano): se recorre con el dedo en las dos direcciones, lleva "Ajustar a la pantalla" y `data-lienzo` en el contenedor.

| En escritorio | En celular (< 768) |
|---|---|
| Tabla | tarjetas de 2 líneas por CSS (mismo HTML, áreas por columna): nombre y monto arriba, estado y fecha abajo, casilla con área de 44; sin encabezado ni pie de cálculo |
| Kanban / pipeline | una etapa a la vez: segmentado de etapas arriba y una columna visible, o carrusel a propósito con indicador "3 de 5" |
| Cronograma por días, Gantt, roadmap | lista por día ("Hoy", "Mañana", "Jue 13") con las tareas debajo; el Gantt pasa a lista por proyecto con barra de avance, fecha de fin y "en riesgo" arriba |
| Fila de KPIs | 1–2 columnas (la protagonista a todo el ancho), nunca carrusel |
| Panel lateral de contexto | baja debajo del trabajo, o se abre como hoja inferior con agarre; si es de la pila Actuar, sube arriba de todo |
| Hoja lateral | hoja inferior con agarre |
| Filtros, chips, vistas guardadas | botón "Filtros (3)" que abre una hoja; los chips activos se acomodan en líneas (`flex-wrap`) |
| Pestañas o segmentado que no entran | grilla de 2–3 columnas, o las que sobran en "Más ▾" |
| Ficha de varias columnas | una columna con segmentado fijo arriba (Actividad / Resumen / Datos, abre en Actividad); nunca las tres apiladas |
| Chat en 3 columnas | una por vez: lista → conversación → información en hoja |
| Índice de secciones de un alta | anillos numerados en una fila (el nombre para el lector de pantalla) |
| Bloque de código | `white-space: pre-wrap` |

- **Cómo se garantiza en el código:** todo hijo de flex o grid lleva `min-w-0`; grillas con `minmax(0,1fr)`, nunca `1fr` solo ni `repeat(n, 200px)`; **ningún ancho fijo sin `max-w-full`** (`w-[420px]` → `w-full max-w-[420px]`); tablas, SVG e imágenes con `max-width:100%`; textos largos con `truncate`, `line-clamp` o `break-words`, y números largos (CVU, alias) con `word-break:break-all`. Nunca se esconde el desborde con `overflow-x:hidden` en `body`: se arregla el componente que se sale.
- **Probalo a 360, 390 y 414.** `revisar.mjs` falla si la página o un componente interno scrollea de costado sin `data-carrusel` ni encastre, y si un texto o un control queda cortado en el borde.
- Para mostrar pantallas de celular lado a lado en una galería: cada una a 390 reales achicada con `zoom`; a < 600 px, una sola pantalla real que navega.

## 6f. Movimiento (`guias/movimiento.md` · `ejemplos/movimiento.html`)
- **Prueba de la frecuencia:** lo que la misma persona ve cientos de veces por día (⌘K, pestañas, filtros, tipeo) aparece directo; decenas, solo opacidad o ≤ 180 ms; pocas, completo.
- **Solo tokens:** 120 / 180 / 240 / 320 ms en la interfaz, 700 para contar, 900 para dibujar (total ≤ 1,2 s); escalón de 35 ms, tope 8 ítems y 300 ms, solo en la primera carga.
- **Curvas:** `--ease` para casi todo, `--ease-mover` para lo que ya está y cambia de lugar, `--ease-resorte` solo en confirmaciones. Nunca `ease-in` ni `transition: all`; `linear` solo en el brillo del esqueleto y la barrita del toast.
- Solo `transform` y `opacity` (y `stroke-dashoffset`). Salidas más rápidas que entradas (240 → 180); se entra desde 4–8 px o desde el borde de la capa; escala mínima 0,96, nunca `scale(0)`.
- Barra lateral, barra superior y migas nunca entran animadas. Los datos que se refrescan cuentan desde su valor anterior, no desde 0.
- Lo que abre y cierra (hoja, menú, modal) va con clase + `transition` para poder interrumpirse. Las piezas que aparecen usan `starting:` (`@starting-style`) con `motion-reduce:transition-none`; JS solo para contar (`<Cuenta>`, con el valor final ya en el HTML).
- **Las capas flotantes viven fuera de todo contenedor con `transform`** (rompe `position: fixed`).
- Hover que mueve, siempre dentro de `@media (hover: hover)`. Filas: solo fondo; tarjetas clickeables: suben 2 px con sombra de hover.
- Cambio de vista: fundido + escala .985 + desenfoque 4 px (~140 ms sale, ~300 ms entra).
- **Elemento compartido lista → ficha:** la tarjeta viaja y crece a la ficha en 320 ms con `--ease-mover` (View Transitions). El contenido real reemplaza al esqueleto con un fundido, sin salto.
- Reduced-motion: distancias × `--mueve` (0) y dibujos a fundido de 120 ms.

## 6g. Implementación (React + Tailwind v4)
- Tokens con nombres en español (`bg-fondo`, `text-tinta`, `rounded-tarjeta`, `shadow-min`); recetas en `ejemplos/recetas-tailwind.md`, piezas en `componentes/`.
- Oscuro por `[data-tema=oscuro]` con la variante `[[data-tema=oscuro]_&]:`, nunca `dark:` (en v4 sigue al sistema operativo). Lo invertido se escribe `bg-tinta text-superficie`.
- Controles a 44 px con `pointer-coarse:`; campos a 16 px por debajo de `sm`.
- Un `sticky` que muestra globos o menús lleva `z-index` (arma su propio contexto).
- Colores de SVG por variable en `style={{ fill, stroke, stopColor }}`, no como atributo; patrones y degradés en un `<svg>` oculto compartido.
- Preferencias por persona (tema, vista, columnas) en `localStorage` dentro de try/catch; los datos nunca.

---

## 7. Antipatrones (si aparece uno, rehacer)
- Fondos o menús de marca **saturados**; degradés decorativos; sombras marcadas o negras.
- Neutros de tintes distintos mezclados; `#000` sobre `#fff`; texto más claro que `texto-3`.
- Dos botones rellenos a la vista, o botones de color por acción (verde guardar, rojo borrar).
- Filas pintadas por estado o pastillas saturadas con texto blanco; estado solo con color.
- Encabezados en MAYÚSCULA negrita, líneas verticales fuera de la grilla tipo planilla, tarjetas dentro de tarjetas con borde.
- KPI sin contexto, porcentaje sin período, número coloreado, delta coloreado por el signo; torta para avance.
- Dos familias de texto o más (además de la mono), letras de trazo fino o en 300 que se pierden; 700; tamaños fuera de la escala; texto de menos de 12 px.
- Espacios simétricos o iguales para todo; separar con tarjeta + borde + título + divisor + fondo a la vez; achicar letra para que entre.
- Todo en `tinta` 500; rótulo más fuerte que su valor; títulos que solo nombran sin subtítulo con cifras; lo urgente al fondo.
- Íconos de juegos mezclados, de color sueltos, o sin el activo en fill.
- Formularios que reemplazan la página para algo menor; asteriscos rojos; rojo mientras se escribe; botón deshabilitado sin motivo.
- Modal de confirmación para algo reversible; filas que desaparecen al resolverse.
- Spinner a pantalla completa; vacío sin acción ni dato; "null", "(s)", "exitosamente".
- Foto detrás de datos o texto blanco sobre foto sin degradé; color escrito a mano que no cambia en oscuro.
- Sumar monedas distintas.
- **Pantalla sin aprovechar:** contenedor angosto centrado (`max-width` + `margin:auto`) en una pantalla de trabajo, franja vacía a la derecha a 1920, panel lateral que se estira con la ventana, columnas en px fijos que no llenan el ancho, la grilla de abajo con bordes distintos a la de arriba.
- Lo urgente (vencido, en riesgo, empieza hoy) debajo del cronograma o de la tabla, o un aviso sin su arreglo en la fila.
- **En celular, algo que se desliza de costado:** tabla ancha, kanban de columnas, cronograma o Gantt, fila de KPIs en carrusel, riel de filtros o pestañas, código; un carrusel sin encastre ni indicador; un ancho fijo sin `max-w-full`; un hijo de flex o grid sin `min-w-0`; `overflow-x:hidden` en `body` para tapar un desborde.
- **Oscuro mal hecho:** `#fff` sobre `#000`; estados o deltas con el mismo color que en claro (el rojo del claro sobre oscuro da 2,5:1); tarjeta más oscura que su bandeja; tarjetas separadas solo por sombra; grilla o guías de gráfico más brillantes que los datos; logo oscuro sin cuadro sobre fondo oscuro; invertir a blanco todo lo seleccionado.
- **En el acceso:** campos de solo línea, correo y contraseña lado a lado, principal circular en un rincón, slogans o fotos de stock, todo oscuro por defecto; código casilla por casilla (seis inputs); foto como caja gris mientras carga.
- Arrastre que recién después de soltar dice qué cambió; errores de una corrida en tarjetas de degradé saturado.
- En un overhaul: renombrar o "limpiar" una firma de datos, borrar un comportamiento, mezclar tokens globales con piezas en un commit, apagar la guardia.

## 8. Antes de entregar
- **Simetría:** ¿los bordes coinciden, los hermanos tienen el mismo alto, el padding es simétrico y los íconos están centrados? (§4g)
1. **Revisor:** `node scripts/revisar.mjs <pantalla>`, con `--celular` y `--oscuro` → **≥ 85 en 1440, 390 y oscuro**. Con 85 igual se compara a ojo.
2. **Referencias:** captura al lado de la referencia del mismo tipo y de 06, 07, 08 y 14; si se ve más pobre o más plana, no está terminada. Mirá a 2× bordes, alineaciones y números.
3. **Overhaul:** `node scripts/guardia-datos.mjs --base main` en PASA (lo permitido con motivo y OK); typecheck, pruebas y build verdes; misma red y mismos permisos por rol; lista de comportamiento en [x]; informe con capturas del antes y del después.
4. **Rellenos:** uno por pantalla más uno por capa abierta; acciones de fila en la fila (≤ 2).
5. **Jerarquía:** prueba de 5 segundos, desenfoque (una mancha por bloque), escala de grises, ≤ 3 textos en `tinta` 500 por tarjeta, ≤ 3 tamaños y ≤ 2 pesos.
6. **Espacios:** todos de §4a con la variante del uso (vistazo 24–28 de panel y 28 entre bloques; operación 20 y 16 con bandejas con rótulo); adentro ≤ la mitad de afuera; título de sección 40/12 (28/12 en operación); un borde izquierdo por columna.
7. **Legibilidad:** nada < 12 px, contraste AA, interlineado por tamaño, texto corrido ≤ 72 caracteres, truncado al final.
8. **Vida:** color por entidad, cifras con dibujo, un protagonista, caras, movimiento al cargar; Geist con títulos grandes y firmes.
9. **Cabecera y KPIs:** subtítulo con cifras reales; cada KPI con contexto, delta por sentido y link a su lista.
10. **Color:** 1 acento, estados con palabra, datos ≤ 6, lo normal neutro con el tinte del sistema; nada escrito a mano que no cambie en oscuro.
11. **Radios, sombras e íconos:** radios en capas de `tokens.css`; sombras suaves en sus niveles; Phosphor regular + fill activo, cada concepto con su ícono del mapa.
12. **Datos:** montos `tabular-nums` a la derecha con moneda y centavos en gris, sin sumar monedas; números y fechas de `formato.ts`; "—" para lo vacío.
13. **Estados:** vacío (los tres casos), cargando con esqueleto, error en el lugar con Reintentar, guardando con ancho fijo, éxito en el lugar con Deshacer.
14. **Textos:** pasada la lista de `guias/textos.md` §14 (incluido el grep de palabras prohibidas).
15. **Celular:** a 360, 390 y 414 **nada se desliza de costado** (ni la página ni un componente: tabla → tarjetas, kanban → una etapa, cronograma → lista por día, KPIs → 1–2 columnas, panel → hoja inferior, filtros → hoja); solo carruseles a propósito con encastre, indicador y `data-carrusel`; `min-w-0` en hijos de flex/grid y ningún ancho fijo sin `max-w-full`; toques de 44, acción fija abajo y no repetida arriba, inputs de 16.
16. **Teclado y lector:** todo alcanzable con Tab, foco visible, Esc cierra, `aria-label` en íconos, gráficos con "Ver como tabla".
17. **Movimiento:** tokens, `prefers-reduced-motion` probado, nada animado en el marco ni en acciones de cientos de veces por día.
18. **Peor caso:** nombre de 60 caracteres, monto de 9 cifras, 0 y 40 elementos: el foco sigue en su lugar.
19. **Transversales:** las 10 reglas de §1c, una por una.
20. **Pantalla aprovechada:** a 1280, 1440 y 1920 llena el ancho sin franjas vacías; columna fluida + panel fijo de 320–380; la grilla de abajo hereda las columnas de arriba; densidad según la tarea; "Requiere atención" y "Empieza hoy" arriba con su arreglo en la fila (§4h).
21. **Oscuro:** escalera de superficies (tarjeta más clara que su bandeja), tinta `#fafafa` sobre `#0a0a0b`, estados con su versión oscura, bordes en vez de sombras, AA en los dos modos, gráficos con sus colores y la grilla baja, logos en cuadro; el revisor con `--oscuro` sin avisos de oscuro.
22. **Acceso:** los 7 estados resueltos en el lugar (`guias/acceso.md`), `autocomplete` en cada campo, código en un solo input, y el revisor ≥ 90 con `--galeria` y con `--oscuro`.
