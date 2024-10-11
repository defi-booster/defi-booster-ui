import { ethers } from "defi-booster-shared"

import {
    UNISWAP_V3_ILivecycleRecord,
    UNISWAP_V3_IPosition,
} from "defi-booster-shared"
import { ELivecycleEvents } from "defi-booster-shared"
import { calcCurrentReserves, calcUncollectedFees } from "defi-booster-shared"

export function calcFiatMetrics(
    livecycle: UNISWAP_V3_ILivecycleRecord[],
    position: UNISWAP_V3_IPosition,
    tokenPrice_0: number,
    tokenPrice_1: number,
    ethPrice: number,
) {
    console.log("livecycle: ", livecycle)
    const {
        invest_0,
        invest_1,
        feeCost,
        collectedFees_0,
        collectedFees_1,
        uncollectedFees_0,
        uncollectedFees_1,
        currentReserves_0,
        currentReserves_1,
    } = _calcRawValues(livecycle, position)

    // format values
    const f_invest_0 = Number(
        ethers.formatUnits(invest_0, Number(position.token0Decimals)),
    )
    const f_invest_1 = Number(
        ethers.formatUnits(invest_1, Number(position.token1Decimals)),
    )
    const f_feeCost = Number(ethers.formatUnits(feeCost, 18))
    const f_collectedFees_0 = Number(
        ethers.formatUnits(collectedFees_0, Number(position.token0Decimals)),
    )
    const f_collectedFees_1 = Number(
        ethers.formatUnits(collectedFees_1, Number(position.token1Decimals)),
    )
    const f_uncollectedFees_0 = Number(
        ethers.formatUnits(uncollectedFees_0, Number(position.token0Decimals)),
    )
    const f_uncollectedFees_1 = Number(
        ethers.formatUnits(uncollectedFees_1, Number(position.token1Decimals)),
    )
    const f_currentReserves_0 = Number(
        ethers.formatUnits(currentReserves_0, Number(position.token0Decimals)),
    )
    const f_currentReserves_1 = Number(
        ethers.formatUnits(currentReserves_1, Number(position.token1Decimals)),
    )

    // the amounts I take out of my pocket
    const takeOutOfMyPocket =
        f_invest_0 * tokenPrice_0 +
        f_invest_1 * tokenPrice_1 +
        f_feeCost * ethPrice

    // the amount I have recovered or can recover at this moment
    const whatICanBackNow =
        f_collectedFees_0 * tokenPrice_0 +
        f_collectedFees_1 * tokenPrice_1 +
        f_uncollectedFees_0 * tokenPrice_0 +
        f_uncollectedFees_1 * tokenPrice_1 +
        f_currentReserves_0 * tokenPrice_0 +
        f_currentReserves_1 * tokenPrice_1
    // If I did nothing
    const ifIDidNothing = f_invest_0 * tokenPrice_0 + f_invest_1 * tokenPrice_1
    // my profit or loss
    const profitOrLoss = whatICanBackNow - takeOutOfMyPocket
    // IL
    const IL = ifIDidNothing - whatICanBackNow

    return {
        takeOutOfMyPocket,
        whatICanBackNow,
        ifIDidNothing,
        profitOrLoss,
        IL, // impernament loss
    }
}

function _calcRawValues(
    livecycle: UNISWAP_V3_ILivecycleRecord[],
    position: UNISWAP_V3_IPosition,
) {
    const investAmounts = _calcInvestedAmounts(livecycle) // calc amounts of tokens which I put into the pool [increase, decrease]
    const feeCost = _calcFeeCostsAmounts(livecycle) // calc amounts of tokens which I withdraw
    const collectedFees = _calcCollectedFees(livecycle) // calc fee amount which you pay to manage the pool
    // calc current reserves
    const [currentReserves_0, currentReserves_1] = calcCurrentReserves(
        BigInt(position.liquidity),
        BigInt(position.poolInfo.sqrtPriceX96),
        Number(position.tickLower),
        Number(position.tickUpper),
    )
    // calc uncollected fees
    const [uncollectedFees_0, uncollectedFees_1] = calcUncollectedFees(
        BigInt(position.liquidity),
        BigInt(position.poolInfo.feeGrowthGlobalX128_0),
        BigInt(position.poolInfo.feeGrowthGlobalX128_1),
        BigInt(position.poolInfo.tickUpperFeeGrowthOutsideX128_0),
        BigInt(position.poolInfo.tickUpperFeeGrowthOutsideX128_1),
        BigInt(position.poolInfo.tickLowerFeeGrowthOutsideX128_0),
        BigInt(position.poolInfo.tickLowerFeeGrowthOutsideX128_1),
        BigInt(position.feeGrowthInsideLastX128_0),
        BigInt(position.feeGrowthInsideLastX128_1),
        Number(position.tickUpper),
        Number(position.tickLower),
        Number(position.poolInfo.tick),
        Number(position.token0Decimals),
        Number(position.token1Decimals),
    )

    return {
        invest_0: investAmounts.amount0,
        invest_1: investAmounts.amount1,
        feeCost,
        collectedFees_0: collectedFees.amount0,
        collectedFees_1: collectedFees.amount1,
        uncollectedFees_0,
        uncollectedFees_1,
        currentReserves_0,
        currentReserves_1,
    }
}

function _calcInvestedAmounts(livecycle: UNISWAP_V3_ILivecycleRecord[]) {
    const increase = livecycle.filter(
        (item) =>
            item.livecycleEvent === "MINT" ||
            item.livecycleEvent === "INCREASE",
    )

    const decrease = livecycle.filter(
        (item) => item.livecycleEvent === "DECREASE",
    )

    const amountIncreased = increase.reduce(
        (acc, item) => ({
            amount0: BigInt(acc.amount0) + BigInt(item.amount0),
            amount1: BigInt(acc.amount1) + BigInt(item.amount1),
        }),
        { amount0: 0n, amount1: 0n },
    )

    // amounts which I withdraw from the pool
    const amountDecreased = decrease.reduce(
        (acc, item) => ({
            amount0: BigInt(acc.amount0) + BigInt(item.amount0),
            amount1: BigInt(acc.amount1) + BigInt(item.amount1),
        }),
        { amount0: 0n, amount1: 0n },
    )

    return {
        amount0: amountIncreased.amount0 - amountDecreased.amount0,
        amount1: amountIncreased.amount1 - amountDecreased.amount1,
    }
}

function _calcFeeCostsAmounts(livecycle: UNISWAP_V3_ILivecycleRecord[]) {
    const feeCost = livecycle.reduce(
        (acc, item) => ({
            feePaid: BigInt(acc.feePaid) + BigInt(item.feePaid),
        }),
        { feePaid: 0n },
    )

    return feeCost.feePaid
}

function _calcCollectedFees(livecycle: UNISWAP_V3_ILivecycleRecord[]) {
    // if collect is precede by decrease - then we need to subtract decrease amount to get only fees
    const _livecycle = livecycle.map((item, idx) => {
        if (
            item.livecycleEvent === ELivecycleEvents.COLLECT_FEES &&
            idx > 0 &&
            livecycle[idx - 1].livecycleEvent === ELivecycleEvents.DECREASE
        ) {
            return {
                ...item,
                amount0:
                    BigInt(item.amount0) - BigInt(livecycle[idx - 1].amount0),
                amount1:
                    BigInt(item.amount1) - BigInt(livecycle[idx - 1].amount1),
            }
        }

        return item
    })

    const collect = livecycle.filter(
        (item) => item.livecycleEvent === ELivecycleEvents.COLLECT_FEES,
    )

    const collectedFees = collect.reduce(
        (acc, item) => ({
            amount0: BigInt(acc.amount0) + BigInt(item.amount0),
            amount1: BigInt(acc.amount1) + BigInt(item.amount1),
        }),
        { amount0: 0n, amount1: 0n },
    )

    return {
        amount0: collectedFees.amount0,
        amount1: collectedFees.amount1,
    }
}
