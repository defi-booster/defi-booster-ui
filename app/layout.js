import "./globals.css"
import { JetBrains_Mono } from "next/font/google"
import { NextUIProvider } from "@nextui-org/react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { Web3Modal } from "../context/web3modal"
import { Web3StatesProvider } from "../context/web3states"
import { Nav } from "./components/nav"
import { Footer } from "./components/footer"

export const metadata = {
    title: "defi_booster",
    description: "null",
}

const jet_mono = JetBrains_Mono({
    subsets: ["latin"],
    weight: "100",
})

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={jet_mono.className}>
                <NextUIProvider>
                    <NextThemesProvider attribute="class" defaultTheme="dark">
                        <Web3StatesProvider>
                            <Web3Modal>
                                <Nav />
                                {children}
                                <Footer />
                            </Web3Modal>
                        </Web3StatesProvider>
                    </NextThemesProvider>
                </NextUIProvider>
            </body>
        </html>
    )
}
