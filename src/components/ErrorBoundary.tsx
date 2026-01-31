// function ErrorBoundary() {
//   return (
//     <>

//     </>
//   )
// }

// export default ErrorBoundary

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Обновляем state, чтобы следующий рендер показал fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Логируем ошибку в консоль
    console.error('ErrorBoundary поймал ошибку:', error, errorInfo);
    
    // Сохраняем детали ошибки в state для отображения
    this.setState({
      error,
      errorInfo
    });

    // Отправляем на сервис мониторинга (например, Sentry)
    // logErrorToService(error, errorInfo);
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
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo?.componentStack}
          </details>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Перезагрузить страницу
          </button>
        </div>
      );
    }

    return (<>{this.props.children}</>)
  }
}

export default ErrorBoundary;
