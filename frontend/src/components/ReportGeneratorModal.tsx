import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Image as ImageIcon, Download, FileText, Loader2, LayoutTemplate } from 'lucide-react'
import type { DatasetOverview, ChartData, AIInsight, MLResult, ForecastResult } from '@/types'
import ReportPoster, { type ThemeKey, themes } from './ReportPoster'
import { captureReportAsCanvas, downloadAsPNG, downloadAsJPG, downloadAsPDF } from '@/services/reportExport'

interface Props {
  isOpen: boolean
  onClose: () => void
  overview: DatasetOverview | null
  charts: ChartData[]
  insights: AIInsight[]
  mlResult: MLResult | null
  forecastResult: ForecastResult | null
}

const themeOptions: { key: ThemeKey; name: string; colors: string[] }[] = [
  { key: 'dark-analytics', name: 'Dark Analytics', colors: ['#0a0a0f', '#3b82f6', '#8b5cf6'] },
  { key: 'futuristic-ai', name: 'Futuristic AI', colors: ['#0a0f1a', '#06b6d4', '#10b981'] },
  { key: 'minimal-business', name: 'Minimal Business', colors: ['#111116', '#6366f1', '#a78bfa'] },
]

export default function ReportGeneratorModal({
  isOpen, onClose, overview, charts, insights, mlResult, forecastResult
}: Props) {
  const [theme, setTheme] = useState<ThemeKey>('dark-analytics')
  const [isGenerating, setIsGenerating] = useState(false)
  const posterRef = useRef<HTMLDivElement>(null)

  const handleDownload = async (format: 'png' | 'jpg' | 'pdf') => {
    if (!posterRef.current || !overview) return
    setIsGenerating(true)
    
    try {
      // Small delay to ensure all renders and animations are fully settled
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const canvas = await captureReportAsCanvas(posterRef.current, 2)
      const filename = `${overview.filename.replace(/\.[^/.]+$/, '')}_AI_Report`
      
      if (format === 'png') downloadAsPNG(canvas, filename)
      if (format === 'jpg') downloadAsJPG(canvas, filename)
      if (format === 'pdf') downloadAsPDF(canvas, filename)
      
    } catch (error) {
      console.error('Failed to generate report:', error)
      alert('Failed to generate report image. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'auto'
    return () => { document.body.style.overflow = 'auto' }
  }, [isOpen])

  if (!overview) return null

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed inset-0 md:inset-4 lg:inset-8 z-50 flex flex-col rounded-none md:rounded-2xl overflow-hidden shadow-2xl"
                style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)' }}
              >
                {/* Fixed Header & Controls */}
                <div className="flex-shrink-0 z-20 backdrop-blur-md bg-black/40 border-b border-white/10 p-4 md:px-6">
                  <div className="flex items-center justify-between mb-4">
                    <Dialog.Title className="text-xl md:text-2xl font-bold text-white m-0 tracking-tight">
                      AI Insight Poster Generator
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
                        <X className="w-6 h-6" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* Theme Selector */}
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                      <LayoutTemplate className="w-5 h-5 text-slate-400 flex-shrink-0 hidden md:block" />
                      {themeOptions.map(opt => (
                        <button
                          key={opt.key}
                          onClick={() => setTheme(opt.key)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${
                            theme === opt.key ? 'ring-2 ring-purple-500 bg-white/10 text-white' : 'hover:bg-white/5 text-slate-300'
                          }`}
                          style={{ border: '1px solid', borderColor: theme === opt.key ? 'transparent' : 'var(--color-border)' }}
                        >
                          <div className="flex rounded-full overflow-hidden w-4 h-4 shadow-sm border border-black/20">
                            {opt.colors.map(c => <div key={c} style={{ background: c, flex: 1 }} />)}
                          </div>
                          <span className="text-sm font-semibold">{opt.name}</span>
                        </button>
                      ))}
                    </div>

                    {/* Download Buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => handleDownload('png')} disabled={isGenerating}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 transition-all disabled:opacity-50"
                      >
                        <ImageIcon className="w-4 h-4 text-blue-400" /> PNG
                      </button>
                      <button
                        onClick={() => handleDownload('jpg')} disabled={isGenerating}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 transition-all disabled:opacity-50"
                      >
                        <ImageIcon className="w-4 h-4 text-amber-400" /> JPG
                      </button>
                      <button
                        onClick={() => handleDownload('pdf')} disabled={isGenerating}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 transition-all disabled:opacity-50"
                      >
                        <FileText className="w-4 h-4 text-rose-400" /> PDF
                      </button>
                    </div>
                  </div>
                </div>

                {/* Scrollable Preview Area */}
                <div 
                  className="flex-1 overflow-y-auto overflow-x-hidden relative p-4 md:p-8 custom-scrollbar"
                  style={{ background: '#05080f' }}
                >
                  <div className="flex justify-center w-full min-h-full origin-top">
                    <div 
                      className="origin-top"
                      style={{ 
                        transform: 'scale(var(--poster-scale, 1))',
                        width: '1600px', // matches ReportPoster width
                        transition: 'transform 0.1s' 
                      }}
                    >
                      <div className="rounded-3xl overflow-hidden shadow-2xl">
                        <ReportPoster
                          ref={posterRef}
                          theme={theme}
                          overview={overview}
                          charts={charts}
                          insights={insights}
                          mlResult={mlResult}
                          forecastResult={forecastResult}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Scaling Script */}
                  <style>{`
                    .custom-scrollbar {
                      --container-width: calc(100vw - 4rem);
                    }
                    @media (max-width: 768px) {
                      .custom-scrollbar { --container-width: 100vw; }
                    }
                    .origin-top {
                      --poster-scale: min(1, calc(var(--container-width) / 1640));
                    }
                  `}</style>

                  {/* Generating Overlay */}
                  <AnimatePresence>
                    {isGenerating && (
                      <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-xl bg-black/60 rounded-none md:rounded-3xl"
                      >
                        <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Generating Poster...</h3>
                        <p className="text-slate-300 font-medium">Capturing layout in high-resolution</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
