## Acciones e interacción: análisis de las 14 referencias

### 1. Patrones observados
- **Un solo botón relleno por zona.** 02: "+ Create" índigo (~#6366F1, alto ~36px, radio ~8) es el único relleno de la barra superior. Todo lo demás (Show Filters, All Meetings, Import, Schedule) va blanco con borde de 1px (~#E5E7EB). 06: "New project" negro relleno y "New task" con borde. 07: "Create payment link" grafito (~#3A3A3A) en píldora y "Payouts" con borde. 08: "Ask Finora" verde azulado (~#2F7D6D) contra Import/Export claros. Excepción: un panel lateral puede tener su propio primario, como "Join Meeting" negro junto a "Reschedule" con borde en 02, ambos de ancho mitad y alto ~40px. Ese par cierra el panel.
- **Barra de la ficha (03).** Arriba a la derecha van tres botones cuadrados de solo ícono (correo, llamada, video; ~36×36, borde, radio ~8), después tres botones con borde que llevan ícono y texto (Create task, Add to list, Edit) y al final un ⋮. En la barra de la ficha no hay ningún botón relleno.
- **Acciones dentro de la fila (01).** Van debajo de la línea de meta y alineadas con el texto: "✓ Approve" azul relleno (~#2F80ED, alto ~24px, texto ~12px) + "Open" con borde; "Reply" o "Reconnect" con borde y un ícono de 12px. Solo la fila que pide una decisión lleva botón relleno. Las demás llevan un solo botón con borde, o ninguno.
- **Confirmación optimista (01, abajo a la derecha).** La fila aprobada se tiñe de verde muy claro (~#F0FAF3). "Approve" pasa a ser una píldora con borde verde "✓ Approved" (~#16A34A) y "Open" sigue igual. La fila no desaparece.
- **Toast con detalle (01).** Aparece abajo a la derecha, ancho ~250px, fondo blanco, borde y sombra suave. Lleva un ícono ✓ verde, un título en negrita con el ID y el monto ("Approved INV-21004 · $18,400"), una segunda línea gris con la consecuencia ("Posted to NetSuite as bill VB-88213"), el enlace azul "Undo" y una ×.
- **Menú contextual (01).** Se abre desde el "···" que cada fila tiene a la derecha, en gris tenue. Ancho ~170px, ítems con ícono de ~28px de alto. Grupos: Mark as unread (con el atajo "U" alineado a la derecha), Snooze con submenú ›, Open in new tab | separador | Mute this thread, Mute Review Queue mentions | separador | Notification settings…. Lo que se puede deshacer va arriba y la configuración al final.
- **Posponer (snooze) y acciones masivas (01).** El panel "Snoozed" dice "2 threads come back tomorrow 09:00" y cada ítem trae un "Undo" en línea. "Mark all read" y "Preferences" son botones con borde chicos (~28px) junto al título, nunca rellenos.
- **Pie del modal (01).** "Reset to workspace defaults" va como enlace azul a la izquierda; "Cancel" con borde y "Save preferences" azul relleno van a la derecha.
- **Acciones en tablas (05).** La columna "Actions" lleva un ⋮ dentro de un cuadrado con borde (~32px) en cada fila. 07: "View all" con borde y un control segmentado All/Online/… para filtrar.
- **Agregar en el lugar (06, 12, 13).** "+ Add task" va como texto gris al final de la lista (06). "+ Add item to bill" es un enlace azul (12). "+ New work item" es un botón con borde a todo el ancho de la barra lateral (13). Las secciones llevan "+ New", "+ Invite" o "View team" chicos y con borde (06).
- **Celular.** Botón principal en píldora negra a todo el ancho y fijo abajo, alto ~56px ("View PDF", "Preview", 12). Accesos rápidos en mosaicos de ícono + rótulo (3-4 por fila, radio ~16; 11 y 12). Botón flotante "+" circular de ~48px (09). Píldora tenue "Open" en la fila (~#E6F2FD con texto azul, 11). Tarea completada con un círculo vacío gris a la derecha que pasa a ✓ verde relleno (09).
- **Estado confirmado dentro del ítem (10).** Chip blanco "✓ Confirmed" dentro del evento del calendario y "···" en cada evento.
- **Atajos a la vista.** "⌘K" dentro del buscador (02), "U" en el menú (01).

### 2. Reglas
1. Usar como máximo **un** botón relleno por pantalla en la barra superior, más uno por panel o modal cuando ese panel cierra con una decisión. Todo lo demás va con borde o como texto.
2. Los secundarios van blancos, con borde de 1px, alto 32-36px, radio 8px, ícono de 16px a la izquierda y texto de 13-14px y peso 500.
3. Poner la acción de la fila **dentro de la fila**, debajo del texto o a su derecha, con alto de 24-28px. Rellenar solo la que resuelve una decisión pendiente (Aprobar, Cobrar). Un máximo de 2 botones visibles por fila.
4. Cada fila lleva un "···" (o ⋮) a la derecha que abre un menú con grupos separados por líneas: acciones reversibles arriba, silenciar u ocultar en el medio, configuración o borrar al final, y atajos de teclado alineados a la derecha.
5. Cuando una acción sale bien, mostrarla **en el lugar al instante**: fila teñida de verde tenue y píldora "✓ Aprobado" en vez del botón. Nunca hacer desaparecer la fila en el momento.
6. Todo toast de una acción con efecto lleva: ícono, qué se hizo + ID + monto, una segunda línea con la consecuencia en el otro sistema, **Deshacer** y ×. Va abajo a la derecha en escritorio y no tapa el botón principal en el celular.
7. Ofrecer Deshacer antes que un diálogo de confirmación en toda acción reversible. El modal queda solo para lo irreversible.
8. Las acciones masivas ("Marcar todo leído") van como botones con borde chicos junto al título de la lista, nunca rellenos.
9. Posponer siempre dice cuándo vuelve ("vuelve mañana 09:00") y deja deshacer desde la lista de pospuestos.
10. Agregar un ítem se hace al final de su propia lista ("+ Agregar tarea" en gris), no con un botón suelto lejos de ella.
11. Pie del modal: la opción destructiva o de restablecer va como enlace a la izquierda, y Cancelar (con borde) + Guardar (relleno) a la derecha.
12. En el celular, el botón principal va en píldora negra a todo el ancho, fija abajo, de 52-56px. Los accesos rápidos van en mosaicos de ícono + rótulo, y los toques miden 44px como mínimo.
13. Las acciones de comunicación (correo, llamar, Meet) van como botones de solo ícono, cuadrados de 36px, con tooltip.
14. Nunca dejar un botón deshabilitado sin decir por qué; si la acción no aplica, no mostrarla.

### 3. Antipatrones que las referencias evitan
- Varios botones rellenos de colores distintos compitiendo en la misma vista.
- Tablas con una fila de 5 íconos sueltos (editar, borrar, ver…) en vez de un ⋮.
- Modales de "¿Está seguro?" para aprobar o marcar como leído.
- Toasts genéricos tipo "Guardado con éxito" sin ID, monto ni deshacer.
- Recargar la lista o perder la fila después de actuar.
- Botones rojos de borrar a la vista en cada fila.
- Botones con borde grueso, sombra fuerte o degradado.
