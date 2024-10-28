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
const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
};

app.use(cors(corsOptions));

 app.all('*', function(req, res, next) {
            res.header("Access-Control-Allow-Origin", cors.origin);
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

// Allow preflight requests
app.options("*", cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
  res.setHeader("Access-Control-Max-Age", 7200);

  next();
});
// Resolve the __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
// app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});


app.use('/uploads/profiles', express.static('uploads/profiles'));
app.use("/uploads/files", express.static('uploads/files'))
app.use(cookieParser())
app.use(express.json())
app.use("/api/auth",authRoutes)
app.use("/api/contacts",contactRoutes)
app.use("/api/messages",messagesRoutes)
app.use("/api/channel",channelRoutes)

const server = app.listen(port, () => {
    const baseUrl = process.env.NODE_ENV === 'production' 
        ? `https://synchronous-chatapp.onrender.com` 
        : `http://localhost:${port}`;
    
    console.log(`Server running on ${baseUrl}`);
});
setupSocket(server)

mongoose.connect(databaseUrl)
.then(()=>{    console.log("DB connnected succcesfully");
})
.catch(err => console.log(err.message))
