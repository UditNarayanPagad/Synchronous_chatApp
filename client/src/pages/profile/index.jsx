import { useAppStore } from "@/store"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { colors, getColor } from "@/lib/utils";
import { FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { ADD_PROFILE_IMAGE, DELETE_PROFILE_IMAGE, HOST, UPDATE_USER_PROFILE } from "@/utils/constants";

const Profile = () => {

  const navigate = useNavigate()
  const { userInfo ,setUserInfo } = useAppStore()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [image, setImage] = useState(null)
  const [hovered, setHovered] = useState(false)
  const [selectedColor, setSelectedColor] = useState(0)
  const fileInputRef = useRef(null);

  useEffect(()=>{
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName)
      setLastName(userInfo.lastName)
      setSelectedColor(userInfo.color)
    }
    if (userInfo.image) {
      setImage(`${userInfo.image.path}`)
    }
  },[userInfo])

  const validateProfile = ()=>{
    if (!firstName) {
      toast("First name is required")
      return false;
    }
    if (!lastName) {
      toast("Last name is required")
      return false;
    }
    return true;
  }
  const saveChanges = async ()=>{
    if (validateProfile()) {
      const response = await apiClient.post(UPDATE_USER_PROFILE,{firstName,lastName,color: selectedColor},{withCredentials: true})
      if (response.status === 200 && response.data) {
        setUserInfo({...response.data});
        toast("Profile updated successfully")
        navigate("/chat")
      }
    }
  }
  const handelNavigate = ()=>{
    if (userInfo.profileSetup) {
      navigate("/chat")
    }
    else{
      toast("Please setup profile")
    }
  }
  const fileInputClick = ()=>{
    fileInputRef.current.click();
  }
  const handelImageChange = async (event)=>{
    const file = event.target.files[0];
    // console.log({file})
    if (file) {
      const formData = new FormData();
      formData.append("profileImage", file);
      const response = await apiClient.post(ADD_PROFILE_IMAGE,formData,{withCredentials:true})
      // console.log(formData)
      const path = file.path;
    const filename = file.filename;
      if (response.status === 200 && response.data.image.path) {
        setUserInfo({...userInfo , image: {path,filename}});
        toast.success("Profile image updated successfully")
      }
    }
  }
  const handelImageDelete = async ()=>{
    const response = await apiClient.delete(DELETE_PROFILE_IMAGE,{withCredentials: true})
    if (response.status === 200) {
      setUserInfo({...userInfo, image: null})
      toast.success("Profile Image removed successfully")
      setImage(null)
    }
  }

  return (
    <div className="flex justify-center items-center flex-col gap-10 h-[100vh] bg-[#1b1c24] ">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max ">
        <div>
          <IoArrowBack className="text-3xl lg:text-5xl text-white/90 cursor-pointer " onClick={handelNavigate} />
        </div> 
        <div className="grid grid-cols-2">
          <div className="h-32 w-32 md:w-48 md:h-48 relative flex justify-center items-center rounded-full"
          onMouseEnter={()=> setHovered(true)}
          onMouseLeave={()=> setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden bg-blue-200/50">
              {userInfo.image  && userInfo.image.path ? 
              (<AvatarImage src={`${userInfo.image.path}`} alt="profile" className="w-full h-full object-cover" />) : 
              (<div className={`h-32 w-32 uppercase md:w-48 md:h-48 text-5xl flex justify-center items-center rounded-full ${getColor(selectedColor)}`}>{ firstName ? firstName.split("").shift() : userInfo.email.split("").shift() }</div>)}
            </Avatar>
            {hovered && <div className="absolute h-32 w-32 md:w-48 md:h-48 inset-0 flex justify-center items-center bg-black/50 rounded-full text-white text-3xl cursor-pointer" onClick={userInfo.image?.path ? handelImageDelete : fileInputClick}>
              {userInfo.image  && userInfo.image.path ? <FaTrash/> : <FaPlus/> }
            </div> }
            <input type="file" ref={fileInputRef} className="hidden" name="profileImage" onChange={handelImageChange} accept=".jpg, .jpeg, .png, .svg, .webp" />
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input type="email" placeholder="Email" value={userInfo.email} disabled className="rounded-lg bg-[#474952] border-none " />
            </div>
            <div className="w-full">
              <Input type="text" placeholder="First name" value={firstName} onChange = {e => setFirstName(e.target.value)}className="rounded-lg bg-[#474952] border-none " />
              </div>
            <div className="w-full">
              <Input type="text" placeholder="Last name" value={lastName} onChange = {e => setLastName(e.target.value)}className="rounded-lg bg-[#474952] border-none " />
             </div>
            <div className="flex justify-around w-full">
              { colors.map((color,index)=> (
                <div className={`${color} w-8 h-8 rounded-full cursor-pointer transition-all duration-300 ${selectedColor === index ? "outline outline-2 outline-white/70" : ""}`}key={index} onClick={()=> setSelectedColor(index)}></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full flex justify-end">
          <Button className=" bg-blue-500 hover:bg-blue-600 "onClick={saveChanges} >Save Changes</Button>
        </div>
      </div>
    </div>
  )
}

export default Profile