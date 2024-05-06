import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(request: NextApiRequest, res: NextApiResponse) {
  try {
    const { prompt, photo } = JSON.parse(request.body);

    const data = new FormData();
    const blob = await fetch(photo).then(res => res.blob());
    data.append("file", blob, prompt);
    data.append("pinadataMetadata", `{"prompt": "${prompt}"}`);

    const result = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: data,
    });
    const { IpfsHash } = await result.json();
    console.log(IpfsHash);

    res.status(200).json({
      success: true,
      IpfsHash: IpfsHash,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: e });
  }
}
