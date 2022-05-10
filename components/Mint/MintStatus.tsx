import React from "react";

const MintStatus = ({ current, max }) => {
  const minted = (Number(current) + 90)
    .toString()
    .padStart(max.toString().length, "0");

  return (
    <div className="flex flex-col">
      {current >= max ? (
        <>
          <div className="text-lg self-center uppercase">Sold out</div>
        </>
      ) : (
        <>
          <div className="text-lg self-center">Minting Now</div>
        </>
      )}
      <div className="text-lg self-center">
        {minted} / {max}
      </div>
    </div>
  );
};

export default MintStatus;
