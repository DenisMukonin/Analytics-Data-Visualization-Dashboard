import  { createContext, useState, useCallback, useContext } from 'react';
import type { DashboardConfig, FilterState, Widget } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';


interface DashboardContextType {
  config: DashboardConfig | null;
  filters: FilterState;
  
  // Actions
  setConfig: (config: DashboardConfig) => void;
  setFilters: (filters: FilterState) => void;
  addWidget: (widget: Widget) => void;
  removeWidget: (widgetId: string) => void;
  updateWidget: (widgetId: string, updates: Partial<Widget>) => void;
  reorderWidgets: (widgets: Widget[]) => void;
}

// Создаём контекст
export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Provider компонент
export function DashboardProvider({ children }: { children: React.ReactNode }) {
  // Состояние фильтров
  // const [filters, setFilters] = useState({
  //   status: 'all',
  //   dateRange: 'month',
  //   search: ''
  // });
  const CONST_THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000
  const [config, setConfig] = useState<DashboardConfig | null>(null);

  const [filters, setFilters] = useLocalStorage<FilterState>('dashboardFilters', {
    dateRange: {
      startDate: new Date(Date.now() - CONST_THIRTY_DAYS), 
      endDate: new Date(),
    },
    selectedMetrics: [],
  });

  // Действия для работы с виджетами
  const addWidget = useCallback((widget: Widget) => {
    if (!config) return;
    setConfig({
      ...config,
      widgets: [...config.widgets, widget],
    });
  }, [config]);

  const removeWidget = useCallback((widgetId: string) => {
    if (!config) return;
    setConfig({
      ...config,
      widgets: config.widgets.filter((w) => w._id !== widgetId),
    });
  }, [config]);

  const updateWidget = useCallback((widgetId: string, updates: Partial<Widget>) => {
    if (!config) return;
    setConfig({
      ...config,
      widgets: config.widgets.map((w) =>
        w._id === widgetId ? { ...w, ...updates } : w
      ),
    });
  }, [config]);

  const reorderWidgets = useCallback((widgets: Widget[]) => {
    if (!config) return;
    setConfig({
      ...config,
      widgets,
    });
  }, [config]);

  const value: DashboardContextType = {
    config,
    filters,
    setConfig,
    setFilters,
    addWidget,
    removeWidget,
    updateWidget,
    reorderWidgets,
  };


  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );

//   // Состояние данных dashboard
//   const [dashboardData, setDashboardData] = useState({
//     metrics: [],
//     charts: [],
//     loading: false,
//     error: null
//   });


//   // Состояние временного периода
//   const [dateRange, setDateRange] = useState({
//     startDate: new Date(Date.now() - CONST_THIRTY_DAYS), // 30 дней назад
//     endDate: new Date()
//   });

//   // Функция для загрузки данных
//   const fetchDashboardData = useCallback(async (currentFilters = filters) => {
//     setDashboardData(prev => ({ ...prev, loading: true, error: null }));

//     try {
//       // Имитируем API запрос
//       const response = await fetch('/api/dashboard', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           filters: currentFilters,
//           dateRange
//         })
//       });

//       if (!response.ok) throw new Error('Ошибка загрузки данных');

//       const data = await response.json();

//       setDashboardData({
//         metrics: data.metrics,
//         charts: data.charts,
//         loading: false,
//         error: null
//       });
//     } catch (error) {
//       setDashboardData(prev => ({
//         ...prev,
//         loading: false,
//         error: error.message
//       }));
//     }
//   }, [filters, dateRange]);

//   // Функция для обновления фильтров
//   const updateFilters = useCallback((newFilters) => {
//     setFilters(prev => ({
//       ...prev,
//       ...newFilters
//     }));
//   }, []);

//   // Функция для сброса фильтров
//   const resetFilters = useCallback(() => {
//     setFilters({
//       status: 'all',
//       dateRange: 'month',
//       search: ''
//     });
//   }, []);

//   // Функция для обновления временного периода
//   const updateDateRange = useCallback((startDate, endDate) => {
//     setDateRange({ startDate, endDate });
//   }, []);

//   // Объект значений для контекста
//   const value = {
//     // Состояние
//     filters,
//     dashboardData,
//     dateRange,
    
//     // Функции
//     fetchDashboardData,
//     updateFilters,
//     resetFilters,
//     updateDateRange
//   };

//   return (
//     <DashboardContext.Provider value={value}>
//       {children}
//     </DashboardContext.Provider>
//   );
}

// Custom hook для использования контекста
export function useDashboard(): DashboardContextType {
  const context = useContext(DashboardContext);
  
  if (!context) {
    throw new Error('useDashboard должен использоваться внутри <DashboardProvider>');
  }
  
  return context;
}
