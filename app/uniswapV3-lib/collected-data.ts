import { ethers } from "ethers"
import { Token } from "@uniswap/sdk-core"

import { CollectedData } from "./utils/types"
import {
    getNonFungiblePositionManagerContract,
    getPoolContract,
} from "./utils/get-contracts"
import { getUserPositions } from "./user-position"
import { getPoolInfo } from "./pool"
import { getPoolMintingDate } from "./position-livecycle"

export async function calcPositionDataLst(
    provider: ethers.BrowserProvider,
    chainId: number,
    address: string
): Promise<CollectedData[]> {
    let positionDataLst: Array<CollectedData> = []

    try {
        const nfpmContract = getNonFungiblePositionManagerContract(
            provider,
            chainId
        )

        const userPositionInfos = await getUserPositions(
            provider,
            address,
            nfpmContract
        )

        const positionMintInfos = await getPoolMintingDate(
            provider,
            chainId,
            nfpmContract,
            address
        )
        for (let i = 0; i < userPositionInfos.length; i++) {
            const token0Obj = new Token(
                chainId,
                userPositionInfos[i].token0Address,
                Number(userPositionInfos[i].token0Decimals),
                userPositionInfos[i].token0Symbol,
                userPositionInfos[i].token0Symbol
            )

            const token1Obj = new Token(
                chainId,
                userPositionInfos[i].token1Address,
                Number(userPositionInfos[i].token1Decimals),
                userPositionInfos[i].token1Symbol,
                userPositionInfos[i].token1Symbol
            )

            const poolContract = getPoolContract(
                provider,
                chainId,
                token0Obj,
                token1Obj,
                userPositionInfos[i].fee
            )
            const generalPoolInfo = await getPoolInfo(
                poolContract,
                Number(userPositionInfos[i].tickUpper),
                Number(userPositionInfos[i].tickLower)
            )
            if (generalPoolInfo === undefined) {
                console.error("can't get general pool info!")
                return []
            }
            const positionMintInfo = positionMintInfos.filter(
                (mintInfo) => mintInfo.tokenId === userPositionInfos[i].tokenId
            )

            if (positionMintInfos.length !== userPositionInfos.length) {
                console.error(
                    "mint infos and position infos lengths not match!"
                )
                return []
            }

            if (positionMintInfo.length === 0) {
                console.error(
                    `can't find mint info associated with tokenId ${userPositionInfos[i].tokenId}!`
                )
                return []
            }

            positionDataLst.push({
                position: userPositionInfos[i],
                pool: generalPoolInfo,
                positionMintInfo: positionMintInfo[0],
            })
        }
        return positionDataLst
    } catch (error) {
        console.error(
            "An error occurred while calculating position data:",
            error
        )
        return []
    }
}
