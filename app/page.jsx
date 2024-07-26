import { ConnectButton } from "./components/connect-button"
import { UniswapV3Page } from "./components/uniswap/uniswap-v3-page"

export default async function HomePage() {
    return (
        <div>
            <ConnectButton />
            <UniswapV3Page />
        </div>
    )
}
