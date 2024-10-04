"use client"

import { createContext, useContext, useState } from "react"

import { getNetworkNameFromID } from "../libs/networks_utils"

const Context = createContext()

export function Web3StatesProvider({ children }) {
    const [web3State, setWeb3State] = useState({
        currentNetwork: getNetworkNameFromID(1), // default Ethereum mainnet
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
