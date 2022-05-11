import React from "react";

const MintStatus = ({ current, max }) => {
  const minted = current ? current.toString().padStart(max.toString().length, "0") : "".padStart(max.toString().length, "-");

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
      {Number(current) > max / 2 && (
      <div className="text-lg self-center">
        {minted} / {max}
      </div>
      )}
    </div>
  );
};

export default MintStatus;
