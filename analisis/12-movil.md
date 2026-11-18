## 1. Patrones observados (móvil: 09, 11, 12; anillos también en 13 y 14)

Las medidas son estimadas. Tomé un ancho de pantalla de 390 pt y escalé cada captura a esa medida.

- **Cabecera de dos niveles.**
  - En 09, el saludo "Good morning!" va en gris (#7A7A7A, unos 16 pt) y la fecha va debajo en negro (15 pt), ambos a la izquierda. A la derecha hay botones circulares de unos 44 pt con fondo gris #E2E2E2.
  - En 12, "Welcome back, John!" va centrado (unos 18 pt, peso 600), entre un botón de menú y una campana, los dos circulares, blancos y con borde suave.
  - En las pantallas de detalle (11 y 12) se repite el mismo esquema: flecha atrás en círculo, título centrado y "…" o compartir en círculo.
- **Tarjeta héroe con un solo número.**
  - 09: bloque celeste lleno (~#12B4E3) con radio de ~22 pt. Tiene un título blanco de 17 pt, un subtítulo de 13 pt y a la derecha un anillo de progreso de ~80 pt con trazo grueso que dice "70%".
  - 11: sin tarjeta. Lleva rótulo gris "Total saving", monto de ~34 pt en peso 700 con el "$" en gris claro, ícono de ojo para ocultar y debajo "+12.3%" en verde (#22B04B) seguido de "vs last month" en gris.
  - 12: tarjeta blanca con radio de ~20 pt, monto de ~28 pt con los centavos en gris ("$15,185.81") y una píldora verde clara con candado ("Guaranteed payout").
  - En escritorio el anillo se repite: en 13 (Workload, número dentro) y en 14 ("75%" de cobertura).
- **Accesos rápidos en grilla.**
  - 11: 4 tiles cuadrados de ~80 pt, blancos, con borde de 1 px #E6E6E6 y radio de ~16 pt. Ícono de trazo arriba y rótulo de 14 pt abajo.
  - 12: 3 tiles con ícono celeste lleno y rótulo negro de 15 pt en peso 500.
  - Separación de 8 a 10 pt entre tiles. Siempre van inmediatamente debajo del héroe.
- **Listas agrupadas por día (09).** Cada día es un contenedor gris (#E6E6E6) con radio de ~22 pt. Arriba lleva una franja con la fecha "Thu, Oct 25" y "•••". Adentro va la fila en una superficie más clara: ícono en círculo gris de ~44 pt, título de 16 pt y horario. Cuando la tarea está vencida, el horario va en rojo rosado (#E5486A). A la derecha va un check: círculo gris si está pendiente y verde lleno con tilde si está hecha. Cada sección tiene título y contador gris ("Not yet done 04") con "See all" a la derecha.
- **Filas de transacción o factura (11, 12).**
  - El ícono va en un cuadrado redondeado de ~44 pt con fondo del color del estado: violeta para enviada, verde para cobrada, rojo para vencida.
  - Título de 16 pt en peso 600, fecha gris de 14 pt y monto alineado a la derecha en peso 600, con la variación debajo.
  - Divisores de 1 px. No hay tarjeta por fila.
- **FAB (09).** Círculo celeste de ~44 pt con "+" blanco y sombra suave, abajo a la derecha, apoyado sobre la lista, unos 16 pt por encima de la barra.
- **Barra inferior.**
  - 09: 4 íconos llenos sin texto. El activo va en celeste y el resto en gris #9A9A9A.
  - 12: barra flotante blanca con radio completo. El ítem activo es una píldora celeste clara (~#DDF3FB) con ícono y la palabra "Home" en celeste. Los otros 3 llevan solo ícono.
- **Botón negro ancho fijo abajo (12).** "View PDF" y "Preview" van en negro #111 con texto blanco de 17 pt en peso 600. Altura de ~56 pt, radio completo y 16 pt de margen lateral, fijo sobre el indicador de inicio. Es la única acción principal de la pantalla.
- **Formulario en tarjetas (12, tercera pantalla).**
  - Cada campo es una tarjeta: rótulo gris de 14 pt con asterisco rojo si es obligatorio y valor grande (~22 pt en peso 700).
  - Los selectores van con chevron. Hay un enlace "+ Add item to bill" y un total con insignia al pie.
- **Otros elementos.**
  - Segmentado de período "1D 1W 1M 3M 1Y" en píldoras grises (11). En 09 se usa un chip celeste "This week ▾".
  - Grilla 2x2 de saldos con ícono en cuadrado de color saturado (11).
  - Cinta horizontal de días (09): tiles de ~48x60 pt con el día activo en celeste lleno.
- **Superficies.** El fondo va en gris #F2F2F2 a #EFEFEF y las tarjetas en blanco o gris un tono más oscuro. Hay un solo acento por app: celeste en 09 y 12, azul #0A6FE0 en 11. Los radios son grandes: de 16 a 24 pt en tarjetas y completos en botones.

## 2. Reglas

1. Abrir cada pantalla de inicio con el saludo y la fecha (`todayAR()`) a la izquierda o centrados. Las acciones del encabezado van en círculos de 44 px, como máximo 2.
2. Debajo de la cabecera va un solo héroe: un monto grande (28 a 34 px, peso 700) o un anillo de progreso. Nunca dos héroes.
3. En los montos, el "$" y los centavos van en gris (`text-neutral-400`) y la parte entera en negro. La variación va siempre como "+x% vs mes anterior": verde si sube y rojo si baja.
4. Los accesos rápidos van en una grilla de 3 o 4 tiles iguales (`grid-cols-3`/`grid-cols-4 gap-2`), con ícono arriba y una palabra abajo. Nunca más de 4.
5. Las listas con fecha se agrupan por día, con un encabezado "Jue 25 oct" y un contenedor `rounded-3xl`. Cada sección lleva contador y "Ver todo".
6. En cada fila van ícono a la izquierda (cuadrado o círculo de 44 px con fondo del color del estado), dos líneas de texto y el monto o estado a la derecha.
7. Todo lo que se pueda tocar mide al menos 44x44 px. Las filas, al menos 64 px de alto.
8. Los radios son `rounded-2xl` (16 px) en tiles y campos, `rounded-3xl` (24 px) en héroes y grupos y `rounded-full` en botones, chips y barra inferior.
9. En el detalle o en un formulario, la única acción principal va en un botón negro ancho fijo abajo (`h-14 rounded-full bg-neutral-950`), con un margen de seguridad (`pb-[env(safe-area-inset-bottom)]`).
10. La barra inferior tiene 4 destinos como máximo. El activo va como píldora con ícono y texto, y el resto solo con ícono.
11. Usar el FAB "+" solo en las listas donde se crean cosas. Nunca va junto a un botón negro fijo.
12. Usar un solo color de acento por sistema. El rojo, el verde y el ámbar quedan reservados para estados: vencido, cobrado, pendiente.
13. El período se elige con un segmentado de píldoras, nunca con un desplegable de fechas.

## 3. Antipatrones que estas referencias evitan

- Tablas en el celular: todo se resuelve con filas.
- Más de una acción principal por pantalla.
- Botones con borde y relleno de color compitiendo entre sí.
- Textos de ayuda bajo cada campo (solo hay una ayuda, en 12: "How often…").
- Sombras duras.
- Bordes oscuros.
- Íconos sin contenedor.
- Montos sin la comparación al lado.
- Menú hamburguesa como navegación principal: aparece en 12, pero la navegación real está en la barra inferior.
- Colores de estado usados como decoración.
