import React from "react";

const WrongChainButton = ({ allowedChain }) => {
  return (
    <button className="btn btn-warning">
      Switch to {allowedChain.name}
    </button>
  );
};

export default WrongChainButton;
