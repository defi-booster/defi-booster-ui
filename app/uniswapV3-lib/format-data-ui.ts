import { ethers } from "ethers"

import {
    fromTicksToHumanReadablePrice,
    fromsqrtPriceX96ToHumanReadable,
    calcCurrentReserves,
    calcUncollectedFees,
    isInRange,
} from "./utils/math"

import { CollectedData } from "./utils/types"

export function formatDataForUI(positions: CollectedData[]) {
    const dataForUI = positions.map((data, index) => {
        const [reserves_0, reserves_1] = calcCurrentReserves(
            data.position.liquidity,
            data.pool.sqrtPriceX96,
            Number(data.position.tickLower),
            Number(data.position.tickUpper),
            Number(data.position.token0Decimals),
            Number(data.position.token1Decimals),
        )

        const [uncollectedFees_0, uncollectedFees_1] = calcUncollectedFees(
            data.position.liquidity,
            data.pool.feeGrowthGlobalX128_0,
            data.pool.feeGrowthGlobalX128_1,
            data.pool.tickUpperFeeGrowthOutsideX128_0,
            data.pool.tickUpperFeeGrowthOutsideX128_1,
            data.pool.tickLowerFeeGrowthOutsideX128_0,
            data.pool.tickLowerFeeGrowthOutsideX128_1,
            data.position.feeGrowthInsideLastX128_0,
            data.position.feeGrowthInsideLastX128_1,
            Number(data.position.tickUpper),
            Number(data.position.tickLower),
            Number(data.pool.tick),
            Number(data.position.token0Decimals),
            Number(data.position.token1Decimals),
        )

        const inRange = isInRange(
            Number(data.position.tickLower),
            Number(data.pool.tick),
            Number(data.position.tickUpper),
        )

        return {
            tokens: `${data.position.token0Symbol}-${data.position.token1Symbol}`,
            feeTier: `${Number(data.position.fee) / 10000} %`,
            token0token1Price: `${fromsqrtPriceX96ToHumanReadable(
                data.pool.sqrtPriceX96,
                data.position.token0Decimals,
                data.position.token1Decimals,
            ).token0Token1Price.toFixed(8)} ${data.position.token0Symbol}/${
                data.position.token1Symbol
            }`,
            token1token0Price: `${fromsqrtPriceX96ToHumanReadable(
                data.pool.sqrtPriceX96,
                data.position.token0Decimals,
                data.position.token1Decimals,
            ).token1Token0Price.toFixed(8)} ${data.position.token1Symbol}/${
                data.position.token0Symbol
            }`,
            token0Reserves: `${reserves_0} ${data.position.token0Symbol}`,
            token1Reserves: `${reserves_1} ${data.position.token1Symbol}`,
            tickLower: Number(data.position.tickLower),
            tickCurrent: Number(data.pool.tick),
            tickUpper: Number(data.position.tickUpper),
            priceTickLower: `${fromTicksToHumanReadablePrice(
                Number(data.position.tickLower),
                Number(data.position.token0Decimals),
                Number(data.position.token1Decimals),
            ).token1Token0Price.toFixed(8)} ${data.position.token1Symbol} / ${
                data.position.token0Symbol
            }`,
            priceTickCurrent: `${fromTicksToHumanReadablePrice(
                Number(data.pool.tick),
                Number(data.position.token0Decimals),
                Number(data.position.token1Decimals),
            ).token1Token0Price.toFixed(8)} ${data.position.token1Symbol} / ${
                data.position.token0Symbol
            }`,
            priceTickUpper: `${fromTicksToHumanReadablePrice(
                Number(data.position.tickUpper),
                Number(data.position.token0Decimals),
                Number(data.position.token1Decimals),
            ).token1Token0Price.toFixed(8)} ${data.position.token1Symbol} / ${
                data.position.token0Symbol
            }`,
            uncollectedFeesToken0: `${uncollectedFees_0} ${data.position.token0Symbol}`,
            uncollectedFeesToken1: `${uncollectedFees_1} ${data.position.token1Symbol}`,
            tokenId: Number(data.position.tokenId),
            mintBlock: data.positionMintInfo.blockNumber,
            mintDate: data.positionMintInfo.date,
            mintSupplyToken0: Number(
                ethers.formatUnits(
                    data.positionMintInfo.token0Amount,
                    data.position.token0Decimals,
                ),
            ).toFixed(8),
            mintSupplyToken1: Number(
                ethers.formatUnits(
                    data.positionMintInfo.token1Amount,
                    data.position.token1Decimals,
                ),
            ).toFixed(8),
            isInRange: inRange,
        }
    })
    return dataForUI
}
