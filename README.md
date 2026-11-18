# Skill `diseno-sistemas`

Lenguaje visual y de UX para sistemas de gestión (CRM, ERP, tableros internos), para usar con **Claude Code**. Sale del análisis de 14 interfaces de referencia, una por foco: estructura, tipografía, color, superficies, navegación, KPIs, gráficos, listas, calendario, acciones, formularios, celular, estados, contenido y homogeneidad.

## Instalar

```bash
git clone <este-repo> ~/.claude/skills/diseno-sistemas
```

Reiniciá Claude Code. La skill se activa sola cuando le pedís diseñar o rediseñar una pantalla, o la llamás con `/diseno-sistemas`.

## Qué trae

| Archivo | Para qué |
|---|---|
| `SKILL.md` | Las reglas: marco, vida, tipografía, color, radios, piezas (KPI, listas, acciones, formularios, calendario, celular, gráficos, oscuro), antipatrones y la lista para revisar antes de entregar. |
| `tokens.css` | Variables de Tailwind v4 listas para pegar (colores, letras, radios, sombras, modo oscuro). |
| `ejemplos/` | `tablero-crm.html` (pantalla completa), `componentes.html` (galería de piezas en claro, oscuro y celular) y `recetas-tailwind.md` (piezas en React + Tailwind v4). |
| `referencias/` | Las 14 capturas de referencia. Son de sus autores y van solo como material de estudio, no para copiar. |
| `analisis/` | El análisis detallado de cada tema, con valores estimados. |

## Ajustarla a tu marca

Cambiá `--acento` y el tinte de los neutros en `tokens.css` (hay una receta en OKLCH en el comentario de arriba). El resto vale igual para cualquier marca.
