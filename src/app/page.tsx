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
      {isConnected ? <EnhancedPostScheduler /> : <div className="relative flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-purple-700 to-indigo-900 animate-gradient">
        {/* <!-- Content --> */}
        <div className="text-center text-white space-y-6">
          {/* <!-- Hero Heading --> */}
          <h1 id="hero-heading" className="text-4xl md:text-6xl font-extrabold leading-tight">
            Empower Your Content on Lens Protocol
          </h1>

          {/* <!-- Subheading --> */}
          <p className="text-lg md:text-xl font-medium">
            Schedule, manage, and amplify your posts effortlessly. Connect your wallet to start creating magic.
          </p>

          {/* <!-- Connect Button --> */}
          <button
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold text-lg shadow-lg transform transition duration-300 hover:scale-105"
          >
            Connect Wallet to Get Started
          </button>
        </div>

        {/* <!-- Floating Icons --> */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl animate-floating"></div>
          <div className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-white/20 rounded-full blur-2xl animate-floating delay-2000"></div>
          <div className="absolute top-1/4 right-1/5 w-12 h-12 bg-white/5 rounded-full blur-md animate-floating delay-1000"></div>
        </div>
      </div>}
      <Toaster />
    </main>
  )
}

