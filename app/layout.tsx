import "./globals.css"
import "./components.css"
import type { Metadata } from "next"
import { Inter, Open_Sans } from "next/font/google"

const inter = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-opensans",
})

const roboto = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
})

export const metadata: Metadata = {
  title: "Deriv",
  description: "Deriv Automated Trading",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang='en'
      className={`${inter.variable} ${roboto.variable} font-sans`}
    >
      <body>{children}</body>
    </html>
  )
}
