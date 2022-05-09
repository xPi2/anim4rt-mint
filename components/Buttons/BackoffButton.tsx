import React from "react";

const BackoffButton = ({ stepId }) => {
  if (stepId < 2) {
    return <button className="btn btn-primary">Join us on discord</button>;
  } else {
    return <button className="btn btn-primary">Go to OpenSea</button>;
  }
};

export default BackoffButton;
