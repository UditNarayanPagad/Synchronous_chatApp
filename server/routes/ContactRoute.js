import {Router} from "express"
import { verifyToken } from "../middlewares/AuthMiddleware.js"
import { getAllContacts, getContactsForDM, searchContacts } from "../controllers/ContactController.js"

const contactRoutes = Router()
contactRoutes.post("/search",verifyToken,searchContacts)
contactRoutes.get("/getContactsForDM",verifyToken,getContactsForDM)
contactRoutes.get("/getAllContacts",verifyToken,getAllContacts)

export default contactRoutes;