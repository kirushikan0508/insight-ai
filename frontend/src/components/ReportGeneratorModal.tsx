import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Image as ImageIcon, Download, FileText, Loader2, Wand2, LayoutTemplate } from 'lucide-react'
import type { DatasetOverview, ChartData, AIInsight, MLResult, ForecastResult } from '@/types'
import ReportPoster, { type ThemeKey } from './ReportPoster'
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

const themeOptions: { key: ThemeKey; name: string; desc: string; colors: string[] }[] = [
  { key: 'dark-analytics', name: 'Dark Analytics', desc: 'Premium deep blue gradient theme', colors: ['#0a0a0f', '#3b82f6', '#8b5cf6'] },
  { key: 'futuristic-ai', name: 'Futuristic AI', desc: 'Neon cyan & emerald tech theme', colors: ['#0a0f1a', '#06b6d4', '#10b981'] },
  { key: 'minimal-business', name: 'Minimal Business', desc: 'Clean slate & indigo professional', colors: ['#111116', '#6366f1', '#a78bfa'] },
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
      // Short delay to allow fonts/charts to render fully if needed
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const canvas = await captureReportAsCanvas(posterRef.current, 2) // 2x scale for hi-res
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
                className="fixed inset-0 z-50"
                style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed inset-4 md:inset-10 z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl"
                style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)' }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.15)' }}>
                      <Wand2 className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <Dialog.Title className="text-lg font-bold text-white m-0">AI Insight Poster Generator</Dialog.Title>
                      <Dialog.Description className="text-sm text-slate-400 m-0">Customize and download a professional analytics infographic</Dialog.Description>
                    </div>
                  </div>
                  <Dialog.Close asChild>
                    <button className="p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
                  {/* Left Sidebar - Controls */}
                  <div className="w-full md:w-80 flex-shrink-0 p-6 overflow-y-auto" style={{ borderRight: '1px solid var(--color-border)' }}>
                    
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <LayoutTemplate className="w-4 h-4 text-cyan-400" /> Select Theme
                    </h3>
                    <div className="flex flex-col gap-3 mb-8">
                      {themeOptions.map(opt => (
                        <button
                          key={opt.key}
                          onClick={() => setTheme(opt.key)}
                          className={`p-3 rounded-xl text-left transition-all ${theme === opt.key ? 'ring-2 ring-purple-500' : 'hover:bg-white/5'}`}
                          style={{
                            background: theme === opt.key ? 'rgba(139, 92, 246, 0.1)' : 'var(--color-bg-secondary)',
                            border: '1px solid',
                            borderColor: theme === opt.key ? 'transparent' : 'var(--color-border)',
                          }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-white text-sm">{opt.name}</span>
                            <div className="flex rounded-full overflow-hidden w-8 h-4">
                              {opt.colors.map(c => <div key={c} style={{ background: c, flex: 1 }} />)}
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 m-0">{opt.desc}</p>
                        </button>
                      ))}
                    </div>

                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                      <Download className="w-4 h-4 text-emerald-400" /> Download Format
                    </h3>
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => handleDownload('png')} disabled={isGenerating}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-slate-700/50 group"
                      >
                        <div className="flex items-center gap-3">
                          <ImageIcon className="w-5 h-5 text-blue-400" />
                          <div className="text-left">
                            <div className="text-sm font-semibold text-white">PNG Image</div>
                            <div className="text-xs text-slate-400">High quality, best for web</div>
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                      </button>
                      
                      <button
                        onClick={() => handleDownload('jpg')} disabled={isGenerating}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-slate-700/50 group"
                      >
                        <div className="flex items-center gap-3">
                          <ImageIcon className="w-5 h-5 text-amber-400" />
                          <div className="text-left">
                            <div className="text-sm font-semibold text-white">JPG Image</div>
                            <div className="text-xs text-slate-400">Smaller file size</div>
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                      </button>

                      <button
                        onClick={() => handleDownload('pdf')} disabled={isGenerating}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-slate-700/50 group"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-rose-400" />
                          <div className="text-left">
                            <div className="text-sm font-semibold text-white">PDF Document</div>
                            <div className="text-xs text-slate-400">A4 format, presentation ready</div>
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition-colors" />
                      </button>
                    </div>

                  </div>

                  {/* Right Content - Preview */}
                  <div className="flex-1 relative bg-black/40 overflow-hidden flex items-center justify-center p-8">
                    {/* The actual hidden element for html2canvas */}
                    <div style={{ position: 'absolute', top: -9999, left: -9999, pointerEvents: 'none' }}>
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

                    {/* Visual scaled preview of what will be generated */}
                    {/* We scale down the hidden poster size to fit the container visually */}
                    <div className="relative shadow-2xl rounded-lg overflow-hidden flex items-center justify-center" style={{ width: '100%', height: '100%', maxWidth: '800px' }}>
                      {/* Using iframe or scaled div isn't perfectly reliable for complex Recharts without rerendering. 
                          We will render a second ReportPoster here but scaled down via CSS transform. */}
                      <div style={{ 
                        transform: 'scale(min(0.4, calc(100vw / 1500)))', 
                        transformOrigin: 'center center',
                        pointerEvents: 'none'
                      }}>
                        <ReportPoster
                          theme={theme}
                          overview={overview}
                          charts={charts}
                          insights={insights}
                          mlResult={mlResult}
                          forecastResult={forecastResult}
                        />
                      </div>
                    </div>

                    {/* Generating Overlay */}
                    <AnimatePresence>
                      {isGenerating && (
                        <motion.div
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-md bg-black/60"
                        >
                          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
                          <h3 className="text-xl font-bold text-white mb-2">Generating Report...</h3>
                          <p className="text-slate-300">Rendering high-resolution {themeOptions.find(t => t.key === theme)?.name} poster</p>
                          
                          {/* Animated particles/glow */}
                          <div className="absolute w-64 h-64 rounded-full bg-purple-500/20 blur-3xl animate-pulse -z-10" />
                          <div className="absolute w-64 h-64 rounded-full bg-cyan-500/20 blur-3xl animate-pulse delay-75 -z-10 translate-x-10 translate-y-10" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
