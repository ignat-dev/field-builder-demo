import { I18nProvider } from "@/lib/i18n"
import type { Metadata } from "next"
import type { ReactNode } from "react"

import "../styles/themes/basic.scss"
import "../styles/main.scss"

export const metadata: Metadata = {
  title: "Field Builder Demo",
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
