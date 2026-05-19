import { motion } from 'framer-motion'
import { Brain, Sparkles } from 'lucide-react'

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
      style={{
        background: 'rgba(10, 10, 15, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div
              className="relative flex items-center justify-center w-9 h-9 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
              }}
            >
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="gradient-text">Insight</span>
              <span className="text-white">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Overview', 'Analytics', 'ML Models', 'Forecast', 'AI Chat'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-sm font-medium transition-colors duration-200 hover:text-white"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.2)',
              }}
            >
              <Sparkles className="w-3 h-3" />
              AI Powered
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
