# Textos de la interfaz (microcopy)

Cómo escribir lo que dice un sistema de gestión: botones, títulos, vacíos, errores, toasts, avisos, ayudas, estados, fechas y números. Va con SKILL.md §6 (textos), §6b (vacío, cargando, error) y §6c (formato de datos), y con `analisis/13-estados.md` y `analisis/14-contenido.md`.

Los ejemplos usan la marca inventada **Estudio Faro** y sus clientes de ejemplo (Orbe Retail, Casa Lumen, Grupo Atlas, Mesa Fina, Estudio Norte). Cambialos por los datos reales del sistema.

**Cómo usarla:** antes de entregar una pantalla, buscá cada texto en la tabla de su situación (§3 a §11) y pasá la lista de §14.

---

## 1. Tono

La interfaz habla como una compañera de trabajo que sabe lo que pasa: directa, concreta, tranquila y de vos.

1. **Voseo siempre.** "Cargá", "Revisá", "Tenés". Nunca "usted", "tú" ni infinitivo de cartel ("Ingresar datos").
2. **Primero el dato, después la palabra.** "3 facturas vencidas" antes que "Hay facturas que vencieron".
3. **Una idea por frase.** Si una frase tiene coma y "y", probablemente son dos.
4. **El sistema se hace cargo.** Si algo falla de nuestro lado, "No pudimos…". Si falta algo de la persona, se dice qué falta, sin culpar: "Falta el CUIT", no "No ingresaste el CUIT".
5. **Nombres, no categorías.** "Lucía pide aprobar un descuento", no "Tenés una solicitud pendiente".
6. **Sin festejo ni drama.** Nada de signos de exclamación, emojis, "¡Genial!", "¡Ups!" ni "Atención:". El color y el ícono ya marcan el tono.
7. **Tipo oración en todo:** mayúscula solo en la primera palabra y en nombres propios. La mayúscula entera queda para los rótulos de grupo del menú.
8. **Mismo nombre para lo mismo en todo el sistema.** Si el botón dice "Registrar cobro", el toast dice "Cobro registrado" y el historial "Registró un cobro". Nunca "pago" en un lado y "cobro" en otro.

---

## 2. Límites de largo

| Pieza | Máximo | Si no entra |
|---|---|---|
| Botón | 3 palabras | Sacá el artículo; si sigue sin entrar, el objeto ya está en el título |
| Ítem del menú | 2 palabras | Sustantivo solo: "Cobranzas" |
| Título de página | 3 palabras | Sustantivo corto; el detalle va al subtítulo |
| Subtítulo | 3 datos unidos con " · " | Dejá los 2 que piden acción |
| Título de toast | 60 caracteres | Código y monto, sin el nombre largo del cliente |
| Línea de metadatos | 3 datos | Lo más importante primero |
| Estado (pastilla) | 1–2 palabras | Nunca una frase |
| Ayuda de campo | 1 línea (~70 caracteres) | Si necesita más, el campo está mal planteado |
| Mensaje de error | 2 frases: qué pasó + qué hacer | — |

---

## 3. Botones: verbo + objeto, máximo 3 palabras

- **Verbo en infinitivo + objeto:** "Registrar cobro", "Nueva factura", "Ver PDF". En crear se acepta "Nueva/Nuevo + objeto", que es como lo dice la gente.
- **Un verbo solo** vale cuando el objeto ya está en pantalla y no hay ambigüedad: "Guardar" y "Cancelar" al pie de una hoja, "Aprobar" dentro de la fila de una aprobación, "Deshacer" en un toast, "Reintentar" en un error.
- **El botón que confirma repite la acción**, nunca "Sí", "Aceptar" ni "OK": "Anular factura", "Borrar contacto".
- **Cancelar** cierra sin hacer nada. Si hay cambios sin guardar, el botón se llama "Descartar cambios".
- **Mientras trabaja,** el botón dice el gerundio con puntos suspensivos y conserva el ancho: "Guardando…", "Enviando…", "Facturando…".
- **Al terminar,** el botón pasa a pastilla de estado en participio: "Aprobado", "Enviada", "Cobrada".
- **"+ Agregar …"** al final de su lista, con el objeto en singular: "+ Agregar paso".
- **Enlaces de texto** dicen adónde llevan: "Ver las 12 facturas", no "Ver más" ni "Hacé clic acá".
- **Un botón que no aplica no se muestra.** Si se muestra desactivado, lleva al lado el porqué: "Falta el CUIT para facturar".

| Antes | Después |
|---|---|
| Aceptar | Guardar cambios |
| Enviar | Enviar propuesta |
| OK | Entendido (solo en un aviso que no pide nada más; si pide algo, el verbo de eso) |
| Sí / No (en un modal) | Anular factura / Cancelar |
| Continuar | Revisar y enviar |
| Submit | Crear oportunidad |
| Click aquí | Ver el contrato |
| Ver más | Ver las 12 facturas |
| Crear nuevo registro de cliente | Nuevo cliente |
| Proceder con el pago | Registrar cobro |
| Eliminar | Borrar contacto |
| Agregar ítem nuevo a la lista | + Agregar ítem |
| Descargar archivo PDF | Descargar PDF |
| Ir a configuración | Ajustes |
| Cargando… (en el botón de guardar) | Guardando… |
| Reintentar la operación | Reintentar |
| Marcar todas las notificaciones como leídas | Marcar todo leído |
| Conectar de nuevo la cuenta de Gmail | Reconectar Gmail |

---

## 4. Títulos y subtítulos con cifras

- **Título = sustantivo corto** de lo que hay en la pantalla: "Cobranzas", "Pipeline", "Facturas". Nada de "Gestión de…", "Panel de…" ni "Módulo de…".
- **Subtítulo = el estado actual en cifras reales**, unidas con " · ", con lo que pide acción primero. Nunca describe para qué sirve la pantalla.
- **Si todo está al día,** el subtítulo lo dice con cifra: "Todo cobrado · 18 facturas este mes".
- **Saludo** solo en el inicio, con el nombre y según la hora de Argentina calculada en el servidor: "Buenos días" (5–12), "Buenas tardes" (12–20), "Buenas noches" (20–5). Arriba, la fecha en una línea gris: "Martes 17 de noviembre".
- **Título de tarjeta o sección** con su conteo gris pegado: "Proyectos en curso 4", "Para atender 3".
- **Rótulo de KPI** con sustantivo y período: "Ganado en noviembre", no "Ventas". La línea de contexto dice contra qué se mide.

| Antes | Después |
|---|---|
| Gestión de cobranzas | Cobranzas |
| Panel de control | Inicio |
| Aquí podrás ver y gestionar todas tus facturas | 12 por facturar · 3 vencidas · US$ 41.600 a cobrar |
| Bienvenido/a al sistema | Buenas tardes, Ana |
| Administrá tus oportunidades de forma eficiente | 24 abiertas · US$ 184.200 · 2 seguimientos vencidos |
| Listado de proyectos | Proyectos · 4 en curso · 1 atrasado |
| Ventas | Ganado en noviembre |
| Total: 11 | 11 seguimientos para los próximos 7 días |
| Rendimiento | Tasa de cierre · 8 ganadas de 25 decididas |
| No hay pendientes | Todo al día · 18 cobradas este mes |
| Tareas del usuario | Mis tareas 7 |
| Detalle de la factura FAC-01098 | FAC-01098 (título) · Grupo Atlas · vencida hace 6 días (subtítulo) |

---

## 5. Estados vacíos

Tres partes y nada más: **qué va a aparecer acá + qué gana la persona al cargarlo + el botón que lo crea.** Ilustración de línea chica arriba (SKILL §6b).

- Hay tres vacíos distintos y cada uno se escribe distinto:
  1. **Primera vez** (nunca hubo nada): invita a cargar el primero.
  2. **Al día** (había y se resolvió): lo dice como buena noticia, sin botón de crear.
  3. **Filtro sin resultados**: dice qué filtro deja la lista vacía y ofrece limpiarlo.
- Nunca "No hay datos", "Sin resultados" ni "Lista vacía" solos.

| Antes | Después |
|---|---|
| No hay datos | Todavía no hay oportunidades. Cargá la primera y aparece acá con su etapa y su seguimiento. [Nueva oportunidad] |
| No se encontraron registros | Ninguna factura vencida con "Grupo Atlas". [Limpiar filtros] |
| Sin resultados para su búsqueda | Nada con "lumen" en clientes. Probá con el CUIT o el nombre del contacto. |
| Lista vacía | No tenés tareas para hoy. La próxima es mañana 09:30: visita a Orbe Retail. |
| No hay notificaciones | Estás al día. Te avisamos acá cuando alguien te pida algo. |
| No existen cobros registrados en el período seleccionado | Ningún cobro en octubre. [Ver noviembre] |
| El proyecto no tiene archivos adjuntos | Sin archivos todavía. Arrastrá acá el PDF o la foto. [Subir archivo] |
| No hay contactos asociados | Casa Lumen no tiene contactos. [+ Agregar contacto] |

---

## 6. Cargando y guardando

- **Cargando:** esqueleto con la forma final, sin texto. Si tarda más de 3 s, una línea gris debajo: "Trayendo las facturas de Grupo Atlas…".
- **Guardando:** el botón dice "Guardando…". Lo demás no se bloquea.
- **Procesos largos** (importar, facturar en lote) dicen qué hacen y cuánto falta: "Facturando 18 de 42…". Si se puede seguir trabajando, decilo: "Te avisamos cuando termine".

| Antes | Después |
|---|---|
| Cargando… (spinner en el medio) | Esqueleto con la forma de la tabla, sin texto |
| Por favor espere | Trayendo las facturas de Grupo Atlas… |
| Procesando solicitud… | Facturando 18 de 42… |
| Esta operación puede tardar varios minutos. No cierre la ventana. | Importando 1.240 contactos. Te avisamos cuando termine. |

---

## 7. Errores: qué pasó + qué hacer

- **Dos frases:** la primera dice qué pasó en palabras de la persona; la segunda, qué puede hacer. Si los datos quedaron a salvo, decilo.
- **En el lugar,** no en un modal. Junto al campo si es de un campo; arriba de la lista si es de la lista.
- **Sin códigos ni jerga** a la vista. El código técnico va en un "Copiar detalle" gris para soporte, nunca en el título.
- **Sin culpa:** "Falta el CUIT", no "Ingresaste un CUIT inválido".
- **Error de campo:** aparece al salir del campo o al guardar, nunca mientras escribe. Dice el formato correcto con un ejemplo.
- **Permisos:** dice quién puede hacerlo y ofrece pedirlo.
- **Conflicto** (otro editó lo mismo): dice quién y cuándo, y deja elegir.

| Antes | Después |
|---|---|
| Error inesperado | No pudimos guardar la factura. Revisá la conexión y probá de nuevo. [Reintentar] |
| Error 500: Internal Server Error | No pudimos traer las facturas. Lo que ya estaba cargado sigue a salvo. [Reintentar] |
| Ha ocurrido un error. Contacte al administrador. | No pudimos enviar la propuesta a Casa Lumen. Quedó como borrador; probá en unos minutos. |
| Campo obligatorio | Falta el cliente |
| Formato inválido | El CUIT tiene 11 números, sin guiones: 30712345678 |
| Email inválido | Al correo le falta la @: lucia@estudiofaro.com |
| El valor debe ser mayor a 0 | El monto tiene que ser mayor a $ 0 |
| La fecha ingresada es incorrecta | El vencimiento no puede ser antes de la emisión (12 nov) |
| Acceso denegado | Solo Dirección puede aprobar descuentos de más del 10 %. [Pedir aprobación] |
| 403 Forbidden | No tenés acceso a Reportes. Pedíselo a Ana Ruiz. |
| Timeout de la conexión | Se cortó la conexión. Lo que escribiste quedó guardado en este equipo. [Reintentar] |
| Conflicto de versiones del registro | Martín cambió este contrato hace 2 min. [Ver sus cambios] [Guardar el mío igual] |
| El archivo excede el tamaño máximo permitido | El PDF pesa 32 MB y el máximo es 20 MB. Comprimilo o subí las hojas por separado. |
| Token expirado. Vuelva a autenticarse. | Se cerró tu sesión por inactividad. Entrá de nuevo y seguís donde estabas. |
| No se pudo conectar con la API de Gmail | Gmail dejó de responder. 23 correos esperan para entrar. [Reconectar Gmail] |
| Registro duplicado | Ya existe Orbe Retail con ese CUIT. [Abrir Orbe Retail] |

---

## 8. Confirmaciones y toasts

### Deshacer antes que confirmar
Lo reversible se hace sin preguntar y aparece un toast con **Deshacer**. El modal queda solo para lo irreversible (borrar definitivo, enviar a un tercero, facturar con CAE).

### Toast: qué se hizo + consecuencia + Deshacer
- **Título:** participio + objeto + código y monto. "Cobro registrado · FAC-01101 · US$ 18.400".
- **Segunda línea:** la consecuencia, dónde quedó o qué cambia: "Quedó en Cobranzas como cobrada".
- **Acción:** "Deshacer" si se puede; si no, "Ver" con el destino ("Ver factura").
- Dura 5 s, se pausa con el mouse encima y no se apila más de 3.
- Nunca "Operación exitosa", "Guardado correctamente" ni "¡Listo!".

### Modal de confirmación (solo para lo irreversible)
- **Título:** pregunta con la acción y el objeto concreto: "¿Anular FAC-01102?".
- **Cuerpo:** una frase con la consecuencia que no se ve: "Se emite una nota de crédito por US$ 9.800 y Casa Lumen deja de deberla."
- **Botones:** la acción repetida ("Anular factura") y "Cancelar". Nunca "Sí / No".
- Si es muy grave, se pide escribir el código, no tildar "Estoy seguro".

| Antes | Después |
|---|---|
| Operación realizada exitosamente | Cobro registrado · FAC-01101 · US$ 18.400 / Quedó en Cobranzas como cobrada · [Deshacer] |
| Guardado correctamente | Contrato actualizado · CTR-0412 / El nuevo precio corre desde el 1 dic · [Deshacer] |
| ¡Listo! Tarea completada | Hecho: Presentar rutas de logo / Quedó en el historial de Identidad Orbe · [Deshacer] |
| El registro fue eliminado | Contacto borrado · Martín Ruiz / Sus 4 actividades quedan en Grupo Atlas · [Deshacer] |
| Solicitud aprobada con éxito | Descuento aprobado · PR-0241 / Lucía ya puede enviar la propuesta · [Deshacer] |
| Email enviado | Propuesta enviada a Sofía (Orbe Retail) / Te avisamos cuando la abra · [Ver propuesta] |
| Se archivaron los elementos seleccionados | 6 oportunidades archivadas / Salen del pipeline; las encontrás en Archivo · [Deshacer] |
| ¿Está seguro de que desea eliminar este registro? | ¿Borrar el contacto Martín Ruiz? (solo si no se puede deshacer) |
| Esta acción no se puede deshacer. ¿Desea continuar? | Se emite una nota de crédito por US$ 9.800 y Casa Lumen deja de deberla. [Anular factura] [Cancelar] |
| ¿Desea salir sin guardar? | Tenés cambios sin guardar en el contrato. [Descartar cambios] [Seguir editando] |
| Los cambios se aplicaron | Avisos actualizados · solo para vos |
| Recordatorio pospuesto | Vuelve mañana 09:00 · [Deshacer] |

---

## 9. Avisos y notificaciones

- **Título:** quién + qué + sobre qué, con código y monto si hay: "Lucía pide aprobar un descuento · PR-0241 · Estudio Norte".
- **Metadatos:** de dónde viene + detalle + cuándo: "Propuestas · 12 % sobre US$ 18.400 · hace 8 min".
- **Acción en la fila,** con el verbo de lo que hay que hacer: "Aprobar", "Llamar", "Reconectar".
- **Aviso de sistema** (límite, conexión caída) dice la cifra y el efecto: "Usaste el 80 % de los envíos del mes (4.000 de 5.000)".
- **Banner de pantalla** solo para lo que bloquea o vence hoy. Si hay más de 3 rojos, se agrupan: "4 facturas vencidas suman US$ 51.300. [Ver vencidas]".
- **Correo o WhatsApp de aviso:** el asunto es el título del aviso, sin "Notificación:" ni "Aviso importante". El cuerpo trae el enlace que deja parado en la fila.

| Antes | Después |
|---|---|
| Nueva notificación | Lucía pide aprobar un descuento · PR-0241 · Estudio Norte |
| Tiene una tarea pendiente | Seguimiento vencido · Martín Ruiz · Grupo Atlas |
| Se ha producido un cambio en el estado de la oportunidad | Casa Lumen aceptó la propuesta · US$ 9.800 |
| Recordatorio: reunión próximamente | Presentación de identidad en 40 min · Meet |
| El usuario Juan ha sido mencionado | Martín te mencionó en Identidad Orbe: "¿cerramos la paleta el viernes?" |
| Advertencia: límite de uso | Usaste el 80 % de los envíos del mes (4.000 de 5.000) |
| Error en la integración con Gmail | Gmail se desconectó · 23 correos esperan · [Reconectar] |
| Aviso importante: facturas vencidas | 4 facturas vencidas suman US$ 51.300 · [Ver vencidas] |
| Notificación: cliente actualizado | Lucía cambió el contacto principal de Mesa Fina |
| Resumen semanal de actividad | Tu semana: 3 cierres · US$ 41.600 ganados · 2 seguimientos vencidos |

---

## 10. Ayudas de campo y placeholders

- **El rótulo va arriba y siempre visible.** El placeholder nunca reemplaza al rótulo.
- **Placeholder = ejemplo real del formato,** no una instrucción: "30712345678", "Buscar cliente…".
- **Ayuda debajo** solo si cambia lo que la persona va a escribir: unidad, impuesto, a quién afecta, de dónde sale el dato. Si repite el rótulo, se borra.
- **Opcional se marca;** obligatorio no. "Notas (opcional)".
- **Toggles:** el rótulo dice qué pasa cuando está prendido; la ayuda, cuándo o a quién.

| Antes | Después |
|---|---|
| Ingrese el monto | Rótulo "Monto" · placeholder "18.400" · ayuda "Sin IVA. Se convierte al tipo de cambio del día." |
| Nombre: (placeholder "Escriba el nombre aquí") | Rótulo "Razón social" · placeholder "Orbe Retail S.A." |
| Campo obligatorio * (en 9 de 10 campos) | Solo el opcional marcado: "Notas (opcional)" |
| Fecha (dd/mm/aaaa) | Rótulo "Vence" · selector de fecha · ayuda "A 30 días de la emisión, como pide el cliente" |
| Activar notificaciones por email | Rótulo "Resumen diario por correo" · ayuda "A las 08:00, solo si hay algo" |
| Seleccione una opción | Placeholder "Elegí la etapa" |
| Descripción del campo CUIT: Clave Única de Identificación Tributaria | (sin ayuda: el rótulo "CUIT" alcanza) |
| Horario de silencio de notificaciones | Rótulo "Horario silencioso" · "20:00 – 08:00" · ayuda "Lo urgente igual te llega." |
| Buscar | Buscar cliente, CUIT o factura… |

---

## 11. Fechas y números en texto

Formato fijo en SKILL §6c. En frases:

- **Fechas cercanas, relativas:** "hace 2 min", "hace 1 h", "ayer 16:00", "mañana 09:30", "el jueves". Hasta 24 h, relativo; después, "9 dic". Si es de otro año, "9 dic 2025".
- **Plazos, con la palabra que importa:** "vence en 3 días", "venció ayer", "vencida hace 6 días". En una tabla, "Vencida" reemplaza a la fecha en rojo.
- **Hora en 24 h** con dos dígitos: "09:00", no "9 hs" ni "9:00 a. m.".
- **Rangos con raya y espacios:** "15:30 – 16:15", "1 – 15 dic".
- **Montos con moneda siempre:** "US$ 18.400", "$ 38.500". Miles con punto, decimales con coma. Abreviados en tarjetas ("US$ 184,2 mil", "$ 1,2 M"), completos en tablas.
- **Porcentajes y deltas** con signo, espacio, período y, en variaciones de tasas, "pts": "+12,4 % vs. octubre", "−4 pts vs. octubre". Usá el signo menos (−), no el guion.
- **Conteos como fracción con meta:** "3 de 6 hechas", "8 ganadas de 25 decididas".
- **Singular y plural bien resueltos en código:** "1 factura vencida", "2 facturas vencidas". Nunca "1 factura(s)".
- **Cero con palabra** cuando es una buena noticia ("Ninguna vencida"); "—" gris cuando no hay dato.
- **Códigos en mono y tal cual:** FAC-01101, PR-0241, CTR-0412. Cuenta bancaria parcial: "···· 4821".

| Antes | Después |
|---|---|
| 2026-11-17T15:30:00Z | Hoy 15:30 |
| 17/11/2026 | 17 nov (si es de este año) |
| Hace 0 minutos | Recién |
| Hace 26 horas | Ayer 13:10 |
| Vencimiento: 11/11/2026 (en rojo, sin más) | Vencida hace 6 días |
| 9 hs | 09:00 |
| 18400 USD | US$ 18.400 |
| $1,234,567.89 | $ 1.234.567,89 |
| 12.4% | +12,4 % vs. octubre |
| -4% (tasa de cierre) | −4 pts vs. octubre |
| 3/6 | 3 de 6 hechas |
| 1 factura(s) pendiente(s) | 1 factura por cobrar |
| 0 vencidos | Ninguna vencida |
| null / undefined / 0 (cuando no hay dato) | — |

---

## 12. Nombres de estados estándar

Una o dos palabras, en participio o adjetivo, **en el género de la entidad** ("Cobrada" para factura, "Cobrado" para pago). El color sale de SKILL §3. Mismo nombre en la pastilla, el filtro, el toast y el historial.

| Entidad | Gris | Azul | Ámbar | Verde | Rojo |
|---|---|---|---|---|---|
| Factura | Borrador · Anulada | Emitida | Por cobrar · Parcial | Cobrada | Vencida · Rechazada |
| Propuesta / cotización | Borrador · Retirada | Enviada · Vista | Por aprobar · Vence pronto | Aceptada | Rechazada · Vencida |
| Oportunidad | Archivada | Abierta · en etapa (Contacto, Propuesta, Negociación) | En pausa | Ganada | Perdida |
| Tarea / paso | — | En curso | Pendiente | Hecha | Vencida |
| Contrato | Borrador · Terminado | Vigente | Por renovar · Por vencer | — | Vencido · Suspendido |
| Pago / cobro | Reintegrado · Anulado | Procesando | Parcial | Acreditado | Falló · Rechazado |
| Aprobación | Retirada | — | Por aprobar | Aprobada | Rechazada |
| Conexión / integración | Apagada | Sincronizando | Parcial | En línea | Desconectada |
| Persona del equipo | Inactiva | De licencia | — | Activa | — |

Reglas:
- **Pendiente es "Por + verbo"** cuando hay alguien que tiene que hacer algo: "Por cobrar", "Por aprobar", "Por facturar". Así la pastilla ya dice la acción.
- **"Vencida" reemplaza a la fecha** en la columna de vencimiento; la pastilla de estado no repite "Vencida".
- **Prioridad:** Baja, Media, Alta. Nunca "Urgente" como prioridad: lo urgente es un vencimiento.
- **Nada de** "Activo/Inactivo" para documentos, "OK", "Error", "N/A", "Pendiente de revisión por parte de…", ni estados en inglés ("Draft", "Paid").

---

## 13. Palabras a evitar y qué usar

| Evitar | Por qué | Usar |
|---|---|---|
| Exitosamente / con éxito / correctamente | Si no salió bien, no habría toast | El participio solo: "Cobro registrado" |
| Error inesperado / Ha ocurrido un error | No dice qué ni qué hacer | Qué pasó + qué hacer (§7) |
| Por favor | Alarga sin informar; en un sistema propio suena a formulario público | El verbo directo: "Revisá el CUIT" |
| Lo sentimos / Disculpe las molestias | Rellena; lo útil es la salida | "No pudimos…" + la salida |
| ¿Está seguro? | No dice la consecuencia | La consecuencia concreta (§8) |
| Usted, su, ingrese, seleccione | No es voseo | Vos, tu, cargá, elegí |
| Ingresar / Ingrese | Burocrático y ambiguo (¿entrar o cargar?) | Cargar, escribir, entrar (sesión) |
| Registro, ítem, elemento, entidad, objeto | Jerga de base de datos | El nombre real: factura, cliente, tarea |
| Usuario (hablándole a la persona) | La persona no se ve como "usuario" | Vos, o el nombre: "Lucía" |
| Gestionar, administrar, eficiente, potenciar, optimizar | Relleno de folleto | El verbo concreto: cobrar, aprobar, asignar |
| Click aquí / Hacé clic | El enlace ya es clickeable | El destino como texto del enlace |
| Haga clic en Aceptar para continuar | Doble relleno | Botón con verbo + objeto |
| Null, undefined, NaN, ID, UUID, API, token, timeout, sync, payload, 404/500 | Jerga técnica | "—", el código del documento, "se cortó la conexión" |
| Submit, OK, Draft, Dashboard, Settings | Inglés innecesario | Enviar…, Borrador, Inicio, Ajustes |
| Inválido / incorrecto / ilegal | Acusa sin explicar | El formato correcto con ejemplo |
| Nuevo/a, Bienvenido/a, el/la cliente/a | Barras de género | Reescribir sin género o con el nombre |
| Atención:, Importante:, Nota: | El color y el ícono ya avisan | El dato directo |
| ¡Genial!, ¡Ups!, ¡Listo!, emojis | Festejo o drama de más | Participio sin signos |
| Actualmente, simplemente, solamente, fácilmente | Muletillas | Borrarlas |
| Funcionalidad, módulo, panel de… | Nombra el software, no el trabajo | El nombre de la pantalla: "Cobranzas" |

---

## 14. Antes de entregar los textos

1. ¿Todo está en voseo, tipo oración y sin signos de exclamación ni emojis?
2. ¿Cada botón tiene verbo + objeto en 3 palabras o menos, y el que confirma repite la acción?
3. ¿El subtítulo de cada pantalla tiene cifras reales y no una descripción?
4. ¿Cada vacío dice qué va a aparecer y trae su botón? ¿El vacío por filtro ofrece limpiarlo?
5. ¿Cada error dice qué pasó y qué hacer, en el lugar y sin códigos a la vista?
6. ¿Cada toast dice qué se hizo, con código y monto, la consecuencia y Deshacer? ¿Hay modales solo para lo irreversible?
7. ¿Los estados usan los nombres de §12, en el género de la entidad, iguales en pastilla, filtro, toast e historial?
8. ¿Fechas, montos y porcentajes siguen §11? ¿Los plurales están resueltos?
9. Buscá en el código estas palabras y reemplazalas: `exitosamente`, `correctamente`, `por favor`, `inesperado`, `está seguro`, `ingrese`, `seleccione`, `registro`, `usuario`, `click`, `null`, `undefined`, `(s)`.
