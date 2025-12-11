import { useState } from 'react'
import { Layout } from './components/Layout'
import { WalletConnect } from './components/WalletConnect'
import { ChainSelector } from './components/ChainSelector'
import { ActivityList } from './components/ActivityList'
import { TokenList } from './components/TokenList'
import { NFTGallery } from './components/NFTGallery'
import { Search, Activity, Coins, Image as ImageIcon } from 'lucide-react'
import { useWalletStore } from './store/useWalletStore'

function App() {
  const { account, isConnecting, connectWallet, disconnectWallet, fetchHistory, fetchTokens, fetchNFTs, setAccount } = useWalletStore();
  const [searchInput, setSearchInput] = useState('');
  const [activeTab, setActiveTab] = useState<'activity' | 'tokens' | 'nfts'>('activity');

  const handleSearch = () => {
    if (searchInput.trim()) {
      setAccount(searchInput.trim());
      fetchHistory();
      fetchTokens();
      fetchNFTs();
    }
  };
  return (
    <Layout>
      <div className="relative flex flex-col items-center justify-center pt-10 pb-20 text-center">

        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1A1A1A] dark:text-white tracking-tight mb-3 mt-10">
          Your go-to portfolio tracker for <br/> Ethereum and EVM
        </h1>
        
        <p className="text-[#666666] dark:text-gray-400 text-sm md:text-base font-medium mb-12">
          Track your wallet activity across Ethereum and compatible EVM chains
        </p>

        <h2 className="text-xl text-[#333333] dark:text-gray-200 font-medium mb-6">
          Concise View of Portfolio Tracking
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-2xl px-4">
          <div className="relative flex-1 w-full">
            <div 
              className="absolute inset-y-0 left-4 flex items-center cursor-pointer hover:text-brand-orange transition-colors"
              onClick={handleSearch}
            >
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full py-4 pl-12 pr-4 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent shadow-sm"
              placeholder="Search address/Web3 ID"
            />
          </div>
          <button 
            onClick={() => searchInput.trim() ? handleSearch() : (account ? disconnectWallet() : connectWallet())}
            disabled={isConnecting}
            className="bg-brand-orange hover:bg-[#45b045] text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed">
            {searchInput.trim() 
              ? "Search Address" 
              : isConnecting 
                ? "Connecting..." 
                : account 
                  ? `${account.slice(0,6)}...${account.slice(-4)}` 
                  : "Connect Wallet"
            }
          </button>
        </div>
      </div>

      {account && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
             <ChainSelector />
             <WalletConnect />
          </div>

          <div className="mt-8">
            <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-800 overflow-x-auto no-scrollbar">
                <button 
                  onClick={() => setActiveTab('activity')}
                  className={`pb-2 px-4 font-medium flex items-center gap-2 transition-colors relative whitespace-nowrap ${activeTab === 'activity' ? 'text-brand-orange' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                >
                  <Activity size={18} />
                  Activity
                  {activeTab === 'activity' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-orange" />}
                </button>
                <button 
                  onClick={() => setActiveTab('tokens')}
                  className={`pb-2 px-4 font-medium flex items-center gap-2 transition-colors relative whitespace-nowrap ${activeTab === 'tokens' ? 'text-brand-orange' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                >
                  <Coins size={18} />
                  Tokens
                  {activeTab === 'tokens' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-orange" />}
                </button>
                <button 
                  onClick={() => setActiveTab('nfts')}
                  className={`pb-2 px-4 font-medium flex items-center gap-2 transition-colors relative whitespace-nowrap ${activeTab === 'nfts' ? 'text-brand-orange' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                >
                  <ImageIcon size={18} />
                  NFTs
                  {activeTab === 'nfts' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-orange" />}
                </button>
            </div>
            
            {activeTab === 'activity' ? <ActivityList /> : activeTab === 'tokens' ? <TokenList /> : <NFTGallery />}
          </div>
        </div>
      )}
    </Layout>
  )
}

export default App
