import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { RiCloseFill } from "react-icons/ri";

const ChatHeader = () => {
  const { closeChat, selectedChatType, selectedChatData } = useAppStore();
  return (
    <div className="h-[10vh] border-b-[1px] px-10 flex justify-center items-center border-[#606060] ">
      <div className="flex gap-5 items-center justify-between w-full">
        {selectedChatType === "contact" ? 
          <div className="flex gap-3 items-center justify-center">
          <Avatar className="h-10 w-10 rounded-full overflow-hidden bg-blue-200/50">
            {selectedChatData.image  && selectedChatData.image.path? (
              <AvatarImage
                src={`${selectedChatData.image.path}`}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`h-10 w-10 uppercase text-xl flex justify-center items-center rounded-full ${getColor(
                  selectedChatData.color
                )}`}
              >
                {selectedChatData.firstName
                  ? selectedChatData.firstName.split("").shift()
                  : selectedChatData.email.split("").shift()}
              </div>
            )}
          </Avatar>
          <div className="flex flex-col justify-center">
            {selectedChatData.firstName &&
              selectedChatData.lastName &&
              `${selectedChatData.firstName} ${selectedChatData.lastName}`}
            <span className="text-xs text-zinc-300">
              {selectedChatData.email}
            </span>{" "}
          </div>
        </div>
         : <div className="flex gap-3 items-center justify-center">
        <Avatar className="h-10 w-10 rounded-full overflow-hidden bg-blue-200/50">
          {selectedChatData
            && (
            <div
              className={`h-10 w-10 uppercase text-xl flex justify-center items-center rounded-full ${getColor( 1
              )}`}
            >
              {selectedChatData.name && selectedChatData.name.split("").shift()}
            </div>
          )}
        </Avatar>
        <div className="flex flex-col justify-center">
          {selectedChatData.name && `${selectedChatData.name}`}
          {" "}
        </div>
      </div>}


        <div className="flex gap-5 justify-center items-center">
          <button
            className="text-neutral-500 focus:outline-none focus:border-none hover:text-white transition-all duration-300"
            onClick={closeChat}
          >
            <RiCloseFill className="text-2xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
