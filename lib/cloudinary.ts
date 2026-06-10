import { v2 as cloudinary } from "cloudinary";

let isCloudinaryConfiguredCache: boolean | null = null;

export function getValidatedCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary;
}

export function isCloudinaryConfigured(): boolean {
  if (isCloudinaryConfiguredCache !== null) {
    return isCloudinaryConfiguredCache;
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  const isConfigured = !!(
    cloudName &&
    cloudName !== "undefined" &&
    cloudName !== "null" &&
    cloudName !== "" &&
    apiKey &&
    apiKey !== "" &&
    apiSecret &&
    apiSecret !== ""
  );

  isCloudinaryConfiguredCache = isConfigured;
  return isConfigured;
}
