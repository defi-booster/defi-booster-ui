import { ethers } from "ethers"

import { ERC20_ABI } from "../utils/constants"
import { UserPositionInfo } from "../uniswapV3/types"

export async function getUserPositions(
    provider: ethers.BrowserProvider,
    address: string,
    nfpmContract: ethers.Contract
): Promise<Array<UserPositionInfo>> {
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

    const positionInfos = callResponse.map(async (position, index) => {
        const tokenId = positionIds[index]
        const token0Contract = new ethers.Contract(
            position.token0,
            ERC20_ABI,
            provider
        )
        const token1Contract = new ethers.Contract(
            position.token1,
            ERC20_ABI,
            provider
        )
        const token0Symbol = await token0Contract.symbol()
        const token1Symbol = await token1Contract.symbol()

        const token0Decimals = await token0Contract.decimals()
        const token1Decimals = await token1Contract.decimals()

        return {
            tokenId: tokenId,
            token0Address: position.token0,
            token1Address: position.token1,
            token0Symbol: token0Symbol,
            token1Symbol: token1Symbol,
            token0Decimals: token0Decimals,
            token1Decimals: token1Decimals,
            fee: position.fee,
            tickLower: position.tickLower,
            tickUpper: position.tickUpper,
            liquidity: position.liquidity,
            tokensOwed0: position.tokensOwed0,
            tokensOwed1: position.tokensOwed1,
            feeGrowthInsideLastX128_0: position.feeGrowthInside0LastX128,
            feeGrowthInsideLastX128_1: position.feeGrowthInside1LastX128,
        }
    })

    const infos = await Promise.all(positionInfos)
    return infos
}
