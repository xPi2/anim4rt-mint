import React from 'react'
import { AppProps } from 'next/app'
import { Provider, createClient, chain, defaultChains, Chain } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import {CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import {WalletConnectConnector} from 'wagmi/connectors/walletConnect'

import '../styles/globals.css'

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID

const chains = defaultChains
const defaultChain = chain.rinkeby

const client = createClient({
    autoConnect: true,
    connectors({ chainId }) {
        const chain = chains.find((x: Chain) => x.id === chainId) ?? defaultChain
        const rpcUrl = chain.rpcUrls.alchemy
            ? `${chain.rpcUrls.alchemy}/${alchemyId}`
            : chain.rpcUrls.default
        console.log(chain)
        console.log(rpcUrl)
        return [
            new InjectedConnector(),
            new CoinbaseWalletConnector({
                options: {
                    appName: 'mint',
                    chainId: chain.id,
                    jsonRpcUrl: rpcUrl,
                },
            }),
            new WalletConnectConnector({
                options: {
                    qrcode: true,
                    rpc: {
                        [chain.id]: rpcUrl,
                    }
                }
            })
        ]
    }
});

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Provider client={client}>
            <Component {...pageProps} />
        </Provider>
    )
}

export default MyApp;
