export interface GeneralPoolInfo {
    token0Address: string
    token1Address: string
    fee: number
    tickSpacing: bigint
    liquidity: bigint
    sqrtPriceX96: bigint
    tick: bigint
}

export interface UserPositionInfo {
    // nonce: bigint // the nonce for permits
    // operator: string // the address that is approved for spending
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
    feeGrowthInside0LastX128: bigint // fee growth of token0 inside the tick range as of the last mint/burn/poke,
    feeGrowthInside1LastX128: bigint // fee growth of token1 inside the tick range as of the last mint/burn/poke,
    tokensOwed0: bigint // the computed amount of token0 owed to the position as of the last mint/burn/poke
    tokensOwed1: bigint // the computed amount of token1 owed to the position as of the last mint/burn/poke
}

export interface PositionData {
    position: UserPositionInfo
    pool: GeneralPoolInfo
}
