import { conversions_BigIntsToStrings } from "defi-booster-shared/src/libs/general/conversions"

import { UNISWAP_V3_IPosition } from "defi-booster-shared/src/libs/evm/uniswapv3/types"

export async function fetchPositions(chainId: number, address: string) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/uniswap/v3/${chainId}/${address}/positions`,
    )

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch data")
    }

    return await response.json()
}

export async function fetchPosition(chainId: number, tokenId: string) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/uniswap/v3/${chainId}/position/${tokenId}`,
    )

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch data")
    }

    return await response.json()
}

export async function fetchPositionsAndPools(chainId: number, address: string) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/uniswap/v3/${chainId}/${address}/positions-with-pools`,
    )

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch data")
    }

    return await response.json()
}

export async function fetchPool(
    chainId: number,
    token0Address: string,
    token1Address: string,
    token0Symbol: string,
    token1Symbol: string,
    token0Decimals: string,
    token1Decimals: string,
    fee: string,
    tickUpper: string,
    tickLower: string,
) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/uniswap/v3/${chainId}/${token0Address}/${token1Address}/${token0Symbol}/${token1Symbol}/${token0Decimals}/${token1Decimals}/${fee}/${tickUpper}/${tickLower}/pool`,
    )

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch data")
    }

    return await response.json()
}
