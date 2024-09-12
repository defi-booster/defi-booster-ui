// general info about pool associated with this position - source of data: UniswapV3Pool
export interface Pool {
    tickSpacing: bigint
    liquidity: bigint
    sqrtPriceX96: bigint
    tick: bigint
    feeGrowthGlobalX128_0: bigint
    feeGrowthGlobalX128_1: bigint
    tickUpperFeeGrowthOutsideX128_0: bigint
    tickUpperFeeGrowthOutsideX128_1: bigint
    tickLowerFeeGrowthOutsideX128_0: bigint
    tickLowerFeeGrowthOutsideX128_1: bigint
}

// position specific info - source of data: NonfungiblePositionManager
export interface Position {
    token0Address: string
    token1Address: string
    token0Symbol: string
    token1Symbol: string
    token0Decimals: number
    token1Decimals: number
    fee: number
    tickLower: bigint
    tickUpper: bigint
    liquidity: bigint
    feeGrowthInsideLastX128_0: bigint
    feeGrowthInsideLastX128_1: bigint
    tokensOwed0: bigint
    tokensOwed1: bigint
}

export type Pools = {
    [poolKey: string]: Pool
}

export type Positions = {
    [tokenId: string]: Position
}

// data from scanning Transfer event on NonfungiblePositionManager contract from adress 0x0 to wallet
export interface LivecycleRecord {
    livecycleEvent: string
    blockNumber: number
    date: string
    tokenId: bigint
    amount0: bigint
    amount1: bigint
}
