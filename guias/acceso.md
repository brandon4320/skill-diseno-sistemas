# Pantallas de acceso

Cómo armar entrar, crear cuenta por invitación, recuperar la contraseña, entrar con código, elegir empresa y volver de una sesión vencida en un sistema de gestión. Ejemplos vivos: `ejemplos/pantallas/login-variantes.html` (5 diseños × 7 estados, con `?diseno=` y `?estado=` en la URL) y `ejemplos/pantallas/login.html` (dos mitades con cuenta recordada, recuperar y "te mandamos un correo"). Origen: análisis 66 y 67 en `analisis/18-tweets-66-69.md`.

**La pregunta de la pantalla:** "¿Cómo entro, rápido y sin trabarme?". Todo lo que no ayuda a entrar sobra: nada de slogans, beneficios genéricos ni "Bienvenido de nuevo a la plataforma líder…".

---

## 1. Anatomía fija

Una **columna de formulario de 360–440 px** (384 en los ejemplos) que nunca cambia de orden, sea cual sea el diseño:

1. **Arriba del todo:** logo de 32 + nombre del sistema (14/500) con la empresa o el módulo debajo (12 `texto-3`). A la derecha, un solo enlace secundario: "Pedir acceso" (sistema interno) o "Ya tengo cuenta" (en la invitación).
2. **Título** 32/500 (36–44 si la columna está sola y centrada), `text-wrap: balance`. Un verbo o una pregunta: "Entrar", "Revisá tu correo", "¿Dónde entrás?", "Tu sesión venció".
3. **Bajada** solo si trae un dato: el correo al que se mandó algo, el vencimiento, cuántas empresas hay. "Entrar" no lleva bajada.
4. **Aviso del servidor** (si lo hay), entre el título y el primer campo.
5. **Campos**, uno abajo del otro, rótulo arriba, 20 entre campos (24 antes del primero).
6. **Casilla** "Recordarme en este equipo" (16 abajo del último campo).
7. **Botón principal** relleno a todo el ancho, 24 abajo. Uno solo.
8. **Separador "o"** (líneas de 1 px `borde`, 20 arriba y abajo) y **proveedores lado a lado**, mismo ancho.
9. **Salida alternativa** en enlace gris centrado: "Entrar con un código por correo" o "Usar contraseña".
10. **Pie** de 12 px: © año y empresa · Privacidad · Ayuda, y a la derecha el estado del sistema con punto y palabra ("● Todo en línea"). Si hay un incidente, "● Demoras en facturación" en ámbar, con enlace al detalle.

Medidas: campos y principal de 44 en escritorio y **52 en celular**, radio 12; letra de los campos 14 en escritorio y **16 en celular** (si no, iOS hace zoom). Ícono de 16 dentro del campo, en `texto-3`, que pasa al acento con el foco.

---

## 2. Diseños: cuál elegir

Lo que cambia entre diseños es **solo el panel de al lado**. El formulario es el mismo.

| Diseño | Panel | Cuándo | Cuidado |
|---|---|---|---|
| **Marca** (66-1) | Oscuro de marca (#111113 en claro y en oscuro), signo grande de la marca al centro, rayas de 1 px al 6–8 % en cruz y en diagonal, estado del sistema y versión abajo | **Por defecto para un sistema interno B2B.** Sobrio, carga rápido, no envejece | El signo se dibuja una vez (900 ms) y queda quieto |
| **Imagen** (66-2) | Foto real de la operación (planta, depósito, flota, obra) con velo de abajo (transparente → negro al 78 %) y encima un dato del día en pastillas de vidrio + una frase | Cuando la empresa tiene fotos propias buenas y el sistema lo usa gente de campo | Nunca foto de stock. La foto va con vista borrosa mientras carga. Sin texto sobre la parte clara de la foto |
| **Pasos** (66-3, 66-4) | Degradé oscuro del acento con grano al 12 % y los pasos del alta apilados (52 px, radio 12): el activo blanco con número en círculo de tinta, los hechos con ✓ verde, el resto en vidrio | **Invitación al equipo** y primera vez | Máximo 3 pasos. En celular, "Paso 1 de 3" arriba del título |
| **Centrado** (66-5 sin dibujo) | Sin panel: tarjeta de 476 px centrada sobre el lienzo con puntos de 1 px cada 20 al 26 % que se desvanecen hacia el centro | Portales para clientes o proveedores, pantallas que se abren desde un correo (código, invitación, recuperar) | El logo arriba al centro; el resto del texto alineado a la izquierda |
| **Puntos** (66-5) | Dibujo de la operación tramado en puntos (5, 8 y 12 px de paso, tres densidades para dar volumen) sobre `suave`, que se revela de abajo hacia arriba en 1,1 s; abajo, una cifra del día en 20/500 y fecha en mono | Sistemas técnicos o de monitoreo; quien quiere algo propio sin foto | Los puntos salen de variables (`--punto`, `--punto-2`), así cambian en oscuro |
| **Lista de beneficios** | 3–4 filas con ícono en cuadro de 36 y una línea concreta cada una ("Facturás desde la ficha del contrato") | **Solo en productos que se venden** (registro público con prueba). En un sistema interno, no: la persona ya sabe para qué entra | Cada beneficio con un verbo y un objeto, nunca adjetivos ("rápido", "potente") |

**Recomendación para un sistema interno B2B:** *Marca* para el acceso diario, *Pasos* para la invitación y *Centrado* para todo lo que llega desde un correo (código, recuperar, invitación abierta en el celular). En celular, todos quedan en solo formulario.

**Panel visual, reglas:**
- Muestra la marca o la operación propia con un dato real del día ("142 módulos en obra", "18 contratos por renovar"). Nunca un slogan, una cita de cliente inventada ni una foto genérica.
- **Sin datos sensibles antes de entrar:** cantidades y estados generales sí; montos, nombres de clientes y saldos, no. Si hay duda, solo la marca.
- Nada de movimiento en bucle (el punto de "en línea" puede latir; nada más).
- Se oculta por debajo de 900 px.

---

## 3. Estados

Cada estado vive en el mismo lugar del formulario; nunca un modal ni una página de error aparte.

### 3.1 Entrar
- Correo (`type="email"`, `autocomplete="username"`, `inputmode="email"`, `autocapitalize="off"`, `spellcheck="false"`) y contraseña (`autocomplete="current-password"`).
- "¿La olvidaste?" a la derecha del rótulo de la contraseña, en el acento. Cuando las mayúsculas están activadas, ese lugar lo toma la pastilla ámbar "Mayúsculas activadas".
- Ojo para mostrar la contraseña: botón de 36 (44 en celular) con `aria-pressed` y `aria-label` que cambia ("Mostrar contraseña" / "Ocultar contraseña"), sin perder la posición del cursor.
- Foco automático en el correo **solo en escritorio**; en celular, no (abre el teclado y tapa la mitad).
- Validación: el correo se revisa al salir del campo si tiene texto; los vacíos se marcan al intentar entrar, y el foco baja al primero que falla.

### 3.2 Cargando
- El principal fija su ancho, pasa a gerundio ("Entrando…") con giro de 16 y `aria-busy`. Los campos siguen editables.
- Si tarda más de 4 s, abajo del botón: "Está tardando más de lo normal" en `texto-3`.

### 3.3 Error del servidor
- **Aviso en el lugar** entre el título y los campos: fondo `rojo-fondo`, borde rojo al 22 %, radio 16, cuadro de 32 con el ícono, título 14/500 con el dato ("La contraseña no coincide con ana.ruiz@orbe.com.ar"), una línea con lo que queda ("Te quedan 2 intentos antes de una pausa de 5 minutos.") y la salida como enlace ("Recuperar contraseña →").
- El campo culpable con borde rojo; **lo escrito se conserva** (la contraseña queda seleccionada para reescribirla).
- Sin red: "No pudimos conectarnos · Revisá tu conexión. Lo que escribiste sigue acá." + Reintentar.
- Si el correo no existe, se dice lo mismo que si la contraseña está mal (no se revela quién tiene cuenta), salvo en sistemas internos donde la política diga lo contrario.

### 3.4 Bloqueo por intentos
- Aviso ámbar (no rojo: no es un error, es una espera): "Pausamos los intentos 5 minutos" + causa ("Hubo 5 intentos fallidos desde este equipo") + **la salida inmediata** ("Podés entrar ya con un código por correo" → "Mandarme un código").
- El principal muestra la cuenta regresiva en vez de apagarse sin motivo: "⌛ Probá de nuevo en 4:59" (`aria-disabled`, cifras tabulares). Al llegar a 0 vuelve solo a "Entrar".

### 3.5 Código por correo (o SMS)
- Bajada con el destino y el vencimiento: "Mandamos un código de 6 cifras a **ana.ruiz@orbe.com.ar**. Vence en 10 minutos."
- **Un solo campo** `<input type="text" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]*" maxlength="6">` dibujado como **6 casillas de 48 × 56 (44 × 52 en celular) en grupos de 3 con un guion**. El teclado del celular ofrece el código y un toque lo llena (67-7). Pegar también funciona.
- La casilla siguiente lleva el foco (borde del acento + cursor que titila). Cifras de 24/500 tabulares.
- Se manda **solo al completar las 6**; el botón "Seguir" queda para quien escribe y quiere confirmar. Si faltan cifras, el botón lo dice ("Faltan 2 cifras").
- Bien: las casillas pasan a verde (borde, fondo y número) y "✓ Correo confirmado" durante ~700 ms antes de seguir. Mal: borde rojo, "Ese código no es. Revisá el último correo." y el campo queda seleccionado.
- Reenviar con cuenta regresiva: "Podés pedir otro en 0:24" → al llegar a 0, "¿No llegó? Revisá spam." + "Mandar otro". Al reenviar, toast con el destino.
- Salida: "← Usar contraseña".

### 3.6 Elegir empresa o espacio (después de entrar)
- Solo si la persona tiene acceso a 2 o más. Con una sola, entra directo.
- Título "¿Dónde entrás?" y bajada con la cantidad y la tranquilidad: "Tenés acceso a 3 empresas. Podés cambiar desde el menú sin volver a entrar."
- Bandeja `suave` radio 20 con filas-tarjeta de 64 px (radio 16): cuadro de 36 con el **color fijo de la empresa** e ícono fill blanco, nombre 14/500, y debajo el rol + algo útil ("Dirección · **4 te necesitan**" en ámbar, "Comercial · 12 cargas en curso", "Solo lectura · al día"). La última usada con chip "Última" y primera.
- Al tocar, la fila muestra el giro en el lugar del › ("abriendo"), sin pantalla intermedia.
- Casilla "Entrar siempre a la última".
- Con más de 6 empresas: buscador arriba (sin acentos) y "Recientes" primero.

### 3.7 Invitación al equipo
- Título "Sumate a {Empresa}" + quién invita con su cara y el rol: "**Lucía Gómez** te sumó como **Comercial** · hace 2 h".
- Correo **fijo** (`readonly`, fondo `suave`, sin sombra): no se elige, viene en la invitación.
- Nombre y apellido lado a lado (en celular uno abajo del otro), `autocomplete="given-name"` / `"family-name"`.
- "Creá tu contraseña" con `autocomplete="new-password"` y **requisitos debajo que se tildan en vivo** (círculo vacío → ✓ verde): 8 caracteres · un número · distinta al correo.
- Principal con el verbo y lo que sigue: "Crear cuenta y seguir". Debajo, en 12 gris, "Al seguir aceptás las condiciones de uso de {Empresa}" con enlace.
- Alternativa: "Seguir con Microsoft / Google" si la empresa usa ese proveedor (y entonces no se pide contraseña).
- Invitación vencida: el mismo diseño con aviso ámbar "Esta invitación venció el 12 nov" + "Pedirle una nueva a Lucía" (manda el aviso a quien invitó).

### 3.8 Sesión vencida
- Lo ideal: **en el lugar donde estaba**, como hoja o tarjeta sobre la pantalla atenuada, para no perder lo cargado. Si es página aparte, vuelve a la misma URL al entrar.
- Título "Tu sesión venció", bajada con la causa y **la tranquilidad con el dato**: "Pasaron 8 horas sin uso. Lo que estabas cargando quedó guardado como borrador."
- La persona ya está identificada: bandeja con avatar, nombre y correo en mono; solo se pide la contraseña (con un `input autocomplete="username"` oculto con el correo, para que el gestor de contraseñas complete).
- Principal con el destino: "Volver a Cobranzas". Salida: "No soy Ana".

### 3.9 Recuperar contraseña
- Ya resuelto en `ejemplos/pantallas/login.html`: correo precargado con lo que se escribió en Entrar, "Mandarme el enlace", y la pantalla "Te mandamos un correo" con botones a Gmail y Outlook, vencimiento y reenviar con reloj.
- Al crear la nueva: misma regla de requisitos en vivo que la invitación y entra directo al terminar (no vuelve al formulario de entrar).

---

## 4. Proveedores (Google, Microsoft)

- **Lado a lado, mismo ancho**, botón con borde de 44 (52 en celular), logo en color de 18 y el nombre corto ("Google", "Microsoft"). El `aria-label` dice la acción completa ("Entrar con Microsoft").
- Mostrar **solo los que la empresa usa**. Si la empresa entra solo con Microsoft, el botón de Microsoft pasa a ser el principal (relleno, a todo el ancho) y la contraseña queda detrás de "Entrar con correo y contraseña".
- Al tocar: giro y "Abriendo Microsoft…" en el botón, con ancho fijo. Si se cancela o falla, aviso en el lugar ("No pudimos entrar con Microsoft · Probá de nuevo o usá tu contraseña").
- Logos oficiales con sus colores; nunca un ícono de Phosphor monocromo para un proveedor.
- Cuenta del proveedor que no está invitada: "ana@gmail.com no tiene acceso a Orbe Servicios" + "Pedir acceso" + "Usar otra cuenta".

---

## 5. Accesibilidad y teclado

- `<form>` real con `<button type="submit">`: Enter manda desde cualquier campo.
- Cada campo con `<label for>`; el placeholder es un ejemplo, nunca el rótulo.
- `autocomplete` correcto en todos: `username`, `current-password`, `new-password`, `one-time-code`, `given-name`, `family-name`, `email`. Sin `autocomplete="off"` en la contraseña.
- `inputmode="email"` y `inputmode="numeric"`; `autocapitalize="off"` y `spellcheck="false"` en el correo.
- **16 px en los campos a menos de 768 px.** Toques de 44 (ojo, enlaces del pie, casilla, "¿La olvidaste?").
- Errores con `aria-invalid` y `aria-describedby`; avisos del servidor con `role="alert"`; contadores y cambios del código en `aria-live="polite"`.
- Al cambiar de estado, el foco va al título nuevo (`tabindex="-1"`) o al campo que hay que completar (el del código).
- Casillas como `<button role="checkbox" aria-checked>`.
- El código de 6 cifras es un solo `input` con `aria-label="Código de 6 cifras"`; las casillas dibujadas van con `aria-hidden`.
- `prefers-reduced-motion`: sin trazo del signo, sin revelado de puntos, sin entrada en cascada.

---

## 6. Textos (voseo)

| Lugar | Sí | No |
|---|---|---|
| Título | Entrar · Revisá tu correo · ¿Dónde entrás? · Sumate a Orbe Servicios · Tu sesión venció | Iniciar sesión · Login · ¡Bienvenido de nuevo! |
| Rótulos | Correo · Contraseña · Creá tu contraseña · Nombre · Apellido | E-mail · Password · Usuario* |
| Principal | Entrar · Seguir · Crear cuenta y seguir · Volver a Cobranzas · Mandarme el enlace | Enviar · Aceptar · Continuar → (sin decir a dónde) |
| Enlaces | ¿La olvidaste? · Entrar con un código por correo · Usar contraseña · No soy Ana · Pedir acceso | Haga clic aquí · ¿Olvidó su contraseña? |
| Error | La contraseña no coincide con {correo}. Te quedan 2 intentos antes de una pausa de 5 minutos. | Credenciales inválidas · Error 401 |
| Bloqueo | Pausamos los intentos 5 minutos · Probá de nuevo en 4:59 | Cuenta bloqueada · Demasiados intentos |
| Código | Mandamos un código de 6 cifras a {correo}. Vence en 10 minutos. · Podés pedir otro en 0:24 · Ese código no es. | Ingrese el OTP · Código inválido |
| Vencida | Pasaron 8 horas sin uso. Lo que estabas cargando quedó guardado como borrador. | Su sesión ha expirado |
| Proveedor | Google · Microsoft (y en `aria-label`: Entrar con Google) | Sign in with Google · Continuar con |

Sin signos de exclamación, sin emojis, sin "exitosamente".

---

## 7. Seguridad que se ve

- Nunca decir si un correo existe en el acceso público (mismo mensaje para correo o contraseña mal).
- El bloqueo siempre ofrece una salida que no espera (código por correo o recuperar).
- Los enlaces de correo vencen y lo dicen ("Vence en 30 minutos").
- "Recordarme en este equipo" tildado por defecto solo en sistemas internos; en portales de clientes, sin tildar.
- Nada de datos del negocio en el panel visual que no se mostrarían a alguien sin cuenta.

---

## 8. No copiar (de las referencias)

- Campos de solo línea inferior o sin borde con fondo casi igual al panel.
- Correo y contraseña lado a lado.
- Botón principal circular en un rincón, lejos del último campo.
- Asteriscos de obligatorio; placeholders en gris de 3:1 como rótulo.
- Textos que se contradicen ("¿No tenés cuenta? Registrate" en la pantalla de registro).
- Bajadas de relleno ("Sumate a una red de visionarios…").
- Todo oscuro por defecto: el acceso sigue el tema del sistema operativo o el último elegido.

---

## 9. Lista antes de entregar

- [ ] Una columna de 360–440 px, mismo orden en todos los estados, un solo relleno.
- [ ] Panel de la variante elegida con marca u operación propia, sin datos sensibles; oculto < 900 px.
- [ ] Los 7 estados: entrar, error, bloqueo, código, empresa, invitación, sesión vencida (y recuperar, si no es solo con proveedor).
- [ ] `autocomplete` e `inputmode` en cada campo; 16 px y 52 de alto en celular.
- [ ] Error y bloqueo en el lugar, con lo escrito conservado y una salida.
- [ ] Código de un toque, que se manda solo; reenviar con cuenta regresiva.
- [ ] Proveedores lado a lado con logo oficial, solo los que la empresa usa.
- [ ] Foco al título al cambiar de estado; foco automático solo en escritorio.
- [ ] Revisor ≥ 90 en `--galeria`, `--oscuro` y a 390 sin desborde.
