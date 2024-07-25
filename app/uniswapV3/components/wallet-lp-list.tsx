"use client"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react"

import INONFUNGIBLE_POSITION_MANAGER from "@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"

import { idToContractsAddressesMapping } from "../utils/mappings"
import { UniswapV3Contracts } from "../utils/enums"

interface PositionInfo {
    nonce: bigint
    operator: string
    token0: string
    token1: string
    fee: number
    tickLower: number
    tickUpper: number
    liquidity: bigint
    feeGrowthInside0LastX128: bigint
    feeGrowthInside1LastX128: bigint
    tokensOwed0: bigint
    tokensOwed1: bigint
}

export default function WalletLPList() {
    const [positions, setPositions] = useState<Array<PositionInfo>>([])
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()

    useEffect(() => {
        if (isConnected && walletProvider !== undefined) {
            const provider = new ethers.BrowserProvider(walletProvider)

            let nfpmAddress
            try {
                nfpmAddress =
                    idToContractsAddressesMapping[chainId][
                        UniswapV3Contracts.NONFUNGIBLE_POSITION_MANAGER_CONTRACT
                    ]
            } catch (error) {
                console.error(error)
                return
            }

            const nfpmContract = new ethers.Contract(
                nfpmAddress,
                INONFUNGIBLE_POSITION_MANAGER.abi,
                provider
            )

            ;(async () => {
                const numPositions = await nfpmContract.balanceOf(address)
                const calls = []

                for (let i = 0; i < numPositions; i++) {
                    calls.push(nfpmContract.tokenOfOwnerByIndex(address, i))
                }

                const positionIds = await Promise.all(calls)

                const positionCalls = []

                for (let id of positionIds) {
                    positionCalls.push(nfpmContract.positions(id))
                }

                const callResponse = await Promise.all(positionCalls)

                const positionInfos = callResponse.map((position) => {
                    return {
                        nonce: position.nonce,
                        operator: position.operator,
                        token0: position.token0,
                        token1: position.token1,
                        fee: position.fee,
                        tickLower: position.tickLower,
                        tickUpper: position.tickUpper,
                        liquidity: position.liquidity,
                        feeGrowthInside0LastX128:
                            position.feeGrowthInside0LastX128,
                        feeGrowthInside1LastX128:
                            position.feeGrowthInside1LastX128,
                        tokensOwed0: position.tokensOwed0,
                        tokensOwed1: position.tokensOwed1,
                    }
                })

                setPositions(positionInfos)
            })()
        }
    })

    return isConnected ? (
        <div
            style={{
                border: "1px solid black",
                margin: "20px",
                padding: "10px",
            }}
        >
            {positions.map((position) => {
                return (
                    <div
                        style={{
                            border: "1px solid black",
                            margin: "20px",
                            padding: "10px",
                        }}
                        key={position.nonce}
                    >
                        <p>nonce: {Number(position.nonce)}</p>
                        <p>operator: {position.operator}</p>
                        <p>token0: {position.token0}</p>
                        <p>token1: {position.token1}</p>
                        <p>fee: {position.fee}</p>
                        <p>tickLower: {position.tickLower}</p>
                        <p>tickUpper: {position.tickUpper}</p>
                        <p>liquidity: {Number(position.liquidity)}</p>
                        <p>
                            feeGrowthInside0LastX128:{" "}
                            {Number(position.feeGrowthInside0LastX128)}
                        </p>
                        <p>
                            feeGrowthInside1LastX128:{" "}
                            {Number(position.feeGrowthInside1LastX128)}
                        </p>
                        <p>tokensOwed0: {Number(position.tokensOwed0)}</p>
                        <p>tokensOwed1: {Number(position.tokensOwed1)}</p>
                    </div>
                )
            })}
        </div>
    ) : null
}
