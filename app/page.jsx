import ConnectButton from "./connect-button"
import ConnectionInfo from "./connection-info"

function Header({ title }) {
    return <h1>{title ? title : "Default title"}</h1>
}

export default async function HomePage() {
    return (
        <div>
            <Header title="init template" />
            <ConnectButton />
            <ConnectionInfo />
        </div>
    )
}
