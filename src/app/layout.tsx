import { PageHeader } from "@/components/blocks"
import { I18nProvider } from "@/lib/i18n"
import { ThemeProvider } from "@/lib/theme"
import type { Metadata } from "next"
import type { ReactNode } from "react"

import "../styles/main.scss"

export const metadata: Metadata = {
  title: "Field Builder Demo",
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <ThemeProvider>
          <I18nProvider>
            <PageHeader />
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
