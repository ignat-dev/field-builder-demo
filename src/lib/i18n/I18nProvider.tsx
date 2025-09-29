"use client"

import { LoadingOverlay } from "@/components/ui"
import type { ReactNode } from "react"
import { useEffect, useMemo, useState } from "react"
import { DEFAULT_LOCALE, I18nContext } from "./constants"
import { getTranslations } from "./getTranslations"
import type { Translator } from "./types"

interface Props {
  children: ReactNode
  initialLang?: string
}

export function I18nProvider({ children, initialLang = DEFAULT_LOCALE }: Props) {
  const [lang, setLang] = useState(initialLang)
  const [loading, setLoading] = useState(true)
  const [translator, setTranslator] = useState<Translator>((key: string) => key)
  const contextValue = useMemo(() => (
    { lang, setLang, t: translator }
  ), [lang, setLang, translator])

  useEffect(() => {
    let mounted = true

    setLoading(true)
    getTranslations(lang)
      .then((t) => {
        if (mounted) {
          setTranslator(() => t)
          setLoading(false)
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [lang])

  if (loading) {
    return (
      <LoadingOverlay visible={true} />
    )
  }

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  )
}
