"use client"
import { ethers } from "ethers"

import { useState, useEffect, useRef, useMemo } from "react"

import { Spinner } from "@nextui-org/react"

import Timeline from "@mui/lab/Timeline"
import TimelineItem from "@mui/lab/TimelineItem"
import TimelineSeparator from "@mui/lab/TimelineSeparator"
import TimelineConnector from "@mui/lab/TimelineConnector"
import TimelineContent from "@mui/lab/TimelineContent"
import TimelineDot from "@mui/lab/TimelineDot"
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent"
import Typography from "@mui/material/Typography"

import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react"

import { useWeb3StatesContext } from "../../../context/web3states"

import {
    getPositionMintData,
    getPositionIncreaseData,
    getPositionDecreaseData,
    getPositionCollectFeesData,
    getPostionBurnData,
} from "../../uniswapV3-lib/livecycle/position-livecycle"
import { getNonFungiblePositionManagerContract } from "../../uniswapV3-lib/utils/get-contracts"
import { SupportedChains } from "../../utils/enums"

import styles from "../../styles/Livecycle.module.css"

export default function LivecyclePage({ params }) {
    const { tokenId } = params

    const isFirstRender = useRef(true)
    const isSecondRender = useRef(true) // todo: to be remove on production

    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [livecycle, setLivecycle] = useState([])

    const [web3State] = useWeb3StatesContext()
    const { address, chainId } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()

    const network = web3State.currentNetwork

    const stableAddress = useMemo(() => address, [address])
    const stableNetwork = useMemo(() => network, [network])

    useEffect(() => {
        if (
            walletProvider !== undefined &&
            network !== SupportedChains.Unsupported
        ) {
            const provider = new ethers.BrowserProvider(walletProvider)

            ;(async () => {
                const nfpmContract = getNonFungiblePositionManagerContract(
                    provider,
                    chainId,
                )

                const positionMintInfo = await getPositionMintData(
                    provider,
                    chainId,
                    tokenId,
                    nfpmContract,
                    address,
                )

                if (positionMintInfo === undefined) {
                    setError(
                        "Can't detect on chain data, look on inspect -> console, and send error to our support: defi-booster@support.com",
                    )
                    return
                }

                const positionIncreaseInfos = await getPositionIncreaseData(
                    provider,
                    chainId,
                    tokenId,
                    nfpmContract,
                    address,
                )
                const positionDecreaseInfos = await getPositionDecreaseData(
                    provider,
                    chainId,
                    tokenId,
                    nfpmContract,
                    address,
                )
                const positionCollectFeesInfos =
                    await getPositionCollectFeesData(
                        provider,
                        chainId,
                        tokenId,
                        nfpmContract,
                        address,
                    )
                const positionBurnInfo = await getPostionBurnData(
                    provider,
                    chainId,
                    tokenId,
                    nfpmContract,
                    address,
                )

                const _livecycle = [
                    positionMintInfo,
                    ...positionIncreaseInfos,
                    ...positionDecreaseInfos,
                    ...positionCollectFeesInfos,
                    positionBurnInfo,
                ].sort((a, b) => {
                    const parseDate = (dateString) => {
                        const [datePart, timePart] = dateString.split(", ")
                        const [day, month, year] = datePart.split("/")
                        return new Date(`${month}/${day}/${year} ${timePart}`)
                    }

                    const dateA = parseDate(a.date)
                    const dateB = parseDate(b.date)

                    return dateA - dateB
                })

                setLivecycle(_livecycle)
                setIsLoading(false)
            })()
        }
    }, [])

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        if (isSecondRender.current) {
            isSecondRender.current = false
            return
        }

        setError(
            "You changed the network or address, so your tokenId is no longer valid. Click 'Choose Protocol' and select the one you would like to explore.",
        )
    }, [stableNetwork, stableAddress])

    const emoji = {
        MINT: "🔨",
        INCREASE: "💰",
        DECREASE: "💸",
        COLLECT_FEES: "🐹",
        BURN: "🔥",
    }

    return !error ? (
        <div className={styles.main}>
            {isLoading && (
                <Spinner label="on chain exploration..." color="warning" />
            )}

            {!isLoading && (
                <div className={styles.livecycle}>
                    <p className={styles.title}>
                        Lifecycle for position with tokenId: {tokenId}
                    </p>
                    <Timeline position="alternate" className={styles.timeline}>
                        {livecycle.map((item, index) => {
                            return (
                                <TimelineItem key={index}>
                                    <TimelineOppositeContent
                                        sx={{ m: "auto 0" }}
                                        align="right"
                                        className={styles.date}
                                    >
                                        {item.date}
                                    </TimelineOppositeContent>
                                    <TimelineSeparator>
                                        <TimelineDot
                                            color={
                                                index % 2
                                                    ? "secondary"
                                                    : "success"
                                            }
                                        />
                                        {index < livecycle.length - 1 && (
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
                                            some description
                                        </Typography>
                                    </TimelineContent>
                                </TimelineItem>
                            )
                        })}
                    </Timeline>
                </div>
            )}
        </div>
    ) : (
        <div className={styles.error_div}>
            <p className={styles.error}>{error}</p>
        </div>
    )
}
