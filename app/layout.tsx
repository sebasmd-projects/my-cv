import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'QA Analyst & Full Stack Developer | Python, Java, React',
  description: 'Analista de Calidad con mas de 7 anos de experiencia en desarrollo de software y QA. Especializado en automatizacion de pruebas, Python/Django, Java/Spring y React/Next.js.',
  keywords: 'QA Analyst, Full Stack Developer, Python, Django, Java, Spring, React, Next.js, Test Automation, Selenium, Karate, Robot Framework, CI/CD, DevOps',
  authors: [{ name: 'QA Developer' }],
  openGraph: {
    title: 'QA Analyst & Full Stack Developer',
    description: 'Senior QA Engineer con experiencia en automatizacion de pruebas y desarrollo full stack.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrainsMono.variable} bg-background`} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
