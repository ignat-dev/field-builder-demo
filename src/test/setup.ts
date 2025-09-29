import "@testing-library/jest-dom"
import type { ReactNode } from "react"

vi.mock("@/lib/i18n", () => ({
  I18nProvider: ({ children }: { children: ReactNode }) => children,
  useI18n: () => ({ lang: "en", setLang: () => {}, t: (key: string) => key }),
}))
