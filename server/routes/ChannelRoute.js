import {Router} from "express"
import { verifyToken } from "../middlewares/AuthMiddleware.js"
import { createChannel, getChannelMessages, getUsersChannel } from "../controllers/ChannelController.js"

const channelRoutes = Router()

channelRoutes.post("/createChannel",verifyToken,createChannel)
channelRoutes.get("/getUsersChannel",verifyToken,getUsersChannel)
channelRoutes.get("/getChannelMessages/:channelId",verifyToken,getChannelMessages)

export default channelRoutes;