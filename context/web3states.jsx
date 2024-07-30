"use client"

import { createContext, useContext, useState } from "react"

import { SupportedChains } from "../app/utils/enums"

const Context = createContext()

export function Web3StatesProvider({ children }) {
    const [web3State, setWeb3State] = useState({
        currentNetwork: SupportedChains.Unsupported,
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
