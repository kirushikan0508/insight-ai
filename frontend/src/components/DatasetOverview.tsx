import { motion } from 'framer-motion'
import { Rows3, Columns3, AlertTriangle, Copy, Database, Eye } from 'lucide-react'
import type { DatasetOverview as OverviewType } from '@/types'
import { formatNumber } from '@/lib/utils'

interface Props { data: OverviewType }

const statCards = [
  { key: 'rows', label: 'Total Rows', icon: Rows3, color: '#3b82f6' },
  { key: 'columns', label: 'Columns', icon: Columns3, color: '#8b5cf6' },
  { key: 'missing_values', label: 'Missing Values', icon: AlertTriangle, color: '#f59e0b' },
  { key: 'duplicate_rows', label: 'Duplicates', icon: Copy, color: '#ec4899' },
] as const

const typeColors: Record<string, string> = {
  numeric: '#3b82f6', categorical: '#8b5cf6', datetime: '#06b6d4', text: '#10b981',
}

export default function DatasetOverview({ data }: Props) {
  return (
    <section id="overview" className="section">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-6 h-6" style={{ color: '#8b5cf6' }} />
            <h2 className="section-title">Dataset Overview</h2>
          </div>
          <p className="section-subtitle">{data.filename} — {data.memory_usage}</p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ key, label, icon: Icon, color }, i) => (
            <motion.div key={key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="stat-card group hover:scale-[1.02] transition-transform">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{formatNumber(data[key] as number)}</p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Column types */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="card mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5" style={{ color: '#8b5cf6' }} /> Column Information
          </h3>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Column Name</th><th>Type</th><th>Category</th><th>Missing</th><th>Unique</th>
                </tr>
              </thead>
              <tbody>
                {data.column_info.map((col) => (
                  <tr key={col.name}>
                    <td className="font-medium text-white">{col.name}</td>
                    <td><code className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(139,92,246,0.1)', color: '#c4b5fd' }}>{col.dtype}</code></td>
                    <td><span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: `${typeColors[col.type_category]}15`, color: typeColors[col.type_category] }}>{col.type_category}</span></td>
                    <td>{col.missing}</td>
                    <td>{col.unique}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Preview */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="card">
          <h3 className="text-lg font-semibold mb-4">Data Preview (First 10 rows)</h3>
          <div className="overflow-x-auto max-h-96">
            <table className="data-table">
              <thead>
                <tr>{data.column_info.map(c => <th key={c.name}>{c.name}</th>)}</tr>
              </thead>
              <tbody>
                {data.preview.slice(0, 10).map((row, i) => (
                  <tr key={i}>{data.column_info.map(c => <td key={c.name}>{String(row[c.name] ?? '—')}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
