import { SUPPORTED_LOCALES } from "./constants"

export interface I18nContextValue {
  lang: string
  setLang: (lang: string) => void
  t: Translator
}

export type LangLocale = typeof SUPPORTED_LOCALES[number]

export type Translator = (key: string, ...args: Array<string | Record<string, string>>) => string
