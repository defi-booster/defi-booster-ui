import paper1 from "./components/images/paper_1.webp"
import paper2 from "./components/images/paper_2.webp"
import paper3 from "./components/images/paper_3.webp"

import styles from "./styles/Home.module.css"

export default async function HomePage() {
    return (
        <div className={styles.main_container}>
            <div>
                <p>main page description</p>
            </div>

            <div className={styles.image_container}>
                <img
                    src={paper1.src}
                    className={`${styles.image} ${styles.image_1}`}
                    alt="paper1 image"
                />
                <img
                    src={paper2.src}
                    className={`${styles.image} ${styles.image_2}`}
                    alt="paper2 image"
                />
                <img
                    src={paper3.src}
                    className={`${styles.image} ${styles.image_3}`}
                    alt="paper3 image"
                />
            </div>
        </div>
    )
}
