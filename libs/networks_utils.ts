export const idToChainMapping = {
    1: "Ethereum",
    42161: "Arbitrum",
    43114: "Avalanche",
    81457: "Blast",
    59144: "Linea",
    369: "PulseChain",
    8453: "Base",
    31337: "Localhost",
}

export const getNetworkNameFromID = (id: number) => {
    return idToChainMapping[id]
}
