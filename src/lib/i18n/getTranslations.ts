import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./constants"
import type { LangLocale, Translator } from "./types"

export async function getTranslations(lang: LangLocale = DEFAULT_LOCALE): Promise<Translator> {
  const { default: locale } = (
    SUPPORTED_LOCALES.includes(lang)
      ? await import(`../../locales/${lang}.json`)
      : { default: {} }
  )

  return function t(key: string, ...args: Array<string | Record<string, string>>): string {
    const result = key?.split(".").reduce((r, x) => r?.[x], locale) ?? null

    if (result && args?.length) {
      return replaceAllPlaceholders(result, args)
    }

    return result ?? key
  }
}

function replaceAllPlaceholders(value: string, args: Array<string | Record<string, string>>): string {
  return (
    typeof args[0] === "object"
      ? replaceNamedPlaceholders(value, args[0] as Record<string, string>)
      : replaceIndexedPlaceholders(value, args as Array<string>)
  )
}

function replaceIndexedPlaceholders(value: string, args: Array<string>): string {
  return value.replace(/\{\{(\d+)\}\}/g, (m: string, i: number) => args[i] ?? m)
}

function replaceNamedPlaceholders(value: string, dict: Record<string, string>): string {
  return value.replace(/\{\{(\w+)\}\}/g, (m: string, k: string) => dict[k] ?? m)
}
