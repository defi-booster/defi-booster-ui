import { SupportedChains } from "./enums"
import { idToChainMapping } from "./mappings"

export const getNetworkNameFromID = (id: number): SupportedChains => {
    const netName = idToChainMapping[id]

    if (netName === undefined) {
        return SupportedChains.Unsupported
    }

    return idToChainMapping[id]
}
