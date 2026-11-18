## Formularios y ajustes: análisis de las 14 capturas

Los valores en px están medidos a ojo sobre las capturas. Las capturas vienen escaladas (más o menos 2x), así que todo valor es aproximado.

### 1. Patrones observados

**Hoja lateral de preferencias (01, cuadrante inferior izquierdo)**
- Panel a la derecha de unos 370px de ancho, alto completo. El fondo de la página queda atenuado con un velo gris (más o menos negro al 10-15%), sin desenfoque.
- Encabezado: ícono de engranaje en un cuadrado azul claro, título de 14px semibold ("Notification preferences") y debajo un subtítulo gris de 12px que dice a quién afecta el cambio ("Applies to you only. Admins can set workspace defaults"). Arriba a la derecha, una × suelta.
- La tabla de preferencias es una matriz: filas = eventos, columnas = canales (In-app / Email / Slack).
  - Cada fila tiene dos líneas: nombre en 12px oscuro y una aclaración en 11px gris ("Under 1 hour left", "Mondays 08:00").
  - Las casillas tildadas son azules de 14px (#2F80ED aprox.). Las vacías tienen solo un borde gris muy claro.
  - Separadores de 1px (#EEF0F2) y encabezado de columna en 11px gris.
- Debajo de la tabla, dos selects lado a lado con rótulo arriba ("Quiet hours", "Email digest"). Cada select lleva un ícono a la izquierda (reloj, calendario) y un chevron a la derecha. Alto de unos 32px, radio de unos 6px, borde de 1px.
- Toggle con texto al lado para la excepción: "Let urgent items… break quiet hours".
- Pie fijo:
  - a la izquierda, un enlace azul sin caja: "Reset to workspace defaults";
  - a la derecha, "Cancel" como botón con borde y "Save preferences" como botón azul relleno, los dos de unos 28-32px de alto.

**Toggles de resumen (01, columna derecha "Delivery")**
- Tarjeta con el título "Delivery" y el subtítulo "Where your notifications go".
- Cada fila tiene un ícono de canal gris de 16px, un título de 12px y, debajo, el estado actual en gris ("Daily digest at 08:00", "20:00–08:00 · urgent only").
- El toggle va a la derecha: azul encendido, unos 28×16px.
- Siempre se muestra el valor vigente, no solo el nombre de la opción.

**Menú de ajustes en dos niveles (04)**
- Barra principal de la app y, al lado, una segunda columna "Settings" de unos 220px.
- Grupos en MAYÚSCULAS grises de 11-12px con tracking ancho (PERSONAL SETTINGS / COMPANY SETTINGS / API SETTINGS). Cada grupo se pliega con un chevron.
- Ítems con ícono de trazo de 16px y texto de 14px.
- El ítem activo es una "pastilla" blanca con sombra mínima sobre el fondo gris de la columna (#F1F2F5 aprox.). No lleva color de acento.
- Arriba, migas "Settings / Data management". El contenido tiene pestañas segmentadas (Import History | Export History | Duplicate | **Storage** | Recycle Bin | Audit Log): un riel gris con la pestaña activa en blanco elevado y radio de unos 8px (04, 05).

**Barras de uso (04, 05)**
- Encabezado de sección: título de 18-20px ("Storage Management") con un subtítulo gris de una línea.
- Dentro de la tarjeta: "18.8 GB used of 20 GB" a la izquierda; arriba a la derecha "94%" grande y debajo "1.2 GB remaining" en gris.
- Barra segmentada de unos 10px de alto con extremos redondeados. Cada módulo tiene su color: violeta #7B7FF0, celeste #1EC0F5, verde #66BB6A, amarillo #F9D923, rojo coral #F86A5A. Lo libre va en gris #E5E6EA.
- Leyenda abajo: cuadradito de color, rótulo en gris y valor en negro ("Deals: **1.2 GB**").
- En la tabla, cada porcentaje va en una pastilla gris con un palito del color de su módulo, lo que repite la codificación.
- "Upgrade Storage" es un botón con borde e ícono, alineado con las pestañas.
- Variantes del mismo patrón:
  - 07 (Harbor Club plans): barra rellena + resto rayado diagonal + valor a la derecha;
  - 14 (Maintenance): barra fina de 4px por estado, con el número alineado a la derecha.

**Formulario móvil (12, derecha, "Create new invoice")**
- Encabezado: flecha atrás en un círculo, título centrado de 17px semibold y "⋯" en otro círculo.
- Campos tipo tarjeta: blancos, radio de unos 16px, borde muy suave.
  - El rótulo va adentro, arriba, en gris de 13px con asterisco rojo ("Issued to*").
  - El valor va grande y bold, 20-24px ("$10.00", "Visa **** 2736").
  - La moneda es una pastilla gris con chevron dentro del mismo campo ("USD ⌄").
  - Un botón circular azul ⇅ entre dos campos los intercambia.
- Secciones con título gris de 15px ("Billable items", "Payment & schedule"). Los selects ocupan el ancho completo con ícono a la izquierda ("$ USD", "📅 Monthly"). Hay una ayuda debajo solo cuando aclara algo ("How often you'll issue this invoice").
- Para sumar ítems se usa un enlace azul subrayado punteado ("+ Add item to bill"), no un botón.
- Total con ícono a la izquierda: "Total USD $10.00" y la pastilla verde "Guaranteed payout".
- CTA único negro (#111) de ancho completo, 52px de alto, totalmente redondeado ("Preview"), pegado abajo.
- La ficha (12, centro) usa el mismo esquema en lectura: filas con ícono en un cuadrado de color de 40px, rótulo gris y valor en negro semibold.

**Constantes en todas las capturas**
- Fondo de la app gris (#F4F5F7) con contenido en tarjetas blancas.
- Un solo color de acción por pantalla: azul en 01, negro en 02, 12 y 13, verde azulado en 08.
- Íconos de trazo de 1.5px.
- Tipografía de una sola familia, tipo Inter: títulos en 500-600 y valores de dato en bold.

### 2. Reglas

1. Los ajustes van en una columna propia de unos 220px con grupos en MAYÚSCULAS de 11px (Personal / Empresa / Integraciones). El ítem activo es una pastilla blanca, nunca un relleno de color.
2. Toda preferencia que cruce eventos × canales va como **matriz de casillas**, no como lista de toggles repetidos.
3. Cada fila de la matriz y cada toggle lleva una segunda línea gris con el **valor vigente o el alcance** ("Lunes 08:00", "Solo urgentes").
4. Los toggles quedan para lo binario y global (canal encendido o apagado). Para elegir entre opciones se usan selects con ícono a la izquierda y chevron a la derecha.
5. Las hojas de edición se abren a la derecha (unos 380px en escritorio) y llevan un subtítulo que aclara a quién afecta el cambio.
6. El pie de toda hoja o formulario es fijo y tiene este orden: restaurar como enlace a la izquierda, Cancelar con borde y Guardar relleno a la derecha. Un solo botón relleno.
7. Los consumos y cupos se muestran con una barra segmentada de 8-10px, el % y lo que queda arriba a la derecha, y leyenda con cuadradito, rótulo gris y valor negro.
8. El color de un segmento se repite en la tabla de abajo (palito o punto). No se introduce otro color para la misma categoría.
9. En el celular, cada campo es una tarjeta con el rótulo adentro y arriba (13px gris) y el valor grande (20px bold). El obligatorio se marca con un asterisco rojo, nunca con texto.
10. La unidad o la moneda va **dentro** del campo como pastilla con chevron, no en un campo aparte.
11. En el celular, el CTA es único, de ancho completo, 48-52px de alto, `rounded-full` y pegado abajo.
12. "Agregar ítem" va como enlace con "+", no como botón.
13. Las ayudas solo aparecen debajo del campo cuando el campo no se entiende sin ellas.
14. Después de guardar sale un toast abajo a la derecha con "Deshacer" (01: "Approved INV-21004 · Undo").

### 3. Antipatrones que estas capturas evitan

- Formularios en una sola columna larga sin agrupar.
- Rótulos dentro del input como placeholder.
- Dos botones primarios en la misma pantalla.
- Toggles para elegir entre más de dos opciones.
- Modales centrados para editar preferencias.
- Barras de uso sin número ni lo que falta.
- Colores distintos para la misma categoría en el gráfico y en la tabla.
- Guardar sin poder deshacer.
- Ayudas en todos los campos.
- Confirmaciones en diálogo cuando basta con un toast reversible.
