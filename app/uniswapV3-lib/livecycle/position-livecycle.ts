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
): Promise<LivecycleRecord[]> {
    try {
        const startBlock =
            idToNonfungiblePostionManagerContractCreationBlockMapping[chainId]
        const endBlock = await provider.getBlockNumber()
        let currentStartBlock = startBlock
        const maxBlockRequests = 20000

        const filter = nfpmContract.filters.Collect(tokenId)

        let collectFeesInfos: LivecycleRecord[] = []

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

                const collectFeesInfo: LivecycleRecord = {
                    livecycleEvent: LivecycleEvents.DECREASE,
                    blockNumber: event.blockNumber,
                    date: date.toLocaleString(),
                    tokenId: BigInt(tokenId),
                    // @ts-ignore
                    amount0: event.args.amount0,
                    // @ts-ignore
                    amount1: event.args.amount1,
                }

                collectFeesInfos.push(collectFeesInfo)
            }

            currentStartBlock = currentEndBlock + 1
        }

        return collectFeesInfos
    } catch (error) {
        console.error(
            "An error occurred while getting Collect for position livecycle: ",
            error,
        )
        return undefined
    }
}

export async function getPostionBurnData(
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

        const filter = nfpmContract.filters.Transfer(address, null)

        let positionBurnInfo: LivecycleRecord | undefined

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

                positionBurnInfo = {
                    livecycleEvent: LivecycleEvents.BURN,
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
        return positionBurnInfo
    } catch (error) {
        console.error(
            "An error occurred while getting burn for position livecycle: ",
            error,
        )
        return undefined
    }
}
