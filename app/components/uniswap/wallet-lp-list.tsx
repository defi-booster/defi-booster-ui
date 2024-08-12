"use client"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react"

import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Divider,
    Link,
    Image,
    Button,
} from "@nextui-org/react"

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

    const isTicksInRange = (
        tickLower: number,
        tickCurrent: number,
        tickUpper: number
    ) => {
        const value1 = tickCurrent - tickLower
        const value2 = tickCurrent - tickUpper
        if (value1 >= 0 && value2 <= 0) {
            return true
        } else {
            return false
        }
    }

    return network !== SupportedChains.Unsupported ? (
        <div
            style={{
                margin: "20px",
                padding: "10px",
                display: "flex",
                justifyContent: "space-evenly",
            }}
        >
            {positions.map((data, index) => {
                return (
                    <Card className="max-w-[400px]">
                        <CardHeader className="flex gap-3">
                            <p>🦄</p>
                            <div className="flex flex-col">
                                <p className="text-md">
                                    {data.position.token0Symbol}-
                                    {data.position.token1Symbol}
                                </p>
                                <p className="text-small text-default-500">
                                    fee: {Number(data.position.fee) / 10000} %
                                </p>
                            </div>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <p>current price:</p>
                            <p>
                                {
                                    fromTicksToHumanReadablePrice(
                                        Number(data.pool.tick),
                                        Number(data.position.token0Decimals),
                                        Number(data.position.token1Decimals)
                                    ).token0Token1Price
                                }{" "}
                                {data.position.token0Symbol}/
                                {data.position.token1Symbol}
                            </p>
                            <p>
                                {
                                    fromTicksToHumanReadablePrice(
                                        Number(data.pool.tick),
                                        Number(data.position.token0Decimals),
                                        Number(data.position.token1Decimals)
                                    ).token1Token0Price
                                }{" "}
                                {data.position.token1Symbol}/
                                {data.position.token0Symbol}
                            </p>
                        </CardBody>
                        <Divider />
                        <CardBody>
                            <p>tick lower: {Number(data.position.tickLower)}</p>
                            <p>tick current: {Number(data.pool.tick)}</p>
                            <p>tick upper: {Number(data.position.tickUpper)}</p>
                        </CardBody>
                        <Divider />
                        <CardBody>
                            <p>
                                price from tick lower:{" "}
                                {
                                    fromTicksToHumanReadablePrice(
                                        Number(data.position.tickLower),
                                        Number(data.position.token0Decimals),
                                        Number(data.position.token1Decimals)
                                    ).token1Token0Price
                                }
                                {data.position.token1Symbol}/
                                {data.position.token0Symbol}
                            </p>
                            <p>
                                price current:{" "}
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
                            <p>
                                price from tick upper:{" "}
                                {
                                    fromTicksToHumanReadablePrice(
                                        Number(data.position.tickUpper),
                                        Number(data.position.token0Decimals),
                                        Number(data.position.token1Decimals)
                                    ).token1Token0Price
                                }
                                {data.position.token1Symbol}/
                                {data.position.token0Symbol}
                            </p>
                        </CardBody>
                        <Divider />
                        <CardFooter>
                            {isTicksInRange(
                                Number(data.position.tickLower),
                                Number(data.pool.tick),
                                Number(data.position.tickUpper)
                            ) ? (
                                <Button color="success" aria-label="Like">
                                    In range
                                </Button>
                            ) : (
                                <Button color="danger" aria-label="Like">
                                    out of range
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    ) : (
        <div>Unsupported network</div>
    )
}
