# ChainActivity

ChainActivity is a React-based portfolio tracker for Ethereum and compatible EVM chains. It allows users to connect their wallets, view their balances, and track recent transaction activity across supported networks.

## 🏗 Architecture and Component Structure

The application follows a modern React functional component architecture, utilizing **Vite** for the build tooling and **TypeScript** for type safety.

### Key Directories
- **`src/components/`**: Reusable UI components.
  - `ActivityList.tsx`: Fetches and displays transaction history using the Alchemy SDK.
  - `ChainSelector.tsx`: Allows users to switch between supported EVM networks.
  - `WalletConnect.tsx`: Manages wallet connection status and UI.
  - `Layout.tsx`: Provides the common page structure.
- **`src/store/`**: Contains global state management logic using **Zustand**.
  - `useWalletStore.ts`: Manages wallet adoption, connected account state, and network selection.
- **`src/utils/`**: Helper functions for blockchain interaction.
  - `ethereum.ts`: Wraps Alchemy SDK calls (`fetchWalletHistory`) and standard Ethers.js/Window provider interactions (`switchNetwork`).

### Data Flow
1.  **Wallet Connection**: handled via `window.ethereum` (injected providers like MetaMask/Phantom).
2.  **State Management**: `zustand` stores the current `account`, `chainId`, and `isConnecting` status accessible throughout the app.
3.  **Data Fetching**: The `ActivityList` component calls `fetchWalletHistory` (in `utils/ethereum.ts`), which queries the **Alchemy SDK** for past asset transfers.

---

## 🛠 Tech Choices

| Technology | Reason for Choice |
| :--- | :--- |
| **Vite** | Fast development server and optimized production builds. |
| **React 19** | Leveraging the latest React features for efficient UI rendering. |
| **Tailwind CSS 4** | Rapid UI development with utility-first styling and easy dark mode support. |
| **Alchemy SDK** | robust APIs for fetching historical transaction data (which is difficult with standard RPCs). |
| **Zustand** | Lightweight and boilerplate-free global state management compared to Redux/Context. |
| **Ethers.js** | Reliable library for interacting with the Ethereum blockchain and wallet providers. |

---

## ⚙️ Configuration

### Prerequisites
- Node.js (v18+ recommended)
- An [Alchemy](https://www.alchemy.com/) API Key.

### Setup Instructions

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/ItsRoy69/ChainActivity.git
    cd ChainActivity
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
    Open `.env` and add your Alchemy API key:
    ```env
    VITE_ALCHEMY_API_KEY=
    ```

4.  **Run the Development Server**:
    ```bash
    npm run dev
    ```

---

## ⚖️ Assumptions & Tradeoffs

-   **Hardcoded Token Prices**: The USD value calculation for transactions currently assumes a constant ETH price (set to $2500 in `ethereum.ts`) for simplicity. It does not fetch real-time price feeds.
-   **Limited Transaction History**: The app is configured to fetch only the last **10 transactions** to optimize performance (`maxCount: 10`).
-   **Wallet Provider**: The app assumes the user has a browser extension wallet (like MetaMask) installed (`window.ethereum`).
-   **Transaction Types**: Only `EXTERNAL` (native ETH transfers) and `ERC20` token transfers are fetched. Internal transactions or NFT transfers (ERC721/1155) are excluded from the main list.

---

## 🚧 Known Limitations & Future Improvements

-   **Dynamic Pricing**: Integrate a price feed (e.g., CoinGecko API) to show accurate real-time USD values for transactions.
-   **Pagination**: Implement "Load More" functionality for transaction history.
-   **Search Functionality**: The search bar in the UI is currently a placeholder or limited; wiring it up to view any address's activity (read-only mode) would be a key improvement.
-   **Multi-Chain Support**: Currently supports Ethereum Mainnet, Polygon, Arbitrum, and Optimism. Adding more chains requires updating `ethereum.ts` and `chains.ts`.
-   **Error Handling**: Better UI feedback for API rate limits or network timeouts.
