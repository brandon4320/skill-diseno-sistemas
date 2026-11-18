# Íconos: un concepto, un ícono

Cada concepto del negocio tiene **un solo ícono**, el mismo en el menú, en las tablas, en los avisos y en el celular, en todos los sistemas. Si la factura es `receipt` en Cobranzas, es `receipt` en el CRM, en el MCP y en el correo de aviso. Este mapa manda: antes de elegir un ícono, buscalo acá.

Grilla visual con búsqueda y copiado: `ejemplos/iconos.html`.

## 1. El juego

- **Phosphor 2.1.1, solo regular y fill.** Nada de thin, light, bold ni duotone, y ningún otro juego (Lucide, Heroicons, Material) en el mismo sistema.
- **Web:**
  ```html
  <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css">
  <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/fill/style.css">
  <i class="ph ph-hand-coins"></i>        <!-- regular -->
  <i class="ph-fill ph-hand-coins"></i>   <!-- fill -->
  ```
- **React:** `@phosphor-icons/react`, el nombre en PascalCase: `ph-hand-coins` → `<HandCoins weight="regular" />`, `ph-arrow-u-up-left` → `ArrowUUpLeft`. Importá cada ícono por su nombre (`import { HandCoins } from '@phosphor-icons/react'`), nunca el paquete entero.
- **Íconos sin texto:** `aria-label` en el botón y tooltip. Íconos al lado de texto: `aria-hidden="true"`.

## 2. Tamaño

El ícono sigue al texto que acompaña. Siempre en px enteros y del mismo tamaño en toda la fila.

| Dónde | Ícono | Contenedor |
|---|---|---|
| Ítem del menú, botón de 36–38 px, barra superior | 17 | — |
| Botón chico (28 px), pie de tarjeta, rótulo de bandeja | 14–15 | — |
| Dentro de un texto o metadato de 12 px | 13 | — |
| Cuadro de tipo o estado en listas | 16 | 32 px, radio 10 |
| Cuadro de lista de avisos o de hoja lateral | 18 | 36–38 px, radio 12 |
| Cuadro de fila en celular, ícono de KPI | 19–20 | 40 px, radio 12–13 |
| Cuadradito de entidad (proyecto, cliente en el menú) | 11–12, fill blanco | 20–22 px, radio 7 |
| Estado vacío o error | 20–22 | 44 px, radio 14 |
| Acceso rápido en celular | 20–22, fill | tarjeta de 18 de radio |

Nunca más de 22 px dentro de la interfaz. Un ícono grande no es un dibujo: para eso está la ilustración de línea del estado vacío.

## 3. Peso: regular o fill

- **Regular** en todo lo normal: menú, botones, rótulos, pies, cuadros de tipo y de estado.
- **Fill** solo en tres casos:
  1. el ítem activo del menú y la pestaña activa de la barra inferior del celular;
  2. sobre un fondo de color sólido: el cuadradito de la entidad (glifo blanco) y el botón principal cuando lleva ícono de marca o de acción ("Unirme" con `video-camera`);
  3. los accesos rápidos del celular, en color de acento.
- El cambio regular → fill es la única señal de "activo" del ícono. No se le suma color de marca.

## 4. Color

- **Gris por defecto.** `texto-2` en el menú y los botones, `texto-3` en rótulos, pies y metadatos. El activo pasa a `tinta`.
- **El color solo vive adentro de un cuadro**, nunca suelto en un botón ni en un título:
  - **Cuadro de tipo:** fondo del color de la familia al 12 % y glifo del mismo color, saturado (sección 6).
  - **Cuadro de estado:** fondo y glifo del estado (verde, ámbar, rojo, azul, gris), como la pastilla.
  - **Cuadradito de entidad:** fondo sólido del color propio de esa entidad, glifo fill blanco.
  - **Logo de proveedor** (WhatsApp, Gmail, Outlook, Meet): su color de marca, dentro de un cuadro blanco con borde y sombra mínima.
- **Única excepción suelta:** las flechas de variación (`trend-up`, `trend-down`) y el `warning-circle` de "2 vencidos" en el pie de un KPI, que toman el color del texto que acompañan.
- En oscuro el fondo del cuadro sube al 18 % y el glifo se aclara un paso. Sin sombras.

## 5. Cuadro

- Cuadrado con radio de la escala (10–12), nunca círculo. Los círculos son para avatares.
- Dos variantes, una por lista: **tintado** (color de familia o de estado al 12 %) o **neutro** (superficie blanca + borde 1 px + sombra mínima, glifo `tinta`, como en 08). En una misma lista no se mezclan.
- En una lista de actividad, el cuadro dice el **tipo** (llamada, factura, entrega). El estado va en la pastilla de al lado, no en el color del cuadro. Solo los avisos que *son* un estado ("Vencido", "Falló") usan cuadro de estado.

## 6. Familias de color

El cuadro de tipo toma el color de su familia, nunca uno elegido a ojo. Son 6 colores de la paleta de datos más el gris: así una lista de actividad tiene vida sin pelear con los estados.

| Familia | Color | Qué agrupa |
|---|---|---|
| Navegación y vistas | sin color (gris) | Menú, migas, cambio de vista. Siempre gris; el activo pasa a fill. |
| Acciones | sin color (gris) | Botones y menú ⋯. Gris, nunca en cuadro de color. |
| Comercial | `#7c5ce0` | Pipeline, propuestas y lo vendido. |
| Personas y empresas | `#3b6fe0` | Quién: clientes, contactos, equipo y accesos. |
| Comunicación | `#d6336c` | Cada contacto con alguien: correo, llamada, reunión, nota. |
| Finanzas | `#25a866` | Plata que entra, sale o se guarda. |
| Operaciones | `#c8692b` | Equipos, mantenimiento, stock y trabajo en campo. |
| Logística e importación | `#0e9fb8` | Lo que se mueve: entregas, retiros, cargas y aduana. |
| Documentos | `#71717a` | Archivos sueltos. Cuadro neutro gris. |
| Estados y alertas | el del estado | Toman el color del estado, no el de la familia. |

## 7. Mapa

"No usar" lista el ícono que se confunde y suele aparecer por error. Todos los nombres están verificados contra `@phosphor-icons/web@2.1.1` (regular y fill).

### Navegación y vistas (17)

| Concepto | Ícono | No usar | Nota |
|---|---|---|---|
| Inicio | `house` | — | Primer ítem del menú. |
| Tablero / resumen | `squares-four` | `layout` | Raíz de las migas de pan. |
| Tareas | `check-square` | `check-circle` | check-circle es «hecho», no la sección. |
| Calendario | `calendar-blank` | `calendar`, `calendar-dots` | El de números se lee como fecha fija. |
| Bandeja de entrada | `tray` | `envelope-simple` | La bandeja junta todo; el sobre es solo correo. |
| Avisos | `bell` | `bell-simple` |  |
| Reportes | `chart-line-up` | `chart-bar`, `presentation-chart` |  |
| Búsqueda | `magnifying-glass` | — | Con ⌘K al lado. |
| Filtro | `funnel-simple` | `funnel` | El embudo con boca ancha se confunde con un pipeline. |
| Ordenar | `sort-ascending` | `arrows-down-up` |  |
| Vista lista | `rows` | `list` | Dentro del segmentado de vistas. |
| Vista tabla | `table` | `grid-four` |  |
| Vista columnas | `columns` | `kanban` | kanban queda para el pipeline. |
| Historial de cambios | `clock-counter-clockwise` | `clock` |  |
| Asistente IA | `sparkle` | `robot`, `magic-wand` |  |
| Ajustes | `gear-six` | `gear`, `sliders` | Al pie del menú. |
| Ayuda | `question` | `info` | info es un estado informativo. |

### Acciones (20)

| Concepto | Ícono | No usar | Nota |
|---|---|---|---|
| Agregar | `plus` | `plus-circle` | «+ Agregar …» al final de su lista. |
| Editar | `pencil-simple` | `pencil`, `note-pencil` |  |
| Duplicar | `copy` | `files` |  |
| Borrar | `trash` | `trash-simple`, `x` | Siempre al final del menú ⋯. |
| Más acciones | `dots-three` | `dots-three-vertical` |  |
| Abrir la ficha | `arrow-up-right` | `caret-right` | Esquina de tarjetas clickeables. |
| Abrir afuera | `arrow-square-out` | `link` | Solo si sale del sistema. |
| Exportar | `export` | `download-simple` | Exportar arma un archivo con lo que ves. |
| Descargar | `download-simple` | `cloud-arrow-down` | Bajar un archivo que ya existe. |
| Subir archivo | `upload-simple` | `cloud-arrow-up` |  |
| Imprimir | `printer` | — |  |
| Compartir | `share-network` | `share` |  |
| Vincular | `link` | `link-simple` | Colgar un registro de otro. |
| Enviar | `paper-plane-tilt` | `paper-plane` |  |
| Reintentar | `arrow-clockwise` | `arrows-clockwise` | En el estado de error. |
| Deshacer | `arrow-u-up-left` | `arrow-counter-clockwise` | Solo en el toast. |
| Cerrar | `x` | `x-circle` | x-circle es «falló». |
| Fijar | `push-pin` | — |  |
| Favorito | `star` | `heart` |  |
| Etiqueta | `tag-simple` | `tag` | tag queda para tarifas. |

### Comercial (16)

| Concepto | Ícono | No usar | Nota |
|---|---|---|---|
| Pipeline | `kanban` | `funnel` |  |
| Valor del pipeline | `wallet` | `currency-circle-dollar` | Solo en el KPI del monto abierto. |
| Oportunidad | `handshake` | `target` |  |
| Seguimiento | `phone-call` | `alarm` | Lo que hay que llamar; la llamada hecha es phone. |
| Propuesta | `file-text` | `file` | file es el documento genérico. |
| Cotización | `calculator` | — |  |
| Ganado | `seal-check` | `trophy` |  |
| Perdido | `thumbs-down` | `x-circle` |  |
| Tasa de cierre | `target` | `percent` |  |
| Meta | `flag-banner` | `flag` |  |
| Comisión | `seal-percent` | `percent` | percent queda para impuestos. |
| Tarifa / lista de precios | `tag` | `currency-dollar` |  |
| Producto | `cube` | `package` | package es stock físico. |
| Servicio vendido | `briefcase` | `wrench` |  |
| Proyecto | `stack` | `folder-simple` | folder-simple es una carpeta de archivos. |
| Contrato | `signature` | `file-text` |  |

### Personas y empresas (14)

| Concepto | Ícono | No usar | Nota |
|---|---|---|---|
| Cliente | `buildings` | `building` | Una cuenta: la empresa que compra. |
| Empresa propia | `building-office` | `buildings` | Selector de empresa o razón social. |
| Proveedor | `factory` | `storefront` | storefront se usa como ícono de entidad. |
| Contacto | `user` | `user-circle` | Una persona de un cliente o proveedor. |
| Agenda de contactos | `address-book` | — |  |
| Usuarios del sistema | `users` | `users-three` | users-three es reunión. |
| Equipo de trabajo | `users-four` | `users` |  |
| Invitar | `user-plus` | `plus` |  |
| Rol | `user-gear` | `gear-six` |  |
| Permisos | `shield-check` | `lock` |  |
| Acceso / contraseña | `lock-key` | `key` |  |
| Personal / legajo | `identification-badge` | `identification-card` |  |
| Operario | `hard-hat` | `user` |  |
| Cerrar sesión | `sign-out` | `power` |  |

### Comunicación (11)

| Concepto | Ícono | No usar | Nota |
|---|---|---|---|
| Correo | `envelope-simple` | `envelope`, `at` |  |
| Llamada | `phone` | `phone-call` | La llamada registrada. |
| Llamada perdida | `phone-x` | `phone-slash` |  |
| Reunión | `users-three` | `calendar-blank` |  |
| Videollamada | `video-camera` | `video`, `webcam` | Con Meet o Teams: logo en cuadro blanco. |
| WhatsApp | `whatsapp-logo` | `chat-circle` | Logo de marca: verde #25D366 en cuadro blanco. |
| Chat interno | `chat-circle-dots` | `chats` |  |
| Comentario | `chat-circle-text` | `chat-text` |  |
| Nota | `note` | `note-pencil`, `notepad` | notepad es el parte de trabajo. |
| Mención | `at` | — |  |
| Recordatorio | `alarm` | `bell` | bell son los avisos del sistema. |

### Finanzas (15)

| Concepto | Ícono | No usar | Nota |
|---|---|---|---|
| Factura | `receipt` | `invoice` | invoice es otro dibujo: no mezclar. |
| Nota de crédito | `receipt-x` | `receipt` |  |
| Cobro / cobranzas | `hand-coins` | `currency-circle-dollar` | Entra plata. |
| Pago a proveedor | `money-wavy` | `credit-card` | Sale plata. |
| Gasto | `shopping-bag` | `receipt` |  |
| Viático | `suitcase-rolling` | `airplane-tilt` |  |
| Combustible | `gas-pump` | — |  |
| Caja | `cash-register` | `vault`, `wallet` |  |
| Banco | `bank` | — |  |
| Transferencia | `arrows-left-right` | `swap` |  |
| Efectivo | `money` | `coins` |  |
| Tipo de cambio | `swap` | `currency-dollar` |  |
| Impuestos / IVA | `percent` | — |  |
| Cuenta corriente / saldo | `scales` | — |  |
| Orden de compra | `shopping-cart` | `basket` |  |

### Operaciones (11)

| Concepto | Ícono | No usar | Nota |
|---|---|---|---|
| Equipo / máquina | `engine` | `gear` | «Equipo» acá es la máquina; las personas van con users-four. |
| Mantenimiento | `wrench` | `hammer` |  |
| Plan preventivo | `calendar-check` | `wrench` |  |
| Avería | `lightning-slash` | `warning` | warning queda para alertas. |
| Taller / repuestos | `toolbox` | — |  |
| Uso / horómetro | `gauge` | `speedometer` |  |
| Horas trabajadas | `timer` | `clock` |  |
| Inventario / stock | `package` | `cube` | cube es producto del catálogo. |
| Depósito | `warehouse` | — |  |
| Parte de trabajo | `notepad` | `clipboard-text` | clipboard-text es el remito. |
| Habilitación / certificado | `certificate` | `seal` |  |

### Logística e importación (14)

| Concepto | Ícono | No usar | Nota |
|---|---|---|---|
| Logística | `path` | `truck` | truck es el vehículo. |
| Ruta / recorrido | `map-trifold` | `map-pin` |  |
| Ubicación / obra | `map-pin` | `map-pin-line` |  |
| Entrega | `hand-arrow-down` | `box-arrow-down` | Al cliente: el equipo baja. |
| Retiro | `hand-arrow-up` | `box-arrow-up` | Vuelve a nosotros: el equipo sube. |
| Camión / flota | `truck` | `truck-trailer` |  |
| Chofer | `steering-wheel` | `user` |  |
| Remito | `clipboard-text` | `file-text` |  |
| Importación | `globe-hemisphere-west` | `globe` |  |
| Embarque marítimo | `boat` | `sailboat` |  |
| Carga aérea | `airplane-tilt` | `airplane` |  |
| Contenedor | `shipping-container` | `package` |  |
| Puerto | `anchor` | — |  |
| Aduana / despacho | `barricade` | `stamp` | stamp es aprobación. |

### Documentos (8)

| Concepto | Ícono | No usar | Nota |
|---|---|---|---|
| Documento | `file` | `file-text` |  |
| Adjunto | `paperclip` | — |  |
| Carpeta | `folder-simple` | `folder` |  |
| PDF | `file-pdf` | — |  |
| Planilla | `file-xls` | `microsoft-excel-logo`, `file-csv` |  |
| Foto | `image` | `camera` | camera es la acción de sacar la foto. |
| Sacar foto | `camera` | — |  |
| Código QR | `qr-code` | `barcode` |  |

### Estados y alertas (15)

| Concepto | Ícono | Color | No usar | Nota |
|---|---|---|---|---|
| Hecho / cobrado | `check-circle` | verde | `check` |  |
| Aprobación | `stamp` | ámbar | `seal-check` |  |
| Pendiente | `circle-dashed` | ámbar | `clock` |  |
| En curso | `circle-half` | azul | `spinner` |  |
| Por vencer | `hourglass-high` | ámbar | `hourglass` |  |
| Vencido | `warning-circle` | rojo | `calendar-x` |  |
| Alerta / riesgo | `warning` | rojo | `warning-octagon` |  |
| Falló | `x-circle` | rojo | `x` |  |
| Sin conexión | `wifi-slash` | rojo | `cloud-slash` |  |
| Informativo | `info` | azul | `question` |  |
| Borrador | `file-dashed` | gris | `pencil-simple` |  |
| Anulado | `prohibit` | gris | `trash` |  |
| Bloqueado | `lock` | gris | `lock-key` |  |
| Variación que sube | `trend-up` | verde | `arrow-up` | Verde o rojo según convenga al negocio, no según el signo. |
| Variación que baja | `trend-down` | rojo | `arrow-down` | Si baja la mora, va en verde. |


## 8. Pares que se confunden

- `check-square` es la sección Tareas; `check-circle` es "hecho".
- `tray` es la bandeja (junta todo); `envelope-simple` es solo correo.
- `funnel-simple` filtra; `kanban` es el pipeline. Nunca un embudo para el pipeline.
- `phone-call` es un seguimiento que hay que hacer; `phone` es la llamada que ya pasó.
- `users-three` es reunión; `users` son los usuarios del sistema; `users-four` es el equipo de trabajo.
- `engine` es el equipo-máquina; las personas nunca llevan engine ni wrench.
- `cube` es producto del catálogo; `package` es stock físico; `shipping-container` es el contenedor de la importación.
- `file` es documento genérico; `file-text` es propuesta; `clipboard-text` es remito; `notepad` es parte de trabajo; `note` es nota.
- `tag` es tarifa; `tag-simple` es etiqueta.
- `stamp` es aprobación; `seal-check` es ganado; `barricade` es aduana.
- `export` arma un archivo con lo que ves; `download-simple` baja uno que ya existe.
- `hand-arrow-down` es entrega (baja al cliente); `hand-arrow-up` es retiro (vuelve a nosotros).

## 9. Concepto nuevo

1. Buscalo en este mapa. Si ya hay uno parecido, usá ese.
2. Si no, elegí uno que no esté usado y verificá que exista:
   ```bash
   curl -s https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css | grep -c '\.ph-NOMBRE:before'
   ```
3. Sumalo a la tabla de su familia y al arreglo `MAPA` de `ejemplos/iconos.html`, con su "No usar".
4. Un ícono no puede tener dos conceptos. Si hace falta reasignar uno, cambialo en todos los sistemas a la vez.
