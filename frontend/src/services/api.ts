import axios from 'axios'
import type {
  UploadResponse,
  AnalysisResponse,
  MLResult,
  ForecastResult,
  AIInsight,
} from '@/types'

const api = axios.create({
  baseURL: '/api',
  timeout: 300000, // 5 min for ML training
})

export async function uploadDataset(file: File): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await api.post<UploadResponse>('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function getAnalysis(sessionId: string): Promise<AnalysisResponse> {
  const { data } = await api.get<AnalysisResponse>(`/analysis/${sessionId}`)
  return data
}

export async function getAIInsights(sessionId: string): Promise<AIInsight[]> {
  const { data } = await api.post<AIInsight[]>(`/ai/insights`, { session_id: sessionId })
  return data
}

export async function trainML(sessionId: string, targetColumn: string): Promise<MLResult> {
  const { data } = await api.post<MLResult>('/ml/train', {
    session_id: sessionId,
    target_column: targetColumn,
  })
  return data
}

export async function getForecast(
  sessionId: string,
  dateColumn: string,
  valueColumn: string,
  period: number
): Promise<ForecastResult> {
  const { data } = await api.post<ForecastResult>('/forecast', {
    session_id: sessionId,
    date_column: dateColumn,
    value_column: valueColumn,
    period,
  })
  return data
}

export async function sendChatMessage(
  sessionId: string,
  message: string
): Promise<{ response: string }> {
  const { data } = await api.post<{ response: string }>('/ai/chat', {
    session_id: sessionId,
    message,
  })
  return data
}

export default api
