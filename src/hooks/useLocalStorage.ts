import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Получить значение из localStorage при первой загрузке
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Ошибка при чтении ключа localStorage "${key}":`, error);
      return initialValue;
    }
  });

  // Синхронизировать изменения с localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Ошибка при записи ключа localStorage "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}