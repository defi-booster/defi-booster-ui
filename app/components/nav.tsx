"use client"

import { ConnectButton } from "./connect-button"
import { ThemeSwitcher } from "./theme-switcher"
import { useTheme } from "next-themes"
import { ChevronDown } from "./icons/icons"
import React, { useEffect, useState } from "react"
import { TokenUNI, TokenAERO } from "@web3icons/react"
import traderJoeIcon from "./icons/trader_joe.webp"
import defiBoosterDark from "./images/defi_booster_dark.svg"
import defiBoosterLight from "./images/defi_booster_light.svg"

import {
    Dropdown,
    DropdownItem,
    DropdownTrigger,
    DropdownMenu,
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
import { useWeb3StatesContext } from "../../context/web3states"

import { NetworkEthereum, NetworkBase } from "@web3icons/react"

import styles from "../styles/Nav.module.css"

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

export const Nav = () => {
    const icons = {
        // @ts-ignore
        chevron: <ChevronDown fill="currentColor" size={16} />,
    }

    const [isMounted, setMounted] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { theme } = useTheme()
    const [web3State] = useWeb3StatesContext()

    const { chainId } = useWeb3ModalAccount()

    const menuItems = [
        {
            name: "Home",
            description: "",
            icon: "🏡",
            href: "/",
            style: {},
        },
        {
            name: "UniswapV3",
            description: "UniswapV3 - detect and monitor your positions.",
            icon: <TokenUNI variant="branded" />,
            href: "/uniswapv3",
            style: {},
        },
        {
            name: "Trader Joe",
            description: "This section is currently under construction.",
            icon: (
                <img
                    src={traderJoeIcon.src}
                    width={20}
                    height={20}
                    alt="Trader Joe"
                />
            ),
            href: "/trader-joe",
            style: {
                pointerEvents: "none",
            },
        },
        {
            name: "Aerodrome",
            description: "This section is currently under construction.",
            icon: <TokenAERO variant="branded" />,
            href: "/aerodrome",
            style: {
                pointerEvents: "none",
            },
        },
        {
            name: "change mode",
            description: "",
            icon: <ThemeSwitcher />,
        },
    ]

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!isMounted) return null

    let _color
    if (theme === "dark") {
        _color = "#6BBE44"
    } else {
        _color = "#D40000"
    }

    return (
        <Navbar
            isBordered
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
            maxWidth="full"
        >
            <NavbarContent className="sm:hidden" justify="start">
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                />
            </NavbarContent>

            <NavbarBrand>
                <Link
                    className={`text-inherit ${styles.link_wrapper}`}
                    style={{
                        color: _color,
                        fontWeight: "700",
                        fontStyle: "italic",
                    }}
                    href="/"
                >
                    <img
                        src={
                            theme === "dark"
                                ? defiBoosterDark.src
                                : defiBoosterLight.src
                        }
                        className={styles.logo_flag}
                        alt={
                            theme === "dark"
                                ? "DeFi Booster dark"
                                : "DeFi Booster light"
                        }
                    />
                    <p style={{ color: theme === "dark" ? "white" : "black" }}>
                        DeFi Booster
                    </p>
                </Link>
            </NavbarBrand>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Dropdown>
                        <NavbarItem>
                            <DropdownTrigger>
                                <Button
                                    disableRipple
                                    className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                                    endContent={icons.chevron}
                                    radius="sm"
                                    variant="light"
                                >
                                    choose protocol
                                </Button>
                            </DropdownTrigger>
                        </NavbarItem>
                        <DropdownMenu
                            aria-label="ACME features"
                            className="w-[340px]"
                            itemClasses={{
                                base: "gap-4",
                            }}
                        >
                            <DropdownItem
                                key="1"
                                description="UniswapV3 - detect and monitor your positions."
                                startContent={<TokenUNI variant="branded" />}
                                href="/uniswapv3"
                            >
                                UniswapV3
                            </DropdownItem>
                            <DropdownItem
                                key="2"
                                description="This section is currently under construction."
                                startContent={
                                    <img
                                        src={traderJoeIcon.src}
                                        width={20}
                                        height={20}
                                        alt="Trader Joe"
                                    />
                                }
                                href="/trader-joe"
                                style={{
                                    pointerEvents: "none",
                                }}
                            >
                                Trader Joe
                            </DropdownItem>
                            <DropdownItem
                                key="3"
                                description="This section is currently under construction."
                                startContent={<TokenAERO variant="branded" />}
                                style={{
                                    pointerEvents: "none",
                                }}
                                href="/aerodrome"
                            >
                                Aerodrome
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarItem>
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem>
                    <ConnectButton />
                </NavbarItem>
                <NavbarItem className="hidden lg:flex">
                    <Tooltip content={web3State.currentNetwork}>
                        {chainIdToIcon(chainId)}
                    </Tooltip>
                </NavbarItem>
                <NavbarItem className="hidden lg:flex">
                    <ThemeSwitcher />
                </NavbarItem>
            </NavbarContent>

            <NavbarMenu>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link
                            className="w-full"
                            href={item.href}
                            size="lg"
                            // @ts-ignore
                            style={item.style}
                        >
                            <div className="w-[340px] flex flex-col gap-4">
                                <div className="flex items-center gap-4 p-2">
                                    {item.icon}
                                    <div>
                                        <strong>{item.name}</strong>
                                        <p className="text-sm">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    )
}
