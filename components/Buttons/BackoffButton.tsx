import React from "react";

const BackoffButton = ({ stepId, minted }) => {
    return (<>
        {(minted > 0) && (
        <div className="flex flex-row gap-1 w-full justify-center">
        <div className="shrink-0">You already have</div><div className="shrink-0">your Anim4rt!</div>
        </div>)
        }
        <div className="text-center">
            {(stepId < 2) ? (
                <div className="flex flex-row gap-1 w-full justify-center">
                <div className="shrink-0">Wait for the next sale</div><div className="shrink-0">to mint more</div>
                </div>
                ) : (
                <div>No more Anim4rts to mint</div>
            )}
        </div>
        <a href="https://discord.com/invite/Anim4rt" target="_blank">
            <button className="btn btn-primary text-white mt-3 w-full">Join us on discord</button>
        </a>
        <a
            href="https://opensea.io/collection/anim4rt"
            target="_blank"
        >
            <button className="btn btn-primary text-white w-full">Go to OpenSea</button>
        </a>
    </>)
};

export default BackoffButton;
