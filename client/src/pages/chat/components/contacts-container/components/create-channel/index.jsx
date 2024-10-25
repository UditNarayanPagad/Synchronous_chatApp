import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { defaultAnimationOptions, getColor } from "@/lib/utils";
import Lottie from "react-lottie";
import { apiClient } from "@/lib/api-client";
import {
  CREATE_CHANNEL_ROUTE,
  GET_ALL_CONTACTS,
  HOST,
  SEARCH_CONTACTS_ROUTES,
} from "@/utils/constants";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multipleSelect";

const CreateChannel = () => {
  const [newChannelModel, setNewChannelModel] = useState(false);
  const { addChannel } = useAppStore();
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");
  useEffect(() => {
    const getData = async () => {
      const response = await apiClient.get(GET_ALL_CONTACTS, {
        withCredentials: true,
      });
      setAllContacts(response.data.contacts);
    };
    getData();
  }, []);

  const createChannel = async () => {
    try {
      if (channelName.length > 0 && selectedContacts.length > 0) {
        const response = await apiClient.post(
          CREATE_CHANNEL_ROUTE,
          {
            name: channelName,
            members: selectedContacts.map((contact) => contact.value),
          },
          { withCredentials: true }
        );
        if (response.status === 201) {
          setChannelName("");
          setSelectedContacts([]);
          setNewChannelModel(false);
          addChannel(response.data.channel);
        }
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="font-light text-neutral-300 hover:text-white transition-all duration-300 text-start cursor-pointer"
              onClick={() => setNewChannelModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-black text-white p-1 rounded-md">
            <p className="text-sm">Create new Channel</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={newChannelModel} onOpenChange={setNewChannelModel}>
        <DialogContent className="bg-[#1a2b25] border-none text-white  h-[300px] w-[300px]">
          <DialogHeader>
            <DialogTitle>Please fillup details to create new group</DialogTitle>
            <DialogDescription></DialogDescription>
            <div>
              <input
                type="text"
                placeholder="Channel Name"
                className="border-none outline-none px-2 py-1 rounded-md w-full bg-[#4e4e4e]"
                onChange={(e) => setChannelName(e.target.value)}
                value={channelName}
              />
            </div>
            <div>
              <MultipleSelector
                className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white "
                defaultOptions={allContacts}
                placeholder="Select Contacts"
                value={selectedContacts}
                onChange={setSelectedContacts}
                emptyIndicator={
                  <p className="text-lg text-center text-zinc-900">
                    No Contacts found
                  </p>
                }
              />
            </div>
            <div>
              <Button
                className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300 "
                onClick={() => createChannel()}
              >
                Create Channel
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
