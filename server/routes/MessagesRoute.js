import { Router } from "express";
import multer from "multer";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getMessages, uploadFileToCloudinary } from "../controllers/MessagesController.js";
import { storageFile } from "../cloudConfig.js";

const messagesRoutes = Router();
const upload = multer({ storage: storageFile }); // Using Cloudinary storage

messagesRoutes.post("/getMessages", verifyToken, getMessages);
messagesRoutes.post("/upload-file", verifyToken, upload.single("file"), uploadFileToCloudinary);

export default messagesRoutes;