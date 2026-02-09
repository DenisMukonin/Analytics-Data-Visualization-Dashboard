import  { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}
class ErrorBoundary extends Component<Props, State>  {
  constructor(props: Props) {
    super(props)
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null 
    }
  }

  static getDerivedStateFromError(_: Error) {
    // Обновляем state, чтобы следующий рендер показал fallback UI
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary поймал ошибку:', error, errorInfo)
    
    // Сохраняем детали ошибки в state для отображения
    this.setState({
      error,
      errorInfo
    })

    // Отправляем на сервис мониторинга (например, Sentry)
    // logErrorToService(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          margin: '20px',
          border: '2px solid #ff6b6b',
          borderRadius: '8px',
          backgroundColor: '#ffe0e0',
          color: '#c92a2a'
        }}>
          <h2>⚠️ Что-то пошло не так</h2>
          <p className="text-red-600 text-sm mb-4">{this.state.error?.message}</p>
          <p className="text-gray-500 text-xs mb-4">{this.state.errorInfo?.componentStack}</p>
          
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Обновить страницу
          </button>
        </div>
      )
    }

    return (<>{this.props.children}</>)
  }
}

export default ErrorBoundary
