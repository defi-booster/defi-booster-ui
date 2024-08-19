interface PricesInfo {
    token0Token1Price: number
    token1Token0Price: number
}

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

export function calculateCurrentReserves(
    suppliedLiquidity: bigint,
    sqrtPriceX96: bigint,
    tickLow: number,
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
    const Q96 = 2 ** 96
    let sqrtRatioA = Math.sqrt(1.0001 ** tickLow)
    let sqrtRatioB = Math.sqrt(1.0001 ** tickUpper)
    let currentTick = sqrtPriceX96ToTicks(sqrtPriceX96)
    let sqrtPrice = Number(sqrtPriceX96) / Q96
    let amount0 = 0
    let amount1 = 0

    if (currentTick < tickLow) {
        amount0 = Math.floor(
            Number(suppliedLiquidity) *
                ((sqrtRatioB - sqrtRatioA) / (sqrtRatioA * sqrtRatioB))
        )
    } else if (currentTick >= tickUpper) {
        amount1 = Math.floor(
            Number(suppliedLiquidity) * (sqrtRatioB - sqrtRatioA)
        )
    } else if (currentTick >= tickLow && currentTick < tickUpper) {
        amount0 = Math.floor(
            Number(suppliedLiquidity) *
                ((sqrtRatioB - sqrtPrice) / (sqrtPrice * sqrtRatioB))
        )
        amount1 = Math.floor(
            Number(suppliedLiquidity) * (sqrtPrice - sqrtRatioA)
        )
    }

    let amount0Human = (amount0 / 10 ** decimals0).toFixed(decimals0)
    let amount1Human = (amount1 / 10 ** decimals1).toFixed(decimals1)

    return [amount0Human, amount1Human]
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
