import React, { useState, useEffect } from "react";
import {
    useAccount,
    useContractRead,
    chain,
    useNetwork,
} from "wagmi";
import { tokenAddress, contractInterface, mintSteps, stepId, goldlist, whitelist } from "../../lib/config";
import { useContractMint, useContractMinted } from "../../lib/mint";

import MintStepBanner from "./MintStepBanner";
import MintController from "./MintController";
import MintStatus from "./MintStatus";

import WrongChainButton from "../Buttons/WrongChainButton";
import ConnectButton from "../Buttons/ConnectButton";
import MintButton from "../Buttons/MintButton";
import BackoffButton from "../Buttons/BackoffButton";

const allowedChain = chain.rinkeby;

const useContractSupply = (enabled?: boolean) => {
    return useContractRead(
        {
            addressOrName: tokenAddress,
            contractInterface: contractInterface,
        },
        "totalSupply",
        { chainId: allowedChain.id, enabled: enabled ?? true }
    );
};

const isValidConnection = (chain?: any, account?: any) => {
    return account?.connector ? chain?.id == allowedChain.id : false;
};

const MintModule = () => {
    const [mintAmount, setMintAmount] = useState(1);
    const [mintAllowed, setMintAllowed] = useState(true);
    const { activeChain } = useNetwork();
    const { data: account } = useAccount();
    const { data: totalSupply } = useContractSupply(
        isValidConnection(activeChain, account)
    );

    const { data: minted } = useContractMinted(account?.address);
    // const { data: addressBalance } = useAccountBalance(account?.address, isValidConnection(activeChain, account))

    // const isConnected = account ? true : false
    const stepConfig = mintSteps[stepId];
    const tokenPrice = stepConfig.price;
    const mintMin = stepConfig.min;
    const mintMax = stepConfig.max;
    const maxSupply = stepConfig.supplyLimit;

    useEffect(() => {
        if (stepId === 2) setMintAmount(10);

        if (totalSupply?.toNumber() >= maxSupply) {
            setMintAllowed(false);
        } else if (stepId == 0) {
            if (!(account?.address in goldlist)) {
                setMintAllowed(false)
            } else {
                const used = (minted?.toNumber() != 0);
                setMintAllowed(!used);
            }
        } else if (stepId == 1 && !(account?.address in whitelist)) {
            setMintAllowed(false)
        } else {
            setMintAllowed(true)
        }
    }, [totalSupply, maxSupply]);

    // const userBalance = addressBalance?.toNumber() ?? 0
    // const balance = userBalance.toString().padStart(3, '0')

    const { write: mint, isLoading } = useContractMint(
        stepId,
        account?.address,
        mintAmount,
        tokenPrice,
        whitelist[account?.address]
    );

    return (
        <div className="flex flex-col w-full align-center justify-center items-center gap-5">
            <MintStepBanner step={stepConfig.id} />
            {account?.connector && mintAllowed && (
                <>
                    <div className="text-2xl font-semibold uppercase text-center">
                        Please enter your quantity
                    </div>
                    <input
                        type="number"
                        min={mintMin || 1}
                        max={mintMax || 1}
                        value={mintAmount}
                        onChange={(e) =>
                            Number(e.target.value) > mintMax
                                ? setMintAmount(mintMax)
                                : Number(e.target.value) === 0
                                    ? setMintAmount(mintMin)
                                    : setMintAmount(Number(e.target.value))
                        }
                        className="bg-neutral w-24 text-center text-3xl py-3 rounded-lg text-black font-bold self-center"
                    />
                    <MintController
                        min={mintMin}
                        max={mintMax}
                        stepId={stepId}
                        value={mintAmount}
                        handleChange={(value: number) => setMintAmount(value)}
                    />
                    <div className="text-lg font-semibold text-center">
                        {tokenPrice} ETH for each Anim4rt + Gas Fees
                    </div>
                    <div className="text-center text-lg">
                        <div>
                        Recommended to mint many at a time (maximun {mintMax})</div><div>to economize gas fees</div>
                    </div>
                </>
            )}
            <div className="flex flex-col w-2/3 md:w-1/2 self-center gap-2">
                {activeChain && activeChain.id != allowedChain.id ? (
                    <WrongChainButton allowedChain={allowedChain} />
                ) : !account?.connector ? (
                    <ConnectButton />
                ) : mintAllowed ? (
                    <MintButton
                        isLoading={isLoading}
                        abled={mintAllowed}
                        onClick={() => mint()}
                    />
                ) : (
                    <BackoffButton stepId={stepId} minted={minted ? minted.toNumber() : 0} />
                )}
            </div>
            <MintStatus current={totalSupply ?? "---"} max={maxSupply} />
        </div>
    );
};

export default MintModule;
