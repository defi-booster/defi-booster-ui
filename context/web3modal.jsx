"use client"

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react"

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

// 2. Set chains
const mainnet = {
    chainId: 1,
    name: "Ethereum",
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
    rpcUrl: "https://cloudflare-eth.com",
}

const base = {
    chainId: 8453,
    name: "Base",
    currency: "ETH",
    explorerUrl: "https://basescan.org",
    rpcUrl: "https://base.llamarpc.com",
}

const metadata = {
    name: "defi-engine",
    description: "defi engine",
    url: "http://127.0.0.1:3001", // origin must match your domain & subdomain
    icons: [""],
}
// 4. Create Ethers config
const ethersConfig = defaultConfig({
    /*Required*/
    metadata,

    /*Optional*/
    enableEIP6963: true, // true by default
    enableInjected: true, // true by default
    enableCoinbase: true, // true by default
    rpcUrl: "...", // used for the Coinbase SDK
    defaultChainId: 1, // used for the Coinbase SDK
})

// 5. Create a Web3Modal instance
createWeb3Modal({
    ethersConfig,
    chains: [mainnet, base],
    projectId,
    enableAnalytics: false, // Optional - defaults to your Cloud configuration
    enableOnramp: false, // Optional - false as default
})

export function Web3Modal({ children }) {
    return children
}
