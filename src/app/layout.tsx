import type { Metadata } from "next"

import "../styles/themes/bootstrap.scss"
import "../styles/main.scss"

export const metadata: Metadata = {
  title: "Quickbase Field Builder",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
