import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import Navbar from '@/components/shared/Navbar'

export const metadata = {
  title: 'AgroBot',
  description: 'AI-powered plant disease detection & crop recommendation',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body>
        <Navbar />
        <main className="pt-2">
        {children}
        </main>
      </body>
    </html>
    </ClerkProvider>

  )
}