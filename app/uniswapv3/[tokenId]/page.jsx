"use client"
import { useState, useEffect } from "react"
import { ethers } from "defi-booster-shared"
import { getPoolContract } from "defi-booster-shared"
import { fromsqrtPriceX96ToHumanReadable } from "defi-booster-shared"
import {
    mapping_chainIdToUSDCContract,
    mapping_chainIdToWETHContract,
} from "defi-booster-shared"

import { Token } from "@uniswap/sdk-core"

import { Spinner } from "@nextui-org/react"

import Timeline from "@mui/lab/Timeline"
import TimelineItem from "@mui/lab/TimelineItem"
import TimelineSeparator from "@mui/lab/TimelineSeparator"
import TimelineConnector from "@mui/lab/TimelineConnector"
import TimelineContent from "@mui/lab/TimelineContent"
import TimelineDot from "@mui/lab/TimelineDot"
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent"
import Typography from "@mui/material/Typography"

import { calcFiatMetrics } from "../../libs/uniswap/v3/calc"

import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react"

import { useWeb3StatesContext } from "../../../context/web3states"

import { useSearchParams } from "next/navigation"

import { useQuery } from "@apollo/client"

import {
    GET_V3_LIVECYCLE,
    GET_V3_POSITIONS,
} from "../../api_graphql/uniswapv3/queries"

import { EUniswapV3SupportedChains } from "defi-booster-shared"
import { ELivecycleEvents } from "defi-booster-shared"

import config from "../../../my.config"

import styles from "../../styles/PositionDetails.module.css"

export default function DetailsPage({ params }) {
    const { tokenId } = params

    const searchParams = useSearchParams()

    const [web3State] = useWeb3StatesContext()
    const { address, chainId } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()

    // states
    const [position, setPosition] = useState([])
    const [token0Price, setToken0Price] = useState(null)
    const [token1Price, setToken1Price] = useState(null)
    const [ethPrice, setEthPrice] = useState(null)

    const [takeOutOfMyPocket, setTakeOutOfMyPocket] = useState(null)
    const [whatICanBackNow, setWhatICanBackNow] = useState(null)
    const [ifIDidNothing, setIfIDidNothing] = useState(null)
    const [IL, setIL] = useState(null)
    const [profitOrLoss, setProfitOrLoss] = useState(null)

    // graphql queries
    const {
        loading: loading_position,
        error: error_position,
        data: data_position,
        refetch,
    } = useQuery(GET_V3_POSITIONS, {
        variables: {
            tokenId: tokenId,
            chainId: chainId,
            address: address,
        },
    })

    const {
        loading: loading_livecycle,
        error: error_livecycle,
        data: data_livecycle,
    } = useQuery(GET_V3_LIVECYCLE, {
        variables: {
            chainId: chainId,
            tokenId: Number(tokenId),
            address: address,
        },
    })

    // refetch data for positions with given tokenId
    useEffect(() => {
        const intervalId = setInterval(() => {
            refetch().then((result) => {
                if (result.data.getV3Positions.length > 0) {
                    setPosition(result.data.getV3Positions)
                }
            })
        }, 60000)

        return () => clearInterval(intervalId)
    }, [])

    // set state for position with given id
    useEffect(() => {
        if (!loading_position) {
            if (data_position.getV3Positions.length > 0) {
                setPosition(data_position.getV3Positions)
            }
        }
    }, [data_position])

    // figure out ETH fiat price
    useEffect(() => {
        const setPrice = async (pool, decimals, setter) => {
            const slot = await pool.slot0()
            const sqrtPriceX96 = slot[0]
            const prices = fromsqrtPriceX96ToHumanReadable(
                sqrtPriceX96,
                decimals,
                6,
            )

            setter(prices.token0Token1Price)
        }

        if (position.length > 0) {
            const provider = new ethers.BrowserProvider(walletProvider)

            const tokenObj_USDC = new Token(
                chainId,
                mapping_chainIdToUSDCContract[chainId],
                6,
                "USDC",
                "USDC",
            )

            const tokenObj_WETH = new Token(
                chainId,
                mapping_chainIdToWETHContract[chainId],
                18,
                "WETH",
                "WETH",
            )

            // get price for WETH
            const poolContractWETHUSDC = getPoolContract(
                provider,
                Number(chainId),
                tokenObj_WETH,
                tokenObj_USDC,
                500,
            )

            setPrice(poolContractWETHUSDC, 18, setEthPrice)
        }
    }, [position])

    // figure out token_0 and token_1 fiat price
    useEffect(() => {
        const setTokensPrice = async (
            pool,
            token_decimals,
            ethPrice,
            setter,
        ) => {
            const slot = await pool.slot0()
            const sqrtPriceX96 = slot[0]
            const prices = fromsqrtPriceX96ToHumanReadable(
                sqrtPriceX96,
                18,
                token_decimals,
            )

            setter(prices.token0Token1Price * (1 / ethPrice))
        }

        if (position.length > 0 && ethPrice !== null) {
            const provider = new ethers.BrowserProvider(walletProvider)

            const tokenObj_0 = new Token(
                chainId,
                position[0].token0Address,
                Number(position[0].token0Decimals),
                position[0].token0Symbol,
                position[0].token0Symbol,
            )

            const tokenObj_1 = new Token(
                chainId,
                position[0].token1Address,
                Number(position[0].token1Decimals),
                position[0].token1Symbol,
                position[0].token1Symbol,
            )

            const tokenObj_WETH = new Token(
                chainId,
                mapping_chainIdToWETHContract[chainId],
                18,
                "WETH",
                "WETH",
            )

            if (tokenObj_0.symbol !== tokenObj_WETH.symbol) {
                const poolContractWETH_Token0 = getPoolContract(
                    provider,
                    Number(chainId),
                    tokenObj_WETH,
                    tokenObj_0,
                    position[0].fee,
                )
            } else {
                setToken0Price(ethPrice)
            }

            if (tokenObj_1.symbol !== tokenObj_WETH.symbol) {
                const poolContractWETH_Token1 = getPoolContract(
                    provider,
                    Number(chainId),
                    tokenObj_WETH,
                    tokenObj_1,
                    position[0].fee,
                )

                setTokensPrice(
                    poolContractWETH_Token1,
                    position[0].token1Decimals,
                    ethPrice,
                    setToken1Price,
                )
            } else {
                setToken1Price(ethPrice)
            }
        }
    }, [position, ethPrice])

    // calculate metrics
    useEffect(() => {
        if (
            position.length > 0 &&
            data_livecycle !== undefined &&
            !loading_livecycle &&
            !loading_position &&
            ethPrice !== null &&
            token0Price !== null &&
            token1Price !== null
        ) {
            const {
                takeOutOfMyPocket,
                whatICanBackNow,
                ifIDidNothing,
                profitOrLoss,
                IL,
            } = calcFiatMetrics(
                data_livecycle.getV3PositionLivecycle,
                position[0],
                token0Price,
                token1Price,
                ethPrice,
            )

            setTakeOutOfMyPocket(takeOutOfMyPocket)
            setWhatICanBackNow(whatICanBackNow)
            setIfIDidNothing(ifIDidNothing)
            setIL(IL)
            setProfitOrLoss(profitOrLoss)
        }
    }, [
        position,
        data_livecycle,
        loading_livecycle,
        ethPrice,
        token0Price,
        token1Price,
    ])

    // wait untill all needed data are fetched
    if (loading_position || loading_livecycle)
        return (
            <div className={styles.loading}>
                <Spinner
                    label="on chain exploration..."
                    color="success"
                    size="lg"
                />
            </div>
        )

    const pattern = /Chain ID .* is not supported\./

    if (pattern.test(String(error_livecycle))) {
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

    // if there is problem with server, display message to user
    if (error_position || error_livecycle) {
        console.error(error_position)
        console.error(error_livecycle)
        return (
            <div className={styles.error_div}>
                <p
                    className={styles.error}
                >{`Failed to fetch data, probably server issue, look on inspect -> console, and send error to our support: ${config.email}`}</p>
            </div>
        )
    }

    if (error_position) {
        console.error(error_position)
        return (
            <div className={styles.error_div}>
                <p
                    className={styles.error}
                >{`Failed to fetch data, probably server issue, look on inspect -> console, and send error to our support: ${config.email}`}</p>
            </div>
        )
    }

    if (loading_position)
        return (
            <div className={styles.loading}>
                <Spinner
                    label="on chain exploration..."
                    color="success"
                    size="lg"
                />
            </div>
        )

    if (data_livecycle.getV3PositionLivecycle.length === 0) {
        return (
            <div className={styles.error_div}>
                <p
                    className={styles.error}
                >{`No activity on this tokenId, maybe you switch to wrong network? if you think that it is an error, please contact with our support: ${config.email}`}</p>
            </div>
        )
    }

    if (data_position.getV3Positions.length === 0) {
        return (
            <div className={styles.error_div}>
                <p
                    className={styles.error}
                >{`Can't fetch position data for this tokenId, maybe you switch to wrong network? if you think that it is an error, please contact with our support: ${config.email}`}</p>
            </div>
        )
    }

    const emoji = {
        MINT: "🔨",
        INCREASE: "💰",
        DECREASE: "💸",
        COLLECT_FEES: "🐹",
        BURN: "🔥",
    }

    function getDescription(event, item) {
        let msg = null
        switch (event) {
            case ELivecycleEvents.MINT:
                msg = `Position minted with
                ${Number(ethers.formatUnits(item.amount0, Number(position[0].token0Decimals))).toFixed(4)} ${position[0].token0Symbol}
                ${Number(ethers.formatUnits(item.amount1, Number(position[0].token1Decimals))).toFixed(4)} ${position[0].token1Symbol}`
                break
            case ELivecycleEvents.INCREASE:
                msg = `Position increase by:
                ${Number(ethers.formatUnits(item.amount0, Number(position[0].token0Decimals))).toFixed(4)} ${position[0].token0Symbol}
                ${Number(ethers.formatUnits(item.amount1, Number(position[0].token1Decimals))).toFixed(4)} ${position[0].token1Symbol}`
                break
            case ELivecycleEvents.DECREASE:
                msg = `Position decrease by:
                ${Number(ethers.formatUnits(item.amount0, Number(position[0].token0Decimals))).toFixed(4)} ${position[0].token0Symbol}
                ${Number(ethers.formatUnits(item.amount1, Number(position[0].token1Decimals))).toFixed(4)} ${position[0].token1Symbol}`
                break
            case ELivecycleEvents.COLLECT_FEES:
                msg = `Fees collected:
                ${Number(ethers.formatUnits(item.amount0, Number(position[0].token0Decimals))).toFixed(8)}${position[0].token0Symbol}
                ${Number(ethers.formatUnits(item.amount1, Number(position[0].token1Decimals))).toFixed(8)}${position[0].token1Symbol}`
                break
            case ELivecycleEvents.BURN:
                msg = `Position transfered, remained:
                 ${Number(ethers.formatUnits(item.amount0, Number(position[0].token0Decimals))).toFixed(4)}${position[0].token0Symbol}
                 ${Number(ethers.formatUnits(item.amount1, Number(position[0].token1Decimals))).toFixed(4)}${position[0].token1Symbol}`
                break
        }
        return msg
    }

    return position.length > 0 ? (
        <div className={styles.livecycle}>
            <p>tokenId: {tokenId} position details</p>
            <Timeline position="alternate" className={styles.timeline}>
                {data_livecycle.getV3PositionLivecycle.map((item, idx) => {
                    return (
                        <TimelineItem key={idx}>
                            <TimelineOppositeContent
                                sx={{ m: "auto 0" }}
                                align="right"
                                className={styles.date}
                            >
                                {item.date}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot
                                    color={idx % 2 ? "secondary" : "success"}
                                />
                                {idx <
                                    data_livecycle.getV3PositionLivecycle
                                        .length -
                                        1 && (
                                    <TimelineConnector
                                        sx={{ height: "10vh" }}
                                    />
                                )}
                            </TimelineSeparator>
                            <TimelineContent sx={{ py: "12px", px: 2 }}>
                                <Typography
                                    variant="h6"
                                    component="span"
                                    className={styles.event}
                                >
                                    {item.livecycleEvent}{" "}
                                    {emoji[item.livecycleEvent]}
                                </Typography>
                                <Typography className={styles.desc}>
                                    {getDescription(item.livecycleEvent, item)}
                                </Typography>
                            </TimelineContent>
                        </TimelineItem>
                    )
                })}
            </Timeline>
            <div>
                <p>takeOutOfMyPocket: {takeOutOfMyPocket}</p>
                <p>whatICanBackNow: {whatICanBackNow}</p>
                <p>ifIDidNothing: {ifIDidNothing}</p>
                <p>IL: {IL}</p>
                <p>profitOrLoss: {profitOrLoss}</p>
                <p>eth price: {ethPrice}</p>
                <p>
                    token 0 {position[0].token0Symbol} price: {token0Price}
                </p>
                <p>
                    token 1 {position[0].token1Symbol} price: {token1Price}
                </p>
            </div>
        </div>
    ) : null
}
