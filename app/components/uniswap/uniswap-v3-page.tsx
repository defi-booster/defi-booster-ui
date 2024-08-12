"use client"
import { useWeb3ModalAccount } from "@web3modal/ethers/react"

import { useWeb3StatesContext } from "../../../context/web3states"
import { WalletLPList } from "./wallet-lp-list"

export function UniswapV3Page() {
    const [web3State] = useWeb3StatesContext()
    const { address, chainId, isConnected } = useWeb3ModalAccount()

    return isConnected ? (
        <WalletLPList network={web3State.currentNetwork} />
    ) : null
}
