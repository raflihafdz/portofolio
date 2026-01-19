import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
// CLOUDINARY_URL format: cloudinary://api_key:api_secret@cloud_name
if (process.env.CLOUDINARY_URL) {
  // Parse CLOUDINARY_URL
  const url = new URL(process.env.CLOUDINARY_URL);
  cloudinary.config({
    cloud_name: url.hostname,
    api_key: url.username,
    api_secret: url.password,
  });
} else if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  // Fall back to individual credentials
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export default cloudinary;
