import { ethers } from "ethers"
import { Token } from "@uniswap/sdk-core"

import { Pools, Position, Positions } from "./utils/types"
import {
    getNonFungiblePositionManagerContract,
    getPoolContract,
} from "./utils/get-contracts"
import { getPositions } from "./positions"
import { getPool } from "./pool"

import { ERC20_ABI } from "../utils/constants"

export async function collectPositions(
    provider: ethers.BrowserProvider,
    chainId: number,
    address: string,
): Promise<Positions> {
    /**
     * @notice collect user positions
     * @dev
     * @param {ethers.BrowserProvider} provider
     * @param {number} chainId
     * @param {string} address
     */
    try {
        const nfpmContract = getNonFungiblePositionManagerContract(
            provider,
            chainId,
        )

        const positions = await getPositions(provider, address, nfpmContract)

        return positions
    } catch (error) {
        console.error("An error occurred while collecting positions :", error)
        return undefined
    }
}

export async function collectPosition(
    provider: ethers.BrowserProvider,
    chainId: number,
    tokenId: bigint,
): Promise<Position> {
    /**
     * @notice collect user position
     * @dev
     * @param {ethers.BrowserProvider} provider
     * @param {number} chainId
     * @param {bigint} tokenId
     */
    try {
        const nfpmContract = getNonFungiblePositionManagerContract(
            provider,
            chainId,
        )

        const _position = await nfpmContract.positions(tokenId)

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

        return {
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
    } catch (error) {
        console.error("An error occurred while collecting position :", error)
        return undefined
    }
}

export async function collectPools(
    provider: ethers.BrowserProvider,
    chainId: number,
    positions: Positions,
): Promise<Pools> {
    /**
     * @notice collect user pools
     * @dev
     * @param {ethers.BrowserProvider} provider
     * @param {number} chainId
     * @param {Positions} positions
     */
    try {
        let pools: Pools = {}
        const tokenIds = Object.keys(positions)

        for (let i = 0; i < tokenIds.length; i++) {
            const position = positions[tokenIds[i]]

            const token0Obj = new Token(
                chainId,
                position.token0Address,
                Number(position.token0Decimals),
                position.token0Symbol,
                position.token0Symbol,
            )
            const token1Obj = new Token(
                chainId,
                position.token1Address,
                Number(position.token1Decimals),
                position.token1Symbol,
                position.token1Symbol,
            )

            const poolContract = getPoolContract(
                provider,
                chainId,
                token0Obj,
                token1Obj,
                position.fee,
            )

            const pool = await getPool(
                poolContract,
                Number(position.tickUpper),
                Number(position.tickLower),
            )

            if (pool === undefined) {
                console.error("can't get general pool info!")
                return {}
            }

            pools[
                `${position.token0Symbol}${position.token1Symbol}${position.fee}`
            ] = pool
        }

        return pools
    } catch (error) {
        console.error("An error occurred while collecting pools: ", error)
        return undefined
    }
}
