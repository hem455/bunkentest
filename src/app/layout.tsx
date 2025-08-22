import type { Metadata } from 'next'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const noto = Noto_Sans_JP({ 
  subsets: ['latin'], 
  variable: '--font-noto',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Kotobalint - 日本語文章校正支援',
  description: 'ルールベース検出とLLM提案のハイブリッドアプローチによる日本語文章校正アプリケーション',
  keywords: ['日本語', '文章校正', 'proofreading', 'Japanese text', 'grammar check', 'kotobalint'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={`${inter.variable} ${noto.variable}`}>
      <body className="antialiased selection:bg-violet-200/50 font-sans">
        {children}
      </body>
    </html>
  )
}