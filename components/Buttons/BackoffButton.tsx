import React from "react";

const BackoffButton = ({ stepId }) => {
  if (stepId < 2) {
    return <button className="btn btn-primary text-white">Join us on discord</button>;
  } else {
    return <button className="btn btn-primary text-white">Go to OpenSea</button>;
  }
};

export default BackoffButton;
