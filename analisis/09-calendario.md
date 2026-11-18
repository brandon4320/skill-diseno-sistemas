## Calendarios y agendas: análisis de las referencias

### 1. Patrones observados (los valores en px son estimados a 1x)

**Vista semana (02, 10)**
- La grilla es de horas por filas, con una línea horizontal de 1px muy tenue (≈#EEEFF2) y sin líneas verticales marcadas. En 10 hay una separación vertical apenas visible.
- Cada hora mide unos 48px. Las etiquetas de hora van a la izquierda, gris (≈#8A8F98), en 12px.
- 10 usa formato 24 h ("06:00", "13:00"). 02 usa AM/PM y además tiene un error ("12 AM" donde va mediodía).
- La cabecera de días es texto simple, de 13 a 14px. En 10 el día de hoy se marca con la celda de cabecera llena en negro y el texto en blanco ("2 - Tue"). Es el único bloque negro de la grilla.
- 02 muestra 5 días visibles, se pasan con flechas ‹ › propias de la grilla, y la última fila se funde a blanco para indicar que hay scroll.

**Bloques de evento**
- **02 (neutro):**
  - Relleno gris casi blanco (≈#F7F7F8), borde de 1px (≈#ECECEF) y radio de unos 8px.
  - El color lo pone solo el ícono del proveedor de 16px (Zoom, Meet, Slack, Discord), a la izquierda del título.
  - El título va en 13px peso 500 y ocupa hasta 2 líneas. Al pie va "Meeting Time" en gris y el rango horario.
  - El alto del bloque es proporcional a la duración.
- **10 (color por categoría):**
  - Rellenos pastel planos: lila ≈#ECE6FB, celeste ≈#DDF0FB, periwinkle ≈#D9DEF8, durazno ≈#FDE8C8, menta ≈#D6F5E0.
  - El texto va oscuro, nunca blanco. El radio es de unos 6px.
  - Arriba a la derecha hay un menú "⋯". Abajo puede aparecer una pastilla blanca de estado "✓ Confirmed".
  - El título va en 12px semibold y la hora en 11px gris.

**Línea de "ahora" (10)**
- Es una línea negra de 2px que cruza solo la columna de hoy.
- A la izquierda lleva una pastilla negra con la hora ("8:40") en blanco, de 11px y con radio total.
- Es el elemento de mayor contraste de toda la vista.

**Barra de herramientas (02, 10, 14)**
- Título del período a la izquierda ("January 2026", "01-07 January 2025"), en 16 a 18px semibold.
- Navegación con ‹ Today › en texto gris. En 14 aparece como ‹ [February 2025] ›.
- Selector Día/Semana/Mes segmentado: un riel gris (≈#F1F1F3) con la opción activa en una pastilla blanca con sombra leve (02, 14 "Daily/Monthly/Yearly", 11 "1D/1W/1M").
- En 02, arriba de todo, van los botones secundarios con borde (Show Filters, All Meetings ⌄, Import, Schedule), el buscador con ⌘K y una sola acción primaria de color ("+ Create", violeta ≈#6366F1).

**Filtros en pastillas**
- En 10: la pastilla activa "✓ All" va negra con texto blanco y las demás grises (≈#F2F2F4) con texto gris oscuro. Miden unos 28px de alto con radio total.
- En 01 las pastillas llevan el conteo en gris al lado ("Mentions 4", "Approvals 9").

**Panel lateral de la próxima reunión (02)**
- Mide unos 360px (≈22% del ancho) y tiene dos tarjetas con asa "⠿".
- **"Next Upcoming Meeting":** un ícono de 36px en fondo de color suave (verde) con el título en 15px semibold y la hora relativa debajo ("Today, 10:00 AM"). Siguen la agenda, el link (con el ícono del proveedor) y la duración.
- **"Meeting information":** pares de etiqueta gris en 12 a 13px y valor en 14px. Muestra anfitrión con avatar y "(You)" en gris, la entidad relacionada con ícono, la fecha de creación con una pastilla de zona horaria "EST", los participantes como lista de avatares de 20px con nombre, y las notas.
- **Pie fijo:** dos botones del mismo ancho, de unos 40px de alto. "Reschedule" va blanco con borde y "Join Meeting" negro con ícono de cámara.

**Selector de días en celular (09)**
- Tira horizontal con scroll de pastillas de unos 52×64px y radio de unos 12px, con el día corto arriba y el número de 2 dígitos abajo.
- La seleccionada va llena de cyan (≈#0EB4E0) con texto blanco. Las demás, gris claro con borde.
- Arriba va "November 2026 ⌄" como selector de mes.
- Debajo hay una lista agrupada por fecha: una cabecera gris "Thu, Nov 5 ⋯" contiene filas blancas con un ícono de 44px en círculo gris, el título en 16px, el rango horario y un círculo de completado a la derecha (verde con ✓ cuando está hecho).
- La hora de lo vencido va en rosa-rojo (≈#E5486B).

**Relacionados**
- La línea de tiempo de actividad de 03 usa un ícono de 36px por tipo con fondo suave (llamada azul, reunión verde, nota rosa, seguimiento naranja) y la fecha gris al lado del título.
- 06 muestra "Target Dec 9" y vencimientos alineados a la derecha, con "Overdue" en rojo y "Tomorrow" en gris.

### 2. Reglas

1. Mostrar la semana laboral de lunes a viernes por defecto, con horas en formato 24 h ("08:00") en gris de 12px y filas de 48px por hora.
2. Marcar hoy con un único elemento negro en la cabecera. Nunca usar otro relleno oscuro en la grilla.
3. Dibujar la línea de "ahora" de 2px, solo en la columna de hoy, con una pastilla con la hora. Actualizarla cada minuto con la hora de Argentina (`todayAR()`).
4. Para los eventos, usar un relleno pastel por tipo o empresa con texto oscuro, radio de 6 a 8px y sin sombra. El estado ("Confirmada") va en una pastilla blanca adentro, nunca cambiando el color del bloque.
5. Poner el ícono del proveedor (Meet, Teams, presencial) de 14 a 16px antes del título. No inventar un color de proveedor.
6. En el bloque va título (2 líneas como máximo, con truncado), rango horario y "⋯". Nada más. El detalle va al panel.
7. Resolver los filtros con pastillas de 28px y radio total: la activa negra con ✓ y las inactivas grises, con conteo cuando sume información.
8. El selector Día/Semana/Mes va segmentado en un riel gris con la opción activa en blanco, siempre a la derecha del título del período.
9. Permitir una sola acción primaria de color por pantalla ("+ Nueva reunión"). El resto, botones blancos con borde.
10. El panel lateral (unos 360px) muestra la próxima reunión con la hora relativa ("Hoy, 10:00", "En 25 min"), los datos como pares etiqueta/valor y un pie fijo con 2 acciones del mismo ancho: secundaria a la izquierda ("Reprogramar") y primaria negra a la derecha ("Unirse").
11. En celular, reemplazar la grilla por la tira de días con scroll más una lista agrupada por fecha. Las pastillas de día deben tener 44px o más de toque, y la seleccionada va con el color de acento.
12. Pintar en rojo solo el horario de lo vencido o sin confirmar pasado. Nunca pintar el bloque entero.
13. Indicar que hay más contenido con un fundido inferior, no con barras de scroll visibles.
14. Revisar la coherencia de los datos: el rango del bloque tiene que coincidir con su alto (02 muestra "10:00 AM - 12:00 AM" en un bloque de 2 h; no copiar esos errores).

### 3. Antipatrones que estas referencias evitan

- Bloques saturados con texto blanco o con degradé.
- Grilla con bordes marcados en ambas direcciones.
- Leyenda de colores separada: el color se explica con el filtro.
- Muchos botones de color.
- Detalle del evento en un modal que tapa la agenda: va en el panel fijo.
- Mostrar en el bloque participantes, descripción o links.
- Repetir la fecha en cada fila de la lista móvil: se agrupa bajo una cabecera.
- Vista mes como única vista.
