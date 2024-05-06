"use client";

import { useEffect, useState } from "react";
import download from "../../../public/download.png";
import { Loader } from "~~/app/imagegen/_components/Loader";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { Post } from "~~/types/utils";
import { downloadImage } from "~~/utils";
import { notification } from "~~/utils/scaffold-eth";

interface DialogProps {
  description: string;
  imageUrl: string;
  onClose: (stateChange: boolean) => void;
  onMint: () => void;
  mintDisabled: boolean;
}

const Dialog: React.FC<DialogProps> = ({ description, imageUrl, onClose, onMint, mintDisabled }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 p-8 rounded-lg flex">
        <div className="w-1/2 pr-4">
          <img src={imageUrl} alt="Preview" className="w-full rounded-lg" />
        </div>
        <div className="w-1/2 flex flex-col justify-between">
          <div>
            <h2 className="text-lg mt-40">Description</h2>
            <p className="text-md">{description}</p>
          </div>
          <div className="flex justify-center mt-4">
            <button onClick={() => onClose(false)} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4">
              Back
            </button>
            <button
              onClick={() => onMint()}
              className="bg-green-600 text-white px-4 py-2 rounded-md"
              disabled={mintDisabled}
            >
              {mintDisabled ? "Minting..." : "Mint"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SingleImageDisplay = ({ prompt, photo }: Post) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [cid, setCid] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const { write: mintItem } = useScaffoldContractWrite({
    contractName: "NFT",
    functionName: "awardItem",
    args: [cid!],
  });

  const handleIsShowDialog = (change: boolean) => {
    setDialogOpen(change);
  };

  const uploadFile = async () => {
    try {
      setUploading(true);
      const res = await fetch("/api/files", {
        method: "POST",
        body: JSON.stringify({ prompt, photo }),
      });
      const resData = await res.json();
      await setCid(resData.IpfsHash);
      if (cid) {
        mintItem();
        handleIsShowDialog(false);
      } else {
        console.log(cid);
        notification.warning("Something went wrong. Please try again.");
      }
    } catch (e) {
      console.log(e);
      notification.error("Trouble uploading file");
    } finally {
      setUploading(false);
    }
  };

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
          <button
            type="button"
            onClick={() => handleIsShowDialog(true)}
            className="outline-none bg-gray-600 rounded-md p-1 text-xs"
          >
            Mint as NFT
          </button>
          {dialogOpen && (
            <Dialog
              description={prompt}
              imageUrl={photo}
              onClose={handleIsShowDialog}
              onMint={uploadFile}
              mintDisabled={uploading}
            />
          )}
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
  return (
    <div className="grid md:grid-cols-4 gap-x-4 gap-y-6 grid-cols-2">
      {loading ? (
        <div className="flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <RenderCards data={allPosts} title="No images found" />
      )}
    </div>
  );
};
