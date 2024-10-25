import React, { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { MdEmojiEmotions } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "@/store";
import { useSocket } from "@/context/SocketContext";
import { FolderMinus } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";

const MessageBar = () => {
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const {selectedChatType,selectedChatData,userInfo, setFileUploading, setFileUploadProgress, getContacts} = useAppStore();
  const socket = useSocket();
  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };
  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside
    );
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);
  const handleSendMessage = async () => {
    if (selectedChatType === "contact") {
      getContacts();
      socket.emit("sendMessage",{
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      })
    }
    else if(selectedChatType === "channel"){
      socket.emit("sendChannelMessage",{
        sender: userInfo.id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChatData._id,
      })
    }
    setMessage("")
  };
  const handleAttachmentClick = ()=>{
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }
  const handleAttachmentChange = async (event)=>{
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData()
        formData.append("file",file)
        setFileUploading(true)
        const response = await apiClient.post(UPLOAD_FILE_ROUTE,formData,
          {withCredentials: true,
            onUploadProgress: data=>{
              setFileUploadProgress(Math.round((100*data.loaded / data.total)))
            }
          })
        if (response.status === 200 && response.data) {
          setFileUploading(false)
          if (selectedChatType === "contact") {
            socket.emit("sendMessage",{
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
              filename: response.data.filename,
            })
          }
          else if(selectedChatType === "channel"){
            socket.emit("sendChannelMessage",{
              sender: userInfo.id,
              content: undefined,
              messageType: "file",
              fileUrl: response.data.filePath,
              filename: response.data.filename,
              channelId: selectedChatData._id,
            })
          }
        }
      }
    } catch (error) {
      setFileUploading(false)
      console.log({error})
    }
  }
  return (
    <div className="h-[10vh] px-8 gap-2 mb-3 flex justify-center items-center bg-[#262626] ">
      <div className="flex-1 flex items-center gap-4 rounded-full bg-[#3e3e3e] px-2 ">
        <input
          type="text"
          className="flex-1 bg-transparent p-1.5 rounded-lg focus:outline-none focus:border-none lato-regular "
          placeholder="Type Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="text-neutral-400 focus:outline-none focus:border-none focus:text-white transition-all duration-300" onClick={handleAttachmentClick }>
          <GrAttachment className="text-lg" />
        </button>
        <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachmentChange} />
        <div className="relative flex items-center">
          <button
            className="text-neutral-400 focus:outline-none focus:border-none focus:text-white transition-all duration-300 text-center"
            onClick={() => setEmojiPickerOpen(true)}
          >
            <MdEmojiEmotions className="text-xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        className="text-white bg-[#7f22d5] hover:bg-[#9142dc] focus:bg-[#600fab] p-2 rounded-full focus:outline-none focus:border-none focus:text-white transition-all duration-200 text-center"
        onClick={handleSendMessage}
      >
        <IoSend className="text-xl" />
      </button>
    </div>
  );
};

export default MessageBar;
