import { CheckCircle, CircleNotch, CloudSlash } from '@phosphor-icons/react/dist/ssr'
import { cx } from '../base/utilidades'

/**
 * Foto con sello (SKILL.md §5 Celular, campo): cada foto de campo lleva fecha, hora y lugar
 * impresos en la imagen (acá se muestra el sello; imprimirlo en el archivo es tarea del que
 * captura). En la bandeja, cada miniatura dice si subió, está subiendo o espera señal.
 */
export type EstadoFoto = 'subida' | 'subiendo' | 'espera'

export type FotoCampo = { id: string; src: string; alt: string; sello: string; estado: EstadoFoto }

const ESTADO: Record<EstadoFoto, { texto: string; clase: string }> = {
  subida: { texto: 'Subida', clase: 'bg-verde-fondo text-verde-texto' },
  subiendo: { texto: 'Subiendo', clase: 'bg-azul-fondo text-azul-texto' },
  espera: { texto: 'Espera señal', clase: 'bg-ambar-fondo text-ambar-texto' },
}

export function FotoConSello({ foto, grande }: { foto: FotoCampo; grande?: boolean }) {
  const e = ESTADO[foto.estado]
  return (
    <figure className={cx('relative overflow-hidden rounded-control bg-suave', grande ? 'aspect-[4/3]' : 'aspect-square')}>
      <img src={foto.src} alt={foto.alt} className="size-full object-cover" loading="lazy" />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pt-6 pb-1.5 font-mono text-[10px] leading-tight text-white">
        {foto.sello}
      </figcaption>
      <span className={cx('absolute top-1.5 left-1.5 flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-medium', e.clase)}>
        {foto.estado === 'subida' && <CheckCircle size={12} weight="fill" aria-hidden />}
        {foto.estado === 'subiendo' && <CircleNotch size={12} aria-hidden className="animate-spin motion-reduce:animate-none" />}
        {foto.estado === 'espera' && <CloudSlash size={12} aria-hidden />}
        {e.texto}
      </span>
    </figure>
  )
}

export function BandejaFotos({ fotos }: { fotos: readonly FotoCampo[] }) {
  return (
    <ul className="grid grid-cols-3 gap-2 px-4" aria-label="Fotos">
      {fotos.map(f => <li key={f.id}><FotoConSello foto={f} /></li>)}
    </ul>
  )
}
