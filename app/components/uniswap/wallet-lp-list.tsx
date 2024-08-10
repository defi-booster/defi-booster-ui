"use client"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react"

import { SupportedChains } from "../../utils/enums"
import { getUserPositions } from "../../uniswapV3/user-position"
import { PositionData } from "../../uniswapV3/types"
import { Token } from "@uniswap/sdk-core"
import { getPoolInfo } from "../../uniswapV3/pool"
import { fromTicksToHumanReadablePrice } from "../../uniswapV3/utils/math"

export function WalletLPList({ network }) {
    const [positions, setPositionsData] = useState<Array<PositionData>>([])
    const { address, chainId } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()

    useEffect(() => {
        if (
            walletProvider !== undefined &&
            network !== SupportedChains.Unsupported
        ) {
            const provider = new ethers.BrowserProvider(walletProvider)

            ;(async () => {
                let positionDataLst: Array<PositionData> = []

                const userPositionInfos = await getUserPositions(
                    provider,
                    address,
                    chainId
                )

                for (let i = 0; i < userPositionInfos.length; i++) {
                    const token0Obj = new Token(
                        chainId,
                        userPositionInfos[i].token0Address,
                        Number(userPositionInfos[i].token0Decimals),
                        userPositionInfos[i].token0Symbol,
                        userPositionInfos[i].token0Symbol
                    )

                    const token1Obj = new Token(
                        chainId,
                        userPositionInfos[i].token1Address,
                        Number(userPositionInfos[i].token1Decimals),
                        userPositionInfos[i].token1Symbol,
                        userPositionInfos[i].token1Symbol
                    )

                    const generalPoolInfo = await getPoolInfo(
                        provider,
                        chainId,
                        token0Obj,
                        token1Obj,
                        userPositionInfos[i].fee
                    )

                    positionDataLst.push({
                        position: userPositionInfos[i],
                        pool: generalPoolInfo,
                    })
                }

                setPositionsData(positionDataLst)
            })()
        }
    }, [walletProvider, network, chainId, address])

    return network !== SupportedChains.Unsupported ? (
        <div
            style={{
                border: "1px solid black",
                margin: "20px",
                padding: "10px",
            }}
        >
            <div
                style={{
                    border: "1px solid black",
                    margin: "20px",
                    padding: "10px",
                }}
            >
                {positions.map((data, index) => {
                    return (
                        <div
                            style={{
                                border: "1px solid black",
                                margin: "20px",
                                padding: "10px",
                            }}
                            key={index}
                        >
                            <p>
                                token0: {data.position.token0Symbol}{" "}
                                {data.position.token0Address}
                            </p>
                            <p>
                                token1: {data.position.token1Symbol}{" "}
                                {data.position.token1Address}
                            </p>
                            <p>fee: {Number(data.position.fee) / 10000} %</p>
                            <p>liquidity: {Number(data.position.liquidity)}</p>
                            <p>
                                current price:{" "}
                                {
                                    fromTicksToHumanReadablePrice(
                                        Number(data.pool.tick),
                                        Number(data.position.token0Decimals),
                                        Number(data.position.token1Decimals)
                                    ).token0Token1Price
                                }
                                {data.position.token0Symbol}/
                                {data.position.token1Symbol}
                            </p>
                            <p>
                                current price:{" "}
                                {
                                    fromTicksToHumanReadablePrice(
                                        Number(data.pool.tick),
                                        Number(data.position.token0Decimals),
                                        Number(data.position.token1Decimals)
                                    ).token1Token0Price
                                }
                                {data.position.token1Symbol}/
                                {data.position.token0Symbol}
                            </p>
                            <div
                                style={{
                                    border: "1px solid black",
                                    margin: "20px",
                                    padding: "10px",
                                }}
                            >
                                <div
                                    style={{
                                        border: "1px solid black",
                                        margin: "20px",
                                        padding: "10px",
                                    }}
                                >
                                    <p>
                                        tick lower:{" "}
                                        {Number(data.position.tickLower)}
                                    </p>
                                    <p>
                                        range price calculated from tick lower:{" "}
                                        {
                                            fromTicksToHumanReadablePrice(
                                                Number(data.position.tickLower),
                                                Number(
                                                    data.position.token0Decimals
                                                ),
                                                Number(
                                                    data.position.token1Decimals
                                                )
                                            ).token0Token1Price
                                        }
                                        {data.position.token0Symbol}/
                                        {data.position.token1Symbol}
                                    </p>
                                    <p>
                                        range price calculated from tick lower:{" "}
                                        {
                                            fromTicksToHumanReadablePrice(
                                                Number(data.position.tickLower),
                                                Number(
                                                    data.position.token0Decimals
                                                ),
                                                Number(
                                                    data.position.token1Decimals
                                                )
                                            ).token1Token0Price
                                        }
                                        {data.position.token1Symbol}/
                                        {data.position.token0Symbol}
                                    </p>
                                </div>
                                <div
                                    style={{
                                        border: "1px solid black",
                                        margin: "20px",
                                        padding: "10px",
                                    }}
                                >
                                    <p>
                                        tick upper:{" "}
                                        {Number(data.position.tickUpper)}
                                    </p>
                                    <p>
                                        range price calculated from tick upper:{" "}
                                        {
                                            fromTicksToHumanReadablePrice(
                                                Number(data.position.tickLower),
                                                Number(
                                                    data.position.token0Decimals
                                                ),
                                                Number(
                                                    data.position.token1Decimals
                                                )
                                            ).token0Token1Price
                                        }
                                        {data.position.token0Symbol}/
                                        {data.position.token1Symbol}
                                    </p>
                                    <p>
                                        range price calculated from tick upper:{" "}
                                        {
                                            fromTicksToHumanReadablePrice(
                                                Number(data.position.tickLower),
                                                Number(
                                                    data.position.token0Decimals
                                                ),
                                                Number(
                                                    data.position.token1Decimals
                                                )
                                            ).token1Token0Price
                                        }
                                        {data.position.token1Symbol}
                                        {data.position.token0Symbol}
                                    </p>
                                </div>
                            </div>
                            <p>
                                token0 fees collected:{" "}
                                {Number(data.position.tokensOwed0)}
                            </p>
                            <p>
                                token1 fees collected:{" "}
                                {Number(data.position.tokensOwed1)}
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    ) : (
        <div>Unsupported network</div>
    )
}
