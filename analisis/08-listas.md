## Listas, tablas y filas: análisis (foco 3)

### 1. Patrones observados
(Todos los valores son estimaciones hechas mirando las capturas.)

- **Fila de notificación o actividad en 3 niveles (01, 03, 12).** A la izquierda va un ícono de 28 a 32px sobre una pastilla de color suave (rosa para aprobación, verde para deploy, ámbar para alerta, rojo con la "M" de Gmail). En el centro va el título en 13–14px, peso 400–500, gris 900. Abajo va la meta en 12px gris (~#8A8F98) con este formato: `Categoría · Subcategoría · hace 2 min`. Abajo de todo, solo cuando hace falta, va **una** acción contextual en botón chico de ~24px de alto: Aprobar (primario azul ~#2F7CF6) + Abrir (secundario), Responder, Reconectar. En 03 la fila es ícono 36px + "Llamada" + fecha gris en la misma línea + descripción abajo. En 12 el ícono es de ~44px con radio 12, el título va en 15px semibold, la fecha abajo en gris y el monto a la derecha en 15px semibold.
- **No leído = punto azul de 6px** a la izquierda del ícono, fuera de la columna (01). Las filas leídas no llevan punto ni negrita extra.
- **Agrupación por fecha (01, 09).** En 01 los rótulos "Hoy" y "Ayer" van en 11–12px gris claro, sin línea ni fondo, con ~16px arriba. En 09 el encabezado del grupo es la fecha ("Thu, Nov 5") dentro de una tarjeta gris (#E9E9EB) con ⋯ a la derecha, y la fila va como tarjeta blanca anidada (radio ~16–20).
- **Menú ⋯ por fila (01, 05, 06, 10, 13, 14).** En 01 es un ⋯ horizontal gris claro, siempre visible pero muy tenue (~#C0C4CC). Al abrirlo sale un popover de ~200px, radio 8, sombra suave, con ítems de 13px e íconos de 14px: Marcar como no leído, Posponer ›, Abrir en pestaña nueva, un divisor, Silenciar hilo, otro divisor y Ajustes. En 05 el ⋮ vertical va dentro de un botón cuadrado de 32px con borde (#E5E7EB), en la columna "Acciones" alineada a la derecha.
- **Hover o seleccionado (01, 03, 04, 13).** La fila con el menú abierto toma un fondo gris muy leve (~#F7F7F8) que ocupa todo el ancho (01). Después de aprobar, la fila queda teñida de verde muy suave (~#F1FAF4), el botón pasa a "✓ Aprobado" en verde y aparece un toast abajo a la derecha con **Deshacer**. El ítem de navegación seleccionado lleva fondo blanco sobre gris (04) o gris #F2F2F2 (13). Las filas de una tabla no llevan cebra.
- **Tabla de transacciones (07).** El encabezado tiene fondo gris muy tenue (#F7F7F8, radio 8) y textos de 12px gris en caja normal, nunca en mayúsculas. Las filas miden ~38px con divisor de 1px (#F0F0F0). Columnas: ID `#TX-48213` en mono-ish 13px, cliente con avatar de iniciales de 22px en color pastel y nombre en 500, **monto alineado a la derecha** en 13px semibold tabular, método con ícono gris y "Visa •• 4242", canal con ícono y estado como pastilla. Si el pago fue reembolsado, el monto va tachado en gris ($64.00). Si falló, va gris claro ($42.00). Arriba a la derecha de la tarjeta hay un segmentado (Todos/Online/Suscripciones/En local) y un botón "Ver todo".
- **Pastillas de estado (03, 06, 07, 14).** Miden ~20px de alto, radio 6, padding 6–8px, 11–12px de texto y llevan **punto de 5px + texto en el color del estado sobre el mismo tono al ~10%**. Colores: Pagado verde #16A34A sobre #ECFDF3; Pendiente ámbar #D97706 sobre #FEF6E7; Falló rojo #E5484D sobre #FEECEC; Reembolsado gris #6B7280 sobre #F3F4F6. En 03 se ven "En curso" (azul) y "• Alta" (rojo) lado a lado. En 06, "Medium/Low/High" van en la esquina superior y las etiquetas temáticas van con borde gris y sin color.
- **Tabla de configuración (04 y 05).** Filas de ~56px con checkbox de 18px a la izquierda, valores en gris 500, pastilla de % con una barrita vertical de 3px del color de la serie (vincula la fila con el gráfico de arriba) y el crecimiento "+4.2%" en gris, sin color.
- **Lista de pasos (06).** Círculo vacío de 16px, texto de 13px truncado con "…" y la fecha a la derecha en gris 12px, o "Vencido" en rojo #DC2626. La lista termina con "+ Agregar tarea" en gris. El encabezado muestra "Próximos pasos" a la izquierda y "9 abiertas" a la derecha.
- **Contadores en pestañas y encabezados (01, 03, 13).** Formatos vistos: "Todas 78 · Menciones 4 · Aprobaciones 9", "Actividad 16" con badge gris de radio 4 y "4 en total" en gris a la derecha del título.
- **En celular (11, 12)** la fila no lleva divisor o lleva uno de 1px con sangría desde el texto. El monto va a la derecha con la variación debajo, en gris 12px ("+0.2%").

### 2. Reglas
1. Armá toda fila de lista con ícono en pastilla de color (28–32px en escritorio, 40–44px en celular), título de 13–14px, meta de 12px gris separada con " · ", y como mucho **una** acción visible.
2. Alineá montos y números siempre a la derecha, con `tabular-nums` y peso 500–600. La moneda va pegada al número.
3. Poné los estados en pastillas de tono al 10% con punto y texto del mismo color. Nunca uses fondo saturado con texto blanco en una tabla.
4. Encabezados de tabla en 12px gris, caja normal, sobre una franja gris tenue. Nada de MAYÚSCULAS ni negrita.
5. Separá filas con divisores de 1px #F0F0F0. Nunca uses cebra ni bordes verticales entre columnas.
6. Agrupá las listas temporales con rótulos "Hoy / Ayer / Esta semana / fecha" en 12px gris, sin caja.
7. Marcá lo no leído o pendiente con un punto azul de 6px fuera de la columna del ícono, no con negrita en toda la fila.
8. Mandá las acciones secundarias a un ⋯ al final de la fila, que se ve tenue y gana contraste al pasar el mouse. En el menú agrupá con divisores y dejá lo destructivo o de configuración al final.
9. Al pasar el mouse sobre una fila, o con su menú abierto, pintala de #F7F7F8 de borde a borde. Al completar una acción, teñila del color del resultado y mostrá un toast con "Deshacer".
10. Mostrá el conteo en cada pestaña o filtro ("Vencidas 5") y el total gris a la derecha del título de la sección.
11. Los anulados o reembolsados se muestran tachados y en gris, no se borran.
12. Truncá con "…" en una sola línea. Nunca dejes que una fila crezca a 3 líneas por un nombre largo.
13. Los identificadores (`CONT-01101`, `FC A-0001-…`) van en fuente mono 13px gris 700.

### 3. Antipatrones que estas referencias evitan
- Tablas con borde en cada celda, cebra o encabezado oscuro.
- Columnas de "Acciones" con 3 o 4 íconos sueltos por fila (en 05 hay un solo ⋮).
- Estados con color pleno y texto blanco, o comunicados solo por color sin texto.
- Varios botones primarios en la misma lista: en 01 solo la fila de aprobación lleva azul.
- Montos centrados o alineados a la izquierda, decimales que no alinean.
- Colorear el crecimiento de todas las filas en verde (05 lo deja en gris).
- Fechas absolutas en un feed reciente: usan "hace 2 min" y "hace 1 d".
