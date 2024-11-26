import { Request, Response, NextFunction } from "express";
import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Middleware for uploading image to Cloudinary
export const upload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const streamUpload = (req: Request): Promise<any> => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });

      streamifier.createReadStream(req.file?.buffer).pipe(stream);
    });
  };

  const uploadAsync = async (req: Request): Promise<void> => {
    try {
      const result = await streamUpload(req);
      if (result) {
        req.body[req.file!.fieldname] = result.secure_url;
      }
    } catch (error) {
      console.error(error);
    }
  };

  uploadAsync(req).then(() => {
    next();
  });
};
