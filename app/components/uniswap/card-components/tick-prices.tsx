import { CardBody } from "@nextui-org/react"

import { fromTicksToHumanReadablePrice } from "defi-booster-shared"

export const TickPrices = ({
    pool_tick,
    tickLower,
    tickUpper,
    token0Decimals,
    token1Decimals,
    token0Symbol,
    token1Symbol,
}) => {
    const priceTickLower = `${fromTicksToHumanReadablePrice(
        Number(tickLower),
        Number(token0Decimals),
        Number(token1Decimals),
    ).token1Token0Price.toFixed(8)} ${token1Symbol} / ${token0Symbol}`

    const priceTickCurrent = `${fromTicksToHumanReadablePrice(
        Number(pool_tick),
        Number(token0Decimals),
        Number(token1Decimals),
    ).token1Token0Price.toFixed(8)} ${token1Symbol} / ${token0Symbol}`

    const priceTickUpper = `${fromTicksToHumanReadablePrice(
        Number(tickUpper),
        Number(token0Decimals),
        Number(token1Decimals),
    ).token1Token0Price.toFixed(8)} ${token1Symbol} / ${token0Symbol}`

    return (
        <CardBody>
            <p>price lower: {priceTickLower}</p>
            <p>price current: {priceTickCurrent}</p>
            <p>price upper: {priceTickUpper}</p>
        </CardBody>
    )
}
