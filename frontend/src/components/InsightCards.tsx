import { motion } from 'framer-motion'
import { Lightbulb, TrendingUp, AlertTriangle, Star, BarChart3 } from 'lucide-react'
import type { AIInsight } from '@/types'

interface Props { insights: AIInsight[] }

const categoryConfig: Record<string, { icon: typeof Lightbulb; color: string; bg: string }> = {
  trend: { icon: TrendingUp, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  pattern: { icon: BarChart3, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  anomaly: { icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  recommendation: { icon: Star, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  summary: { icon: Lightbulb, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
}

export default function InsightCards({ insights }: Props) {
  return (
    <section className="section">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Lightbulb className="w-8 h-8" style={{ color: '#f59e0b' }} />
            <h2 className="section-title !mb-0">AI-Generated Insights</h2>
          </div>
          <p className="section-subtitle">Smart business-style insights powered by AI analysis</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl mx-auto" style={{ gap: '32px' }}>
          {insights.map((insight, i) => {
            const config = categoryConfig[insight.category] || categoryConfig.summary
            const Icon = config.icon
            return (
              <motion.div key={insight.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="card group cursor-default h-full">
                <div className="flex flex-col items-center gap-3 w-full">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: config.bg }}>
                    <Icon className="w-5 h-5" style={{ color: config.color }} />
                  </div>
                  <div className="flex-1 min-w-0 w-full text-center">
                    <div className="flex items-center justify-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full capitalize"
                        style={{ background: config.bg, color: config.color }}>{insight.category}</span>
                      {insight.importance === 'high' && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>High</span>
                      )}
                    </div>
                    <h4 className="font-semibold text-white text-sm mb-1">{insight.title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{insight.description}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
