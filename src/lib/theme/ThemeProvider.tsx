"use client"

import { LoadingOverlay } from "@/components/ui"
import { loadTheme } from "@/utils"
import { useEffect, useMemo, useState } from "react"
import { ThemeContext } from "./constants"
import { getThemes } from "./getThemes"

interface Props {
  children: React.ReactNode
  theme?: string
}

export function ThemeProvider({ children, theme: themeName }: Props) {
  const [theme, setTheme] = useState(themeName ?? "")
  const [themeMap, setThemeMap] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const contextValue = useMemo(() => (
    { setTheme, theme, themeList: Object.keys(themeMap) }
  ), [setTheme, theme, themeMap])


  useEffect(() => {
    let mounted = true

    setLoading(true)
    getThemes()
      .then((t) => {
        if (mounted) {
          setThemeMap(t)
          setTheme(Object.keys(t)[0] || "")
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
  }, [])

  useEffect(() => {
    if (theme && themeMap[theme]) {
      loadTheme(themeMap[theme])
    }
  }, [themeMap, theme])

  if (loading) {
    return (
      <LoadingOverlay visible={true} />
    )
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}
