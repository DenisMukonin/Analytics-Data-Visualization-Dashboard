import './App.css'
import { DashboardProvider } from './context/DashboardContext';
import  Dashboard  from './components/Dashboard/Dashboard'
import  ErrorBoundary  from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <DashboardProvider>
        <header className='header'>
          <h1>Analytics & Data Visualization Dashboard</h1>
        </header>
        <main className='main'>
          <Dashboard />
        </main>
        <footer>
          <p> Тут будет footer</p>
        </footer>
      </DashboardProvider>
    </ErrorBoundary>
  )
}

export default App
