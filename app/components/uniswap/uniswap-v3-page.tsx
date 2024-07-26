"use client"
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react"

import { useWeb3StatesContext } from "../../../context/web3states"
import { WalletLPList } from "./wallet-lp-list"
import { useEffect } from "react"

export function UniswapV3Page() {
    const [web3State] = useWeb3StatesContext()
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()

    return isConnected ? (
        <div
            style={{
                border: "1px solid black",
                margin: "20px",
                padding: "10px",
            }}
        >
            <WalletLPList network={web3State.currentNetwork} />
        </div>
    ) : null
}
