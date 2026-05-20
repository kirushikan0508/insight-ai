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

export interface ThemeColors {
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

// Redesigned with premium colors per user request
export const themes: Record<ThemeKey, ThemeColors> = {
  'dark-analytics': {
    bg: '#0B1020',
    bgCard: '#121A2D',
    bgCardBorder: 'rgba(255, 255, 255, 0.05)',
    accent1: '#3b82f6',
    accent2: '#8b5cf6',
    accent3: '#06b6d4',
    textPrimary: '#ffffff',
    textSecondary: '#94a3b8',
    textMuted: '#475569',
    kpiGradients: [
      'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.02))',
      'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.02))',
      'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.02))',
      'linear-gradient(135deg, rgba(236,72,153,0.1), rgba(236,72,153,0.02))',
    ],
    headerGradient: 'linear-gradient(135deg, #ffffff, #94a3b8)',
  },
  'futuristic-ai': {
    bg: '#0B1020',
    bgCard: '#121A2D',
    bgCardBorder: 'rgba(6, 182, 212, 0.1)',
    accent1: '#06b6d4',
    accent2: '#10b981',
    accent3: '#3b82f6',
    textPrimary: '#ffffff',
    textSecondary: '#94a3b8',
    textMuted: '#475569',
    kpiGradients: [
      'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(6,182,212,0.02))',
      'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.02))',
      'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.02))',
      'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(168,85,247,0.02))',
    ],
    headerGradient: 'linear-gradient(135deg, #06b6d4, #10b981)',
  },
  'minimal-business': {
    bg: '#0B1020',
    bgCard: '#121A2D',
    bgCardBorder: 'rgba(255, 255, 255, 0.05)',
    accent1: '#6366f1',
    accent2: '#a78bfa',
    accent3: '#818cf8',
    textPrimary: '#ffffff',
    textSecondary: '#94a3b8',
    textMuted: '#475569',
    kpiGradients: [
      'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.02))',
      'linear-gradient(135deg, rgba(167,139,250,0.1), rgba(167,139,250,0.02))',
      'linear-gradient(135deg, rgba(129,140,248,0.1), rgba(129,140,248,0.02))',
      'linear-gradient(135deg, rgba(196,181,253,0.1), rgba(196,181,253,0.02))',
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
      { label: 'Memory Usage', value: overview.memory_usage, icon: Database, color: '#ec4899' },
    ]

    const categoryIcons: Record<string, typeof Lightbulb> = {
      trend: TrendingUp, pattern: BarChart3, anomaly: AlertTriangle,
      recommendation: Star, summary: Lightbulb,
    }

    return (
      <div
        ref={ref}
        className="mx-auto relative overflow-hidden font-sans"
        style={{
          width: '1600px', // Fixed export width
          padding: '64px 80px', // Large breathing room
          background: t.bg,
          color: t.textPrimary,
          display: 'flex',
          flexDirection: 'column',
          gap: '48px', // Strong section gap
        }}
      >
        {/* Background decorations */}
        <div
          className="absolute -top-[300px] -right-[200px] w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none opacity-30"
          style={{ background: `radial-gradient(circle, ${t.accent1}, transparent 60%)` }}
        />
        <div
          className="absolute -bottom-[300px] -left-[200px] w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none opacity-20"
          style={{ background: `radial-gradient(circle, ${t.accent2}, transparent 60%)` }}
        />

        {/* ===== HEADER ===== */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <div
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full shadow-sm"
            style={{
              background: `${t.accent1}15`,
              border: `1px solid ${t.accent1}30`,
            }}
          >
            <Sparkles className="w-5 h-5" style={{ color: t.accent1 }} />
            <span className="text-sm font-bold tracking-widest uppercase" style={{ color: t.accent1 }}>
              AI-Powered Analytics Report
            </span>
          </div>

          <h1
            className="text-6xl font-extrabold tracking-tight mb-4"
            style={{
              background: t.headerGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {overview.filename.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </h1>

          <p className="text-xl font-medium tracking-wide" style={{ color: t.textSecondary }}>
            Generated on {dateStr} • {overview.rows.toLocaleString()} Records Analyzed
          </p>
        </div>

        {/* ===== KPI CARDS ===== */}
        <div className="relative z-10 grid grid-cols-4 gap-6">
          {kpiData.map((kpi, i) => {
            const Icon = kpi.icon
            return (
              <div
                key={kpi.label}
                className="flex flex-col items-center justify-center p-8 rounded-2xl shadow-xl border"
                style={{
                  background: t.bgCard,
                  borderColor: t.bgCardBorder,
                  backgroundImage: t.kpiGradients[i],
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-inner"
                  style={{ background: `${kpi.color}15`, border: `1px solid ${kpi.color}25` }}
                >
                  <Icon className="w-7 h-7" style={{ color: kpi.color }} />
                </div>
                <div className="text-5xl font-black mb-2 tracking-tight" style={{ color: t.textPrimary }}>{kpi.value}</div>
                <div className="text-sm font-bold uppercase tracking-widest" style={{ color: t.textSecondary }}>{kpi.label}</div>
              </div>
            )
          })}
        </div>

        {/* ===== CHARTS ===== */}
        {topCharts.length > 0 && (
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-center gap-3 px-2">
              <BarChart3 className="w-8 h-8" style={{ color: t.accent1 }} />
              <h2 className="text-3xl font-bold tracking-tight m-0" style={{ color: t.textPrimary }}>Visualizations</h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {topCharts.map((chart, i) => (
                <div
                  key={i}
                  className="p-8 rounded-2xl shadow-xl border flex flex-col"
                  style={{ background: t.bgCard, borderColor: t.bgCardBorder, minHeight: '420px' }}
                >
                  <h3 className="text-xl font-bold mb-8" style={{ color: t.textPrimary }}>
                    {chart.title}
                  </h3>
                  <div className="w-full flex-1">
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
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-center gap-3 px-2">
              <Lightbulb className="w-8 h-8" style={{ color: '#f59e0b' }} />
              <h2 className="text-3xl font-bold tracking-tight m-0" style={{ color: t.textPrimary }}>AI Insights</h2>
            </div>

            <div className="grid grid-cols-4 gap-6">
              {topInsights.map((insight) => {
                const Icon = categoryIcons[insight.category] || Lightbulb
                const colors: Record<string, string> = {
                  trend: '#3b82f6', pattern: '#8b5cf6', anomaly: '#f59e0b',
                  recommendation: '#10b981', summary: '#06b6d4',
                }
                const clr = colors[insight.category] || '#06b6d4'

                return (
                  <div
                    key={insight.id}
                    className="flex flex-col p-8 rounded-2xl shadow-xl border h-full"
                    style={{ background: t.bgCard, borderColor: t.bgCardBorder }}
                  >
                    <div className="flex flex-col items-start gap-4 mb-5">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider"
                          style={{ background: `${clr}15`, color: clr, border: `1px solid ${clr}30` }}
                        >
                          {insight.category}
                        </span>
                        {insight.importance === 'high' && (
                          <span
                            className="text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider"
                            style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
                          >
                            High Priority
                          </span>
                        )}
                      </div>
                      <div
                        className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center shadow-inner"
                        style={{ background: `${clr}15` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: clr }} />
                      </div>
                    </div>

                    <h4 className="text-lg font-bold mb-3 leading-snug" style={{ color: t.textPrimary }}>
                      {insight.title}
                    </h4>
                    <p className="text-base leading-relaxed m-0 flex-1" style={{ color: t.textSecondary }}>
                      {insight.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ===== PREDICTIONS & FORECAST ===== */}
        {(mlResult || forecastResult) && (
          <div className="relative z-10 grid grid-cols-2 gap-8 pt-4">

            {/* ML PREDICTIONS */}
            {mlResult && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 px-2">
                  <Brain className="w-8 h-8" style={{ color: t.accent2 }} />
                  <h2 className="text-3xl font-bold tracking-tight m-0" style={{ color: t.textPrimary }}>Machine Learning</h2>
                </div>

                <div
                  className="flex flex-col p-8 rounded-2xl shadow-xl border h-full"
                  style={{ background: t.bgCard, borderColor: t.bgCardBorder }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Trophy className="w-7 h-7" style={{ color: '#f59e0b' }} />
                    <h3 className="text-xl font-bold m-0 tracking-tight" style={{ color: t.textPrimary }}>Top Performing Model</h3>
                  </div>

                  <div className="text-5xl font-black mb-4 tracking-tight" style={{ color: t.accent1 }}>
                    {mlResult.best_model}
                  </div>
                  <div className="mb-8">
                    <span
                      className="inline-block px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider"
                      style={{ background: `${t.accent2}15`, color: t.accent2, border: `1px solid ${t.accent2}30` }}
                    >
                      {mlResult.task_type} • Target: {mlResult.target_column}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-10">
                    {mlResult.models.find(m => m.is_best) &&
                      Object.entries(mlResult.models.find(m => m.is_best)!.metrics).slice(0, 4).map(([key, val]) => (
                        <div
                          key={key}
                          className="p-5 rounded-xl border"
                          style={{ background: t.bg, borderColor: t.bgCardBorder }}
                        >
                          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: t.textMuted }}>
                            {key.replace(/_/g, ' ')}
                          </div>
                          <div className="text-3xl font-bold tracking-tight" style={{ color: t.textPrimary }}>
                            {typeof val === 'number' ? val.toFixed(4) : val}
                          </div>
                        </div>
                      ))
                    }
                  </div>

                  {mlResult.feature_importance.length > 0 && (
                    <div className="flex-1 min-h-[220px] mt-auto">
                      <div className="flex items-center gap-2 mb-6">
                        <Zap className="w-5 h-5" style={{ color: t.accent3 }} />
                        <h4 className="text-base font-bold uppercase tracking-wider" style={{ color: t.textPrimary }}>Top Features</h4>
                      </div>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mlResult.feature_importance.slice(0, 5)} layout="vertical" margin={{ left: -10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke={`${t.textMuted}30`} horizontal={false} />
                          <XAxis type="number" hide />
                          <YAxis dataKey="feature" type="category" tick={{ fill: t.textSecondary, fontSize: 13, fontWeight: 500 }} width={120} axisLine={false} tickLine={false} />
                          <Bar dataKey="importance" fill={t.accent1} radius={[0, 4, 4, 0]} maxBarSize={32} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* FORECAST */}
            {forecastResult && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 px-2">
                  <TrendingUp className="w-8 h-8" style={{ color: t.accent3 }} />
                  <h2 className="text-3xl font-bold tracking-tight m-0" style={{ color: t.textPrimary }}>Forecast</h2>
                </div>

                <div
                  className="flex flex-col p-8 rounded-2xl shadow-xl border h-full"
                  style={{ background: t.bgCard, borderColor: t.bgCardBorder }}
                >
                  <h3 className="text-xl font-bold mb-8 tracking-tight" style={{ color: t.textPrimary }}>
                    {forecastResult.value_column} Trend ({forecastResult.period} Days)
                  </h3>

                  <div className="w-full flex-1 min-h-[300px] mb-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={forecastResult.forecast}>
                        <CartesianGrid strokeDasharray="3 3" stroke={`${t.textMuted}30`} vertical={false} />
                        <XAxis dataKey="ds" tick={{ fill: t.textMuted, fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10}
                          tickFormatter={(v: string) => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })} />
                        <YAxis tick={{ fill: t.textMuted, fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} dx={-10} />
                        <Tooltip
                          contentStyle={{ background: t.bgCard, border: `1px solid ${t.bgCardBorder}`, borderRadius: 12, color: t.textPrimary, padding: '12px 16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                          itemStyle={{ color: t.textPrimary, fontWeight: 600, paddingBottom: 4 }}
                          labelStyle={{ color: t.textSecondary, marginBottom: 8, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        />
                        <Area type="monotone" dataKey="yhat_upper" stroke="none" fill={`${t.accent3}15`} />
                        <Area type="monotone" dataKey="yhat_lower" stroke="none" fill={t.bgCard} />
                        <Line type="monotone" dataKey="yhat" stroke={t.accent3} strokeWidth={3} dot={false} />
                        {forecastResult.forecast.some(p => p.actual != null) && (
                          <Line type="monotone" dataKey="actual" stroke={t.accent2} strokeWidth={2} dot={{ r: 3, fill: t.bgCard, stroke: t.accent2, strokeWidth: 2 }} strokeDasharray="4 4" />
                        )}
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {forecastResult.trend_summary && (
                    <div
                      className="mt-auto p-6 rounded-xl border text-base leading-relaxed"
                      style={{
                        background: `${t.accent3}08`,
                        borderColor: t.bgCardBorder,
                        color: t.textSecondary
                      }}
                    >
                      <strong style={{ color: t.textPrimary }} className="block mb-2 uppercase tracking-wider text-xs">Trend Summary:</strong>
                      {forecastResult.trend_summary}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== FOOTER ===== */}
        <div
          className="relative z-10 pt-12 mt-4 border-t flex flex-col items-center justify-center gap-4 text-center"
          style={{ borderColor: t.bgCardBorder }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: t.headerGradient }}
            >
              <Brain className="w-6 h-6" style={{ color: t.bg }} />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">
              <span
                style={{
                  background: t.headerGradient,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >Insight</span>
              <span style={{ color: t.textPrimary }}>AI</span>
            </span>
          </div>

          <div>
            <p className="text-base font-bold m-0" style={{ color: t.textPrimary }}>Generated by InsightAI</p>
            <p className="text-sm m-0 mt-1" style={{ color: t.textSecondary }}>AI-Powered Dataset Analytics Platform</p>
          </div>
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
  const tooltipStyle = { background: t.bgCard, border: `1px solid ${t.bgCardBorder}`, borderRadius: 12, color: t.textPrimary, padding: '12px 16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }

  switch (chart.chart_type) {
    case 'bar':
      return (
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={`${t.textMuted}30`} vertical={false} />
          <XAxis dataKey={xKey} tick={{ fill: t.textMuted, fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
          <YAxis tick={{ fill: t.textMuted, fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} dx={-10} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey={yKey} fill={t.accent1} radius={[6, 6, 0, 0]} maxBarSize={60} />
        </BarChart>
      )
    case 'pie':
      return (
        <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <Pie data={data} dataKey={yKey} nameKey={xKey} cx="50%" cy="50%" innerRadius={90} outerRadius={130} label={{ fill: t.textPrimary, fontSize: 13, fontWeight: 500 }}>
            {data.map((_, idx) => (
              <Cell key={idx} fill={chartColors[idx % chartColors.length]} stroke={t.bgCard} strokeWidth={3} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      )
    case 'line':
      return (
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={`${t.textMuted}30`} vertical={false} />
          <XAxis dataKey={xKey} tick={{ fill: t.textMuted, fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
          <YAxis tick={{ fill: t.textMuted, fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} dx={-10} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey={yKey} stroke={t.accent1} strokeWidth={4} dot={{ r: 5, fill: t.bgCard, stroke: t.accent1, strokeWidth: 3 }} activeDot={{ r: 8 }} />
        </LineChart>
      )
    case 'histogram':
      return (
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={`${t.textMuted}30`} vertical={false} />
          <XAxis dataKey={xKey} tick={{ fill: t.textMuted, fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
          <YAxis tick={{ fill: t.textMuted, fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} dx={-10} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey={yKey} fill={t.accent2} radius={[6, 6, 0, 0]} maxBarSize={70} />
        </BarChart>
      )
    case 'scatter':
      return (
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={`${t.textMuted}30`} vertical={false} />
          <XAxis dataKey={xKey} tick={{ fill: t.textMuted, fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} type="number" dy={10} />
          <YAxis tick={{ fill: t.textMuted, fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} dx={-10} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey={yKey} stroke={t.accent3} strokeWidth={0} dot={{ fill: t.accent3, r: 6 }} activeDot={{ r: 9 }} />
        </LineChart>
      )
    default:
      return (
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={`${t.textMuted}30`} vertical={false} />
          <XAxis dataKey={xKey} tick={{ fill: t.textMuted, fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
          <YAxis tick={{ fill: t.textMuted, fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} dx={-10} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey={yKey} fill={t.accent1} radius={[6, 6, 0, 0]} />
        </BarChart>
      )
  }
}
