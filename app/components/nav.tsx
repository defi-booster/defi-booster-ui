"use client"

import { ConnectButton } from "./connect-button"
import { ThemeSwitcher } from "./theme-switcher"

import React, { useEffect, useState } from "react"
import {
    Navbar,
    NavbarBrand,
    NavbarMenuToggle,
    NavbarMenuItem,
    NavbarMenu,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
    Tooltip,
} from "@nextui-org/react"

import { useWeb3ModalAccount } from "@web3modal/ethers/react"
import { SupportedChains } from "../utils/enums"
import { getNetworkNameFromID } from "../utils/utils"
import { chainIdToIcon } from "../utils/mappings"

export const Nav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { isConnected, address, chainId } = useWeb3ModalAccount()
    const [network, setNetwork] = useState<SupportedChains>(
        SupportedChains.Unsupported
    )

    const menuItems = ["Profile", "Dashboard", <ThemeSwitcher />]

    useEffect(() => {
        const netName = getNetworkNameFromID(chainId)
        setNetwork(netName)
    }, [chainId])

    return (
        <Navbar
            isBordered
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
        >
            <NavbarContent className="sm:hidden" justify="start">
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                />
            </NavbarContent>

            <NavbarContent className="sm:hidden pr-3" justify="start">
                <NavbarBrand>
                    <p className="font-bold text-inherit">defi engine 🔥</p>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="start">
                <NavbarBrand>
                    <p className="font-bold text-inherit">defi engine 🔥</p>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link color="foreground" href="#">
                        choose protocol
                    </Link>
                </NavbarItem>
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                    <ConnectButton />
                </NavbarItem>
                <NavbarItem>
                    <Tooltip content={network}>
                        {chainIdToIcon(chainId)}
                    </Tooltip>
                </NavbarItem>
                <NavbarItem>
                    <ThemeSwitcher />
                </NavbarItem>
            </NavbarContent>

            <NavbarMenu>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link
                            className="w-full"
                            color={
                                index === 2
                                    ? "warning"
                                    : index === menuItems.length - 1
                                    ? "danger"
                                    : "foreground"
                            }
                            href="#"
                            size="lg"
                        >
                            {item}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    )
}
