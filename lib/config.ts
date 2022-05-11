import ArtERC721A from "../abis/ArtERC721A.json";
import goldTree from "../public/gold-claims.json";
import whiteTree from "../public/white-claims.json";

type MintStep = {
  id: number;
  name: string;
  startTime: number;
  price: number;
  min: number;
  max: number;
  supplyLimit: number;
};

const steps: MintStep[] = [
  {
    id: 0,
    name: "Goldlist Sale",
    startTime: 1653235200000,
    price: 0.26,
    min: 1,
    max: 2,
    supplyLimit: 500,
  },
  {
    id: 1,
    name: "Whitelist Sale",
    startTime: 1653580800000,
    price: 0.28,
    min: 1,
    max: 2,
    supplyLimit: 2000,
  },
  {
    id: 2,
    name: "Public Sale",
    startTime: 1653840000000,
    price: 0.3,
    min: 1,
    max: 50,
    supplyLimit: 10000,
  },
];

const config = {
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID || 1),
  tokenAddress: process.env.NEXT_PUBLIC_TOKEN_ADDRESS,
  contractInterface: ArtERC721A.abi,
  mintStartTime: Number(process.env.NEXT_PUBLIC_MINT_START_TIME || 0),
  mintSteps: steps,
  stepId: Number(process.env.NEXT_PUBLIC_STEP_ID || 0),
  goldlist: goldTree.claims,
  whitelist: whiteTree.claims,
};

console.log(config);

export const {
  chainId,
  tokenAddress,
  contractInterface,
  mintStartTime,
  mintSteps,
  stepId,
  goldlist,
  whitelist,
} = config;
