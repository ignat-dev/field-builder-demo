import type { Metadata } from "next"

import "bootstrap/dist/css/bootstrap.min.css"
import "./globals.css"

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
