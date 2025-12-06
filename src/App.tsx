import { Layout } from './components/Layout'
import { WalletConnect } from './components/WalletConnect'
import { ChainSelector } from './components/ChainSelector'
import { ActivityList } from './components/ActivityList'
import { Search } from 'lucide-react'
import { useWalletStore } from './store/useWalletStore'

function App() {
  const { account, isConnecting, connectWallet, disconnectWallet } = useWalletStore();
  return (
    <Layout>
      <div className="relative flex flex-col items-center justify-center pt-10 pb-20 text-center">

        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1A1A1A] tracking-tight mb-3 mt-10">
          Your go-to portfolio tracker for <br/> Ethereum and EVM
        </h1>
        
        <p className="text-[#666666] text-sm md:text-base font-medium mb-12">
          Whale Asset Tracking, Paid Consultations, and Web3 Dynamic Community
        </p>

        <h2 className="text-xl text-[#333333] font-medium mb-6">
          Concise View of Portfolio Tracking
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-2xl px-4">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              className="w-full py-4 pl-12 pr-4 rounded-full border border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent shadow-sm"
              placeholder="Search address/Web3 ID"
            />
          </div>
          <button 
            onClick={() => account ? disconnectWallet() : connectWallet()}
            disabled={isConnecting}
            className="bg-brand-orange hover:bg-[#45b045] text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed">
            {isConnecting ? "Connecting..." : account ? `${account.slice(0,6)}...${account.slice(-4)}` : "Connect Wallet"}
          </button>
        </div>

        <div className="mt-20 w-full max-w-4xl text-left px-6">
           <h3 className="text-xl font-bold text-[#1A1A1A] mb-6">Tracking any Whale's Portfolio</h3>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 opacity-80 scale-95 origin-top">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
           <ChainSelector />
           <WalletConnect />
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-baseline mb-4">
          <h2 className="text-xl font-semibold text-[#1A1A1A]">Recent Activity</h2>
          </div>
          <ActivityList />
        </div>
      </div>
    </Layout>
  )
}

export default App
