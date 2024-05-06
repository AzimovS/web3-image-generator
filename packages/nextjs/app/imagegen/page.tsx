"use client";

import React, { useState } from "react";
import preview from "../../public/preview.png";
import { getRandomPrompt } from "../../utils";
import { Loader } from "./_components/Loader";
import { useAccount } from "wagmi";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const ImageGen = () => {
  const { address: connectedAddress } = useAccount();
  const [form, setForm] = useState({
    name: connectedAddress,
    prompt: "",
    photo: "",
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    write: withdrawCredit,
    isSuccess: isSuccessWithdraw,
    isError: isErrorWithdraw,
  } = useScaffoldContractWrite({
    contractName: "Credits",
    functionName: "withdrawCredit",
  });

  const generateImage = async () => {
    if (form.prompt) {
      withdrawCredit();
      console.log(isSuccessWithdraw, isErrorWithdraw);
      if (!isErrorWithdraw && !isSuccessWithdraw) {
        notification.error("Please try one more time.");
        return;
      } else if (isErrorWithdraw) {
        notification.error("You don't have enough credits. Please buy credits in the profile section.");
        return;
      }

      // post our prompt to our backend
      try {
        setGeneratingImg(true);
        const response = await fetch("/api/openai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: form.prompt,
          }),
        });

        const data = await response.json();
        console.log(data);
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
      } catch (err) {
        alert(err);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert("Please provide proper prompt");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.prompt && form.photo) {
      setLoading(true);

      try {
        const response = await fetch("/api/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
        await response.json();
        notification.success("Image was saved. You can check in your profile.");
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please enter a prompt and generate an image");
    }
  };

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="text-center">
          <span className="mt-10 block text-4xl font-bold">Generate an Image</span>
        </h1>
      </div>

      <form className="mt-5 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <div className="flex w-[32rem] items-center gap-2 mb-2">
            <textarea
              className="border-primary bg-base-100 text-base-content p-2 mt-5 mr-2 w-full md:w-2/3 lg:w-2/3 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-accent"
              value={form.prompt}
              placeholder="Provide the prompt or generate"
              onChange={e => setForm({ ...form, prompt: e.target.value })}
            />
            <button type="button" onClick={handleSurpriseMe} className="btn btn-secondary btn-sm">
              Surprise me
            </button>
          </div>
          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
            {form.photo ? (
              <img src={form.photo} alt={form.prompt} className="w-full h-full object-contains" />
            ) : (
              <img src={preview.src} alt="preview" className="w-9/12 h-9/12 object-containt opacity-40" />
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? "Generating..." : "Generate Image"}
          </button>
        </div>

        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">
            Please save an image to not loose it.
            <br />
            Once you have saved the image, you can check it in profile section.
          </p>
          <button
            type="submit"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ImageGen;
