# Documentos y correos

Facturas, presupuestos, informes y correos transaccionales con el mismo lenguaje del sistema. Van con SKILL.md §2 (tipografía), §3 (color), §6c (formato de datos) y con `guias/textos.md` para la redacción.

Ejemplos para abrir y superar, en `ejemplos/documentos/`:

| Archivo | Qué muestra |
|---|---|
| `factura.html` | Factura A de una hoja: letra del comprobante, bandejas de partes, tabla con rayita por tipo, total protagonista, cómo pagar, CAE. Selector de estado (por cobrar, vencida, cobrada). |
| `presupuesto.html` | Presupuesto que fluye a 2 hojas: alcance, opcionales que suman en vivo, total y tramos de pago en la primera hoja; cronograma por semanas, firmas y "Aceptar" con Deshacer en la segunda. |
| `informe-mensual.html` | Informe de 2 hojas fijas: titular con la conclusión, KPIs con dibujo, barras apiladas, hechos del mes, tabla por cliente, proyectos y decisiones. |
| `correo.html` | Correo de aviso de factura en HTML de email (tablas, estilos en línea, 600 px, oscuro tolerable), con variantes recordatorio y vencida. |

---

## 1. La hoja

Grises y tamaños son los de SKILL.md v2 aunque sea papel: `texto-2` #565b68, `texto-3` #6b7080 (el más claro para texto), estados con sus tonos oscuros (verde #15803d, ámbar #b45309, rojo #b91c1c, azul #1d4ed8) y **nada debajo de 12 px**. Sobre el bloque del total, lo secundario va a 88–92 % de opacidad, no al 60 %.

1. **Un documento es una hoja A4, no una pantalla.** En pantalla va una `.hoja` de `210mm × 297mm` sobre el lienzo, con radio 20, borde de 1 px y sombra suave. Al imprimir pierde radio, borde, sombra y margen: queda el papel.
2. **`@page` siempre:** `size:A4; margin:12mm 14mm 14mm`. El número de hoja y la referencia del documento van en las cajas del margen (`@bottom-left`, `@bottom-right` con `counter(page)` y `counter(pages)`, 9 pt en `texto-3`), no en el HTML: nada de "1 / 2" en la cabecera.
3. **El papel es siempre claro.** El tema oscuro se define dentro de `@media screen`; así el PDF sale claro aunque la persona esté mirando en oscuro.
4. **Barra de vista previa arriba, fuera de la hoja:** navegación entre documentos, tema y "Descargar PDF" (`window.print()`). Todo lo que es de pantalla lleva `.solo-pantalla` o vive en la barra, y en `@media print` va `display:none`.
5. **Sin sombras, transiciones ni animaciones al imprimir:** `*{box-shadow:none!important;animation:none!important;transition:none!important}`. El degradé de clima de la cabecera también se apaga.
6. **Animá desde 0 con `@keyframes`, no con transiciones disparadas por JS.** El estado final tiene que ser el estilo base: si la impresión corta la animación, la barra queda entera y no en 0.
7. **Colores que tienen que salir en papel** (pastillas de estado, rayitas, total, barras, bloques de avance) llevan `print-color-adjust:exact` y su versión `-webkit-`. El resto se deja que el navegador ahorre tinta.

## 2. Saltos de página

1. **Páginas fijas → una `.hoja` por página** (informe): `break-after:page` en cada hoja y `auto` en la última. En pantalla se ven como hojas apiladas.
2. **Largo variable → una sola `.hoja` que fluye** (presupuesto, factura con muchos renglones). Se controla con `break-inside:avoid` en filas, tarjetas, bloques de totales y firmas, y `break-after:avoid` en los títulos de sección.
3. **El encabezado de la tabla se repite** en cada hoja: `thead{display:table-header-group}`.
4. **El cierre fiscal o las firmas van pegados al pie** con la hoja en `display:flex; flex-direction:column`, `min-height` un poco menor que el área útil (262 mm para A4 con esos márgenes) y `margin-top:auto` en el cierre. Si el `min-height` es igual al área útil, el redondeo empuja el pie a una hoja nueva.
5. **El total cae en la primera hoja.** Si el documento fluye a dos, ordená para que la hoja 1 diga qué y cuánto (alcance + total) y la 2 cuándo y quién firma (cronograma + firmas). Un bloque grande con `break-inside:avoid` que no entra deja un hueco de un cuarto de hoja: movelo detrás del total antes que achicarlo.
6. **Verificá el PDF real**, no la vista previa: imprimí a PDF y contá las hojas. Si sale una hoja de más con dos renglones, compactá el espaciado dentro de `@media print` (aire entre secciones 16–20 px, filas de 9–10 px) antes que achicar la letra.

## 3. Jerarquía del documento (dónde va la relevancia)

El documento se lee en este orden y el peso visual tiene que seguirlo:

| Orden | Qué | Cómo se destaca |
|---|---|---|
| 1 | **Qué documento es y en qué estado está** | Título display de 40–44 px peso 300 ("Factura", "Presupuesto"), número en mono 14 px, pastilla de estado debajo |
| 2 | **Cuánto** | El total es el **único bloque relleno** de la hoja: tarjeta con degradé del acento, cifra display 32 px blanca, `$` y centavos al 60 % del tamaño y 88 % de opacidad. Arriba, subtotal e impuestos en líneas grises |
| 3 | **Para quién y cuándo** | Bandeja con tarjeta adentro: cliente en display 18 px; datos en pares rótulo gris 12 px arriba y valor 13,5 px abajo |
| 4 | **Por qué** | Tabla: concepto en 600 con su explicación gris debajo; importes a la derecha |
| 5 | **Cómo seguir** | Cómo pagar, firmas, condiciones: bandeja gris, mono para alias y CVU |
| 6 | **Lo legal** | 12 px en `texto-3`, al pie: CAE, punto de venta, letra chica |

- **El informe tiene titular, no título.** El h1 dice la conclusión del mes ("El mejor mes del año, con $ 3,4 M por cobrar") y debajo van 2 o 3 cifras reales con ícono. Nunca "Informe mensual de gestión".
- **Los datos fiscales del emisor no compiten con la marca:** 12 px, rótulos ("CUIT", "IVA", "IIBB") en `texto-3` y valores en `texto-2`.
- **La letra del comprobante** (A, B, C) va en un cuadro de 58 px centrado arriba, con el código en mono 11 px. En celular pasa a la derecha de la marca.

## 4. Tabla de conceptos

- Columnas: Concepto · Cant. · Precio unitario · Importe. Sin líneas verticales; encabezado 12 px gris con hairline abajo; filas separadas por `divisor`.
- **Rayita de 3 px por tipo** (diseño, producción, horas) a la izquierda del concepto, con la paleta de datos. Nunca pintar la fila.
- Cada concepto lleva **título + una línea que lo justifica** ("Pedidas por Sofía el 4 y el 11 de noviembre"). Es lo que evita la pregunta del cliente.
- Unidades en gris junto a la cantidad (`8 h`, `12 pant.`). Montos con `tabular-nums`, `$` y centavos en `texto-3` un paso más chicos.
- El total en letras ("Son pesos tres millones…") va dentro del bloque del total, a 12 px.
- **Opcionales:** en pantalla, casilla del acento que recalcula el total en vivo; en el PDF solo viajan los elegidos, con "· incluido". Lo no elegido no se imprime.

## 5. Estados de un documento

| Documento | Estados | Pastilla |
|---|---|---|
| Factura | Por cobrar · vence en N días / Vencida hace N días / Cobrada · fecha / Anulada | ámbar / rojo / verde / gris |
| Presupuesto | Borrador / Enviado · válido N días / Aceptado · fecha / Vencido / Rechazado | gris / azul / verde / rojo / gris |
| Informe | Sin pastilla: el estado va en el titular | — |

- El estado cambia lo que se ve, no solo la pastilla: una factura cobrada reemplaza "Cómo pagar" por "Cobrada el 20 nov · transferencia" con check verde; una vencida pone en rojo el "hace 3 días" junto al vencimiento.
- **Aceptar un presupuesto** es éxito en el lugar: la pastilla pasa a verde, aparece la firma, el botón se vuelve "✓ Aceptado el 17 nov" y un toast dice la consecuencia ("Quedó en Facturación: anticipo de $ 2.763.640,00") con Deshacer.
- La cifra del anticipo y los tramos de pago se calculan del total, nunca se tipean aparte.

## 6. Vida dentro de un documento

Un documento también puede verse premium sin dejar de ser papel:
- **Un protagonista:** el total (factura, presupuesto) o el KPI principal (informe), con degradé del acento.
- **Color por entidad:** el cuadradito del cliente o proyecto y su color repetido en la tabla, la barra de cobro y las barras del gráfico (en el informe, cada serie es el color de su cliente).
- **Cifras con dibujo:** rayitas hasta el % cobrado, bloques de horas, barra de tramos de pago, cronograma por semanas con barras redondeadas y un hito en rombo.
- **Gráficos de informe:** el mes del informe sólido con su etiqueta oscura, los anteriores al 30 %. SVG con `viewBox` fijo y sin `preserveAspectRatio="none"` cuando lleva texto; en celular, el gráfico se desplaza dentro de su tarjeta en vez de achicarse.
- **En las tarjetas, montos abreviados** ("$ 18,6 M"); completos en tablas y en el total a pagar.

## 7. Celular (390 px)

- La hoja deja de ser A4 (`width:auto`, márgenes de 16, padding 24/20, `min-height:0`). Las reglas de celular van en `@media screen and (max-width:…)` para que nunca afecten la impresión.
- La tabla pasa a filas de dos líneas: concepto e importe arriba, "cantidad × precio" gris abajo (una celda extra `.det` que solo se ve en celular).
- Grillas con `minmax(0,1fr)` y textos largos (CVU, alias) con `word-break:break-all`: si no, un número de 22 dígitos empuja la tarjeta fuera de la pantalla.
- Cronogramas y gráficos anchos se desplazan dentro de su tarjeta; la página nunca tiene scroll horizontal.
- Botones de copiar pasan a ícono solo de 44 px con `aria-label`; los del segmentado de la vista previa también miden 44 de alto.

## 8. Correos transaccionales

**Estructura (de arriba abajo):** preencabezado oculto → marca → tarjeta con número del documento en mono, título grande y firme, bajada con nombre y motivo → bandeja con el monto y la pastilla de estado → datos en pares rótulo/valor → **un solo botón** → frase de qué hacer si algo no coincide → pie legal chico fuera de la tarjeta.

**Compatibilidad:**
1. Maquetá con `<table role="presentation">`, estilos **en línea** en cada celda y ancho fijo de 600 px dentro de un contenedor de Outlook (`<!--[if mso]>`). El `<style>` del `<head>` es solo mejora progresiva: el correo tiene que verse bien sin él.
2. **Nada de íconos de fuente, SVG, flex, grid ni variables CSS.** Gmail los descarta. Los puntos de estado van con el carácter `&#9679;`; la marca, con una celda de color y una letra.
3. **Botón a prueba de Outlook:** celda con fondo + `<a>` en bloque, y `v:roundrect` en VML dentro de `<!--[if mso]>`. Toda la celda es clickeable.
4. Los bordes redondeados en celdas necesitan `border-collapse:separate` en la tabla que las contiene; con `collapse` las esquinas salen cuadradas.
5. Fuentes de Google con `<link>` y siempre su respaldo en línea: `'Geist',Helvetica,Arial,sans-serif`. Mono con `Menlo,Consolas,monospace`.
6. Preencabezado: un `div` oculto con el dato que importa ("Total $ 3.146.000,00 · vence el 2 dic") y relleno de `&#847;&zwnj;&nbsp;` para que no se cuele el texto del cuerpo.
7. Celular con `@media (max-width:620px)`: ancho al 100 %, padding lateral de 20, monto a 32 px y columnas apiladas (`.em-col{display:block}`).

**Modo oscuro tolerable:**
- `<meta name="color-scheme" content="light dark">` y `supported-color-schemes`, más `:root{color-scheme:light dark}`.
- Clases `em-*` en cada superficie y texto, con su versión oscura en `@media (prefers-color-scheme:dark)` y `!important` (los estilos en línea mandan si no). Para Outlook.com, las mismas reglas con `[data-ogsc]` (texto) y `[data-ogsb]` (fondos).
- Nada de blanco puro sobre negro puro ni de logos con fondo blanco: la marca va en un cuadro de color oscuro que funciona sobre los dos fondos. El botón se invierte (claro con texto oscuro).
- Probalo con el cliente forzando oscuro (Gmail app y Outlook invierten a su manera): lo que tiene que sobrevivir es el contraste del monto, la pastilla y el botón.

**Textos:**
- Asunto: documento + monto + fecha. "Factura A 0003-00001287 · $ 3.146.000,00 · vence el 2 dic". Nunca "Notificación" o "Aviso importante".
- Título por variante: aviso "Te enviamos la factura de la etapa 2", recordatorio "Tu factura vence el miércoles", vencida "La factura venció hace 3 días". Sin signos de exclamación ni "Estimado cliente".
- La bajada nombra a la persona y el motivo concreto. En el recordatorio, "Si ya la pagaste, ignorá este correo".
- El botón dice qué pasa al tocarlo: "Ver la factura", "Ver y pagar". Nunca "Hacé clic acá".
- El pie dice por qué le llega el correo y cómo cambiarlo.

## 9. Antes de entregar un documento

1. ¿Imprime a PDF en la cantidad de hojas que esperás, sin huecos de un cuarto de hoja, con el total en la primera, el pie en su lugar y el encabezado de tabla repetido?
2. ¿El PDF sale claro aunque estés en oscuro? ¿Sin sombras, sin barra, sin botones?
3. ¿El total es lo único relleno y se lee primero después del título?
4. ¿Cada concepto dice por qué se cobra? ¿Los montos tienen `$` y centavos en gris y `tabular-nums` (en la hoja, `.hoja *{font-variant-numeric:tabular-nums}` evita que un atajo `font:` lo pise)? ¿Algún texto quedó debajo de 12 px o de 4,5:1?
5. ¿El estado cambia lo que se muestra, no solo la pastilla?
6. ¿A 390 px no hay scroll horizontal y la tabla se lee en filas de dos líneas?
7. En el correo: ¿funciona sin el `<style>`? ¿El botón tiene VML? ¿Se lee en oscuro? ¿El asunto y el preencabezado tienen el monto y la fecha?
