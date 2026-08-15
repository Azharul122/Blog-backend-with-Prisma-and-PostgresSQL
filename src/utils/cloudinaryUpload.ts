import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";
import { UploadApiResponse } from "cloudinary";

export const uploadBufferToCloudinary = (
  buffer: Buffer,
  folder: string = "posts"
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Cloudinary upload failed"));
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export const deleteFromCloudinary = async (publicId: string) => {
  await cloudinary.uploader.destroy(publicId);
};