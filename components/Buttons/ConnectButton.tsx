import React from "react";
import { useConnect } from "wagmi";

const ConnectButton = () => {
  const { connect, connectors } = useConnect();

  const ConnectorsModal = () => (
    <>
      <label
        htmlFor="connect-modal"
        className="modal bg-transparent backdrop-blur"
      >
        <label className="modal-box flex flex-col gap-1 z-20">
          {connectors.map((connector) => (
            <button
              className="btn"
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => connect(connector)}
            >
              {connector.name}
            </button>
          ))}
        </label>
      </label>
    </>
  );

  return (
    <>
      <label
        htmlFor="connect-modal"
        className="btn btn-primary modal-button text-white"
      >
        Connect
      </label>
      <input type="checkbox" id="connect-modal" className="modal-toggle" />
      <ConnectorsModal />
    </>
  );
};

export default ConnectButton;
