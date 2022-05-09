import React, { useState, useEffect } from "react";
import {
  useAccount,
  useConnect,
  useContractWrite,
  useContractRead,
  chain,
  useNetwork,
} from "wagmi";
import { tokenAddress, mintStartTime, mintSteps } from "../../lib/config";
import { ethers } from "ethers";
import ERC721 from "../../abis/ERC721A.json";

import MintStepBanner from "./MintStepBanner";
import MintController from "./MintController";
import MintStatus from "./MintStatus";

import WrongChainButton from "../Buttons/WrongChainButton";
import ConnectButton from "../Buttons/ConnectButton";
import MintButton from "../Buttons/MintButton";
import BackoffButton from "../Buttons/BackoffButton";

const ERC721Abi = ERC721.abi;
const allowedChain = chain.rinkeby;

const useContractSupply = (enabled?: boolean) => {
  return useContractRead(
    {
      addressOrName: tokenAddress,
      contractInterface: ERC721Abi,
    },
    "totalSupply",
    { chainId: allowedChain.id, enabled: enabled ?? true }
  );
};

const isValidConnection = (chain?: any, account?: any) => {
  return account?.connector ? chain?.id == allowedChain.id : false;
};

const useContractMint = (address: string, amount: number, price: number) => {
  return useContractWrite(
    {
      addressOrName: tokenAddress,
      contractInterface: ERC721.abi,
    },
    "mint",
    {
      args: [address, amount],
      overrides: { value: ethers.utils.parseEther(String(amount * price)) },
    }
  );
};

const MintModule = () => {
  const [mintAmount, setMintAmount] = useState(1);
  const [mintAllowed, setMintAllowed] = useState(true);
  const { activeChain } = useNetwork();
  const { data: account } = useAccount();
  const { data: totalSupply } = useContractSupply(
    isValidConnection(activeChain, account)
  );

  // const { data: addressBalance } = useAccountBalance(account?.address, isValidConnection(activeChain, account))

  // const isConnected = account ? true : false
  const stepId = 0;
  const stepConfig = mintSteps[stepId];
  const tokenPrice = stepConfig.price;
  const mintMin = stepConfig.min;
  const mintMax = stepConfig.max;
  const maxSupply = stepConfig.supplyLimit;

  useEffect(() => {
    setMintAllowed(totalSupply?.toNumber() < maxSupply);
  }, [totalSupply, maxSupply]);

  // const userBalance = addressBalance?.toNumber() ?? 0
  // const balance = userBalance.toString().padStart(3, '0')

  const { write: mint, isLoading } = useContractMint(
    account?.address,
    mintAmount,
    tokenPrice
  );

  return (
    <div className="flex flex-col w-full align-center justify-center items-center gap-5">
      <MintStepBanner step={stepConfig.id} />
      {account?.connector && mintAllowed && (
        <>
          <div className="text-2xl font-semibold uppercase text-center">
            Please enter your quantity
          </div>
          <div className="bg-neutral w-24 text-center text-3xl py-3 rounded-lg text-black font-bold self-center">
            {mintAmount}
          </div>
          <MintController
            min={mintMin}
            max={mintMax}
            value={mintAmount}
            handleChange={(value: number) => setMintAmount(value)}
          />
          <div className="text-lg font-semibold text-center">
            {tokenPrice} Ξ for each Anim4rt + Gas Fees
          </div>
        </>
      )}

      <div className="flex flex-col w-2/3 md:w-1/2 self-center">
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
          <BackoffButton stepId={stepId} />
        )}
      </div>
      <MintStatus current={totalSupply ?? "---"} max={maxSupply} />
    </div>
  );
};

export default MintModule;
