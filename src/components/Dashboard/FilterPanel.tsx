import { useCallback } from 'react'
import { useDashboard } from '@/context/DashboardContext'
import { FilterState } from '@/types'
import { format, subDays } from 'date-fns'

interface FilterPanelProps {
  onaFilterChange?: (filters: FilterState) => void
}

export function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const { filters, setFilters } = useDashboard()

  const dateRangePresets = [
    { label: 'Last 7 days', getValue: () => ({ startDate: subDays(new Date(), 7), endDate: new Date() }) },
    { label: 'Last 30 days', getValue: () => ({ startDate: subDays(new Date(), 30), endDate: new Date() }) },
    { label: 'Last 90 days', getValue: () => ({ startDate: subDays(new Date(), 90), endDate: new Date() }) },
  ];

  const handleDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      const newFilters: FilterState = {
        ...filters,
        dateRange: {
          ...filters.dateRange,
          [name === 'startDate' ? 'startDate' : 'endDate']: new Date(value),
        },
      }
      setFilters(newFilters)
      onFilterChange?.(newFilters)
    }, [filters, setFilters, onFilterChange]
  )

  const handlePreset = useCallback(
    (preset: typeof dateRangePresets[0]) => {
      const newFilters: FilterState = {
        ...filters,
        dateRange: preset.getValue(),
      };
      setFilters(newFilters);
      onFilterChange?.(newFilters);
    },
    [filters, setFilters, onFilterChange]
  )

  const handleMetricToggle = useCallback(
    (metric: string) => {
      const newMetrics = filters.selectedMetrics.includes(metric)
        ? filters.selectedMetrics.filter((m) => m !== metric)
        : [...filters.selectedMetrics, metric];

      const newFilters: FilterState = {
        ...filters,
        selectedMetrics: newMetrics,
      };
      setFilters(newFilters);
      onFilterChange?.(newFilters);
    },
    [filters, setFilters, onFilterChange]
  )

  const availableMetrics = ['users', 'revenue', 'conversions', 'bounce_rate']
  

  return (
<div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="font-bold text-lg mb-4">Фильтры</h2>

      {/* Дата ранж */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-2">Период</h3>
        <div className="flex gap-2 mb-4">
          {dateRangePresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePreset(preset)}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">От:</label>
            <input
              type="date"
              name="startDate"
              value={format(filters.dateRange.startDate, 'yyyy-MM-dd')}
              onChange={handleDateChange}
              className="border px-3 py-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">До:</label>
            <input
              type="date"
              name="endDate"
              value={format(filters.dateRange.endDate, 'yyyy-MM-dd')}
              onChange={handleDateChange}
              className="border px-3 py-2 rounded w-full"
            />
          </div>
        </div>
      </div>

      {/* Выбор метрик */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Метрики</h3>
        <div className="flex flex-wrap gap-2">
          {availableMetrics.map((metric) => (
            <button
              key={metric}
              onClick={() => handleMetricToggle(metric)}
              className={`px-3 py-2 rounded text-sm transition ${
                filters.selectedMetrics.includes(metric)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {metric}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

}