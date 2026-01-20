import './globals.css'

import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'

import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'

import { BookmarksBootstrap } from './_components/bookmarks-bootstrap'
import { ThemeProvider } from './_components/theme-provider'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Bookmark Manager App',
  description:
    'A simple and efficient bookmark manager application to organize and access your favorite websites with ease.',
  manifest: '/manifest.webmanifest',
  themeColor: '#001F1F',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.className} overflow-y-hidden bg-neutral-100 antialiased dark:bg-neutral-900`}
      >
        <BookmarksBootstrap />
        <SidebarProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-right" />
          </ThemeProvider>
        </SidebarProvider>
      </body>
    </html>
  )
}
