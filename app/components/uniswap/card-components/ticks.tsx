import { CardBody } from "@nextui-org/react"

export const Ticks = ({ pool_tick, tickLower, tickUpper }) => {
    return (
        <CardBody>
            <p>tickLower: {Number(tickLower)}</p>
            <p>tickCurrent: {Number(pool_tick)}</p>
            <p>tickUpper: {Number(tickUpper)}</p>
        </CardBody>
    )
}
