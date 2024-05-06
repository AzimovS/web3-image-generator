import React from "react";
import { Post } from "~~/types/utils";

const Card = ({ name, prompt, photo }: Post) => {
  return (
    <div className="rounded-xs group relative shadow-card hover:shadow-cardhover card">
      <img className="w-full h-auto object-cover rounded-xl" src={photo} alt={prompt} />
      <div className="group-hover:flex flex-col max-h[94.5%] hidden absolute bottom-0 left-0 right-0 bg-[#10131f] p-4 rounded-md">
        <p className="text-white text-sm overflow-y-auto prompt">{prompt}</p>

        <div className="mt-1 flex justify-between items-center gap-1">
          <div className="flex items-center">
            <p className="text-white text-[0.55rem]">{name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
