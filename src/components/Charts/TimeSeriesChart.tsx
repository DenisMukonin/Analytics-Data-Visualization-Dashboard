import React, { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, type TooltipProps, ResponsiveContainer } from 'recharts';
import type { Metric } from '@/types'
import { format } from 'date-fns';

interface TimeSeriesChartProps {
  data: Metric[],
  title: string,
  dataKey: string,
  stroke?: string,
  loading?: boolean
}

export function TimeSeriesChart({
  data,
  title,
  dataKey,
  stroke = '#3b82f6',
  loading = false,
}: TimeSeriesChartProps) {
  // Данные для графика
  const chartData = useMemo(() => {
    return data.map((item) => (
      {
        timestamp: format(new Date(item.timestamp), 'MMM dd'),
        [dataKey]: item.value,
        tooltip: format(new Date(item.timestamp), 'PPP')
      }
    ))
  }, [data, dataKey])

  // Для отображения tooltip
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
   
    if (active && payload && payload.length) {
      return (
        <div className="bg-emerald-700 p-2 border border-gray-300 rounded shadow-lg">
          <p className="text-sm font-medium">{payload[0].payload.tooltip}</p>
          <p className="text-sm text-blue-600">
            {payload[0].name}: {payload[0].value}
          </p>
        </div>
      );
    }

    return null
  }

  return (
    <div className='bg-gray-50 rounded-lg shadow-md p-4'>
      <h2 className='text-lg font-semibold mb-4'>{title}</h2>

      {
        loading && (
          <div className='flex justify-center items-center max-h-64'>
            <div className='animate-spin'>Зарузка ... </div>
          </div>
        )
      }

      {
        !loading && (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="timestamp"
                stroke="#666"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#666" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={stroke}
                dot={false}
                strokeWidth={2}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        )
      }
    </div>
  )
}