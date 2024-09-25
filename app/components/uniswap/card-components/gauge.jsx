"use client"
import { useTheme } from "next-themes"
import ReactECharts from "echarts-for-react"

import { CardBody } from "@nextui-org/react"

import {
    fromTicksToHumanReadablePrice,
    isInRange,
} from "../../../uniswapV3-lib/utils/math"

export function PositionGauge({ pool, position }) {
    const { theme } = useTheme()

    const labelColor = theme === "dark" ? "#ECEDEE" : "#11181C"

    const priceTickLower = fromTicksToHumanReadablePrice(
        Number(position.tickLower),
        Number(position.token0Decimals),
        Number(position.token1Decimals),
    ).token1Token0Price

    const priceTickCurrent = fromTicksToHumanReadablePrice(
        Number(pool.tick),
        Number(position.token0Decimals),
        Number(position.token1Decimals),
    ).token1Token0Price

    const priceTickUpper = fromTicksToHumanReadablePrice(
        Number(position.tickUpper),
        Number(position.token0Decimals),
        Number(position.token1Decimals),
    ).token1Token0Price

    const formatNumber = (value) => {
        return value.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6,
        })
    }

    const priceTickLowerFormatted = formatNumber(priceTickLower)
    const priceTickCurrentFormatted = formatNumber(priceTickCurrent)
    const priceTickUpperFormatted = formatNumber(priceTickUpper)

    const inRange = isInRange(
        Number(position.tickLower),
        Number(pool.tick),
        Number(position.tickUpper),
    )

    let option = {
        series: [
            {
                type: "gauge",
                startAngle: 195,
                endAngle: -15,
                min: priceTickLowerFormatted,
                max: priceTickUpperFormatted,
                splitNumber: 2,
                itemStyle: {
                    color: "#6BBE44",
                    shadowColor: "rgba(0,138,255,0.45)",
                    shadowBlur: 10,
                    shadowOffsetX: 2,
                    shadowOffsetY: 2,
                },
                progress: {
                    show: false,
                    roundCap: true,
                    width: 5,
                },
                pointer: {
                    icon: "path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z",
                    length: "75%",
                    width: 5,
                    offsetCenter: [0, "5%"],
                },
                axisLine: {
                    roundCap: true,
                    lineStyle: {
                        width: 5,
                    },
                },
                axisTick: {
                    splitNumber: 2,
                    lineStyle: {
                        width: 1,
                        color: "#D40000",
                    },
                },
                splitLine: {
                    length: 12,
                    lineStyle: {
                        width: 2,
                        color: "#D40000",
                    },
                },
                axisLabel: {
                    distance: 20,
                    color: labelColor,
                    fontSize: 12,
                },
                title: {
                    show: false,
                },
                detail: {
                    show: true,
                    fontSize: 24,
                    color: inRange ? "#6BBE44" : "#D40000",
                    offsetCenter: [0, "60%"],
                    valueAnimation: true,
                    formatter: function (value) {
                        return inRange ? "in range" : "out of range"
                    },
                },
                data: [
                    {
                        value: priceTickCurrentFormatted,
                    },
                ],
            },
        ],
    }

    return (
        <CardBody>
            <ReactECharts option={option} />
        </CardBody>
    )
}
