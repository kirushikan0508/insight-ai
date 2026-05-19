import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Trophy, Target, ChevronDown } from 'lucide-react'
import type { MLResult, ColumnInfo } from '@/types'
import FeatureImportanceChart from '@/charts/FeatureImportance'
import ConfusionMatrix from '@/charts/ConfusionMatrix'
import { AIThinking } from './LoadingStates'

interface Props {
  columns: ColumnInfo[]
  onTrain: (target: string) => void
  result: MLResult | null
  isTraining: boolean
}

export default function MLPredictions({ columns, onTrain, result, isTraining }: Props) {
  const [target, setTarget] = useState('')

  const metricLabels: Record<string, string> = {
    accuracy: 'Accuracy', f1_score: 'F1 Score', precision: 'Precision', recall: 'Recall',
    rmse: 'RMSE', mae: 'MAE', r2: 'R² Score',
  }

  return (
    <section id="ml-models" className="section">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-8 h-8" style={{ color: '#8b5cf6' }} />
            <h2 className="section-title !mb-0">Machine Learning Predictions</h2>
          </div>
          <p className="section-subtitle">Select a target column to auto-train and compare ML models</p>
        </motion.div>

        {/* Target selector */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card mb-8 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" style={{ color: '#8b5cf6' }} />
              <span className="font-medium text-white text-sm">Target Column:</span>
            </div>
            <div className="relative flex-1 max-w-xs">
              <select value={target} onChange={(e) => setTarget(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 rounded-xl text-sm text-white cursor-pointer"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                <option value="">Select column...</option>
                {columns.map(c => <option key={c.name} value={c.name}>{c.name} ({c.type_category})</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--color-text-muted)' }} />
            </div>
            <button onClick={() => target && onTrain(target)} disabled={!target || isTraining}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}>
              {isTraining ? 'Training...' : 'Train Models'}
            </button>
          </div>
        </motion.div>

        {isTraining && <AIThinking />}

        <AnimatePresence>
          {result && !isTraining && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Task type badge */}
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize"
                  style={{ background: 'rgba(139,92,246,0.1)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.2)' }}>
                  {result.task_type}
                </span>
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Target: <strong className="text-white">{result.target_column}</strong></span>
              </div>

              {/* Model comparison */}
              <div className="card mb-6 max-w-5xl mx-auto">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5" style={{ color: '#f59e0b' }} /> Model Comparison
                </h3>
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead><tr><th>Model</th>{Object.keys(result.models[0]?.metrics || {}).map(k => <th key={k}>{metricLabels[k] || k}</th>)}<th>Best</th></tr></thead>
                    <tbody>
                      {result.models.map(m => (
                        <tr key={m.name} style={m.is_best ? { background: 'rgba(16,185,129,0.05)' } : {}}>
                          <td className="font-medium text-white">{m.name}</td>
                          {Object.values(m.metrics).map((v, i) => <td key={i}>{typeof v === 'number' ? v.toFixed(4) : v}</td>)}
                          <td>{m.is_best && <span className="text-xs px-2 py-1 rounded-full font-bold" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>★ Best</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Charts */}
              <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {result.feature_importance.length > 0 && <FeatureImportanceChart data={result.feature_importance} />}
                {result.confusion_matrix && <ConfusionMatrix matrix={result.confusion_matrix} labels={result.class_labels} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
