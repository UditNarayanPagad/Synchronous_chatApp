import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./components/contacts-container";
import EmptyChatConatiner from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";

const Chat = () => {
  const {
    userInfo,
    selectedChatType,
    fileUploading,
    fileDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please setup profile to continue.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  return (
    <div className="flex h-[100vh] text-white overflow-hidden ">
      {fileUploading && <div className="fixed top-0 z-[1000] left-0 h-[100vh] w-[100vw] backdrop-blur-lg flex items-center justify-center ">
        <h5 className="text-5xl animate-pulse"> Uploading file </h5>
        {fileUploadProgress}%
      </div> }
      {fileDownloading && <div className="fixed top-0 z-[1000] left-0 h-[100vh] w-[100vw] backdrop-blur-lg flex items-center justify-center ">
        <h5 className="text-5xl animate-pulse"> Downloading file </h5>
        {fileDownloadProgress}%
      </div> }
      <ContactsContainer />
      {selectedChatType === undefined ? (
        <EmptyChatConatiner />
      ) : (
        <ChatContainer />
      )}
      {/* <EmptyChatConatiner/> */}
      {/* <ChatContainer/> */}
    </div>
  );
};

export default Chat;
