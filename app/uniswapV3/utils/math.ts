interface PricesInfo {
    token0Token1Price: number
    token1Token0Price: number
}

// constants
const ZERO = 0n
const Q96 = 2 ** 96
const Q128 = 2n ** 128n
const Q256 = 2n ** 256n

export function fromTicksToHumanReadablePrice(
    ticks: number,
    decimals0: number,
    decimals1: number
): PricesInfo {
    /**
     * @notice calculate human readable price from ticks
     * @dev first code convert ticks to raw_price,
     * then we take into account the difference of deicmal places if exists.
     * @param {number} ticks
     * @param {number} decimals0 - number of decimal places for token0
     * @param {number} decimals1 - number of decimal places for token1
     */
    const uniPrice = 1.0001 ** Number(ticks) // represented as token1/token0

    const expDecimals0 = 10 ** decimals0
    const expDecimals1 = 10 ** decimals1

    const price = uniPrice / (expDecimals1 / expDecimals0)

    return {
        token0Token1Price: price, // symbol1/symbol0
        token1Token0Price: 1 / price, // symbol0/symbol1
    }
}

export function fromsqrtPriceX96ToHumanReadable(
    sqrtPriceX96: bigint,
    decimals0: number,
    decimals1: number
) {
    /**
     * @notice calculate human readable price from sqrtPriceX96
     * @dev price is repsesented as token1/token0
     * @param {number} sqrtPriceX96
     * @param {number} decimals0 - number of decimal places for token0
     * @param {number} decimals1 - number of decimal places for token1
     */

    const expDecimals0 = 10n ** BigInt(decimals0)
    const expDecimals1 = 10n ** BigInt(decimals1)

    const ratioX192 = sqrtPriceX96 * sqrtPriceX96
    const _price = Number(ratioX192) / Math.pow(2, 192)

    return {
        token0Token1Price:
            _price / (Number(expDecimals1) / Number(expDecimals0)), // symbol1/symbol0
        token1Token0Price:
            1 / (_price / (Number(expDecimals1) / Number(expDecimals0))), // symbol0/symbol1
    }
}

export function calcCurrentReserves(
    suppliedLiquidity: bigint,
    sqrtPriceX96: bigint,
    tickLower: number,
    tickUpper: number,
    decimals0: number,
    decimals1: number
) {
    /**
     * @notice calculate current reserves in human readable format
     * @dev
     * @param {bigint} suppliedLiquidity
     * @param {bigint} sqrtPriceX96
     * @param {number} tickLow
     * @param {number} tickUpper
     * @param {number} decimals0
     * @param {number} decimals1
     */
    let sqrtRatioA = Math.sqrt(1.0001 ** tickLower)
    let sqrtRatioB = Math.sqrt(1.0001 ** tickUpper)
    let tickCurrent = sqrtPriceX96ToTicks(sqrtPriceX96)
    let sqrtPrice = Number(sqrtPriceX96) / Q96
    let amount0 = 0
    let amount1 = 0

    if (tickCurrent < tickLower) {
        amount0 = Math.floor(
            Number(suppliedLiquidity) *
                ((sqrtRatioB - sqrtRatioA) / (sqrtRatioA * sqrtRatioB))
        )
    } else if (tickCurrent >= tickUpper) {
        amount1 = Math.floor(
            Number(suppliedLiquidity) * (sqrtRatioB - sqrtRatioA)
        )
    } else if (tickCurrent >= tickLower && tickCurrent < tickUpper) {
        amount0 = Math.floor(
            Number(suppliedLiquidity) *
                ((sqrtRatioB - sqrtPrice) / (sqrtPrice * sqrtRatioB))
        )
        amount1 = Math.floor(
            Number(suppliedLiquidity) * (sqrtPrice - sqrtRatioA)
        )
    }

    let amountHuman_0 = (amount0 / 10 ** decimals0).toFixed(decimals0)
    let amountHuman_1 = (amount1 / 10 ** decimals1).toFixed(decimals1)

    return [amountHuman_0, amountHuman_1]
}

export function sqrtPriceX96ToTicks(sqrtPriceX96: bigint) {
    /**
     * @notice convert sqrtPriceX96 to ticks
     * @dev
     * @param {bigint} sqrtPriceX96
     */
    const Q96 = 2 ** 96
    return Math.floor(
        Math.log((Number(sqrtPriceX96) / Q96) ** 2) / Math.log(1.0001)
    )
}

export function isInRange(i_l: number, i_c: number, i_u: number) {
    /**
     * @notice check if current tick is in range
     * @dev
     * @param {number} i_l - tick lower
     * @param {number} i_c - tick current
     * @param {number} i_u - tick_upper
     */
    if (i_l <= i_c && i_c < i_u) {
        return true
    } else {
        return false
    }
}

function _subIn256(x: bigint, y: bigint) {
    const difference = x - y
    if (difference < ZERO) {
        return Q256 - difference
    } else {
        return difference
    }
}

export function calcUncollectedFees(
    suppliedLiquidity: bigint,
    feeGrowthGlobalX128_0: bigint,
    feeGrowthGlobalX128_1: bigint,
    tickUpperFeeGrowthOutsideX128_0: bigint,
    tickUpperFeeGrowthOutsideX128_1: bigint,
    tickLowerFeeGrowthOutsideX128_0: bigint,
    tickLowerFeeGrowthOutsideX128_1: bigint,
    feeGrowthInsideLastX128_0: bigint,
    feeGrowthInsideLastX128_1: bigint,
    tickUpper: number,
    tickLower: number,
    tickCurrent: number,
    decimals0: number,
    decimals1: number
) {
    /**
     * @notice calculate uncollected fees
     * @dev
     * @param {bigint} suppliedLiquidity
     * @param {bigint} feeGrowthGlobalX128_0
     * @param {bigint} feeGrowthGlobalX128_1
     * @param {bigint} tickUpperFeeGrowthOutsideX128_0
     * @param {bigint} tickUpperFeeGrowthOutsideX128_1
     * @param {bigint} tickLowerFeeGrowthOutsideX128_0
     * @param {bigint} tickLowerFeeGrowthOutsideX128_1
     * @param {bigint} feeGrowthInsideLastX128_0
     * @param {bigint} feeGrowthInsideLastX128_1
     * @param {number} tickUpper
     * @param {number} tickLower
     * @param {number} tickCurrent
     * @param {number} decimals0
     * @param {number} decimals1
     */

    let tickLowerFeeGrowthBelow_0 = ZERO
    let tickLowerFeeGrowthBelow_1 = ZERO
    let tickUpperFeeGrowthAbove_0 = ZERO
    let tickUpperFeeGrowthAbove_1 = ZERO

    // there is different math needed if the position is in or out of range
    // If current tick is above the range fg- fo,iu Growth Above range
    if (tickCurrent >= tickUpper) {
        tickUpperFeeGrowthAbove_0 = _subIn256(
            feeGrowthGlobalX128_0,
            tickUpperFeeGrowthOutsideX128_0
        )
        tickUpperFeeGrowthAbove_1 = _subIn256(
            feeGrowthGlobalX128_1,
            tickUpperFeeGrowthOutsideX128_1
        )
    } else {
        // Else if current tick is in range only need fg for upper growth
        tickUpperFeeGrowthAbove_0 = tickUpperFeeGrowthOutsideX128_0
        tickUpperFeeGrowthAbove_1 = tickUpperFeeGrowthOutsideX128_1
    }
    // If current tick is in range  only need fg for lower growth
    if (tickCurrent >= tickLower) {
        tickLowerFeeGrowthBelow_0 = tickLowerFeeGrowthOutsideX128_0
        tickLowerFeeGrowthBelow_1 = tickLowerFeeGrowthOutsideX128_1
    } else {
        // If current tick is above the range fg- fo,il Growth below range
        tickLowerFeeGrowthBelow_0 = _subIn256(
            feeGrowthGlobalX128_0,
            tickLowerFeeGrowthOutsideX128_0
        )
        tickLowerFeeGrowthBelow_1 = _subIn256(
            feeGrowthGlobalX128_1,
            tickLowerFeeGrowthOutsideX128_1
        )
    }

    // fr(t1) for both token0 and token1
    let fr_t1_0 = _subIn256(
        _subIn256(feeGrowthGlobalX128_0, tickLowerFeeGrowthBelow_0),
        tickUpperFeeGrowthAbove_0
    )
    let fr_t1_1 = _subIn256(
        _subIn256(feeGrowthGlobalX128_1, tickLowerFeeGrowthBelow_1),
        tickUpperFeeGrowthAbove_1
    )

    // The final calculations uncollected fees formula
    // for both token 0 and token 1 since we now know everything that is needed to compute it
    // subtracting the two values and then multiplying with liquidity l *(fr(t1) - fr(t0))
    let uncollectedFees_0 =
        (suppliedLiquidity * _subIn256(fr_t1_0, feeGrowthInsideLastX128_0)) /
        Q128
    let uncollectedFees_1 =
        (suppliedLiquidity * _subIn256(fr_t1_1, feeGrowthInsideLastX128_1)) /
        Q128

    // decimal adjustment to get final results
    let uncollectedFeesHuman_0 = Number(
        uncollectedFees_0 / BigInt(10 ** decimals0)
    ).toFixed(decimals0)
    let uncollectedFeesHuman_1 = Number(
        uncollectedFees_1 / BigInt(10 ** decimals1)
    ).toFixed(decimals1)

    return [uncollectedFeesHuman_0, uncollectedFeesHuman_1]
}
