import { surpriseMePrompts } from "../constants";
import { createHash } from "crypto";
import FileSaver from "file-saver";

export function getRandomPrompt(prompt: string) {
  const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
  const randomPrompt = surpriseMePrompts[randomIndex];

  if (randomPrompt === prompt) return getRandomPrompt(prompt);

  return randomPrompt;
}

export async function downloadImage(_id: string, photo: string) {
  FileSaver.saveAs(photo, `download-${_id}.jpg`);
}

export function generateToken(address: string, prompt: string) {
  const currentTime = new Date();
  const formattedTime = currentTime.toISOString().slice(0, 16).replace("T", " ");

  const combinedString = `${formattedTime}-${prompt}-${address}-${process.env.NEXT_PUBLIC_TOKEN_SALT}`;
  const hash = createHash("sha256");
  hash.update(combinedString);
  const token = hash.digest("hex");
  return token;
}

export function verifyToken(token: string, address: string, prompt: string) {
  const expectedToken = generateToken(address, prompt);
  console.log(token, expectedToken);
  return token === expectedToken;
}
