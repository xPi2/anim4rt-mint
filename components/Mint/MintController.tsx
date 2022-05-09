import React from "react";

const MintController = ({ min, max, value, handleChange, stepId }) => {
  return (
    <div className="flex flex-col w-full">
      <input
        type="range"
        min={min || 1}
        max={max || 1}
        value={value}
        onChange={(e) => handleChange(Number(e.target.value))}
        className="range range-primary "
      />
      <div
        className="w-full flex justify-between text-md px-2 mt-3"
      >
        {stepId === 2 ? (
          <>
            <span>{min}</span>
            <span>10</span>
            <span>20</span>
            <span>30</span>
            <span>40</span>
            <span>{max}</span>
          </>
        ) : (
          <>
            <span>{min}</span>
            <span>{max}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default MintController;
