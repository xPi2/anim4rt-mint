import React from "react";
import { useConnect } from "wagmi";

const WrongChainButton = ({ allowedChain }) => {
  const { activeConnector } = useConnect();
  const chainName = allowedChain.name.toLowerCase() == "ethereum" ? "mainnet" : allowedChain.name

  const changeWallet = async () => {
    if ((await activeConnector.getChainId()) !== allowedChain.id) {
      if (activeConnector.switchChain) {
        await activeConnector.switchChain(allowedChain.id);
      } else {
        throw new Error("Wrong network");
      }
    }
  };

  return (
    <button
      className="btn btn-warning"
      onClick={() => changeWallet()}
    >
      Switch to {chainName}
    </button>
  );
};

export default WrongChainButton;
