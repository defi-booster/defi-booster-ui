"use client"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react"

import { SupportedChains } from "../../utils/enums"
import { getUserPositions, PositionInfo } from "../../uniswapV3/position"

export function WalletLPList({ network }) {
    const [positions, setUserPositions] = useState<Array<PositionInfo>>([])
    const { address, chainId } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()

    useEffect(() => {
        if (
            walletProvider !== undefined &&
            network !== SupportedChains.Unsupported
        ) {
            const provider = new ethers.BrowserProvider(walletProvider)

            ;(async () => {
                const infos = await getUserPositions(provider, address, chainId)
                setUserPositions(infos)
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
                {positions.map((position, index) => {
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
                                token0: {position.token0Symbol}{" "}
                                {position.token0Address}
                            </p>
                            <p>
                                token1: {position.token1Symbol}{" "}
                                {position.token1Address}
                            </p>
                            <p>fee: {Number(position.fee) / 10000} %</p>
                            <p>liquidity: {Number(position.liquidity)}</p>
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
                                        tick lower: {Number(position.tickLower)}
                                    </p>
                                    <p>
                                        range price calculated from tick lower:{" "}
                                        {position.token0PerToken1PriceLower}{" "}
                                        {position.token0Symbol}/
                                        {position.token1Symbol}
                                    </p>
                                    <p>
                                        range price calculated from tick lower:{" "}
                                        {position.token1PerToken0PriceLower}{" "}
                                        {position.token1Symbol}/
                                        {position.token0Symbol}
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
                                        tick upper: {Number(position.tickUpper)}
                                    </p>
                                    <p>
                                        range price calculated from tick upper:{" "}
                                        {position.token0PerToken1PriceUpper}{" "}
                                        {position.token0Symbol}/
                                        {position.token1Symbol}
                                    </p>
                                    <p>
                                        range price calculated from tick upper:{" "}
                                        {position.token1PerToken0PriceUpper}{" "}
                                        {position.token1Symbol}/
                                        {position.token0Symbol}
                                    </p>
                                </div>
                            </div>
                            <p>
                                token0 fees collected:{" "}
                                {Number(position.tokensOwed0)}
                            </p>
                            <p>
                                token1 fees collected:{" "}
                                {Number(position.tokensOwed1)}
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
