// Utilidades compartidas por las piezas base. Sin dependencias.

/** Une clases y descarta las vacías: cx('a', cond && 'b'). */
export function cx(...clases: Array<string | false | null | undefined>): string {
  return clases.filter(Boolean).join(' ')
}

/** Tonos de estado (SKILL.md §3): fondo al ~10 % + texto saturado. Solo para estados. */
export type Tono = 'verde' | 'ambar' | 'rojo' | 'azul' | 'gris'

// Clases literales para que Tailwind las encuentre al escanear.
export const TONOS: Record<Tono, { fondo: string; texto: string; punto: string }> = {
  verde: { fondo: 'bg-verde-fondo', texto: 'text-verde-texto', punto: 'bg-verde-texto' },
  ambar: { fondo: 'bg-ambar-fondo', texto: 'text-ambar-texto', punto: 'bg-ambar-texto' },
  rojo: { fondo: 'bg-rojo-fondo', texto: 'text-rojo-texto', punto: 'bg-rojo-texto' },
  azul: { fondo: 'bg-azul-fondo', texto: 'text-azul-texto', punto: 'bg-azul-texto' },
  gris: { fondo: 'bg-gris-fondo', texto: 'text-gris-texto', punto: 'bg-gris-texto' },
}

/** Paleta de entidades: cada cliente, proyecto o persona con su color fijo. */
export const PALETA_ENTIDAD = ['#3b6fe0', '#d6336c', '#c8692b', '#25a866', '#7c5ce0', '#0e9aa7'] as const

/** Color fijo por id: el mismo cliente siempre sale con el mismo color. */
export function colorDe(id: string): string {
  const h = [...id].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)
  return PALETA_ENTIDAD[h % PALETA_ENTIDAD.length]
}

/** "Lucía Benítez" → "LB"; "Orbe" → "OR". */
export function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return '·'
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}

/** Anillo de foco común a todo lo clickeable (SKILL.md §6d). */
export const FOCO =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento/45'
