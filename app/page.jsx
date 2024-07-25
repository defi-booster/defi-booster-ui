import { ConnectButton } from "./components/connect-button"
import WalletLPList from "./uniswapV3/components/wallet-lp-list"

export default async function HomePage() {
    return (
        <div>
            <ConnectButton />
            <WalletLPList />
        </div>
    )
}
