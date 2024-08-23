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
    Button,
} from "@nextui-org/react"

import { SupportedChains } from "../../utils/enums"
import { getUserPositions } from "../../uniswapV3/user-position"
import { PositionData } from "../../uniswapV3/types"
import { Token } from "@uniswap/sdk-core"
import { getPoolInfo } from "../../uniswapV3/pool"
import {
    fromTicksToHumanReadablePrice,
    fromsqrtPriceX96ToHumanReadable,
    calcCurrentReserves,
    calcUncollectedFees,
    isInRange,
} from "../../uniswapV3/utils/math"
import {
    getNonFungiblePositionManagerContract,
    getPoolContract,
} from "../../uniswapV3/utils/get-contracts"
import { getPoolMintingDate } from "../../uniswapV3/position-livecycle"

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

                const nfpmContract = getNonFungiblePositionManagerContract(
                    provider,
                    chainId
                )

                const userPositionInfos = await getUserPositions(
                    provider,
                    address,
                    nfpmContract
                )

                const positionMintInfos = await getPoolMintingDate(
                    provider,
                    chainId,
                    nfpmContract,
                    address
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

                    const poolContract = getPoolContract(
                        provider,
                        chainId,
                        token0Obj,
                        token1Obj,
                        userPositionInfos[i].fee
                    )
                    const generalPoolInfo = await getPoolInfo(
                        poolContract,
                        Number(userPositionInfos[i].tickUpper),
                        Number(userPositionInfos[i].tickLower)
                    )

                    const positionMintInfo = positionMintInfos.filter(
                        (mintInfo) =>
                            mintInfo.tokenId === userPositionInfos[i].tokenId
                    )

                    if (positionMintInfo.length !== userPositionInfos.length) {
                        console.error(
                            "mint infos and position infos lengths not match!"
                        )
                    }

                    if (positionMintInfo.length === 0) {
                        console.error(
                            `can't find mint info associated with tokenId ${userPositionInfos[i].tokenId}!`
                        )
                    }

                    positionDataLst.push({
                        position: userPositionInfos[i],
                        pool: generalPoolInfo,
                        positionMintInfo: positionMintInfo[0],
                    })
                }
                setPositionsData(positionDataLst)
            })()
        }
    }, [walletProvider, network, address])

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
                    <Card className="max-w-[400px]" key={index}>
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
                                    fromsqrtPriceX96ToHumanReadable(
                                        data.pool.sqrtPriceX96,
                                        data.position.token0Decimals,
                                        data.position.token1Decimals
                                    ).token0Token1Price
                                }{" "}
                                {data.position.token0Symbol}/
                                {data.position.token1Symbol}
                            </p>
                            <p>
                                {" "}
                                {
                                    fromsqrtPriceX96ToHumanReadable(
                                        data.pool.sqrtPriceX96,
                                        data.position.token0Decimals,
                                        data.position.token1Decimals
                                    ).token1Token0Price
                                }{" "}
                                {data.position.token1Symbol}/
                                {data.position.token0Symbol}
                            </p>
                        </CardBody>
                        <Divider />
                        <CardBody>
                            supplied liquidity:{" "}
                            {Number(data.position.liquidity)}
                        </CardBody>
                        <Divider />
                        <CardBody>
                            <p>current reserves:</p>
                            <p>
                                {
                                    calcCurrentReserves(
                                        data.position.liquidity,
                                        data.pool.sqrtPriceX96,
                                        Number(data.position.tickLower),
                                        Number(data.position.tickUpper),
                                        Number(data.position.token0Decimals),
                                        Number(data.position.token1Decimals)
                                    )[0]
                                }{" "}
                                {data.position.token0Symbol}
                            </p>
                            <p>
                                {
                                    calcCurrentReserves(
                                        data.position.liquidity,
                                        data.pool.sqrtPriceX96,
                                        Number(data.position.tickLower),
                                        Number(data.position.tickUpper),
                                        Number(data.position.token0Decimals),
                                        Number(data.position.token1Decimals)
                                    )[1]
                                }{" "}
                                {data.position.token1Symbol}
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
                        <CardBody>
                            <p>uncollected fees:</p>
                            <p>
                                {
                                    calcUncollectedFees(
                                        data.position.liquidity,
                                        data.pool.feeGrowthGlobalX128_0,
                                        data.pool.feeGrowthGlobalX128_1,
                                        data.pool
                                            .tickUpperFeeGrowthOutsideX128_0,
                                        data.pool
                                            .tickUpperFeeGrowthOutsideX128_1,
                                        data.pool
                                            .tickLowerFeeGrowthOutsideX128_0,
                                        data.pool
                                            .tickLowerFeeGrowthOutsideX128_1,
                                        data.position.feeGrowthInsideLastX128_0,
                                        data.position.feeGrowthInsideLastX128_1,
                                        Number(data.position.tickUpper),
                                        Number(data.position.tickLower),
                                        Number(data.pool.tick),
                                        Number(data.position.token0Decimals),
                                        Number(data.position.token1Decimals)
                                    )[0]
                                }{" "}
                                {data.position.token0Symbol}
                            </p>
                            <p>
                                {
                                    calcUncollectedFees(
                                        data.position.liquidity,
                                        data.pool.feeGrowthGlobalX128_0,
                                        data.pool.feeGrowthGlobalX128_1,
                                        data.pool
                                            .tickUpperFeeGrowthOutsideX128_0,
                                        data.pool
                                            .tickUpperFeeGrowthOutsideX128_1,
                                        data.pool
                                            .tickLowerFeeGrowthOutsideX128_0,
                                        data.pool
                                            .tickLowerFeeGrowthOutsideX128_1,
                                        data.position.feeGrowthInsideLastX128_0,
                                        data.position.feeGrowthInsideLastX128_1,
                                        Number(data.position.tickUpper),
                                        Number(data.position.tickLower),
                                        Number(data.pool.tick),
                                        Number(data.position.token0Decimals),
                                        Number(data.position.token1Decimals)
                                    )[1]
                                }{" "}
                                {data.position.token1Symbol}
                            </p>
                        </CardBody>
                        <Divider />
                        <CardBody>
                            <p>tokenId: {Number(data.position.tokenId)}</p>
                            <p>
                                position minted on block number:{" "}
                                {data.positionMintInfo.blockNumber}
                            </p>
                            <p>mint date: {data.positionMintInfo.date}</p>
                            <p>
                                token0 supplied after position minted:{" "}
                                {ethers.formatUnits(
                                    Number(data.positionMintInfo.token0Amount),
                                    Number(data.position.token0Decimals)
                                )}
                            </p>
                            <p>
                                token1 supplied after position minted:{" "}
                                {ethers.formatUnits(
                                    Number(
                                        Number(
                                            data.positionMintInfo.token1Amount
                                        )
                                    ),
                                    Number(data.position.token1Decimals)
                                )}
                            </p>
                        </CardBody>
                        <Divider />
                        <CardFooter>
                            {isInRange(
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
