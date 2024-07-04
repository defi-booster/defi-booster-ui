"use client"
import {
    useWeb3Modal,
    useDisconnect,
    useWeb3ModalAccount,
} from "@web3modal/ethers/react"

export default function ConnectButton() {
    const { open } = useWeb3Modal()
    const { disconnect } = useDisconnect()
    const { isConnected } = useWeb3ModalAccount()

    return (
        <>
            {isConnected ? (
                <button onClick={() => disconnect()}>disconnect</button>
            ) : (
                <button onClick={() => open()}>connect</button>
            )}
        </>
    )
}
