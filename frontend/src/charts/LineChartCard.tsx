import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { ChartData } from '@/types'

export default function LineChartCard({ chart }: { chart: ChartData }) {
  const keys = chart.keys || [chart.y_key || 'value']
  const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card w-full">
      <h3 className="text-sm font-semibold text-white mb-1 text-center">{chart.title}</h3>
      <p className="text-xs mb-4 text-center" style={{ color: 'var(--color-text-muted)' }}>{chart.description}</p>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chart.data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
          <XAxis dataKey={chart.x_key} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: 'rgba(148,163,184,0.1)' }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: 'rgba(148,163,184,0.1)' }} />
          <Tooltip contentStyle={{ background: 'rgba(26,26,46,0.9)', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 8, color: '#f1f5f9', fontSize: 12 }} />
          {keys.map((k, i) => (
            <Line key={k} type="monotone" dataKey={k} stroke={colors[i % colors.length]} strokeWidth={2} dot={false} activeDot={{ r: 4, fill: colors[i % colors.length] }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
