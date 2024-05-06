"use client";

import { Loader } from "~~/app/imagegen/_components/Loader";
import { pinataLink } from "~~/constants";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const SingleNFTDisplay = ({ nftId }: { nftId: number }) => {
  const { data: tokenURI } = useScaffoldContractRead({
    contractName: "NFT",
    functionName: "tokenURI",
    args: [BigInt(nftId)],
  });
  return (
    <div>
      <div>
        <img src={`${pinataLink}/${tokenURI}`} alt="NFT" className="w-full rounded-md" />
      </div>
    </div>
  );
};

export const NFTDisplay = ({ connectedAddress }: { connectedAddress: string }) => {
  const { data: userTokens, isLoading } = useScaffoldContractRead({
    contractName: "NFT",
    functionName: "getUserTokens",
    args: [connectedAddress],
  });

  if (userTokens?.length === 0)
    return <h2 className="mt-5 font-bold text-[#6469ff] text-xs uppercase">No NFTs Found</h2>;

  return (
    <div className="grid md:grid-cols-4 gap-x-4 gap-y-6 grid-cols-2">
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        userTokens?.map((nft, id) => <SingleNFTDisplay key={id} nftId={Number(nft)} />)
      )}
    </div>
  );
};
