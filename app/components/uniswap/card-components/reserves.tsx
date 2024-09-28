import { ethers } from "ethers"
import { CardBody } from "@nextui-org/react"

import { calcCurrentReserves } from "../../../../libs/uniswapv3/utils/math"

export const Reserves = ({ pool, position }) => {
    const [reserves_0, reserves_1] = calcCurrentReserves(
        BigInt(position.liquidity),
        BigInt(pool.sqrtPriceX96),
        Number(position.tickLower),
        Number(position.tickUpper),
    )

    const formattedReserves_0 = ethers.formatUnits(
        reserves_0,
        Number(position.token0Decimals),
    )
    const formattedReserves_1 = ethers.formatUnits(
        reserves_1,
        Number(position.token1Decimals),
    )

    return (
        <CardBody>
            <p>current reserves:</p>
            <p>{`${formattedReserves_0} ${position.token0Symbol}`}</p>
            <p>{`${formattedReserves_1} ${position.token1Symbol}`}</p>
        </CardBody>
    )
}
