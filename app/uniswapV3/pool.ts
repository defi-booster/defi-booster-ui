import { ethers } from "ethers"

import { computePoolAddress } from "@uniswap/v3-sdk"
import { Token } from "@uniswap/sdk-core"
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json"
import { GeneralPoolInfo } from "../uniswapV3/types"
import { idToContractsAddressesMapping } from "./utils/mappings"
import { UniswapV3Contracts } from "./utils/enums"

export async function getPoolInfo(
    provider: ethers.BrowserProvider,
    chainId: number,
    tokenIn: Token,
    tokenOut: Token,
    poolFee: number
): Promise<GeneralPoolInfo> {
    let factoryAddress: string
    try {
        factoryAddress =
            idToContractsAddressesMapping[chainId][
                UniswapV3Contracts.POOL_FACTORY_CONTRACT
            ]
    } catch (error) {
        console.error(error)
        return
    }

    const poolAddress = computePoolAddress({
        factoryAddress: factoryAddress,
        tokenA: tokenIn,
        tokenB: tokenOut,
        fee: poolFee,
    })

    const poolContract = new ethers.Contract(
        poolAddress,
        IUniswapV3PoolABI.abi,
        provider
    )

    const [token0, token1, fee, tickSpacing, liquidity, slot0] =
        await Promise.all([
            poolContract.token0(),
            poolContract.token1(),
            poolContract.fee(),
            poolContract.tickSpacing(),
            poolContract.liquidity(),
            poolContract.slot0(),
        ])

    return {
        token0Address: token0,
        token1Address: token1,
        fee: fee,
        tickSpacing: tickSpacing,
        liquidity: liquidity,
        sqrtPriceX96: slot0[0],
        tick: slot0[1],
    }
}
