# Recetas en React + Tailwind v4

Usan los tokens de `tokens.css`: `bg-superficie`, `text-tinta`, `border-borde`, `text-texto-2`, `bg-verde-fondo`, `rounded-tarjeta` y demás. Se ven todas juntas en `componentes.html`.

**Íconos:** `npm i @phosphor-icons/react`. Usá el peso `regular` en general y `fill` para lo activo o lo que va dentro de un cuadro de color.

**Fuentes:** Geist (interfaz, títulos y cifras) y Geist Mono. Cargalas con `next/font/google` o `@fontsource-variable/geist`.

Con `--font-display` en el `@theme` de `tokens.css`, Tailwind v4 crea la clase `font-display` solo.

---

## Formato y color por entidad (`lib/formato.ts`)

```ts
const nf = (o: Intl.NumberFormatOptions = {}) => new Intl.NumberFormat('es-AR', o)

export const numero = (n: number) => nf().format(n)                         // 1.234.567
export const monto = (n: number, moneda: 'ARS' | 'USD' = 'ARS') =>
  `${moneda === 'USD' ? 'US$' : '$'} ${nf({ maximumFractionDigits: 0 }).format(n)}`
export const montoCorto = (n: number) =>                                       // tarjetas: "184,2 mil", "1,2 M"
  n >= 1e6 ? `${nf({ maximumFractionDigits: 1 }).format(n / 1e6)} M`
  : n >= 1e4 ? `${nf({ maximumFractionDigits: 1 }).format(n / 1e3)} mil` : numero(n)
export const delta = (p: number) => `${p > 0 ? '+' : p < 0 ? '−' : ''}${nf({ maximumFractionDigits: 1 }).format(Math.abs(p))} %`
export const vacio = (v: unknown) => (v == null || v === '' ? '—' : String(v))

// Color fijo por entidad: el mismo cliente o proyecto siempre con el mismo color.
const PALETA = ['#3b6fe0', '#d6336c', '#c8692b', '#25a866', '#7c5ce0', '#0e9aa7']
export const colorDe = (id: string) => PALETA[[...id].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7) % PALETA.length]
```

## Botón

```tsx
const base = 'inline-flex items-center gap-2 h-[38px] px-3.5 rounded-xl text-[13px] font-semibold transition-[transform,box-shadow,background] duration-150 ease-[cubic-bezier(.23,1,.32,1)] active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento/45'
export const btn = {
  principal: `${base} bg-tinta text-white shadow-[inset_0_1px_0_rgb(255_255_255/.12),0_4px_10px_-2px_rgb(22_24_29/.35)]`,
  secundario: `${base} bg-superficie border border-borde shadow-[0_1px_2px_rgb(22_24_29/.05)] hover:bg-hover`,
  chico: 'inline-flex items-center gap-1.5 h-7 px-2.5 rounded-[9px] text-xs font-semibold bg-superficie border border-borde shadow-[0_1px_2px_rgb(22_24_29/.05)] active:scale-[.97]',
  icono: `${base} w-[38px] px-0 justify-center bg-superficie border border-borde`,
}
// <button className={btn.principal}><Plus size={17} />Nueva oportunidad</button>
```

## Selector segmentado

```tsx
export function Segmentado<T extends string>({ opciones, valor, onCambio }: { opciones: { v: T; l: string; n?: number }[]; valor: T; onCambio: (v: T) => void }) {
  return (
    <div className="inline-flex gap-0.5 rounded-xl border border-borde bg-suave p-[3px]">
      {opciones.map((o) => (
        <button key={o.v} onClick={() => onCambio(o.v)}
          className={`h-7 rounded-[9px] px-3 text-[12.5px] font-semibold ${o.v === valor ? 'bg-superficie text-tinta shadow-[0_1px_2px_rgb(22_24_29/.1),0_0_0_1px_var(--color-borde)]' : 'text-texto-2'}`}>
          {o.l}{o.n != null && <span className="ml-1 font-medium text-texto-3">{o.n}</span>}
        </button>
      ))}
    </div>
  )
}
```

## Pastilla de estado

```tsx
const TONO = {
  verde: 'bg-verde-fondo text-verde-texto', ambar: 'bg-ambar-fondo text-ambar-texto',
  rojo: 'bg-rojo-fondo text-rojo-texto', azul: 'bg-azul-fondo text-azul-texto', gris: 'bg-gris-fondo text-gris-texto',
} as const
export const Pastilla = ({ tono, children, punto = true }: { tono: keyof typeof TONO; children: React.ReactNode; punto?: boolean }) => (
  <span className={`inline-flex h-[22px] items-center gap-1.5 whitespace-nowrap rounded-[7px] px-2 text-[11.5px] font-semibold ${TONO[tono]}`}>
    {punto && <span className="size-1.5 rounded-full bg-current" />}{children}
  </span>
)
```

## KPI en bandeja (el "premium")

```tsx
export function Kpi({ icono: Icono, rotulo, valor, unidad, contexto, dibujo, pie }: {
  icono: Icon; rotulo: string; valor: React.ReactNode; unidad?: string; contexto: string; dibujo: React.ReactNode; pie: React.ReactNode
}) {
  return (
    <div className="flex flex-col rounded-[20px] border border-borde bg-suave p-1">
      <div className="flex items-center gap-2 px-2.5 pt-2 pb-2 text-[12.5px] font-semibold text-texto-2">
        <Icono size={16} className="text-texto-3" />{rotulo}<DotsThree className="ml-auto text-texto-3" />
      </div>
      <div className="flex-1 rounded-2xl border border-borde bg-superficie px-4 pt-3.5 pb-4 shadow-[0_1px_2px_rgb(22_24_29/.05)]">
        <div className="font-display text-[30px] leading-tight font-medium tracking-[-.03em] tabular-nums">
          {unidad && <span className="mr-1 text-lg font-normal text-texto-3">{unidad}</span>}{valor}
        </div>
        <div className="mt-0.5 text-xs text-texto-3">{contexto}</div>
        {dibujo}
      </div>
      <div className="flex items-center justify-between px-2.5 pt-2 pb-1.5 text-xs font-medium text-texto-2">{pie}</div>
    </div>
  )
}
```

## Dibujos: rayitas, bloques y curva

```tsx
export const Rayitas = ({ pct, color = '#25a866', n = 34 }: { pct: number; color?: string; n?: number }) => (
  <div className="mt-3 flex h-4 gap-[2.5px]">
    {Array.from({ length: n }, (_, i) => <i key={i} className="flex-1 rounded-[2px] bg-suave" style={i < Math.round((n * pct) / 100) ? { background: color } : undefined} />)}
  </div>
)

export const Bloques = ({ hechos, total, color }: { hechos: number; total: number; color: string }) => (
  <div className="flex flex-1 gap-[3px]">
    {Array.from({ length: total }, (_, i) => <i key={i} className="h-[7px] flex-1 rounded-[3px] bg-suave" style={i < hechos ? { background: color } : undefined} />)}
  </div>
)

export function Curva({ valores, color, alto = 42 }: { valores: number[]; color: string; alto?: number }) {
  const w = 200, mx = Math.max(...valores), mn = Math.min(...valores)
  const p = valores.map((v, i) => [(i * w) / (valores.length - 1), alto - 4 - ((v - mn) / (mx - mn || 1)) * (alto - 10)])
  const d = p.reduce((acc, [x, y], i) => {
    if (!i) return `M${x},${y}`
    const [a, b] = [p[i - 2] ?? p[i - 1], p[i + 1] ?? p[i]]
    const [px, py] = p[i - 1]
    return `${acc} C${px + (x - a[0]) / 6},${py + (y - a[1]) / 6} ${x - (b[0] - px) / 6},${y - (b[1] - py) / 6} ${x},${y}`
  }, '')
  const id = useId()
  return (
    <svg viewBox={`0 0 ${w} ${alto}`} preserveAspectRatio="none" className="mt-2 block w-full" style={{ height: alto }}>
      <defs><linearGradient id={id} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".22" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <path d={`${d} L${w},${alto} L0,${alto}Z`} fill={`url(#${id})`} />
      <path d={d} fill="none" stroke={color} strokeWidth={1.8} vectorEffect="non-scaling-stroke" className="animate-[dibujar_1.1s_cubic-bezier(.23,1,.32,1)]" style={{ strokeDasharray: 1000 }} />
    </svg>
  )
}
// CSS: @keyframes dibujar { from { stroke-dashoffset: 1000 } to { stroke-dashoffset: 0 } }
```

## Número que cuenta al cargar

```tsx
export function Cuenta({ hasta, formato = numero }: { hasta: number; formato?: (n: number) => string }) {
  const [v, setV] = useState(hasta)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0; const t0 = performance.now()
    const paso = (t: number) => { const p = Math.min(1, (t - t0) / 900); setV(Math.round(hasta * (1 - (1 - p) ** 3))); if (p < 1) raf = requestAnimationFrame(paso) }
    raf = requestAnimationFrame(paso); return () => cancelAnimationFrame(raf)
  }, [hasta])
  return <>{formato(v)}</>
}
```

## Tarjeta protagonista

```tsx
<div className="relative min-h-[196px] overflow-hidden rounded-[20px] p-5 text-white shadow-[0_18px_36px_-18px_color-mix(in_oklch,var(--color-acento)_60%,transparent),inset_0_1px_0_rgb(255_255_255/.18)]"
  style={{ background: 'radial-gradient(120% 140% at 100% 0%, color-mix(in oklch, var(--color-acento) 60%, white) 0%, transparent 55%), linear-gradient(150deg, var(--color-acento), color-mix(in oklch, var(--color-acento) 80%, white))' }}>
  <span className="grid size-[38px] place-items-center rounded-xl border border-white/20 bg-white/15"><Wallet size={19} /></span>
  <span className="absolute top-5 right-5 rounded-full border border-white/20 bg-white/15 px-2 py-0.5 text-[11.5px] font-semibold">↗ +12,4 %</span>
  <small className="mt-3.5 block font-medium opacity-80">Pipeline abierto</small>
  <div className="font-display text-[34px] font-medium tracking-[-.03em] tabular-nums"><span className="mr-1 text-xl font-normal opacity-60">US$</span><Cuenta hasta={184200} /></div>
  <Curva valores={serie} color="#fff" alto={92} /> {/* absolute bottom-0 inset-x-0 */}
</div>
```

## Tarjeta de entidad

```tsx
export function TarjetaEntidad({ e }: { e: Proyecto }) {
  const c = colorDe(e.id)
  return (
    <article className="overflow-hidden rounded-[20px] border border-borde bg-superficie transition duration-300 ease-[cubic-bezier(.23,1,.32,1)] hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-18px_rgb(22_24_29/.3)]">
      <div className="px-[18px] pt-4 pb-3.5">
        <div className="flex gap-1.5"><Pastilla tono={e.prioridad.tono} punto={false}>{e.prioridad.texto}</Pastilla>
          <span className="ml-auto flex gap-1">{e.etiquetas.map((t) => <span key={t} className="inline-flex h-[22px] items-center rounded-[7px] border border-borde px-2 text-[11.5px] font-medium text-texto-2">{t}</span>)}</span></div>
        <h3 className="font-display mt-3.5 flex items-center gap-2 text-xl font-medium tracking-[-.02em]">
          <span className="grid size-[22px] place-items-center rounded-[7px] text-white" style={{ background: c }}><Storefront weight="fill" size={12} /></span>
          {e.nombre}<ArrowUpRight size={16} className="ml-auto text-texto-3" /></h3>
        <p className="mt-1.5 line-clamp-2 text-[12.5px] text-texto-2">{e.descripcion}</p>
        <div className="mt-4 flex items-center gap-2.5"><Bloques hechos={e.hechos} total={e.total} color={c} /><b className="font-display text-[13px] font-medium">{Math.round((e.hechos / e.total) * 100)} %</b></div>
        <div className="mt-2 text-xs text-texto-3 tabular-nums">{e.hechos} de {e.total} hechas · Vence {e.vence}</div>
      </div>
      <div className="border-y border-divisor px-[18px] pt-2.5 pb-2"><Curva valores={e.actividad} color={c} alto={56} /></div>
      {/* Próximos pasos: filas de 34 px con check redondo; "Vencido" en text-rojo-texto font-medium; al final "+ Agregar paso" en texto-3 */}
    </article>
  )
}
```

## Fila de aviso con acción y éxito en el lugar

```tsx
<div className={`relative flex gap-3 px-[18px] py-3 transition-colors duration-300 ${hecho ? 'bg-verde-fondo/60' : 'hover:bg-hover'}`}>
  {!leido && <span className="absolute top-6 left-[7px] size-1.5 rounded-full bg-acento" />}
  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-ambar-fondo text-ambar-texto"><FileText size={17} /></span>
  <div className="min-w-0 flex-1">
    <div className="text-[13.5px] font-semibold">Lucía pide aprobar un descuento <span className="font-normal text-texto-2">· PR-0241</span></div>
    <div className="text-xs text-texto-3 tabular-nums">Propuestas · 12 % sobre US$ 18.400 · hace 8 min</div>
    <div className="mt-2 flex gap-1.5">
      {hecho ? <Pastilla tono="verde" punto={false}><Check size={12} />Aprobado</Pastilla>
             : <button className={btn.chico} onClick={() => { aprobar(); toast('Descuento aprobado · PR-0241', { accion: { texto: 'Deshacer', hacer: deshacer } }) }}>Aprobar</button>}
      <button className={btn.chico}>Abrir</button>
    </div>
  </div>
  <DotsThree className="ml-auto text-texto-3" />
</div>
```

## Tabla

```tsx
<table className="w-full border-collapse">
  <thead><tr className="[&>th]:bg-suave [&>th]:px-3 [&>th]:py-2 [&>th]:text-left [&>th]:text-xs [&>th]:font-semibold [&>th]:text-texto-3 [&>th:first-child]:rounded-l-[10px] [&>th:last-child]:rounded-r-[10px]">
    <th>Comprobante</th><th>Cliente</th><th>Estado</th><th>Vence</th><th className="!text-right">Monto</th></tr></thead>
  <tbody className="[&_td]:h-[46px] [&_td]:border-t [&_td]:border-divisor [&_td]:px-3 [&_tr:first-child_td]:border-0">
    <tr><td className="font-mono text-[12.5px] text-texto-2">FAC-01101</td><td>Orbe Retail</td><td><Pastilla tono="verde">Cobrada</Pastilla></td>
      <td className="tabular-nums">12 nov</td><td className="text-right tabular-nums"><span className="text-texto-3">US$</span> 18.400</td></tr>
  </tbody>
</table>
```

## Vacío y cargando

```tsx
export const Esqueleto = ({ className = '' }) => <div className={`animate-pulse rounded-md bg-suave ${className}`} />

export const Vacio = ({ titulo, texto, accion }: { titulo: string; texto: string; accion?: React.ReactNode }) => (
  <div className="flex flex-col items-center gap-2 px-6 py-7 text-center">
    {/* ilustración de línea chica, del tinte del acento */}
    <h4 className="font-display text-[17px] font-medium">{titulo}</h4>
    <p className="max-w-60 text-[12.5px] text-texto-2">{texto}</p>
    {accion}
  </div>
)
```
