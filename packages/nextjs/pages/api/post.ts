import { NextResponse } from "next/server";
import Post from "../../models/Post";
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
  if (req.method === "GET") {
    try {
      const posts = await Post.find({});
      console.log(posts);
      //   return NextResponse.json({ posts }, { status: 200 });
      res.status(200).json(posts);
    } catch (error) {
      return NextResponse.json({ message: "Error", error }, { status: 500 });
    }
  } else {
    try {
      const { name, prompt, photo } = req.body;
      const photoUrl = await cloudinary.uploader.upload(photo);

      const newPost = await Post.create({
        name,
        prompt,
        photo: photoUrl.url,
      });

      res.status(200).json(newPost);
    } catch (error) {
      res.status(500).json({
        error: "The image could not be generated",
      });
    }
  }
}
