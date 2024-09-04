import { ethers } from "ethers"
import { Pool } from "./utils/types"

export async function getPool(
    poolContract: ethers.Contract,
    tickUpper: number,
    tickLower: number,
): Promise<Pool> {
    try {
        const [
            tickSpacing,
            liquidity,
            slot0,
            feeGrowthGlobal0X128,
            feeGrowthGlobal1X128,
            ticksUpperOutput,
            ticksLowerOutput,
        ] = await Promise.all([
            poolContract.tickSpacing(),
            poolContract.liquidity(),
            poolContract.slot0(),
            poolContract.feeGrowthGlobal0X128(),
            poolContract.feeGrowthGlobal1X128(),
            poolContract.ticks(tickUpper),
            poolContract.ticks(tickLower),
        ])

        return {
            tickSpacing: tickSpacing,
            liquidity: liquidity,
            sqrtPriceX96: slot0[0],
            tick: slot0[1],
            feeGrowthGlobalX128_0: feeGrowthGlobal0X128,
            feeGrowthGlobalX128_1: feeGrowthGlobal1X128,
            tickUpperFeeGrowthOutsideX128_0: ticksUpperOutput[2],
            tickUpperFeeGrowthOutsideX128_1: ticksUpperOutput[3],
            tickLowerFeeGrowthOutsideX128_0: ticksLowerOutput[2],
            tickLowerFeeGrowthOutsideX128_1: ticksLowerOutput[3],
        }
    } catch (error) {
        console.error("An error occurred while getting pool info:", error)
        return undefined
    }
}
