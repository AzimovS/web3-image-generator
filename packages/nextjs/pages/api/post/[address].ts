import { NextResponse } from "next/server";
import Post from "../../../models/Post";
import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";
import { Post as PostType } from "~~/types/utils";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type ResponseData = {
  name?: string;
  prompt?: string;
  photo?: string;
  error?: string | undefined;
};
interface GenerateRequest extends NextApiRequest {
  body: {
    prompt: string;
    name: string;
    photo: string;
  };
}

export default async function handler(req: GenerateRequest, res: NextApiResponse<ResponseData | PostType[]>) {
  const { address } = req.query;
  if (req.method === "GET") {
    try {
      const posts = await Post.find({ name: address });
      res.status(200).json(posts);
    } catch (error) {
      return NextResponse.json({ message: "Error", error }, { status: 500 });
    }
  }
}
