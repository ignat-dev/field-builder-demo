"use client"

import { SUPPORTED_LOCALES, useI18n } from "@/lib/i18n"
import { useTheme } from "@/lib/theme"

import "./PageHeader.scss"

export default function PageHeader() {
  const { t } = useI18n("blocks.PageHeader")
  const { lang, setLang } = useI18n()
  const { theme, themeList, setTheme } = useTheme()

  return (
    <header className="page-header">
      <h1>{t("info.title")}</h1>
      <div className="settings-wrapper">
        {renderSwitcher(t("settings.language.label"), SUPPORTED_LOCALES, lang, setLang)}
        {renderSwitcher(t("settings.theme.label"), themeList, theme, setTheme)}
      </div>
    </header>
  )

  function renderSwitcher(label: string, items: Array<string>, value: string, onSelect?: (value: string) => void) {
    const id = `${label.toLowerCase()}Switcher`

    return (
      <div className="setting-switcher">
        <label htmlFor={id}>{label}:</label>
        <select
          id={id}
          size={1}
          value={value}
          onChange={(e) => onSelect?.(e.target.value)}
        >
          {items.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>
    )
  }
}
