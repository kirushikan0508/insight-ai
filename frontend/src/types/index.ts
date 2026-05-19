/* ============================================
   InsightAI — TypeScript Type Definitions
   ============================================ */

export interface DatasetOverview {
  filename: string
  rows: number
  columns: number
  missing_values: number
  duplicate_rows: number
  memory_usage: string
  column_info: ColumnInfo[]
  preview: Record<string, unknown>[]
}

export interface ColumnInfo {
  name: string
  dtype: string
  type_category: 'numeric' | 'categorical' | 'datetime' | 'text'
  missing: number
  unique: number
  sample_values: string[]
}

export interface CleaningSummary {
  missing_before: number
  missing_after: number
  duplicates_removed: number
  outliers_detected: number
  actions: string[]
}

export interface ChartData {
  chart_type: 'bar' | 'pie' | 'line' | 'scatter' | 'histogram' | 'heatmap' | 'box'
  title: string
  description: string
  data: Record<string, unknown>[]
  x_key?: string
  y_key?: string
  keys?: string[]
  colors?: string[]
}

export interface AIInsight {
  id: string
  title: string
  description: string
  category: 'trend' | 'pattern' | 'anomaly' | 'recommendation' | 'summary'
  importance: 'high' | 'medium' | 'low'
  icon?: string
}

export interface MLResult {
  task_type: 'classification' | 'regression'
  target_column: string
  models: ModelResult[]
  best_model: string
  feature_importance: FeatureImportance[]
  confusion_matrix?: number[][]
  predictions_vs_actual?: { actual: number; predicted: number }[]
  class_labels?: string[]
}

export interface ModelResult {
  name: string
  metrics: Record<string, number>
  is_best: boolean
}

export interface FeatureImportance {
  feature: string
  importance: number
}

export interface ForecastResult {
  forecast: ForecastPoint[]
  trend_summary: string
  date_column: string
  value_column: string
  period: number
}

export interface ForecastPoint {
  ds: string
  yhat: number
  yhat_lower: number
  yhat_upper: number
  actual?: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface UploadResponse {
  session_id: string
  overview: DatasetOverview
  cleaning: CleaningSummary
}

export interface AnalysisResponse {
  charts: ChartData[]
  insights: AIInsight[]
  statistics: Record<string, unknown>
}

export type AppState = 'idle' | 'uploading' | 'processing' | 'analyzing' | 'ready' | 'error'
