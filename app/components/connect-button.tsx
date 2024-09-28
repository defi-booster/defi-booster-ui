"use client"
import { ethers } from "defi-booster-shared"
import React, { useEffect, useState } from "react"
import {
    Button,
    Spinner,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@nextui-org/react"
import {
    useWeb3Modal,
    useDisconnect,
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react"
import config from "../../my.config"
import { getNetworkNameFromID } from "../../libs/networks_utils"
import { useWeb3StatesContext } from "../../context/web3states"
import { v4 as uuidv4 } from "uuid"

export const ConnectButton = () => {
    // states
    const [signError, setSignError] = useState<string | null>(null)
    const [isSigning, setIsSigning] = useState(false)

    // web3 hooks
    const { open } = useWeb3Modal()
    const { disconnect } = useDisconnect()
    const { isConnected, address, chainId } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()
    const [web3State, setWeb3State] = useWeb3StatesContext()

    // nextui hooks
    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    // set current network
    useEffect(() => {
        const netName = getNetworkNameFromID(chainId)
        setWeb3State((prev) => ({
            ...prev,
            currentNetwork: netName,
        }))
    }, [chainId])

    // handle sign message
    useEffect(() => {
        if (isConnected && address) {
            const signed = localStorage.getItem(`isSigned_${address}`)

            if (signed !== "true") {
                const provider = new ethers.BrowserProvider(walletProvider)
                signMessage(provider, address)
            }
        }
    }, [isConnected, address])

    const signMessage = async (
        provider: ethers.BrowserProvider,
        address: string,
    ) => {
        if (!provider || !address) return

        try {
            setIsSigning(true)
            setSignError(null)

            const nonce = uuidv4()
            const message = `Log in to DeFi Booster to collect on-chain data for your 
            address ${address} at ${new Date().toISOString()}. 
            This action will not trigger any blockchain transactions. Nonce: ${nonce}`

            const signer = await provider.getSigner()
            // sign message using user pk (ECDSA - Elliptic Curve Digital Signature Algorithm)
            const signature = await signer.signMessage(message)

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/signature/verify`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ address, message, signature }),
                },
            )

            if (response.ok) {
                console.log("Signature verified and data processed!")
                localStorage.setItem(`isSigned_${address}`, "true")
            } else {
                setSignError("Verification failed!")
                onOpen()
                console.error("Verification failed")
            }
        } catch (error) {
            setSignError(
                `Please try again. If you still have problems, contact us at ${config.email}.`,
            )
            onOpen()
            console.error("Error signing message:", error)
        } finally {
            setIsSigning(false)
        }
    }

    return (
        <div>
            {isConnected ? (
                <div>
                    <Button
                        color="primary"
                        variant="ghost"
                        onClick={() => disconnect()}
                        disabled={isSigning}
                    >
                        {isSigning ? (
                            <Spinner label="" color="success" size="sm" />
                        ) : (
                            address.slice(0, 5) + "..." + address.slice(-4)
                        )}
                    </Button>

                    {signError && (
                        <div>
                            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                                <ModalContent>
                                    {(onClose) => (
                                        <>
                                            <ModalHeader className="flex flex-col gap-1">
                                                Error signing message.
                                            </ModalHeader>
                                            <ModalBody>
                                                <p>{signError}</p>
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button
                                                    color="danger"
                                                    variant="light"
                                                    onPress={onClose}
                                                >
                                                    Close
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        const provider =
                                                            new ethers.BrowserProvider(
                                                                walletProvider,
                                                            )
                                                        signMessage(
                                                            provider,
                                                            address,
                                                        )
                                                    }}
                                                    color="success"
                                                >
                                                    Try Again
                                                </Button>
                                            </ModalFooter>
                                        </>
                                    )}
                                </ModalContent>
                            </Modal>
                        </div>
                    )}
                    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">
                                        Error signing message.
                                    </ModalHeader>
                                    <ModalBody>
                                        <p>{signError}</p>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button
                                            color="danger"
                                            variant="light"
                                            onPress={onClose}
                                        >
                                            Close
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                const provider =
                                                    new ethers.BrowserProvider(
                                                        walletProvider,
                                                    )
                                                signMessage(provider, address)
                                            }}
                                            color="success"
                                        >
                                            Try Again
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </div>
            ) : (
                <Button color="primary" variant="ghost" onClick={() => open()}>
                    connect
                </Button>
            )}
        </div>
    )
}
