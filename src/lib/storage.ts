export const storage = {
  get<T = unknown>(key: string): T | null {
    try {
      const value = getStorage()?.getItem(key) ?? null

      return (value !== null) ? (JSON.parse(value) as T) : null
    } catch (ex) {
      console.error(`[storage] Failed to get item with key "${key}".`, ex)

      return null
    }
  },

  set<T = unknown>(key: string, value: T): void {
    try {
      getStorage()?.setItem(key, JSON.stringify(value))
    } catch (ex) {
      console.error(`[storage] Failed to set item with key "${key}".`, ex)
    }
  },

  remove(key: string): void {
    try {
      getStorage()?.removeItem(key)
    } catch (ex) {
      console.error(`[storage] Failed to remove item with key "${key}".`, ex)
    }
  },
}

function getStorage(): Storage | null {
  return (typeof window !== "undefined") ? window.localStorage : null
}
