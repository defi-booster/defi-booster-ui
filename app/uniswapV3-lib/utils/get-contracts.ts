import { ethers } from "ethers"

import { computePoolAddress } from "@uniswap/v3-sdk"
import { Token } from "@uniswap/sdk-core"
import INONFUNGIBLE_POSITION_MANAGER from "@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"
import IPOOL from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json"

import { idToContractsAddressesMapping } from "./mappings"
import { UniswapV3Contracts } from "./enums"

export function getNonFungiblePositionManagerContract(
    provider: ethers.BrowserProvider,
    chainId: number,
) {
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

    return new ethers.Contract(
        nfpmAddress,
        INONFUNGIBLE_POSITION_MANAGER.abi,
        provider,
    )
}

export function getPoolContract(
    provider: ethers.BrowserProvider,
    chainId: number,
    tokenIn: Token,
    tokenOut: Token,
    poolFee: number,
) {
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

    return new ethers.Contract(poolAddress, IPOOL.abi, provider)
}
