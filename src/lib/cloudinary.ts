import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export async function uploadImage(
  file: string,
  folder: string = "wedding"
): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });
  return { url: result.secure_url, publicId: result.public_id };
}

/**
 * Upload any media type to Cloudinary.
 * resourceType: 'image' | 'video' (Cloudinary uses 'video' for audio files too)
 */
export async function uploadMedia(
  file: string,
  folder: string = "wedding",
  resourceType: "image" | "video" = "image"
): Promise<{ url: string; publicId: string }> {
  const uploadOptions: Record<string, unknown> = { folder, resource_type: resourceType };
  if (resourceType === "image") {
    uploadOptions.transformation = [{ quality: "auto", fetch_format: "auto" }];
  }
  const result = await cloudinary.uploader.upload(file, uploadOptions);
  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
