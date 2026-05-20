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
          className="inline-flex items-center gap-3 rounded-full mb-8"
          style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            padding: '10px 24px',
          }}
        >
          <Sparkles className="w-5 h-5" style={{ color: '#8b5cf6' }} />
          <span className="text-base font-medium" style={{ color: '#c4b5fd' }}>
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
          className="text-lg sm:text-xl max-w-3xl mx-auto mb-24"
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
          className="mt-12 mb-28 flex justify-center"
        >
          {/* <a
            href="#upload"
            className="inline-flex items-center justify-center gap-4 min-w-[280px] sm:min-w-[360px] py-6 px-12 rounded-full text-white font-extrabold text-lg sm:text-xl tracking-wider uppercase transition-all duration-500 hover:scale-110 shadow-2xl border-2 border-white/20 hover:border-white/40"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)',
              backgroundSize: '200% auto',
              boxShadow: '0 12px 40px rgba(139, 92, 246, 0.5), 0 0 20px rgba(6, 182, 212, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundPosition = 'right center';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundPosition = 'left center';
            }}
          >
            <Upload className="w-6 h-6 animate-bounce" />
            Upload Dataset
          </a> */}
        </motion.div>

      </div>

    </section>
  )
}
