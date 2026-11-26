## Contenido, microcopy e iconografía

### 1. Patrones observados
- **Íconos de línea finos, en gris.** Son de contorno, con trazo de unos 1,5 px (estimado), del estilo Lucide/Tabler. Miden unos 16 px en el menú y en los botones, y 14 px dentro del texto. Van en gris medio (aprox. #6B7280–#9CA3AF). El ícono del ítem activo toma el color del texto: blanco sobre negro en 02 y 03, azul en 01. Se ve en 01, 02, 03, 04, 06, 10 y 14. Los únicos íconos rellenos y de color son el logo, las empresas favoritas (02, 03 y 04: un cuadrado de 20 px con radio de 4 px) y los proyectos (06: un círculo de 16 px).
- **Ícono dentro de un recuadro de color suave.** Es un cuadrado de unos 32–40 px, con radio de 8–10 px y fondo pastel (tinte de aprox. 10–15 %); el glifo va en el mismo tono pero más saturado. El color depende del tipo de registro: azul para llamada, verde para reunión, violeta para nota y naranja para seguimiento (03). En 12 el color depende del estado: verde para cobrado, rojo para vencido y violeta para enviado. En 01 hay recuadros de 24 px por origen (Gmail, aprobaciones, deploys). En 08, 09, 12 y 14 el recuadro es neutro (gris #F3F4F6) con el glifo en gris oscuro.
- **Avatares y monogramas.** Iniciales de 2 letras en un círculo de 24 px con fondo pastel y texto del mismo tono, con un color fijo por persona (07: OB, MR, AK; 01: PN; 13: M y J superpuestos). Junto al nombre van la foto o las iniciales de unos 28–32 px y debajo el puesto en gris: "Studio lead" (06), "Grid Supervisor" (14), "Manager" (02 y 03), "Teacher" (10).
- **Metadatos en una sola línea, separados por "·".** Ejemplos: "Approvals · Invoice Triage · 2 min ago" (01), "1 of 10 done · Target Dec 9" (06), "12 updates · 14 days", "0 done this week · 1 overdue" (06, con "overdue" en rojo), "Online · 141 kWh · 45.1°C" (14), "Dec 16 → Chase ···· 4821" (07). Usan unos 12 px, gris claro, por debajo del título de 14 px.
- **Tiempo relativo para lo reciente, fecha absoluta para lo viejo.** "2 min ago", "1 h ago" y "1 d ago" se agrupan bajo los separadores "Today" y "Yesterday" (01). En 03 se usa la fecha completa: "Jul 4, 2025 at 12:00".
- **Debajo de cada número, un texto que lo explica.** Ejemplos: "Across 4 active projects", "3 the week before", "Atlas CRM Revamp" (dice cuál está atrasado), "Last 7 days, 1 failed" (06); "+15.2% vs. prior period" (07); "of 63 work orders completed", "SPX-005 leads output" (14); "1.2 GB remaining" (05).
- **Subtítulo de página que dice el alcance, no lo vende.** "78 unread · delivered in-app, by email and in Slack" (01); "Payments, subscriptions and payouts across online, Harbor Club and the Portland store." (07); "12 of 17 sites · select one for full diagnostics" (14).
- **Saludo personal con la fecha arriba.** "Wednesday, November 11" en unos 13 px gris, y abajo "Good evening, Alex" en unos 36 px peso 400–500 (06). También "Good morning! / Nov 8, 2026" (09) y "Welcome back, John!" (12). En 09 el progreso se dice como frase: "You are halfway there · 3 of 6 tasks done. Finish 3 more…".
- **Contadores pegados a la etiqueta, en gris más claro.** "All 78 · Mentions 4" (01), "Activity 16 · Tasks 4" (03), "Not yet done 04" (09), "Next steps … 9 open" (06). En el menú el contador va alineado a la derecha (01, 13).
- **Botones con verbo y objeto.** "Mark all read", "Reconnect", "Create payment link", "Join Meeting", "Upgrade Storage", "+ Add task", "View PDF". Lo opuesto a "OK" o "Submit".
- **Estados con pastilla y punto.** Ejemplos: "• Paid", "• Pending", "• Failed" (07) y "• Online", "• Partial", "• Offline" (14). Son de unos 11–12 px, con fondo tintado y texto del mismo tono.
- **Identificadores en monoespaciada:** INV-21004, #finance-ops, 08:00 (01). Las tarjetas se identifican por código: #TX-48213 (07), SPX-001 (14).
- **Deshacer en lugar de confirmar.** El aviso dice "Approved INV-21004 · $18,400 / Posted to NetSuite as bill VB-88213 · Undo" (01, abajo a la derecha). En "Snoozed" también hay "Undo".

### 2. Reglas
1. Los íconos son de contorno, con trazo de 1,5 px y 16 px de tamaño (14 px dentro del texto), en gris `text-zinc-500`. Nunca uses íconos rellenos de color dentro de la interfaz, salvo marcas o entidades.
2. Los íconos de tipo o de estado van en un recuadro de 32 px (`size-8 rounded-lg`) con fondo `bg-{c}-50` y glifo `text-{c}-600`. Cada tipo de registro tiene un color fijo y documentado.
3. Toda persona lleva un avatar: foto o iniciales en un círculo de 24 px, con fondo pastel derivado del nombre, siempre el mismo color para la misma persona.
4. Todo número grande lleva debajo una línea que lo explica: con qué se compara, de dónde sale o qué hay que mirar. Nunca pongas un número sin contexto.
5. Los metadatos van en una sola línea separada por " · ", con lo más importante primero y a lo sumo 3 datos.
6. Usa tiempo relativo ("hace 2 min", "hace 1 h") hasta las 24 h. Después usa la fecha corta ("12 nov") y agrupa bajo "Hoy", "Ayer" y "Esta semana".
7. Muestra los conteos como fracción con meta: "3 de 6 hechas · Vence 9 dic". Pon el conteo junto a la etiqueta en `text-zinc-400 tabular-nums`.
8. Los títulos de página son un sustantivo corto ("Cobranzas"). El subtítulo dice el alcance con datos reales, nunca un eslogan.
9. La pantalla de inicio de cada persona arranca con la fecha y el saludo con su nombre ("Buenas tardes, Agustín"). El saludo depende de la hora de Argentina y se calcula en el servidor.
10. Los botones dicen verbo + objeto ("Registrar cobro", "Reprogramar", "Ver PDF"). No uses "Aceptar", "Enviar" ni "Continuar" solos.
11. Los estados son una pastilla con punto, en una palabra ("Cobrada", "Vencida", "Parcial"). El rojo queda solo para lo atrasado o lo fallido.
12. Escribe los códigos de documento (CTR-0412, FC A-0003-00001234, CBU parcial ···· 4821) en `font-mono`.
13. Lo que se puede deshacer no pide confirmación: se hace y aparece un aviso con "Deshacer" que repite qué se hizo y con qué número.
14. Ningún bloque lleva tagline, ayuda decorativa ni texto que repita lo que ya dice el título.

### 3. Antipatrones que estas referencias evitan
- Íconos de muchos estilos, gruesos o de colores dentro de la interfaz.
- KPIs sin comparación ni origen.
- Fechas en formato ISO, o largas, en listas densas.
- Botones genéricos ("Submit", "OK").
- Modales que piden "¿Está seguro?" para acciones reversibles.
- Textos de marketing dentro del sistema. La excepción es el título de 08, "Spending Up, Savings Ahead", que es un titular editorial: no conviene copiarlo para sistemas de gestión.
- Estados que se distinguen solo por el color, sin texto.
- Mayúsculas en todo, salvo los rótulos de grupo del menú (02, 04, 13, 14: unos 11 px con tracking).
- Listas sin agrupar por tiempo.
