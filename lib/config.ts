type MintStep = {
    id: number,
    name: string,
    startTime: number,
    price: number,
    min: number,
    max: number,
    supplyLimit: number
}

const steps: MintStep[] = [
    {
        id: 0,
        name: "Goldlist Sale",
        startTime: 1651692702000,
        price: 0.04,
        min: 1,
        max: 2,
        supplyLimit: 500,
    },
    {
        id: 1,
        name: "Whitelist Sale",
        startTime: 1651702702000,
        price: 0.04,
        min: 1,
        max: 2,
        supplyLimit: 2000,
    },
    {
        id: 2,
        name: "Public Sale",
        startTime: 1651722702000,
        price: 0.04,
        min: 1,
        max: 500,
        supplyLimit: 9000,
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
