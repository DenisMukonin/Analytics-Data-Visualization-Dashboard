import { useState, useEffect } from 'react';

/**
 * Hook для debounce - откладывает выполнение функции
 * Полезно для поиска, чтобы не делать запрос на каждый символ
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}