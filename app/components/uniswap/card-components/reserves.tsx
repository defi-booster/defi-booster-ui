import { CardBody } from "@nextui-org/react"

import { calcCurrentReserves } from "../../../uniswapV3-lib/utils/math"

export const Reserves = ({ pool, position }) => {
    const [reserves_0, reserves_1] = calcCurrentReserves(
        position.liquidity,
        pool.sqrtPriceX96,
        Number(position.tickLower),
        Number(position.tickUpper),
        Number(position.token0Decimals),
        Number(position.token1Decimals),
    )

    return (
        <CardBody>
            <p>current reserves:</p>
            <p>{`${reserves_0} ${position.token0Symbol}`}</p>
            <p>{`${reserves_1} ${position.token1Symbol}`}</p>
        </CardBody>
    )
}
