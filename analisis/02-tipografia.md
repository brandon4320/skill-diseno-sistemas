## Tipografía: análisis de las 14 referencias

### 1. Patrones observados
Todas las medidas son estimadas a 1x. Las capturas vienen escaladas, así que normalicé contra el texto del menú lateral (13–14 px).

- **Familia.** En 01–07, 10, 13 y 14 se ve una grotesca neutra tipo **Inter** (la "a" de dos pisos, la "R" y la "G" son de Inter). 08 usa una geométrica más ancha, tipo Outfit o Urbanist, en títulos y cifras. En 11 y 12 parece SF Pro o Inter Display, con cifras en 700. No aparece ninguna serif dentro de los productos: el "After" de 13 es un rótulo de la presentación, no de la interfaz.
- **Monoespaciada para datos técnicos.** En 01 los códigos y horas van en mono (`INV-21004`, `Customer Refunds v10`, `08:00`, `#finance-ops`) dentro de una línea en sans. En 14 las cifras grandes van en mono bold (`140.9`, `213.8`), con la unidad `kWh` en sans chica gris.
- **Escala en escritorio.** Meta y rótulos 11–12 px. Cuerpo y filas 13–14 px (01, 07). Título de tarjeta 15–18 px en 500 ("Contact information" en 03, "Monthly revenue" en 07). Título de página 18–24 px en 500 ("Revenue" en 07, "Patrick Collison" en 03 a unos 26 px). Cifra KPI 22–28 px en 500–600 (06, 07, 14). El saludo de 06 ronda 34–36 px y el titular de 08 llega a 44–48 px, ambos como excepción de "home".
- **Escala en celular (09, 11, 12).** Título de barra 17–18 px en 600. Cifra protagonista 32–36 px en 700 (`$ 24,957.81` en 11). Ítem 15–16 px en 500, meta 13–14 px gris.
- **Pesos.** Solo hay tres: 400, 500 y 600. Los títulos de página y de tarjeta van en **500, no en bold** (02, 03, 06, 07, 13). El 600–700 queda para cifras y para el celular.
- **Interlineado.** Párrafos a ~1.5 (descripción de 03, agenda de 02). Filas a ~1.3–1.4. Cifras grandes a 1.0–1.1. Los titulares grandes llevan tracking negativo (≈ −0.02em en 06 y 08).
- **Color del texto.** Hay tres niveles:
  - primario ≈ #18181B / #111;
  - secundario ≈ #71717A (subtítulos, meta, "vs. prior period");
  - terciario ≈ #A1A1AA (contadores, rótulos en mayúscula, placeholders).

  En oscuro (14) el primario es #FAFAFA y el secundario ≈ #A1A1AA. Solo el estado lleva color: verde `+15.2%` (07), rojo `Overdue` o `Needs attention` (06), rojo en horarios vencidos (09).
- **Rótulos de sección en mayúscula.** Solo en el menú lateral: `INSIGHT & CONTROL`, `FAVORITES` (02–04), `WORKSPACE`, `AUDIENCE` (07), `PROJECTS` (13). Van a 11–12 px, peso 400–500, tracking ≈ +0.06em, color terciario. Los encabezados de tabla van en minúscula inicial y gris (`Payment`, `Amount` en 07; `Module`, `Storage` en 04–05). En 06 y 14 el menú usa minúscula inicial ("Essentials", "Analytics"), así que la mayúscula no es obligatoria.
- **Jerarquía título → subtítulo → meta.**
  - 01: "Notifications" 15/500 y debajo "78 unread · delivered in-app…" 12/400 gris.
  - Ítem de 01: frase 13/400 negra y meta "Approvals · Invoice Triage · 2 min ago" 12 px gris, separada con " · ".
  - 07: título 22/500 y subtítulo 15/400 gris.
  - 06: fecha 13 px gris **arriba** del saludo grande.
  - 08: ceja "— Expenses" 14 px gris arriba del titular.
- **Rótulo y valor.** En 12 y 11 el rótulo va gris 13 px ("Start date", "Cash") y el valor negro 15–17 px en 600. En 02 y 03 la pareja va apilada con unos 6 px de separación.
- **Contadores pegados al rótulo**, en gris más claro y sin caja: `All 78`, `Mentions 4` (01), `Not yet done 04` (09), `4 Total` (03). En el menú lateral van alineados a la derecha (06, 13).
- **Cifras.** Montos alineados a la derecha en tabla (07). La parte secundaria va atenuada:
  - centavos grises en `$15,185.81` y `$625.00` (12);
  - símbolo `$` gris y más chico (11);
  - unidad chica (`kWh`, `%`, `/ 20` en 14);
  - montos reintegrados tachados en gris (07).

  La variación lleva solo el número en color y el resto en gris ("+6.8% vs. prior period").
- **Truncado** con "…" en vez de saltar de línea ("Email outreach to war…" en 02; tareas en 06).

### 2. Reglas
1. Usar una sola sans (Inter) en todo el sistema y una mono (Geist Mono o JetBrains Mono) solo para códigos, números de comprobante y horas técnicas.
2. Limitarse a tres pesos: 400 texto, 500 títulos y rótulos de acción, 600 cifras. Nunca usar 700 en escritorio fuera de un KPI protagonista.
3. Escala fija: 11 / 12 / 13 / 14 / 16 / 20 / 24 / 32. Ninguna tarjeta mezcla más de tres tamaños.
4. Usar tres colores de texto: zinc-900, zinc-500 y zinc-400. El color de marca o de estado nunca va en texto corrido, solo en la cifra o la etiqueta del estado.
5. Todo número de tabla o KPI lleva `tabular-nums` y los montos se alinean a la derecha.
6. En los montos, centavos, símbolo de moneda y unidad van en zinc-400, uno o dos pasos más chicos que la cifra.
7. Meta en una sola línea, 12 px zinc-500, separada con " · ", nunca con barras ni comas.
8. La mayúscula va solo en los rótulos de grupo del menú lateral (11 px, `tracking-wider`, zinc-400). Encabezados de tabla, botones y pestañas van en minúscula inicial.
9. Los títulos de página y de tarjeta van en 500, no en bold. Los grandes llevan `tracking-tight`.
10. Rótulo arriba (12–13 px gris) y valor abajo (14–15 px negro). Nunca "Rótulo: valor" en la misma línea dentro de fichas.
11. El contador va pegado al rótulo, en zinc-400 y sin caja: `Pendientes 4`.
12. Una variación lleva color solo en el número y el ícono. El texto de comparación va en gris.
13. Textos largos en filas se truncan con `truncate` y se ven completos en tooltip o en la ficha.
14. En el celular la cifra protagonista va a 32 px en 600–700 con `leading-none`, y el resto no pasa de 16 px.

### 3. Antipatrones que evitan
- Títulos en negrita pesada o con color de marca.
- Botones o encabezados de tabla en MAYÚSCULA.
- Más de un acento de color en el texto.
- Texto gris sobre gris por debajo del terciario (salvo los deshabilitados de 02, "Patreon").
- Cifras proporcionales que bailan entre filas.
- Párrafos centrados en escritorio.
- Dos líneas de meta.
- Rótulos explicativos de relleno: el subtítulo es una sola frase factual ("78 unread · delivered…").
- Serifs o tipografías decorativas dentro del producto.
