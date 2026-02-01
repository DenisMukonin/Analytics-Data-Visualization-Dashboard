import axios, { type AxiosInstance, AxiosError } from 'axios'
import type { ApiResponse, ApiError, FilterState, Metric, DashboardConfig } from '@/types'
import { API_URL } from '@/config/env';

class ApiClient {
  private client: AxiosInstance

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Перехватываем все ошибки
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: error.message || 'Unknown error',
          status: error.response?.status || 0,
          code: error.code,
        };
        console.error('API Error:', apiError)
        return Promise.reject(apiError)
      }
    )

    // Добавить token к каждому запросу (если есть)
    // this.client.interceptors.request.use((config) => {
    //   const token = localStorage.getItem('auth_token')
    //   if (token) {
    //     config.headers.Authorization = `Bearer ${token}`
    //   }
    //   return config;
    // })
  }


  /**
   * Получить метрики за период
   * GET /api/metrics/timeseries?startDate=...&endDate=...&metrics=users,revenue
   */
  async getMetrics(filters: FilterState): Promise<Metric[]> {
    try {
      const response = await this.client.get<ApiResponse<Metric[]>>(
        '/metrics/timeseries',
        {
          params: {
            startDate: filters.dateRange.startDate.toISOString(),
            endDate: filters.dateRange.endDate.toISOString(),
            metrics: filters.selectedMetrics.join(','),
            ...(filters.dimensions && { dimensions: JSON.stringify(filters.dimensions) }),
          },
        }
      );
      return response.data.data
    } catch (error) {
      console.error('Не удалось получить метрики:', error)
      throw error
    }
  }


  /**
   * Получить конфигурацию дашборда пользователя
   */
  async getDashboardConfig(userId: string): Promise<DashboardConfig> {
    const response = await this.client.get<ApiResponse<DashboardConfig>>(
      `/dashboard/${userId}`
    )
    return response.data.data
  }

  /**
   * Сохранить конфигурацию дашборда
   * POST /api/dashboard
   */
  async saveDashboardConfig(config: DashboardConfig): Promise<DashboardConfig> {
    const response = await this.client.post<ApiResponse<DashboardConfig>>(
      '/dashboard',
      config
    )
    return response.data.data
  }

  /**
   * SSE (Server-Sent Events) для real-time обновлений метрик
   * Поток данных от сервера → клиент в реальном времени
   */
  subscribeToMetrics(onMessage: (data: Metric) => void, onError?: (error: Error) => void) {
    const eventSource = new EventSource(`${this.client.defaults.baseURL}/events`);

    eventSource.onmessage = (event) => {
      try {
        const metric: Metric = JSON.parse(event.data);
        onMessage(metric);
      } catch (error) {
        console.error('Failed to parse metric:', error);
      }
    };

    eventSource.onerror = () => {
      onError?.(new Error('EventSource connection failed'));
      eventSource.close();
    };

    // Возвращаем функцию для отключения подписки
    return () => {
      eventSource.close();
    };
  }


  /**
   * Экспортировать данные в CSV
   */
  async exportMetricsToCSV(filters: FilterState): Promise<Blob> {
    const response = await this.client.get('/metrics/export/csv', {
      params: {
        startDate: filters.dateRange.startDate.toISOString(),
        endDate: filters.dateRange.endDate.toISOString(),
      },
      responseType: 'blob',
    });
    return response.data;
  }
}

export const apiClient = new ApiClient(API_URL);