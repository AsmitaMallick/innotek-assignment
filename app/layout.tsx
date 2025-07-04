import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CSV Summary Generator',
  description: 'A web application that allows users to upload a CSV file containing sales data.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
