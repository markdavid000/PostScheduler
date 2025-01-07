import { Web3Provider } from './providers/Web3Provider'
import './globals.css'
import type { Metadata } from 'next'
import { Provider } from "@/components/ui/provider"


export const metadata: Metadata = {
  title: 'Lens Post Scheduler',
  description: 'Schedule posts for your Lens profile',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
          <Provider>
            {children}
          </Provider>
        </Web3Provider>
      </body>
    </html>
  )
}

