"use client"
import React, { useEffect, useState } from "react"
import {
    useWeb3Modal,
    useDisconnect,
    useWeb3ModalAccount,
} from "@web3modal/ethers/react"
import { getNetworkNameFromID } from "../utils/utils"
import { SupportedChains } from "../utils/enums"

export const ConnectButton = () => {
    const [network, setNetwork] = useState<SupportedChains>(
        SupportedChains.Unsupported
    )
    const { open } = useWeb3Modal()
    const { disconnect } = useDisconnect()
    const { isConnected, address, chainId } = useWeb3ModalAccount()

    useEffect(() => {
        const netName = getNetworkNameFromID(chainId)
        setNetwork(netName)
    }, [chainId])

    return (
        <div>
            {isConnected ? (
                <div>
                    <button onClick={() => disconnect()}>
                        {address.slice(0, 5) + "..." + address.slice(-4)}
                    </button>
                    <p>network: {network}</p>
                </div>
            ) : (
                <button onClick={() => open()}>connect</button>
            )}
        </div>
    )
}
