import { motion } from 'framer-motion'
import { BarChart3, LayoutGrid } from 'lucide-react'
import type { ChartData } from '@/types'
import BarChartCard from '@/charts/BarChartCard'
import PieChartCard from '@/charts/PieChartCard'
import LineChartCard from '@/charts/LineChartCard'
import ScatterChartCard from '@/charts/ScatterChartCard'
import HistogramCard from '@/charts/HistogramCard'
import HeatmapCard from '@/charts/HeatmapCard'

const chartComponents: Record<string, React.FC<{ chart: ChartData }>> = {
  bar: BarChartCard,
  pie: PieChartCard,
  line: LineChartCard,
  scatter: ScatterChartCard,
  histogram: HistogramCard,
  heatmap: HeatmapCard,
}

export default function ChartsSection({ charts }: { charts: ChartData[] }) {
  return (
    <section id="analytics" className="section">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <BarChart3 className="w-8 h-8" style={{ color: '#06b6d4' }} />
            <h2 className="section-title !mb-0">Automatic Visualizations</h2>
          </div>
          <p className="section-subtitle">Charts auto-generated based on your dataset structure</p>
        </motion.div>
        <div className="grid md:grid-cols-2 w-full max-w-6xl mx-auto" style={{ gap: '32px' }}>
          {charts.map((chart, i) => {
            const Component = chartComponents[chart.chart_type] || BarChartCard
            return <Component key={i} chart={chart} />
          })}
        </div>
        {charts.length === 0 && (
          <div className="card text-center py-16 max-w-6xl mx-auto w-full">
            <LayoutGrid className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-muted)' }} />
            <p style={{ color: 'var(--color-text-muted)' }}>No charts generated yet</p>
          </div>
        )}
      </div>
    </section>
  )
}
