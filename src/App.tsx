import { Layout } from './components/Layout'
import { WalletConnect } from './components/WalletConnect'
import { ChainSelector } from './components/ChainSelector'
import { ActivityList } from './components/ActivityList'

function App() {
  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
         <ChainSelector />
         <WalletConnect />
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-baseline mb-4">
          <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
        </div>
        <ActivityList />
      </div>
    </Layout>
  )
}

export default App
