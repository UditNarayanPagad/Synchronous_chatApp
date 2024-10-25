import { defaultAnimationOptions } from "@/lib/utils"
import Lottie from "react-lottie"

const EmptyChatConatiner = () => {
  return (
    <div className="flex-1 md:flex md:bg-[#1c1d25] flex-col items-center justify-center hidden duration-100 transition-all ">
        <Lottie isClickToPauseDisabled={true} height={200} width={200} options={defaultAnimationOptions} />
        <div className="text-opacity-80 text-white flex items-center text-center flex-col gap-5 mt-10 text-3xl lg:text-4xl transition-all duration-300">
        <h3 className="poppins-medium">
            Hi<span className="text-purple-500">! </span>
            Welcome to <span className="text-purple-500">Synchronous </span>
            Chat App<span className="text-purple-500">.</span>
        </h3>
        </div>
    </div>
  )
}

export default EmptyChatConatiner