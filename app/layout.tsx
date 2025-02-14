import "./globals.css"
import type { Metadata } from "next"
import RootLayoutClient from "./RootLayoutClient"

export const metadata: Metadata = {
  title: "运势与性格分析",
  description: "一个全面的运势与性格分析工具",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>
        <main style={{ height: "100vh", width:'100wv' }}>
          <RootLayoutClient>{children}</RootLayoutClient>
        </main>
      </body>
    </html>
  )
}

