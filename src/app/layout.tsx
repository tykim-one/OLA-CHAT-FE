
import './globals.css'
import { Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        <title>OLA Suite</title>
        <meta name="description" content="OLA Suite" />
      </head>
      <body className="font-pretendard antialiased bg-current">
           
          <main>{children}</main>
        
      </body>
    </html>
  )
}
