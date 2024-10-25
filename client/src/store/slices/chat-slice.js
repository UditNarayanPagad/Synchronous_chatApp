import { apiClient } from "@/lib/api-client";
import { GET_CONTACTS_FOR_DM, GET_USERS_CHANNEL } from "@/utils/constants";

export const createChatSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMesagesContacts: [],
  fileUploading: false,
  fileDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  channels: [],
  addChannel: (channel) => {
    const channels = get().channels;
    set({ channels: [channel, ...channels],channelScan:true });
  },
  setChannels: (channels) => set({ channels }),
  setFileUploading: (fileUploading) => set({ fileUploading }),
  setFileDownloading: (fileDownloading) => set({ fileDownloading }),
  setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
  setFileDownloadProgress: (fileDownloadProgress) =>
    set({ fileDownloadProgress }),
  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages }),
  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
  setDirectMesagesContacts: (directMesagesContacts) =>
    set({ directMesagesContacts }),
  closeChat: () =>
    set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessages: [],
    }),
  getContacts: async () => {
    const response = await apiClient.get(GET_CONTACTS_FOR_DM, {
      withCredentials: true,
    });
    if (response.data.contacts) {
      set({ contacts: response.data.contacts });
      set({ directMesagesContacts: response.data.contacts });
    }
  },
  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;

    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          recepient:
            selectedChatType === "channel"
              ? message.recepient
              : message.recipient._id,
          sender:
            selectedChatType === "channel"
              ? message.sender
              : message.sender._id,
        },
      ],
    });
  },
  addChannelInChannelList: (message) => {
    const channels = get().channels;
    const data = channels.find((channel) => channel._id === message.channelId);
    const index = channels.findIndex(
      (channel) => channel._id === message.channelId
    );
    if (index !== -1 && index !== undefined) {
      channels.splice(index, 1);
      channels.unshift(data);
    }
  },
  addContactsInDMContacts: (message) => {
    const userId = get().userInfo.id;
    const fromId =
      message.sender._id === userId
        ? message.recipient._id
        : message.sender._id;
    const fromData =
      message.sender._id === userId ? message.recipient : message.sender;
    const dmContacts = get().directMesagesContacts;
    const data = dmContacts.find((contact) => contact._id === fromId);
    const index = dmContacts.findIndex((contact) => contact._id === fromId);
    if (index != -1 && index !== undefined) {
      dmContacts.splice(index, 1);
      dmContacts.unshift(data);
    } else {
      dmContacts.unshift(fromData);
    }
    set({ directMesagesContacts: dmContacts });
  },
});
