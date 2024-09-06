"use client"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react"
import { Card, Divider } from "@nextui-org/react"

import { SupportedChains } from "../../utils/enums"

import { getNonFungiblePositionManagerContract } from "../../uniswapV3-lib/utils/get-contracts"

import {
    collectPositions,
    collectPosition,
    collectPools,
} from "../../uniswapV3-lib/collected-data"

import { Header } from "./card-components/header"
import { Price } from "./card-components/price"
import { Reserves } from "./card-components/reserves"
import { Ticks } from "./card-components/ticks"
import { TickPrices } from "./card-components/tick-prices"
import { UncollectedFees } from "./card-components/uncollected-fees"
import { PositionGauge } from "./card-components/gauge"

import { Positions, Pools } from "../../uniswapV3-lib/utils/types"

export function WalletLPList({ network }) {
    const [positions, setPositions] = useState<Positions>({})
    const [pools, setPools] = useState<Pools>({})
    const { address, chainId } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()

    useEffect(() => {
        if (
            walletProvider !== undefined &&
            network !== SupportedChains.Unsupported
        ) {
            const provider = new ethers.BrowserProvider(walletProvider)

            ;(async () => {
                const positions = await collectPositions(
                    provider,
                    chainId,
                    address,
                )

                const pools = await collectPools(provider, chainId, positions)

                setPositions(positions)
                setPools(pools)
            })()
        }
    }, [walletProvider, network, address])

    useEffect(() => {
        if (
            walletProvider !== undefined &&
            network !== SupportedChains.Unsupported
        ) {
            const provider = new ethers.BrowserProvider(walletProvider)

            const nfpmContract = getNonFungiblePositionManagerContract(
                provider,
                chainId,
            )

            const handleTransfer = (
                from: string,
                to: string,
                tokenId: bigint,
                event: ethers.EventLog,
            ) => {
                console.log(
                    `transfer event detected: from ${from} to ${to} for tokenId ${tokenId}`,
                )

                if (
                    from === ethers.ZeroAddress &&
                    to.toLowerCase() === address.toLowerCase()
                ) {
                    console.log(`Mint event detected for tokenId ${tokenId}`)
                    ;(async () => {
                        const position = await collectPosition(
                            provider,
                            chainId,
                            tokenId,
                        )

                        setPositions((prev) => ({
                            ...prev,
                            [`${tokenId}`]: position,
                        }))
                    })()
                } else if (from.toLowerCase() === address.toLowerCase()) {
                    console.log(`Position removed from tokenId ${tokenId}`)
                    ;(async () => {
                        setPositions((prev) => {
                            const updatedPosition = { ...prev }
                            delete updatedPosition[`${tokenId}`]
                            return updatedPosition
                        })
                    })()
                }
            }

            const handleIncreaseLiquidity = (
                tokenId: bigint,
                liquidity: bigint,
                amount0: bigint,
                amount1: bigint,
                event: ethers.EventLog,
            ) => {
                console.log(
                    `increaseLiquidity event detected by amounts ${amount0} and ${amount1} for tokenId ${tokenId}`,
                )
                ;(async () => {
                    const position = await collectPosition(
                        provider,
                        chainId,
                        tokenId,
                    )

                    setPositions((prev) => ({
                        ...prev,
                        [`${tokenId}`]: position,
                    }))
                })()
            }

            const handleDecreaseLiquidity = (
                tokenId: bigint,
                liquidity: bigint,
                amount0: bigint,
                amount1: bigint,
                event: ethers.EventLog,
            ) => {
                console.log(
                    `decreaseLiquidity event detected by amounts ${amount0} and ${amount1} for tokenId ${tokenId}`,
                )
                ;(async () => {
                    const position = await collectPosition(
                        provider,
                        chainId,
                        tokenId,
                    )

                    setPositions((prev) => ({
                        ...prev,
                        [`${tokenId}`]: position,
                    }))
                })()
            }

            const handleCollect = (
                tokenId: bigint,
                amount0: bigint,
                amount1: bigint,
                event: ethers.EventLog,
            ) => {}

            nfpmContract.on("Transfer", handleTransfer)
            nfpmContract.on("IncreaseLiquidity", handleIncreaseLiquidity)
            nfpmContract.on("DecreaseLiquidity", handleDecreaseLiquidity)
            nfpmContract.on("Collect", handleCollect)

            return () => {
                nfpmContract.off("Transfer", handleTransfer)
                nfpmContract.off("IncreaseLiquidity", handleIncreaseLiquidity)
                nfpmContract.off("DecreaseLiquidity", handleDecreaseLiquidity)
                nfpmContract.off("Collect", handleCollect)
            }
        }
    }, [walletProvider, network, address])

    return network !== SupportedChains.Unsupported ? (
        <div
            style={{
                margin: "20px",
                padding: "10px",
            }}
            className="gap-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
            {Object.keys(positions).map((tokenId, index) => {
                return (
                    <Card
                        className="max-w-[450px]"
                        key={index}
                        style={{ margin: "5px 0" }}
                    >
                        <Header
                            tokenId={tokenId}
                            token0Symbol={positions[tokenId].token0Symbol}
                            token1Symbol={positions[tokenId].token1Symbol}
                            fee={positions[tokenId].fee}
                        />
                        <Divider />
                        <Price
                            pool={
                                pools[
                                    `${positions[tokenId].token0Symbol}${positions[tokenId].token1Symbol}${positions[tokenId].fee}`
                                ]
                            }
                            position={positions[tokenId]}
                        />
                        <Divider />
                        <Reserves
                            pool={
                                pools[
                                    `${positions[tokenId].token0Symbol}${positions[tokenId].token1Symbol}${positions[tokenId].fee}`
                                ]
                            }
                            position={positions[tokenId]}
                        />
                        <Divider />
                        <Ticks
                            pool={
                                pools[
                                    `${positions[tokenId].token0Symbol}${positions[tokenId].token1Symbol}${positions[tokenId].fee}`
                                ]
                            }
                            position={positions[tokenId]}
                        />
                        <Divider />
                        <TickPrices
                            pool={
                                pools[
                                    `${positions[tokenId].token0Symbol}${positions[tokenId].token1Symbol}${positions[tokenId].fee}`
                                ]
                            }
                            position={positions[tokenId]}
                        />
                        <Divider />
                        <UncollectedFees
                            pool={
                                pools[
                                    `${positions[tokenId].token0Symbol}${positions[tokenId].token1Symbol}${positions[tokenId].fee}`
                                ]
                            }
                            position={positions[tokenId]}
                        />
                        <Divider />
                        {/* <CardBody>
                            <p>mint date: {data.mintDate}</p>
                        </CardBody>
                        <Divider /> */}
                        <PositionGauge
                            pool={
                                pools[
                                    `${positions[tokenId].token0Symbol}${positions[tokenId].token1Symbol}${positions[tokenId].fee}`
                                ]
                            }
                            position={positions[tokenId]}
                        />
                    </Card>
                )
            })}
        </div>
    ) : (
        <div>Unsupported network</div>
    )
}
