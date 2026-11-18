## Superficies y profundidad: análisis de las 14 referencias

*Las medidas son estimaciones a escala 1x. Las capturas vienen ampliadas entre 1,4 y 2 veces, así que dividí lo que medí en píxeles de la imagen.*

### 1. Patrones observados

**Marco de tres capas, armado con tono y no con sombra.**
- Hay un lienzo con tono (#F4F4F5 / #F5F5F4 cálido), sobre él un panel de contenido blanco y tarjetas adentro.
- Se ve en 02, 03, 04/05, 06, 07 y 13: el marco externo tiene radio ~24–28 px y el panel principal ~16–20 px, con borde hairline de 1 px (#E8E8EB).
- El menú lateral no tiene superficie propia: está apoyado en el lienzo (02, 06, 07, 13). En 10 el lateral lleva un degradé muy suave.

**Radios concéntricos: cada nivel hacia adentro baja 4–8 px.**
- 02/03: marco ~24 → panel ~16 → tarjeta ~12 → evento o sub-bloque ~8 → chip ~6.
- 09 (celular): contenedor gris ~24 → ítem interior ~18–20.
- 08: tarjetas ~24 → tiles internos ~14–16 → botón de ícono circular.
- Chips y etiquetas: 4–6 px (06 "Medium/Backend", 03 "Work/Mobile", 07 "Paid").
- Botones secundarios: 8–10 px. Botón principal en celular: pill completo (12, "View PDF").

**Tarjetas sin sombra: borde hairline o cambio de tono.**
- 01, 06, 07, 13 y 14 usan 1 px #E5E7EB (en oscuro, #26262A) y nada más.
- 09 y 11 resuelven el contraste sin borde: tarjeta gris #E6E6E6 sobre fondo #EFEFEF, o tile blanco sobre #F5F5F5.

**La sombra existe, pero solo en lo que flota.**
- Menú contextual, toast y modal (01).
- FAB (09).
- Pastilla activa del control segmentado (02 Day/Week/Month, 05 "Storage", 07 "All", 14 "Monthly"): sombra mínima, tipo `0 1px 2px rgb(0 0 0/.06)`.
- Botón oscuro principal (07): sombra leve.

**Tarjeta dentro de tarjeta (anidado tonal).**
- 07: el KPI tiene la cabecera "Gross volume" sobre gris claro y el valor en una sub-tarjeta blanca con borde.
- 06: el KPI tiene cuerpo blanco y una franja inferior con ícono y delta. Las tarjetas de proyecto se cortan en bandas a todo el ancho (texto / gráfico sobre #FAFAFA / "Next steps").
- 02/03: la tarjeta de la columna derecha es gris #F7F7F8 y los bloques internos van separados por aire.
- 08: tiles grises de "Unused Software" dentro de la tarjeta blanca.

**Separadores.**
- Las filas de tabla llevan línea de 1 px #EEE (05, 07).
- Las listas de actividad usan línea fina o solo aire (01 separa por espacio, ~12 px entre ítems).
- Las métricas dentro de una tarjeta se dividen con líneas verticales (14: PR | EPI | Avail.; 13: Backlog | Not started).
- Los grupos del menú lateral se separan con un rótulo en mayúsculas grises (11–12 px, tracking amplio) y no con líneas (02, 04, 07).

**Encabezado de tabla con relleno.**
- 07: fila de encabezado gris #F7F7F8, radio 8, texto 12–13 px gris.
- 05: encabezado sin relleno, con hairline.

**Tamaños de control.**
- Botones y campos: 32–36 px de alto en escritorio (02 "Show Filters", "Import").
- Barra de búsqueda: ~36 px, gris #F4F4F5 sin borde (13) o blanca con hairline (02).
- Botones de acción en fila: cuadrado de 28–32 px con borde (05 "⋮").

**Espaciado.**
- Padding de página dentro del panel: 20–24 px.
- Padding de tarjeta: 16–20 px (en 01 y 06, densas: 12–16 px).
- Gap entre tarjetas: 12 px (06, 08) a 16 px (07, 14).
- Separación entre secciones ("Summary" → "Ongoing work" en 06): 32–40 px.
- Título de sección a tarjetas: 12 px.
- Ícono a texto: 8–12 px.
- Ícono en tile de 32–40 px con radio 8–10 (03, 12).

**Escala de espaciado (base 4):** `4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48`.
- Uso real: 8 dentro de un control, 12 entre elementos de un bloque, 16 de padding de tarjeta, 24 de padding de panel, 32–40 entre secciones.

**Modo oscuro (14).**
- Fondo #0B0B0C, tarjeta #18181B con radio ~12, sin borde visible o con #232326.
- Las divisiones internas son hairline #2A2A2E.
- Los acentos de estado son la única luz.

### 2. Reglas

1. Usá exactamente tres planos: lienzo con tono, panel blanco y tarjeta blanca con borde 1 px. Nunca pongas una tarjeta blanca sobre blanco sin borde.
2. Calculá el radio de un contenedor anidado como el radio del padre menos su padding interior. Mínimos: tarjeta 12, sub-bloque 8, chip 6.
3. Nunca le pongas `shadow` a una tarjeta estática. La sombra queda para popover, menú, modal, toast, FAB y la pastilla activa del segmentado.
4. Los bordes son siempre de 1 px y de un solo color de token (`--border` ≈ #E7E7EA). Prohibido usar 2 px o bordes de color, salvo en el foco.
5. Todo espacio sale de la escala 4/8/12/16/20/24/32/40. No se usan 10, 14 ni 18.
6. Padding de tarjeta: 16 px en escritorio, 12 px en tarjetas densas o en celular. Padding de panel: 24 px. Gap de grilla: 12–16 px.
7. Separá secciones con 32–40 px de aire y un título, nunca con una línea gruesa ni con un fondo de color.
8. Las filas de tabla van separadas con hairline. El encabezado lleva relleno gris claro y radio 8, o hairline: elegí uno por sistema.
9. Para subdividir una tarjeta, usá bandas a todo el ancho (`border-t` o un fondo apenas más gris) y no tarjetas flotantes separadas.
10. Las métricas en fila dentro de una tarjeta se dividen con `divide-x` hairline.
11. Controles a 32–36 px de alto en escritorio. En celular, mínimo 44 px. La acción principal del celular es un pill de 48–52 px fijo abajo.
12. Los filtros por vista van en control segmentado (bandeja gris + pastilla blanca activa), no en botones sueltos.
13. Los íconos de lista van en un tile de 32–40 px, radio 8–10, con fondo del color de estado al 10–12 %.
14. En oscuro, invertí los planos con tonos (#0B0B0C / #18181B / #232326) y no sumes sombras.

### 3. Antipatrones que evitan

- Sombras "material" grandes en tarjetas y elevación decorativa.
- Bordes gruesos o de color en contenedores, y franjas de color en el borde izquierdo.
- Radios mezclados al azar (un botón de 4 junto a una tarjeta de 20 y otra de 8).
- Fondos de sección saturados.
- Tarjetas dentro de tarjetas que también llevan sombra.
- Separadores de 2 px o líneas oscuras.
- Padding apretado (<12) en tarjetas que no son densas.
- Usar líneas para separar grupos del menú lateral.
- Degradés en superficies de trabajo (solo aparecen en el héroe de 08 y en 14, como foto o acento).
