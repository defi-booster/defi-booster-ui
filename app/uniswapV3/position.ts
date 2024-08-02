import { ethers } from "ethers"

import INONFUNGIBLE_POSITION_MANAGER from "@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"

import { idToContractsAddressesMapping } from "./utils/mappings"
import { UniswapV3Contracts } from "./utils/enums"
import { ERC20_ABI } from "../utils/constants"
import { fromTicksToHumanReadablePrice } from "./utils/math"

export interface PositionInfo {
    // nonce: bigint // the nonce for permits
    // operator: string // the address that is approved for spending
    token0Address: string
    token1Address: string
    token0Symbol: string
    token1Symbol: string
    fee: number
    token0PerToken1PriceLower: number
    token1PerToken0PriceLower: number
    token0PerToken1PriceUpper: number
    token1PerToken0PriceUpper: number
    tickLower: bigint
    tickUpper: bigint
    liquidity: bigint
    feeGrowthInside0LastX128: bigint // fee growth of token0 inside the tick range as of the last mint/burn/poke,
    feeGrowthInside1LastX128: bigint // fee growth of token1 inside the tick range as of the last mint/burn/poke,
    tokensOwed0: bigint // the computed amount of token0 owed to the position as of the last mint/burn/poke
    tokensOwed1: bigint // the computed amount of token1 owed to the position as of the last mint/burn/poke
}

export async function getUserPositions(
    provider: ethers.BrowserProvider,
    address: string,
    chainId: number
): Promise<Array<PositionInfo>> {
    let nfpmAddress: string
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

    const positionInfos = callResponse.map(async (position) => {
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

        const pricesLowerInfo = fromTicksToHumanReadablePrice(
            Number(position.tickLower),
            Number(token0Decimals),
            Number(token1Decimals)
        )

        const pricesUpperInfo = fromTicksToHumanReadablePrice(
            Number(position.tickUpper),
            Number(token0Decimals),
            Number(token1Decimals)
        )

        return {
            token0Address: position.token0,
            token1Address: position.token1,
            token0Symbol: token0Symbol,
            token1Symbol: token1Symbol,
            fee: position.fee,
            tickLower: position.tickLower,
            tickUpper: position.tickUpper,
            token0PerToken1PriceLower: pricesLowerInfo.token0Token1Price,
            token1PerToken0PriceLower: pricesLowerInfo.token1Token0Price,
            token0PerToken1PriceUpper: pricesUpperInfo.token0Token1Price,
            token1PerToken0PriceUpper: pricesUpperInfo.token1Token0Price,
            liquidity: position.liquidity,
            tokensOwed0: position.tokensOwed0,
            tokensOwed1: position.tokensOwed1,
            feeGrowthInside0LastX128: position.feeGrowthInside0LastX128,
            feeGrowthInside1LastX128: position.feeGrowthInside1LastX128,
        }
    })

    const infos = await Promise.all(positionInfos)
    return infos
}
