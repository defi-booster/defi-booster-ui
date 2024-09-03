import { CardHeader } from "@nextui-org/react"

import { TokenUNI } from "@web3icons/react"

export const Header = ({ tokenId, token0Symbol, token1Symbol, fee }) => {
    return (
        <CardHeader className="flex gap-3">
            <TokenUNI />
            <div className="flex flex-col">
                <p className="text-md">{`${token0Symbol}-${token1Symbol}`}</p>
                <p>tokenId: {tokenId}</p>
                <p className="text-small text-default-500">
                    fee: {`${Number(fee) / 10000} %`}
                </p>
            </div>
        </CardHeader>
    )
}
