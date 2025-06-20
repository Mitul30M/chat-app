import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage configuration to retain the original file name
export const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        return {
            folder: 'Direct Messaging',
            // Set the public_id to the original file name
            public_id: file.originalname.split('.')[0], // This will set the public_id to the original file name without the extension
            resource_type: 'auto',  // Automatically detect and allow all file types
            format: file.originalname.split('.').pop(), // This ensures the correct format is set
        };
    }
});

export default cloudinary;
