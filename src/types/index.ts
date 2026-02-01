export interface Metric {
  _id: string,
  name: string,
  value: number,
  unit: string,
  trend?: number,
  timestamp: Date
}

export interface AnalyticsEvent {
  _id: string,
  userId: string,
  eventType: 'page_view' | 'click' | 'purchase' | 'signup',
  properties: Record<string, unknown>,
  timestamp: Date
}

export interface Widget {
  _id: string,
  title: string,
  type: 'line-chart' | 'bar-chart' | 'metric' | 'table',
  config: Record<string, unknown>,
  position: { x: number, y: number },
  size: { w: number, h: number }
}

// State
export interface DashboardConfig {
  _id: string,
  userId: string,
  name: string, 
  widgets: Widget[],
  createdAt: Date,
  updatedAt?: Date
}

export interface DateRange {
  startDate: Date,
  endDate: Date
}

export interface FilterState {
  dateRange: DateRange,
  selectedMetrics: string[], 
  dimensions?: Record<string, string>, 
  comparison?: 'month-over-month' | 'year-over-year'
}

// Api
export interface ApiResponse<T> {
  data: T,
  status: number,
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[],
  total: number,
  page: number,
  limit: number
}

// Для ошибок
export interface ApiError {
  message: string,
  status: number,
  code?: string
}
