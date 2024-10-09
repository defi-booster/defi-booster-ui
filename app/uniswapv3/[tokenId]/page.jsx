"use client"
import { ethers } from "defi-booster-shared"

import { Spinner } from "@nextui-org/react"

import Timeline from "@mui/lab/Timeline"
import TimelineItem from "@mui/lab/TimelineItem"
import TimelineSeparator from "@mui/lab/TimelineSeparator"
import TimelineConnector from "@mui/lab/TimelineConnector"
import TimelineContent from "@mui/lab/TimelineContent"
import TimelineDot from "@mui/lab/TimelineDot"
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent"
import Typography from "@mui/material/Typography"

// import {
//     calcInvestedAmounts,
//     calcPositionAmounts,
// } from "../../uniswapV3-lib/calc/calc"

import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react"

import { useWeb3StatesContext } from "../../../context/web3states"

import { useSearchParams } from "next/navigation"

import { useQuery } from "@apollo/client"

import { GET_V3_LIVECYCLE } from "../../api_graphql/uniswapv3/queries"

import { EUniswapV3SupportedChains } from "defi-booster-shared"
import { ELivecycleEvents } from "defi-booster-shared"
import config from "../../../my.config"

import styles from "../../styles/PositionDetails.module.css"

export default function DetailsPage({ params }) {
    const { tokenId } = params

    const searchParams = useSearchParams()

    const token0Symbol = searchParams.get("token0Symbol")
    const token0Decimals = searchParams.get("token0Decimals")
    const token1Symbol = searchParams.get("token1Symbol")
    const token1Decimals = searchParams.get("token1Decimals")

    const [web3State] = useWeb3StatesContext()
    const { address, chainId } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()

    const { loading, error, data } = useQuery(GET_V3_LIVECYCLE, {
        variables: {
            chainId: chainId,
            tokenId: Number(tokenId),
            address: address,
        },
    })

    // wait untill all needed data are fetched
    if (loading)
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

    if (pattern.test(String(error))) {
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
    if (error) {
        console.error(error)
        return (
            <div className={styles.error_div}>
                <p
                    className={styles.error}
                >{`Failed to fetch data, probably server issue, look on inspect -> console, and send error to our support: ${config.email}`}</p>
            </div>
        )
    }

    // const livecycle = data.getV3PositionLivecycle

    // testing data - uncomment if you don;t want to trigger backend
    // const livecycle = [
    //     {
    //         __typename: "UniswapV3Livecycle",
    //         livecycleEvent: "MINT",
    //         blockNumber: "20142767",
    //         txHash: "0x2d72b47b3e4799034747005f573e6f42572d23de015a9d34bb204db900bcf0fa",
    //         date: "9/23/2024, 9:01:21 AM",
    //         tokenId: "971116",
    //         amount0: "999999985579958",
    //         amount1: "558019",
    //         feePaid: "1952255648619",
    //     },
    //     {
    //         __typename: "UniswapV3Livecycle",
    //         livecycleEvent: "INCREASE",
    //         blockNumber: "20142954",
    //         txHash: "0xb6429846fe8385d8168d1efa68419897959e2d7bdc941574ac13e2efd8a53e8a",
    //         date: "9/23/2024, 9:07:35 AM",
    //         tokenId: "971116",
    //         amount0: "1999999202623825",
    //         amount1: "0",
    //         feePaid: "929543422572",
    //     },
    //     {
    //         __typename: "UniswapV3Livecycle",
    //         livecycleEvent: "DECREASE",
    //         blockNumber: "20143089",
    //         txHash: "0x4fc085513e28f2b21a227e7f65c24c878027c2c23ce4ea924f77e7617b9b6dfc",
    //         date: "9/23/2024, 9:12:05 AM",
    //         tokenId: "971116",
    //         amount0: "1605089616122061",
    //         amount1: "0",
    //         feePaid: "1144772562024",
    //     },
    //     {
    //         __typename: "UniswapV3Livecycle",
    //         livecycleEvent: "COLLECT_FEES",
    //         blockNumber: "20143089",
    //         txHash: "0x4fc085513e28f2b21a227e7f65c24c878027c2c23ce4ea924f77e7617b9b6dfc",
    //         date: "9/23/2024, 9:12:05 AM",
    //         tokenId: "971116",
    //         amount0: "1605281110099976",
    //         amount1: "229",
    //         feePaid: "1144772562024",
    //     },
    // ]

    if (data.getV3PositionLivecycle.length === 0) {
        return (
            <div className={styles.error_div}>
                <p
                    className={styles.error}
                >{`No activity on this tokenId, maybe you switch to wrong network? if you think that it is an error, please contact with our support: ${config.email}`}</p>
            </div>
        )
    }

    // sort by datetime
    const sortedLivecycle = [...data.getV3PositionLivecycle].sort((a, b) => {
        const parseDate = (dateString) => {
            const [datePart, timePart] = dateString.split(", ")
            const [day, month, year] = datePart.split("/")
            return new Date(`${month}/${day}/${year} ${timePart}`)
        }

        const dateA = parseDate(a.date)
        const dateB = parseDate(b.date)

        return dateA - dateB
    })

    const livecycle = sortedLivecycle.map((item, idx) => {
        if (
            item.livecycleEvent === ELivecycleEvents.COLLECT_FEES &&
            idx > 0 &&
            sortedLivecycle[idx - 1].livecycleEvent ===
                ELivecycleEvents.DECREASE
        ) {
            return {
                ...item,
                amount0:
                    BigInt(item.amount0) -
                    BigInt(sortedLivecycle[idx - 1].amount0),
                amount1:
                    BigInt(item.amount1) -
                    BigInt(sortedLivecycle[idx - 1].amount1),
            }
        }

        return item
    })

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
                ${Number(ethers.formatUnits(item.amount0, Number(token0Decimals))).toFixed(4)} ${token0Symbol}
                ${Number(ethers.formatUnits(item.amount1, Number(token1Decimals))).toFixed(4)} ${token1Symbol}`
                break
            case ELivecycleEvents.INCREASE:
                msg = `Position increase by:
                ${Number(ethers.formatUnits(item.amount0, Number(token0Decimals))).toFixed(4)} ${token0Symbol}
                ${Number(ethers.formatUnits(item.amount1, Number(token1Decimals))).toFixed(4)} ${token1Symbol}`
                break
            case ELivecycleEvents.DECREASE:
                msg = `Position decrease by:
                ${Number(ethers.formatUnits(item.amount0, Number(token0Decimals))).toFixed(4)} ${token0Symbol}
                ${Number(ethers.formatUnits(item.amount1, Number(token1Decimals))).toFixed(4)} ${token1Symbol}`
                break
            case ELivecycleEvents.COLLECT_FEES:
                msg = `Fees collected:
                ${Number(ethers.formatUnits(item.amount0, Number(token0Decimals))).toFixed(8)}${token0Symbol}
                ${Number(ethers.formatUnits(item.amount1, Number(token1Decimals))).toFixed(8)}${token1Symbol}`
                break
            case ELivecycleEvents.BURN:
                msg = `Position transfered, remained:
                 ${Number(ethers.formatUnits(item.amount0, Number(token0Decimals))).toFixed(4)}${token0Symbol}
                 ${Number(ethers.formatUnits(item.amount1, Number(token1Decimals))).toFixed(4)}${token1Symbol}`
                break
        }
        return msg
    }

    return (
        <div className={styles.livecycle}>
            <p>tokenId: {tokenId} position details</p>
            <Timeline position="alternate" className={styles.timeline}>
                {livecycle.map((item, idx) => {
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
                                {idx < livecycle.length - 1 && (
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
        </div>
    )
}
