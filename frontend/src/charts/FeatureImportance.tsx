import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { FeatureImportance as FIType } from '@/types'

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#ef4444', '#6366f1']

export default function FeatureImportanceChart({ data }: { data: FIType[] }) {
  const sorted = [...data].sort((a, b) => b.importance - a.importance).slice(0, 15)
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card">
      <h3 className="text-sm font-semibold text-white mb-1">Feature Importance</h3>
      <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>Most influential features for prediction</p>
      <ResponsiveContainer width="100%" height={Math.max(280, sorted.length * 32)}>
        <BarChart data={sorted} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 80 }}>
          <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: 'rgba(148,163,184,0.1)' }} />
          <YAxis type="category" dataKey="feature" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: 'rgba(148,163,184,0.1)' }} width={75} />
          <Tooltip contentStyle={{ background: 'rgba(26,26,46,0.9)', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 8, color: '#f1f5f9', fontSize: 12 }} />
          <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
            {sorted.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
