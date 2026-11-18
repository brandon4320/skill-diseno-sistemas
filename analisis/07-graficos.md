## 1. Patrones observados (visualización de datos)

**Barras apiladas por canal (07):** 12 columnas mensuales, ancho de barra de aprox. 45% del paso. Tres segmentos (naranja rojizo ~#FF5A2C abajo, rosa ~#F472B6 en el medio, azul ~#4F8EF7 arriba) separados por un hueco blanco de 2-3 px. Cada segmento tiene esquinas redondeadas de unos 4 px. El eje Y muestra solo 5 marcas ($0/20K/40K/60K/80K, en gris de ~11px) y la grilla es punteada y muy tenue (~#EEE). La leyenda va en línea con el subtítulo, con un punto cuadrado de 8 px por color y sin caja.

**Marca de período parcial (07):** el mes en curso ("Dec") repite los mismos colores, pero lavados y rayados en diagonal (los colores al ~30% sobre blanco). Encima lleva un chip "MTD" con borde de 1 px, radio de ~4 px y 10-11px. Así el mes incompleto nunca se lee como una caída.

**Barras de progreso segmentadas/punteadas en KPIs (07):** debajo de cada cifra hay una fila de ~50 trazos verticales de 2 px. La parte llena va en el color de la métrica (rojo, azul, verde o amarillo) y el resto en gris ~#E5E5E5. Abajo va la variación con flecha y color semántico (verde +15,2%, rojo −3,1%) seguida del texto "vs. prior period" en tinta oscura.

**Progreso por segmentos discretos (06):** son 10 bloques de ~24×6 px con 3 px de separación y radio de 2 px. Se llenan "1 de 10" en el color de su proyecto y a la derecha va el % en número tabular. La misma barra se usa en las tarjetas de equipo para las tareas abiertas (06, abajo).

**Barras horizontales con resto rayado (07 "Harbor Club plans"):** la parte llena es sólida con degradé leve y termina en una "manija" vertical más oscura de ~4 px. El resto queda rayado en gris claro. Arriba de cada barra: el nombre, la fórmula en gris ("450 × $12") y el monto alineado a la derecha.

**Barras rayadas como estilo base (08, 09):** en 08 todas las barras llevan rayado diagonal verde azulado (~#2F8F83 al 60%). La activa pasa a sólida y más oscura, y su título de columna sube de gris a negro ($42,8K). Las demás quedan atenuadas. Encima de cada barra flota una rayita que marca la meta o el período anterior. Las barras se unen por una silueta suave tipo cascada. En 09 las barras celestes rayadas (~#06B6D4) se apoyan sobre un carril gris claro con radio completo (~12 px).

**Tooltip (08, 11):** en 08 es una píldora negra (~#111) con radio de 8 px y texto blanco de 12px, dividida en 3 datos con separador "|" (monto | participación | comparación, con el negativo en rojo). En el gráfico de línea de 08 la burbuja es negra y chica ("$241K") con un punto en el vértice. En 11 la tarjeta es blanca con sombra suave, monto en negrita y fecha en gris, y una guía horizontal punteada cruza al nivel del punto activo (punto azul de 8 px con aro blanco).

**Líneas y sparklines (06, 08):** en 06 los sparklines (~60 px de alto) usan el color del proyecto, con trazo de 1,5 px y relleno de área solo en el pico (degradé al 15%). No tienen ejes, apenas una leyenda al pie ("12 updates · 14 days" / "1 done"). En 08 las líneas de los KPI llevan área en degradé hacia transparente, eje X con meses en gris, el mes activo resaltado en naranja y una guía vertical en el punto activo. La línea de flujo de caja termina en una guía vertical punteada sobre "Dec", que queda en negrita.

**Donas y anillos (09, 11, 13, 14):** en 11 la dona es gruesa (grosor de ~35% del radio), con escala monocromática de azules (#0B4FA8 → #BFDBFE). El resto queda gris ~#EEE y los segmentos no llevan etiquetas. Abajo van filtros de período (1D/1W/1M/3M/1Y) en píldoras. En 09 el anillo de progreso blanco al 70% va sobre una tarjeta celeste con el % centrado. En 13 los mini anillos de ~40 px muestran el número dentro y un trazo segmentado. En 14 el anillo rojo de 75% acompaña a "Inspection coverage".

**Barras de reparto (04/05):** una sola barra de 8-10 px con radio completo y 6 segmentos categóricos sin separación (violeta, celeste, verde, amarillo, coral). El tramo libre queda en gris. La leyenda va abajo con un cuadrado de 12 px, el nombre en gris y el valor en negro, y el total ("94%") alineado arriba a la derecha. En la tabla se repite el color como una píldora vertical de 3 px junto al % (05).

**Tablero oscuro (14):** usa barras de 4 px con ranking numerado. Solo la primera fila va en rojo; el resto queda en gris. En las barras de estado, verde/amarillo/rojo/gris codifican Online/Parcial/Offline/Libre. Las cifras van en monoespaciada grande y la unidad en gris pequeño ("140.9 kWh"), con "80% of expected" y la meta alineada a la derecha.

## 2. Reglas

1. Usar un solo color por serie y el gris ~#E5E7EB para el "resto". Nunca usar más de 3 series apiladas.
2. Grilla horizontal punteada al 6-8% de opacidad, 4-5 marcas como máximo, nada de grilla vertical (excepción: separadores de columna en 08).
3. Ejes en gris 11px con montos abreviados ($20K, 80K). Sin título de eje: la unidad va en el subtítulo ("en ARS").
4. Leyenda en línea con el título o al pie: punto o cuadrado de 8-12 px, nombre gris y valor negro. Nunca en una caja aparte.
5. El período en curso siempre se rayado o lavado, con un chip "MTD"/"Mes en curso". Nunca dibujarlo igual que un mes cerrado.
6. Resaltar el ítem activo saturando y oscureciendo solo ese ítem y atenuando los demás (rayado o al 40%). Su etiqueta pasa de gris a negro.
7. Tooltip oscuro (#111, radio 8, texto blanco 12px) con como máximo 3 datos: valor | participación | comparación coloreada.
8. Cada KPI lleva cifra grande (28-32px, tabular-nums), un indicador visual chico (barra punteada, segmentos o sparkline) y una variación con flecha y color.
9. Usar verde/rojo solo para la dirección del cambio o el estado. Los colores categóricos no deben repetir esos semánticos.
10. Progreso discreto ("3 de 6") en bloques segmentados. Progreso continuo (GB, % de meta) en barra de carril redondeado.
11. Sparklines sin ejes, trazo de 1,5 px, área solo con degradé tenue, y debajo un texto breve con el conteo y la ventana de tiempo.
12. En las donas, colores de una misma familia con tonos escalonados, grosor ≥30% del radio y el total afuera en número grande. Nunca tortas llenas.
13. Repetir el color de la serie en la tabla de detalle (píldora de 3 px o punto) para enlazar gráfico y fila.
14. En modo oscuro, barras grises con un solo acento para el líder o el estado crítico.

## 3. Antipatrones que evitan

No usan 3D, sombras dentro del gráfico, bordes de barra, etiquetas sobre cada barra (salvo la activa o el encabezado de columna en 08), leyendas en recuadro, arcoíris en series ordinales, ejes con muchos decimales, tortas sin agujero, gráficos sin contexto de comparación ni grillas oscuras o sólidas. Tampoco ponen tooltips con más de 3 datos ni muestran el mes parcial como si fuera completo.
