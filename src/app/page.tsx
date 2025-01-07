'use client'

import { WalletStatus } from './components/WalletStatus'
import { EnhancedPostScheduler } from './components/EnhancedPostScheduler'
import { Toaster } from '@/components/ui/toaster'
import { useAccount } from "wagmi"

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
      <div className='flex items-center justify-between w-full mb-8'>
        <h1 className="text-4xl font-bold text-white">Lens Post Scheduler</h1>
        <WalletStatus />
      </div>
      {isConnected && <EnhancedPostScheduler />}
      <Toaster />
    </main>
  )
}

