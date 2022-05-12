import React from 'react'
import { AppProps } from 'next/app'
import { Provider, createClient, defaultChains, Chain } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import {CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import {WalletConnectConnector} from 'wagmi/connectors/walletConnect'

import '../styles/globals.css'
import { providers } from 'ethers'

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID

const chains = defaultChains
const defaultChain = chains.find((x: Chain) => x.id === Number(process.env.NEXT_PUBLIC_CHAIN_ID || 1))

const client = createClient({
    autoConnect: true,
    provider(config) {
        return new providers.AlchemyProvider(config.chainId, alchemyId)
    },
    connectors({ chainId }) {
        const chain = chains.find((x: Chain) => x.id === chainId) ?? defaultChain
        const rpcUrl = chain.rpcUrls.alchemy
            ? `${chain.rpcUrls.alchemy}/${alchemyId}`
            : chain.rpcUrls.default
        return [
            new InjectedConnector({
                chains: [chain]
            }),
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
