"use client"
import {
    useWeb3ModalProvider,
    useWeb3ModalAccount,
} from "@web3modal/ethers/react"

export default function ConnectionInfo() {
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()

    return (
        <div>
            <p>{isConnected ? "wallet connected" : "wallet not connected"}</p>
            <p>address {address}</p>
            <p>chain_id {chainId}</p>
        </div>
    )
}
