// src/utils/index.ts
import cloudinary from 'cloudinary';
import path from 'path';

// Cloudinary Configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Supported file extensions
const supportedExtensions = [
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp', '.tiff', '.pdf',
];

export const uploadFile = async (file: Express.Multer.File) => {
  try {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    // Check if file extension is supported
    if (!supportedExtensions.includes(fileExtension)) {
      throw new Error(`Unsupported file type: ${fileExtension}`);
    }

    // Upload file to Cloudinary
    const result = await cloudinary.v2.uploader.upload(file.path, {
      folder: 'mis',
      resource_type: 'auto', // Automatically detects the file type
      access_mode: 'public',
    });

    // Determine how to handle the uploaded file
    const isImage = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'tiff'].includes(result.format);
    const isPdf = result.format === 'pdf';

    let url = result.secure_url;

    // Adjust the URL for non-image files (e.g., PDFs) for direct download
    if (isPdf) {
      url = url;
    }

    return {
      message: 'File uploaded successfully',
      file: {
        name: result.public_id,
        url,
        type: result.format,
        size: result.bytes,
        ...(isImage && { width: result.width, height: result.height }),
      },
    };
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file to Cloudinary: ' + error.message);
  }
};
