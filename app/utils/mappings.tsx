import { SupportedChains } from "./enums"
import { NetworkEthereum, NetworkBase } from "@web3icons/react"

export const idToChainMapping = {
    1: SupportedChains.Ethereum,
    8453: SupportedChains.Base,
    31337: SupportedChains.Localhost,
    11155111: SupportedChains.Sepolia,
}

export const chainIdToIcon = (chainId: number) => {
    if (chainId === 1) {
        return <NetworkEthereum size={32} variant="mono" />
    } else if (chainId === 8453) {
        return <NetworkBase size={32} variant="mono" />
    } else if (chainId === 31337) {
        return <p>👷‍♂️</p>
    } else if (chainId === 11155111) {
        return <p>👷‍♂️</p>
    } else {
        return <p>🚧</p>
    }
}
