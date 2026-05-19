import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, X, Sparkles } from 'lucide-react'
import type { ChatMessage } from '@/types'

interface Props {
  sessionId: string | null
  onSend: (message: string) => Promise<string>
}

const presetQuestions = [
  'What trends do you see?',
  'Summarize this dataset.',
  'Which feature affects revenue the most?',
  'What anomalies exist in the data?',
]

export default function AIChatPanel({ sessionId, onSend }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text?: string) => {
    const msg = text || input.trim()
    if (!msg || !sessionId || isLoading) return
    setInput('')
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: msg, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)
    try {
      const response = await onSend(msg)
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: response, timestamp: new Date() }])
    } catch {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', timestamp: new Date() }])
    }
    setIsLoading(false)
  }

  if (!sessionId) return null

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: '0 4px 30px rgba(99,102,241,0.4)' }}>
            <MessageSquare className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] rounded-2xl overflow-hidden flex flex-col"
            style={{ height: '500px', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)', background: 'rgba(26,26,46,0.8)' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">AI Assistant</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Ask about your dataset</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg transition-colors hover:bg-white/5">
                <X className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-6">
                  <Sparkles className="w-8 h-8 mx-auto mb-3" style={{ color: '#8b5cf6' }} />
                  <p className="text-sm font-medium text-white mb-3">Ask me anything about your data</p>
                  <div className="space-y-2">
                    {presetQuestions.map(q => (
                      <button key={q} onClick={() => handleSend(q)}
                        className="block w-full text-left text-xs px-3 py-2 rounded-lg transition-colors hover:bg-white/5"
                        style={{ color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="chat-bubble-ai flex items-center gap-2">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} className="w-2 h-2 rounded-full" style={{ background: '#8b5cf6' }}
                          animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-4 py-3" style={{ borderTop: '1px solid var(--color-border)' }}>
              <div className="flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about your data..."
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-gray-500 outline-none"
                  style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)' }} />
                <button onClick={() => handleSend()} disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
