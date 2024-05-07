import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { verifyToken } from "~~/utils";

type ResponseData = {
  success: boolean;
  photo?: string | undefined;
  error?: string;
};
interface GenerateRequest extends NextApiRequest {
  body: {
    prompt: string;
    n: number;
    size: string;
    token: string;
    address: string;
  };
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
});

export default async function handler(req: GenerateRequest, res: NextApiResponse<ResponseData>) {
  const prompt = await req.body.prompt;
  const token = await req.body.token;
  const address = await req.body.address;
  if (!verifyToken(token, address, prompt)) {
    res.status(403).json({
      success: false,
      error: "You don't have access",
    });
    return;
  }

  try {
    const response = await openai.images.generate({
      prompt: prompt,
      n: 1,
      size: "256x256",
      response_format: "b64_json",
    });

    const image = response.data[0].b64_json;
    console.log(image);
    res.status(200).json({
      success: true,
      photo: image,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error: "The image could not be generated",
    });
  }
}
