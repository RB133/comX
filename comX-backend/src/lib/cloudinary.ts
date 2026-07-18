import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import { cloudinaryConfigured, env } from "../config/env";
import { HttpError } from "../utils/http";

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Uploads a local file to Cloudinary and returns its public URL.
 * The local temp file is always deleted, whether the upload succeeds or not.
 */
export async function uploadImage(localFilePath: string): Promise<string> {
  if (!cloudinaryConfigured) {
    throw new HttpError(503, "Image uploads are not configured on this server (missing Cloudinary credentials)");
  }
  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new HttpError(500, "Image upload failed");
  } finally {
    await fs.unlink(localFilePath).catch(() => {});
  }
}
