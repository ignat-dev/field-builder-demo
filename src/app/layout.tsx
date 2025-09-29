import { I18nProvider } from "@/lib/i18n"
import type { Metadata } from "next"

import "../styles/themes/bootstrap.scss"
import "../styles/main.scss"

export const metadata: Metadata = {
  title: "Field Builder Demo",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
