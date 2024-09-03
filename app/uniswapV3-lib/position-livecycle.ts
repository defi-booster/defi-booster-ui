// import { ethers } from "ethers"

// import { PositionMintInfo } from "./utils/types"
// import { idToNonfungiblePostionManagerContractCreationBlockMapping } from "./utils/mappings"

// export async function getPoolMintingData(
//     provider: ethers.BrowserProvider,
//     chainId: number,
//     nfpmContract: ethers.Contract,
//     address: string,
// ): Promise<PositionMintInfo[]> {
//     try {
//         const startBlock =
//             idToNonfungiblePostionManagerContractCreationBlockMapping[chainId]
//         const endBlock = await provider.getBlockNumber()
//         let currentStartBlock = startBlock
//         const maxBlockRequests = 20000
//         const positionMintInfos = []

//         const filter = nfpmContract.filters.Transfer(
//             "0x0000000000000000000000000000000000000000",
//             address,
//         )

//         while (currentStartBlock <= endBlock) {
//             const currentEndBlock = Math.min(
//                 currentStartBlock + maxBlockRequests - 1,
//                 endBlock,
//             )
//             const events = await nfpmContract.queryFilter(
//                 filter,
//                 currentStartBlock,
//                 currentEndBlock,
//             )

//             for (const event of events) {
//                 // @ts-ignore
//                 const tokenId = event.args.tokenId.toString()
//                 const increaseLiquidityFilter =
//                     nfpmContract.filters.IncreaseLiquidity(tokenId)

//                 const liquidityEvents = await nfpmContract.queryFilter(
//                     increaseLiquidityFilter,
//                     event.blockNumber,
//                     event.blockNumber,
//                 )

//                 if (liquidityEvents.length > 0) {
//                     // at minting moment there should be only one IncreaseLiquidity event
//                     const liquidityEvent = liquidityEvents[0]

//                     const block = await provider.getBlock(event.blockNumber)
//                     const timestamp = block.timestamp

//                     const date = new Date(timestamp * 1000)

//                     positionMintInfos.push({
//                         blockNumber: event.blockNumber,
//                         date: date.toLocaleString(),
//                         tokenId: BigInt(tokenId),
//                         // @ts-ignore
//                         token0Amount: liquidityEvent.args.amount0,
//                         // @ts-ignore
//                         token1Amount: liquidityEvent.args.amount1,
//                     })
//                 }
//             }
//             currentStartBlock = currentEndBlock + 1
//         }
//         return positionMintInfos
//     } catch (error) {
//         console.error(
//             "An error occurred while getting position livecycle:",
//             error,
//         )
//         return []
//     }
// }
