## Estructura de página y layout: análisis de 14 referencias

*Todos los px son estimados. Las capturas son mockups escalados (aprox. 1,6–2x), así que normalicé a 1x.*

### 1. Patrones observados

**El marco de la app**
- **Lienzo gris con el área principal como tarjeta.** El fondo de la ventana es gris claro (~#F4F4F5 / #F5F5F7). La barra lateral va directo sobre ese gris. El área principal es una tarjeta blanca o casi blanca (#FCFCFC) con radio de ~12–16px, separada ~8px del borde y de la barra. Se ve en 02, 03, 04, 07, 10, 13 y 14 (en 14 es oscuro: tarjeta ~#0E0E0E sobre negro).
- **Variante plana.** En 01 (Axon) no hay tarjeta: la barra y el área principal se separan con una línea de 1px.
- **Ancho de la barra lateral.** Unos 240–260px. Arriba va el logo o un selector de espacio de trabajo con flechas (06, 14). Después, opcionalmente, una búsqueda (06, 14).
- **Grupos de la barra.** Cada grupo lleva un rótulo de ~11px, gris (~#9CA3AF), muchas veces en mayúsculas con tracking (02 "INSIGHT & CONTROL", 07, 13), y a veces se puede plegar con un chevron.
- **Ítems de la barra.** Ícono de 16px y texto de 14px. Altura de ~32–36px y radio de ~8px. Los conteos van alineados a la derecha (01 "78", 06 "9/7/3", 13 "12").
- **Ítem activo, tres estilos:**
  - relleno negro con texto blanco (02, 03);
  - pastilla blanca sobre la barra gris (04, 06, 10);
  - gris un tono más oscuro (07, 13, 14).
- **Pie de la barra.** Abajo de todo va la tarjeta del usuario: avatar, nombre y rol (02, 03, 10, 14). Encima, a veces, una tarjeta de promoción descartable (02, 06, 14).
- **Doble navegación.**
  - 13: riel de íconos de ~64px + panel secundario de ~260px + contenido.
  - 04: barra principal + columna de ajustes de ~220px dentro de la tarjeta.
  - 08: barra superior de pastillas + riel de íconos de ~56px.

**Barra superior de la tarjeta**
- Altura de ~56px, separada del resto con una línea de 1px.
- Izquierda: migas de pan (ícono + "Sección / **Página**", donde el padre va en gris y la página actual en negro), con flechas de atrás y adelante en 03 y 04. Se ve en 01, 03, 04, 07, 10 y 13.
- Derecha: búsqueda de ~200–280px, Ayuda y avatar (01, 07, 13), o un único botón primario "+ Create" (02, 03).

**Cabecera de página**
- Título de ~20–24px en semibold. Debajo, un subtítulo de 13–14px en gris que **resume el estado con cifras** ("78 unread · delivered in-app, by email and in Slack" en 01) o el alcance (07).
- Las acciones van arriba a la derecha, alineadas con el título: 1–2 botones con borde + **un solo** botón relleno oscuro o de acento (01, 06, 07, 08).
- Variante de saludo (06): fecha chica + saludo de ~32–36px.
- Variante de ficha (03): tarjeta con foto de 64px, nombre de ~24px, subtítulo y, a la derecha, botones de solo ícono de 36px (correo, teléfono, video) + botones con texto + menú ⋮.

**Barra de herramientas** (02, 07)
- Una fila con filtros, selector de vista (íconos o segmentado), búsqueda que se estira con la pista ⌘K, y a la derecha Importar y "+ Agendar".
- Los segmentados (Día/Semana/Mes, Todo/Online/…) son contenedores grises con la opción activa en blanco, en 02, 04, 05, 07 y 14.

**Fila de indicadores**
- Entre 4 y 6 tarjetas iguales (06: 6 · 07, 08, 14: 4), de ~110–160px de alto y separadas ~12–16px.
- Cada una lleva: rótulo de 13px arriba, número de ~28–32px, y abajo una variación o contexto (verde, rojo o gris). A veces hay una franja al pie separada por una línea (06).

**Cuerpo en dos columnas, ~70/30**
- 01: lista ~70% + panel de Entrega ~30%.
- 02: calendario ~73% + panel de reunión ~27%.
- 07: gráfico ~68% + planes ~32%.
- 08: ~65/35.
- El panel derecho tiene ~340–380px fijos y se arma con tarjetas apiladas. En 02 cierra con un par de botones al pie (secundario con borde + primario negro).
- Ficha de contacto (03): 3 columnas ~1 : 1,6 : 1. Datos a la izquierda, actividad con pestañas y conteos al centro ("Activity 16", "Tasks 4"), empresa relacionada a la derecha.

**Bloques y densidad**
- Cada bloque es una tarjeta con borde de 1px (~#ECECEE), radio de ~12px, padding de ~16–20px y sombra casi nula.
- Cada bloque arranca con un título de 15–17px, más "N Total" o "Ver todo" a la derecha (03, 07, 09).
- Las listas se agrupan por fecha con separadores "Hoy / Ayer" (01).
- Filas:
  - tabla de ~38–40px con encabezado gris claro (07);
  - lista de dos líneas (título + metadatos "Categoría · hace 2 min") de ~56–64px (01).
- Grillas de tarjetas de 4 columnas iguales (06, 14). Debajo del título de cada sección va un subtítulo con el conteo: "12 of 17 sites · select one…" (14).

**Capas por encima del contenido**
- Panel lateral de ~370px que entra desde la derecha sobre el contenido atenuado, con pie Cancelar/Guardar (01).
- Menú contextual desde ⋯ (01).
- Aviso abajo a la derecha con "Deshacer" (01).

**Celular** (09, 11, 12)
- Márgenes de ~16–20px.
- Cabecera con botones circulares de 40px a los costados y título centrado.
- Arriba, la cifra protagonista de ~32–40px con su variación.
- Después, 3–4 accesos rápidos en grilla.
- Secciones con título + "Ver todo".
- Filas con ícono de 40px + dos líneas + monto a la derecha.
- Barra inferior de 4 íconos, o un botón primario negro a todo el ancho y fijo abajo (12). Botón flotante en 09.

### 2. Reglas

1. **Armar el marco así:** lienzo `bg-zinc-100`, barra lateral de 248px sobre el lienzo, y contenido en una tarjeta `bg-white rounded-2xl border` separada 8px.
2. **Agrupar la barra en 3–5 secciones** con rótulo de 11px gris. Ítems de 34px, ícono de 16px y conteos a la derecha. El usuario siempre al pie.
3. **Usar una sola barra superior** de 56px: migas de pan a la izquierda, búsqueda y avatar (o el botón primario global) a la derecha. Nunca repetir el título de la página en ella con el mismo peso.
4. **Toda página lleva cabecera:** título de 22px semibold + subtítulo gris con cifras reales del estado. Las acciones van a la derecha, en la misma fila.
5. **Máximo un botón primario relleno por pantalla.** El resto, con borde o de solo ícono.
6. **El orden vertical es fijo:** cabecera → filtros y vista → indicadores (4–6 iguales) → cuerpo. Nunca poner indicadores debajo de una tabla.
7. **Cuerpo con contexto:** usar `grid-cols-[1fr_360px]`, con el panel derecho de 340–380px fijos. Una ficha va en 3 columnas `[1fr_1.6fr_1fr]`.
8. **Todo bloque es una tarjeta** con borde de 1px, radio de 12px, padding de 20px y título + conteo o enlace a la derecha. Separación entre tarjetas de 12–16px.
9. **Filas de tabla de 40px; listas de dos líneas de 56–64px.** Los metadatos van en una sola línea gris unida con "·".
10. **Agrupar listas temporales** con separadores "Hoy / Ayer / Esta semana".
11. **Para cambiar la vista o el filtro rápido** usar un segmentado gris con la opción activa en blanco, nunca pestañas subrayadas sueltas. Excepción: las pestañas de detalle (03, 13) llevan conteo.
12. **Las ediciones secundarias se abren en un panel lateral derecho** de 380–420px con pie Cancelar/Guardar. Nada de navegar a otra página.
13. **Cada acción reversible muestra un aviso** abajo a la derecha con "Deshacer".
14. **En celular:** una columna con márgenes de 16px, la cifra protagonista arriba, accesos rápidos en grilla de 3–4 y la acción principal fija abajo a todo el ancho.

### 3. Antipatrones que estas referencias evitan

- Cabeceras de color a todo el ancho y barras laterales oscuras saturadas. La excepción es la foto de 14, que va dentro de la tarjeta.
- Tablas o listas sueltas sobre el lienzo, sin tarjeta.
- Contenido centrado y angosto con márgenes vacíos. El contenido llena la tarjeta.
- Varios botones primarios compitiendo.
- Sombras pesadas o bordes de 2px.
- Formularios que reemplazan la página para editar algo menor.
- Indicadores de distinta altura o ancho en la misma fila.
- Títulos sin cifra que digan qué hay.
- Más de dos niveles de navegación visibles sin jerarquía clara.
