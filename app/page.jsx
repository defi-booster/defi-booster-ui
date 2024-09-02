import logoIcon from "./components/images/logo_1.webp"
import logo2Icon from "./components/images/logo_2.webp"
import logo3Icon from "./components/images/logo_3.webp"

export default async function HomePage() {
    return (
        <div style={{ height: "100vh" }}>
            <img src={logoIcon.src} width={200} height={200} alt="icon logo" />
            <img src={logo2Icon.src} width={200} height={200} alt="icon logo" />
            <img src={logo3Icon.src} width={200} height={200} alt="icon logo" />
        </div>
    )
}
