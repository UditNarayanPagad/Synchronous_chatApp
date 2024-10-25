import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTE, GET_CHANNEL_MESSAGES, HOST } from "@/utils/constants";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { MdOutlineFilePresent } from "react-icons/md";
import { MdOutlineFileDownload } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from "@/lib/utils";

const MessageContainer = () => {
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const scrollRef = useRef();
  const {
    selectedChatData,
    selectedChatType,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
    setFileDownloading,
    setFileDownloadProgress,
  } = useAppStore();
  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log({ error });
      }
    };
    const getChannelMessages = async ()=>{
      try {
        const response = await apiClient.get(
          `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log({error})
      }
    }
    if (selectedChatData._id) {
      if (selectedChatType === "contact") {
        getMessages();
      }
      else if(selectedChatType === "channel"){
        getChannelMessages()
      }
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const downloadFile = async (url) => {
    try {
      setFileDownloading(true);
      setFileDownloadProgress(0);
  
      const response = await apiClient.get(url, {
        responseType: "blob", // Keep it as blob for files
        onDownloadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentCompleted = Math.round((loaded * 100) / total);
          setFileDownloadProgress(percentCompleted);
        },
      });
  
      // Extract the filename from the Cloudinary URL (last segment)
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1].split('?')[0]; // Remove query params if any
  
      // Create blob URL for file download
      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", fileName || "file"); // Set extracted filename or fallback
      document.body.appendChild(link);
      link.click();
  
      // Cleanup after download
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
  
      setFileDownloading(false);
      setFileDownloadProgress(0);
    } catch (error) {
      console.error("Download error: ", error);
      setFileDownloading(false);
    }
  };
  
  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timeStamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-400 my-2 text-sm font-semibold ">
              {moment(message.timeStamp).isSame(Date.now(), "day")
                ? "Today"
                : moment(message.timeStamp).isSame(
                    moment().subtract(1, "days"),
                    "day"
                  )
                ? "Yesterday"
                : moment(message.timeStamp).format("DD/MM/YYYY")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };
  const renderDMMessages = (message) => (
    <div
      className={`${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      }`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-blue-600 text-white border-blue-500 rounded-l-xl rounded-tr-xl text-start"
              : "bg-green-600 text-white border-green-500 rounded-r-xl rounded-bl-xl text-start"
          } border inline-block px-3 py-1 my-1 max-w-[50%] break-words `}
        >
          {message.content}
        </div>
      )}
      {message.messageType === "file" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-blue-600 text-white border-blue-500 rounded-xl text-start "
              : "bg-green-600 text-white border-green-500 rounded-xl text-start"
          } border inline-block p-1 my-1 max-w-[50%] break-words `}
        >
          {checkIfImage(message.fileUrl) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setShowImage(true);
                setImageUrl(message.fileUrl);
              }}
            >
              <img
                src={`${message.fileUrl}`}
                alt="image"
                height={300}
                width={300}
                className="rounded-xl"
              />
            </div>
          ) : (
            <div className="flex justify-center items-center gap-2 p-4">
              <span className="text-white/80 text-3xl rounded-full ">
                <MdOutlineFilePresent className="text-white bg-black p-1 rounded h-7 w-7 md:w-10 md:h-10 " />
              </span>
              <span className="text-sm md:text-base max-w-[80%] ">{message.filename}</span>
              <span>
                <MdOutlineFileDownload
                  className="cursor-pointer bg-purple-200 text-black p-1 h-7 w-7 md:w-10 md:h-10 rounded-full transition-all duration-300 hover:bg-purple-300"
                  onClick={() => downloadFile(message.fileUrl)}
                />
              </span>
            </div>
          )}
        </div>
      )}
      <div className="text-xs text-gray-400">
        {moment(message.timeStamp).format("LT")}
      </div>
    </div>
  );
  const renderChannelMessages = (message) => {
    return (
      <div
        className={`mt-5 flex gap-2 relative ${
          message.sender._id === userInfo.id ? "justify-end" : " justify-start"
        } `}
      >
        {message.sender._id !== userInfo.id && (
          <Avatar className="h-8 w-8 rounded-full overflow-hidden bg-blue-200/50">
            {message.sender.image  && message.image?.path ? (
              <AvatarImage
                src={`${message.sender.image.path}`}
                alt="profile"
                className="w-8 h-8 object-cover"
              />
            ) : (
              <div
                className={`h-8 w-8 uppercase text-xl flex justify-center items-center rounded-full ${getColor(
                  message.sender.color
                )}`}
              >
                {message.sender.firstName
                  ? message.sender.firstName.split("").shift()
                  : message.sender.email.split("").shift()}
              </div>
            )}
          </Avatar>
        )}
        {message.messageType === "text" && (
          <>
            <div
              className={`${
                message.sender._id === userInfo.id
                  ? "bg-blue-600 text-white border-blue-500 rounded-l-xl rounded-tr-xl text-start "
                  : "bg-green-600 text-white border-green-500 rounded-r-xl rounded-bl-xl text-start "
              } border inline-block px-3 py-1 my-1 max-w-[50%] break-words mb-5 `}
            >
              {message.sender._id !== userInfo.id && (
                <p
                  className={`text-xs font-bold ${getColor(
                    message.sender.color
                  )} border-none bg-transparent capitalize`}
                >
                  {message.sender.firstName} {message.sender.lastName}
                </p>
              )}
              {message.content}
            </div>
            {message.sender._id !== userInfo.id ? (
              <div className="text-xs text-gray-400 absolute bottom-0 left-12">
                {moment(message.timeStamp).format("LT")}
              </div>
            ) : (
              <div className="text-xs text-gray-400 absolute bottom-0 ">
                {moment(message.timeStamp).format("LT")}
              </div>
            )}
          </>
        )}

        {message.messageType === "file" && (
        <>
        <div
          className={`${
            message.sender._id === userInfo.id
              ? "bg-blue-600 text-white border-blue-500 rounded-xl text-start "
              : "bg-green-600 text-white border-green-500 rounded-xl text-start"
          } border inline-block p-1 my-1 max-w-[70%] break-words mb-5 `}
        >
          {message.sender._id !== userInfo.id && (
                <p
                  className={`text-xs font-bold mb-1 ml-1 ${getColor(
                    message.sender.color
                  )} border-none bg-transparent capitalize`}
                >
                  {message.sender.firstName} {message.sender.lastName}
                </p>
              )}
          {checkIfImage(message.fileUrl) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setShowImage(true);
                setImageUrl(message.fileUrl);
              }}
            >
              <img
                src={`${message.fileUrl}`}
                alt="image"
                height={300}
                width={300}
                className="rounded-xl"
              />
            </div>
          ) : (
            <div className="flex justify-center items-center gap-2 p-4 ">
              <span className="text-white/80 text-3xl rounded-full ">
                <MdOutlineFilePresent className="text-white bg-black p-1 rounded h-7 w-7 md:w-10 md:h-10 " />
              </span>
              <p className="text-sm md:text-base max-w-[80%]">{message.filename}</p>
              <span>
                <MdOutlineFileDownload
                  className=" cursor-pointer bg-purple-200 text-black p-1 h-7 w-7 md:w-10 md:h-10 rounded-full transition-all duration-300 hover:bg-purple-300"
                  onClick={() => downloadFile(message.fileUrl)}
                />
              </span>
            </div>
          )}
        </div>
        {message.sender._id !== userInfo.id ? (
              <div className="text-xs text-gray-400 absolute bottom-0 left-12">
                {moment(message.timeStamp).format("LT")}
              </div>
            ) : (
              <div className="text-xs text-gray-400 absolute bottom-0 ">
                {moment(message.timeStamp).format("LT")}
              </div>
            )}
        </>
      )}
      </div>
    );
  };
  return (
    <div
      className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-600"
    >
      {renderMessages()}
      <div ref={scrollRef} />
      {showImage && (
        <div className="fixed top-0 z-[1000] left-0 h-[100vh] w-[100vw] backdrop-blur-lg flex items-center justify-center ">
          <div>
            <img
              src={`${imageUrl}`}
              alt="image"
              className="w-full h-[80vh] bg-cover "
            />
          </div>
          <div className="flex gap-5 top-0 fixed mt-5">
            <button>
              <MdOutlineFileDownload
                className=" cursor-pointer bg-purple-200 text-black p-1 h-10 w-10 rounded-full transition-all duration-300 hover:bg-purple-300"
                onClick={() => downloadFile(imageUrl)}
              />
            </button>
            <button>
              <IoClose
                className=" cursor-pointer bg-purple-200 text-black p-1 h-10 w-10 rounded-full transition-all duration-300 hover:bg-purple-300"
                onClick={() => {
                  setImageUrl(null);
                  setShowImage(false);
                }}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
