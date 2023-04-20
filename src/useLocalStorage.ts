import { useState } from "react"

export const useLocalStorage = <T = unknown>(
  key: string,
  defaultValue: T
): [T, (newValue: T) => void] => {
  const [prevKey, setPrevKey] = useState<string>(key)
  const [storedValue, setStoredValue] = useState(() => readStorage(key, defaultValue))

  // if the key changes read the new value from local storage again
  // see: https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops
  if (key !== prevKey) {
    const newValue = readStorage(key, defaultValue)
    setStoredValue(newValue)
    setPrevKey(key)
  }

  const setValue = (newValue: T): void => {
    writeStorage(key, newValue)
    setStoredValue(newValue)
  }

  return [storedValue, setValue]
}

const writeStorage = <T = unknown>(key: string, value: T): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    // TODO: Add sentry or other error handling
    // eslint-disable-next-line no-console
    console.error("Something went wrong with useLocalStorage", err)
  }
}

const readStorage = <T = unknown>(key: string, defaultValue: T): T => {
  try {
    const value = window.localStorage.getItem(key)
    if (value) {
      return JSON.parse(value)
    }
    return defaultValue
  } catch (err) {
    return defaultValue
  }
}
