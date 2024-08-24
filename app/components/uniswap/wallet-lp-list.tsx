"use client"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react"

import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Divider,
    Button,
} from "@nextui-org/react"

import { SupportedChains } from "../../utils/enums"

import { CollectedData } from "../../uniswapV3/utils/types"
import { formatDataForUI } from "../../uniswapV3/format-data-ui"
import { calcPositionDataLst } from "../../uniswapV3/collected-data"

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
                    address
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
                display: "flex",
                justifyContent: "space-evenly",
            }}
        >
            {uiData.map((data, index) => {
                return (
                    <Card className="max-w-[400px]" key={index}>
                        <CardHeader className="flex gap-3">
                            <p>🦄</p>
                            <div className="flex flex-col">
                                <p className="text-md">{data.tokens}</p>
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
                            <p>tick lower: {data.tickLower}</p>
                            <p>tick current: {data.tickCurrent}</p>
                            <p>tick upper: {data.tickUpper}</p>
                        </CardBody>
                        <Divider />
                        <CardBody>
                            <p>price from tick lower: {data.priceTickLower}</p>
                            <p>price current: {data.priceTickCurrent}</p>
                            <p>price from tick upper: {data.priceTickUpper}</p>
                        </CardBody>
                        <Divider />
                        <CardBody>
                            <p>uncollected fees:</p>
                            <p>{data.uncollectedFeesToken0}</p>
                            <p>{data.uncollectedFeesToken1}</p>
                        </CardBody>
                        <Divider />
                        <CardBody>
                            <p>tokenId: {data.tokenId}</p>
                            <p>
                                position minted on block number:{" "}
                                {data.mintBlock}
                            </p>
                            <p>mint date: {data.mintDate}</p>
                            <p>
                                token0 supplied after position minted:{" "}
                                {data.mintSupplyToken0}
                            </p>
                            <p>
                                token1 supplied after position minted:{" "}
                                {data.mintSupplyToken1}
                            </p>
                        </CardBody>
                        <Divider />
                        <CardFooter>
                            {data.isInRange ? (
                                <Button color="success" aria-label="Like">
                                    In range
                                </Button>
                            ) : (
                                <Button color="danger" aria-label="Like">
                                    out of range
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    ) : (
        <div>Unsupported network</div>
    )
}
