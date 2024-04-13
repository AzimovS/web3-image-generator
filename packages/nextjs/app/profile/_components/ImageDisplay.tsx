"use client";

import { useEffect, useState } from "react";
import download from "../../../public/download.png";
import { Loader } from "~~/app/imagegen/_components/Loader";
import { Post } from "~~/types/utils";
import { downloadImage } from "~~/utils";

const SingleImageDisplay = ({ prompt, photo }: Post) => {
  return (
    <div className="rounded-xs group relative shadow-card hover:shadow-cardhover card">
      <img className="w-full h-auto object-cover rounded-xl" src={photo} alt={prompt} />
      <div className="group-hover:flex flex-col max-h[94.5%] hidden absolute bottom-0 left-0 right-0 bg-[#10131f] p-4 rounded-md">
        <p className="text-white text-sm overflow-y-auto prompt">{prompt}</p>

        <div className="mt-1 flex justify-between items-center gap-1">
          <button
            type="button"
            onClick={() => downloadImage(prompt, photo)}
            className="outline-none bg-transparent border-none"
          >
            <img src={download.src} alt="download" className="w-6 h-6 object-contain invert" />
          </button>
        </div>
      </div>
    </div>
  );
};

const RenderCards = ({ data, title }: { data: Post[]; title: string }) => {
  if (data?.length > 0) return data.map(post => <SingleImageDisplay key={post._id} {...post} />);

  return <h2 className="mt-5 font-bold text-[#6469ff] text-xs uppercase">{title}</h2>;
};

export const ImageDisplay = ({ connectedAddress }: { connectedAddress: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/post/${connectedAddress}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const result = await response.json();
          setAllPosts(result.reverse());
        }
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  //   if (nfts.length === 0) return <p>{`You don't have any NFTs yet.`}</p>;
  return (
    <div className="grid md:grid-cols-4 gap-x-4 gap-y-6 grid-cols-2">
      {/* {nfts?.map((nft, id) => (
        <SingleNFTDisplay
          nftId={Number(nft)}
          refetchUserTokens={refetchUserTokens}
          key={id}
          nftContract={nftContract}
          tokenContract={tokenContract}
        />
      ))} */}
      {loading ? (
        <div className="flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <RenderCards data={allPosts} title="No posts found" />
      )}
    </div>
  );
};
