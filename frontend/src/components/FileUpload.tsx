import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileSpreadsheet, X, CheckCircle, AlertCircle } from 'lucide-react'

interface FileUploadProps {
  onUpload: (file: File) => void
  isUploading: boolean
}

export default function FileUpload({ onUpload, isUploading }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const validExts = ['.csv', '.xlsx', '.xls']

  const validateFile = (file: File): boolean => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!validExts.includes(ext)) { setError('Please upload a CSV or Excel file'); return false }
    if (file.size > 50 * 1024 * 1024) { setError('File size must be under 50MB'); return false }
    setError(null); return true
  }

  const handleFile = useCallback((file: File) => {
    if (validateFile(file)) { setSelectedFile(file); onUpload(file) }
  }, [onUpload])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragOver(false)
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0])
  }, [handleFile])

  const formatSize = (b: number) => b < 1024 ? b + ' B' : b < 1048576 ? (b/1024).toFixed(1)+' KB' : (b/1048576).toFixed(1)+' MB'

  return (
    <section id="upload" className="section">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="section-title gradient-text">Upload Your Dataset</h2>
          <p className="section-subtitle mx-auto mt-2">Drop a CSV or Excel file to begin automatic analysis</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          <div className={`upload-zone ${isDragOver ? 'drag-over' : ''}`}
            onDrop={handleDrop} onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
            onDragLeave={() => setIsDragOver(false)} onClick={() => inputRef.current?.click()}>
            <input ref={inputRef} type="file" accept=".csv,.xlsx,.xls" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" />
            <AnimatePresence mode="wait">
              {isUploading ? (
                <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: 'rgba(139,92,246,0.2)', borderTopColor: '#8b5cf6' }} />
                  <p className="font-semibold text-white">Processing your dataset...</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Analyzing structure, cleaning data, generating insights</p>
                </motion.div>
              ) : selectedFile && !error ? (
                <motion.div key="selected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
                  <CheckCircle className="w-12 h-12" style={{ color: '#10b981' }} />
                  <p className="font-semibold text-white">{selectedFile.name}</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{formatSize(selectedFile.size)}</p>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))', border: '1px solid rgba(139,92,246,0.2)' }}>
                    <Upload className="w-7 h-7" style={{ color: '#8b5cf6' }} />
                  </div>
                  <p className="font-semibold text-white">Drag & drop your dataset here</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>or click to browse · CSV, XLSX supported · Max 50MB</p>
                  <div className="flex items-center gap-2 mt-2">
                    <FileSpreadsheet className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>.csv · .xlsx · .xls</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 mt-4 px-4 py-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertCircle className="w-4 h-4" style={{ color: '#ef4444' }} />
                <span className="text-sm" style={{ color: '#fca5a5' }}>{error}</span>
                <button onClick={() => { setSelectedFile(null); setError(null) }} className="ml-auto"><X className="w-4 h-4" style={{ color: '#fca5a5' }} /></button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
