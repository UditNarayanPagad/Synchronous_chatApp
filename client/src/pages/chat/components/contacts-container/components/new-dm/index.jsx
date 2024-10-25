import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { defaultAnimationOptions, getColor } from "@/lib/utils";
import Lottie from "react-lottie";
import { apiClient } from "@/lib/api-client";
import { HOST, SEARCH_CONTACTS_ROUTES } from "@/utils/constants";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useAppStore } from "@/store";

const NewDm = () => {
  const [openNewConatactModel, setOpenNewConatactModel] = useState(false);
  const [searchedContact, setSearchedContact] = useState([]);
  const [searchTermLength, setSearchTermLength] = useState(false);
  const {setSelectedChatData,setSelectedChatType} = useAppStore()
  const searchContact = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        setSearchTermLength(true);
        const response = await apiClient.post(
          SEARCH_CONTACTS_ROUTES,
          { searchTerm },
          { withCredentials: true }
        );

        if (response.status === 200 && response.data.contacts) {
          setSearchedContact(response.data.contacts);
        } else {
          setSearchedContact([]);
        }
      } else {
        setSearchedContact([]);
        setSearchTermLength(false);
      }
    } catch (error) {
      console.log({ error });
    }
  };
 const selectNewContact = async (contact)=>{
  setOpenNewConatactModel(false)
  setSearchTermLength(false)
  setSelectedChatType("contact")
  setSelectedChatData(contact)
  setSearchedContact([])
 }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="font-light text-neutral-300 hover:text-white transition-all duration-300 text-start cursor-pointer"
              onClick={() => setOpenNewConatactModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-black text-white p-1 rounded-md">
            <p className="text-sm">Select New Contact</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog
        open={openNewConatactModel}
        onOpenChange={setOpenNewConatactModel}
      >
        <DialogContent className="bg-[#1a2b25] border-none text-white  h-[300px] w-[300px] ">
          <DialogHeader>
            <DialogTitle>Select a Contact</DialogTitle>
            <DialogDescription></DialogDescription>
            <div>
              <input
                type="text"
                placeholder="Search Contacts"
                className="border-none outline-none px-2 py-1 rounded-md w-full bg-[#4e4e4e]"
                onChange={(e) => searchContact(e.target.value)}
              />
            </div>
          <ScrollArea className=" ">
            <div className="flex flex-col gap-5 mt-2">
              {searchedContact.length <= 0 && searchTermLength ? (
                <div>
                  <h2 className="font-semibold">No Contacts found !</h2>
                </div>
              ):( searchedContact.map((contact) => (
                <div
                  key={contact._id}
                  className="flex gap-3 cursor-pointer items-center" onClick={()=>selectNewContact(contact)}
                >
                  <Avatar className="h-10 w-10 rounded-full overflow-hidden bg-blue-200/50">
                    {contact.image  && contact.image.path ? (
                      <AvatarImage
                        src={`${contact.image.path}`}
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className={`h-10 w-10 uppercase text-xl flex justify-center items-center rounded-full ${getColor(
                          contact.color
                        )}`}
                      >
                        {contact.firstName
                          ? contact.firstName.split("").shift()
                          : contact.email.split("").shift()}
                      </div>
                    )}
                  </Avatar>
                  <div className="flex flex-col justify-center">
                    <p>{contact.firstName} {contact.lastName} </p>
                     <span className="text-xs text-zinc-300">{contact.email}</span> </div>
                </div>
              )))}
            </div>
          </ScrollArea>
          </DialogHeader>

          {searchedContact.length <= 0 && !searchTermLength && (
            <div className="flex-1 md:flex md:bg-[#1c1d25] flex-col items-center justify-center duration-100 transition-all ">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={defaultAnimationOptions}
              />
              <div className="text-opacity-80 text-white flex items-center text-center flex-col gap-5 mt-10 text-lg lg:text-xl transition-all duration-300">
                <h3 className="poppins-medium">
                  Hi<span className="text-purple-500">! </span>
                  Search <span className="text-purple-500">Contacts</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDm;
