import { Web3Modal } from "../context/web3modal"

export const metadata = {
    title: "defi_engine",
    description: "null",
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Web3Modal>{children}</Web3Modal>
            </body>
        </html>
    )
}
