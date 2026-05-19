import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { ChartData } from '@/types'

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#ef4444', '#6366f1']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass px-3 py-2 rounded-lg text-sm" style={{ border: '1px solid rgba(148,163,184,0.15)' }}>
      <p className="font-medium text-white mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</p>
      ))}
    </div>
  )
}

export default function BarChartCard({ chart }: { chart: ChartData }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card">
      <h3 className="text-sm font-semibold text-white mb-1">{chart.title}</h3>
      <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>{chart.description}</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chart.data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
          <XAxis dataKey={chart.x_key} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: 'rgba(148,163,184,0.1)' }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: 'rgba(148,163,184,0.1)' }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey={chart.y_key || 'value'} radius={[6, 6, 0, 0]}>
            {chart.data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
