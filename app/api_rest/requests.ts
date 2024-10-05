export async function api_sendSignatureToVerify(
    address: string,
    message: string,
    signature: string,
) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_REST_API_URL}/signature/verify`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ address, message, signature }),
        },
    )

    return response
}
