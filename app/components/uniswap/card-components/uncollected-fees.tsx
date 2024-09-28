import { CardBody } from "@nextui-org/react"

import { calcUncollectedFees } from "../../../../libs/uniswapv3/utils/math"

export const UncollectedFees = ({ pool, position }) => {
    const [uncollectedFees_0, uncollectedFees_1] = calcUncollectedFees(
        BigInt(position.liquidity),
        BigInt(pool.feeGrowthGlobalX128_0),
        BigInt(pool.feeGrowthGlobalX128_1),
        BigInt(pool.tickUpperFeeGrowthOutsideX128_0),
        BigInt(pool.tickUpperFeeGrowthOutsideX128_1),
        BigInt(pool.tickLowerFeeGrowthOutsideX128_0),
        BigInt(pool.tickLowerFeeGrowthOutsideX128_1),
        BigInt(position.feeGrowthInsideLastX128_0),
        BigInt(position.feeGrowthInsideLastX128_1),
        Number(position.tickUpper),
        Number(position.tickLower),
        Number(pool.tick),
        Number(position.token0Decimals),
        Number(position.token1Decimals),
    )

    const uncollectedFeesToken0 = `${uncollectedFees_0} ${position.token0Symbol}`
    const uncollectedFeesToken1 = `${uncollectedFees_1} ${position.token1Symbol}`

    return (
        <CardBody>
            <p>uncollected fees:</p>
            <p>{uncollectedFeesToken0}</p>
            <p>{uncollectedFeesToken1}</p>
        </CardBody>
    )
}
