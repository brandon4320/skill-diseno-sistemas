## 1. Patrones observados (semántica de estados)

**Pastillas de estado**
- **07 (Transacciones)**: pastilla con punto y texto, fondo del mismo tono muy claro y sin borde. Paid: verde (~#16A34A sobre ~#DCFCE7). Pending: ámbar (~#D97706 / #FEF3C7). Failed: rojo (~#DC2626 / #FEE2E2). Refunded: gris (~#6B7280 / #F3F4F6). Alto estimado de 20–22 px, radio de 6 px, texto de 12–13 px con peso 500 y punto de 5–6 px. El estado también cambia el monto: en Refunded queda **tachado y gris** ($64.00) y en Failed queda **gris** ($42.00). El estado se repite en el dato, no vive solo en la pastilla.
- **14 (oscuro)**: Online, Partial y Offline van con punto y texto del color (verde ~#22C55E, amarillo ~#EAB308, rojo ~#EF4444) sobre una pastilla casi negra. La **barra de progreso** de cada tarjeta toma el mismo color: amarilla en Partial y roja en Offline. En Online la barra queda blanca o neutra: lo normal no se pinta. En "Sitios fijados" se ve un punto a la izquierda y el estado escrito en gris a la derecha.
- **06**: la prioridad va sin punto, con texto de color sobre fondo tenue: Low rosa/lila, Medium naranja (~#C2410C / #FFEDD5), High rojo. Al lado van etiquetas neutras con borde gris (Backend, Docs). El estado de persona es Active en verde y Remote en azul, con el mismo formato.
- **03**: dentro de las tareas, "In Progress" va en azul con borde suave y "• High" en rojo con punto. "Todo" y "• Medium" van neutros. Dos pastillas por fila como máximo: estado y prioridad.
- **10**: "Confirmed" es una pastilla blanca con un check verde dentro de un círculo, apoyada sobre el evento de color.
- **12**: "Guaranteed payout" lleva candado y texto verde sobre fondo verde claro. En la lista, el estado es un **ícono dentro de un cuadrado de 40–44 px con fondo tenue rayado**: check verde para el pago recibido, X roja para la factura vencida, flecha lila para la enviada. El título repite el estado ("Invoice overdue").

**Vencido y "necesita atención"**
- **06**: "Overdue" en rojo (~#DC2626, 12–13 px) reemplaza a la fecha en la misma columna, alineado a la derecha. El KPI "Overdue 2" lleva al pie un ícono de alerta y el texto rojo "Needs attention". También van en rojo "1 overdue", "1 failed" y "+8 vs last week" (cuando más es peor). El número grande sigue en negro: el rojo queda solo en el texto chico.
- **09**: en "Not yet done", la hora de lo atrasado va en rojo/rosa (~#E11D48). En lo vigente va en gris.
- **14**: "Overdue 5" aparece con barra roja dentro de una lista de barras, y "5 need attention" como pastilla gris en el mapa.
- **01**: el aviso de 80% de cuota lleva un triángulo ámbar. "Rule handled" lleva un escudo verde.

**Terminado**
- **09**: check verde relleno (~20 px, #10B981) en lugar del círculo gris vacío. El texto **no se tacha**.
- **06**: casilla circular vacía de 16 px para lo pendiente. "1 of 10 done" va en texto gris.
- **01**: al aprobar, el botón azul "Approve" pasa a la pastilla verde "Approved" con check en el mismo lugar. La fila queda con fondo verde muy suave (~#F0FDF4) y aparece un aviso "Approved INV-21004 · $18,400" con la opción **Deshacer**.
- El único tachado que se ve es el del monto reintegrado en **07**.

**No leído y contadores**
- **01**: punto azul de ~6 px (~#2563EB) a la izquierda de la fila sin leer. Las leídas no llevan nada. Debajo del título va "78 unread · delivered…" y está el botón "Mark all read".
- Contador en gris **dentro de la pestaña** ("Mentions 4" en 01, "Activity 16" en 03 con pastilla gris de 18–20 px). Conteo gris alineado a la derecha en el menú lateral (180 en 01; 9/7/3/5 en 06; 12 en 13). Conteo junto al título de sección ("Not yet done 04" en 09, "9 open" en 06).
- Insignia **roja rellena** solo para lo que pide acción: Notifications 3 (14) y Subscribers 18.4k (07). En 10 la insignia de mensajes es un círculo negro con "2".

## 2. Reglas
1. Todo estado va con **texto + color** y, cuando se pueda, con punto o ícono. Nunca solo color, ni siquiera en barras.
2. Pastilla estándar: 20–22 px de alto, `rounded-md`, texto de 12 px con peso 500, fondo del tono al 10–15% y sin borde. Punto de 6 px si el estado es "vivo" (pago, conexión, avance).
3. La paleta semántica queda fija en todos los sistemas: verde = hecho/cobrado/en línea, ámbar = pendiente/parcial, rojo = vencido/falló/fuera de línea, gris = anulado/reintegrado/borrador, azul = en curso o informativo. Nada más se pinta con esos colores.
4. Lo normal no se colorea. El color se guarda para la excepción (14: barra neutra cuando está Online).
5. "Vencido" reemplaza a la fecha en la misma columna, en rojo y en texto chico. El número grande del KPI queda negro y el rojo va en la línea del pie ("Requiere atención").
6. Todo KPI con algo vencido o fallido lleva al pie un ícono de alerta y un texto rojo que dice cuántos.
7. Terminado = check verde relleno en el lugar del círculo vacío. **No tachar** tareas. Tachar solo montos anulados o reintegrados y dejarlos en gris.
8. Al terminar una acción, el botón se convierte en pastilla de estado en el mismo lugar y aparece un aviso con **Deshacer**.
9. No leído = punto azul de 6 px a la izquierda y nada más. Debajo del título, el total ("78 sin leer") y "Marcar todo leído".
10. Contadores en gris al lado del texto en pestañas, menú y secciones. Insignia roja rellena solo cuando ese número exige actuar.
11. Como máximo 2 pastillas de estado por fila (estado + prioridad). Las etiquetas descriptivas van neutras con borde gris.
12. En celular, el estado de una fila de lista es un ícono en un cuadrado tenue de 40 px y el título lo repite en palabras.
13. Prioridad: Baja en gris o lila, Media en ámbar, Alta en rojo. Sin punto, salvo que conviva con un estado.

## 3. Antipatrones que evitan
- Pastillas con relleno saturado y texto blanco, y pastillas con borde fuerte.
- Pintar el número grande o la fila entera de rojo.
- Estados distinguidos solo por color, como un punto sin texto en una tabla.
- Arcoíris de estados: no se ven más de 4–5 colores semánticos por pantalla.
- Tachar tareas hechas o esconderlas sin confirmar.
- Insignias rojas para conteos informativos.
- Mayúsculas en las pastillas: todas en tipo oración.
