"use client"
import { useWeb3ModalAccount } from "@web3modal/ethers/react"
import { useEffect, useState } from "react"

import { useWeb3StatesContext } from "../../../context/web3states"
import { WalletLPList } from "./wallet-lp-list"

export function UniswapV3Page() {
    const [mounted, setMounted] = useState(false)
    const [web3State] = useWeb3StatesContext()
    const { isConnected } = useWeb3ModalAccount()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return isConnected ? (
        <WalletLPList network={web3State.currentNetwork} />
    ) : null
}
