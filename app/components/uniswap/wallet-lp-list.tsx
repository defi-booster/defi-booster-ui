"use client"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react"
import { TokenUNI } from "@web3icons/react"
import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react"

import { PositionGauge } from "../guage"
import { SupportedChains } from "../../utils/enums"

import { CollectedData } from "../../uniswapV3-lib/utils/types"
import { formatDataForUI } from "../../uniswapV3-lib/format-data-ui"
import { calcPositionDataLst } from "../../uniswapV3-lib/collected-data"

export function WalletLPList({ network }) {
    const [positions, setPositionsData] = useState<Array<CollectedData>>([])
    const [uiData, setUIData] = useState([])
    const { address, chainId } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()

    useEffect(() => {
        if (
            walletProvider !== undefined &&
            network !== SupportedChains.Unsupported
        ) {
            const provider = new ethers.BrowserProvider(walletProvider)

            ;(async () => {
                const positionDataLst = await calcPositionDataLst(
                    provider,
                    chainId,
                    address,
                )
                setPositionsData(positionDataLst)
            })()
        }
    }, [walletProvider, network, address])

    useEffect(() => {
        if (positions.length === 0) {
            return
        }
        const uiData = formatDataForUI(positions)
        setUIData(uiData)
    }, [positions])

    return network !== SupportedChains.Unsupported ? (
        <div
            style={{
                margin: "20px",
                padding: "10px",
            }}
            className="gap-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
            {uiData.map((data, index) => {
                return (
                    <Card
                        className="max-w-[450px]"
                        key={index}
                        style={{ margin: "5px 0" }}
                    >
                        <CardHeader className="flex gap-3">
                            <TokenUNI />
                            <div className="flex flex-col">
                                <p className="text-md">{data.tokens}</p>
                                <p>tokenId: {data.tokenId}</p>
                                <p className="text-small text-default-500">
                                    fee: {data.feeTier}
                                </p>
                            </div>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <p>current price:</p>
                            <p>{data.token0token1Price}</p>
                            <p>{data.token1token0Price}</p>
                        </CardBody>
                        <Divider />
                        <CardBody>
                            <p>current reserves:</p>
                            <p>{data.token0Reserves}</p>
                            <p>{data.token1Reserves}</p>
                        </CardBody>
                        <Divider />
                        <CardBody>
                            <p>price lower: {data.priceTickLower}</p>
                            <p>price current: {data.priceTickCurrent}</p>
                            <p>price upper: {data.priceTickUpper}</p>
                        </CardBody>
                        <Divider />
                        <CardBody>
                            <p>uncollected fees:</p>
                            <p>{data.uncollectedFeesToken0}</p>
                            <p>{data.uncollectedFeesToken1}</p>
                        </CardBody>
                        <Divider />
                        <CardBody>
                            <p>mint date: {data.mintDate}</p>
                        </CardBody>
                        <Divider />
                        <CardBody>
                            <PositionGauge
                                lowerPrice={Number(
                                    parseFloat(
                                        data.priceTickLower.match(/[\d.]+/)[0],
                                    ).toFixed(0),
                                )}
                                currentPrice={Number(
                                    parseFloat(
                                        data.priceTickCurrent.match(
                                            /[\d.]+/,
                                        )[0],
                                    ).toFixed(0),
                                )}
                                upperPrice={parseFloat(
                                    Number(
                                        data.priceTickUpper.match(/[\d.]+/)[0],
                                    ).toFixed(0),
                                )}
                                isInRange={data.isInRange}
                            />
                        </CardBody>
                    </Card>
                )
            })}
        </div>
    ) : (
        <div>Unsupported network</div>
    )
}
