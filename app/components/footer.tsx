"use client"
import { Link } from "@nextui-org/react"
import {
    FaDiscord,
    FaInstagram,
    FaTwitter,
    FaGithub,
    FaBook,
} from "react-icons/fa"
import styles from "../styles/Footer.module.css"

export const Footer = () => {
    return (
        <div className={styles.footer}>
            <div className={styles.footer_copy}>
                <p>&copy; 2024 DeFi Booster</p>
            </div>
            <div className={styles.footer_media}>
                community
                <div>
                    <Link>
                        <FaDiscord size={16} />
                    </Link>
                </div>
                <div>
                    <Link>
                        <FaInstagram size={16} />
                    </Link>
                </div>
                <div>
                    <Link>
                        <FaTwitter size={16} />
                    </Link>
                </div>
            </div>
            <div className={styles.footer_code_and_docs}>
                code and documentation
                <div>
                    <Link>
                        <FaGithub size={16} />
                    </Link>
                </div>
                <div>
                    <Link>
                        <FaBook size={16} />
                    </Link>
                </div>
            </div>
        </div>
    )
}
