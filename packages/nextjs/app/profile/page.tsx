"use client";

import { useState } from "react";
import { ImageDisplay } from "./_components/ImageDisplay";
import { NFTDisplay } from "./_components/NFTDisplay";
import type { NextPage } from "next";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const Profile: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [creditsToBuy, setCreditsToBuy] = useState<number>(0);
  const topUpCost = 0.00005;

  const { data: numCredits } = useScaffoldContractRead({
    contractName: "Credits",
    functionName: "creditsBalance",
    args: [connectedAddress],
    watch: true,
  });

  const { writeAsync: topUpCredits } = useScaffoldContractWrite({
    contractName: "Credits",
    functionName: "topUpCredits",
    value: parseEther((topUpCost * (creditsToBuy || 0)).toString()),
  });

  return (
    <div className="mt-10 text-center max-w-5xl mx-auto">
      {connectedAddress ? (
        <>
          <div className="p-4">
            <h2 className="text-md font-bold mb-4">Your Balance: {Number(numCredits)} credits</h2>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <label htmlFor="creditsToBuy" className="text-sm">
                Buy Credits:{" "}
              </label>
              <input
                type="number"
                id="creditsToBuy"
                value={creditsToBuy}
                onChange={e => setCreditsToBuy(parseInt(e.target.value) || 0)}
                placeholder="1"
                min="0"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              <button
                onClick={() => topUpCredits()}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              >
                Buy
              </button>
            </div>
            <div>
              <p className="text-sm">It costs: {(topUpCost * creditsToBuy).toFixed(5)} ETH</p>
            </div>
          </div>

          <div>
            <p className="mb-3 font-bold">My NFTs</p>
            <NFTDisplay connectedAddress={connectedAddress} />
            <p className="mt-5 mb-3 font-bold">My Images</p>
            <ImageDisplay connectedAddress={connectedAddress} />
          </div>
        </>
      ) : (
        <RainbowKitCustomConnectButton />
      )}
    </div>
  );
};

export default Profile;
