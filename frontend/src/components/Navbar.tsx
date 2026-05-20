import { motion } from 'framer-motion'
import { Brain, Sparkles } from 'lucide-react'

const navLinks = ['Overview', 'Analytics', 'ML Models', 'Forecast', 'AI Chat']

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{ padding: '12px 80px' }}
    >
      <div
        className="relative flex items-center justify-between h-14"
        id="navbar-card"
        style={{
          background: 'rgba(12, 12, 20, 0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow:
            '0 4px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
          padding: '0 10px',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 z-10">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="relative flex items-center justify-center w-9 h-9 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.35)',
            }}
          >
            <Brain className="w-5 h-5 text-white" />
          </motion.div>
          <span className="text-lg font-bold tracking-tight">
            <span className="gradient-text">Insight</span>
            <span className="text-white">AI</span>
          </span>
        </div>

        {/* Nav Links — absolutely centered */}
        <div className="hidden md:flex items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {navLinks.map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="relative text-sm font-medium rounded-lg transition-colors duration-200"
              style={{ color: 'var(--color-text-secondary)', padding: '8px 16px' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#f1f5f9'
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-secondary)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              {item}
            </motion.a>
          ))}
        </div>

        {/* AI Powered Badge */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="flex items-center gap-3 z-10"
        >
          <div
            className="flex items-center gap-2 rounded-full text-sm font-semibold cursor-default"
            style={{
              background:
                'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(52, 211, 153, 0.08))',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              boxShadow: '0 0 12px rgba(16, 185, 129, 0.1)',
              padding: '8px 18px',
            }}
          >
            <Sparkles className="w-4 h-4" />
            AI Powered
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}
