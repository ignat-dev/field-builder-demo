"use client"

import { createContext } from "react"
import { I18nContextValue } from "./types"

export const I18nContext = createContext<I18nContextValue | null>(null)

export const SUPPORTED_LOCALES: Array<string> = [ "de", "en", "es" ]

export const DEFAULT_LOCALE: typeof SUPPORTED_LOCALES[number] = "en"
