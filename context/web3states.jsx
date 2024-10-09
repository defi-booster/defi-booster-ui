"use client"

import { createContext, useContext, useState } from "react"
import { mapping_idToChain } from "defi-booster-shared"

const Context = createContext()

export function Web3StatesProvider({ children }) {
    const [web3State, setWeb3State] = useState({
        currentNetwork: mapping_idToChain[1], // default Ethereum mainnet
    })

    return (
        <Context.Provider value={[web3State, setWeb3State]}>
            {children}
        </Context.Provider>
    )
}

export function useWeb3StatesContext() {
    return useContext(Context)
}
