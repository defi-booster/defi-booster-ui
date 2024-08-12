"use client"

import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

import { MoonIcon } from "./icons/moon-icon"
import { SunIcon } from "./icons/sun-icon"
import { Button } from "@nextui-org/react"

export function ThemeSwitcher() {
    const [isMounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!isMounted) return null

    const switchMode = () => {
        if (theme === "dark") {
            setTheme("light")
        }
        if (theme === "light") {
            setTheme("dark")
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <Button onClick={switchMode} isIconOnly>
                {theme === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>
        </div>
    )
}
