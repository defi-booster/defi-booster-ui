import { CardBody } from "@nextui-org/react"

import { fromTicksToHumanReadablePrice } from "../../../../libs/uniswapv3/utils/math"

export const TickPrices = ({ pool, position }) => {
    const priceTickLower = `${fromTicksToHumanReadablePrice(
        Number(position.tickLower),
        Number(position.token0Decimals),
        Number(position.token1Decimals),
    ).token1Token0Price.toFixed(8)} ${position.token1Symbol} / ${
        position.token0Symbol
    }`

    const priceTickCurrent = `${fromTicksToHumanReadablePrice(
        Number(pool.tick),
        Number(position.token0Decimals),
        Number(position.token1Decimals),
    ).token1Token0Price.toFixed(8)} ${position.token1Symbol} / ${
        position.token0Symbol
    }`

    const priceTickUpper = `${fromTicksToHumanReadablePrice(
        Number(position.tickUpper),
        Number(position.token0Decimals),
        Number(position.token1Decimals),
    ).token1Token0Price.toFixed(8)} ${position.token1Symbol} / ${
        position.token0Symbol
    }`

    return (
        <CardBody>
            <p>price lower: {priceTickLower}</p>
            <p>price current: {priceTickCurrent}</p>
            <p>price upper: {priceTickUpper}</p>
        </CardBody>
    )
}
