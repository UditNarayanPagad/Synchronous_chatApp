import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();
// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, // Your Cloudinary cloud name
  api_key: process.env.CLOUD_KEY, // Your Cloudinary API key
  api_secret: process.env.CLOUD_SECRET, // Your Cloudinary API secret
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2, //todo added .v2 then it will work properly
  params: {
    folder: "chatapp", // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "svg", "webp"], // format property
  },
});

const storageFile = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "chatapp",
    use_filename: true,
    overwrite: false,
    allowed_formats: ["jpg", "jpeg", "png", "svg", "webp","pdf", "docx", "txt"], // Add allowed formats here
  },
});

const deleteImage = async (filename) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(filename);
    console.log("Deleted Image Result:", result);
    return result;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

export { cloudinary, storage, deleteImage, storageFile };
