import { useContext } from "react"
import { I18nContext } from "./constants"
import type { I18nContextValue, Translator } from "./types"

export function useI18n(namespace?: string): I18nContextValue {
  const context = useContext(I18nContext)

  if (!context) {
    throw new Error("useI18n() must be used within I18nProvider.")
  }

  if (!namespace) {
    return context
  }

  return {
    ...context,
    t: (...[key, ...args]: Parameters<Translator>) => context.t(`${namespace}.${key}`, ...args),
  }
}
