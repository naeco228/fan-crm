import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { Providers } from './providers'
import { getServerSession } from "next-auth"
import { AuthButton } from "@/components/AuthButton"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fan CRM',
  description: 'CRM для управления клиентами',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Providers>
          <nav className="border-b">
            <div className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-6">
                  <Link href="/" className="font-bold">Fan CRM</Link>
                  <Link href="/clients" className="hover:text-gray-600">Клиенты</Link>
                  <Link href="/reminders" className="hover:text-gray-600">Напоминания</Link>
                </div>
                {session && <AuthButton />}
              </div>
            </div>
          </nav>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}