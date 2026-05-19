import { motion } from 'framer-motion'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { ChartData } from '@/types'

export default function ScatterChartCard({ chart }: { chart: ChartData }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card w-full">
      <h3 className="text-sm font-semibold text-white mb-1 text-center">{chart.title}</h3>
      <p className="text-xs mb-4 text-center" style={{ color: 'var(--color-text-muted)' }}>{chart.description}</p>
      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
          <XAxis dataKey={chart.x_key} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: 'rgba(148,163,184,0.1)' }} name={chart.x_key} />
          <YAxis dataKey={chart.y_key} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: 'rgba(148,163,184,0.1)' }} name={chart.y_key} />
          <Tooltip contentStyle={{ background: 'rgba(26,26,46,0.9)', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 8, color: '#f1f5f9', fontSize: 12 }} />
          <Scatter data={chart.data} fill="#8b5cf6" fillOpacity={0.7} />
        </ScatterChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
