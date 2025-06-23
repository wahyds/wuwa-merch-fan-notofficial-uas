// app/layout.js
import './globals.css'
import { Inter } from 'next/font/google'
import SessionProviderWrapper from './providers/SessionProviderWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Website Vtuber Merch',
  description: 'Platform jual beli merchandise Vtuber',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
