import { CardBody } from "@nextui-org/react"

export const Ticks = ({ pool, position }) => {
    return (
        <CardBody>
            <p>tickLower: {Number(position.tickLower)}</p>
            <p>tickCurrent: {Number(pool.tick)}</p>
            <p>tickUpper: {Number(position.tickUpper)}</p>
        </CardBody>
    )
}
