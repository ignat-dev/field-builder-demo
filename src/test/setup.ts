import "@testing-library/jest-dom"
import { configure } from "@testing-library/react"
import type { ReactNode } from "react"

configure({
  getElementError: (message: string | null) => {
    const error = new Error(message ?? "Unexpected error occurred.")

    error.name = "TestingLibraryElementError"
    error.stack = undefined

    return error
  }
})

vi.mock("@/lib/i18n", () => ({
  I18nProvider: ({ children }: { children: ReactNode }) => children,
  useI18n: () => ({ lang: "en", setLang: () => {}, t: (key: string) => key }),
}))
