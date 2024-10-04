"use client"
import { ethers } from "defi-booster-shared"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react"
import { Button, Card, Divider } from "@nextui-org/react"

import { Header } from "./card-components/header"
import { Price } from "./card-components/price"
import { Reserves } from "./card-components/reserves"
import { Ticks } from "./card-components/ticks"
import { TickPrices } from "./card-components/tick-prices"
import { UncollectedFees } from "./card-components/uncollected-fees"
import { PositionGauge } from "./card-components/gauge"

import config from "../../../my.config"

import { UNISWAP_V3_TPositions, UNISWAP_V3_TPools } from "defi-booster-shared"
import { EUniswapV3SupportedChains } from "defi-booster-shared"
import { getNonFungiblePositionManagerContract } from "defi-booster-shared"

import {
    fetchPosition,
    fetchPool,
    fetchPositionsAndPools,
} from "../../api/uniswapv3"

import styles from "../../styles/uniswapv3/WalletLPLst.module.css"

export function WalletLPList({ network }) {
    // states
    const [positions, setPositions] = useState<UNISWAP_V3_TPositions>({})
    const [pools, setPools] = useState<UNISWAP_V3_TPools>({})
    const [triggerRefresh, setTriggerRefresh] = useState(false)
    const [isNetSupported, setIsNetSupported] = useState(true)
    const [loading, setLoading] = useState(true)
    const [serverError, setServerError] = useState("")
    const [positionsAndPoolsLoaded, setPositionsAndPoolsLoaded] =
        useState(false)

    const poolsRef = useRef(pools)
    const router = useRouter()

    // web3 hooks
    const { address, chainId } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()

    useEffect(() => {
        poolsRef.current = pools
    }, [pools])

    useEffect(() => {
        if (walletProvider !== undefined) {
            setLoading(true)
            setPositionsAndPoolsLoaded(false)
            ;(async () => {
                try {
                    const response = await fetchPositionsAndPools(
                        chainId,
                        address,
                    )

                    setPositions(response.positions)
                    setPools(response.pools)
                    setIsNetSupported(true)
                    setServerError("")
                } catch (error) {
                    if (
                        error.message ===
                        `Chain ID ${chainId} is not supported.`
                    ) {
                        setIsNetSupported(false)
                        console.log(error)
                    } else if (error.message === "Failed to fetch data") {
                        console.log(error)
                        setServerError(
                            `Failed to fetch data, probably server issue, look on inspect -> console, and send error to our support: ${config.email}`,
                        )
                    } else {
                        console.log(error)
                        setServerError(
                            `Failed to fetch data, probably server issue, look on inspect -> console, and send error to our support: ${config.email}`,
                        )
                    }
                } finally {
                    setPositionsAndPoolsLoaded(true)
                }
            })()
        }
    }, [walletProvider, network, address])

    // let's check if we have everyting to start
    useEffect(() => {
        if (positionsAndPoolsLoaded) {
            setLoading(false)
        }
    }, [positionsAndPoolsLoaded])

    // trigger update for posistions in case if swaps will change position parameters
    useEffect(() => {
        let intervalId
        if (walletProvider !== undefined) {
            intervalId = setInterval(() => {
                setTriggerRefresh(true)
            }, 60000)
        }
        return () => clearInterval(intervalId)
    }, [])

    // every 60 s refresh pools and positions in case of any changes like e.g. swaps which case change in reserves
    useEffect(() => {
        if (triggerRefresh && walletProvider !== undefined) {
            ;(async () => {
                try {
                    const response = await fetchPositionsAndPools(
                        chainId,
                        address,
                    )

                    setPositions(response.positions)
                    setPools(response.pools)
                    setIsNetSupported(true)
                    setServerError("")
                } catch (error) {
                    if (
                        error.message ===
                        `Chain ID ${chainId} is not supported.`
                    ) {
                        setIsNetSupported(false)
                        console.log(error)
                    } else if (error.message === "Failed to fetch data") {
                        console.log(error)
                        setServerError(
                            `Failed to fetch data, probably server issue, look on inspect -> console, and send error to our support: ${config.email}`,
                        )
                    } else {
                        console.log(error)
                        setServerError(
                            `Failed to fetch data, probably server issue, look on inspect -> console, and send error to our support: ${config.email}`,
                        )
                    }
                }
            })()

            setTriggerRefresh(false)
        }
    }, [triggerRefresh])

    useEffect(() => {
        if (walletProvider !== undefined && isNetSupported) {
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
                        try {
                            const posResponse = await fetchPosition(
                                chainId,
                                String(tokenId),
                            )
                            setPositions((prev) => ({
                                ...prev,
                                [`${tokenId}`]: posResponse.position,
                            }))
                            setIsNetSupported(true)
                            setServerError("")
                            // check if pool is exists
                            const _pools = poolsRef.current
                            if (
                                _pools[
                                    `${posResponse.position.token0Symbol}${posResponse.position.token1Symbol}${String(posResponse.position.fee)}`
                                ] === undefined
                            ) {
                                const poolResponse = await fetchPool(
                                    chainId,
                                    posResponse.position.token0Address,
                                    posResponse.position.token1Address,
                                    posResponse.position.token0Symbol,
                                    posResponse.position.token1Symbol,
                                    posResponse.position.token0Decimals,
                                    posResponse.position.token1Decimals,
                                    posResponse.position.fee,
                                    posResponse.position.tickUpper,
                                    posResponse.position.tickLower,
                                )

                                setPools((prev) => ({
                                    ...prev,
                                    [`${posResponse.position.token0Symbol}${posResponse.position.token1Symbol}${posResponse.position.fee}`]:
                                        poolResponse.pool,
                                }))
                            }
                        } catch (error) {
                            if (
                                error.message ===
                                `Chain ID ${chainId} is not supported.`
                            ) {
                                setIsNetSupported(false)
                                console.log(error)
                            } else if (
                                error.message === "Failed to fetch data"
                            ) {
                                console.log(error)
                                setServerError(
                                    `Failed to fetch data, probably server issue, look on inspect -> console, and send error to our support: ${config.email}`,
                                )
                            } else {
                                console.log(error)
                                setServerError(
                                    `Failed to fetch data, probably server issue, look on inspect -> console, and send error to our support: ${config.email}`,
                                )
                            }
                        }
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
                // lets collect data for only one position - this one on which we increase liquidity
                ;(async () => {
                    try {
                        const response = await fetchPosition(
                            chainId,
                            String(tokenId),
                        )
                        setPositions((prev) => ({
                            ...prev,
                            [`${tokenId}`]: response.position,
                        }))
                        setIsNetSupported(true)
                        setServerError("")
                    } catch (error) {
                        if (
                            error.message ===
                            `Chain ID ${chainId} is not supported.`
                        ) {
                            setIsNetSupported(false)
                            console.log(error)
                        } else if (error.message === "Failed to fetch data") {
                            console.log(error)
                            setServerError(
                                `Failed to fetch data, probably server issue, look on inspect -> console, and send error to our support: ${config.email}`,
                            )
                        } else {
                            console.log(error)
                            setServerError(
                                `Failed to fetch data, probably server issue, look on inspect -> console, and send error to our support: ${config.email}`,
                            )
                        }
                    }
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
                // lets collect data for only one position - this one on which we decrease liquidity
                ;(async () => {
                    try {
                        const response = await fetchPosition(
                            chainId,
                            String(tokenId),
                        )
                        setPositions((prev) => ({
                            ...prev,
                            [`${tokenId}`]: response.position,
                        }))
                        setIsNetSupported(true)
                        setServerError("")
                    } catch (error) {
                        if (
                            error.message ===
                            `Chain ID ${chainId} is not supported.`
                        ) {
                            setIsNetSupported(false)
                            console.log(error)
                        } else if (error.message === "Failed to fetch data") {
                            console.log(error)
                            setServerError(
                                `Failed to fetch data, probably server issue, look on inspect -> console, and send error to our support: ${config.email}`,
                            )
                        } else {
                            console.log(error)
                            setServerError(
                                `Failed to fetch data, probably server issue, look on inspect -> console, and send error to our support: ${config.email}`,
                            )
                        }
                    }
                })()
            }
            const handleCollect = (
                tokenId: bigint,
                amount0: bigint,
                amount1: bigint,
                event: ethers.EventLog,
            ) => {
                console.log(
                    `collect fees event detected by amounts ${amount0} and ${amount1} for tokenId ${tokenId}`,
                )
                // lets collect data for only one position - this one on which we collect fees
                ;(async () => {
                    try {
                        const response = await fetchPosition(
                            chainId,
                            String(tokenId),
                        )
                        setPositions((prev) => ({
                            ...prev,
                            [`${tokenId}`]: response.position,
                        }))
                        setIsNetSupported(true)
                        setServerError("")
                    } catch (error) {
                        if (
                            error.message ===
                            `Chain ID ${chainId} is not supported.`
                        ) {
                            setIsNetSupported(false)
                            console.log(error)
                        } else if (error.message === "Failed to fetch data") {
                            console.log(error)
                            setServerError(
                                `Failed to fetch data, probably server issue, look on inspect -> console, and send error to our support: ${config.email}`,
                            )
                        } else {
                            console.log(error)
                            setServerError(
                                `Failed to fetch data, probably server issue, look on inspect -> console, and send error to our support: ${config.email}`,
                            )
                        }
                    }
                })()
            }
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

    // wait untill all needed data are fetched
    if (loading) return <div>Loading ...</div>

    // if there is problem with server, display message to user
    if (serverError) {
        return (
            <div className={styles.error_div}>
                <p className={styles.error}>{serverError}</p>
            </div>
        )
    }

    // in case of unsupported network - displlay message to user about it.
    if (!isNetSupported) {
        let chains = ""
        const networks = Object.values(EUniswapV3SupportedChains)
        for (const chain in networks) {
            if (networks[chain] === "Unsupported") {
                continue
            }

            if (chains === "") {
                chains = networks[chain]
                continue
            }
            chains = chains + ", " + networks[chain]
        }

        return (
            <div className={styles.no_positions}>
                <p className={styles.no_positions_text}>
                    Unsupported network. Switch to one of the supported
                    networks: {chains}
                </p>
            </div>
        )
    }

    // if user doesn't have any position - display message about it
    if (Object.keys(positions).length === 0) {
        return (
            <div className={styles.no_positions}>
                <p className={styles.no_positions_text}>
                    User doesn&apos;t have any positions.
                </p>
            </div>
        )
    }

    const goToDetails = (tokenId: string) => {
        router.push(`/uniswapv3/${tokenId}`)
    }

    return isNetSupported ? (
        <div
            style={{
                margin: "20px",
                padding: "10px",
            }}
            className="gap-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
            {Object.keys(positions).map((tokenId, index) => {
                const poolKey = `${positions[tokenId].token0Symbol}${positions[tokenId].token1Symbol}${positions[tokenId].fee}`

                if (pools[poolKey] === undefined) {
                    return null
                }

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
                            pool={pools[poolKey]}
                            position={positions[tokenId]}
                        />
                        <Divider />
                        <Reserves
                            pool={pools[poolKey]}
                            position={positions[tokenId]}
                        />
                        <Divider />
                        <Ticks
                            pool={pools[poolKey]}
                            position={positions[tokenId]}
                        />
                        <Divider />
                        <TickPrices
                            pool={pools[poolKey]}
                            position={positions[tokenId]}
                        />
                        <Divider />
                        <UncollectedFees
                            pool={pools[poolKey]}
                            position={positions[tokenId]}
                        />
                        <Divider />
                        {/* <CardBody>
                            <p>mint date: {data.mintDate}</p>
                        </CardBody>
                        <Divider /> */}
                        <PositionGauge
                            pool={pools[poolKey]}
                            position={positions[tokenId]}
                        />
                        <Button onClick={() => goToDetails(tokenId)}>
                            view position details
                        </Button>
                    </Card>
                )
            })}
        </div>
    ) : (
        <div>Unsupported network</div>
    )
}
