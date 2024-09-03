import { ethers } from "ethers"

import { ERC20_ABI } from "../utils/constants"
import { Position, Positions } from "./utils/types"

export async function getPositions(
    provider: ethers.BrowserProvider,
    address: string,
    nfpmContract: ethers.Contract,
): Promise<Positions> {
    try {
        let positions: Positions = {}

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

        for (let index = 0; index < callResponse.length; index++) {
            const _position = callResponse[index]
            const tokenId = positionIds[index]

            const token0Contract = new ethers.Contract(
                _position.token0,
                ERC20_ABI,
                provider,
            )
            const token1Contract = new ethers.Contract(
                _position.token1,
                ERC20_ABI,
                provider,
            )

            const token0Symbol = await token0Contract.symbol()
            const token1Symbol = await token1Contract.symbol()

            const token0Decimals = await token0Contract.decimals()
            const token1Decimals = await token1Contract.decimals()

            const position: Position = {
                token0Address: _position.token0,
                token1Address: _position.token1,
                token0Symbol: token0Symbol,
                token1Symbol: token1Symbol,
                token0Decimals: token0Decimals,
                token1Decimals: token1Decimals,
                fee: _position.fee,
                tickLower: _position.tickLower,
                tickUpper: _position.tickUpper,
                liquidity: _position.liquidity,
                tokensOwed0: _position.tokensOwed0,
                tokensOwed1: _position.tokensOwed1,
                feeGrowthInsideLastX128_0: _position.feeGrowthInside0LastX128,
                feeGrowthInsideLastX128_1: _position.feeGrowthInside1LastX128,
            }

            positions[tokenId] = position
        }
        return positions
    } catch (error) {
        console.error("An error occurred while getting user positions:", error)
        return undefined
    }
}
