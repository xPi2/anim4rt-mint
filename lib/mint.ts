import { useContractRead, useContractWrite } from "wagmi";
import {WriteContractArgs} from "@wagmi/core";
import { BigNumber, ethers } from "ethers";
import { tokenAddress, contractInterface } from "./config";

export const useContractMinted = (address: string) => {
    return useContractRead(
        {
            addressOrName: tokenAddress,
            contractInterface: contractInterface,
        },
        "mintedGoldlist",
        { args: [address], enabled: address ? true : false }
    )
}

export const useContractMint = (stepId: number, address: string, amount: number, price: number, proofs: string[] = []) => {
    const config: WriteContractArgs = {
        addressOrName: tokenAddress,
        contractInterface: contractInterface,
    }
    const value = ethers.utils.parseEther(String(amount * price))
    if (stepId == 0) return useContractGoldlistMint(config, address, amount, value, proofs);
    if (stepId == 1) return useContractWhitelistMint(config, address, amount, value, proofs);
    if (stepId == 2) return useContractPublicMint(config, address, amount, value);
}

const useContractWhitelistMint = (config: WriteContractArgs, address: string, amount: number, value: BigNumber, proofs: string[]) => {
    return useContractWrite(
    config,
    "whitelistMint",
    {
        args: [address, amount, proofs],
        overrides: { value: value}
    });
}

const useContractGoldlistMint = (config: WriteContractArgs, address: string, amount: number, value: BigNumber, proofs: string[]) => {
    return useContractWrite(
    config,
    "goldlistMint",
    {
        args: [address, amount, proofs],
        overrides: { value: value}
    });
}



const useContractPublicMint = (config: WriteContractArgs, address: string, amount: number, value: BigNumber) => {
  return useContractWrite(
    config,
    "publicSaleMint",
    {
      args: [address, amount],
      overrides: { value: value },
    }
  );
};


