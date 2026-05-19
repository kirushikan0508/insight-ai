import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart } from 'recharts'
import type { ForecastPoint } from '@/types'

export default function ForecastChart({ data, title }: { data: ForecastPoint[]; title?: string }) {
  const chartData = data.map(d => ({
    ds: d.ds,
    yhat: Number(d.yhat.toFixed(2)),
    lower: Number(d.yhat_lower.toFixed(2)),
    upper: Number(d.yhat_upper.toFixed(2)),
    actual: d.actual != null ? Number(d.actual.toFixed(2)) : undefined,
  }))

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card">
      <h3 className="text-sm font-semibold text-white mb-1">{title || 'Forecast'}</h3>
      <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>Predicted values with confidence intervals</p>
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
          <XAxis dataKey="ds" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={{ stroke: 'rgba(148,163,184,0.1)' }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: 'rgba(148,163,184,0.1)' }} />
          <Tooltip contentStyle={{ background: 'rgba(26,26,46,0.9)', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 8, color: '#f1f5f9', fontSize: 12 }} />
          <Area dataKey="upper" stroke="none" fill="rgba(139,92,246,0.1)" />
          <Area dataKey="lower" stroke="none" fill="rgba(10,10,15,1)" />
          <Line type="monotone" dataKey="yhat" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Forecast" />
          <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} dot={false} name="Actual" />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
