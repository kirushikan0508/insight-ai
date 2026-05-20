import { forwardRef } from 'react'
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts'
import {
  Brain, Sparkles, Database, Rows3, Columns3, AlertTriangle,
  TrendingUp, Lightbulb, Star, BarChart3, Trophy, Zap
} from 'lucide-react'
import type { DatasetOverview, ChartData, AIInsight, MLResult, ForecastResult } from '@/types'

/* ============ Theme Definitions ============ */
export type ThemeKey = 'dark-analytics' | 'futuristic-ai' | 'minimal-business'

interface ThemeColors {
  bg: string
  bgCard: string
  bgCardBorder: string
  accent1: string
  accent2: string
  accent3: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  kpiGradients: string[]
  headerGradient: string
}

const themes: Record<ThemeKey, ThemeColors> = {
  'dark-analytics': {
    bg: '#0a0a0f',
    bgCard: 'rgba(26, 26, 46, 0.8)',
    bgCardBorder: 'rgba(148, 163, 184, 0.1)',
    accent1: '#3b82f6',
    accent2: '#8b5cf6',
    accent3: '#06b6d4',
    textPrimary: '#f1f5f9',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    kpiGradients: [
      'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))',
      'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))',
      'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))',
      'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(236,72,153,0.05))',
    ],
    headerGradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)',
  },
  'futuristic-ai': {
    bg: '#0a0f1a',
    bgCard: 'rgba(10, 30, 50, 0.8)',
    bgCardBorder: 'rgba(6, 182, 212, 0.15)',
    accent1: '#06b6d4',
    accent2: '#10b981',
    accent3: '#3b82f6',
    textPrimary: '#e0f2fe',
    textSecondary: '#7dd3fc',
    textMuted: '#38bdf8',
    kpiGradients: [
      'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(6,182,212,0.05))',
      'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))',
      'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.05))',
      'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(168,85,247,0.05))',
    ],
    headerGradient: 'linear-gradient(135deg, #06b6d4, #10b981, #3b82f6)',
  },
  'minimal-business': {
    bg: '#111116',
    bgCard: 'rgba(30, 30, 40, 0.9)',
    bgCardBorder: 'rgba(100, 116, 139, 0.15)',
    accent1: '#6366f1',
    accent2: '#a78bfa',
    accent3: '#818cf8',
    textPrimary: '#e2e8f0',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    kpiGradients: [
      'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(99,102,241,0.04))',
      'linear-gradient(135deg, rgba(167,139,250,0.12), rgba(167,139,250,0.04))',
      'linear-gradient(135deg, rgba(129,140,248,0.12), rgba(129,140,248,0.04))',
      'linear-gradient(135deg, rgba(196,181,253,0.12), rgba(196,181,253,0.04))',
    ],
    headerGradient: 'linear-gradient(135deg, #6366f1, #a78bfa)',
  },
}

const chartColors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#ef4444', '#14b8a6']

/* ============ Props ============ */
interface ReportPosterProps {
  overview: DatasetOverview
  charts: ChartData[]
  insights: AIInsight[]
  mlResult: MLResult | null
  forecastResult: ForecastResult | null
  theme: ThemeKey
}

/* ============ Component ============ */
const ReportPoster = forwardRef<HTMLDivElement, ReportPosterProps>(
  ({ overview, charts, insights, mlResult, forecastResult, theme }, ref) => {
    const t = themes[theme]
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const topCharts = charts.slice(0, 4)
    const topInsights = insights.slice(0, 4)

    const kpiData = [
      { label: 'Total Rows', value: overview.rows.toLocaleString(), icon: Rows3, color: t.accent1 },
      { label: 'Columns', value: overview.columns.toLocaleString(), icon: Columns3, color: t.accent2 },
      { label: 'Missing Values', value: overview.missing_values.toLocaleString(), icon: AlertTriangle, color: '#f59e0b' },
      { label: 'Memory', value: overview.memory_usage, icon: Database, color: '#ec4899' },
    ]

    const categoryIcons: Record<string, typeof Lightbulb> = {
      trend: TrendingUp, pattern: BarChart3, anomaly: AlertTriangle,
      recommendation: Star, summary: Lightbulb,
    }

    return (
      <div
        ref={ref}
        style={{
          width: 1200,
          minHeight: 1700,
          background: t.bg,
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          color: t.textPrimary,
          padding: 48,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorations */}
        <div style={{
          position: 'absolute', top: -200, right: -200, width: 600, height: 600,
          borderRadius: '50%', background: `radial-gradient(circle, ${t.accent1}10, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -200, left: -200, width: 600, height: 600,
          borderRadius: '50%', background: `radial-gradient(circle, ${t.accent2}10, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        {/* ===== HEADER ===== */}
        <div style={{
          textAlign: 'center', marginBottom: 48, position: 'relative', zIndex: 1,
          padding: '36px 32px',
          background: t.bgCard,
          border: `1px solid ${t.bgCardBorder}`,
          borderRadius: 20,
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16,
            padding: '8px 20px', borderRadius: 100,
            background: `${t.accent2}18`, border: `1px solid ${t.accent2}30`,
          }}>
            <Sparkles style={{ width: 16, height: 16, color: t.accent2 }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: t.accent2 }}>AI-Powered Analytics Report</span>
          </div>
          <h1 style={{
            fontSize: 36, fontWeight: 800, letterSpacing: -1,
            background: t.headerGradient,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', margin: '0 0 8px',
          }}>
            {overview.filename.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} Analysis
          </h1>
          <p style={{ fontSize: 14, color: t.textSecondary, margin: 0 }}>
            Generated on {dateStr} • {overview.rows.toLocaleString()} records analyzed
          </p>
        </div>

        {/* ===== KPI CARDS ===== */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20,
          marginBottom: 40, position: 'relative', zIndex: 1,
        }}>
          {kpiData.map((kpi, i) => {
            const Icon = kpi.icon
            return (
              <div key={kpi.label} style={{
                background: t.kpiGradients[i],
                border: `1px solid ${t.bgCardBorder}`,
                borderRadius: 16, padding: '24px 20px', textAlign: 'center',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, margin: '0 auto 12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${kpi.color}20`,
                }}>
                  <Icon style={{ width: 20, height: 20, color: kpi.color }} />
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: t.textPrimary }}>{kpi.value}</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: t.textSecondary, marginTop: 4 }}>{kpi.label}</div>
              </div>
            )
          })}
        </div>

        {/* ===== CHARTS ===== */}
        {topCharts.length > 0 && (
          <div style={{ marginBottom: 40, position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <BarChart3 style={{ width: 22, height: 22, color: t.accent3 }} />
              <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Visualizations</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
              {topCharts.map((chart, i) => (
                <div key={i} style={{
                  background: t.bgCard, border: `1px solid ${t.bgCardBorder}`,
                  borderRadius: 16, padding: 24,
                }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: t.textPrimary }}>
                    {chart.title}
                  </h3>
                  <div style={{ width: '100%', height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      {renderChart(chart, t)}
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== AI INSIGHTS ===== */}
        {topInsights.length > 0 && (
          <div style={{ marginBottom: 40, position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <Lightbulb style={{ width: 22, height: 22, color: '#f59e0b' }} />
              <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>AI Insights</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {topInsights.map((insight) => {
                const Icon = categoryIcons[insight.category] || Lightbulb
                const colors: Record<string, string> = {
                  trend: '#3b82f6', pattern: '#8b5cf6', anomaly: '#f59e0b',
                  recommendation: '#10b981', summary: '#06b6d4',
                }
                const clr = colors[insight.category] || '#06b6d4'
                return (
                  <div key={insight.id} style={{
                    background: t.bgCard, border: `1px solid ${t.bgCardBorder}`,
                    borderRadius: 14, padding: 20,
                    display: 'flex', gap: 14, alignItems: 'flex-start',
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: `${clr}18`,
                    }}>
                      <Icon style={{ width: 18, height: 18, color: clr }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{
                          fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 100,
                          background: `${clr}18`, color: clr, textTransform: 'capitalize',
                        }}>{insight.category}</span>
                        {insight.importance === 'high' && (
                          <span style={{
                            fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 100,
                            background: 'rgba(239,68,68,0.15)', color: '#ef4444',
                          }}>High Priority</span>
                        )}
                      </div>
                      <h4 style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, margin: '0 0 4px' }}>
                        {insight.title}
                      </h4>
                      <p style={{ fontSize: 12, color: t.textSecondary, margin: 0, lineHeight: 1.5 }}>
                        {insight.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ===== ML PREDICTIONS ===== */}
        {mlResult && (
          <div style={{ marginBottom: 40, position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <Brain style={{ width: 22, height: 22, color: t.accent2 }} />
              <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>ML Predictions</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* Best model card */}
              <div style={{
                background: t.bgCard, border: `1px solid ${t.bgCardBorder}`,
                borderRadius: 16, padding: 28,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <Trophy style={{ width: 20, height: 20, color: '#f59e0b' }} />
                  <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Best Model</h3>
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: t.accent1, marginBottom: 8 }}>
                  {mlResult.best_model}
                </div>
                <div style={{
                  display: 'inline-block', padding: '4px 12px', borderRadius: 100,
                  background: `${t.accent2}18`, color: t.accent2,
                  fontSize: 12, fontWeight: 600, textTransform: 'capitalize', marginBottom: 16,
                }}>
                  {mlResult.task_type} • Target: {mlResult.target_column}
                </div>
                {/* Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                  {mlResult.models.find(m => m.is_best) &&
                    Object.entries(mlResult.models.find(m => m.is_best)!.metrics).slice(0, 4).map(([key, val]) => (
                      <div key={key} style={{
                        background: `${t.accent1}08`, borderRadius: 10, padding: '10px 14px',
                        border: `1px solid ${t.bgCardBorder}`,
                      }}>
                        <div style={{ fontSize: 10, color: t.textMuted, textTransform: 'uppercase', fontWeight: 600 }}>
                          {key.replace(/_/g, ' ')}
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: t.textPrimary }}>
                          {typeof val === 'number' ? val.toFixed(4) : val}
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Feature importance */}
              {mlResult.feature_importance.length > 0 && (
                <div style={{
                  background: t.bgCard, border: `1px solid ${t.bgCardBorder}`,
                  borderRadius: 16, padding: 28,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <Zap style={{ width: 20, height: 20, color: t.accent3 }} />
                    <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Top Features</h3>
                  </div>
                  <div style={{ width: '100%', height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mlResult.feature_importance.slice(0, 8)} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke={`${t.textMuted}20`} />
                        <XAxis type="number" tick={{ fill: t.textMuted, fontSize: 10 }} />
                        <YAxis dataKey="feature" type="category" tick={{ fill: t.textSecondary, fontSize: 10 }} width={100} />
                        <Bar dataKey="importance" fill={t.accent1} radius={[0, 6, 6, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== FORECAST ===== */}
        {forecastResult && (
          <div style={{ marginBottom: 40, position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <TrendingUp style={{ width: 22, height: 22, color: t.accent3 }} />
              <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Forecast</h2>
            </div>
            <div style={{
              background: t.bgCard, border: `1px solid ${t.bgCardBorder}`,
              borderRadius: 16, padding: 28,
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: t.textPrimary }}>
                {forecastResult.value_column} — {forecastResult.period}-Day Forecast
              </h3>
              <div style={{ width: '100%', height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecastResult.forecast}>
                    <CartesianGrid strokeDasharray="3 3" stroke={`${t.textMuted}20`} />
                    <XAxis dataKey="ds" tick={{ fill: t.textMuted, fontSize: 9 }}
                      tickFormatter={(v: string) => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })} />
                    <YAxis tick={{ fill: t.textMuted, fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ background: t.bg, border: `1px solid ${t.bgCardBorder}`, borderRadius: 8 }}
                      labelStyle={{ color: t.textPrimary }}
                    />
                    <Area type="monotone" dataKey="yhat_upper" stroke="none" fill={`${t.accent3}15`} />
                    <Area type="monotone" dataKey="yhat_lower" stroke="none" fill={t.bg} />
                    <Line type="monotone" dataKey="yhat" stroke={t.accent3} strokeWidth={2} dot={false} />
                    {forecastResult.forecast.some(p => p.actual != null) && (
                      <Line type="monotone" dataKey="actual" stroke={t.accent1} strokeWidth={2} dot={false} strokeDasharray="4 4" />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              {forecastResult.trend_summary && (
                <p style={{
                  fontSize: 13, color: t.textSecondary, marginTop: 16,
                  padding: '12px 16px', borderRadius: 10,
                  background: `${t.accent3}08`, border: `1px solid ${t.bgCardBorder}`,
                  lineHeight: 1.6,
                }}>
                  {forecastResult.trend_summary}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ===== FOOTER ===== */}
        <div style={{
          textAlign: 'center', padding: '24px 0 0',
          borderTop: `1px solid ${t.bgCardBorder}`,
          position: 'relative', zIndex: 1,
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: t.headerGradient,
            }}>
              <Brain style={{ width: 16, height: 16, color: 'white' }} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 700 }}>
              <span style={{
                background: t.headerGradient,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Insight</span>
              <span style={{ color: t.textPrimary }}>AI</span>
            </span>
          </div>
          <p style={{ fontSize: 11, color: t.textMuted, margin: 0 }}>
            Generated by InsightAI • AI-Powered Dataset Analytics Platform • {dateStr}
          </p>
        </div>
      </div>
    )
  }
)

ReportPoster.displayName = 'ReportPoster'
export default ReportPoster

/* ============ Chart Renderer Helper ============ */
function renderChart(chart: ChartData, t: ThemeColors): React.ReactElement {
  const data = chart.data || []
  const xKey = chart.x_key || (data[0] ? Object.keys(data[0])[0] : 'x')
  const yKey = chart.y_key || (data[0] ? Object.keys(data[0])[1] : 'y')

  switch (chart.chart_type) {
    case 'bar':
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={`${t.textMuted}20`} />
          <XAxis dataKey={xKey} tick={{ fill: t.textMuted, fontSize: 9 }} />
          <YAxis tick={{ fill: t.textMuted, fontSize: 10 }} />
          <Bar dataKey={yKey} fill={t.accent1} radius={[4, 4, 0, 0]} />
        </BarChart>
      )
    case 'pie':
      return (
        <PieChart>
          <Pie data={data} dataKey={yKey} nameKey={xKey} cx="50%" cy="50%" outerRadius={80} label>
            {data.map((_, idx) => (
              <Cell key={idx} fill={chartColors[idx % chartColors.length]} />
            ))}
          </Pie>
        </PieChart>
      )
    case 'line':
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={`${t.textMuted}20`} />
          <XAxis dataKey={xKey} tick={{ fill: t.textMuted, fontSize: 9 }} />
          <YAxis tick={{ fill: t.textMuted, fontSize: 10 }} />
          <Line type="monotone" dataKey={yKey} stroke={t.accent1} strokeWidth={2} dot={false} />
        </LineChart>
      )
    case 'histogram':
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={`${t.textMuted}20`} />
          <XAxis dataKey={xKey} tick={{ fill: t.textMuted, fontSize: 9 }} />
          <YAxis tick={{ fill: t.textMuted, fontSize: 10 }} />
          <Bar dataKey={yKey} fill={t.accent2} radius={[4, 4, 0, 0]} />
        </BarChart>
      )
    case 'scatter':
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={`${t.textMuted}20`} />
          <XAxis dataKey={xKey} tick={{ fill: t.textMuted, fontSize: 9 }} />
          <YAxis tick={{ fill: t.textMuted, fontSize: 10 }} />
          <Line type="monotone" dataKey={yKey} stroke={t.accent3} strokeWidth={0} dot={{ fill: t.accent3, r: 3 }} />
        </LineChart>
      )
    default:
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={`${t.textMuted}20`} />
          <XAxis dataKey={xKey} tick={{ fill: t.textMuted, fontSize: 9 }} />
          <YAxis tick={{ fill: t.textMuted, fontSize: 10 }} />
          <Bar dataKey={yKey} fill={t.accent1} radius={[4, 4, 0, 0]} />
        </BarChart>
      )
  }
}
