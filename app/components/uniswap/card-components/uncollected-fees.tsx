import { CardBody } from "@nextui-org/react"

import { calcUncollectedFees } from "defi-booster-shared"

export const UncollectedFees = ({
    position_liquidity,
    pool_feeGrowthGlobalX128_0,
    pool_feeGrowthGlobalX128_1,
    pool_tickUpperFeeGrowthOutsideX128_0,
    pool_tickUpperFeeGrowthOutsideX128_1,
    pool_tickLowerFeeGrowthOutsideX128_0,
    pool_tickLowerFeeGrowthOutsideX128_1,
    position_feeGrowthInsideLastX128_0,
    position_feeGrowthInsideLastX128_1,
    tickUpper,
    tickLower,
    pool_tick,
    token0Decimals,
    token1Decimals,
    token0Symbol,
    token1Symbol,
}) => {
    const [uncollectedFees_0, uncollectedFees_1] = calcUncollectedFees(
        BigInt(position_liquidity),
        BigInt(pool_feeGrowthGlobalX128_0),
        BigInt(pool_feeGrowthGlobalX128_1),
        BigInt(pool_tickUpperFeeGrowthOutsideX128_0),
        BigInt(pool_tickUpperFeeGrowthOutsideX128_1),
        BigInt(pool_tickLowerFeeGrowthOutsideX128_0),
        BigInt(pool_tickLowerFeeGrowthOutsideX128_1),
        BigInt(position_feeGrowthInsideLastX128_0),
        BigInt(position_feeGrowthInsideLastX128_1),
        Number(tickUpper),
        Number(tickLower),
        Number(pool_tick),
        Number(token0Decimals),
        Number(token1Decimals),
    )

    const uncollectedFeesToken0 = `${uncollectedFees_0} ${token0Symbol}`
    const uncollectedFeesToken1 = `${uncollectedFees_1} ${token1Symbol}`

    return (
        <CardBody>
            <p>uncollected fees:</p>
            <p>{uncollectedFeesToken0}</p>
            <p>{uncollectedFeesToken1}</p>
        </CardBody>
    )
}
