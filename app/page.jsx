"use client"
import { useEffect, useState } from "react"
import { Link, Card, CardHeader, CardBody, Tabs, Tab } from "@nextui-org/react"
import { Orbitron } from "next/font/google"
import {
    FaDiscord,
    FaInstagram,
    FaTwitter,
    FaGithub,
    FaBook,
} from "react-icons/fa"

import {
    NetworkEthereum,
    NetworkBase,
    NetworkAvalanche,
    NetworkLinea,
    NetworkArbitrumOne,
    TokenJOE,
    TokenUNI,
    TokenAERO,
} from "@web3icons/react"

import { useTheme } from "next-themes"
import { useMediaQuery } from "@mui/material"

import logo from "./components/images/discordLogo.png"

import styles from "./styles/Home.module.css"

const orbitron = Orbitron({
    subsets: ["latin"],
    weight: "400",
})

export default function HomePage() {
    // constants
    const POSITION_TRACKING_TEXT =
        "Track all your positions on the selected chain. It lists all positions and their parameters, such as current reserves, tick range, range status, and more."
    const POSITION_METRICS_TEXT =
        "Position metrics include current impermanent loss, collected fees, uncollected fees, projected value if held, profit/loss, and more."
    const POSITION_LIVECYCLE_TEXT =
        "Track the position lifecycle, including mint, decrease, increase, burn, collect, and more. Check when and how much."
    const PROFITABLE_LIQUIDITY_PROVIDERS_TEXT = "Coming soon"

    // states
    const [isMounted, setMounted] = useState(false)
    const [activeTab, setActiveTab] = useState("position tracking") // Stan aktywnej karty

    // hooks
    const { theme } = useTheme()
    const isXs = useMediaQuery("(max-width: 400px)")

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!isMounted) return null

    return (
        <div className={styles.main_container}>
            <h1
                className={`${orbitron.className} ${styles.title}  flex items-center justify-center`}
            >
                DeFi Booster{" "}
                <span>
                    <img
                        src={logo.src}
                        className={`${styles.logo} ml-4`}
                        alt="logo image"
                    />
                </span>
            </h1>
            <div className={styles.section_1}>
                <div className={styles.description}>
                    <p
                        className={
                            theme === "dark"
                                ? styles.main_text_dark
                                : styles.main_text_light
                        }
                    >
                        DeFi Booster is a tool dedicated to liquidity providers
                        for tracking their DeFi positions.
                    </p>
                    <p className={styles.sub_description}>
                        Have you ever wondered if your DeFi position is
                        profitable? Do your collected fees exceed impermanent
                        loss?
                    </p>
                    <p className={styles.sub_description}>
                        Controll your profit and loss metrics like network fees,
                        collected/uncollected fees, imperanment loss and many
                        more.
                    </p>
                    <p className={styles.sub_description}>
                        Now you have your positions under control.
                    </p>
                </div>
            </div>

            {isXs ? (
                <div
                    className="flex w-[80vw] flex-col items-center justify-start text-center"
                    style={{
                        margin: "10vh auto",
                    }}
                >
                    {/* Tabsy u góry */}
                    <Tabs
                        aria-label="Tabs colors"
                        color="secondary"
                        isVertical={true}
                        onSelectionChange={(key) => setActiveTab(key)} // Aktualizacja stanu aktywnej karty
                        selectedKey={activeTab}
                    >
                        <Tab
                            key="positions tracking"
                            title="Positions tracking"
                        />
                        <Tab key="position metrics" title="Position metrics" />
                        <Tab
                            key="position livecycle"
                            title="Position livecycle"
                        />
                        <Tab
                            key="profitable liquidity providers"
                            title="Profitable liquidity providers"
                        />
                    </Tabs>

                    <Card className="mt-4">
                        <CardBody>
                            {activeTab === "positions tracking" && (
                                <p>{POSITION_TRACKING_TEXT}</p>
                            )}
                            {activeTab === "position metrics" && (
                                <p>{POSITION_METRICS_TEXT}</p>
                            )}
                            {activeTab === "position livecycle" && (
                                <p>{POSITION_LIVECYCLE_TEXT}</p>
                            )}
                            {activeTab === "profitable liquidity providers" && (
                                <p>{PROFITABLE_LIQUIDITY_PROVIDERS_TEXT}</p>
                            )}
                        </CardBody>
                    </Card>
                </div>
            ) : (
                <div
                    className="flex w-[80vw] flex-col items-center justify-center text-center"
                    style={{
                        margin: "10vh auto",
                    }}
                >
                    <Tabs
                        aria-label="Tabs colors"
                        color="secondary"
                        isVertical={false}
                    >
                        <Tab
                            key="positions tracking"
                            title="Positions tracking"
                        >
                            <Card>
                                <CardBody>{POSITION_TRACKING_TEXT}</CardBody>
                            </Card>
                        </Tab>
                        <Tab key="position metrics" title="Position metrics">
                            <Card>
                                <CardBody>{POSITION_METRICS_TEXT}</CardBody>
                            </Card>
                        </Tab>
                        <Tab
                            key="position livecycle"
                            title="Position livecycle"
                        >
                            <Card>
                                <CardBody>{POSITION_LIVECYCLE_TEXT}</CardBody>
                            </Card>
                        </Tab>
                        <Tab
                            key="profitable liquidity providers"
                            title="Profitable liquidity providers"
                        >
                            <Card>
                                <CardBody>
                                    {PROFITABLE_LIQUIDITY_PROVIDERS_TEXT}
                                </CardBody>
                            </Card>
                        </Tab>
                    </Tabs>
                </div>
            )}

            <div className={styles.networks}>
                <Card
                    shadow="lg"
                    className="max-w-[450px]"
                    style={{
                        margin: "5px 10px",
                    }}
                >
                    <CardHeader className="flex gap-3">
                        Supported networks
                    </CardHeader>
                    <div className={styles.icons}>
                        <Link>
                            <NetworkEthereum size={48} variant="branded" />
                        </Link>
                        <Link>
                            <NetworkBase size={48} variant="branded" />
                        </Link>
                    </div>
                </Card>

                <Card
                    shadow="lg"
                    className="max-w-[450px]"
                    style={{
                        margin: "5px 0",
                    }}
                >
                    <CardHeader className="flex gap-3">
                        Supported protocols
                    </CardHeader>
                    <div className={styles.icons}>
                        <Link>
                            <TokenUNI size={48} variant="branded" />
                        </Link>
                    </div>
                </Card>
            </div>

            <div className={styles.networks}>
                <Card
                    shadow="lg"
                    className="max-w-[450px]"
                    style={{
                        margin: "5px 10px",
                    }}
                >
                    <CardHeader className="flex gap-3">
                        Networks in progress
                    </CardHeader>
                    <div className={styles.icons}>
                        <Link>
                            <NetworkAvalanche size={48} variant="branded" />
                        </Link>

                        <Link>
                            <NetworkLinea size={48} variant="mono" />
                        </Link>

                        <Link>
                            <NetworkArbitrumOne size={48} variant="branded" />
                        </Link>
                    </div>
                </Card>

                <Card
                    shadow="lg"
                    className="max-w-[450px]"
                    style={{
                        margin: "5px 0",
                    }}
                >
                    <CardHeader className="flex gap-3">
                        Protocols in progress
                    </CardHeader>
                    <div className={styles.icons}>
                        <Link>
                            <TokenJOE size={48} variant="branded" />
                        </Link>
                        <Link>
                            <TokenAERO size={48} variant="branded" />
                        </Link>
                    </div>
                </Card>
            </div>

            <div className={styles.social}>
                <div>
                    <p>community and documentation</p>
                </div>
                <div className={styles.social_links}>
                    <div>
                        <Link>
                            <FaDiscord size={48} />
                        </Link>
                    </div>
                    <div>
                        <Link>
                            <FaInstagram size={48} />
                        </Link>
                    </div>
                    <div>
                        <Link>
                            <FaTwitter size={48} />
                        </Link>
                    </div>
                    <div>
                        <Link>
                            <FaGithub size={48} />
                        </Link>
                    </div>
                    <div>
                        <Link>
                            <FaBook size={48} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
