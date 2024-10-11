import { gql } from "@apollo/client"

export const GET_V3_POSITIONS = gql`
    query GetV3Positions($chainId: Int!, $address: String!) {
        getV3Positions(chainId: $chainId, address: $address) {
            tokenId
            fee
            liquidity
            token0Symbol
            token1Symbol
            token0Decimals
            token1Decimals
            tickLower
            tickUpper
            feeGrowthInsideLastX128_0
            feeGrowthInsideLastX128_1
            token0Address
            token1Address
            poolInfo {
                sqrtPriceX96
                tick
                feeGrowthGlobalX128_0
                feeGrowthGlobalX128_1
                tickUpperFeeGrowthOutsideX128_0
                tickUpperFeeGrowthOutsideX128_1
                tickLowerFeeGrowthOutsideX128_0
                tickLowerFeeGrowthOutsideX128_1
            }
        }
    }
`

export const GET_V3_LIVECYCLE = gql`
    query getV3PositionLivecycle(
        $chainId: Int!
        $tokenId: Int!
        $address: String!
    ) {
        getV3PositionLivecycle(
            chainId: $chainId
            tokenId: $tokenId
            address: $address
        ) {
            livecycleEvent
            blockNumber
            txHash
            date
            tokenId
            amount0
            amount1
            feePaid
        }
    }
`
