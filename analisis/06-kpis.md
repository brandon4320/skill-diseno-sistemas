## Tarjetas de métricas / KPI

### 1. Patrones observados
Los px y hex son estimados, salvo cuando digo que se ve.

**Anatomía de 4 capas.** Se ve con más claridad en 06:
- **Rótulo** arriba, 12–13px, gris medio (aprox. #6B7280), peso 400, en minúscula y sin mayúsculas sostenidas: "Open tasks", "Overdue".
- **Número**, 24–28px, peso 500, color tinta (#111). El número nunca va coloreado.
- **Línea de contexto** pegada al número, 12px gris: "Across 4 active projects", "3 the week before", "Last 7 days, 1 failed", "Mostly comments".
- **Pie** separado por un divisor de 1px: ícono 14px a la izquierda y delta o estado alineado a la derecha ("+18 this week", "+33% vs last week", "Needs attention" en rojo).

Las tarjetas miden unos 210×130px, tienen radio de 10–12px y borde de 1px (#E5E7EB). Se ven como una tarjeta interna dentro de un marco gris claro (doble contorno).

**Variante financiera (07).**
- Ícono 14px + rótulo + kebab ⋮ a la derecha.
- Valor de 22px en peso 600 ("$55,400").
- Micro-barra de marcas punteadas, de unos 6px de alto, rellena hasta el porcentaje en el color propio de la métrica (naranja, azul, verde, amarillo) y con el resto en gris.
- Delta "↗ +15.2%" en verde, seguido de "vs. prior period" en tinta.
- En "Refunds", el "↘ -3.1%" parece verde: el color indica si el cambio es bueno o malo, no si el número sube o baja. Esto es estimado, el tono no se distingue del todo.

**Número con fracción o denominador (14).** "17 / 20" y "71 %" llevan el denominador o la unidad a unos 11px en gris. El contexto va debajo: "site slots in use", "of 63 work orders completed". Más abajo hay un desglose en filas con la forma rótulo · barra fina de 4px · cantidad (Online verde, Partial amarillo, Offline rojo, Free gris).

**Tarjeta de entidad con métrica (14, sitios).**
- Nombre + pastilla de estado ("● Online" verde, "● Partial" ámbar, "● Offline" rojo).
- Valor de 28px en tabular/mono ("140.9") con la unidad "kWh" a 12px gris.
- Barra de progreso de 3px coloreada por estado (blanco = normal, ámbar = parcial, rojo = offline).
- Pie a dos lados: "80% of expected" y "175 kWh".
- Tres submétricas (PR / EPI / Avail.) con rótulo de 10px y valor de 14px, separadas por divisores verticales.

**Héroe móvil (11, 12).**
- Rótulo gris de 14px ("Total saving", "Invoice sent for approval").
- Monto de 32–36px en peso 700. El "$" y los decimales van atenuados en gris ("$15,185.81").
- Delta "+12.3%" en verde + "vs last month" en gris, en una sola línea.
- En 12, en lugar del delta hay una pastilla de estado ("🔒 Guaranteed payout", verde sobre #E8F7EE).

**Mosaicos de dos columnas (09, 11).** Ícono de color arriba, número de 24–28px y rótulo debajo del número ("7 days / Current streak", "82% / Completed tasks"). Radio de 20–24px, fondo gris (#EDEDED) sin borde.

**Delta como chip (13, 08).**
- En 13: "↗" dentro de un círculo verde claro + "+3" en verde + "this week" en gris. El número es grande (unos 44px) y el rótulo lleva un ícono ⓘ.
- En 08: pastilla diminuta "+9.4%" (10px, fondo verde muy claro) a la derecha del valor; la negativa "-12.1" va en rojo sobre rosa (Cash Flow).

**Sparkline o área (08, 06).** Ocupa el tercio inferior de la tarjeta, con trazo de 1.5px y relleno degradado al 10%. Solo una tarjeta "héroe" va rellena de color (teal en 08). En 06 los proyectos llevan una línea de 14 días con pie "12 updates · 14 days … 1 done".

**Proporción de uso (05, 04).**
- En 05: "94%" grande, alineado a la derecha, con "1.2 GB remaining" debajo, y una barra segmentada de 8px con leyenda "Contacts: 1.9 GB" (rótulo gris, valor en tinta).
- En 04: "18.8 GB used of 20 GB" como contexto.
- En las tablas el crecimiento "+4.2%" va en gris neutro, sin color.

**Agrupación.**
- Una fila de 4 (07, 08) o 6 (06) tarjetas de igual ancho con unos 12–16px de separación, bajo un título de sección chico ("Summary") o directamente bajo el encabezado de la página.
- En móvil: un héroe a ancho completo + una cuadrícula de 2×2 (11) o de 2×1 (09).
- Las métricas también aparecen en línea en los encabezados de sección: "4 Total" en 03, "22 This week" en 09, "78 unread" en el subtítulo de 01.

### 2. Reglas
1. Toda tarjeta KPI tiene rótulo + número + línea de contexto. Un número suelto sin su "de qué" o "respecto de qué" no se publica.
2. Poné el número en tinta neutra, nunca en rojo ni verde. El color va solo en el delta, en la pastilla de estado o en la barra.
3. El color del delta sale de si el cambio es bueno o malo para el negocio, no del signo: si baja la mora es verde, si suben los vencidos es rojo.
4. Escribí siempre el delta con su período ("+12% vs. mes anterior", "+3 esta semana"). El porcentaje solo no alcanza.
5. Usá rojo solo cuando haya que actuar ("Requiere atención", "2 vencidas"). Si el delta es informativo, va en gris.
6. Unidades, "$" y decimales van a 60–70% del tamaño del número y en gris. Usá `tabular-nums`.
7. Escala: rótulo 12–13px, número 24–28px (36px en el héroe móvil), contexto 12px. Como máximo dos pesos (400 y 500/600).
8. Una sola tarjeta héroe con relleno de color por pantalla, como mucho. El resto va blanca con borde de 1px.
9. Las filas de KPI llevan entre 3 y 6 tarjetas del mismo ancho y alto. En móvil, un héroe + 2 columnas.
10. Mostrá avance contra una meta con barra fina (3–6px) + "X de Y" o "N% de lo esperado", no con una torta.
11. Cada tarjeta lleva a su lista filtrada: pie clickeable, flecha ↗ o "Ver todo".
12. El pie va separado por un divisor y tiene a lo sumo dos piezas: ícono o texto a la izquierda y delta o estado a la derecha.
13. Si hay un desglose, va dentro de la tarjeta en filas de rótulo · barra · cantidad, con no más de 6 filas.

### 3. Antipatrones que estas referencias evitan
- Números de colores o con degradé.
- Íconos grandes de colores compitiendo con el número (el ícono va a 14px y en gris, salvo en móvil).
- Sombras fuertes.
- Gauges y velocímetros.
- Tortas para un solo valor.
- Deltas sin período.
- Más de una línea de explicación.
- Tarjetas de alturas distintas en una misma fila.
- Siglas sin rótulo.
- Decimales innecesarios en cifras grandes: usan "$241K" en las tarjetas y el valor completo solo en el detalle.
