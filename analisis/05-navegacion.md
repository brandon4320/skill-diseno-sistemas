## Navegación: análisis de las 14 referencias

### 1. Patrones observados

**Barra lateral (01, 02, 03, 04, 06, 07, 10, 13, 14)**
- Ancho estimado de 240 a 260 px en escritorio. El fondo es apenas más oscuro que el lienzo (#F4F4F5 a #F7F7F8 en 02/03/04/06, verde agua translúcido en 10) o un panel separado con margen de 8 a 12 px y radio de unos 16 px (02, 03, 14). En 06/07/10 no lleva borde duro; en 01 sí hay un borde de 1 px.
- **Grupos con rótulo**: hay dos estilos. Uno en MAYÚSCULAS de 11 a 12 px, gris claro (#9CA3AF aprox.) y con tracking abierto: "INSIGHT & CONTROL", "SYSTEM", "FAVORITES", "RECENT CHATS" en 02/03/04, "WORKSPACE/AUDIENCE/INSIGHTS/SETTINGS" en 07, "WORKSPACE/PROJECTS" en 13. El otro es en caja de oración, 12 a 13 px y peso medio: "Essentials/Projects/Management" en 06, "Workspace/Operations/Administration" en 01, "Analytics/Pinned sites/Help & resources" en 14, "Main menu" en 10. Entre grupos quedan unos 24 a 32 px de aire o un separador de 1 px (06, 07).
- **Ítems**: alto de 32 a 40 px, ícono de trazo de 16 a 18 px (estilo Lucide) más texto de 13 a 14 px en peso regular. Los íconos son siempre monocromos grises, salvo los favoritos/proyectos, que llevan el logo o un punto de color (02/03 Stripe y Dzen, 06 proyectos con círculo de color, 14 sitios fijados con punto de estado verde/amarillo/rojo).
- **Ítem activo**: hay 4 variantes. (a) Píldora negra sólida con texto blanco y radio de unos 8 px (02, 03), la más fuerte. (b) Fondo blanco con sombra suave sobre el gris de la barra (04 en la sub-barra de Ajustes, 06, 10). (c) Fondo gris un tono más oscuro (07, 13, 14). (d) Texto y fondo azul tenue (01, con contador). Nunca se combina color de marca de fondo con un borde lateral.
- **Contadores**: número gris alineado a la derecha y sin fondo (01 "180", "78"; 06 "9, 7, 3, 5"; 13 "3, 12, 15"). Badge relleno solo para lo urgente: 07 "18.4k" en rojo/coral, 10 "2" en círculo negro, 14 "3" en círculo rojo.
- **Colapsables**: chevron ^/v a la derecha del rótulo de grupo (02, 03, 04, 13). "SYSTEM" aparece colapsado por defecto. Hay un "See More" para cortar la lista de favoritos (02/03/04).
- **Perfil abajo**: avatar circular de 32 a 36 px, nombre en 13 a 14 px semibold y rol en gris (02 "Tanjim / Manager", 10 "Teacher", 14 "Grid Supervisor" con botón de salir). En 06 hay "Settings" y "Log out" sueltos abajo.
- **Tarjeta de plan o promo**: va encima del perfil, con radio de 12 a 16 px, botón ancho y cierre × (02/03 "Upgrade to Pro", 06 "Your plan Free", 14 "New: Thermal AI" y anillo de progreso "Inspection coverage 75%"). La de 14 es útil porque muestra un progreso operativo, no publicidad.
- **Selector de espacio de trabajo** arriba, con ⇅ (06 "Workspace / Gr8r Studio"). Botón de colapsar barra con ícono de panel (10, 14).
- **Doble barra**: riel de íconos de unos 72 px más panel contextual de unos 280 px (13). En 04 hay una sub-navegación de Ajustes como segunda columna, con grupos colapsables y activo blanco. En 08 hay un riel de íconos circulares de unos 48 px con activo relleno verde #2F7D6E (estimado).

**Encabezado**
- **Breadcrumb** en la barra superior: ← → de historial, ícono de sección, "Contacts / Contact Details" con el padre en gris y lo actual en negro de 14 a 16 px (03, 04). Con chevron ">" en 01, 07 y 10, con "/" en 13. En 08 el breadcrumb va encima del H1 ("— Expenses").
- **Buscador**: input de 240 a 320 px con atajo ⌘K visible en una caja gris (02). En la barra superior a la derecha (01, 07, 13) o dentro de la barra lateral bajo el logo (06, 14). En 10 se ve ⌘M como atajo del ítem.
- Acción primaria arriba a la derecha y única: "+ Create" violeta (02, 03), "New project" negro (06).

**Pestañas segmentadas (01, 02, 03, 05, 07, 14, 11)**
- Contenedor gris (#F1F1F3 aprox.) con radio de 8 a 10 px y padding de 2 a 4 px. La activa es blanca con sombra de 1 px (02 Day/Week/Month, 05 Storage, 07 All/Online, 14 Daily/Monthly/Yearly y Cards/Map view).
- Contador dentro de la pestaña, en gris o en una cajita: 01 "All 78 · Mentions 4", 03 "Activity 16 · Tasks 4 · Deals 2".
- Variante subrayada de 2 px en negro con ícono (13 Summary/Assigned/Created).
- Píldoras de filtro sueltas con la activa negra (10 "All · Math · Art").
- En móvil, chips 1D/1W/1M en una grilla de ancho completo (11).

**Móvil (09, 11, 12)**
- Barra inferior de 4 íconos, sin texto, con el activo en color de marca (09 cian #0BB4E0 aprox.). En 12 es flotante tipo píldora con el activo expandido a ícono más etiqueta ("Home") y fondo azul tenue.
- Encabezado con botón ← circular de unos 44 px y fondo blanco, título centrado en 18 a 20 px semibold y "…" o compartir a la derecha (11, 12).
- La pantalla raíz no tiene atrás: lleva avatar y campana (11) o hamburguesa y campana (12).
- Botón FAB "+" circular sobre la barra (09). CTA negro de ancho completo pegado abajo, de unos 56 px de alto y radio completo (12 "View PDF", "Preview").
- Selector de días en tira horizontal desplazable con el activo relleno (09).

### 2. Reglas

1. Agrupar la barra lateral en 3 a 5 bloques con rótulo de 11 a 12 px gris. Nunca más de 7 ítems por bloque: cortar con "Ver más".
2. Íconos de navegación monocromos, de trazo y 16 a 18 px. El color solo se usa para identificar entidades (empresa, proyecto, estado).
3. Un solo tratamiento de activo por sistema: píldora `bg-zinc-900 text-white` o `bg-white shadow-xs`. Nunca dos a la vez.
4. Los contadores neutros van en gris sin fondo. El badge relleno rojo se reserva para lo que exige acción (vencidos, sin leer).
5. Los grupos secundarios (Sistema, Configuración) arrancan colapsados y recuerdan su estado.
6. Abajo de todo: perfil con nombre y rol. Encima solo puede ir una tarjeta de progreso operativo descartable con ×.
7. Toda pantalla de detalle lleva breadcrumb `Padre / Actual` con el padre clicable y gris, más ← en el móvil.
8. Buscador global con ⌘K visible en el input. Va en la barra superior o en la lateral, nunca en las dos.
9. Una sola acción primaria rellena por pantalla, arriba a la derecha.
10. Para alternar vistas o períodos se usa control segmentado gris con la activa blanca, no botones sueltos.
11. Las pestañas de una ficha muestran su contador ("Actividad 16").
12. En móvil, barra inferior de 4 o 5 destinos. Por debajo de 768 px nunca va la barra lateral fija.
13. Las pantallas de detalle móviles llevan ← circular, título centrado y CTA de ancho completo abajo.
14. Áreas táctiles de al menos 40 px en escritorio y 44 px en móvil.

### 3. Antipatrones que evitan

- Barras laterales de color de marca saturado. Solo 08 usa color, y únicamente en el ítem activo del riel.
- Íconos multicolor en el menú principal.
- Badges de colores en todos los ítems.
- Menús planos de 20 ítems sin rótulos.
- Pestañas con bordes de caja tipo navegador.
- Breadcrumbs de más de 3 niveles.
- Varios botones primarios compitiendo.
- Hamburguesa en escritorio.
- Texto de ayuda dentro del menú.
