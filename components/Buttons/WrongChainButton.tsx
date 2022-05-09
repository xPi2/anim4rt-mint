import React from "react";

const WrongChainButton = ({ allowedChain }) => {
  return (
    <button className="btn btn-disabled ">Switch to {allowedChain.name}</button>
  );
};

export default WrongChainButton;
