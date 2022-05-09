import React from "react";

const MintStepBanner = ({ step }) => {
  const image = () => {
    switch (step) {
      case 0:
        return <img src="/goldlist.png" />;
      case 1:
        return <img src="/whitelist.png" />;
      default:
        return <img src="/publicsale.png" />;
    }
  };
  return (
    <div className="self-center grid place-items-center w-2/3">{image()}</div>
  );
};

export default MintStepBanner;
