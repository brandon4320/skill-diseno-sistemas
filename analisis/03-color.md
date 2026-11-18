## 1. Patrones observados (color)

**Fondos en 3 capas, todas grises casi blancos (hex estimados):**
- App/marco: gris frío `#F2F3F5`–`#F4F4F5` (01, 02, 06, 07, 13); sidebar en el mismo tono que el marco, nunca blanco puro (02, 03, 04: `#F3F3F5`; 06 con leve calidez `#F5F4F2`).
- Superficie de contenido: `#FAFAFA`–`#FFFFFF` (02, 03, 07).
- Tarjeta: `#FFFFFF` con borde de 1px `#E8E8EC`/`#EAEAEA` y sombra casi nula (03, 06, 07). En el celular (09, 11, 12) se invierte: fondo `#F2F2F2`/`#F5F5F7` y tarjetas blancas o grises `#E9E9EB` sin borde.
- Diferencia entre capas: 2-4% de luminosidad. La jerarquía sale del borde y del contraste de capas, no de sombras.

**Grises (estimado):** texto principal `#111`–`#1A1A1A` (no negro puro); secundario `#6B7280`; terciario/etiquetas `#9CA3AF` (encabezados de sección en mayúsculas "INSIGHT & CONTROL" en 02-04, "Today/Yesterday" en 01); separadores `#EEEEF0`.

**Un acento, y casi siempre neutro:**
- 02, 03, 06, 07: el botón principal y el ítem activo del menú son **negro/grafito** (`#111`/`#2A2A2A`). El acento de marca (violeta `#5B5BF0` de CloseCRM en 02-03) aparece solo en "＋ Create" y en el logo.
- 01: azul `#2F80ED` solo en Approve, toggles, puntos de no leído y "Undo".
- 09/12: cian `#0BB4E4`/`#1EA7F0` en una tarjeta héroe, FAB, chip activo y la pestaña activa.
- 08: verde petróleo `#2E7D6E` en una tarjeta héroe y el botón "Ask Finora".
- Acento ≤5% del área de la pantalla. Una sola tarjeta "llena" de color por pantalla como máximo (08 Total Expenses, 09 "halfway there").

**Semánticos, siempre como chip con fondo tenue + texto saturado + punto:**
- Éxito `#16A34A` sobre `#E8F7EE` (07 "Paid", 12 "Guaranteed payout", 14 "Online").
- Aviso `#D97706`/`#F59E0B` sobre `#FEF3E2` (07 "Pending", 14 "Partial", 01 ícono de 80% de uso).
- Error `#E5484D`/`#DC2626` sobre `#FDECEC` (07 "Failed", 06 "Overdue"/"Needs attention" solo como texto rojo, 09 horario vencido en rosa `#E8436A`).
- Info/neutro: azul `#2563EB` sobre `#EAF2FE` (03 "Active", "Work", "In Progress"); "Refunded" en gris (07).
- Los deltas van en texto verde/rojo sin fondo: "+15.2%", "-3.1%" (07, 11, 13).

**Color para datos vs UI:** la UI se queda gris y la paleta categórica vive solo en gráficos y en el ícono de la categoría.
- 05: barra apilada en 6 colores (violeta, cian, verde, amarillo, rojo, gris) y la tabla repite el color solo como una rayita de 3px dentro del chip de porcentaje.
- 06: cada proyecto tiene un color (azul, carmín, naranja ladrillo, verde) que se usa solo en la barra de progreso y la sparkline.
- 07: 3 series (naranja `#FF5A2A`, rosa `#F472B6`, azul `#4F9CF9`); el mes en curso va rayado/translúcido ("MTD").
- 08: monocromo verde con rayado para lo no seleccionado y sólido para lo seleccionado.
- 03: los íconos de actividad tienen fondo pastel por tipo (llamada lila, reunión verde, nota rosa, seguimiento ámbar).
- 10: eventos del calendario en pasteles (lila `#E9E3FB`, celeste `#DDEFFC`, durazno `#FDEBD3`, verde `#D9F5E3`) con texto oscuro y no saturado.

**Cantidad de colores por pantalla (sin contar grises):** 01 → 1 acento + 3 semánticos; 02 → negro + violeta + logos de apps; 06 → negro + 4 de datos + 3 semánticos; 07 → grafito + 3 de datos + 3 semánticos; 14 → blanco + 3 semánticos.

**Oscuro (14):** fondo `#0B0B0C`, tarjeta `#18181B`, borde `#26262A`. Las barras van en gris claro si están en estado normal; solo se colorean (verde/ámbar/rojo) cuando informan un estado. El único color de marca es el rojo del logo.

**Proporción observada (estimada):** ~70% gris/blanco de fondo, ~25% texto y bordes neutros, ≤5% acento + semánticos. Es más restrictivo que 60-30-10: el "30" es gris, no un segundo color.

## 2. Reglas

1. Definir 3 tokens de fondo y nada más: `--bg-app` `#F4F4F5`, `--bg-surface` `#FAFAFA`, `--bg-card` `#FFFFFF`, con una diferencia máxima de 4% de L entre capas.
2. El botón principal es grafito `#18181B` con texto blanco. El color de marca va como mucho en el logo y en un único "＋ Crear".
3. Un solo botón con relleno por pantalla. Los demás son blancos con borde `#E4E4E7`.
4. Nunca usar color en el menú lateral salvo los puntos de estado. El ítem activo se marca con fondo blanco (06, 10) o negro (02-03), no con un color.
5. Los semánticos van siempre como chip: fondo al ~10% + texto al 100% + punto de 6px. Nunca un fondo saturado con texto blanco.
6. Rojo solo para lo que exige actuar (vencido, fallido, sin conexión). Si en la pantalla hay más de 3 cosas en rojo, se agrupan en un aviso.
7. Los deltas van en texto verde/rojo sin fondo y siempre con flecha (↗/↘), así el color no es la única señal.
8. La paleta categórica (máximo 6 colores) vive solo en gráficos, barras de progreso e íconos de tipo, nunca en botones ni encabezados.
9. Si un dato se repite en la tabla, usar su color de categoría como marca de 3px, no pintar toda la fila.
10. Lo no seleccionado, proyectado o parcial va rayado o al 30% de opacidad, y lo real va sólido (07 MTD, 08).
11. Máximo una tarjeta héroe llena de color por pantalla, y solo para la métrica principal.
12. Texto `#18181B`, secundario `#71717A`, terciario `#A1A1AA`. Prohibido el `#000` puro sobre `#FFF`.
13. En modo oscuro las barras neutras van en `#D4D4D8` y solo se colorean cuando hay un estado.
14. Contar los colores de cada pantalla nueva: grises + 1 acento + hasta 3 semánticos + hasta 6 de datos. Si se pasa, recortar.

## 3. Antipatrones que evitan

- Sidebars de color de marca o encabezados con fondo saturado.
- Degradados decorativos. Solo 08 usa un velo turquesa tenue, y 14 una foto como héroe.
- Botones de colores distintos según la acción (verde guardar, rojo cancelar, azul editar).
- Tablas con filas coloreadas por estado.
- Chips sólidos saturados con texto blanco.
- Sombras fuertes para separar capas.
- Varios acentos peleando entre sí: el violeta de 02 nunca convive con un azul de UI.
- Iconos multicolor en la navegación. 13 es la excepción: colorea solo los proyectos, no las secciones.
