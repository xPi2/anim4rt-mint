import React from "react";

const WrongChainButton = ({ allowedChain }) => {
  return (
    <button className="btn bg-brown border-brown text-orange">
      Switch to {allowedChain.name}
    </button>
  );
};

export default WrongChainButton;
