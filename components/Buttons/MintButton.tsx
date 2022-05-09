import React from "react";

const MintButton = ({ isLoading, abled, onClick }) => {
  const baseStyle = "btn btn-primary";
  let style = isLoading ? [baseStyle, "loading"].join(" ") : baseStyle;
  style = !abled ? [baseStyle, "btn-disabled"].join(" ") : style;
  return (
    <div className={style} onClick={() => onClick()}>
      Mint
    </div>
  );
};

export default MintButton;
