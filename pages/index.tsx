import React, { useEffect, useState } from "react";
import { mintSteps, stepId } from "../lib/config";

import MintModule from "../components/Mint/MintModule";
import MintStepBanner from "../components/Mint/MintStepBanner";
import Layout from "../components/Layout/Layout";
import Logo from "../components/Logo/Logo";
import CountDown from "../components/Count/CountDown";

const mintStartTime = mintSteps.find(step => step.id === stepId).startTime

const IndexPage = () => {
    return (
        <>
            <Layout title="Anim4rt - Mint">
                <div className="hero h-full text-white bg-hero-pattern">
                    <div className="flex flex-col align-center justify-center gap-1 w-4/5 md:w-1/3 md:max-w-screen-sm">
                        <Logo />
                        {mintStartTime > Date.now() ? (
                            <>
                                <MintStepBanner step={stepId} />
                                <CountDown endTime={mintStartTime} />
                            </>
                        ) : (
                            <MintModule />
                        )}
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default IndexPage;
