import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { DatasetOverview, CleaningSummary as CleaningType, ChartData, AIInsight, MLResult, ForecastResult, AppState } from '@/types'
import { uploadDataset, getAnalysis, getAIInsights, trainML, getForecast, sendChatMessage } from '@/services/api'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import FileUpload from '@/components/FileUpload'
import DatasetOverviewComp from '@/components/DatasetOverview'
import CleaningSummary from '@/components/CleaningSummary'
import InsightCards from '@/components/InsightCards'
import ChartsSection from '@/components/ChartsSection'
import MLPredictions from '@/components/MLPredictions'
import ForecastPanel from '@/components/ForecastPanel'
import AIChatPanel from '@/components/AIChatPanel'
import { ProcessingSteps } from '@/components/LoadingStates'
import ReportGeneratorModal from '@/components/ReportGeneratorModal'
import { Wand2 } from 'lucide-react'

export default function App() {
  const [appState, setAppState] = useState<AppState>('idle')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [processingStep, setProcessingStep] = useState(0)
  const [showReportModal, setShowReportModal] = useState(false)

  // Data states
  const [overview, setOverview] = useState<DatasetOverview | null>(null)
  const [cleaning, setCleaning] = useState<CleaningType | null>(null)
  const [charts, setCharts] = useState<ChartData[]>([])
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [mlResult, setMlResult] = useState<MLResult | null>(null)
  const [forecastResult, setForecastResult] = useState<ForecastResult | null>(null)
  const [isTrainingML, setIsTrainingML] = useState(false)
  const [isForecastLoading, setIsForecastLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = useCallback(async (file: File) => {
    setAppState('uploading')
    setProcessingStep(0)
    setError(null)
    setMlResult(null)
    setForecastResult(null)

    try {
      // Step 1-3: Upload + preprocess
      setProcessingStep(0)
      const uploadResult = await uploadDataset(file)
      setSessionId(uploadResult.session_id)
      setOverview(uploadResult.overview)
      setCleaning(uploadResult.cleaning)
      setProcessingStep(3)

      // Step 4-5: Analysis + Charts
      setAppState('analyzing')
      setProcessingStep(4)
      const analysisResult = await getAnalysis(uploadResult.session_id)
      setCharts(analysisResult.charts)
      setProcessingStep(5)

      // Step 6: AI Insights
      setProcessingStep(5)
      try {
        const aiInsights = await getAIInsights(uploadResult.session_id)
        setInsights(aiInsights)
      } catch {
        // AI insights are optional - continue if API key not configured
        setInsights([{
          id: '1', title: 'AI Insights Unavailable',
          description: 'Configure your Gemini API key in the backend .env file to enable AI-powered insights.',
          category: 'summary', importance: 'medium'
        }])
      }
      setProcessingStep(6)
      setAppState('ready')
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || 'Upload failed')
      setAppState('error')
    }
  }, [])

  const handleTrainML = useCallback(async (targetColumn: string) => {
    if (!sessionId) return
    setIsTrainingML(true)
    try {
      const result = await trainML(sessionId, targetColumn)
      setMlResult(result)
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'ML training failed')
    }
    setIsTrainingML(false)
  }, [sessionId])

  const handleForecast = useCallback(async (dateCol: string, valueCol: string, period: number) => {
    if (!sessionId) return
    setIsForecastLoading(true)
    try {
      const result = await getForecast(sessionId, dateCol, valueCol, period)
      setForecastResult(result)
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Forecasting failed')
    }
    setIsForecastLoading(false)
  }, [sessionId])

  const handleChat = useCallback(async (message: string): Promise<string> => {
    if (!sessionId) return 'Please upload a dataset first.'
    const { response } = await sendChatMessage(sessionId, message)
    return response
  }, [sessionId])

  const isProcessing = appState === 'uploading' || appState === 'analyzing'

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-primary)' }}>
      <Navbar />

      {/* Hero + Upload */}
      {appState === 'idle' && <HeroSection />}

      <FileUpload onUpload={handleUpload} isUploading={isProcessing} />

      {/* Processing indicator */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto px-6 lg:px-8">
            <ProcessingSteps currentStep={processingStep} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="max-w-3xl mx-auto px-4 mt-4">
            <div className="px-4 py-3 rounded-xl flex items-center gap-2"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <span className="text-sm" style={{ color: '#fca5a5' }}>{error}</span>
              <button onClick={() => setError(null)} className="ml-auto text-sm" style={{ color: '#fca5a5' }}>✕</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard sections */}
      <AnimatePresence>
        {appState === 'ready' && overview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <DatasetOverviewComp data={overview} />
            {cleaning && <CleaningSummary data={cleaning} />}
            {insights.length > 0 && <InsightCards insights={insights} />}
            {charts.length > 0 && <ChartsSection charts={charts} />}
            <MLPredictions columns={overview.column_info} onTrain={handleTrainML} result={mlResult} isTraining={isTrainingML} />
            <ForecastPanel columns={overview.column_info} onForecast={handleForecast} result={forecastResult} isLoading={isForecastLoading} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Chat */}
      <AIChatPanel sessionId={sessionId} onSend={handleChat} />

      {/* Generate Report FAB */}
      <AnimatePresence>
        {appState === 'ready' && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowReportModal(true)}
            className="fixed bottom-24 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-full text-white font-semibold shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              boxShadow: '0 8px 30px rgba(139, 92, 246, 0.4)',
            }}
          >
            <Wand2 className="w-5 h-5" />
            <span className="hidden sm:inline">Generate AI Report</span>
          </motion.button>
        )}
      </AnimatePresence>

      <ReportGeneratorModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        overview={overview}
        charts={charts}
        insights={insights}
        mlResult={mlResult}
        forecastResult={forecastResult}
      />

      {/* Footer */}
      <footer className="py-8 text-center" style={{ borderTop: '1px solid var(--color-border)' }}>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Built with ❤️ using React, FastAPI, and AI · <span className="gradient-text font-semibold">InsightAI</span>
        </p>
      </footer>
    </div>
  )
}
