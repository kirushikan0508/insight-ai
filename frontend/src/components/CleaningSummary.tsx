import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Trash2, AlertTriangle, Sparkles } from 'lucide-react'
import type { CleaningSummary as CleaningType } from '@/types'

interface Props { data: CleaningType }

export default function CleaningSummary({ data }: Props) {
  const stats = [
    { label: 'Missing Before', value: data.missing_before, color: '#f59e0b' },
    { label: 'Missing After', value: data.missing_after, color: '#10b981' },
    { label: 'Duplicates Removed', value: data.duplicates_removed, color: '#ec4899' },
    { label: 'Outliers Detected', value: data.outliers_detected, color: '#06b6d4' },
  ]

  return (
    <section className="section">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8" style={{ color: '#10b981' }} />
            <h2 className="section-title !mb-0">Data Cleaning Summary</h2>
          </div>
          <p className="section-subtitle">Automatic data preprocessing applied to your dataset</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 w-full max-w-6xl mx-auto" style={{ gap: '32px', marginBottom: '48px' }}>
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="stat-card">
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>{s.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card max-w-6xl mx-auto w-full">
          <h3 className="text-lg font-semibold mb-4 text-white text-center">Actions Performed</h3>
          <div className="space-y-3">
            {data.actions.map((action, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)' }}>
                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#10b981' }} />
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{action}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
