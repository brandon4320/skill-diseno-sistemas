## Homogeneidad y modo oscuro: ADN compartido de las 14 referencias

### 1. Patrones observados

**Lo que comparten todas (el ADN)**
- **Marco de dos superficies.** El menú lateral va sobre un gris neutro (~#F4F4F5) y el contenido sobre un panel más claro con esquinas grandes, inserto unos 8–12 px. Se ve en 02, 03, 04, 06, 07, 10, 13 y 14 (en oscuro: lienzo ~#0B0B0C y panel ~#111113). 01 es la excepción plana: una sola superficie con una línea divisoria.
- **Radios por escala.** Marco de la app ~20–24 px, tarjetas ~12–16 px, botones y campos ~8–10 px, pastillas totalmente redondas. En celular (09, 11, 12) las tarjetas suben a ~20–24 px. Estimado.
- **Bordes de 1 px casi invisibles** (~#E4E4E7) y sombras casi nulas. La profundidad sale del cambio de tono de fondo, no de la sombra (05, 06, 07, 13).
- **Una sola tipografía sin serifa** (tipo Inter) en todas. La jerarquía la hace el gris, no el peso: rótulo gris ~#71717A a 12–13 px y valor oscuro ~#18181B a 14 px (03 "Email / patrick@…", 07, 12 "Start date / January 25"). Los títulos de página van a 20–28 px y peso 500–600 (01, 07). Nunca se usa negrita pesada.
- **Números protagonistas**
  - Tamaño grande, 28–44 px, peso 500–600 (06 "26", 11 "$24,957.81", 14 "140.9").
  - La parte secundaria va en gris: el "$" en 11, los decimales en 12 (".81"), la unidad chica en 14 ("kWh", "/20").
  - En 14 los números son monoespaciados.
- **El neutro ocupa ~90 % de la pantalla y hay un solo acento de marca**, usado solo en la acción principal, el ítem activo y los interruptores:
  - 01 azul ~#2F80ED
  - 02 y 03 índigo ~#5B5BF0
  - 08 verde azulado ~#2E7D6F
  - 09 cian ~#06B6D4
  - 06, 07 y 12 negro o grafito como acento
- **Estados semánticos fijos: punto + texto sobre pastilla de color tenue.**
  - 07: Paid verde, Pending ámbar, Failed rojo, Refunded gris.
  - 14: Online, Partial, Offline.
  - 03 y 06: "• High", "Overdue" en rojo.
  - Los mismos tres colores se repiten como barra de progreso fina (14 Maintenance, 05).
- **Tarjeta de indicador con estructura fija** (06, 07, 08, 13, 14): rótulo gris arriba, cifra grande, y abajo variación o contexto ("+15.2% vs. prior period", "Needs attention").
- **Selector segmentado:** riel gris con la opción elegida en pastilla blanca (02 Day/Week/Month, 05, 07, 11 1D/1W, 14 Daily/Monthly).
- **Una acción principal por pantalla, arriba a la derecha y rellena; las secundarias van con contorno al lado.**
  - 02 "+ Create"
  - 06 "New project" (negro) + "New task"
  - 07 "Create payment link" + "Payouts"
  - 08 "Ask Finora" + Import/Export
  - En celular: botón negro a todo el ancho abajo (12 "View PDF", "Preview").
- **Ruta de navegación arriba con el nivel actual en oscuro** (01, 03, 04, 07, 10, 13).
- **Conteos alineados a la derecha en gris** en el menú y en las pestañas (01 "78", 03 "Activity 16", 06, 13 "12").
- **Tablas sin líneas verticales** (07): cabecera gris de 12 px, filas de ~38–40 px, montos a la derecha, estado en pastilla e iniciales en círculo pastel.

**Lo que cambia según el tipo de producto**
- **Densidad.** Operativo y denso en 01 (13 px, filas de ~44 px); ficha holgada en 03 (15 px).
- **Navegación.** Menú lateral (la mayoría), riel de íconos (08, 13) o pastillas arriba (08).
- **Tono del título.** Saludo (06 "Good evening, Alex", 12), título narrativo (08 "Spending Up, Savings Ahead") o título funcional (07 "Revenue").
- **Color en gráficos.** Categórico vivo en 05 y 07 (violeta, cian, verde, amarillo, rojo); monocromo del acento con rayado en 08 y 09.
- **Agenda.** Eventos en gris con el ícono de la app de reunión (02) o en tonos pastel por materia (10), con la línea de "ahora" negra y su pastilla "8:40".
- **Fondo.** Gradiente tintado en todo el lienzo en 08; gris liso en el resto.

**Modo oscuro (14)**
- **Capas de fondo:** lienzo ~#0A0A0A, panel ~#111113, tarjetas ~#18181B, borde ~#27272A apenas visible.
- **Texto:** principal blanco, secundario ~#A1A1AA, terciario ~#71717A.
- **Estados más saturados** (verde ~#22C55E, ámbar ~#F5B800, rojo ~#EF4444), en pastilla oscura con punto y en barras de 3–4 px.
- **Selección invertida:** la opción elegida del selector segmentado es pastilla blanca con texto negro ("Monthly", "Cards").
- **Foto de fondo solo en la franja de cabecera** (~150 px, atardecer) que se funde a negro. Sobre ella van el título blanco y los controles en pastillas oscuras translúcidas. Las tarjetas de indicadores se montan sobre el borde inferior de la foto, y no hay foto detrás de ningún dato.
- **Marca roja** solo en el logo, el avatar y el anillo del 75 %.

### 2. Reglas
1. Definir una sola escala de grises (zinc) y una sola tipografía para los 4 sistemas. Lo único que cambia por empresa es `--accent`.
2. Usar el acento solo en la acción principal, el ítem activo del menú, los interruptores y el foco. Nunca en títulos ni en fondos de tarjeta.
3. Poner como máximo una acción rellena por pantalla, arriba a la derecha (en celular, a todo el ancho abajo). Las demás van con contorno o como texto.
4. Separar superficies por tono (lienzo, panel, tarjeta) con borde de 1 px. Sombra solo en menús emergentes y avisos.
5. Usar los radios 24 / 16 / 10 / redondo según el nivel (marco, tarjeta, control, pastilla), sin mezclar otros valores.
6. Escribir todo dato como par rótulo gris de 12–13 px arriba y valor oscuro de 14 px abajo.
7. Mostrar cifras con `tabular-nums`, peso 500–600, y moneda, decimales y unidad en gris más chico.
8. Usar los colores de estado (verde, ámbar, rojo, gris) solo para estados y siempre como "punto + palabra". El color solo nunca alcanza.
9. Armar cada tarjeta de indicador así: rótulo, cifra, y una línea de contexto con variación o motivo.
10. Hacer tablas sin líneas verticales, con montos alineados a la derecha, filas de 40 px y estado en pastilla.
11. Elegir períodos y vistas con selector segmentado, no con menú desplegable, cuando hay 2 a 4 opciones.
12. En oscuro, subir la luminosidad de cada capa, invertir la selección (pastilla blanca) y no usar sombras.
13. Usar foto solo como cabecera o promoción, siempre con degradé a la superficie. Nunca va detrás de tablas o cifras.
14. Poner el conteo a la derecha y en gris en el menú y las pestañas, nunca en globo de color salvo urgente (01 y 14 lo usan solo para notificaciones).

### 3. Antipatrones que estas referencias evitan
- Varios botones de colores compitiendo en la misma pantalla.
- Encabezados de tabla en mayúscula y negrita.
- Grillas con todas las líneas.
- Sombras marcadas.
- Gradientes en botones.
- Íconos de colores en el menú: son grises y lineales.
- Rojo usado como decoración.
- Texto blanco sobre una foto sin degradé.
- Saturación alta en fondos grandes, salvo la tarjeta héroe de 08 y la de 09.
- Más de una familia tipográfica.
- Rótulos dentro del campo en lugar de arriba del valor.
