import React, { useEffect } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { useDashboard } from '@/context/DashboardContext';
import { apiClient } from '@/services/api';
import { FilterPanel } from './FilterPanel';
import { DashboardGrid } from './DashboardGrid';
import  ErrorBoundary  from '@/components/ErrorBoundary';


function Dashboard() {
  const { config, filters, setConfig } = useDashboard()
  const userId = 'user-123'

  const { data: dashboardConfig, status: loadStatus } = useAsync(
    () => apiClient.getDashboardConfig(userId),
    true,
    []
  )

  useEffect(() => {
    if (dashboardConfig && !config) {
      setConfig(dashboardConfig)
    }
  }, [dashboardConfig, config, setConfig])

  if (loadStatus == 'pending') {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-lg text-gray-500">Загружаю дашборд...</div>
      </div>
    )
  }

  if (loadStatus === 'error') {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 p-4">
        <h2 className="text-red-700 font-bold">Ошибка загрузки дашборда</h2>
        <p className="text-red-600">Пожалуйста, обновите страницу</p>
      </div>
    )
  }

  const handleFilterChange = async () => {
    // При изменении фильтров перезагрузить данные
    console.log('Фильтры изменены:', filters);
    // Здесь будет логика перезагрузки данных
  };



  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <FilterPanel onFilterChange={handleFilterChange} />
        <DashboardGrid />
      </div>
    </ErrorBoundary>
  )
}

export default Dashboard  