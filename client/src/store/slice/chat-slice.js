
export const createChatSlice = (set, get) => (
    {
        selectedChatType: undefined,
        selectedChatData: undefined,
        selectedChatMessages: [],
        dms: [],
        channels:[],
        isDownloading: false,
        setIsDownloading: (isDownloading) => {
            set({ isDownloading })
        },
        downloadProgress: 0,
        setDownloadProgress: (downloadProgress) => {
            set({ downloadProgress })
        },
        setSelectedChatType: (selectedChatType) => {
            set({ selectedChatType })
        },
        setSelectedChatData: (selectedChatData) => {
            set({ selectedChatData })
        },
        setSelectedChatMessages: (selectedChatMessages) => {
            set({ selectedChatMessages })
        },
        setDms: (dms) => {
            set({ dms })
        },
        setChannels: (channels) => {
            set({ channels })
        },
        addChannel: (channel) => {
            const channels = get().channels;
            set({ channels: [channel, ...channels] });
        },
        closeChat: () => {
            set(
                {
                    selectedChatData: undefined,
                    selectedChatType: undefined,
                    selectedChatMessages: []
                }
            );

        },
        addMessage: (message) => {
            const selectedChatMessages = get().selectedChatMessages;
            const selectedChatType = get().selectedChatType;

            set({
                selectedChatMessages: [
                    ...selectedChatMessages, {
                        ...message,
                        recipient: selectedChatType === "channel" ?
                            message.recipient
                            :
                            message.recipient.id,
                        sender: selectedChatType === "channel" ?
                            message.sender
                            :
                            message.sender.id,
                    }]
            })
        }
    })