import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessagesModel.js";
import Channel from "./models/ChannelModel.js"

const setupSocket = (server) => {
    const io = new SocketIOServer(server,{
        cors:{
            origin: process.env.ORIGIN,
            methods: ["GET","POST"],
            credentials: true,
        },
    });
    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log(`Client Disconnected: ${socket.id}`)
        for (const [userId,socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    }
    const sendMessage = async (message)=>{
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient)
        const createMessage = await Message.create(message)
        const messageData = await Message.findById(createMessage._id)
        .populate("sender","id email firstName lastName color")
        .populate("recipient","id email firstName lastName color")

        if (recipientSocketId) {
            io.to(recipientSocketId).emit("receiveMessage",messageData);
            io.to(recipientSocketId).emit("firstMessage",messageData);
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("receiveMessage",messageData);
        }
    }

    const sendChannelMessage = async(message)=>{
        const {channelId,sender,content,messageType,fileUrl,filename} = message;
        const createdMessage = await Message.create({
            sender,
            recipient: null,
            content,
            messageType,
            timeStamp: new Date(),
            fileUrl,
            filename
        })
        
        const messageData = await Message.findById(createdMessage._id)
        .populate("sender","id email firstName lastName image color")
        .exec();
        
        await Channel.findByIdAndUpdate(channelId, {
            $push:{messages: createdMessage._id},
        })

        const channel = await Channel.findById(channelId).populate("members");
        const finalData = {...messageData._doc, channelId: channel._id}
        if (channel && channel.members) {
            channel.members.forEach((member)=>{
                const memberSocketId = userSocketMap.get(member._id.toString());
                if (memberSocketId) {
                    io.to(memberSocketId).emit("receiveChannelMessage",finalData);
                    io.to(memberSocketId).emit("newChannelCreated", { channel });
                }
            })
            const adminSocketId = userSocketMap.get(channel.admin[0]._id.toString());
            if (adminSocketId) {
                io.to(adminSocketId).emit("receiveChannelMessage",finalData)
            }
        }
    }
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocketMap.set(userId,socket.id);
            console.log(`User connected: ${userId} with socketId ${socket.id}`)
        }else{
            console.log("User ID not provided during connection")
        }
        socket.on("sendChannelMessage",sendChannelMessage)
        socket.on("sendMessage",sendMessage)
        socket.on("disconnect", () => disconnect(socket))
      });
}

export default setupSocket;