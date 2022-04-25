import { useAccount, useConnect, useContractWrite, useContractRead, chain, useNetwork } from 'wagmi'

import Layout from '../components/Layout'
import ERC721 from '../abis/ERC721A.json'
import { tokenAddress } from '../lib/config'

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

const MintButton = () => {

    const { data: account } = useAccount()
    const { write: mint } = useContractWrite({
        addressOrName: tokenAddress,
        contractInterface: ERC721.abi,
    },
        'mint',
        {
            args: [account.address, 1]
        }
    )

    return (
        <>
            <div className="flex flex-col gap-2">
                <button className="btn" onClick={() => mint()}>Mint</button>
            </div>
        </>
    )
}

const ActionButton = () => {
    const { activeChain } = useNetwork()
    const { data: account } = useAccount()

    if (activeChain && activeChain.id != allowedChain.id) return (<><WrongChainButton /></>)
    if (account) return (<><MintButton /></>)
    return (<><ConnectButton /></>)
}

const useContractSupply = (address) => {
    return useContractRead({
        addressOrName: tokenAddress,
        contractInterface: ERC721Abi,
    }, 'totalSupply', {enabled: address ? true : false})
}

const useAccountBalance = (address) => {
    return useContractRead({
        addressOrName: tokenAddress,
        contractInterface: ERC721Abi,
    }, 'balanceOf', {args: address, enabled: address ? true : false})
}

const MintStatus = () => {
    const { data: account } = useAccount()
    const isConnected = account ? true : false
    const { data: totalSupply } = useContractSupply(account?.address)
    const { data: addressBalance } = useAccountBalance(account?.address)

    const tokenPrice = 0.25
    const maxSupply = 10000
    const userBalance = addressBalance?.toNumber() ?? 0
    const balance = userBalance.toString().padStart(3, '0')
    const minted = totalSupply?.toString().padStart(5, '0') ?? "xxxxx"

    return (
        <div className="flex flex-col gap-1">
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
        </div >
    )
}

const IndexPage = () => {
    return (
        <>
            <Layout title="Mint Page">
                <div className="hero h-full">
                    <div className="flex flex-col gap-2">
                        <MintStatus />
                        <ActionButton />
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default IndexPage
