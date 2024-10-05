import { CardBody } from "@nextui-org/react"

import { fromsqrtPriceX96ToHumanReadable } from "defi-booster-shared"

export const Price = ({
    sqrtPriceX96,
    token0Decimals,
    token1Decimals,
    token0Symbol,
    token1Symbol,
}) => {
    const token0token1Price = `${fromsqrtPriceX96ToHumanReadable(
        sqrtPriceX96,
        token0Decimals,
        token1Decimals,
    ).token0Token1Price.toFixed(8)} ${token0Symbol}/${token1Symbol}`

    const token1token0Price = `${fromsqrtPriceX96ToHumanReadable(
        sqrtPriceX96,
        token0Decimals,
        token1Decimals,
    ).token1Token0Price.toFixed(8)} ${token1Symbol}/${token0Symbol}`

    return (
        <CardBody>
            <p>current price:</p>
            <p>{token0token1Price}</p>
            <p>{token1token0Price}</p>
        </CardBody>
    )
}
