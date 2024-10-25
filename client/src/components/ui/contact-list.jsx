import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";

const ContactList = ({ contacts, ischannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useAppStore();
  const handleClick = (contact) => {
    if (ischannel) {
      setSelectedChatType("channel");
    } else {
      setSelectedChatType("contact");
    }
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };
  const uniqueGroups = contacts.filter((contact, index, self) => 
    index === self.findIndex((c) => c._id === contact._id))

  return ischannel ? (
    <div className="mt-5 mb-8 ">
      {uniqueGroups.map((contact) => (
        <div
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer mb-1 ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-purple-800 hover:bg-purple-700"
              : "bg-slate-800 hover:bg-slate-700 "
          } `}
          onClick={() => handleClick(contact)}
          key={contact._id}
        >
          <div className="flex gap-5 justify-start items-center text-neutral-200">
            <Avatar className="h-8 w-8 rounded-full overflow-hidden bg-blue-200/50">
              {contact.image  && contact.image.path ? (
                <AvatarImage
                  src={`${contact.image.path}`}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`h-8 w-8 uppercase text-xl flex justify-center items-center rounded-full ${getColor(
                    1
                  )} `}
                >
                  {contact.name && contact.name.split("").shift()}
                </div>
              )}
            </Avatar>
            <div className="flex flex-col justify-center font-semibold">
              {contact.name && `${contact.name}`}{" "}
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="mt-5 ">
      {contacts.map((contact) => (
        <div
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer mb-1 ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-purple-800 hover:bg-purple-700"
              : "bg-slate-800 hover:bg-slate-700 "
          } `}
          onClick={() => handleClick(contact)}
          key={contact._id}
        >
          <div className="flex gap-5 justify-start items-center text-neutral-200">
            <Avatar className="h-8 w-8 rounded-full overflow-hidden bg-blue-200/50">
              {contact.image  && contact.image.path ? (
                <AvatarImage
                  src={`${contact.image.path}`}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`h-8 w-8 uppercase text-xl flex justify-center items-center rounded-full ${getColor(
                    contact.color
                  )}`}
                >
                  {contact.firstName
                    ? contact.firstName.split("").shift()
                    : contact.email.split("").shift()}
                </div>
              )}
            </Avatar>
            <div className="flex flex-col justify-center font-semibold">
              {contact.firstName &&
                contact.lastName &&
                `${contact.firstName} ${contact.lastName}`}{" "}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
