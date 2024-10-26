import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import dotenv from "dotenv";
import path from "path"
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoute.js";
import contactRoutes from "./routes/ContactRoute.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/MessagesRoute.js";
import channelRoutes from "./routes/ChannelRoute.js";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseUrl = process.env.DATABASE_URL

// Resolve the __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.use(
    cors({
        origin: [process.env.ORIGIN],
        methods: ["GET","POST","PATCH","PUT","DELETE"],
        credentials: true,
    })
)
app.use('/uploads/profiles', express.static('uploads/profiles'));
app.use("/uploads/files", express.static('uploads/files'))
app.use(cookieParser())
app.use(express.json())
app.use("/api/auth",authRoutes)
app.use("/api/contacts",contactRoutes)
app.use("/api/messages",messagesRoutes)
app.use("/api/channel",channelRoutes)

const server = app.listen(port, ()=>{
    console.log(`Server running on http://localhost:${port}`)
})
setupSocket(server)

mongoose.connect(databaseUrl)
.then(()=>{    console.log("DB connnected succcesfully");
})
.catch(err => console.log(err.message))
