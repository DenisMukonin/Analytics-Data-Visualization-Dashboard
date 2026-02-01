import { useEffect, useRef } from 'react';

/**
 * Hook для отслеживания предыдущего значения
 * Полезно для сравнения старого и нового значения
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}