"use client"
import React, { useEffect, useState } from "react"
import { Button } from "@nextui-org/react"
import {
    useWeb3Modal,
    useDisconnect,
    useWeb3ModalAccount,
} from "@web3modal/ethers/react"
import { getNetworkNameFromID } from "../utils/utils"
import { SupportedChains } from "../utils/enums"
import { useWeb3StatesContext } from "../../context/web3states"

export const ConnectButton = () => {
    const [web3State, setWeb3State] = useWeb3StatesContext()
    const [network, setNetwork] = useState<SupportedChains>(
        SupportedChains.Unsupported
    )
    const { open } = useWeb3Modal()
    const { disconnect } = useDisconnect()
    const { isConnected, address, chainId } = useWeb3ModalAccount()

    useEffect(() => {
        const netName = getNetworkNameFromID(chainId)
        setNetwork(netName)
        setWeb3State((prev) => ({
            ...prev,
            currentNetwork: netName,
        }))
    }, [chainId])

    return (
        <div>
            {isConnected ? (
                <div>
                    <Button
                        color="primary"
                        variant="ghost"
                        onClick={() => disconnect()}
                    >
                        {address.slice(0, 5) + "..." + address.slice(-4)}
                    </Button>
                </div>
            ) : (
                <Button color="primary" variant="ghost" onClick={() => open()}>
                    connect
                </Button>
            )}
        </div>
    )
}
