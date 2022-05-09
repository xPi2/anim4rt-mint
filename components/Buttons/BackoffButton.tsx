import React from "react";

const BackoffButton = ({ stepId, minted }) => {
  if (stepId < 2) {
    return (
      <a href="https://discord.com/invite/Anim4rt" target="_blank">
        <button className="btn btn-primary text-white w-full">
          Join us on discord
        </button>{" "}
      </a>
    );
  } else {
    return (
      <a
        href="https://testnets.opensea.io/assets/0x100562402e1193bd83b1b54df60e94bc53265e54/0"
        target="_blank"
      >
        <button className="btn btn-primary text-white w-full">
          Go to OpenSea{" "}
        </button>
      </a>
    );
  }
};

export default BackoffButton;
