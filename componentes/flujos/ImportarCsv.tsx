'use client'
/**
 * ImportarCsv: tres momentos en el mismo lugar. 1) zona para soltar o elegir el archivo (y un ejemplo para probar),
 * 2) mapa columna del archivo → campo del sistema con muestra de la primera fila, 3) confirmación con lo que entra.
 * Patrón 14.10 · 12-flujos.html#importar-csv
 *
 * - Nada se carga hasta confirmar. El error de archivo queda escrito en la zona, con qué hacer.
 * - Las columnas se proponen solas (por nombre); "No importar" siempre está como opción.
 * - Si falta un campo obligatorio el botón lo dice ("Falta elegir la columna de CUIT").
 *
 *   <ImportarCsv campos={[{ clave: 'nombre', texto: 'Nombre', obligatorio: true }, …]}
 *     onImportar={(filas) => api.importar(filas)} plantilla="/plantilla-clientes.csv" />
 */
import { useId, useState, type DragEvent } from 'react'
import { ArrowRightIcon, FileCsvIcon, FileXIcon, UploadSimpleIcon } from '@phosphor-icons/react'
import { BotonEspera, cx, FOCO, plural } from './compartido'

export type CampoDestino = { clave: string; texto: string; obligatorio?: boolean; alias?: string[] }

export type ImportarCsvProps = {
  campos: CampoDestino[]
  onImportar: (filas: Record<string, string>[]) => void | Promise<void>
  /** URL de una planilla modelo. */
  plantilla?: string
  maxFilas?: number
  /** CSV de ejemplo para probar sin archivo. */
  ejemplo?: string
}

/** Lector chico de CSV (comillas dobles, coma o punto y coma). */
export function leerCsv(texto: string): string[][] {
  const sep = (texto.split('\n')[0].match(/;/g)?.length ?? 0) > (texto.split('\n')[0].match(/,/g)?.length ?? 0) ? ';' : ','
  const filas: string[][] = []
  let fila: string[] = [], celda = '', comillas = false
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i]
    if (comillas) {
      if (c === '"' && texto[i + 1] === '"') { celda += '"'; i++ } else if (c === '"') comillas = false
      else celda += c
    } else if (c === '"') comillas = true
    else if (c === sep) { fila.push(celda.trim()); celda = '' }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && texto[i + 1] === '\n') i++
      fila.push(celda.trim()); celda = ''
      if (fila.some(Boolean)) filas.push(fila)
      fila = []
    } else celda += c
  }
  fila.push(celda.trim())
  if (fila.some(Boolean)) filas.push(fila)
  return filas
}

const normal = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '')

export function ImportarCsv({ campos, onImportar, plantilla, maxFilas = 5000, ejemplo }: ImportarCsvProps) {
  const id = useId()
  const [error, setError] = useState<string | null>(null)
  const [encima, setEncima] = useState(false)
  const [datos, setDatos] = useState<{ nombre: string; cab: string[]; filas: string[][] } | null>(null)
  const [mapa, setMapa] = useState<Record<string, number | null>>({})

  const cargar = (nombre: string, texto: string) => {
    const t = leerCsv(texto)
    if (t.length < 2) return setError(`"${nombre}" no tiene filas para importar.`)
    const [cab, ...filas] = t
    if (filas.length > maxFilas) return setError(`"${nombre}" tiene ${filas.length.toLocaleString('es-AR')} filas; el máximo es ${maxFilas.toLocaleString('es-AR')}.`)
    const m: Record<string, number | null> = {}
    for (const c of campos) {
      const nombres = [c.texto, c.clave, ...(c.alias ?? [])].map(normal)
      const k = cab.findIndex((h) => nombres.includes(normal(h)))
      m[c.clave] = k >= 0 ? k : null
    }
    setError(null); setMapa(m); setDatos({ nombre, cab, filas })
  }
  const archivo = async (f: File | undefined) => {
    if (!f) return
    if (!/\.csv$/i.test(f.name) && f.type !== 'text/csv') return setError(`"${f.name}" no se puede leer. Exportala como CSV (separado por comas) y probá de nuevo.`)
    cargar(f.name, await f.text())
  }
  const soltar = (e: DragEvent) => { e.preventDefault(); setEncima(false); void archivo(e.dataTransfer.files[0]) }

  if (!datos) {
    return (
      <div className="flex flex-col gap-3">
        <div
          onDragOver={(e) => { e.preventDefault(); setEncima(true) }}
          onDragLeave={() => setEncima(false)}
          onDrop={soltar}
          className={cx('flex flex-col items-center gap-3 rounded-tarjeta border-[1.5px] border-dashed px-6 py-8 text-center transition-colors', error ? 'border-rojo-texto/50 bg-rojo-fondo' : encima ? 'border-acento bg-acento-suave' : 'border-borde-fuerte bg-panel')}
        >
          <span className={cx('grid size-12 place-items-center rounded-control shadow-min', error ? 'bg-superficie text-rojo-texto' : 'bg-superficie text-texto-2')}>
            {error ? <FileXIcon size={22} aria-hidden /> : <FileCsvIcon size={22} aria-hidden />}
          </span>
          <h4 className="font-display text-base font-medium">{error ? 'Ese archivo no se pudo leer' : 'Arrastrá tu planilla acá'}</h4>
          <p role={error ? 'alert' : undefined} className="max-w-[420px] text-[13px] text-texto-2">{error ?? 'Un CSV con una fila por registro. Las columnas se detectan solas; nada se carga hasta que lo confirmes.'}</p>
          <div className="flex flex-wrap justify-center gap-2">
            <label className={cx('inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-control bg-tinta px-3.5 text-[13px] font-medium text-superficie shadow-principal focus-within:ring-2 focus-within:ring-acento max-md:h-11')}>
              <UploadSimpleIcon size={16} aria-hidden />Elegir archivo
              <input id={`${id}-f`} type="file" accept=".csv,text/csv" className="sr-only" onChange={(e) => void archivo(e.target.files?.[0])} />
            </label>
            {ejemplo && <button type="button" onClick={() => cargar('ejemplo.csv', ejemplo)} className={cx('h-9 rounded-control px-3 text-[13px] text-texto-2 hover:bg-suave hover:text-tinta max-md:h-11', FOCO)}>Usar archivo de ejemplo</button>}
          </div>
        </div>
        <p className="text-center text-xs text-texto-3">
          Hasta {maxFilas.toLocaleString('es-AR')} filas{plantilla && <> · <a href={plantilla} download className="text-texto-2 underline underline-offset-2 hover:text-tinta">Bajá la plantilla</a></>}
        </p>
      </div>
    )
  }

  const falta = campos.find((c) => c.obligatorio && mapa[c.clave] == null)
  const filas = datos.filas.map((f) => Object.fromEntries(campos.flatMap((c) => (mapa[c.clave] == null ? [] : [[c.clave, f[mapa[c.clave] as number] ?? '']]))))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-[13px]">
        <FileCsvIcon size={16} className="text-texto-3" aria-hidden />
        <b className="font-medium">{datos.nombre}</b>
        <span className="text-texto-3 tabular-nums">· {plural(datos.filas.length, 'fila', 'filas')}</span>
        <button type="button" onClick={() => setDatos(null)} className={cx('ml-auto min-h-9 rounded-control px-2 text-texto-2 hover:bg-suave hover:text-tinta max-md:min-h-11', FOCO)}>Cambiar archivo</button>
      </div>
      <table className="w-full border-collapse text-[13px] max-md:block">
        <thead className="max-md:hidden">
          <tr className="text-left text-xs text-texto-3">
            <th scope="col" className="border-b border-divisor pb-2 font-normal">Campo</th>
            <th scope="col" className="w-6 border-b border-divisor" />
            <th scope="col" className="border-b border-divisor pb-2 font-normal">Columna del archivo</th>
            <th scope="col" className="border-b border-divisor pb-2 font-normal">Primera fila</th>
          </tr>
        </thead>
        <tbody className="max-md:block">
          {campos.map((c) => {
            const k = mapa[c.clave]
            return (
              <tr key={c.clave} className="border-b border-divisor max-md:flex max-md:flex-col max-md:gap-1.5 max-md:py-3">
                <th scope="row" className="py-2.5 pr-3 text-left font-medium max-md:p-0">
                  {c.texto}{c.obligatorio && <span className="ml-1 text-xs font-normal text-texto-3">obligatorio</span>}
                </th>
                <td className="text-texto-3 max-md:hidden"><ArrowRightIcon size={14} aria-hidden /></td>
                <td className="py-2 pr-3 max-md:p-0">
                  <select value={k ?? ''} aria-label={`Columna para ${c.texto}`} onChange={(e) => setMapa({ ...mapa, [c.clave]: e.target.value === '' ? null : Number(e.target.value) })} className={cx('h-9 w-full rounded-control border bg-superficie px-2.5 text-[13px] max-md:h-11', c.obligatorio && k == null ? 'border-ambar-texto' : 'border-borde', FOCO)}>
                    <option value="">No importar</option>
                    {datos.cab.map((h, i) => <option key={i} value={i}>{h || `Columna ${i + 1}`}</option>)}
                  </select>
                </td>
                <td className="truncate py-2.5 text-texto-2 max-md:p-0 max-md:text-xs">{k == null ? <span className="text-texto-3">—</span> : datos.filas[0][k] || <span className="text-texto-3">vacío</span>}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-texto-3">Nada se carga hasta que confirmes.</span>
        <BotonEspera className="ml-auto" hacer={() => onImportar(filas)} textoEspera="Importando…" motivoBloqueo={falta ? `Falta elegir la columna de ${falta.texto}` : undefined}>
          {`Importar ${plural(filas.length, 'fila', 'filas')}`}
        </BotonEspera>
      </div>
    </div>
  )
}
