import { ethers } from "ethers"
import { CardBody } from "@nextui-org/react"

import { calcCurrentReserves } from "defi-booster-shared"

export const Reserves = ({
    position_liquidity,
    sqrtPriceX96,
    tickLower,
    tickUpper,
    token0Decimals,
    token1Decimals,
    token0Symbol,
    token1Symbol,
}) => {
    const [reserves_0, reserves_1] = calcCurrentReserves(
        BigInt(position_liquidity),
        BigInt(sqrtPriceX96),
        Number(tickLower),
        Number(tickUpper),
    )

    const formattedReserves_0 = ethers.formatUnits(
        reserves_0,
        Number(token0Decimals),
    )
    const formattedReserves_1 = ethers.formatUnits(
        reserves_1,
        Number(token1Decimals),
    )

    return (
        <CardBody>
            <p>current reserves:</p>
            <p>{`${formattedReserves_0} ${token0Symbol}`}</p>
            <p>{`${formattedReserves_1} ${token1Symbol}`}</p>
        </CardBody>
    )
}
