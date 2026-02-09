import React, { useCallback } from 'react'
import GridLayout from 'react-grid-layout'
import { useDashboard } from '@/context/DashboardContext'
import type { Widget } from '@/types'
import { TimeSeriesChart } from '@/components/Charts/TimeSeriesChart'
import { BarChart } from '@/components/Charts/BarChart'
import { MetricCard } from '@/components/Widgets/MetricCard'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

export function  DashboardGrid() {
  const {config, setConfig, filters} = useDashboard()

  if (!config || config.widgets.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-white rounded-lg">
        <p className="text-gray-500">Нет виджетов на дашборде. Добавьте первый!</p>
      </div>
    )
  }

  const handleLayoutChange = useCallback(
    (newLayout: any) => {
      const updateWidgets = config.widgets.map((widget) => {
        const layoutItem = newLayout.find((item: any) => item.i === widget._id)

        if (layoutItem) {
          return {
            ...widget,
            position: { x: layoutItem.x, y: layoutItem.y },
            size: { w: layoutItem.w, h: layoutItem.h },
          }
        }

        return widget
      })

      setConfig({ ...config, widgets: updateWidgets })
    }, [config, setConfig]
  )


  const layout = config.widgets.map((w) => ({
    i: w._id,
    x: w.position.x,
    y: w.position.y,
    w: w.size.w,
    h: w.size.h,
  }))


  const renderWidget = (widget: Widget) => {
    const mockData = [
      { id: '1', name: 'Day 1', value: 100, unit: 'units', timestamp: new Date() },
      { id: '2', name: 'Day 2', value: 120, unit: 'units', timestamp: new Date() },
    ]

    switch (widget.type) {
      case 'line-chart':
        return <TimeSeriesChart data={mockData} title={widget.title} dataKey="value" />
      case 'bar-chart':
        return <BarChart data={mockData} title={widget.title} dataKey="value" />
      case 'metric':
        return (
          <MetricCard
            metric={{
              _id: widget._id,
              name: widget.title,
              value: 1234,
              unit: 'units',
              trend: 5,
              timestamp: new Date(),
            }}
          />
        )
      default:
        return <div className="p-4">Unknown widget type: {widget.type}</div>
    }
  }


  return (
    <GridLayout 
      className="layout"
      layout={layout}
      onLayoutChange={handleLayoutChange}
      width={1200}
      isDraggable
      isResizable
      compactType="vertical"
      preventCollision
      cols={12}
      rowHeight={30}
      containerPadding={[0, 0]}
      margin={[10, 10]}
    >
      {
        config.widgets.map((widget) => (
          <div className='bg-gray-50 rounded-lg shadow-md overflow-hidden'>
            <div className='px-4 py-2 bg-gray-100 border-b border-gray-200'>
              <h3 className="font-semibold text-sm">{widget.title}</h3>
            </div>
            <div className='px-4 py-2'>
              {renderWidget(widget)}
            </div>
          </div>
        ))
      }
    </GridLayout>
  )


}