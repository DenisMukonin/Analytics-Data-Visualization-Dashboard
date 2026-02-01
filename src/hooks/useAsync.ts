import { useState, useEffect, useCallback, useRef } from 'react'

interface AsyncState<T> {
  status: 'idle' | 'pending' | 'success' | 'error',
  data: T | null,
  error: Error | null
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true,
  dependencies: unknown[] = []
) {
  const [state, setState] = useState<AsyncState<T>>({
    status: 'idle',
    data: null,
    error: null,
  });

  // useRef чтобы избежать бесконечных loops
  const isMountedRef = useRef(true);

  const execute = useCallback(async () => {
    setState({ status: 'pending', data: null, error: null })
    try {
      const response = await asyncFunction()
      // Проверяем, еще ли компонент смонтирован
      if (isMountedRef.current) {
        setState({ status: 'success', data: response, error: null })
      }
    } catch (error) {
      if (isMountedRef.current) {
        setState({ status: 'error', data: null, error: error as Error })
      }
    }
  }, [asyncFunction])

  useEffect(() => {
    isMountedRef.current = true
    if (immediate) {
      execute()
    }
    return () => {
      isMountedRef.current = false
    }
  }, [execute, immediate, ...dependencies])

  return { ...state, execute }
}