import React from "react";
import { useConnect } from "wagmi";

const WrongChainButton = ({ allowedChain }) => {
  const { activeConnector } = useConnect();

  const changeWallet = async () => {
    if ((await activeConnector.getChainId()) !== 4) {
      if (activeConnector.switchChain) {
        await activeConnector.switchChain(4);
      } else {
        throw new Error("Wrong network");
      }
    }
  };

  return (
    <button
      className="btn bg-brown border-brown text-orange hover:bg-brown hover:border-brown"
      onClick={(e) => changeWallet()}
    >
      Switch to {allowedChain.name}
    </button>
  );
};

export default WrongChainButton;
