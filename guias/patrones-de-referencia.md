# Patrones de referencia (69 tweets de diseñadores)

Catálogo de lo mejor de las 69 referencias analizadas en `analisis/tweets/*.md` (01–65) y `analisis/18-tweets-66-69.md` (66–69). Acá va solo lo que suma a `SKILL.md`; lo que ya está ahí (tabla sin verticales, pastilla de estado, un solo relleno, Deshacer, bandeja con tarjeta, segmentado, hoja lateral básica) no se repite.

Cómo leer cada patrón:
- **Resuelve:** el problema.
- **Cómo:** medidas, pesos, colores y tiempos.
- **Ref:** número de tweet y @autor. Los cuadros originales están en `scratchpad/tweets/NN/` de la sesión que los bajó; si ya no existen, vale el análisis.
- **Regla:** lo que se hace, en imperativo.

Autores: 01–09, 14–19, 36, 43–46 @louisnstudio · 10, 20–22, 31–34, 37–40, 47–49, 56 @zahragr8r · 11, 23–25, 28–30, 41–42, 50–51, 57–60 @Tanjim38 · 12 @soluna_stensale · 13 @orevbajohn_ · 26, 52–55 @saurra3h · 27 @alidalton · 35 @raunofreiberg · 61–65 @jsngr · 66 @x6sense · 67 @jaimintf · 68 @suryansh777777 · 69 @murad_ux.

---

## 1. Tablas y grillas de datos

**1.1 · Densidad en 3 niveles**
- Resuelve: una sola altura de fila no sirve para quien revisa 200 contratos y para quien lee 10.
- Cómo: Compacta 28 px · Normal 36 px · Cómoda 44 px. Cada opción con título 13/500 y bajada 11–12 gris ("Más filas en pantalla", "Equilibrada para leer", "Más aire en cada fila"), ✓ a la derecha en la elegida. La tabla cambia en vivo detrás del panel.
- Ref: 01 @louisnstudio · 41 @Tanjim38 (Cómoda | Compacta en Ajustes, por separado para menú y listas).
- Regla: Ofrecé las 3 densidades y guardalas por usuario y por tabla. Reemplaza el "filas de 40 px" fijo.

**1.2 · Encabezado con ícono de tipo de dato**
- Resuelve: leer qué hay en cada columna sin mirar el contenido.
- Cómo: ícono de 14–16 px gris + nombre 12–13 gris. Mismo ícono para el mismo tipo en todo el sistema: persona, calendario, $, enlace, etiqueta, estado, #.
- Ref: 05, 06, 43 @louisnstudio · 12 @soluna_stensale · 13 @orevbajohn_.
- Regla: Poné el ícono del tipo antes del nombre de cada columna, sacado de un único mapa tipo→ícono.

**1.3 · Anchos por tipo, no repartidos**
- Resuelve: columnas de fecha anchas y nombres cortados.
- Cómo: texto principal 200–240 · persona 160 · fecha 110–120 · monto 120 a la derecha · estado 110 · correo 160. En la tabla de proyectos 50, el nombre se lleva ~40 % del ancho.
- Ref: 03 @louisnstudio · 50 @Tanjim38.
- Regla: Definí el ancho por defecto según el tipo de dato de la columna.

**1.4 · Columna identificadora fija y con candado**
- Resuelve: perder de qué fila es cada dato al scrollear de costado.
- Cómo: `position: sticky; left: 0`, fondo sólido (si no, se transparenta), hairline o sombra a su derecha solo cuando hay scroll horizontal. En el panel de columnas lleva 🔒 y no se oculta ni se mueve. Su menú de encabezado se reduce a orden + filtrar.
- Ref: 01, 03, 04 @louisnstudio.
- Regla: Fijá la primera columna con fondo sólido y bloqueá ocultarla o moverla.

**1.5 · Redimensionar columnas**
- Resuelve: valores largos (razón social, descripción) sin romper la tabla.
- Cómo: zona de agarre 6–8 px en el borde del encabezado, cursor `col-resize`, guía de 2 px del acento (o tinta; blanca en oscuro) a todo el alto mientras se arrastra, el encabezado toma `bg-suave`. Sigue al mouse sin easing. Lo que se achica trunca con "…", nunca salta de línea.
- Ref: 03, 07 @louisnstudio.
- Regla: Permití redimensionar con guía de 2 px, guardá el ancho por persona y vista, y poné "Restablecer anchos" en el panel Vista.

**1.6 · Mover columnas arrastrando**
- Resuelve: cada persona ordena las columnas como trabaja.
- Cómo: mano abierta al pasar por el encabezado; al agarrar, ficha fantasma (~220×30, superficie, sombra flotante, radio 6) que sigue al cursor; origen al 30–40 % (20–30 % en oscuro); línea de inserción vertical de 2 px tinta a todo el alto; al soltar las columnas se corren 200 ms ease-out y la que cayó queda en `bg-suave` un instante.
- Ref: 02, 03, 09 @louisnstudio.
- Regla: Mostrá fantasma, origen atenuado y línea de inserción; animá el reacomodo en 200 ms.

**1.7 · Menú del encabezado**
- Resuelve: ordenar, filtrar u ocultar sin ir a otro panel.
- Cómo: ~160 px, filas de 24 px, ícono 14. Orden: Ascendente / Descendente / Sin orden (✓ en la activa) · Filtrar esta columna · Mover a la derecha / izquierda / al final / al principio · línea · **Ocultar en rojo, último**. Las opciones imposibles por posición (mover a la izquierda en la primera) se ven deshabilitadas, no se esconden.
- Ref: 02, 04 @louisnstudio.
- Regla: Clic en el encabezado ordena asc → desc → sin orden con ↑/↓; ⌄ o clic derecho abre el menú con Ocultar al final en rojo.

**1.8 · Indicador de orden en reposo y activo**
- Resuelve: saber por qué columna está ordenada la tabla.
- Cómo: en reposo ⇅ de 12 px en círculo gris muy tenue (solo al pasar); activo, flecha ↑/↓ junto al rótulo dentro de un círculo con borde más marcado.
- Ref: 07 @louisnstudio.
- Regla: Mostrá la flecha solo en la columna ordenada; el resto queda limpio.

**1.9 · Pie fijo con total y "Calcular"**
- Resuelve: las filas de totales hechas a mano y el "¿cuánto suma esto?".
- Cómo: pie fijo de la tabla con "31 facturas" (11 gris) a la izquierda y "Total € 213.949,00" (tinta 600) a la derecha; en cada columna un "⌄ Calcular" gris que aparece al pasar y elige suma / promedio / conteo. Si hay filtro, el total es del filtro.
- Ref: 01, 05, 07, 09, 43 @louisnstudio.
- Regla: Toda tabla con montos lleva pie fijo con "N registros" y "Total"; sumá "Calcular" por columna en las tablas de análisis.

**1.10 · Código de entidad dentro de la celda del título**
- Resuelve: una columna entera gastada en "CT-1001".
- Cómo: "Plan Scale CT-1001": título en tinta, código en mono gris un paso más chico, con tracking ancho, pegado al título. Columna propia solo si se ordena o filtra por él (entonces ~160 px, primera columna, mono `texto-3`).
- Ref: 06, 07 @louisnstudio · 25 @Tanjim38 · 41 @Tanjim38.
- Regla: Pegá el código al título en mono gris; dale columna solo si se ordena por él.

**1.11 · Celda con dos datos sin pelear**
- Resuelve: valor y su lectura en el mismo lugar.
- Cómo: "+12,45 %" a la izquierda y la pastilla de calificación a la derecha de la misma celda; o fecha absoluta + "en 35 días" a la derecha, que pasa a ámbar/rojo cuando se acerca.
- Ref: 01, 02, 09 @louisnstudio.
- Regla: Juntá valor + lectura en una celda alineando uno a cada lado; el color va solo en la lectura que exige actuar.

**1.12 · Celda de resultado: ícono + valor del mismo color**
- Resuelve: puntajes y resultados que se leen sin depender del color.
- Cómo: círculo de 22–24 px con fondo al 12 % (✓ verde, – ámbar, ✕ rojo) + valor ".94" en mono 14 del mismo color.
- Ref: 53 @saurra3h.
- Regla: En celdas de resultado combiná ícono en círculo tintado y el valor en mono del mismo tono.

**1.13 · Contexto visual en la celda**
- Resuelve: filas que se escanean por forma, no por lectura.
- Cómo: bandera 14 px antes de la ciudad, avatar 16 antes de la persona, 🔗 gris antes del dominio, cuadradito de color 12–20 px (radio 3) como "logo" de la empresa, logos de medio de pago. Etiquetas en cajita con borde del color al 40 % y texto 10–11 del color, sin relleno fuerte (en oscuro borde 35 %, texto 85 %).
- Ref: 02, 03, 05, 06, 43 @louisnstudio.
- Regla: Poné un marcador de 12–16 px antes de cada valor tipado; las etiquetas van con borde, nunca rellenas.

**1.14 · Casilla y acciones solo al pasar**
- Resuelve: tabla limpia sin perder la selección múltiple.
- Cómo: casilla tenue o invisible en reposo, rellena al pasar o cuando ya hay una selección activa; hover de fila `bg-suave` 3–4 % (oscuro #161616 sobre #0E0E0E), sin borde ni elevación. ⋯, ⊕, × aparecen solo en la fila con hover o activa.
- Ref: 02 @louisnstudio · 13 @orevbajohn_ · 53 @saurra3h · 65 @jsngr.
- Regla: Mostrá casilla y acciones secundarias solo en hover o con selección activa.

**1.15 · Columna "Modificó"**
- Resuelve: saber a quién preguntar cuando un dato está mal.
- Cómo: avatar 16–20 + nombre; "—" gris si no hay dato; al pasar, "hace X · qué cambió".
- Ref: 51 @Tanjim38.
- Regla: Sumá "Modificó" a toda lista de registros editables, alimentada del historial que ya existe.

**1.16 · Lista mínima de entidades en curso**
- Resuelve: tablas de 12 columnas que nadie lee.
- Cómo: 4–5 columnas: nombre (16/500), contexto en mono si es código, quiénes (pila de avatares de 22 con 6 px de solape: el largo de la pila es el dato), actualizado relativo ("Ahora", "hace 2 días", "21 sep"). Filas de ~64 px.
- Ref: 50 @Tanjim38 · 23 @Tanjim38.
- Regla: Limitá las listas de "en curso" a 5 columnas; el resto va a la ficha.

**1.17 · Lo resuelto en gris, sin pastilla**
- Resuelve: 40 pastillas verdes de "Completado" que tapan el único "Bloqueado".
- Cómo: "✓ Completado" en `texto-2` sin fondo; solo "⚠ Bloqueado — motivo" en rojo. Pasos en fracción mono "4/6".
- Ref: 25, 49 @Tanjim38/@zahragr8r.
- Regla: En tablas con mayoría resuelta, mostrá lo resuelto como ícono + texto gris y reservá la pastilla o el rojo para lo que hay que atender.

**1.18 · Fila sombreada por gravedad**
- Resuelve: encontrar el error en un registro o una lista larga.
- Cómo: advertencia: fila entera ámbar al 8 % + texto ámbar; error: rojo al 12 % + texto rojo. Filas apagadas (integración desconectada) bajan enteras al 50 %.
- Ref: 54, 55 @saurra3h.
- Regla: En registros y listas técnicas, sombreá la fila entera según gravedad; nunca la pintes por estado normal.

**1.19 · Modo planilla (con verticales) solo donde se edita**
- Resuelve: el choque entre "sin líneas verticales" y las grillas tipo planilla de las referencias.
- Cómo: verticales hairline muy tenues (#F0F0F0) + columna # de 32–64 px + casilla.
- Ref: 06, 09 @louisnstudio · 12 @soluna_stensale.
- Regla: Admití verticales solo en vistas "Tabla" editables tipo planilla; las listas comunes siguen sin verticales.

**1.20 · Desvanecido al pie**
- Resuelve: indicar que hay más abajo sin barra de scroll.
- Cómo: máscara de degradé de 24–32 px en la última fila visible (a ~30 %), en tablas, menús largos y ⌘K.
- Ref: 28 @Tanjim38 · 43 @louisnstudio · 57 @Tanjim38.
- Regla: Terminá todo contenedor con scroll en una máscara de degradé, no en un corte seco.

**No copiar:** la columna de acciones fija que pisa los montos ("€9.999,0C", 07); "Vencido" en pastilla blanca neutra (07); la probabilidad pintada verde/rojo por umbral (28).

---

## 2. Vistas guardadas, agrupar, filtrar y ordenar

**2.1 · Panel "Vista" con el valor actual a la vista**
- Resuelve: no saber por qué ves lo que ves.
- Cómo: hoja derecha de 260–280 px que empuja la tabla. Primer nivel: filas con rótulo + valor actual gris + › ("Densidad · Compacta ›", "Columnas · 6 de 8 ›", "Filtro · 1 ›", "Orden · Ninguno ›"). Grupos separados por hueco de 8 px sin línea: Diseño · Densidad y anchos · Columnas, filtro y orden · Exportar. Cada opción abre un subpanel que reemplaza al panel, con "← Volver" 12 gris y ×. Nada de popovers apilados.
- Ref: 01 @louisnstudio.
- Regla: Toda tabla con más de 5 columnas lleva panel Vista con el valor actual de cada ajuste en el primer nivel.

**2.2 · Mostrar/ocultar columnas**
- Cómo: casillas con el ícono de cada columna, cabecera "6 de 8 columnas visibles" + "Todas / Ninguna", la identificadora con candado; la columna entra o sale al instante.
- Ref: 01 @louisnstudio · 13 @orevbajohn_ ("+ Agregar columna" con buscador de atributos y "+ Crear atributo" al final).
- Regla: Ocultá columnas desde casillas con conteo; la principal no se oculta.

**2.3 · Filtro por facetas en hoja lateral**
- Resuelve: filtrar 5 campos sin un formulario.
- Cómo: buscador arriba con placeholder que nombra los campos ("Empresa, responsable, ciudad o web"); grupos con rótulo MAYÚSCULA 10–11 gris tracking, 16–20 px entre grupos; facetas como botones de 22–24 px, texto 11, radio 4, borde 1, separadas 6 px; la activa se invierte (negro/blanco en claro, blanco/negro en oscuro); varias por grupo; "Todos" explícito y activo por defecto en los excluyentes. La faceta usa el mismo código visual que la celda (punto, avatar). Pie fijo: "Mostrando 9 de 50 empresas" + "Limpiar" (apagado si no hay filtro).
- Ref: 04 @louisnstudio.
- Regla: Filtrá en vivo, sin botón Aplicar, con el pie "Mostrando X de Y · Limpiar" y el estado en la URL.

**2.4 · Filtros complejos en panel izquierdo plegable**
- Cómo: ~260 px, acordeón por grupo (Responsable y acceso / Tiempo / Montos / Otros) con rótulo MAYÚSCULA 12 gris y ⌃; cada filtro con ícono 16 + nombre y su control abajo ("es alguno de", Desde/Hasta). "Ocultar filtros" con contador.
- Ref: 10 @zahragr8r.
- Regla: Con más de 4 campos de filtro, pasalos a un panel izquierdo plegable en acordeón.

**2.5 · Insignia de filtros activos**
- Cómo: círculo de ~14 px en tinta con el número sobre el botón "Filtrar y ordenar".
- Ref: 02, 04, 09 @louisnstudio.
- Regla: Todo botón que esconde filtros muestra cuántos hay activos.

**2.6 · Pestañas de estado que son leyenda**
- Resuelve: filtro y leyenda de colores en una sola fila.
- Cómo: punto de 6 px del estado + nombre + conteo gris ("● Activos 43 · ● Por vencer 8 · ● Terminados 0"). La activa en `bg-suave` con borde, ~36 px, radio 8. El 0 se muestra.
- Ref: 01, 06, 43 @louisnstudio.
- Regla: Las pestañas de estado llevan punto, nombre y conteo, también en 0.

**2.7 · Vistas como pestañas de la entidad**
- Resuelve: una página distinta por cada vista.
- Cómo: bajo el título, fila de pestañas con ícono 14 (Resumen, Tablero, Lista, Tabla, Calendario, Timeline, Archivos, Actividad) + filtros guardados ("Alta prioridad") + "+ Vista" con borde punteado claro. Selector de vista con menú: 2 tarjetas grandes de opción (Pipeline / Tabla, la activa con acento al 10 % y borde) · línea · ☆ Favorito, Renombrar, Duplicar · línea · Borrar en rojo.
- Ref: 41 @Tanjim38 · 13 @orevbajohn_ · 02, 04, 07 @louisnstudio.
- Regla: Poné las vistas de una entidad y sus filtros guardados como pestañas de una sola fila; nunca una ruta por vista.

**2.8 · Agrupar por urgencia con bandas**
- Resuelve: tareas y vencimientos que se ordenan solos por lo que importa.
- Cómo: bandas de grupo `bg-suave` de 36–40 px a todo el ancho: Vencidas / Hoy / Mañana / Próximas, rótulo 12 gris + conteo. Rojo solo en la fecha vencida con su ícono, nunca en la fila. Encabezado de grupo con chevron, ícono de estado, nombre, conteo y `+`; "+ Agregar tarea" gris al final de cada grupo.
- Ref: 12 @soluna_stensale · 41 @Tanjim38.
- Regla: Agrupá listas de pendientes por urgencia con bandas; el rojo vive solo en la fecha.

**2.9 · "Agrupar por" con el valor visible**
- Cómo: desplegable con borde "Agrupar: Proyecto"; "Orden: Manual" como botón de texto con ícono.
- Ref: 37 @zahragr8r.
- Regla: Mostrá el agrupamiento actual en el propio control.

**2.10 · Filtrar y ordenar sin recargar**
- Cómo: las filas se recolocan con FLIP/`layout` 200–300 ms; las que salen se achican en alto y desvanecen, las que quedan suben (~250 ms). Con `prefers-reduced-motion`, cambio directo.
- Ref: 02, 04 @louisnstudio.
- Regla: Ordenar o filtrar nunca parpadea: las filas viajan a su lugar.

---

## 3. Edición en el lugar y hojas

**3.1 · Ficha como lista de propiedades**
- Resuelve: formularios de edición que reemplazan la página.
- Cómo: ficha centrada de ~600 px; ícono en cuadro de 44 + título 24/400. Debajo, propiedades en 2 columnas: rótulo con ícono 13 gris a ancho fijo (95–160 px) y valor tinta a la derecha, filas de ~38 px; los selectores llevan ⌃⌄ y se abren en el lugar. Después "Notas" con "+ Agregar" a la derecha y "Actividad" en frases con hora relativa.
- Ref: 12 @soluna_stensale · 14, 15 @louisnstudio.
- Regla: Armá la ficha como lista rótulo/valor editable en el lugar; cada campo existente se mapea a una fila.

**3.2 · Renglón-pastilla de parámetros**
- Resuelve: paneles de ajustes de vista o de gráfico.
- Cómo: renglones de 36–40 px, fondo `suave` (#F4F4F5), radio 8, separados 8; rótulo gris a la izquierda, valor tinta + ⌄ a la derecha. Sí/No como segmentado "No | Sí" adentro del renglón; número que se cambia arrastrando (cursor ◂▸) y el fondo se llena hasta el valor; color como hex + muestra de 20 px. Valor cambiado: caja azul al 10 % + ↺ propio.
- Ref: 61, 63 @jsngr.
- Regla: Usá renglones-pastilla para parámetros de vista; marcá lo cambiado y ofrecé volverlo de a uno.

**3.3 · Hoja que empuja, no tapa**
- Resuelve: abrir un registro sin perder la tabla.
- Cómo: 380–460 px; la tabla se achica y sigue usable. Arriba migas propias ("Aplicaciones / Adobe"), ☆, ⋯, ×; logo 44, título 18, acción con borde a la derecha, etiquetas, pestañas con ícono.
- Ref: 43 @louisnstudio · 01 @louisnstudio.
- Regla: Abrí el detalle desde tabla o ⌘K en una hoja que empuja el contenido.

**3.4 · Panel auxiliar en 3 modos**
- Cómo: lateral por defecto (400–480 px, borde izquierdo arrastrable), página completa y flotante (~440×620 con sombra grande y el fondo sin oscurecer). Menú "Cambiar diseño" con ✓. El contenido y el estado se conservan y el modo se recuerda.
- Ref: 18 @louisnstudio.
- Regla: Todo panel auxiliar (asistente, comentarios, detalle) ofrece lateral, completo y flotante sin perder estado.

**3.5 · Modal de alta con contexto precargado**
- Resuelve: cargar una tarea en 3 segundos desde donde estás.
- Cómo: ~440 px, radio 12, encabezado 15 + × con hairline, padding 12–16, 16 entre campos. Pares en 2 columnas (Proyecto/Responsables, Estado/Prioridad, Inicio/Vence), texto libre a todo el ancho, rótulos 12/500 arriba. Campos `#F7F7F5` con borde tenue; foco en blanco con borde de 2 px del acento y halo. Selects con el punto de color del valor (también cerrado). Fondo desenfocado 6–8 px + velo claro. Pie: casilla "Crear otra" a la izquierda, Cancelar y Crear a la derecha.
- Ref: 39 @zahragr8r.
- Regla: Abrí toda alta con el contexto ya elegido y el foco en el primer texto; con "Crear otra" el formulario se vacía y conserva el contexto.

**3.6 · Modal de edición sin navegar**
- Cómo: ~530 px, campos de 40 px, gap 12–16, 2 columnas con gap 12; el nombre abre con el cursor al final, sin seleccionar. Pie en 3 zonas: "Borrar proyecto" como texto sin relleno a la izquierda · Cancelar con borde · Guardar relleno.
- Ref: 40 @zahragr8r.
- Regla: Editar nunca navega: modal si son menos de 10 campos, hoja si se edita mirando el detalle; al guardar quedás en el mismo scroll. Borrar va a la izquierda, lejos de Guardar.

**3.7 · Selector de color de entidad**
- Cómo: fila de 8 círculos de 28 px separados 10; el elegido con anillo exterior de 2 px a 2 px de aire y ✓ blanco.
- Ref: 40 @zahragr8r · 41 @Tanjim38 (acento entre 6 círculos).
- Regla: Elegí el color de una entidad de la paleta fija, nunca con selector libre.

**3.8 · Chips-botón en lugar de dropdown**
- Cómo: 2–6 opciones excluyentes como chips de 32 px, radio 8, borde 1, 8 de separación; activo en blanco con sombra mínima. Multiselección con cuadradito de 6 px antes del texto (negro el elegido, gris el resto).
- Ref: 21 @zahragr8r.
- Regla: Para 2–6 opciones dentro de un formulario usá chips; el select queda para listas largas.

**3.9 · Tarjetas de opción con descripción**
- Cómo: fila de 54–56 px, tile de ícono 28, título 13/500, descripción 12 gris, radio/toggle/casilla a la derecha; la elegida marcada por borde (1 px blanco en oscuro, 1,5 px acento + fondo 8 % en claro), no por relleno. "Recomendado" en pastilla azul chica, sin preseleccionar a la fuerza. Variante en 3 columnas (~105×60) para tonos.
- Ref: 09, 19 @louisnstudio · 17 @louisnstudio · 59 @Tanjim38.
- Regla: Elecciones de 2 a 5 opciones con explicación van como tarjetas seleccionables.

**3.10 · Tarjetas con vista previa para elegir forma**
- Cómo: tema, plantilla de factura o diseño de remito como tarjetas con dibujo arriba (~48 px, CSS) sobre `suave` y banda blanca abajo con ícono, nombre y radio de 18 px (elegido relleno negro o check + borde del acento).
- Ref: 47 @zahragr8r · 41 @Tanjim38 · 08 @louisnstudio (Clásica / Partida / Libro mayor).
- Regla: Toda elección visual se hace sobre miniaturas, no en un `<select>`.

**3.11 · Formulario largo en bandejas**
- Cómo: cada grupo en bandeja `suave` radio 16, padding 8, rótulo con ícono 14 arriba (16/500), contenido en blanco; secciones separadas 20. Campos en 2 columnas (gap 24 × 20) y 1 en celular; input de ~36 px, radio 8, con ícono gris 16 adentro según el tipo (persona, sobre, teléfono, calendario, pin, CUIT, $). "(Opcional)" en gris dentro del rótulo. Un solo relleno al pie alineado al contenido.
- Ref: 47 @zahragr8r · 20, 21 @zahragr8r.
- Regla: Agrupá formularios largos en bandejas y poné el ícono del tipo dentro de cada input tipado.

**3.12 · Documento editado sobre su vista previa**
- Resuelve: facturas, remitos y cotizaciones que se editan en un formulario ciego.
- Cómo: la hoja real sobre lienzo de puntos (1 px cada 16 px, gris 8 %), campos en el lugar ("+ Agregar renglón", "CUIT (opcional)" en gris claro), total como frase grande ("$ 1.080,00 vence 26 nov", ~20 px). Panel derecho 240–280 px: Diseño (3 miniaturas), Acento (5 círculos de 24), Letra Sans|Mono y Espaciado como segmentados, "Mostrar" con toggles, plazos en chips (7/14/30/45/60). Barra: código + pastilla Borrador + monto gris; Personalizar (fantasma), Guardar borrador (borde), **Enviar** (único relleno).
- Ref: 08 @louisnstudio.
- Regla: Editá los documentos que salen del sistema sobre su vista previa; las opciones de forma no tocan los datos.

**3.13 · Guardado automático en la miga**
- Cómo: "✓ Guardado" 12 gris junto a las migas; sin botón Guardar en editores.
- Ref: 26 @saurra3h.
- Regla: En editores con autoguardado, mostrá el estado de guardado al lado del título y sacá el botón.

**3.14 · Campo que dice su tecla**
- Cómo: "Agregá una tarea y apretá Enter…", "Una por línea", "Escribí la etiqueta y Enter"; etiquetas como chips × dentro del campo.
- Ref: 62 @jsngr · 39, 40 @zahragr8r.
- Regla: El placeholder dice cómo se confirma.

---

## 4. Selección y acciones en lote

**4.1 · Vista previa con datos reales antes de una acción masiva**
- Resuelve: aplicar un aumento o facturar en lote a ciegas.
- Cómo: panel "Vista previa · últimos 30 días · 214 contratos" con una frase de consecuencia (rojo si nada va a funcionar: "no se puede rutear, ninguno queda asignado") y reparto por destino: nombre, barra ~120×4 px, cifra y % gris, incluida la fila "Sin asignar" en rojo. Al resolverse, frase verde y barras grises.
- Ref: 27 @alidalton.
- Regla: Antes de toda acción que cambia muchos registros, mostrá cuántos y a dónde van, con la fila "sin asignar" si existe.

**4.2 · Del conteo al ejemplo**
- Cómo: los chips de conteo ("Alta 58 · Media 97") son clickeables; abren un popover "Alta · 58 esta semana" con 2–3 casos reales (nombre tinta, empresa gris, cita, destino a la derecha) y un resumen al pie.
- Ref: 27 @alidalton.
- Regla: Todo conteo agregado se abre en ejemplos reales.

**4.3 · Resolver ambigüedad con tarjetas**
- Resuelve: dos clientes "Acme", CUIT repetido.
- Cómo: 2 tarjetas lado a lado de ~360×52, gap 16; la elegida en tinta con ✓ verde a la derecha, la otra en `texto-3` sin borde marcado. Si el pedido es ambiguo, pedir el dato que falta con el formato ("Probá 'Tarea para <empresa>: …'").
- Ref: 46, 18 @louisnstudio.
- Regla: Resolvé duplicados y ambigüedades eligiendo entre tarjetas, nunca con "¿Estás seguro?".

**4.4 · Toggle de activo en la fila**
- Cómo: primera columna con toggle (acento encendido, gris apagado) + pastilla tenue de estado al lado; "Última vez" relativa ("hace 5 min", "Ayer", "Nunca").
- Ref: 11 @Tanjim38 · 22 @zahragr8r.
- Regla: Todo lo que se prende o pausa (avisos, recurrentes, automatizaciones) lleva el toggle en su fila.

**4.5 · Proceso repetible como botón "Ejecutar" en la fila**
- Cómo: fila con pila de avatares, pasos, última corrida relativa y botón con borde de 28 px "Ejecutar" a la derecha.
- Ref: 23 @Tanjim38.
- Regla: Cobro mensual, IPC o reporte semanal se muestran como filas con su botón de ejecutar.

**4.6 · Recálculo en el lugar**
- Cómo: el botón pasa a "◌ Recalculando" gris sin borde; las cifras ruedan dígito por dígito (~400 ms), las barras vuelven a crecer desde la izquierda, las celdas se reemplazan en cascada de arriba hacia abajo con un círculo gris de 20 px para lo pendiente y 50 % para la que se está resolviendo.
- Ref: 53 @saurra3h.
- Regla: Al recalcular, nunca tapes la tabla con un spinner: actualizá en cascada.

---

## 5. Automatizaciones y lienzos de nodos

**5.1 · Editor en 3 zonas**
- Cómo: configuración a la izquierda (~210–220 px, grupos plegables con rótulo MAYÚSCULA 10 y ▲), lienzo de puntos al centro, paleta a la derecha (~190–200 px, filas de 32 px `suave` radio 8, cuadrito de color de 12–14 px por tipo de paso, ⠿ en los grupos). Barra flotante abajo al centro: segmentado Esquema|Detalle + zoom "− 100 % + ⤢". La fila de la lista y el lienzo son el mismo objeto.
- Ref: 11 @Tanjim38 · 22 @zahragr8r · 20 @zahragr8r (lista 290 · lienzo · config 330).
- Regla: Armá los editores de reglas o flujos en 3 zonas con la barra de zoom flotante abajo al centro.

**5.2 · Lienzo en columnas fijas**
- Resuelve: el caos del lienzo libre.
- Cómo: 3 columnas de ~225 px (Cuando/Programa/Si → Flujo/Instrucciones → Entonces/Apps/Corridas), conectores en ángulo recto de 1–1,5 px gris con flecha, "+" circular blanco de 18 px sobre el conector para insertar un paso ahí.
- Ref: 14, 15, 16 @louisnstudio · 20 @zahragr8r.
- Regla: Preferí columnas fijas con conectores ortogonales; insertá pasos desde el conector.

**5.3 · Nodo = bandeja con tarjeta**
- Cómo: cabecera en `suave` con chevron, título 13/500 y pastilla gris ("Pausado", "3 reglas"); tarjeta blanca con filas de ~32 px separadas por hairline, ícono 14 gris, texto 12–13; "+ Agregar condición / paso" en gris al final. Variante: etiqueta flotante arriba del nodo ("Cuando pasa esto" gris, "Hacé esto" azul 10 %, Sí verde, No rojo; 11 px, radio 6) y banda `suave` inferior "CRITERIO" con el dato real ("Coincidencias: 5"). Tipos con monograma de 2 letras en círculo de color de 16 px.
- Ref: 16 @louisnstudio · 11 @Tanjim38 · 22, 20 @zahragr8r.
- Regla: Subdividí nodos con banda `suave` y mostrá adentro el dato real que los alimenta.

**5.4 · Reglas que se leen como oración**
- Cómo: primera fila con ícono de filtro, las siguientes con pastilla "Y" gris de ~24–28 px en columna; condición en texto plano ("Días de atraso ≥ 7"). Cabecera "Si · 4 reglas". Variables como chips mono ("Hola {firmante}") o en gris dentro del paso; en bibliotecas, fichas mono con borde punteado.
- Ref: 15, 16 @louisnstudio · 55 @saurra3h.
- Regla: Escribí las condiciones como frases con el operador en pastilla y las variables en mono.

**5.5 · Programación en dos líneas**
- Cómo: "Todos los días 08:00 · revisa cada coincidencia" en tinta; debajo "cron 0 8 * * * · UTC" mono gris.
- Ref: 15 @louisnstudio.
- Regla: Todo dato técnico va en segunda línea mono gris, debajo de su versión en palabras.

**5.6 · Corrida que viaja por el diagrama**
- Cómo: nodo en curso con borde 1 px del acento + halo 4–8 px + spinner 12 arriba a la derecha; terminado con círculo verde 16 con ✓ blanco y borde verde tenue. Conector del tramo activo en acento punteado animado (marching ants). Pasos internos con spinner → ✓ en cascada, 300–500 ms por paso, fila activa teñida al 5 %. Rama no ejecutada al 35 %. Botón "◌ Corriendo…" con ancho fijo (Run → Stop). Al final, pastilla flotante abajo al centro: "✓ Corrió sobre 3 casos · 5 pasos hicieron algo".
- Ref: 14, 15, 16 @louisnstudio · 26 @saurra3h.
- Regla: Mostrá la ejecución sobre el dibujo del proceso, paso por paso; nunca una barra global.

**5.7 · Resultado como lista de efectos**
- Cómo: "17:00 · Ejecutar ahora · 1 caso" y debajo una línea por efecto en 11–12 gris ("Envió 2 avisos", "Facturó 3 contratos"); lo que falló en línea ámbar con ⚠ en tile de 20 px y la causa ("Falta conectar Webhooks"). Parcial = ⚠, no ✓. Los contadores del menú afectados cambian en vivo (Bandeja 30 → 31).
- Ref: 15, 16 @louisnstudio.
- Regla: Escribí el resultado en verbos y cifras; si fue parcial, decilo con ⚠ y la acción.

**5.8 · Registro de corridas**
- Cómo: tabla bajo el lienzo o pestaña "Corridas": ID mono (RUN-0099), origen, duración ("2,3 s", "—"), resultado, estado en pastilla con borde. Filas de ~48 px.
- Ref: 20, 21 @zahragr8r · 26 @saurra3h.
- Regla: Todo proceso automático deja su registro de las últimas N corridas.

**5.9 · Traza en cascada**
- Cómo: filas de 40 px con ícono y nombre; barras de 8 px redondas coloreadas por tipo en una línea de tiempo con 5 marcas, duración pegada a la barra; subpasos con sangría de 20 bajo chevron; panel con "Empieza en +0 ms · 8 % de la corrida" y segmentado Salida|Entrada con JSON mono.
- Ref: 26 @saurra3h.
- Regla: Para depurar procesos lentos, mostrá la traza tipo cascada con duraciones.

**5.10 · Advertencia propagada con acción**
- Cómo: un problema aparece en cada nivel con la misma forma: ⚠ ámbar 12 en la fila, pastilla "⚠ Conectar Webhooks" ámbar 15 % en la cabecera del bloque, conector entrante en naranja, "Lista de control 1 · Resolvé esto antes de activar" en el panel con fila y botón, y "Webhooks [Conectar]" en Apps. Nodo con error: borde y fondo rojo 8 % y la causa ("Necesita `lead.intent` · ningún paso lo carga").
- Ref: 15, 17 @louisnstudio · 27 @alidalton.
- Regla: Mostrá cada problema en todos los lugares donde se ve, siempre con su botón para resolverlo.

**5.11 · Estado del documento en la miga + botón que depende de él**
- Cómo: pastilla junto al título en las migas: "● 1 problema" (rojo tenue) → "● Listo" (gris) → "● Activo" (verde). El principal ("Activar") queda apagado mientras hay problemas y pasa a "✓ Activado" con fondo verde tenue; toast con la consecuencia ("Las nuevas solicitudes se clasifican al llegar").
- Ref: 27 @alidalton · 26 @saurra3h.
- Regla: El estado vive junto al título y el botón principal solo se apaga si la causa está escrita en pantalla.

**5.12 · Panel con lista de control**
- Cómo: panel derecho ~260–270 px sin borde de tarjeta: título + descripción 2 líneas, "Lista de control · Está todo listo" con tarjetas de pendiente y su botón ("Instrucciones … Escribir", "Listo para correr … Activar"), después "Detalles" rótulo 12 gris / valor tinta a ~90–95 px (Estado, Dueño, Empieza cuando, Pasos, Última corrida "Nunca", Corridas 0).
- Ref: 14, 16 @louisnstudio.
- Regla: Todo objeto configurable muestra arriba su lista de control con un botón por pendiente.

**5.13 · Creador que arranca con una frase**
- Cómo: estado vacío con ícono 36, título 16/500, 2 líneas grises; campo grande (~490×100) con un ejemplo cargado y "Tab para usar el ejemplo" 11 gris; "O empezá de una plantilla": 3 tarjetas (~155 px) con la cadena de íconos del flujo arriba del título y "Usar →"; "Empezar de cero →" con borde. Al enviar, el campo se vuelve la tarjeta de progreso con la frase entre comillas y checks de lo entendido que reemplazan puntos grises; las plantillas bajan al 30 % en 200 ms.
- Ref: 14, 08 @louisnstudio.
- Regla: Ofrecé tres caminos en este orden: frase con ejemplo, 3 plantillas, empezar de cero.

**5.14 · Plantilla como receta en chips**
- Cómo: tarjeta con ícono de color, título, descripción y "⚡ Se firma el contrato → Stripe → Avisar al equipo" en chips con flechas; "+ Usar" con borde de 28 px.
- Ref: 17, 43 @louisnstudio.
- Regla: Mostrá cada plantilla de automatización como su receta encadenada.

**5.15 · Tarjeta de proceso con miniatura y actividad**
- Cómo: miniatura de ~130 px con grilla de puntos y el flujo en píldoras con punto de color, chip de estado encima ("● Activo"); título 15/500 con logos de apps a la derecha; pie de 2 líneas 12 ("**608** corridas · 98,4 % ok" / "Soporte · editado hace 17 h") y mini barras de ~80×24 donde los días sin actividad son línea punteada. Ranura final punteada "+ Nuevo · En blanco o desde plantilla" del mismo tamaño.
- Ref: 26 @saurra3h · 20, 21 @zahragr8r (título 13/500, línea de configuración gris, pie "148 corridas · hace 2 min").
- Regla: Las tarjetas de procesos llevan 3 niveles fijos (título, configuración, métricas) y la colección cierra con una ranura punteada.

**5.16 · Arrastrar un paso desde la biblioteca**
- Cómo: cada ítem dice qué produce ("Clasificar intención · carga `lead.intent`") y muestra ⋮⋮ al pasar; fantasma con sombra; hueco de destino como conector punteado del acento entre dos nodos; el resto se corre ~120 px. Los nodos crecen y los de abajo se desplazan suave (~40 px por paso).
- Ref: 27 @alidalton · 17 @louisnstudio.
- Regla: En la paleta, cada pieza dice qué produce; al soltar, el flujo abre lugar sin saltar.

---

## 6. Agentes de IA y chat

**6.1 · Respuestas que devuelven objetos**
- Cómo: tarjeta de entidad dentro de la respuesta: avatar degradé 32, nombre 13/500, cargo y empresa gris, pastilla ("Decide") a la derecha, 4 datos en grilla 2×2 con ícono 14 (correo, ubicación, teléfono, "Último contacto hace 6 semanas"), abajo "Mensaje" (texto) y "Agregar al CRM" (relleno). Archivo como tarjeta con ícono de tipo en color, título 15, descripción 2 líneas, "Compartir" con borde + "Descargar" relleno.
- Ref: 18, 09, 46 @louisnstudio.
- Regla: Cuando el asistente o una búsqueda nombra una entidad del sistema, mostrala como tarjeta con 1–2 acciones.

**6.2 · Razonamiento plegable**
- Cómo: línea de tiempo vertical (puntos de 6 px unidos por línea fina; el activo violeta): "Trabajando ⌄" con el texto en caja `suave` radio 8, "🔍 Buscó registros de clientes", "Procesando ⌄"; al terminar se colapsa en "1 herramienta usada ›". La respuesta entra con desvanecido en la punta del texto que se escribe.
- Ref: 17, 18, 09 @louisnstudio.
- Regla: Mostrá qué hizo el agente en pasos plegables y colapsalos al terminar.

**6.3 · Lo que entendió, con checks**
- Cómo: "Suma 1 renglón ✓ · 10 % de descuento ✓ · Vence en 30 días ✓".
- Ref: 08, 14 @louisnstudio.
- Regla: Antes de ejecutar, el asistente lista lo que entendió con checks.

**6.4 · Burbujas y respuesta**
- Cómo: burbuja del usuario `superficie` radio 10, a la derecha, máx. ~70 % del ancho; la respuesta sin burbuja, texto plano a todo el ancho, 13 px con interlineado ~21. Debajo, copiar/me gusta/regenerar en gris 14 a la derecha con 12 de separación. Placeholder que cambia según la conversación ("Redactá un seguimiento con esto").
- Ref: 18 @louisnstudio.
- Regla: El usuario va en burbuja; la respuesta, como texto de documento.

**6.5 · Cuadro de escritura con grupos**
- Cómo: "+", "@", separador 1 px, "Habilidades" y pila de modelos a la izquierda; micrófono y enviar (cuadrado 40, radio 8) a la derecha. "+" abre hacia arriba un menú en 2 grupos ("Sugerencias:", "Buscar en el sistema:") de ~310 px con filas de 42, sin oscurecer el fondo. Selección de pantalla como chip de contexto azul 10 % ("✎ 2 seleccionados") arriba del mensaje.
- Ref: 46 @louisnstudio · 61 @jsngr · 12 @soluna_stensale ("Preguntá o @mencioná un registro…").
- Regla: El cuadro del chat permite adjuntar registros del sistema y muestra el contexto elegido como chips.

**6.6 · Aprobación humana como estado**
- Cómo: borrador del agente en tarjeta ("Nova redactó una respuesta · Para María Chen · Renovación") con "Enviar" relleno, "Editar" texto y "Esperando tu OK" gris a la derecha. Nota fija: "Los agentes preguntan antes de cambiar algo".
- Ref: 19, 17 @louisnstudio.
- Regla: Lo que el agente prepara y no ejecutó se muestra como "Esperando tu OK" con la acción a mano.

**6.7 · Qué agente o persona te necesita**
- Cómo: ítem del menú con texto en vez de número: "Tareas · 2 te necesitan" en ámbar (mono). Cada agente/persona en el menú con avatar 20–22 y a la derecha forma + palabra: ● Trabajando (amarillo), • Libre (gris), ◉ Te necesita (ámbar con anillo), ⚠ Bloqueado (rojo triángulo), ○ Desconectado (contorno). Rótulo de grupo "Agentes · 6 en línea". El mismo estado se repite idéntico en menú, fila y panel ("Bloqueado — falta remito").
- Ref: 23, 25, 51 @Tanjim38 · 49 @zahragr8r.
- Regla: El menú avisa qué necesita a la persona con verbo; el estado cambia de forma, no solo de color.

**6.8 · Panel de agentes por estado**
- Cómo: rótulos ACTIVOS / LIBRES / DESCONECTADOS 11–12; cada uno con nombre, una línea de qué hace ("Coordinando…") y rayita de 1–2 px de su color como avance; los inactivos al ~35–40 %; "Vuelve a las 18:00".
- Ref: 23, 49 @Tanjim38/@zahragr8r.
- Regla: "No disponible" siempre lleva hora de vuelta.

**6.9 · Hilos colgados del registro y panel Contexto**
- Cómo: tabla de hilos de 3 columnas (Hilo / Con / Actualizado) con el ID del registro; panel derecho con segmentado Agentes|Contexto y secciones de rótulo MAYÚSCULA 11 (TAREA, REPO, ADJUNTOS, MEMORIA) con filas de 36 px y un ícono por tipo, 24–32 px entre secciones, sin cajas.
- Ref: 24, 51 @Tanjim38.
- Regla: Todo hilo o comentario se cuelga de un registro y se ve en el panel de ese registro.

**6.10 · Estado "trabajando" donde va el resultado**
- Cómo: puntitos que giran + "Trabajando" gris en el lugar de la respuesta; después la respuesta con hora 13 gris.
- Ref: 62 @jsngr.
- Regla: Mostrá "trabajando/guardando" donde va a aparecer el resultado.

**6.11 · Pestañas de trabajo abiertas**
- Cómo: fila de pestañas tipo editor (~44 px) con ícono 14, punto de 6 px de "novedad o sin guardar", × en la activa; la nueva se agrega al final y actualiza la miga.
- Ref: 23, 49, 51 @Tanjim38/@zahragr8r.
- Regla: Si se trabaja con varias fichas a la vez (contrato, cliente, factura), dalas como pestañas con punto de novedad.

---

## 7. Dashboards y métricas

**7.1 · La forma del dibujo sale del tipo de dato**
- Cómo: anillo para %, barra contra referencia para consumo vs. capacidad ("vs 12.350"), segmentos para niveles discretos, degradé rojo→verde con rótulo para escalas de calidad, matriz de puntos para "23 de 25", sparkline para series, mapa de calor para actividad diaria. KPI compacto: ~76 px de alto, ícono en cuadro 40 a la izquierda, cifra 18/600 con unidad en superíndice gris 10 ("12.350 ^MW"), rótulo 13 gris, dibujo a la derecha.
- Ref: 33 @zahragr8r.
- Regla: Elegí el dibujo por el tipo de dato; nunca el mismo sparkline en todas las tarjetas.

**7.2 · Total con su composición (no torta)**
- Cómo: cifra 28/500 + subtítulo con cifra real ("En 4 monedas · nada retenido") + barra segmentada de ~4 px, gap 3, radio completo, con el color de cada parte + leyenda "● USD **25 %**" (% 600, nombre gris, gap 16; si no entra, salta de línea).
- Ref: 56, 57 @zahragr8r/@Tanjim38.
- Regla: Todo total que suma partes lleva debajo su barra segmentada; no uses torta para menos de 6 partes.

**7.3 · Color solo para lo que tiene nombre**
- Resuelve: el "árbol de Navidad" de 8 colores sin leyenda.
- Cómo: en barra apilada o dona, solo los ítems visibles en la leyenda llevan color de paleta; el resto, grises de luminosidad escalonada (#555, #777, #BBB). Leyenda colapsada a los 2–3 mayores; se expande con un círculo de 32–36 px con borde centrado sobre el borde inferior de la tarjeta (mitad adentro). Los colores vuelven en un fundido de 150–200 ms sin mover el layout. Segmentos con 2–4 px de separación y puntas redondas.
- Ref: 35 @raunofreiberg.
- Regla: El color de un gráfico se gana estando nombrado en la leyenda.

**7.4 · KPIs como selector del gráfico**
- Cómo: 3 KPIs en fila sin cajas (rótulo 14 gris, cifra 28/500, pie 13 gris con contexto); el elegido con fondo elevado radio 16; clic cambia la serie del gráfico.
- Ref: 34, 58 @zahragr8r/@Tanjim38.
- Regla: Si los KPIs de arriba tienen relación con el gráfico, hacelos sus pestañas.

**7.5 · Gráfico con mini-tabla y "Ver tabla"**
- Cómo: línea de 1,5 px con área al 8 %, 3 guías punteadas, sin ejes; rango de fechas 12 gris debajo; mini-tabla de 3–4 filas con hairline (Total del rango · Pico 3 · 2 sep · Días activos 81 de 365 · Promedio diario) con valor a la derecha `tabular-nums`; "Ver tabla" fantasma arriba a la derecha.
- Ref: 34, 58 @zahragr8r/@Tanjim38.
- Regla: Todo gráfico grande lleva su resumen en números y su alternativa en tabla.

**7.6 · Subtítulo con origen y período**
- Cómo: H2 18–24/400–500 + "De cobros confirmados de los últimos 12 meses" 12 gris; ~40–56 px entre secciones sin cajas ni líneas. Pastilla ámbar "Datos de prueba" cuando corresponde.
- Ref: 34, 58 @zahragr8r/@Tanjim38 · 56 @zahragr8r.
- Regla: Toda sección analítica dice de dónde salen los datos y de qué período.

**7.7 · Período elegido sólido, resto rayado, meta punteada**
- Cómo: barra del período en acento sólido con etiqueta flotante de valor encima; los demás rayados en diagonal gris; meta como línea punteada horizontal con rótulo a la derecha ("Meta: $ 180 mil"). Variante sobria: todas gris claro (#E5E5E5), hoy en tinta, hover gris medio con tooltip blanco chico (11 px, borde 1, radio 6).
- Ref: 28 @Tanjim38 · 61 @jsngr.
- Regla: Destacá solo el período elegido; la meta va punteada con su rótulo.

**7.8 · Avance contra meta en dos bloques**
- Cómo: "84,3 %" grande + "Faltan $ 47.100" gris; barra gruesa de 40 px partida: logrado en acento sólido + faltante rayado gris; "Meta de facturación" a la izquierda y "300.000" a la derecha abajo.
- Ref: 28 @Tanjim38.
- Regla: El avance a meta en tarjeta grande va en dos bloques con lo que falta escrito.

**7.9 · Embudo como columnas de caída**
- Cómo: columnas tenues cuya altura baja por etapa, pastilla roja "↓ 35 % de caída" arriba de cada una, cifra 20 y "% del total" debajo. "Editar etapas" con lápiz. Variante lista: filas con tile pastel 28 por etapa, nombre 15/500, meta 12 y cifra a la derecha.
- Ref: 30, 28 @Tanjim38.
- Regla: Dibujá el embudo mostrando la pérdida entre etapas, nunca con colores decorativos.

**7.10 · Comparar entidades en una sola tarjeta**
- Cómo: columnas separadas por líneas de 1 px; cada una con nombre 16 semibold, subtipo 14 gris, cifra 36–40/500, barra segmentada verde/ámbar/rojo de 6 px con proporciones reales y delta mono ("+7 vs. corrida anterior"). Pie mono "8 casos · 3 modelos · 0,84 s promedio". Segmentado "Todos 8 · Fallan 4 · Retrocesos 3".
- Ref: 53 @saurra3h.
- Regla: Para comparar 2–4 vendedores, empresas o meses, poné columnas dentro de una tarjeta con barra por estado y delta.

**7.11 · Anillo de puntos**
- Cómo: ~40 puntos de 8–10 px repartidos por proporción, total 24/500 al centro; leyenda en filas-tarjeta (radio 12, gap 6): punto, ícono 20, nombre, "38 %" 15/600 a la derecha y "$ 145,8 mil vendido · $ 40,9 mil comprado" 12 gris.
- Ref: 34, 58 @zahragr8r/@Tanjim38.
- Regla: Si necesitás una dona, preferí el anillo de puntos con la leyenda en filas.

**7.12 · Resumen de cabecera en una línea**
- Cómo: "**8** miembros · **1** invitación pendiente · **26** tareas abiertas": número 500 tinta, rótulo gris, debajo de un título de 40–56/400. Línea de estadísticas de colección: "**8** documentos **139,1 mil** tokens".
- Ref: 38, 48 @zahragr8r · 26 @saurra3h.
- Regla: Cuando la pantalla es una lista, resumila con números en línea en vez de tarjetas KPI.

**7.13 · Delta: arriba en bandeja, gris si es 0**
- Cómo: delta en pastilla arriba a la izquierda sobre la bandeja ("↑ +14,2 %" verde, "↓ −8,4 %" rojo, 12/500, ~24 alto, radio 8) con ⋯ a la derecha; la tarjeta interna lleva rótulo y cifra. 0,0 % va gris con "•".
- Ref: 30 @Tanjim38 · 56, 57 @zahragr8r/@Tanjim38.
- Regla: Un delta nulo no se colorea.

**7.14 · Cifra con equivalente debajo**
- Cómo: "0,156 BTC" con la unidad en `texto-3` un paso más chica y "≈ $ 9.860" en segunda línea gris; barra fina de 3 px del color de la entidad + "25 % del total" 11. Unidad en superíndice para cifras alineadas en columna.
- Ref: 56 @zahragr8r · 33 @zahragr8r.
- Regla: En bimoneda, mostrá "USD 1.200 / ≈ $ 1.380.000 al TC" con el equivalente siempre en segunda línea.

**7.15 · Tarjetas de detalle con anatomía fija**
- Cómo: 3 zonas separadas por hairline: título 16 (2 líneas) + subtítulo gris · 3 filas "○ rótulo ··· valor ^unidad" · 2–3 barras de 4 px con rótulo y valor arriba; pie "Ver detalle →" a todo el ancho con fondo del tono al 12 %. Gaps 12 entre KPIs, 16 entre tarjetas, padding 16. Mini-KPIs internos 2×2 en `bg` hundido.
- Ref: 33 @zahragr8r.
- Regla: En tableros densos, todas las tarjetas comparten anatomía; la que no encaja va a otra sección.

**7.16 · Mapa de calor de actividad**
- Cómo: cuadros de 12–22 px radio 4, semanas en columnas de 7 separadas ~24, activo en color, inactivo #333 (oscuro); al lado "día más activo", "racha más larga", "días sin actividad". La ausencia como dato: "3 días sin actividad este mes".
- Ref: 32 @zahragr8r.
- Regla: Mostrá la constancia de una persona o unidad con un mapa de calor y sus 3 cifras.

**7.17 · KPI en una línea, bajo**
- Cómo: rayita de color 1×10 px antes del rótulo, debajo "**425** Cerradas" (cifra 18/500 + contexto gris en la misma línea), tarjeta de ~64 px. KPIs unidos por divisores dentro de un contenedor: rótulo 13 con ícono, cifra 28/500, contexto 12 ("1 en riesgo" rojo).
- Ref: 28, 41 @Tanjim38.
- Regla: Cuando los KPIs no son protagonistas, bajalos a una línea y unilos con divisores.

**7.18 · Frescura del dato**
- Cómo: "● Sincronizado hace 12 min ⟳ · Exportar" a la derecha de las pestañas.
- Ref: 43 @louisnstudio.
- Regla: Toda vista que trae datos de otro sistema dice cuándo se sincronizó y deja recargar.

**7.19 · Pantalla de lectura sin relleno**
- Cómo: período en segmentado "7 d | 30 d | 90 d" + Exportar y Filtrar con borde; ningún botón relleno. Lista de consulta sin "+ Nuevo" inventado.
- Ref: 30 @Tanjim38 · 50 @Tanjim38.
- Regla: En analíticas y reportes no hay botón principal.

**7.20 · Meta diaria como anillo**
- Cómo: "◯ 0 de 20 hoy" en la barra superior, anillo chico.
- Ref: 60 @Tanjim38.
- Regla: Una meta del día (llamadas, visitas) va como anillo en la barra superior, no como KPI.

---

## 8. Calendarios, Gantt y líneas de tiempo

**8.1 · Evento: tinte + borde izquierdo**
- Cómo: fondo del tono al 8–15 %, borde izquierdo de 3 px del tono pleno, título 11–13/500–600 en el tono oscuro, hora 10–12 en gris del tono, empresa con logo de 12 en una tercera línea; bajo 30 min, solo el título. Ícono de la fuente (10 px) arriba a la derecha. Color = tipo o etapa; logo = cliente. En oscuro, tinte 15–20 % con el borde saturado.
- Ref: 36 @louisnstudio · 64 @jsngr.
- Regla: El color clasifica y el logo identifica; nunca uses los dos para lo mismo.

**8.2 · "Ahora" solo en hoy**
- Cómo: línea roja de 2 px con punto de 8 px al inicio, solo en la columna de hoy; número de hoy en círculo rojo relleno de 20 px y nombre del día en rojo. En Gantt, línea de 1 px del acento con el número en círculo.
- Ref: 36 @louisnstudio · 41 @Tanjim38.
- Regla: Dibujá la línea de ahora solo en la columna del día.

**8.3 · Grilla del calendario**
- Cómo: ~48 px por hora, línea sólida cada hora y punteada cada media; rótulos 9–10 gris; fin de semana con fondo gris al 3 %; horas no hábiles rayadas en diagonal muy suave.
- Ref: 36 @louisnstudio · 64 @jsngr.
- Regla: Distinguí fin de semana y horas no hábiles con fondo, nunca con bordes.

**8.4 · Crear en la celda**
- Cómo: al pasar por una celda vacía, "+" gris en la esquina y tinte tenue; clic crea con la hora ya cargada.
- Ref: 36 @louisnstudio.
- Regla: Toda celda vacía del calendario crea el evento ahí con un clic.

**8.5 · Mini mes y "Lo próximo"**
- Cómo: mini mes de 7 columnas con celdas de ~26, hoy en círculo tinta (blanco en oscuro), punto de 3 px bajo los días con eventos, otros meses al 40 %. "Lo próximo": tarjetas con barra izquierda de 3 px, título 12/500, "Hoy · 14:00" 11 gris, cliente con logo, 8 de separación.
- Ref: 36 @louisnstudio.
- Regla: Acompañá la semana con mini mes con puntos y la lista de lo próximo.

**8.6 · Mes: píldoras con hora mono**
- Cómo: evento en píldora de 20 px con tinte o borde del proyecto, hora mono adelante ("15:00 Reunión"), monograma a la derecha; lo hecho con ✓ verde, tachado y al 50 %; "+1 más" cuando no entra; leyenda de proyectos en la fila del mes.
- Ref: 41 @Tanjim38.
- Regla: En vista mes, la hora va en mono delante del título.

**8.7 · Gantt liviano**
- Cómo: tabla a la izquierda (~420 px) y lienzo de días a la derecha con la misma altura de fila (~52). Barra con fondo del estado al 25–30 % + borde 1 px del tono, avatar de 20 y nombre adentro; el avance como relleno más claro hasta el %; si la barra es corta, el nombre sale afuera en gris; subtareas "1/3" antes del avatar. Hitos como rombos en una fila fija arriba ("Hitos 10"); grupo "● Proyecto 18". Dependencias como curvas grises de 1 px. Encabezado en 2 niveles (mes 600 / días 13 gris). Barras lejanas al ~50 %. Solo Semanas | Meses.
- Ref: 37 @zahragr8r · 41 @Tanjim38.
- Regla: El avance va dentro de la barra y los hitos en una fila fija; dos zooms nada más.

**8.8 · Íconos de estado de tarea por forma**
- Cómo: ✓ verde relleno = hecha · medio círculo naranja = en curso · cuarto violeta = revisión · círculo vacío = por hacer · punteado = borrador o sin fecha. Las hechas en gris sin tachar.
- Ref: 37 @zahragr8r · 41 @Tanjim38.
- Regla: Distinguí los estados de tarea por forma del ícono, además del color.

**8.9 · Línea de tiempo de un documento**
- Cómo: puntos verdes de 8 px para lo hecho, círculo azul vacío para lo pendiente con fecha ("Esperando cobro · vence 26 nov"), conector de 1 px; al cobrar, "Cobrado completo".
- Ref: 08 @louisnstudio.
- Regla: Cerrá toda ficha de documento con su línea de tiempo y el próximo paso con fecha.

**8.10 · Zoom semántico**
- Cómo: al alejar un lienzo o mapa, el detalle se desvanece y quedan los agrupadores con conteo ("Ingeniero White · 12 equipos").
- Ref: 60 @Tanjim38.
- Regla: En vistas con zoom, a menos zoom mostrá solo grupos y conteos.

---

## 9. Carga del equipo

**9.1 · Tarjeta de persona con carga visible**
- Cómo: ~270 px, padding 16, gap 12, hairlines entre bloques. Pastilla de modalidad arriba a la izquierda (fondo 12 %, 11 px), lápiz 14 gris arriba a la derecha. Barra de 12 bloques de ~14×8 con 2 de separación en el color de la persona hasta las abiertas + "6 abiertas"; debajo "0 hechas esta semana · **1 vencida**" (rojo solo en el número). Trío de cifras en cajita con bordes internos (rótulo 11 gris / número 16; solo el vencido en rojo). "Lo próximo" con filas de 32 (círculo vacío, título truncado, fecha a la derecha; "Vencida" en rojo). Clave/valor alineados (Correo, Trabaja con + mini avatares). Vacío escrito ("Nada asignado ahora") sin achicar la tarjeta. Pie "+ Asignar tarea" con borde a todo el ancho.
- Ref: 38 @zahragr8r.
- Regla: Toda tarjeta de responsable muestra abiertas, vencidas y hechas en 7 días; solo el número vencido va en rojo.

**9.2 · Filtro en dos niveles**
- Cómo: selector de vista con ícono (Por área / Resumen del equipo / Todas las tareas) y debajo chips rectangulares de área de ~28 px, radio 6, activo con fondo gris.
- Ref: 38 @zahragr8r.
- Regla: Separá "cómo lo miro" (vista) de "qué parte miro" (chips).

**9.3 · Estado de la persona en el menú** → ver 6.7.

---

## 10. Crear tarea rápida

**10.1 · Alta en modal con contexto** → ver 3.5 (contexto precargado, "Crear otra", selects con punto de color).

**10.2 · Alta en la columna**
- Cómo: "+" en la cabecera de cada columna kanban o grupo crea directo en esa etapa; "+ Agregar …" gris (o con borde punteado) al final de cada columna o grupo.
- Ref: 10 @zahragr8r · 12 @soluna_stensale · 41 @Tanjim38.
- Regla: Creá desde el lugar donde va a vivir el registro, con la etapa ya puesta.

**10.3 · Lista de tareas en bloque**
- Cómo: bloque con borde 1 px radio 10, renglones de ~34 separados por línea fina (no una tarjeta por fila), × gris al pasar; campo de ~32 px con la tecla en el placeholder y foco con borde gris oscuro 1,5 px; al tildar, la tarea baja al fondo tachada en `texto-3` con ✓ verde de 16 y el contador ("1 pendiente" / "3 pendientes") cambia al instante; "Borrar terminadas" como enlace gris 10 abajo a la derecha.
- Ref: 62 @jsngr.
- Regla: Lo terminado baja al fondo y el contador se actualiza en el mismo instante, con singular y plural bien escritos.

**10.4 · Tarjeta de tarea en kanban**
- Cómo: columnas de ~250–300 px, gap 16, 8–10 entre tarjetas. Tarjeta: etiquetas como pastillas con punto (11), título 14/500, "≡ 1/3" con barra de 2 px, pie mono 11 "WEB-112 · ▮▮▮ prioridad · 📅 Hoy · 💬 2 · avatar 18". Fecha ámbar si es hoy o mañana, roja si venció. Lo vacío escrito ("Sin asignar", "Sin fecha") en `texto-3`. Tarjeta de negocio: título 500, empresa con logo y dueño con avatar en una línea, monto tinta 600, "cierra 20 feb" (rojo si pasó), máx. ~120 px de alto, sin repetir rótulos.
- Ref: 41 @Tanjim38 · 12 @soluna_stensale · 10 @zahragr8r (lo que no copiar: 340 px de rótulos repetidos).
- Regla: La tarjeta de kanban no repite rótulos y no pasa de 120 px.

**10.5 · Columna kanban con conteo y total**
- Cómo: cabecera con ícono/punto de etapa fijo, nombre 14 semibold, conteo en pastilla gris de 18, `+ ⋯` al pasar; total fijo al pie ("◇ $ 114.000"). Columna `#F5F5F5` radio 16 de alto completo aunque esté vacía. Etapa con ícono y color fijos, repetidos igual en la pastilla de la tabla.
- Ref: 12 @soluna_stensale · 13 @orevbajohn_ · 10 @zahragr8r · 55 @saurra3h.
- Regla: Cada columna muestra conteo arriba y suma al pie; cada etapa tiene un solo par ícono+color en todo el sistema.

**10.6 · Arrastre en kanban**
- Cómo: original al 30–40 % en su lugar; la arrastrada con sombra flotante y rotación de 1–2°; columna destino con acento al 8 % y borde punteado de 1 px; hueco del tamaño de la tarjeta donde cae (o línea de 2 px). Al soltar, conteos y totales cambian en el lugar y toast "Se movió 'Escribir copy' a En curso" con Deshacer. Filas de grilla: hueco de ~40 px, 150–200 ms ease-out.
- Ref: 13 @orevbajohn_ · 41 @Tanjim38 · 09 @louisnstudio.
- Regla: Marcá origen, destino y hueco; al soltar, actualizá los totales y ofrecé Deshacer.

---

## 11. ⌘K y menús con teclado

**11.1 · Paleta ⌘K con pestañas por tipo**
- Cómo: ~520 px, a ~90 px del borde superior; campo 15 px "Buscá cualquier cosa o escribí un comando" con kbd ENTER a la derecha; chips de tipo con ícono (Clientes, Contratos, Documentos, Mensajes, Apps), activo en píldora sólida invertida. Resultados de 2 líneas: tile 28–32 radio 8 con el color de la entidad, título 13 ("FAC-00006 · $ 420"), segunda línea 11 gris "Tipo • ● Estado • Empresa • vence 1 jul"; número de atajo 1–9 a la derecha. Fila activa con fondo 6 % y acciones propias ("Elegir", 🔗). Pie: `↑↓ Navegar · ENTER Abrir · TAB Acciones · ESC Cerrar` (kbd 10 gris) + conteo ("4 agentes · 6 flujos"). "Recientes:" sin búsqueda. Fondo desenfocado ~20 px y oscurecido. Último resultado con fundido.
- Ref: 43 @louisnstudio · 26 @saurra3h.
- Regla: ⌘K busca en todas las entidades, filtra por tipo con chips y enseña sus teclas en el pie.

**11.2 · Menú desplegable con columnas fijas**
- Cómo: disparador pastilla (~115×40, fondo 4 %, borde 1) con chevron que rota 180° en 150 ms. Menú a 8 px debajo, alineado al borde izquierdo, ~230 px, radio 10–12, borde 1, sombra difusa. Ítems de 32–34: [ícono 16 / ✓ / ●] a 12 del borde · texto 14/400 · atajo gris 40 % o › a la derecha. Rótulos de grupo 12–13 gris alineados al texto; grupos separados por línea de 1 px a todo el ancho con 4 px de aire. Deshabilitado al 40 % en su lugar. Destructivo último, separado, texto e ícono en rojo, sin fondo.
- Ref: 52 @saurra3h · 46 @louisnstudio.
- Regla: Todo menú usa columnas fijas y las casillas u opciones únicas van en la columna del ícono.

**11.3 · Resaltado que viaja**
- Cómo: pastilla gris (#EBEBEB claro, #262626 oscuro) a 4–6 px del borde, radio 6–8, que se desliza entre filas con mouse y flechas.
- Ref: 52 @saurra3h · 46 @louisnstudio.
- Regla: El resaltado del menú se mueve como indicador, no se prende y apaga.

**11.4 · Submenú con tolerancia**
- Cómo: se abre a 8–10 px a la derecha, alineado arriba con su fila (que queda resaltada); no se cierra mientras el cursor cruza en diagonal.
- Ref: 52 @saurra3h.
- Regla: Dale zona de tolerancia diagonal a todo submenú.

**11.5 · Atajos a la vista**
- Cómo: "⌘ Y" en 2 teclitas de 16 px con borde en el ítem del menú, "⌘K" / "Ctrl K" mono en el buscador, "⌘F" en el buscador de la página.
- Ref: 46 @louisnstudio · 51 @Tanjim38 · 42 @Tanjim38.
- Regla: Mostrá el atajo donde está la acción.

**11.6 · Menú contextual que pausa el resto**
- Cómo: ~170 px, radio 8, sombra media, ítems de 30 con ícono 14; el resto de la app baja al 15 % de oscuridad mientras está abierto. Excepción: el menú del "+" del chat flota sin oscurecer.
- Ref: 42 @Tanjim38 · 46 @louisnstudio.
- Regla: Atenuá el fondo con menús contextuales que bloquean; no con los que acompañan la escritura.

---

## 12. Archivos y documentos

**12.1 · Carpetas arriba, archivos abajo**
- Cómo: secciones en bandeja "Carpetas (7)" / "Archivos (16)" con `+` circular de 24. Tarjeta de archivo ~230×100 en 2 pisos: ícono de tipo gris con la etiqueta PDF/DOC/XLS dentro, nombre 13/500, tamaño 11 gris, ⋮ / abajo, en un tono más claro, avatar 18, autor 12 y fecha gris. Gap 16. Ícono de tipo en color de dato (rojo PDF, verde XLSX, azul DOCX, naranja PPTX) cuando es tabla.
- Ref: 42 @Tanjim38 · 06 @louisnstudio.
- Regla: El tipo va dentro del ícono, nunca como columna aparte.

**12.2 · Espacios como tarjetas de contenedor**
- Cómo: ~335×210, gap 16: ícono en cuadro 28 con borde, "4 docs" 11 gris a la derecha, título 18/500, descripción 2 líneas, hairline, pila de avatares 16 + "Actualizado hace 2 d", banda `suave` abajo con "Abrir" (pastilla blanca) y "Conectar fuente" (link gris). Accesos como carpetas dibujadas (~85×65) con conteo en círculo de 18, también el 0.
- Ref: 48 @zahragr8r.
- Regla: Con 8 contenedores o menos, la página abre en tarjetas de contenedor; la lista plana va adentro.

**12.3 · Vista previa en panel fijo**
- Cómo: 320–360 px: barra de 6 íconos de acción con el tacho al final; tarjeta con miga 11, título 20/400 y descripción; pares rótulo/valor justificados (filas de 28); 3 métricas con `divide-x` (rótulo 11, valor 18); "Más en X 4" con filas de 56 (ícono 32, título 13/500, meta 11, avatar 18; elegida en `suave` con borde); "Cambios recientes" en una línea; pie 50/50 "Abrir editor" relleno + "Copiar link" con borde (el relleno del panel no compite con el de la página).
- Ref: 48 @zahragr8r.
- Regla: Clic en un archivo o documento abre su vista previa al costado, sin cambiar de página.

**12.4 · Compartir**
- Cómo: modal de ~530: ficha del archivo (nombre 18, autor, fecha); bandeja "Link" con campo de solo lectura + "Copiar link" con borde; bandeja "Invitar" con campo + "Enviar invitación" relleno; miembros con avatar, nombre, cargo y radio; "Listo" a todo el ancho. Velo blanco + blur 4.
- Ref: 42 @Tanjim38.
- Regla: El link copiable va primero; la invitación, después.

**12.5 · Versiones y cambios**
- Cómo: fila "Versión 4 · Actualizado 3 nov 2026 · Vigente desde 1 dic 2026" (rótulo gris, valor tinta); tarjeta con toggle "Ver cambios desde la versión 3 · 8 cambios"; secciones numeradas en mono ("04 Cuánto lo guardamos") con caja "En corto" (ícono, borde 1, radio 12) de una línea; índice fijo con barra de 2 px en la sección actual.
- Ref: 55 @saurra3h.
- Regla: Todo documento con versiones (contrato, tarifario, condiciones) muestra su versión vigente y deja ver los cambios contra la anterior.

**12.6 · Crear documento desde plantilla**
- Cómo: 2–4 plantillas de ~190 px con miniatura esquemática (rayas grises que imitan el documento), título 500, descripción 3 líneas gris, "Usar plantilla →" + "Empezar de cero".
- Ref: 08 @louisnstudio.
- Regla: Ningún documento empieza en un formulario en blanco.

---

## 13. Ajustes, invitación y acceso

**13.1 · Ajustes con navegación interna**
- Cómo: columna de ~220 px con grupos MAYÚSCULA (GENERAL, ESPACIO, AVISOS, PERSONAL, SEGURIDAD, FACTURACIÓN) o pestañas de texto con subrayado de 1–2 px tinta y línea de 1 px bajo la fila; título 40/400 con miga 16 gris arriba. Apariencia: tema con 3 miniaturas (Claro / Oscuro / Sistema), acento en 6 círculos, densidad Cómoda | Compacta, movimiento "Seguir al sistema".
- Ref: 41 @Tanjim38 · 47 @zahragr8r (no copiar: buscador, orden y vistas en Ajustes).
- Regla: Ajustes > Apariencia ofrece tema, acento y densidad; nunca pongas controles de lista en Ajustes.

**13.2 · Asistente en modal partido**
- Cómo: ~830×530; izquierda, ilustración viva sobre fondo con degradé radial tenue del color de la entidad; derecha, formulario de ~330 útil. Arriba a la derecha: ‹, barra segmentada (3–5 segmentos de 50–85×3 px con 4 de separación, hechos en blanco/tinta, resto al 20 %), "1/3" mono, ×. Botón único fijo abajo a todo el ancho (30–44 px) con el verbo del paso ("Continuar" → "Conectar Google Meet"); en espera pasa a gris con spinner "Esperando aprobación…" con ancho fijo.
- Ref: 09, 17, 19, 45 @louisnstudio.
- Regla: Configuraciones de más de 2 decisiones van en asistente de N pasos y el último botón dice el verbo final.

**13.3 · Ilustración que responde al formulario**
- Cómo: apagar un permiso apaga su nodo al 30–40 %; tildar un agente lo enciende (40 → 100 %), le suma ✓ verde de 14 y dibuja una línea punteada de su color al centro; contador "4 de 5 agentes" en vivo; barras con número que se animan 300 ms (Velocidad 95 / Profundidad 35); borrador de ejemplo que se reescribe al cambiar el tono.
- Ref: 17, 19, 45 @louisnstudio.
- Regla: Cuando una opción tiene consecuencias que no se ven (rol, tono de un correo automático, frecuencia), mostralas en vivo al lado.

**13.4 · Permisos con explicación y garantía**
- Cómo: segmentado "Solo lectura | Leer y actuar" que prende o apaga todos; filas con tile 28 tintado, título 13, descripción 11 gris ("Facturas, saldos y pagos") y toggle 24×14. Nota: "Los agentes preguntan antes de cambiar algo". Importar: casilla con 2 líneas de consecuencia ("Lo existente aparece ya; lo nuevo cada pocos minutos") y línea con candado ("Nunca vemos tu contraseña").
- Ref: 17, 19, 45 @louisnstudio.
- Regla: Describí cada permiso por los datos que incluye, nunca por nombre de tabla, y poné su consecuencia al lado.

**13.5 · Guía de configuración en la ficha**
- Cómo: pasos numerados en columna de 24 (hecho: círculo verde con ✓; pendiente: número gris), título 13, explicación 1–2 líneas gris, botón chico con borde debajo; el resultado escrito al completarse ("Agustín, Juan y Manuel la pueden usar"). Subtítulo: "Conectada. Cinco pasos, unos dos minutos". Toast: "Stripe conectada · 4 agentes la usan".
- Ref: 17, 09 @louisnstudio.
- Regla: Toda integración o módulo nuevo trae su guía de pasos con estado y un botón por paso.

**13.6 · Lista de conexiones**
- Cómo: cabecera "Conectores" + "4 servidores · 11 herramientas" 12 gris + "+ Agregar" con borde; filas de ~60: logo 18, nombre 14 semibold, "● Conectado · Remoto · 3/4 herramientas"; toggle del acento; apagada, la fila entera al 50 %; si pide intervención, el toggle se vuelve "Reconectar ↻" con punto ámbar. Pie mono "8 activas · 3 preguntan antes". Alta en el modal con pasos "✓ Alcanzando servidor / ◌ Iniciando sesión / • Listando" y el nuevo aparece primero en la lista.
- Ref: 55 @saurra3h.
- Regla: Una conexión que necesita intervención cambia su toggle por el botón que la arregla.

**13.7 · Vacío que vende la conexión**
- Cómo: 3 íconos de apps en arco con brillo tenue, título 17/500, 2 líneas; tarjeta con filas de 50 (logo 24, nombre, qué hace, "Conectar" con borde chico); nota "Alcanza con una. Las otras las conectás cuando quieras".
- Ref: 45 @louisnstudio.
- Regla: El vacío de una sección que depende de una integración lista las opciones con su botón de conectar.

**13.8 · Invitar en modal**
- Cómo: modal "Invitar a alguien" con el mismo desenfoque que ⌘K; avatares que suman en la ilustración ("2 invitados → 4").
- Ref: 26 @saurra3h · 09 @louisnstudio.
- Regla: Invitar se hace en un modal desde donde estás, con el fondo desenfocado.

**13.9 · Ingreso que muestra qué conecta**
- Cómo: formulario de 272 px a la izquierda (título 15/500, descripción 12, campo 32, primario blanco en oscuro, "Probar la demo" con borde); a la derecha, logo al centro con 6 apps (44 px, radio 12) y puntos de 8 px que viajan por líneas punteadas al 15 % (~1,2 s por tramo, ease-in-out); chips de evento con cifra ("● Pago recibido · US$ 4.200", 26 px, fondo negro 70 %); halo que late al llegar cada punto; paginador de 4 tramos que se llena como progreso.
- Ref: 44 @louisnstudio.
- Regla: La pantalla de ingreso muestra qué hace el sistema con datos del negocio, no una foto genérica.

**13.10 · Sugerencias descartables**
- Cómo: chips de 32–36 px, radio completo, borde 1, × a la derecha ("Instalar extensión ×").
- Ref: 31 @zahragr8r.
- Regla: Las sugerencias de configuración van como chips con ×, nunca como banner a todo el ancho.

**13.11 · Onboarding en el pie del menú**
- Cómo: usuario + "Verificar cuenta · 3 de 4" con barra de 4 segmentos verdes.
- Ref: 34, 56 @zahragr8r.
- Regla: El avance de la puesta en marcha vive en el pie del menú, sin interrumpir.

---

## 14. Facturación y uso

**14.1 · Uso contra límite**
- Cómo: "18.420 / 25.000" con el denominador en gris un paso más chico, % a la derecha del rótulo, barra de 4 px; participación en barra apilada con 4 px de separación y leyenda punto + nombre + % en 2 columnas. En el pie del menú: anillo chico "891/1000 consultas" + explicación gris + "Ampliar" negro a todo el ancho.
- Ref: 26 @saurra3h · 20, 21 @zahragr8r · 29 @Tanjim38.
- Regla: El uso va con denominador gris, barra fina y la acción para ampliar al lado.

**14.2 · Resumen fijo de lo que se lleva**
- Cómo: columna derecha fija "Resumen hasta ahora": filas rótulo + subtítulo gris / monto a la derecha, divisoria, "Total" a 32/500, nota de qué falta sumar ("El flete y los extras se suman después"), un solo botón a todo el ancho para el paso siguiente, secundaria de texto y "Volver" subrayado; aviso aparte con ⚠ ámbar si hay urgencia real ("Quedan 5 a este precio").
- Ref: 59 @Tanjim38.
- Regla: Todo alta en varios pasos con plata (cotización, contrato) lleva su resumen fijo a la derecha.

**14.3 · Lo ya elegido en una banda**
- Cómo: banda de una línea arriba con lo elegido en pasos previos y "Cambiar" a la derecha (radio 24, fondo elevado).
- Ref: 59 @Tanjim38.
- Regla: Nunca obligues a volver atrás para ver o cambiar lo elegido.

**14.4 · Comparar planes o tarifas**
- Cómo: 3 tarjetas-radio con nombre, 3 líneas gris, precio 18/500 y diferencia ("+ $ 84 por persona"); tabla comparativa con la columna elegida resaltada entera con el acento al ~20–25 %; "—" gris para lo que no incluye, ✓ para lo que sí.
- Ref: 59 @Tanjim38.
- Regla: Resaltá la columna elegida entera; lo no incluido va como "—" gris, no como ✗ rojo.

**14.5 · Plan en el menú**
- Cómo: cuadro con ilustración de línea, "Tu plan / Gratis" 24 px, una línea y "Pasar a Pro →" con ×.
- Ref: 48 @zahragr8r.
- Regla: El plan vive en el pie del menú y se puede cerrar.

---

## 15. Detalles de movimiento

**15.1 · Entrada en cascada, solo la primera vez**
- Cómo: marco → menú (ítems escalonados) → panel → filas o tarjetas a 40–80 ms de diferencia, `ease-out` 200–300 ms, opacidad (y escala 0,96 → 1 en el marco), máximo 8 piezas animadas y el resto directo, total < 600 ms. Variante: desenfoque → nítido escalonado de izquierda a derecha. Nunca al volver a una vista ya visitada.
- Ref: 11 @Tanjim38 · 22 @zahragr8r · 28, 29, 42 @Tanjim38.
- Regla: Animá la entrada solo en la primera visita y cortá a las 8 piezas.

**15.2 · El marco no se mueve**
- Cómo: entre pantallas del mismo módulo cambian solo el cuerpo, la miga y la pestaña activa; de lista a editor, el cuerpo pasa por un esqueleto con la forma final; al volver, fundido cruzado con escala 0,97 → 1 en ~200 ms y el activo del menú se desliza.
- Ref: 22 @zahragr8r · 49, 50 @Tanjim38.
- Regla: Menú, cabecera y filtros quedan quietos al navegar dentro de un módulo.

**15.3 · Cifras que ruedan al cambiar**
- Cómo: cada dígito sube o baja por separado tipo odómetro, ~400 ms, al recalcular o actualizar (no solo al cargar).
- Ref: 26, 53, 55 @saurra3h · 28 @Tanjim38.
- Regla: Cuando un número cambia, rodalo por dígito; no cortes en seco.

**15.4 · Entrar desde desenfoque**
- Cómo: blur 6–8 px → 0 y opacidad 0,5 → 1 en ~300 ms con desplazamiento vertical leve; para líneas nuevas de un registro, valores que pasan de barra esqueleto (~70×6 px) a dato, contenido que cambia dentro de un modal (que ajusta su alto animado).
- Ref: 54, 53 @saurra3h · 59 @Tanjim38.
- Regla: Usá el blur-in para lo que llega en vivo, no para lo que ya estaba.

**15.5 · Reordenar sin parpadeo** → ver 2.10 y 1.6.

**15.6 · Proceso en cascada** → ver 5.6 (spinner → ✓, 300–500 ms por paso, marching ants solo en el tramo activo).

**15.7 · Esqueleto = la propia interfaz en fantasma**
- Cómo: menú, barra y filtros dibujados al 20–30 % mientras carga; el indicador va en el lugar del contenido. Al cambiar de vista o filtro, se mantiene lo anterior hasta que llega lo nuevo o se muestra esqueleto con forma de filas; nunca el panel en blanco (error visto en 65). Espera con contexto: dibujo que se traza + "Preparando… · Boeing 777, 342 asientos".
- Ref: 60, 59 @Tanjim38 · 65 @jsngr.
- Regla: Nunca dejes un panel en blanco entre dos estados.

**15.8 · Microinteracciones de estado**
- Cómo: chevron que rota 180° en 150 ms; ⊕ que pasa a ✓ verde en la fila y en la barra de abajo a la vez; botón de campana que queda relleno con el panel abierto; ícono de ecualizador animado en la fila activa; texto que se escribe con desvanecido en la punta; nodos que se corren suave cuando otro crece.
- Ref: 52 @saurra3h · 65 @jsngr · 29 @Tanjim38 · 17 @louisnstudio.
- Regla: Cada movimiento confirma un estado; si no confirma nada, sacalo.

**15.9 · Bucles de fondo solo donde no se trabaja**
- Cómo: líneas y grillas animadas con opacidad ≤ 0,3, solo en ingreso, vacíos y bienvenida; carruseles con paginador que se llena y pausa al pasar el mouse.
- Ref: 44 @louisnstudio.
- Regla: Nada se mueve en bucle detrás de una tabla.

**No copiar:** giros 3D, perspectiva y zoom de cámara (28, 33, 59): son técnica de video, no de producto.

---

## 16. Oscuro

**16.1 · El principal se invierte a blanco**
- Cómo: pastilla blanca rellena con texto tinta, radio 8, 36–40 px; máximo una por sección. Facetas y segmentados activos también invertidos. El acento de marca queda para selección, foco y datos (o para el puntero activo de una barra de herramientas, como el naranja de 16).
- Ref: 02, 14, 36, 43, 45, 46 @louisnstudio · 25, 49 @Tanjim38/@zahragr8r · 56 @zahragr8r.
- Regla: En oscuro, el botón principal es blanco salvo que el sistema tenga acento de marca definido para eso.

**16.2 · Capas por luminosidad, sin sombras**
- Cómo: lienzo #0A0A0A–#0E0E0F → panel #111113–#141414 → tarjeta #161618–#202020, bordes #232326–#26262A (o blanco al 6–8 %); hover un escalón arriba; `bg` hundido (más oscuro que la tarjeta) para mini-KPIs internos. Texto principal blanco 90 %, rótulos 40–45 %. Grilla de puntos de lienzo al 6 %.
- Ref: 14, 16 @louisnstudio · 23, 51, 57 @Tanjim38 · 33 @zahragr8r.
- Regla: Separá planos por luminosidad y borde; ninguna sombra.

**16.3 · Estado como ícono + palabra, sin pastilla**
- Cómo: ícono 14 + palabra en el color del estado; lo hecho en gris con ✓ verde chico; etiquetas con borde 35 % y texto 85 %; correos como único azul (#6B9BFF) sin subrayado.
- Ref: 25 @Tanjim38 · 03 @louisnstudio.
- Regla: En oscuro, sacá el fondo de las pastillas de estado y dejá ícono + palabra.

**16.4 · Misma estructura, otros tokens**
- Cómo: la pantalla en claro y en oscuro es idéntica píxel a píxel salvo color; el cambio de tema se hace desde el riel (☾/☀) o Ajustes.
- Ref: 46 @louisnstudio · 52, 54 @saurra3h · 41 @Tanjim38.
- Regla: El oscuro se resuelve solo con tokens; si hace falta otro layout, el claro está mal armado.

**16.5 · Rótulos de grupo en minúscula**
- Cómo: en menú oscuro o de marca, rótulos de grupo a 13–15/500 en minúscula inicial y más fuertes que los ítems; la MAYÚSCULA 11 queda para menús claros densos.
- Ref: 57 @Tanjim38.
- Regla: En menús oscuros, el rótulo de grupo se lee como título.

---

## 17. Navegación y marco (complementa la sección 1 de SKILL.md)

**17.1 · Barra que se colapsa a riel**
- Cómo: riel de 44–56 px (nunca a cero), íconos 16, activo resaltado, favoritos como puntos de color de 10 px, tooltip con el nombre; grupos separados por huecos de ~24 px o hairlines cortas, sin rótulos. Botón de colapsar siempre en la misma zona; atajo ⌘\ o `[`. Arrastrable con guía del acento y umbral de ~200 px. El ancho ganado va a la columna principal de la tabla.
- Ref: 05, 07, 45 @louisnstudio · 31 @zahragr8r.
- Regla: Colapsá la barra a íconos, guardá el estado por usuario y dale el ancho ganado a los datos.

**17.2 · Entidades en el menú con sus vistas**
- Cómo: cada proyecto con cuadrado de color 18–20 px, ☆ y punto de estado a la derecha (azul en curso, rojo en riesgo, amarillo en pausa); al pasar, `⋯ ›` en vez del punto; el activo despliega sus vistas con sangría de ~20. Grupos plegables con chevron, `+` y ⋮⋮. Recientes con ☆ para fijar.
- Ref: 41 @Tanjim38 · 47 @zahragr8r · 29 @Tanjim38.
- Regla: Las entidades en curso viven en el menú con su color y su estado.

**17.3 · Ítems "Pronto"**
- Cómo: ícono y texto al 40 % + pastilla "Pronto" de 9–11 px con borde.
- Ref: 05, 46 @louisnstudio.
- Regla: Lo que todavía no está se muestra apagado con el porqué, no se esconde.

**17.4 · Selector de contexto en la barra superior**
- Cómo: pastilla oscura con ícono, nombre y el identificador gris truncado al medio ("0xf303…dbd0" → "CUIT 30-71…-4"); o tarjeta arriba del menú (logo, nombre 13, correo 11, ⇅).
- Ref: 57 @Tanjim38 · 30, 42 @Tanjim38.
- Regla: La empresa o cuenta activa se ve siempre arriba, con su identificador.

**17.5 · Navegación superior para pocas secciones**
- Cómo: pastillas separadas de 40–52 px, radio completo, la activa invertida; buscador como otra pastilla; íconos en círculos.
- Ref: 32 @zahragr8r.
- Regla: Con 5 secciones o menos, podés reemplazar la barra lateral por pastillas arriba.

**17.6 · Avisos en hoja con tipos**
- Cómo: hoja de ~570 px; "Avisos" + "Marcar todo leído" + ×; segmentado con conteo (Todos 9 · Error 2 · Éxito 3 · Info 3) o Todos | No leídos. Cada aviso: tile 28 blanco con borde y el punto o ícono de estado, "**Actor** verbo **objeto**" (actor y objeto 500, verbo gris), contexto, línea mono "Proyecto · hace 22 min", punto de no leído y ✓ al pasar; menciones con fondo del acento al 15 %. Agrupados por HOY.
- Ref: 29 @Tanjim38 · 41 @Tanjim38.
- Regla: Cada aviso dice quién hizo qué sobre qué; revisá que cada filtro muestre solo lo suyo y que los textos estén bien escritos.

**17.7 · Historial que dice qué pasó**
- Cómo: agrupado AYER / ESTA SEMANA, cada ítem con ícono 14 y 2 líneas con cifra ("14 conversaciones resueltas", "8 % más esta semana").
- Ref: 31 @zahragr8r.
- Regla: La actividad de la barra cuenta hechos con cifras, no títulos genéricos.

**17.8 · Saludo en la barra, no como hero**
- Cómo: "Buenas tardes, Ana" a 18/500 en la barra superior; ahorra ~80 px.
- Ref: 56 @zahragr8r.
- Regla: En pantallas de trabajo, el saludo va chico en la barra.

---

## 18. Estilos de contraste que NO conviene copiar a un sistema de gestión

| Estilo | Dónde | Por qué no |
|---|---|---|
| Fondo de presentación degradé (violeta→celeste→rosa) detrás de la app | 13 | Es para la toma del video; en el producto compite con los estados. |
| Giro 3D, perspectiva, zoom de cámara | 28, 33, 59 | Técnica de video. En uso diario marea y retrasa. |
| Lienzo infinito editorial con objetos en órbita, serif display, polaroids inclinadas, flotación lenta | 60 | Densidad de póster: entra un dato donde un ERP necesita veinte. El movimiento permanente distrae de trabajar. |
| Gamificación (rachas, recompensas, "Reclamar") con acento lima | 32 | Infantiliza el trabajo de cobranza o ventas. Rescatar solo el mapa de calor y la meta con "faltan X". |
| Esquineros en L y marcas de corte en vez de bordes, títulos en condensada | 20, 21 | Aire técnico de plano; suma una tercera voz tipográfica y un recurso decorativo que no comunica estado. Solo para lienzos editables. |
| Ilustraciones 3D grises en tarjetas de plantilla; rayitas tipo código de barras como cierre | 29 | Decoración sin dato. |
| Bento con cursores de otros usuarios moviéndose solos, título palabra por palabra con blur | 55 | Es marketing. La presencia en vivo sirve solo si hay edición simultánea real. |
| Encabezados de tabla en MAYÚSCULA con tracking | 23, 30, 49, 51 | Funcionan en oscuro técnico, pero rompen la regla de la skill y bajan la legibilidad en español con palabras largas. Mantener minúscula inicial. |
| Botón principal de color saturado de marca en claro (rojo "New meeting") | 64 | Válido solo si es el acento del sistema; nunca un color distinto por acción. |
| Grilla con verticales en todas las columnas | 06, 09, 12 | Ver 1.19: solo en modo planilla editable. |
| Tarjetas kanban con rótulos repetidos y 340 px de alto | 10 | Mucho scroll para poca información. |
| "Vencido" en pastilla blanca neutra | 07 | Lo vencido tiene que ser lo más visible. |
| Probabilidad coloreada por umbral | 28 | Número coloreado: la skill lo prohíbe; el color va en el delta o la pastilla. |
| Columna de acciones fija que pisa montos | 07 | Probar siempre con el monto más largo y la tabla al mínimo. |
| Panel en blanco al cambiar de vista | 65 | Rompe la sensación de sistema terminado. |
| Datos de muestra incoherentes ("Succes", "6hm ago", error listado bajo Éxito) | 29 | Se notan más que el diseño. |
| Alto de fila por fila arrastrando | 07 | Demo vistosa; en un ERP alcanza con la densidad global. |
| Buscador, orden y vistas en la pantalla de Ajustes | 47 | Controles de lista donde no hay lista. |

---

## 19. Tweets 66–69 (detalle en `analisis/18-tweets-66-69.md`)

| # | Autor | Qué muestra | Qué entra a la skill | Dónde |
|---|---|---|---|---|
| 66 | @x6sense | 5 pantallas de acceso | Una columna de formulario de 360–440 con orden fijo; el panel de al lado elige el diseño (marca, imagen, pasos, centrado, puntos); 7 estados en el lugar | `guias/acceso.md`, `ejemplos/pantallas/login-variantes.html`, SKILL.md §5 Acceso |
| 67 | @jaimintf | 10 reglas de app nativa | Código de un toque (`one-time-code`), optimista con reversión, foto con vista borrosa, tarjeta que crece a ficha, títulos con `text-wrap: balance` | SKILL.md §2, §5 Acciones, §5 Celular, §6f |
| 68 | @suryansh777777 | Mover una tarjeta muestra cómo cambia la fecha de entrega | La consecuencia se ve antes de soltar: pastilla con antes → después y delta; conteos −1/+1; "Define la fecha" | `ejemplos/arrastre-con-impacto.html`, SKILL.md §1c.5, §5 Pipeline |
| 69 | @murad_ux | Tablero de corridas de agentes con traza y error | El límite como raya rotulada; el paso fallido con código, mensaje y la línea culpable; reintentar = corrida nueva | SKILL.md §1c.4 |

## Top 25 para aplicar ya en sistemas de gestión

Ordenado por impacto sobre el trabajo diario y por lo poco que cuesta (casi todo es capa de presentación sobre datos que ya existen).

1. **Conteo con verbo en el menú** ("2 te necesitan", "3 vencidas") en ámbar o rojo solo si exige actuar (6.7) — 25, 49, 51.
2. **Pestañas de estado con punto y conteo, también en 0**, que hacen de leyenda (2.6) — 01, 06, 43.
3. **Pie fijo de tabla con "N registros" y "Total"** del filtro, y "Calcular" por columna (1.9) — 07, 09, 43.
4. **Estado = forma + color + palabra**, repetido igual en menú, fila y panel; lo resuelto en gris sin pastilla (6.7, 1.17, 8.8) — 25, 37, 49.
5. **Bloqueado o vencido siempre con su motivo** después de una raya ("Bloqueado — falta remito") (6.7) — 25.
6. **Hoja lateral que empuja la tabla** para ver o editar sin navegar (3.3, 3.6) — 40, 43.
7. **Alta con contexto precargado y "Crear otra"** (3.5) — 39.
8. **Agrupar pendientes por urgencia** con bandas Vencidas / Hoy / Mañana / Próximas, rojo solo en la fecha (2.8) — 12, 41.
9. **Procesos en lote visibles paso a paso** (punteado / girando / ✓ / ✕, tiempo mono, n/N) y resultado en verbos y cifras (5.6, 5.7, 4.6) — 15, 16, 53, 54.
10. **Vista previa con datos reales antes de una acción masiva**, con la fila "sin asignar" en rojo (4.1) — 27.
11. **Problema mostrado en cada nivel con su botón** + lista de control; botón principal apagado solo con la causa escrita (5.10, 5.11, 5.12) — 15, 17, 27.
12. **Panel Vista** con densidad en 3 niveles, columnas visibles, orden y valor actual en el primer nivel (2.1, 1.1, 2.2) — 01.
13. **Filtro por facetas en vivo** con "Mostrando X de Y · Limpiar" e insignia en el botón (2.3, 2.5) — 04.
14. **Primera columna fija** con fondo sólido, anchos por tipo y redimensionables con guía de 2 px (1.4, 1.3, 1.5) — 03, 07.
15. **Ícono de tipo en cada encabezado** y código de entidad en mono gris pegado al título (1.2, 1.10) — 06, 12.
16. **Tarjeta de responsable con su carga**: abiertas, vencidas en rojo, hechas en 7 días (9.1) — 38.
17. **Kanban con conteo arriba y total al pie**, arrastre con fantasma, destino marcado y toast con Deshacer (10.5, 10.6) — 12, 13, 41.
18. **Total con su barra segmentada** en lugar de torta, y bimoneda con equivalente en segunda línea (7.2, 7.14) — 56.
19. **Color de gráfico solo para lo nombrado en la leyenda**, el resto en grises escalonados (7.3) — 35.
20. **Gráfico con mini-tabla resumen, "Ver tabla" y subtítulo de origen y período** (7.5, 7.6) — 34, 58.
21. **Evento de calendario con tinte + borde izquierdo de 3 px**, "ahora" solo en hoy y "+" en la celda vacía (8.1, 8.2, 8.4) — 36.
22. **⌘K con chips por tipo, resultados de 2 líneas y pie de teclas** (11.1) — 43.
23. **Menús con columnas fijas**, resaltado que viaja, atajos visibles y destructivo último en rojo (11.2, 11.3) — 52.
24. **Columna "Modificó"** desde el historial que ya existe (1.15) — 51.
25. **Nunca un panel en blanco**: esqueleto con la propia interfaz en fantasma y el contenido anterior hasta que llega el nuevo; marco quieto al navegar (15.7, 15.2) — 22, 60, 65.
