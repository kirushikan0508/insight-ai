import { motion } from 'framer-motion'
import { Upload, Sparkles, BarChart3, Brain, TrendingUp } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg pt-16">
      {/* Ambient glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-float"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.08), transparent 70%)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-float"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08), transparent 70%)', animationDelay: '3s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.04), transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
          }}
        >
          <Sparkles className="w-4 h-4" style={{ color: '#8b5cf6' }} />
          <span className="text-sm font-medium" style={{ color: '#c4b5fd' }}>
            AI-Powered Analytics Platform
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6"
        >
          <span className="text-white">Upload Any Dataset &</span>
          <br />
          <span className="gradient-text">Get AI-Powered Insights</span>
          <br />
          <span className="text-white">Instantly</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl max-w-3xl mx-auto mb-12"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Automatic analytics, visualizations, predictions, and forecasting
          powered by AI and Machine Learning.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <a
            href="#upload"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-white font-semibold text-base transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              boxShadow: '0 4px 30px rgba(99, 102, 241, 0.3)',
            }}
          >
            <Upload className="w-5 h-5" />
            Upload Dataset
          </a>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mt-16"
        >
          {[
            { icon: BarChart3, label: 'Auto Visualizations' },
            { icon: Brain, label: 'ML Predictions' },
            { icon: TrendingUp, label: 'Forecasting' },
            { icon: Sparkles, label: 'AI Insights' },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: 'rgba(26, 26, 46, 0.6)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
              }}
            >
              <Icon className="w-4 h-4" style={{ color: '#8b5cf6' }} />
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div
          className="w-6 h-10 rounded-full flex items-start justify-center pt-2"
          style={{ border: '2px solid rgba(148, 163, 184, 0.2)' }}
        >
          <div
            className="w-1.5 h-3 rounded-full"
            style={{ background: 'var(--color-accent-purple)' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
