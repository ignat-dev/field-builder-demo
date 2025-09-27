export const createStorageMock = (init?: Record<string, string>) => {
  const storage: Record<string, string> = init ?? {}

  return {
    storage: {
      get: vi.fn().mockImplementation((key: string) => {
        const item = storage[key] ?? ""

        return item ? JSON.parse(item) : null
      }),

      set: vi.fn().mockImplementation((key: string, value: unknown) => {
        storage[key] = JSON.stringify(value)
      }),

      remove: vi.fn().mockImplementation((key: string) => {
        delete storage[key]
      }),
    },
  }
}
