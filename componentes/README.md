# Piezas React de diseno-sistemas

React 19 + TypeScript (strict) + Tailwind v4 + Phosphor 2.1.x. Compilan con `tsc --noEmit` en strict y `jsx: react-jsx`.

| Carpeta | Qué trae |
|---|---|
| `base/` | Boton, Segmentado, Pastilla, Etiqueta, Campo, Interruptor, Avatar, PilaAvatares, CuadroIcono, Menu, Tooltip, utilidades (`cx`, `colorDe`, `iniciales`, `TONOS`, `FOCO`) |
| `datos/` | Kpi, KpiProtagonista, Variacion, Rayitas, Bloques, Anillo, Curva, Cuenta, BarrasApiladas y `formato.ts` (números y fechas es-AR) |
| `estructura/` | MarcoApp, BarraLateral, Cabecera, Seccion, TarjetaEntidad, FilaAviso, Tabla, HojaLateral, Vacio, Esqueleto, ErrorEnLugar, Toast |

## 1. Dependencias

```bash
npm i @phosphor-icons/react@2.1.10
# ya tenés react@19, react-dom@19, tailwindcss@4 y, en TS, @types/react@19
```

## 2. Copiar

Las tres carpetas van juntas (las de `estructura/` importan entre sí; `base/` y `datos/` no dependen de nada más):

```bash
DS=~/.claude/skills/diseno-sistemas
mkdir -p src/components/ds
cp -R $DS/componentes/base $DS/componentes/datos $DS/componentes/estructura src/components/ds/
cp $DS/tokens.css src/app/tokens.css
```

Si el proyecto no usa `src/`, cambiá las rutas. Si `marcas.local.md` define acento o tinte para ese sistema, ajustá `tokens.css` después de copiarlo.

## 3. CSS

En la hoja global de Tailwind (por ejemplo `app/globals.css`):

```css
@import "tailwindcss";
@import "./tokens.css";

:root { --acento: #4f46e5; } /* el de la marca; sin esto queda grafito */
```

- Tailwind v4 escanea solo lo que no está en `.gitignore`. Si copiaste las piezas fuera del proyecto o en una carpeta ignorada, sumá `@source "../ruta/a/ds";`.
- Fuentes: Outfit (display), Plus Jakarta Sans (interfaz) y JetBrains Mono. Con `next/font`, cargalas y apuntá `--font-display`, `--font-sans` y `--font-mono` a sus variables.
- Oscuro: `data-tema="oscuro"` en `<html>`. Nunca `dark:`.

## 4. Importar

Cada carpeta tiene su `index.ts`. Importá desde la carpeta, nunca juntes las tres en un `export *`: `estructura/` repite a propósito `Pastilla`, `Bloques`, `Curva`, `PALETA_ENTIDAD`, `Tono`, `GrupoMenu` e `ItemMenu` para poder usarse sola, y los nombres chocan.

```tsx
import { Boton, Pastilla, Segmentado } from '@/components/ds/base'
import { Kpi, Cuenta, Rayitas, formatear } from '@/components/ds/datos'
import { MarcoApp, Contenido, Tabla, Vacio, ToastProvider } from '@/components/ds/estructura'
import { PlusIcon } from '@phosphor-icons/react'

<Boton variante="principal" icono={PlusIcon}>Nueva factura</Boton>
<Kpi rotulo="Cobrado en el mes" unidad="$" valor={<Cuenta hasta={41600} />} contexto="69 % de la meta" dibujo={<Rayitas pct={69} />} />
```

- **Server Components:** Kpi, KpiProtagonista, Variacion, Rayitas, Bloques, Anillo, Curva, Pastilla, CuadroIcono, Seccion y Vacio no llevan `'use client'`. El resto sí. A un Server Component pasale formatos por nombre (`formato="montoCorto"`), no funciones.
- **Enlaces:** `MarcoApp`, `Kpi` y `KpiProtagonista` aceptan `enlace` (por ejemplo `Link` de `next/link`); el marco lo pasa a la barra lateral, la cabecera y las tarjetas de entidad. Por defecto usan `<a>`.
- **Toasts:** envolvé la app con `<ToastProvider>` y usá `useToast()`.

## 5. Probar que compilan

```bash
mkdir -p /tmp/comp-check && cd /tmp/comp-check
npm init -y >/dev/null && npm i react@19 react-dom@19 @types/react@19 @types/react-dom@19 typescript@5 @phosphor-icons/react@2.1.10
mkdir -p src && cp -R ~/.claude/skills/diseno-sistemas/componentes/{base,datos,estructura} src/
# tsconfig: strict, jsx react-jsx, moduleResolution Bundler, lib DOM, noUnusedLocals, noUnusedParameters
npx tsc --noEmit -p .
```

Con `noUncheckedIndexedAccess` prendido salen avisos de índices (Curva, BarrasApiladas, utilidades, Menu, Segmentado): si el proyecto lo usa, excluí la carpeta de esa regla o agregá las guardas.

## 6. Reglas que ya cumplen (SKILL.md v2)

- Colores, radios, sombras y curva solo de `tokens.css` (`text-texto-3`, `rounded-tarjeta`, `shadow-min`, `ease-(--ease)`). Los espacios usan la escala de Tailwind que coincide con `--espacio-*` (0.5 = 2, 1 = 4, 1.5 = 6, 2 = 8, 3 = 12, 4 = 16, 5 = 20, 6 = 24, 7 = 28, 10 = 40); 3.5 (14) solo en el gap entre tarjetas.
- Letra en la escala 11 / 12 / 13 / 14 / 16 / 20 / 24 / 32 / 40; 11 solo en el rótulo de grupo del menú. Pesos 300–500, sin 600 ni 700.
- Excepciones a propósito: iniciales de Avatar `xs` y `sm` (8,5 y 10 px; el nombre va en `aria-label`) y radios de 2–5 px en piezas de dibujo, casillas de 16 px y `kbd`.
