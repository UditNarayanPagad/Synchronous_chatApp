import { Router } from "express";
import { addProfileImage, deleteProfileImage, getUserInfo, logIn, logout, signUp, updateProfile } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";
import {storage} from "../cloudConfig.js"


const authRoutes = Router()
// const upload = multer({ dest: 'uploads/profiles/' })
const upload = multer({ storage })

authRoutes.post("/signUp",signUp)
authRoutes.post("/logIn", logIn)
authRoutes.get("/getUserInfo",verifyToken,getUserInfo)
authRoutes.post('/updateProfile',verifyToken,updateProfile)
authRoutes.post('/addProfileImage',verifyToken, upload.single('profileImage'),addProfileImage)
authRoutes.delete("/deleteProfileImage",verifyToken,deleteProfileImage)
authRoutes.post("/logout",logout)

export default authRoutes;
