// "use client"
// import { ethers } from "ethers"

// import { useState, useEffect, useRef, useMemo } from "react"

// import { Spinner } from "@nextui-org/react"

// import Timeline from "@mui/lab/Timeline"
// import TimelineItem from "@mui/lab/TimelineItem"
// import TimelineSeparator from "@mui/lab/TimelineSeparator"
// import TimelineConnector from "@mui/lab/TimelineConnector"
// import TimelineContent from "@mui/lab/TimelineContent"
// import TimelineDot from "@mui/lab/TimelineDot"
// import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent"
// import Typography from "@mui/material/Typography"

// import {
//     collectPosition,
//     collectPool,
// } from "../../uniswapV3-lib/collected-data"

// import {
//     calcInvestedAmounts,
//     calcPositionAmounts,
// } from "../../uniswapV3-lib/calc/calc"

// import { calcCurrentReserves } from "../../uniswapV3-lib/utils/math"

// import config from "../../my.config"

// import {
//     useWeb3ModalAccount,
//     useWeb3ModalProvider,
// } from "@web3modal/ethers/react"

// import { useWeb3StatesContext } from "../../../context/web3states"

// import {
//     getPositionMintData,
//     getPositionIncreaseData,
//     getPositionDecreaseData,
//     getPositionCollectFeesData,
//     getPostionBurnData,
// } from "../../uniswapV3-lib/livecycle/position-livecycle"
// import { getNonFungiblePositionManagerContract } from "../../uniswapV3-lib/utils/get-contracts"
// import { SupportedChains } from "../../utils/enums"

// import styles from "../../styles/PositionDetails.module.css"

// export default function DetailsPage({ params }) {
//     const { tokenId } = params

//     const isFirstRender = useRef(true)
//     const isSecondRender = useRef(true) // todo: to be remove on production

//     const [error, setError] = useState("")
//     const [isLoading, setIsLoading] = useState(true)
//     const [livecycle, setLivecycle] = useState([])
//     const [position, setPosition] = useState()
//     const [pool, setPool] = useState()

//     const [web3State] = useWeb3StatesContext()
//     const { address, chainId } = useWeb3ModalAccount()
//     const { walletProvider } = useWeb3ModalProvider()

//     const network = web3State.currentNetwork

//     const stableAddress = useMemo(() => address, [address])
//     const stableNetwork = useMemo(() => network, [network])

//     useEffect(() => {
//         if (
//             walletProvider !== undefined &&
//             network !== SupportedChains.Unsupported
//         ) {
//             const provider = new ethers.BrowserProvider(walletProvider)

//             ;(async () => {
//                 const nfpmContract = getNonFungiblePositionManagerContract(
//                     provider,
//                     chainId,
//                 )

//                 const positionMintInfo = await getPositionMintData(
//                     provider,
//                     chainId,
//                     tokenId,
//                     nfpmContract,
//                     address,
//                 )

//                 if (positionMintInfo === undefined) {
//                     setError(
//                         `Can't detect on chain data, look on inspect -> console, and send error to our support: ${config.email}`,
//                     )
//                     return
//                 }

//                 const positionIncreaseInfos = await getPositionIncreaseData(
//                     provider,
//                     chainId,
//                     tokenId,
//                     nfpmContract,
//                 )

//                 const positionDecreaseInfos = await getPositionDecreaseData(
//                     provider,
//                     chainId,
//                     tokenId,
//                     nfpmContract,
//                 )

//                 const positionCollectFeesInfos =
//                     await getPositionCollectFeesData(
//                         provider,
//                         chainId,
//                         tokenId,
//                         nfpmContract,
//                     )
//                 const positionBurnInfo = await getPostionBurnData(
//                     provider,
//                     chainId,
//                     tokenId,
//                     nfpmContract,
//                     address,
//                 )

//                 const _livecycle = [
//                     positionMintInfo,
//                     ...positionIncreaseInfos,
//                     ...positionDecreaseInfos,
//                     ...positionCollectFeesInfos,
//                     positionBurnInfo,
//                 ]
//                     .filter((item) => item !== undefined)
//                     .sort((a, b) => {
//                         const parseDate = (dateString) => {
//                             const [datePart, timePart] = dateString.split(", ")
//                             const [day, month, year] = datePart.split("/")
//                             return new Date(
//                                 `${month}/${day}/${year} ${timePart}`,
//                             )
//                         }

//                         const dateA = parseDate(a.date)
//                         const dateB = parseDate(b.date)

//                         return dateA - dateB
//                     })

//                 // get position data - e.g. decimal places for token0/1 will be needed
//                 const _position = await collectPosition(
//                     provider,
//                     chainId,
//                     tokenId,
//                 )

//                 const _pool = await collectPool(provider, chainId, _position)

//                 setLivecycle(_livecycle)
//                 setIsLoading(false)
//                 setPosition(_position)
//                 setPool(_pool)
//             })()
//         }
//     }, [address, chainId, network, tokenId, walletProvider])

//     useEffect(() => {
//         if (isFirstRender.current) {
//             isFirstRender.current = false
//             return
//         }
//         if (isSecondRender.current) {
//             isSecondRender.current = false
//             return
//         }

//         setError(
//             "You changed the network or address, so your tokenId is no longer valid. Click 'Choose Protocol' and select the one you would like to explore.",
//         )
//     }, [stableNetwork, stableAddress])

//     const emoji = {
//         MINT: "🔨",
//         INCREASE: "💰",
//         DECREASE: "💸",
//         COLLECT_FEES: "🐹",
//         BURN: "🔥",
//     }

//     const getDescription = (event, item) => {
//         let msg = null
//         switch (event) {
//             case "MINT":
//                 msg = "Position minted"
//                 break
//             case "INCREASE":
//                 msg = `Position increase by:
//                 ${Number(ethers.formatUnits(item.amount0, position.token0Decimals)).toFixed(2)}${position.token0Symbol}
//                 ${Number(ethers.formatUnits(item.amount1, position.token1Decimals)).toFixed(2)}${position.token1Symbol}`
//                 break
//             case "DECREASE":
//                 msg = `Position decrease by:
//                 ${Number(ethers.formatUnits(item.amount0, position.token0Decimals)).toFixed(2)}${position.token0Symbol}
//                 ${Number(ethers.formatUnits(item.amount1, position.token1Decimals)).toFixed(2)}${position.token1Symbol}`
//                 break
//             case "COLLECT_FEES":
//                 msg = `Fees collected:
//                 ${Number(ethers.formatUnits(item.amount0, position.token0Decimals)).toFixed(2)}${position.token0Symbol}
//                 ${Number(ethers.formatUnits(item.amount1, position.token1Decimals)).toFixed(2)}${position.token1Symbol}`
//                 break
//             case "BURN":
//                 msg = `Position transfered, remained:
//                 ${Number(ethers.formatUnits(item.amount0, position.token0Decimals)).toFixed(2)}${position.token0Symbol}
//                 ${Number(ethers.formatUnits(item.amount1, position.token1Decimals)).toFixed(2)}${position.token1Symbol}`
//                 break
//         }
//         return msg
//     }

//     function performCalc(livecycle, position) {
//         // clean and filter rubbish
//         if (livecycle === undefined) {
//             return null
//         }

//         // calc amounts of tokens which I put into the pool (and what I withdraw)
//         // it is total investment into the position
//         const increase = livecycle.filter(
//             (item) => item.livecycleEvent === "INCREASE",
//         )
//         const decrease = livecycle.filter(
//             (item) => item.livecycleEvent === "DECREASE",
//         )

//         const investAmounts = calcInvestedAmounts(increase, decrease)

//         // calc amounts which is in the position,
//         // like current reserves, collected fees, uncollected fees,
//         // cost of transactions during position livecycle
//         const collected = livecycle.filter(
//             (item) => item.livecycleEvent === "COLLECT_FEES",
//         )

//         const [reserves_0, reserves_1] = calcCurrentReserves(
//             position.liquidity,
//             pool.sqrtPriceX96,
//             Number(position.tickLower),
//             Number(position.tickUpper),
//         )

//         const posAmounts = calcPositionAmounts(
//             position,
//             reserves_0,
//             reserves_1,
//             increase,
//             decrease,
//             collected,
//         )

//         return "bleble"
//     }

//     return !error ? (
//         <div className={styles.main}>
//             {isLoading && (
//                 <Spinner label="on chain exploration..." color="warning" />
//             )}

//             {!isLoading && (
//                 <div className={styles.livecycle}>
//                     <p className={styles.title}>
//                         tokenId: {tokenId} position details
//                     </p>
//                     <Timeline position="alternate" className={styles.timeline}>
//                         {livecycle.map((item, index) => {
//                             if (item === undefined) {
//                                 return null
//                             }

//                             return (
//                                 <TimelineItem key={index}>
//                                     <TimelineOppositeContent
//                                         sx={{ m: "auto 0" }}
//                                         align="right"
//                                         className={styles.date}
//                                     >
//                                         {item.date}
//                                     </TimelineOppositeContent>
//                                     <TimelineSeparator>
//                                         <TimelineDot
//                                             color={
//                                                 index % 2
//                                                     ? "secondary"
//                                                     : "success"
//                                             }
//                                         />
//                                         {index < livecycle.length - 1 && (
//                                             <TimelineConnector
//                                                 sx={{ height: "10vh" }}
//                                             />
//                                         )}
//                                     </TimelineSeparator>
//                                     <TimelineContent sx={{ py: "12px", px: 2 }}>
//                                         <Typography
//                                             variant="h6"
//                                             component="span"
//                                             className={styles.event}
//                                         >
//                                             {item.livecycleEvent}{" "}
//                                             {emoji[item.livecycleEvent]}
//                                         </Typography>
//                                         <Typography className={styles.desc}>
//                                             {getDescription(
//                                                 item.livecycleEvent,
//                                                 item,
//                                             )}
//                                         </Typography>
//                                     </TimelineContent>
//                                 </TimelineItem>
//                             )
//                         })}
//                     </Timeline>
//                     {performCalc(livecycle, position)}
//                 </div>
//             )}
//         </div>
//     ) : (
//         <div className={styles.error_div}>
//             <p className={styles.error}>{error}</p>
//         </div>
//     )
// }

export default function DetailsPage({ params }) {
    return <div></div>
}
