import { v2 as cloudinary } from 'cloudinary';

// Cloudinary can be configured with CLOUDINARY_URL or individual credentials
if (process.env.CLOUDINARY_URL) {
  // Use CLOUDINARY_URL if provided (easier)
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL
  });
} else {
  // Fall back to individual credentials
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export default cloudinary;
