import React from "react";

const MintButton = ({ isLoading, abled, onClick }) => {
  const baseStyle = "btn btn-primary text-white";
  let style = isLoading ? [baseStyle, "loading"].join(" ") : baseStyle;
  style = !abled ? [baseStyle, "btn-disabled"].join(" ") : style;
  return (
    <div className={style} onClick={() => onClick()}>
      Mint now
    </div>
  );
};

export default MintButton;
