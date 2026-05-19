import { motion } from 'framer-motion'

interface Props {
  matrix: number[][]
  labels?: string[]
}

export default function ConfusionMatrix({ matrix, labels }: Props) {
  const max = Math.max(...matrix.flat())
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card">
      <h3 className="text-sm font-semibold text-white mb-1">Confusion Matrix</h3>
      <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>Predicted vs Actual class labels</p>
      <div className="flex justify-center">
        <div>
          <div className="flex">
            <div className="w-16" />
            {(labels || matrix[0]?.map((_, i) => `C${i}`))?.map((l, i) => (
              <div key={i} className="w-16 text-center text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>{l}</div>
            ))}
          </div>
          {matrix.map((row, ri) => (
            <div key={ri} className="flex">
              <div className="w-16 flex items-center justify-end pr-2 text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                {labels?.[ri] || `C${ri}`}
              </div>
              {row.map((val, ci) => {
                const intensity = max > 0 ? val / max : 0
                const isDiag = ri === ci
                return (
                  <div key={ci} className="w-16 h-14 flex items-center justify-center text-sm font-bold rounded-md m-0.5 transition-transform hover:scale-105"
                    style={{
                      background: isDiag ? `rgba(16,185,129,${0.15 + intensity * 0.6})` : `rgba(239,68,68,${0.05 + intensity * 0.4})`,
                      color: intensity > 0.5 ? 'white' : 'var(--color-text-secondary)',
                    }}>
                    {val}
                  </div>
                )
              })}
            </div>
          ))}
          <div className="flex mt-2">
            <div className="w-16" />
            <p className="text-xs text-center flex-1" style={{ color: 'var(--color-text-muted)' }}>Predicted →</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
