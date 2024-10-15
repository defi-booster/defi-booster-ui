"use client"
import React, { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import defiBoosterDark from "./images/defi_booster_dark.svg"
import defiBoosterLight from "./images/defi_booster_light.svg"

import styles from "../styles/Footer.module.css"

export const Footer = () => {
    const [isMounted, setMounted] = useState(false)
    const { theme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!isMounted) return null

    return (
        <div className={styles.footer}>
            <div className={styles.footer_copy}>
                <img
                    src={
                        theme === "dark"
                            ? defiBoosterDark.src
                            : defiBoosterLight.src
                    }
                    alt={
                        theme === "dark"
                            ? "DeFi Booster dark"
                            : "DeFi Booster light"
                    }
                />
                <p>&copy; 2024 DeFi Booster</p>
            </div>
        </div>
    )
}
