import { useAccount, useConnect, useContractWrite, useContractRead, chain, useNetwork } from 'wagmi'

import Layout from '../components/Layout'
import ERC721 from '../abis/ERC721A.json'
import { tokenAddress } from '../lib/config'
import { useState } from 'react'
import {ethers} from 'ethers'

const allowedChain = chain.rinkeby
const ERC721Abi = ERC721.abi

const WrongChainButton = () => {
    return <button className="btn btn-disabled">Switch to {allowedChain.name}</button>
}

const ConnectButton = () => {
    const { connect, connectors } = useConnect();

    const ConnectorsModal = () => (
        <>
            <label htmlFor="connect-modal" className="modal">
                <label className="modal-box flex flex-col gap-1">
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
            <label htmlFor="connect-modal" className="btn modal-button">Connect</label>
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
    }, 'balanceOf', { args: address, enabled: enabled ?? true})
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
    return (<><input type="range" min={min || 0} max={max || 1} value={value} onChange={(e) => handleChange(Number(e.target.value))} className="range" /></>)
}

const MintButton = ({ isLoading, onClick }) => {
    const style = isLoading ? "btn loading" : "btn"
    return <div className={style} onClick={() => onClick() }>Mint</div>
}

const isValidConnection = (chain?: any, account?: any) => {
    return account?.connector ? (chain?.id == allowedChain.id) : false;
}

const MintModule = () => {
    const [mintAmount, setMintAmount] = useState(1);
    const { activeChain } = useNetwork()
    const { data: account } = useAccount()
    const { data: totalSupply } = useContractSupply(isValidConnection(activeChain, account))
    const { data: addressBalance } = useAccountBalance(account?.address, isValidConnection(activeChain, account))

    const isConnected = account ? true : false
    const tokenPrice = 0.01
    const maxSupply = 10000
    const userBalance = addressBalance?.toNumber() ?? 0
    const balance = userBalance.toString().padStart(3, '0')
    const minted = totalSupply?.toString().padStart(5, '0') ?? "xxxxx"

    const { write: mint, isLoading } = useContractMint(account?.address, mintAmount, tokenPrice)
    
    const MintStatus = () => (
        <div className="flex flex-col gap-1">
            <div className="flex flex-row justify-between gap-1">
                <div>chain:</div><div>{activeChain?.name || "Unknown"}</div>
            </div>
            <div className="flex flex-row justify-between gap-1">
                <div>connected:</div><div>{isConnected.toString()}</div>
            </div>
            <div className="flex flex-row justify-between gap-1">
                <div>price:</div><div>{tokenPrice} Ξ</div>
            </div>
            <div className="flex flex-row justify-between gap-1">
                <div>balance:</div><div>{balance}</div>
            </div>
            <div className="flex flex-row justify-between gap-1">
                <div>minted:</div>
                <div>{minted} / {maxSupply}</div>
            </div >
            <div className="flex flex-row justify-between gap-1">
                <div>mint:</div>
                <div>{mintAmount}</div>
            </div >
        </div >
    )    

    return (
        <>
            <MintStatus />
            <MintController min={1} max={10} value={mintAmount} handleChange={(value: number) => setMintAmount(value)} />
            { (activeChain && activeChain.id != allowedChain.id) ?
                (<WrongChainButton />) :
                account?.connector ?
                    (<MintButton isLoading={isLoading} onClick={() => mint()} />) : (<ConnectButton />)
            }
        </>
    )
}

const IndexPage = () => {
    return (
        <>
            <Layout title="Mint Page">
                <div className="hero h-full">
                    <div className="flex flex-col gap-2 w-4/5 md:w-1/3 md:max-w-screen-sm">
                        <MintModule />
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default IndexPage
