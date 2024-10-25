import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import { apiClient } from "@/lib/api-client";

const ProfileInfo = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const logout = async ()=>{
    try {
      const response = await apiClient.post(LOGOUT_ROUTE,{},{withCredentials:true})
      if (response.status === 200) {
        navigate("/auth")
        setUserInfo(null);
      }
    } catch (error) {
      console.log({error})
    }
  }
  return (
    <div className="absolute bottom-0 flex h-14 justify-between items-center px-5 w-full bg-[#2a2b33] ">
      <div className="flex gap-2 justify-center items-center  ">
        <div className="relative w-10 h-10">
          <Avatar className="h-10 w-10 rounded-full overflow-hidden bg-blue-200/50">
            {userInfo.image  && userInfo.image.path? (
              <AvatarImage
                src={userInfo.image.path}
                alt="profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div
                className={`h-10 w-10 uppercase text-xl flex justify-center items-center rounded-full ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.split("").shift()
                  : userInfo.email.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
        <div className="font-semibold">
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : ""}
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger onClick={()=> navigate("/profile")}><FiEdit2 className="text-blue-500 text-xl" /></TooltipTrigger>
            <TooltipContent className="bg-black text-white p-1 rounded-md">
              <p className="text-sm">Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger onClick={logout}><LuLogOut className="text-red-500 text-xl" /></TooltipTrigger>
            <TooltipContent className="bg-black text-white p-1 rounded-md">
              <p className="text-sm">Log out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
