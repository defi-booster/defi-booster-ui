import { Web3Modal } from "../context/web3modal"

export const metadata = {
    title: "defi-engine",
    description: "defi-engine",
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
