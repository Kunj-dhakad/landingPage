import env from "@next/env";
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { mediaFolder } from "./media-folders.mjs";
env.loadEnvConfig(process.cwd());
const apply = process.argv.includes("--apply");
const endpoint = new URL(process.env.IMAGEKIT_URL_ENDPOINT || "https://invalid.example");
const key = process.env.IMAGEKIT_PRIVATE_KEY;
const root = (process.env.IMAGEKIT_UPLOAD_FOLDER || "/navonixx").replace(/\/+$/, "");
if (!key || endpoint.protocol !== "https:" || endpoint.hostname !== "ik.imagekit.io" || endpoint.pathname === "/" || !/^\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/.test(root)) throw Error("Configure ImageKit endpoint, private key and upload folder in .env.");
const manifestPath = "src/config/media-assets.json";
let manifest = {};
try { manifest = JSON.parse(await fs.readFile(manifestPath, "utf8")); } catch (e) { if (e.code !== "ENOENT") throw e; }
const mime = { ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".mp4": "video/mp4", ".pdf": "application/pdf" };
async function files(directory) {
  const result = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await files(file));
    else if (mime[path.extname(file)]) result.push(file);
  }
  return result;
}
for (const file of await files("public")) {
  const local = `/${path.relative("public", file).replaceAll("\\", "/")}`;
  const bytes = await fs.readFile(file);
  const hash = createHash("sha256").update(bytes).digest("hex");
  const folder = `${root}/${mediaFolder(local)}`;
  const old = manifest[local];
  if (old?.sha256 === hash && old.folder === folder && old.url.startsWith(`${endpoint.origin}${endpoint.pathname.replace(/\/+$/, "")}/`)) { console.log(`Reused ${local}`); continue; }
  if (!apply) { console.log(`${local} -> ${folder} (${bytes.length} bytes)`); continue; }
  const form = new FormData();
  form.set("file", new Blob([bytes], { type: mime[path.extname(file)] }), path.basename(file));
  form.set("fileName", path.basename(file));
  form.set("folder", folder);
  form.set("useUniqueFileName", "true");
  form.set("isPrivateFile", "false");
  const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST", headers: { Authorization: `Basic ${Buffer.from(`${key}:`).toString("base64")}` },
    body: form, redirect: "error", signal: AbortSignal.timeout(120000),
  });
  if (!response.ok) throw Error(`Upload failed for ${local}: HTTP ${response.status}. Completed uploads are recorded for resuming.`);
  const asset = await response.json();
  if (typeof asset.url !== "string" || !asset.url.startsWith(`${endpoint.origin}${endpoint.pathname.replace(/\/+$/, "")}/`) || typeof asset.fileId !== "string") throw Error(`Unexpected asset endpoint for ${local}.`);
  manifest[local] = { url: asset.url, fileId: asset.fileId, folder, size: bytes.length, sha256: hash };
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`Uploaded ${local} -> ${folder}`);
}
console.log(apply ? `Recorded ${Object.keys(manifest).length} assets in ${manifestPath}` : "Dry run. Use --apply to upload.");
