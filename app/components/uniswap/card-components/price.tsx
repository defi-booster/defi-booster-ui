import { CardBody } from "@nextui-org/react"

import { fromsqrtPriceX96ToHumanReadable } from "../../../uniswapV3-lib/utils/math"

export const Price = ({ pool, position }) => {
    const sqrtPriceX96 = pool.sqrtPriceX96

    const token0token1Price = `${fromsqrtPriceX96ToHumanReadable(
        sqrtPriceX96,
        position.token0Decimals,
        position.token1Decimals,
    ).token0Token1Price.toFixed(
        8,
    )} ${position.token0Symbol}/${position.token1Symbol}`

    const token1token0Price = `${fromsqrtPriceX96ToHumanReadable(
        sqrtPriceX96,
        position.token0Decimals,
        position.token1Decimals,
    ).token1Token0Price.toFixed(
        8,
    )} ${position.token1Symbol}/${position.token0Symbol}`

    return (
        <CardBody>
            <p>current price:</p>
            <p>{token0token1Price}</p>
            <p>{token1token0Price}</p>
        </CardBody>
    )
}
