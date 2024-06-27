"use client"
import { useState } from "react"

export default function CountButton() {
    const [counter, setCounter] = useState(0)

    function handleClick() {
        setCounter(counter + 1)
    }

    return <button onClick={handleClick}>count up {counter}</button>
}
