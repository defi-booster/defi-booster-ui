"use client"
import { useRouter } from "next/navigation"
import { useWeb3ModalAccount } from "@web3modal/ethers/react"
import { Button, Card, Divider, Spinner } from "@nextui-org/react"

import { useQuery } from "@apollo/client"

import { Header } from "./card-components/header"
import { Price } from "./card-components/price"
import { Reserves } from "./card-components/reserves"
import { Ticks } from "./card-components/ticks"
import { TickPrices } from "./card-components/tick-prices"
import { UncollectedFees } from "./card-components/uncollected-fees"
import { PositionGauge } from "./card-components/gauge"

import config from "../../../my.config"
import { EUniswapV3SupportedChains } from "defi-booster-shared"

import { GET_V3_POSITIONS } from "../../api_graphql/uniswapv3/queries"

import styles from "../../styles/uniswapv3/WalletLPLst.module.css"

export function WalletLPList({ network }) {
    const router = useRouter()

    // web3 hooks
    const { address, chainId } = useWeb3ModalAccount()

    const { loading, error, data } = useQuery(GET_V3_POSITIONS, {
        variables: {
            chainId: chainId,
            address: address,
        },
    })

    // wait untill all needed data are fetched
    if (loading)
        return (
            <div className={styles.loading}>
                <Spinner label="" color="success" size="lg" />
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

    // if user doesn't have any position - display message about it
    if (data.getV3Positions.length === 0) {
        return (
            <div className={styles.no_positions}>
                <p className={styles.no_positions_text}>
                    User doesn&apos;t have any positions.
                </p>
            </div>
        )
    }

    const goToDetails = (
        tokenId: string,
        token0Decimals: string,
        token1Decimals: string,
        token0Symbol: string,
        token1Symbol: string,
    ) => {
        router.push(
            `/uniswapv3/${tokenId}?token0Symbol=${token0Symbol}&token0Decimals=${token0Decimals}&token1Symbol=${token1Symbol}&token1Decimals=${token1Decimals}`,
        )
    }

    const positions = data.getV3Positions

    return (
        <div
            style={{
                margin: "20px",
                padding: "10px",
            }}
            className="gap-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
            {positions.map((position, idx) => (
                <Card
                    className="max-w-[450px]"
                    key={idx}
                    style={{ margin: "5px 0" }}
                >
                    <Header
                        tokenId={position.tokenId}
                        token0Symbol={position.token0Symbol}
                        token1Symbol={position.token1Symbol}
                        fee={position.fee}
                    />
                    <Divider />
                    <Price
                        sqrtPriceX96={position.poolInfo.sqrtPriceX96}
                        token0Decimals={position.token0Decimals}
                        token1Decimals={position.token1Decimals}
                        token0Symbol={position.token0Symbol}
                        token1Symbol={position.token1Symbol}
                    />
                    <Divider />
                    <Reserves
                        position_liquidity={position.liquidity}
                        sqrtPriceX96={position.poolInfo.sqrtPriceX96}
                        tickLower={position.tickLower}
                        tickUpper={position.tickUpper}
                        token0Decimals={position.token0Decimals}
                        token1Decimals={position.token1Decimals}
                        token0Symbol={position.token0Symbol}
                        token1Symbol={position.token1Symbol}
                    />
                    <Divider />
                    <Ticks
                        pool_tick={position.poolInfo.tick}
                        tickLower={position.tickLower}
                        tickUpper={position.tickUpper}
                    />
                    <Divider />
                    <TickPrices
                        pool_tick={position.poolInfo.tick}
                        tickLower={position.tickLower}
                        tickUpper={position.tickUpper}
                        token0Decimals={position.token0Decimals}
                        token1Decimals={position.token1Decimals}
                        token0Symbol={position.token0Symbol}
                        token1Symbol={position.token1Symbol}
                    />
                    <Divider />
                    <UncollectedFees
                        position_liquidity={position.liquidity}
                        pool_feeGrowthGlobalX128_0={
                            position.poolInfo.feeGrowthGlobalX128_0
                        }
                        pool_feeGrowthGlobalX128_1={
                            position.poolInfo.feeGrowthGlobalX128_1
                        }
                        pool_tickUpperFeeGrowthOutsideX128_0={
                            position.poolInfo.tickUpperFeeGrowthOutsideX128_0
                        }
                        pool_tickUpperFeeGrowthOutsideX128_1={
                            position.poolInfo.tickUpperFeeGrowthOutsideX128_1
                        }
                        pool_tickLowerFeeGrowthOutsideX128_0={
                            position.poolInfo.tickLowerFeeGrowthOutsideX128_0
                        }
                        pool_tickLowerFeeGrowthOutsideX128_1={
                            position.poolInfo.tickLowerFeeGrowthOutsideX128_1
                        }
                        position_feeGrowthInsideLastX128_0={
                            position.feeGrowthInsideLastX128_0
                        }
                        position_feeGrowthInsideLastX128_1={
                            position.feeGrowthInsideLastX128_1
                        }
                        tickLower={position.tickLower}
                        tickUpper={position.tickUpper}
                        pool_tick={position.poolInfo.tick}
                        token0Decimals={position.token0Decimals}
                        token1Decimals={position.token1Decimals}
                        token0Symbol={position.token0Symbol}
                        token1Symbol={position.token1Symbol}
                    />
                    <Divider />
                    <PositionGauge
                        pool_tick={position.poolInfo.tick}
                        tickLower={position.tickLower}
                        tickUpper={position.tickUpper}
                        token0Decimals={position.token0Decimals}
                        token1Decimals={position.token1Decimals}
                    />
                    <Button
                        onClick={() =>
                            goToDetails(
                                position.tokenId,
                                position.token0Decimals,
                                position.token1Decimals,
                                position.token0Symbol,
                                position.token1Symbol,
                            )
                        }
                    >
                        view position details
                    </Button>
                </Card>
            ))}
        </div>
    )
}
