## Espacio y uso de la pantalla: referencias 15 a 20

Qué se midió: márgenes, gutters, padding de tarjetas, espacio entre secciones, alto de filas, tamaños de letra, cómo se reparten las columnas para llenar el ancho, densidad y dónde ponen lo urgente.

**Cómo se midió.** La 20 sale de un video a 1600 × 1200 donde la app mide 1440 px de ancho a escala 1:1, así que sus valores son píxeles reales (barridos de píxel con un script sobre cuadros exportados en PNG). Las 15, 16, 17, 18 y 19 son capturas en las que la app ocupa entre 1764 y 1866 px de imagen. Se pasaron a una ventana de 1440 dividiendo por la escala de cada una (15 y 19: ÷1,30; 16: ÷1,22; 17 y 18: ÷1,25). Son **estimados de ±2 px**. Las proporciones (qué parte del ancho ocupa cada columna) son exactas.

Por qué importa: en el CRM, en el celular, había que deslizar de costado por componentes muy grandes. Eso rompe la fricción cero. Estas referencias muestran lo contrario: en escritorio **llenan todo el ancho sin huecos**, con columnas que crecen. Ninguna obliga a buscar el contenido de costado, salvo un caso (la 18) que lo marca con un indicador.

---

### 20 · Panel de ventas de un restaurante (video claro/oscuro, valores reales)

| Medida | Valor |
|---|---|
| Barra lateral | 260 (ítems de 236 de ancho con 12 de margen; ítem 40 de alto, paso 41; subítems con paso de 34) |
| Barra superior, sobre el lienzo y sin borde | 75 de alto, controles de 36–40 |
| Panel principal | separado 1 px de la barra y 9 del borde derecho e inferior; borde 1 px |
| Barra de migas dentro del panel | 42 de alto con `border-b` |
| Padding del panel | **20** a los costados, 21 arriba hasta la fila del título, 20 abajo |
| Fila del título | 36 de alto (botones Filtros y Período de 36); título 20/500 |
| Título → primer bloque | **16** |
| Bandeja | rótulo de 34 de alto (ícono + rótulo + recargar a la derecha); padding **4**; radio ~16; tarjeta adentro radio ~12 |
| Gap horizontal entre bandejas | **12** (11–13) |
| Gap vertical entre bloques | **16** (517 → 533, 870 → 886) |
| Padding de la tarjeta interna | **16** (cifra a 15–16 del borde) |
| Fila de KPIs | 3 bandejas de 434 / 436 / 236 = `minmax(0,1.85fr) minmax(0,1.85fr) minmax(0,1fr)`; la tercera es angosta porque su contenido (un tiempo y una barra) es más chico |
| Bloque del gráfico | una bandeja con dos tarjetas: gráfico 776 + panel 338, separadas 5 = `minmax(0,1fr) 340px` |
| Tabla | encabezado 36, filas de **56** con miniatura de 32 y dos líneas; 4 columnas repartidas con fr |
| Letras | título 20, cifra de KPI 22–24/500, cifra del panel 20, texto 13–14, rótulo de bandeja 11 mono en mayúscula, ejes 12 |
| Densidad | a 1440 × 1012 entran 3 KPIs con dibujo, el gráfico de 7 días con meta, el panel lateral y la tabla de los 2 primeros, sin scroll |

**Patrón:** todo el ritmo vertical es 16 y el horizontal 12. No hay un solo espacio "de aire" de 28 o 40 en la pantalla, y aun así respira porque cada bloque es una bandeja con su rótulo arriba. El aire lo pone la bandeja (padding 4 + rótulo de 34), no el margen.

### 15 · Chat en tres columnas

| Medida | Valor estimado (1440) |
|---|---|
| Reparto | riel de espacios 4 % (~62) · barra de canales 16 % (~233) · conversación **fluida** 60 % · panel de información 18 % (~265–300) |
| Barra de canales | ítem 28–30 de alto con paso de 27; conteo gris a la derecha en cuadrito con borde; rótulos de grupo 12 gris con chevron |
| Mensajes | avatar 36, nombre 14/600 + hora 12 gris en la misma línea, cuerpo 14/1,6; 20 de separación entre mensajes; reacciones en pastillas de 24 |
| Compositor | fijo abajo, con todo el ancho de la columna (alto ~95), herramientas a la izquierda; Descartar (gris) y Enviar (negro) a la derecha |
| Panel derecho | pestañas segmentadas (Info / Pins / Files / Links) arriba; "Main info" como pares rótulo a la izquierda y valor a la derecha, paso de 34; miembros con paso de 37 (avatar 28 + nombre y rol en dos líneas + pastilla de área a la derecha) |

**Patrón:** la columna del medio crece y las de los costados quedan fijas. El panel derecho no es una ventana aparte: es contexto siempre a la vista. **Lo que no se copia:** el texto de los mensajes corre hasta ~120 caracteres por línea. En un sistema, la columna crece pero el texto corrido se corta en 68–72 ch.

### 16 · Reporte con vista previa A4 y panel Compartir

| Medida | Valor estimado (1440) |
|---|---|
| Barra lateral | ~246, ítems con paso de 36 |
| Panel | padding ~20, cabecera con título 24/500 y subtítulo de metadatos reales ("Monthly P&L snapshot · generated Dec 1, 8:00 AM · 2 pages") |
| Reparto | vista previa **fluida** (~775) + panel Compartir **fijo ~340**, gap ~20 |
| Vista previa | bandeja gris que contiene la hoja A4 centrada (~527 de ancho). Es lo único centrado de la pantalla, porque representa papel. Segmentado "Page 1 / Page 2" arriba a la derecha |
| Panel Compartir | rótulo 13/500 → campo a 6; campo 40; entre campos 16–20; formato en dos tarjetas elegibles lado a lado (1fr 1fr); link de solo lectura en bandeja; "Recent deliveries" como lista de 2 líneas con cuadro de ícono de 32 |
| Acciones | Edit report y Download PDF con borde en la cabecera; la principal (Send now, rellena) va al pie del panel, junto a Schedule con borde |

**Patrón:** el panel lateral fijo lleva la acción principal y la cabecera queda con botones de borde (igual que la regla de §5 "Botones rellenos" para un panel de contexto con la acción principal).

### 17 · Cronograma de obras ("Needs attention" y "Starts today" arriba)

| Medida | Valor estimado (1440) |
|---|---|
| Barra lateral | ~224, ítem paso 34, rótulos de grupo 11 en mayúscula |
| Arriba de todo | dos listas lado a lado: **Necesita atención (4)** ~57 % y **Empieza hoy (3)** ~43 %, gap ~40; filas de **38** con avatar 20, tarea, persona en gris y, a la derecha, el motivo con ícono de color ("Overdue · due Oct 27 · 75% complete", "Invalid dates · Nov 5 – Oct 12 · **Fix dates**") |
| Cronograma | tarjeta a todo el ancho: columna de etiqueta ~133 + 5 días de ~206 = `140px repeat(5,minmax(0,1fr))`. Los días llenan el ancho exacto, sin hueco a la derecha |
| Cabecera de proyecto | 48 de alto: nombre 16/500 + tipo gris + selector; a la derecha fecha límite, barra de avance y "12/30 completed tasks", y 6 íconos de 32 |
| Día | encabezado 34 (12 en mayúscula), hoy teñido en azul con subrayado de 2; bloque de tarea título 14/500 + "8:00 AM for 4 hours" 13 gris + persona; "+ 5 hours open" como hueco libre |
| Segundo proyecto plegado | tira de datos (cliente, tipo, código de puerta, teléfono, correo, mapa) y fila de personas por rol (rótulo 11 en mayúscula + avatar + nombre + teléfono) |

**Patrón:** **lo urgente arriba y con su arreglo en la fila** ("Fix dates"). El cronograma llena el ancho dividiendo el espacio por la cantidad de días; si la ventana crece, cada día se ensancha.

### 18 · Cronograma de obras, segunda versión

| Medida | Valor estimado (1440) |
|---|---|
| Arriba | una tarjeta partida al 50 % con divisor vertical: **Empieza hoy (2)** y **Necesita atención (4)**; filas de 32–33; motivo a la derecha con ícono ("Same worker, both at 8:00 AM", "6 tasks due", "Date out of order · Oct 12 listed after Oct 15") |
| Tarjeta de proyecto | columna izquierda fija ~110 (cuadro "6 Due", "6/30 Completed tasks" con barra, fecha límite) + contenido con pestañas General / More info / Project financials |
| Días | encabezados en pastilla gris (hoy en celeste), flechas entre días, tarjetas de tarea de ~185 |
| Desplazamiento | el cronograma **sí se desliza de costado en escritorio**, con barra de desplazamiento visible y un chip ámbar "‹ 6 DUE" a la izquierda que avisa que hay vencidas fuera de la vista |

**Patrón:** el único scroll de costado de las 6 referencias está marcado (barra visible + chip que dice qué hay afuera) y es de escritorio. En celular ese mismo componente se convierte en lista por día (§6e).

### 19 · Roadmap con Gantt, anillos, carga del equipo e hitos

| Medida | Valor estimado (1440) |
|---|---|
| Barra lateral | ~200, ítem paso 31; proyectos con punto de color y conteo; tarjeta "Sprint 14 · Day 6/10" con barra al pie |
| Panel | padding ~22; título 20/600 + subtítulo "4 projects · 63 open tasks · Oct 6 – Dec 14" |
| KPIs | 4 iguales `repeat(4,minmax(0,1fr))`, gap ~13, alto ~76: anillo de 40 a la izquierda + rótulo 12 + cifra 18–20 + metadato 12 ("Checkout beta slipping 4 days") |
| Cuerpo | `3fr 1fr`, con la columna derecha **del mismo ancho que el cuarto KPI** (~288): la grilla de abajo hereda las columnas de arriba y todos los bordes coinciden |
| Gantt | columna de tareas ~170 + 10 semanas a 1fr; filas de **30**; grupo con punto de color + nombre 14/600 + conteo; línea de hoy roja con punto; barra con % adentro, lo que falta en el mismo tono al 25 %, "Not started" teñido |
| Carga del equipo | nombre + "46h / 40h" (rojo si se pasa) y barra de 4 debajo; filas de ~42 |
| Hitos | cuadro de fecha (mes 11 en mayúscula + día 16) + título 14/500 + proyecto con punto; filas de ~47 con chevron |

**Patrón:** 4 columnas que se repiten de arriba abajo. El Gantt ocupa 3 y el contexto 1. Lo que está en riesgo va como KPI y en rojo en la carga ("46h / 40h").

---

### Patrones comunes

**1. Llenar el ancho, no centrar.** Ninguna de las seis usa un contenedor angosto centrado con márgenes vacíos a los costados. La receta es siempre la misma:
- una columna de trabajo **fluida** `minmax(0,1fr)` + un **panel lateral fijo** de 290–340 (20: 338; 16: ~340; 19: ~288; 15: ~265–300);
- filas de KPIs a todo el ancho con `fr` (iguales en 19; desiguales en 20, según cuánto contenido tiene cada una);
- grillas de tiempo (días, semanas) divididas en `1fr` para que el último día toque el borde (17, 19);
- la grilla de abajo **hereda las columnas** de la de arriba (19: el panel derecho = el ancho del cuarto KPI).

**2. Spacing de operación: más apretado de lo que creíamos, y ordenado por proximidad.**

| Medida | Referencias | Antes en la skill |
|---|---|---|
| Padding del panel | 20 (20), ~20 (16), ~22 (19) | 24 arriba, 28 a los costados |
| Gap entre tarjetas | 12 (20), ~13 (19) | 14 |
| Entre bloques grandes (KPIs → cuerpo) | **16** (20), ~16 (19), ~20 (17) | 28 |
| Título de página → primer bloque | 16 (20), ~24 (19) | sin valor |
| Padding de bandeja | 4 (20) | 4 (igual) |
| Rótulo de bandeja | fila de 34 (20) | sin valor |
| Padding de tarjeta | 16 (20, 15) | 16–24 |
| Panel lateral fijo | 290–340 | 360 |

Los 28 y 40 de la skill valen para pantallas de **vistazo** (inicio, dirección). En pantallas de **operación** (cronograma, reporte, tablero de ventas) las referencias usan 16 entre bloques y 20 de padding. La jerarquía la sostiene la bandeja con su rótulo, no el aire.

**3. Alto de filas según tarea.** Lista de avisos 32–38 (17, 18), metadatos del panel 34 (15), Gantt 30 (19), tabla con miniatura 56 (20), mensajes de chat por contenido (15), hitos y carga 42–47 (19). Ítems del menú: 31–41.

**4. Lo urgente arriba, con el arreglo en la fila.** 17 y 18 abren con "Necesita atención" y "Empieza hoy" lado a lado, antes del cronograma. Cada fila dice el motivo y, si se arregla ahí, el botón ("Fix dates"). 19 pone "At risk · 1 project · slipping 4 days" en un KPI. 20 marca "Low stock" en ámbar en la barra lateral.

**5. Cabeceras compactas.** Título de 20–24 con subtítulo de datos reales; nada de títulos de 40 en pantallas de operación.

**6. Densidad según tarea.** El chat (15) y el reporte (16) dejan aire porque se leen. El cronograma (17, 18), el roadmap (19) y el panel (20) son densos porque se recorren. Ninguna mezcla las dos dentro de un mismo bloque.

**7. Al crecer de 1280 a 1920.** Crece la columna fluida (gráfico, cronograma, Gantt, conversación). Los paneles laterales quedan fijos y las grillas de KPIs se estiran. Nunca aparece una franja vacía a la derecha.

### Del escritorio al celular (lo que estas pantallas necesitan para no deslizar de costado)
Las seis son de escritorio. Llevadas al celular sin transformar, cada una obliga a deslizar de costado: el cronograma de 5 días, el Gantt de 10 semanas, las 3 columnas del chat, la tabla de 4 columnas. La regla de §6e sale de acá:

| Componente | En celular |
|---|---|
| Tabla (20) | tarjetas de 2 líneas |
| Cronograma por días (17, 18) | lista por día ("Hoy", "Mañana"…) con las tareas debajo |
| Gantt (19) | lista de tareas agrupada por proyecto con barra de avance y fecha de fin |
| Necesita atención + Empieza hoy | apiladas, primero la de atención |
| Panel lateral fijo (15, 16, 19, 20) | baja debajo o se abre como hoja inferior |
| Chat en 3 columnas (15) | una columna por vez: lista → conversación → info en hoja |
| KPIs (19, 20) | 1–2 columnas |
| Vista previa A4 (16) | la hoja a todo el ancho; Compartir en hoja inferior |
