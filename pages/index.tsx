import { useAccount, useConnect, useContractWrite, useContractRead, chain, useNetwork } from 'wagmi'

import Layout from '../components/Layout'
import ERC721 from '../abis/ERC721A.json'
import { tokenAddress, mintStartTime, mintSteps } from '../lib/config'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Image from 'next/image'

const allowedChain = chain.rinkeby
const ERC721Abi = ERC721.abi

const WrongChainButton = () => {
    return <button className="btn btn-disabled">Switch to {allowedChain.name}</button>
}

const BackoffButton = ({ stepId }) => {
    if (stepId < 2) {
        return <button className="btn btn-primary">Join us on discord</button>
    } else {
        return <button className="btn btn-primary">Go to OpenSea</button>
    }
}

const ConnectButton = () => {
    const { connect, connectors } = useConnect();

    const ConnectorsModal = () => (
        <>
            <label htmlFor="connect-modal" className="modal bg-transparent backdrop-blur">
                <label className="modal-box flex flex-col gap-1 z-20">
                    {connectors.map((connector) => (
                        <button
                            className="btn"
                            disabled={!connector.ready}
                            key={connector.id}
                            onClick={() => connect(connector)}
                        >
                            {connector.name}
                        </button>
                    ))}
                </label>
            </label>
        </>
    )

    return (
        <>
            <label htmlFor="connect-modal" className="btn btn-primary modal-button">Connect</label>
            <input type="checkbox" id="connect-modal" className="modal-toggle" />
            <ConnectorsModal />
        </>
    )
}

const useContractSupply = (enabled?: boolean) => {
    return useContractRead({
        addressOrName: tokenAddress,
        contractInterface: ERC721Abi,
    }, 'totalSupply', { chainId: allowedChain.id, enabled: enabled ?? true })
}

const useAccountBalance = (address: string, enabled?: boolean) => {
    return useContractRead({
        addressOrName: tokenAddress,
        contractInterface: ERC721Abi,
    }, 'balanceOf', { args: address, enabled: enabled ?? true })
}

const useContractMint = (address: string, amount: number, price: number) => {
    return useContractWrite({
        addressOrName: tokenAddress,
        contractInterface: ERC721.abi,
    },
        'mint',
        {
            args: [address, amount],
            overrides: { value: ethers.utils.parseEther(String(amount * price)) }
        }
    )
}

const MintController = ({ min, max, value, handleChange }) => {
    return (
        <div className="flex flex-col w-full">
            <input type="range" min={min || 0} max={max || 1} value={value} onChange={(e) => handleChange(Number(e.target.value))} className="range range-primary" />
            <div className="w-full flex justify-between text-md px-2">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    )
}

const MintButton = ({ isLoading, abled, onClick }) => {
    const baseStyle = "btn btn-primary"
    let style = isLoading ? [baseStyle, "loading"].join(" ") : baseStyle
    style = !abled ? [baseStyle, "btn-disabled"].join(" ") : style
    return <div className={style} onClick={() => onClick()}>Mint</div>
}

const MintStatus = ({ current, max }) => {
    const minted = current.toString().padStart(max.toString().length, '0')
    return (
        <div className="flex flex-col">
            {current >= max ?
                (<>
                    <div className="text-lg self-center uppercase">Sold out</div>
                </>)
                : (<>
                    <div className="text-lg self-center">Minting Now</div>
                </>)
            }
            <div className="text-lg self-center">{minted} / {max}</div>
        </div>
    )
}

const isValidConnection = (chain?: any, account?: any) => {
    return account?.connector ? (chain?.id == allowedChain.id) : false;
}

const MintStepBanner = ({ step }) => {
    const image = () => {
        switch (step) {
            case 0:
                return (<img src="/goldlist.png" />)
            case 1:
                return (<img src="/whitelist.png" />)
            default:
                return (<img src="/publicsale.png" />)
        }
    }
    return (<div className="self-center grid place-items-center w-2/5">{image()}</div>)
}

const MintModule = () => {
    const [mintAmount, setMintAmount] = useState(1);
    const [mintAllowed, setMintAllowed] = useState(true);
    const { activeChain } = useNetwork()
    const { data: account } = useAccount()
    const { data: totalSupply } = useContractSupply(isValidConnection(activeChain, account))
    // const { data: addressBalance } = useAccountBalance(account?.address, isValidConnection(activeChain, account))

    // const isConnected = account ? true : false
    const stepId = 0;
    const stepConfig = mintSteps[stepId];
    const tokenPrice = stepConfig.price;
    const mintMin = stepConfig.min;
    const mintMax = stepConfig.max;
    const maxSupply = stepConfig.supplyLimit;
    // const mintMax = 1;
    // const maxSupply = 1;

    useEffect(() => {
        setMintAllowed(mintAmount < mintMax)
    }, [mintAmount, mintMax])

    // const userBalance = addressBalance?.toNumber() ?? 0
    // const balance = userBalance.toString().padStart(3, '0')

    const { write: mint, isLoading } = useContractMint(account?.address, mintAmount, tokenPrice)

    return (
        <div className="flex flex-col align-center justify-center items-center gap-5">
            <MintStepBanner step={stepConfig.id} />
            {(account?.connector && mintAllowed) && (
                <div className="flex flex-col w-full gap-10 items-center">
                    <div className="text-2xl font-semibold uppercase text-center">
                        Please enter your quantity
                    </div>
                    <div className="bg-neutral w-24 text-center text-3xl py-3 rounded-lg text-black font-bold self-center">
                        {mintAmount}
                    </div>
                    <MintController min={mintMin} max={mintMax} value={mintAmount} handleChange={(value: number) => setMintAmount(value)} />
                    <div className="text-lg font-semibold text-center">{tokenPrice} Ξ for each Anim4rt + Gas Fees</div>
                </div>
            )}

            <div className="flex flex-col w-2/3 md:w-1/2 self-center">
                {(activeChain && activeChain.id != allowedChain.id) ?
                    (<WrongChainButton />) :
                    !account?.connector ?
                        (<ConnectButton />) :
                        mintAllowed ?
                            (<MintButton isLoading={isLoading} abled={mintAllowed} onClick={() => mint()} />) :
                            (<BackoffButton stepId={stepId} />)
                }
            </div>
            <MintStatus current={totalSupply ?? "---"} max={maxSupply} />
        </div>
    )
}

const Logo = () => (
    <div className="self-center w-1/2 md:w-2/5">
        <Image src="/logo.png" width="100%" height="100%" layout="responsive" />
    </div>
)

const useCountdown = (targetDate) => {
    const countDownDate = new Date(targetDate).getTime();

    const [countDown, setCountDown] = useState(
        new Date().getTime() - countDownDate
    )

    useEffect(() => {
        const interval = setInterval(() => {
            setCountDown(countDownDate - new Date().getTime())
        }, 1000);
        return () => clearInterval(interval)
    }, [countDownDate]);

    return getTimeValues(countDown);
}

const getTimeValues = (countDown) => {
    const day = 86400 * 1000
    const hour = 3600 * 1000
    const minute = 60 * 1000

    const days = Math.floor(countDown / day)
    const hours = Math.floor(countDown / hour) % 24
    const minutes = Math.floor(countDown / minute) % 60
    const seconds = Math.floor(countDown / 1000) % 60

    return [days, hours, minutes, seconds]
}

const CountDown = ({ endTime }) => {
    const [days, hours, minutes, seconds] = useCountdown(endTime)

    return (
        <div className="flex flex-row gap-3 md:gap-5 text-center self-center">
            <div className="flex flex-col p-2 bg-primary rounded-box items-center">
                <span className="countdown font-mono text-3xl md:text-5xl">
                    <span style={{ '--value': Math.max(days, 0) } as React.CSSProperties}></span>
                </span>
                days
            </div>
            <div className="flex flex-col p-2 bg-primary rounded-box items-center">
                <span className="countdown font-mono text-3xl md:text-5xl">
                    <span style={{ '--value': Math.max(hours, 0) } as React.CSSProperties}></span>
                </span>
                hours
            </div>
            <div className="flex flex-col p-2 bg-primary rounded-box items-center">
                <span className="countdown font-mono text-3xl md:text-5xl">
                    <span style={{ '--value': Math.max(minutes, 0) } as React.CSSProperties}></span>
                </span>
                min
            </div>
            <div className="flex flex-col p-2 bg-primary rounded-box items-center">
                <span className="countdown font-mono text-3xl md:text-5xl">
                    <span style={{ '--value': Math.max(seconds, 0) } as React.CSSProperties}></span>
                </span>
                sec
            </div>
        </div>
    )
}

const IndexPage = () => {
    return (
        <>
            <Layout title="Anim4rt - Mint">
                <div className="hero h-full text-white bg-hero-pattern">
                    <div className="flex flex-col align-center justify-center gap-1 w-4/5 md:w-1/3 md:max-w-screen-sm">
                        <Logo />
                        {
                            mintStartTime > Date.now() ?
                                <CountDown endTime={mintStartTime} /> :
                                <MintModule />
                        }
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default IndexPage
