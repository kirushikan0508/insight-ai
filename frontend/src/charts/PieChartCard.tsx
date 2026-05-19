import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { ChartData } from '@/types'

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#ef4444', '#6366f1']

export default function PieChartCard({ chart }: { chart: ChartData }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card w-full">
      <h3 className="text-sm font-semibold text-white mb-1 text-center">{chart.title}</h3>
      <p className="text-xs mb-4 text-center" style={{ color: 'var(--color-text-muted)' }}>{chart.description}</p>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={chart.data} dataKey={chart.y_key || 'value'} nameKey={chart.x_key || 'name'}
            cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3} strokeWidth={0}>
            {chart.data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ background: 'rgba(26,26,46,0.9)', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 8, color: '#f1f5f9', fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
