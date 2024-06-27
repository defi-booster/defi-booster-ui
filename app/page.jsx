import CountButton from "./count-button"

function Header({ title }) {
    return <h1>{title ? title : "Default title"}</h1>
}

export default function HomePage() {
    return (
        <div>
            <Header title="init template" />
            <CountButton />
        </div>
    )
}
