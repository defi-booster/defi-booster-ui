interface PricesInfo {
    token0Token1Price: number
    token1Token0Price: number
}

export function fromTicksToHumanReadablePrice(
    ticks: number,
    token0Decimals: number,
    token1Decimals: number
): PricesInfo {
    const uniPrice = 1.0001 ** Number(ticks)

    const decimals0 = 10 ** token0Decimals
    const decimals1 = 10 ** token1Decimals

    const price = (uniPrice * decimals0) / decimals1

    return {
        token0Token1Price: price, // symbol0/symbol1
        token1Token0Price: 1 / price, // symbol1/symbol0
    }
}
