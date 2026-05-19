import { motion } from 'framer-motion'

export function SkeletonCard() {
  return (
    <div className="card">
      <div className="skeleton h-4 w-1/3 mb-4" />
      <div className="skeleton h-48 w-full mb-4" />
      <div className="skeleton h-3 w-2/3" />
    </div>
  )
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="stat-card">
          <div className="skeleton h-10 w-10 rounded-xl mb-3" />
          <div className="skeleton h-6 w-16 mb-2" />
          <div className="skeleton h-3 w-20" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonCharts() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (<SkeletonCard key={i} />))}
    </div>
  )
}

export function AIThinking() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 py-12">
      <div className="relative">
        <div className="w-20 h-20 rounded-full animate-pulse-glow flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))', border: '1px solid rgba(139,92,246,0.2)' }}>
          <svg className="w-8 h-8" style={{ color: '#8b5cf6' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
            <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
          </svg>
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-ping" style={{ background: '#8b5cf6' }} />
      </div>
      <p className="font-semibold text-white">AI is analyzing your data...</p>
      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>This may take a moment</p>
    </motion.div>
  )
}

export function ProcessingSteps({ currentStep }: { currentStep: number }) {
  const steps = ['Reading Dataset', 'Detecting Columns', 'Cleaning Data', 'Running EDA', 'Generating Charts', 'AI Insights', 'Complete']
  return (
    <div className="max-w-md mx-auto py-8">
      {steps.map((step, i) => (
        <motion.div key={step} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
          className="flex items-center gap-3 py-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: i <= currentStep ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(148,163,184,0.1)',
              color: i <= currentStep ? 'white' : 'var(--color-text-muted)',
            }}>
            {i < currentStep ? '✓' : i + 1}
          </div>
          <span className="text-sm" style={{ color: i <= currentStep ? 'white' : 'var(--color-text-muted)' }}>{step}</span>
          {i === currentStep && <div className="w-4 h-4 rounded-full animate-ping ml-auto" style={{ background: 'rgba(139,92,246,0.5)' }} />}
        </motion.div>
      ))}
    </div>
  )
}
