import { motion } from 'framer-motion'
import type { ChartData } from '@/types'

export default function HeatmapCard({ chart }: { chart: ChartData }) {
  // chart.data expected: [{ row: string, col: string, value: number }]
  const rows = [...new Set(chart.data.map((d: any) => d.row))]
  const cols = [...new Set(chart.data.map((d: any) => d.col))]
  const values = chart.data.map((d: any) => d.value as number)
  const min = Math.min(...values)
  const max = Math.max(...values)

  const getColor = (v: number) => {
    const norm = max === min ? 0.5 : (v - min) / (max - min)
    if (norm < 0.25) return `rgba(59,130,246,${0.1 + norm * 2})`
    if (norm < 0.5) return `rgba(139,92,246,${norm * 1.5})`
    if (norm < 0.75) return `rgba(245,158,11,${norm})`
    return `rgba(239,68,68,${0.5 + norm * 0.5})`
  }

  const getValue = (r: string, c: string) => {
    const item = chart.data.find((d: any) => d.row === r && d.col === c)
    return item ? (item as any).value : 0
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card w-full">
      <h3 className="text-sm font-semibold text-white mb-1 text-center">{chart.title}</h3>
      <p className="text-xs mb-4 text-center" style={{ color: 'var(--color-text-muted)' }}>{chart.description}</p>
      <div className="overflow-x-auto w-full">
        <div className="inline-block min-w-full">
          <div className="flex">
            <div className="w-20" />
            {cols.map(c => (
              <div key={c as string} className="w-16 text-center text-xs truncate px-1" style={{ color: 'var(--color-text-muted)' }}>{c as string}</div>
            ))}
          </div>
          {rows.map(r => (
            <div key={r as string} className="flex items-center">
              <div className="w-20 text-xs truncate pr-2 text-right" style={{ color: 'var(--color-text-muted)' }}>{r as string}</div>
              {cols.map(c => {
                const val = getValue(r as string, c as string)
                return (
                  <div key={`${r}-${c}`} className="w-16 h-12 flex items-center justify-center text-xs font-mono rounded-sm m-0.5 cursor-default transition-transform hover:scale-110"
                    style={{ background: getColor(val), color: 'rgba(255,255,255,0.8)' }}
                    title={`${r} × ${c}: ${val.toFixed(2)}`}>
                    {val.toFixed(2)}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
