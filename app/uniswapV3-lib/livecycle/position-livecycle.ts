import { ethers } from "ethers"

import { LivecycleRecord } from "../utils/types"
import { idToNonfungiblePostionManagerContractCreationBlockMapping } from "../utils/mappings"
import { LivecycleEvents } from "../utils/enums"

export async function getPositionMintData(
    provider: ethers.BrowserProvider,
    chainId: number,
    tokenId: string,
    nfpmContract: ethers.Contract,
    address: string,
): Promise<LivecycleRecord> {
    try {
        const startBlock =
            idToNonfungiblePostionManagerContractCreationBlockMapping[chainId]
        const endBlock = await provider.getBlockNumber()
        let currentStartBlock = startBlock
        const maxBlockRequests = 20000

        const filter = nfpmContract.filters.Transfer(
            "0x0000000000000000000000000000000000000000",
            address,
        )

        let positionMintInfo: LivecycleRecord | undefined

        while (currentStartBlock <= endBlock) {
            const currentEndBlock = Math.min(
                currentStartBlock + maxBlockRequests - 1,
                endBlock,
            )
            const events = await nfpmContract.queryFilter(
                filter,
                currentStartBlock,
                currentEndBlock,
            )

            for (const event of events) {
                // @ts-ignore
                const eventTokenId = event.args.tokenId.toString()

                // check if this event is concern to our tokenId
                if (tokenId !== eventTokenId) {
                    continue
                }

                const increaseLiquidityFilter =
                    nfpmContract.filters.IncreaseLiquidity(tokenId)

                const liquidityEvents = await nfpmContract.queryFilter(
                    increaseLiquidityFilter,
                    event.blockNumber,
                    event.blockNumber,
                )

                if (liquidityEvents.length === 0) {
                    console.error(
                        "No liquidity events after mint event. Can't deterimne amount0 and amount1 added to position.",
                    )
                    return undefined
                }

                // at minting moment there should be only one IncreaseLiquidity event
                const liquidityEvent = liquidityEvents[0]

                const block = await provider.getBlock(event.blockNumber)
                const timestamp = block.timestamp
                const date = new Date(timestamp * 1000)

                positionMintInfo = {
                    livecycleEvent: LivecycleEvents.MINT,
                    blockNumber: event.blockNumber,
                    date: date.toLocaleString(),
                    tokenId: BigInt(tokenId),
                    // @ts-ignore
                    amount0: liquidityEvent.args.amount0,
                    // @ts-ignore
                    amount1: liquidityEvent.args.amount1,
                }
            }
            currentStartBlock = currentEndBlock + 1
        }
        return positionMintInfo
    } catch (error) {
        console.error(
            "An error occurred while getting mint for position livecycle: ",
            error,
        )
        return undefined
    }
}

export async function getPositionIncreaseData(
    provider: ethers.BrowserProvider,
    chainId: number,
    tokenId: string,
    nfpmContract: ethers.Contract,
): Promise<LivecycleRecord[]> {
    try {
        const startBlock =
            idToNonfungiblePostionManagerContractCreationBlockMapping[chainId]
        const endBlock = await provider.getBlockNumber()
        let currentStartBlock = startBlock
        const maxBlockRequests = 20000

        const filter = nfpmContract.filters.IncreaseLiquidity(tokenId)

        let increaseLiquidityInfos: LivecycleRecord[] = []

        while (currentStartBlock <= endBlock) {
            const currentEndBlock = Math.min(
                currentStartBlock + maxBlockRequests - 1,
                endBlock,
            )
            const events = await nfpmContract.queryFilter(
                filter,
                currentStartBlock,
                currentEndBlock,
            )

            for (const event of events) {
                // @ts-ignore
                const eventTokenId = event.args.tokenId.toString()

                // check if this event is concern to our tokenId
                if (tokenId !== eventTokenId) {
                    continue
                }

                const block = await provider.getBlock(event.blockNumber)
                const timestamp = block.timestamp
                const date = new Date(timestamp * 1000)

                const increaseLiquidityInfo: LivecycleRecord = {
                    livecycleEvent: LivecycleEvents.INCREASE,
                    blockNumber: event.blockNumber,
                    date: date.toLocaleString(),
                    tokenId: BigInt(tokenId),
                    // @ts-ignore
                    amount0: event.args.amount0,
                    // @ts-ignore
                    amount1: event.args.amount1,
                }

                increaseLiquidityInfos.push(increaseLiquidityInfo)
            }
            currentStartBlock = currentEndBlock + 1
        }
        return increaseLiquidityInfos
    } catch (error) {
        console.error(
            "An error occurred while getting increaseLiquidity for position livecycle: ",
            error,
        )
        return undefined
    }
}

export async function getPositionDecreaseData(
    provider: ethers.BrowserProvider,
    chainId: number,
    tokenId: string,
    nfpmContract: ethers.Contract,
): Promise<LivecycleRecord[]> {
    try {
        const startBlock =
            idToNonfungiblePostionManagerContractCreationBlockMapping[chainId]
        const endBlock = await provider.getBlockNumber()
        let currentStartBlock = startBlock
        const maxBlockRequests = 20000

        const filter = nfpmContract.filters.DecreaseLiquidity(tokenId)

        let decreaseLiquidityInfos: LivecycleRecord[] = []

        while (currentStartBlock <= endBlock) {
            const currentEndBlock = Math.min(
                currentStartBlock + maxBlockRequests - 1,
                endBlock,
            )
            const events = await nfpmContract.queryFilter(
                filter,
                currentStartBlock,
                currentEndBlock,
            )

            for (const event of events) {
                // @ts-ignore
                const eventTokenId = event.args.tokenId.toString()

                // check if this event is concern to our tokenId
                if (tokenId !== eventTokenId) {
                    continue
                }

                const block = await provider.getBlock(event.blockNumber)
                const timestamp = block.timestamp
                const date = new Date(timestamp * 1000)

                const decreaseLiquidityInfo: LivecycleRecord = {
                    livecycleEvent: LivecycleEvents.DECREASE,
                    blockNumber: event.blockNumber,
                    date: date.toLocaleString(),
                    tokenId: BigInt(tokenId),
                    // @ts-ignore
                    amount0: event.args.amount0,
                    // @ts-ignore
                    amount1: event.args.amount1,
                }

                decreaseLiquidityInfos.push(decreaseLiquidityInfo)
            }

            currentStartBlock = currentEndBlock + 1
        }
        return decreaseLiquidityInfos
    } catch (error) {
        console.error(
            "An error occurred while getting decreaseLiquidity for position livecycle: ",
            error,
        )
        return undefined
    }
}

export async function getPositionCollectFeesData(
    provider: ethers.BrowserProvider,
    chainId: number,
    tokenId: string,
    nfpmContract: ethers.Contract,
    address: string,
): Promise<LivecycleRecord[]> {
    return [
        {
            livecycleEvent: LivecycleEvents.COLLECT_FEES,
            blockNumber: 12321321,
            date: "13/10/2024, 11:07:28 AM",
            tokenId: BigInt(tokenId),
            // @ts-ignore
            amount0: 50,
            // @ts-ignore
            amount1: 50,
        },
        {
            livecycleEvent: LivecycleEvents.COLLECT_FEES,
            blockNumber: 12321321,
            date: "14/10/2024, 11:37:28 AM",
            tokenId: BigInt(tokenId),
            // @ts-ignore
            amount0: 50,
            // @ts-ignore
            amount1: 50,
        },
    ]
}

export async function getPostionBurnData(
    provider: ethers.BrowserProvider,
    chainId: number,
    tokenId: string,
    nfpmContract: ethers.Contract,
    address: string,
): Promise<LivecycleRecord> {
    return {
        livecycleEvent: LivecycleEvents.BURN,
        blockNumber: 12321321,
        date: "15/10/2024, 11:07:27 AM",
        tokenId: BigInt(tokenId),
        // @ts-ignore
        amount0: 0,
        // @ts-ignore
        amount1: 0,
    }
}
