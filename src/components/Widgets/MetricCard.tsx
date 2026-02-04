import React from 'react'
import type { Metric } from '@/types'

interface MetricCardProps {
  metric: Metric,
  onClick?: () => void
}

export function MetricCard({metric, onClick}: MetricCardProps) {
  const isPositive = (metric.trend || 0) >= 0

  return (
    <div className='bg-gray-50 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition'
      onClick={onClick}
    >
      <p className='text-gray-500 text-sm mb-2'>{ metric.name }</p>
      <div className='flex justify-between items-end'>
        <div>
          <p className='text-3xl font-semibold'>
            {metric.value.toLocaleString()}
          </p>
          <p className='text-gray-400 text-xs'>{ metric.unit }</p>
        </div>
        { metric.trend !== undefined && (
          <div className={`text-sm font-semibold ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
            {isPositive ? '↑' : '↓'} {Math.abs(metric.trend)}%
          </div>
        )}
      </div>
    </div>
  )
}