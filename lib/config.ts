const steps = [
    {
        id: 0,
        name: "Goldlist Sale",
        price: 0.04,
        min: 1,
        max: 2,
        supplyLimit: 500,
    },
    {
        id: 1,
        name: "Whitelist Sale",
        price: 0.04,
        min: 1,
        max: 2,
        supplyLimit: 1500,
    },
    {
        id: 2,
        name: "Public Sale",
        price: 0.04,
        min: 1,
        max: 50,
        supplyLimit: 7950,
    }
]

const config = {
    tokenAddress: process.env.NEXT_PUBLIC_TOKEN_ADDRESS,
    mintStartTime: process.env.NEXT_PUBLIC_MINT_START_TIME || 0,
    mintSteps: steps
}

console.log(config)

export const {
    tokenAddress,
    mintStartTime,
    mintSteps
} = config
