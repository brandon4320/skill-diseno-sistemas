/**
 * ExitoGrande: el cierre de un flujo largo (emitir factura, terminar un alta de varios pasos,
 * conectar una integración). Ilustración de éxito con resorte sobre clima verde, título con
 * participio + código, una frase con monto y consecuencia, el resumen de lo que pasó y dos salidas:
 * ver lo creado o hacer otro. Nada de "exitosamente" ni confeti.
 *
 * Para una acción de fila, no uses esto: fila en verde tenue + pastilla "✓ Aprobado" + toast con
 * Deshacer (estructura/Toast).
 *
 *   <ExitoGrande titulo="Factura FAC-01122 emitida"
 *     texto="$ 1.284.500 a Orbe Retail · vence 18 dic. El PDF ya le llegó a pagos@orberetail.com.ar."
 *     resumen={[{ texto: 'CAE 76124890331275', dato: '18 nov 15:42' }, { texto: 'Quedó en Cobranzas', dato: 'por vencer' }]}
 *     acciones={<><Boton>Ver factura</Boton><Boton variante="principal">Emitir otra</Boton></>} />
 */
import type { ReactNode, Ref } from 'react'
import { CheckCircleIcon, type Icon } from '@phosphor-icons/react'
import { Ilustracion, CLIMA } from './Ilustracion'

const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

export type FilaResumen = { texto: ReactNode; dato?: ReactNode; icono?: Icon }

export type ExitoGrandeProps = {
  /** Participio + código: "Factura FAC-01122 emitida". */
  titulo: string
  /** Monto, a quién y la consecuencia. */
  texto?: ReactNode
  resumen?: FilaResumen[]
  acciones?: ReactNode
  /** Para mover el foco al título al aparecer (tabIndex -1 ya puesto). */
  tituloRef?: Ref<HTMLHeadingElement>
  className?: string
}

export function ExitoGrande({ titulo, texto, resumen, acciones, tituloRef, className }: ExitoGrandeProps) {
  return (
    <div role="status" className={cn('flex flex-col items-center overflow-hidden rounded-tarjeta border border-borde bg-superficie px-6 py-8 text-center', CLIMA.bueno, className)}>
      <Ilustracion nombre="exito" tamano="pagina" aparece />
      <h4 ref={tituloRef} tabIndex={-1} className="mt-2 font-display text-2xl font-medium tracking-[-.02em] text-tinta outline-none">
        {titulo}
      </h4>
      {texto && <p className="mt-1 max-w-[40ch] text-[13px] leading-normal text-texto-2">{texto}</p>}
      {resumen && resumen.length > 0 && (
        <ul className="mt-5 w-full max-w-[360px] divide-y divide-divisor rounded-control border border-borde bg-superficie text-left">
          {resumen.map((f, i) => {
            const I = f.icono ?? CheckCircleIcon
            return (
              <li key={i} className="flex min-h-10 items-center gap-2 px-3 text-[13px] motion-safe:animate-[ds-entra_320ms_cubic-bezier(.23,1,.32,1)_both]" style={{ animationDelay: `${140 + i * 40}ms` }}>
                <I size={16} className="shrink-0 text-verde-texto" aria-hidden />
                <span className="min-w-0 flex-1">{f.texto}</span>
                {f.dato && <span className="text-xs text-texto-3 tabular-nums">{f.dato}</span>}
              </li>
            )
          })}
        </ul>
      )}
      {acciones && <div className="mt-6 flex flex-wrap items-center justify-center gap-2">{acciones}</div>}
      <style href="ds-entra" precedence="ds">{'@keyframes ds-entra{from{opacity:0;transform:translateY(6px)}}'}</style>
    </div>
  )
}
