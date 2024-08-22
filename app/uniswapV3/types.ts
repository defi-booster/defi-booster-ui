// data from UniswapV3Pool contract
export interface GeneralPoolInfo {
    token0Address: string
    token1Address: string
    fee: number
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

// data from NonfungiblePositionManager contract
export interface UserPositionInfo {
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

export interface PositionData {
    position: UserPositionInfo
    pool: GeneralPoolInfo
}
