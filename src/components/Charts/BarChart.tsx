import React, { useMemo } from 'react'
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Metric } from '@/types';

interface BarChartProps {
  data: Metric[],
  title: string,
  dataKey: string,
  fill?: string
}

export function BarChart({data, title, dataKey, fill = '#10b981'}: BarChartProps) {
  
  const chartData = useMemo(() => {
    return data.map((item) => ({
      name: item.name,
      [dataKey]: item.value,
    }))
  }, [data, dataKey])

  return (
    <div className='bg-gray-50 rounded-lg shadow-md p-4'>
      <h2 className='text-lg font-semibold mb-4'>{ title }</h2>

      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKey} fill={fill} radius={[8, 8, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )

}