import  { createContext, useState, useCallback, useContext } from 'react';

// Создаём контекст
export const DashboardContext = createContext('');

// Provider компонент
export function DashboardProvider({ children }) {
  // Состояние фильтров
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'month',
    search: ''
  });

  // Состояние данных dashboard
  const [dashboardData, setDashboardData] = useState({
    metrics: [],
    charts: [],
    loading: false,
    error: null
  });

  const CONST_THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000
  // Состояние временного периода
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - CONST_THIRTY_DAYS), // 30 дней назад
    endDate: new Date()
  });

  // Функция для загрузки данных
  const fetchDashboardData = useCallback(async (currentFilters = filters) => {
    setDashboardData(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Имитируем API запрос
      const response = await fetch('/api/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filters: currentFilters,
          dateRange
        })
      });

      if (!response.ok) throw new Error('Ошибка загрузки данных');

      const data = await response.json();

      setDashboardData({
        metrics: data.metrics,
        charts: data.charts,
        loading: false,
        error: null
      });
    } catch (error) {
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  }, [filters, dateRange]);

  // Функция для обновления фильтров
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  // Функция для сброса фильтров
  const resetFilters = useCallback(() => {
    setFilters({
      status: 'all',
      dateRange: 'month',
      search: ''
    });
  }, []);

  // Функция для обновления временного периода
  const updateDateRange = useCallback((startDate, endDate) => {
    setDateRange({ startDate, endDate });
  }, []);

  // Объект значений для контекста
  const value = {
    // Состояние
    filters,
    dashboardData,
    dateRange,
    
    // Функции
    fetchDashboardData,
    updateFilters,
    resetFilters,
    updateDateRange
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

// Custom hook для использования контекста
export function useDashboard() {
  const context = useContext(DashboardContext);
  
  if (!context) {
    throw new Error('useDashboard должен использоваться внутри DashboardProvider');
  }
  
  return context;
}
