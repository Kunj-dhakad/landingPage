import { imageKitEndpoint, isImageKitAsset } from "./imagekit-config";
export class ImageKitUploadError extends Error {
  constructor(message: string, public status = 502) { super(message); }
}
export async function uploadToImageKit(file: File, fileName: string) {
  const key = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!key || !imageKitEndpoint()) throw new ImageKitUploadError("ImageKit uploads need IMAGEKIT_PRIVATE_KEY and a valid IMAGEKIT_URL_ENDPOINT in .env.", 503);
  const folder = process.env.IMAGEKIT_UPLOAD_FOLDER || "/navonixx";
  if (!/^\/?[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/.test(folder)) throw new ImageKitUploadError("IMAGEKIT_UPLOAD_FOLDER must contain only folder names separated by slashes.", 503);
  const form = new FormData();
  form.set("file", file, fileName);
  form.set("fileName", fileName);
  form.set("folder", folder);
  form.set("useUniqueFileName", "true");
  let response: Response;
  try {
    response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      headers: { Authorization: `Basic ${Buffer.from(`${key}:`).toString("base64")}` },
      body: form, signal: AbortSignal.timeout(45000), redirect: "error",
    });
  } catch { throw new ImageKitUploadError("Could not connect to ImageKit. Please try again."); }
  if (!response.ok) throw new ImageKitUploadError(response.status === 401 || response.status === 403
    ? "ImageKit rejected the upload credentials. Check the private key and upload permissions."
    : "ImageKit could not complete the upload. Please try again.");
  let result: unknown;
  try { result = await response.json(); } catch { throw new ImageKitUploadError("ImageKit returned an invalid upload response."); }
  if (!result || typeof result !== "object" || !("url" in result) || typeof result.url !== "string" || !isImageKitAsset(result.url)) throw new ImageKitUploadError("Uploaded URL does not match IMAGEKIT_URL_ENDPOINT. Check your ImageKit account endpoint.");
  return { url: result.url };
}
