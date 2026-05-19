import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Calendar, ChevronDown } from 'lucide-react'
import type { ForecastResult, ColumnInfo } from '@/types'
import ForecastChart from '@/charts/ForecastChart'
import { AIThinking } from './LoadingStates'

interface Props {
  columns: ColumnInfo[]
  onForecast: (dateCol: string, valueCol: string, period: number) => void
  result: ForecastResult | null
  isLoading: boolean
}

export default function ForecastPanel({ columns, onForecast, result, isLoading }: Props) {
  const [dateCol, setDateCol] = useState('')
  const [valueCol, setValueCol] = useState('')
  const [period, setPeriod] = useState(30)

  const dateCols = columns.filter(c => c.type_category === 'datetime')
  const numCols = columns.filter(c => c.type_category === 'numeric')

  return (
    <section id="forecast" className="section">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6" style={{ color: '#06b6d4' }} />
            <h2 className="section-title">Time Series Forecasting</h2>
          </div>
          <p className="section-subtitle">Predict future trends using Prophet forecasting</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="card max-w-5xl mx-auto" style={{ marginBottom: '48px' }}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-text-secondary)' }}>Date Column</label>
              <div className="relative">
                <select value={dateCol} onChange={e => setDateCol(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 rounded-xl text-sm text-white"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                  <option value="">Select...</option>
                  {dateCols.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--color-text-muted)' }} />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-text-secondary)' }}>Value Column</label>
              <div className="relative">
                <select value={valueCol} onChange={e => setValueCol(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 rounded-xl text-sm text-white"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                  <option value="">Select...</option>
                  {numCols.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--color-text-muted)' }} />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-text-secondary)' }}>Forecast Period</label>
              <div className="flex gap-2">
                {[7, 30, 90].map(p => (
                  <button key={p} onClick={() => setPeriod(p)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all"
                    style={{
                      background: period === p ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'var(--color-bg-secondary)',
                      color: period === p ? 'white' : 'var(--color-text-secondary)',
                      border: `1px solid ${period === p ? 'transparent' : 'var(--color-border)'}`,
                    }}>
                    {p}d
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => dateCol && valueCol && onForecast(dateCol, valueCol, period)}
              disabled={!dateCol || !valueCol || isLoading}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', boxShadow: '0 4px 20px rgba(6,182,212,0.3)' }}>
              {isLoading ? 'Forecasting...' : 'Generate Forecast'}
            </button>
          </div>
        </motion.div>

        {isLoading && <AIThinking />}

        <AnimatePresence>
          {result && !isLoading && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
              <ForecastChart data={result.forecast} title={`${result.value_column} — ${result.period}-Day Forecast`} />
              {result.trend_summary && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                  className="card" style={{ marginTop: '32px' }}>
                  <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" style={{ color: '#06b6d4' }} /> Trend Analysis
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{result.trend_summary}</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {dateCols.length === 0 && (
          <div className="card text-center py-12 max-w-5xl mx-auto">
            <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-muted)' }} />
            <p className="font-medium text-white mb-1">No Date Columns Detected</p>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Forecasting requires a datetime column in your dataset</p>
          </div>
        )}
      </div>
    </section>
  )
}
