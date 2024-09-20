import { LivecycleRecord, Position } from "../utils/types"

export function calcInvestedAmounts(
    increaseItems: LivecycleRecord[],
    decreaseItems: LivecycleRecord[],
) {
    // amounts which I deposit to the pool
    const amountIncreased = increaseItems.reduce(
        (acc, item) => ({
            amount0: acc.amount0 + item.amount0,
            amount1: acc.amount1 + item.amount1,
        }),
        { amount0: 0n, amount1: 0n },
    )

    // amounts which I withdraw from the pool
    const amountDecreased = decreaseItems.reduce(
        (acc, item) => ({
            amount0: acc.amount0 + item.amount0,
            amount1: acc.amount1 + item.amount1,
        }),
        { amount0: 0n, amount1: 0n },
    )

    return {
        amount0: amountIncreased.amount0 - amountDecreased.amount0,
        amount1: amountIncreased.amount1 - amountDecreased.amount1,
    }
}

export function calcPositionAmounts(
    position: Position,
    reserves0: bigint,
    reserves1: bigint,
    increaseItems: LivecycleRecord[],
    decreaseItems: LivecycleRecord[],
    collectedItems: LivecycleRecord[],
) {
    // it is what I collected as fees from the pool - it is profit
    const amountFeesCollected = collectedItems.reduce(
        (acc, item) => ({
            amount0: acc.amount0 + item.amount0,
            amount1: acc.amount1 + item.amount1,
        }),
        { amount0: 0n, amount1: 0n },
    )

    // tx fees - we need to subtract all transaction fees as a cost of activity on position - it is cost
    const increaseTxFeesCost = increaseItems.reduce(
        (acc, item) => ({
            feePaid: acc.feePaid + item.feePaid,
        }),
        { feePaid: 0n },
    ).feePaid

    const decreaseTxFeesCost = decreaseItems.reduce(
        (acc, item) => ({
            feePaid: acc.feePaid + item.feePaid,
        }),
        { feePaid: 0n },
    ).feePaid

    const collectedTxFeesCost = collectedItems.reduce(
        (acc, item) => ({
            feePaid: acc.feePaid + item.feePaid,
        }),
        { feePaid: 0n },
    ).feePaid

    // we add current reserve0 and reserve1
    // we add uncollected fees from position which is tokensOwed0 and tokensOwed1 - it is profit
    return {
        amount0: reserves0 + amountFeesCollected.amount0 + position.tokensOwed0,
        amount1: reserves1 + amountFeesCollected.amount1 + position.tokensOwed1,
        txFeesCost:
            increaseTxFeesCost + decreaseTxFeesCost + collectedTxFeesCost,
    }
}
