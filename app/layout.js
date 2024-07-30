import { Web3Modal } from "../context/web3modal"
import { Web3StatesProvider } from "../context/web3states"

export const metadata = {
    title: "defi_engine",
    description: "null",
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Web3StatesProvider>
                    <Web3Modal>{children}</Web3Modal>
                </Web3StatesProvider>
            </body>
        </html>
    )
}
