import Message from "../models/MessagesModel.js";
import {mkdirSync, renameSync} from "fs"
import cloudinary from 'cloudinary';
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});

export const getMessages = async (req, res, next) => {
    console.log("req.userId 15 ",req.userId);
    console.log("req.bodyId 16 ",req.body.id);
    try {
      const user1 = req.userId;
      const user2 = req.body.id;
      if (!user1 || !user2) {
        return res.status(400).send("Both user's ids are required");
    }    
      const messages = await Message.find({
        $or:[
            {sender: user1,recipient: user2},{sender: user2, recipient:user1}
        ]
      }).sort({timeStamp: 1});
      return res.status(200).send({messages})
    } catch (error) {
      console.log({ error });
      return res.status(500).send("Internal server error");
    }
  };

  
  export const uploadFileToCloudinary = async (req, res) => {
      try {
          if (!req.file) {
              return res.status(400).send("No file uploaded");
          }
            res.status(200).send({filePath: req.file.path,filename: req.file.originalname})
      } catch (error) {
          console.error("Error uploading file:", error);
          res.status(500).send("Internal server error");
      }
  };
  
