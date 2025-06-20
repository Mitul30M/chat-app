import { useContext, useRef, useEffect, createContext, useCallback } from "react";
import { useAppStore } from "@/store";  // Ensure this path is correct
import { HOST, DM_MESSAGES } from "@/utils/constants"; // Ensure HOST is correctly defined
import { io } from "socket.io-client";
import { toast } from "sonner"; // Assuming you have toast notifications
import moment from "moment";
import api from "@/lib/api";
import { GET_DM_CONTACTS } from "@/utils/constants";


const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const socket = useRef(null);  // Initialize with `null` to avoid errors
    const { userInfo, setDms, setSelectedChatMessages, selectedChatData } = useAppStore(); // Make sure `userInfo` is defined

    const getContacts = async () => {
        const dateTime = new Date();
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };

        try {
            const response = await api.get(GET_DM_CONTACTS, {
                withCredentials: true,
            });

            if (response.status === 200 && response.data.contacts) {
                console.log(response.data.contacts)
                setDms(response.data.contacts.reverse()); // Only set contacts if new data is available
                toast.success(`DMs Loaded Successfully`, {
                    description: `${dateTime.toLocaleDateString(undefined, options)} ${dateTime.toLocaleTimeString()}`,
                    action: {
                        label: "Done",
                        onClick: () => console.log("DMs loaded successfully"),
                    },
                });
            }
        } catch (error) {
            console.log(error);
            setDms([])
            toast.error(`Error Loading DMs!`, {
                description: `${dateTime.toLocaleDateString(undefined, options)} ${dateTime.toLocaleTimeString()}`,
                action: {
                    label: "Done",
                    onClick: () => console.log("error whilst loading previous DMs"),
                },
            });
        }
    };

    const loadMessages = async () => {
        const dateTime = new Date();
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        try {
            const response = await api.post(DM_MESSAGES, {
                id: selectedChatData.id
            }, {
                withCredentials: true
            });

            if (response.status === 200 && response.data.messages) {
                setSelectedChatMessages(response.data.messages);
                toast.success(`Messages Loaded Successfully`, {
                    description: `${dateTime.toLocaleDateString(undefined, options)} ${dateTime.toLocaleTimeString()}`,
                    action: {
                        label: "Done",
                        onClick: () => console.log("messages loaded successfully"),
                    }
                });
            }
        } catch (error) {
            setSelectedChatMessages([]);
            toast.error(`Error Loading Messages!`, {
                description: `${dateTime.toLocaleDateString(undefined, options)} ${dateTime.toLocaleTimeString()}`,
                action: {
                    label: "Done",
                    onClick: () => console.log("error whilst loading previous messages"),
                }
            });
        }
    };


    useEffect(() => {
        if (userInfo) {
            socket.current = io(HOST, {
                withCredentials: true,
                query: { userId: userInfo.id }, // Ensure userInfo.id is not undefined
            });

            socket.current.on("connect", () => {
                toast.success("Connected to Socket Server");
                console.log("Connected to Socket Server");
            });

            socket.current.on("connect_error", (err) => {
                toast.error("Connection Error: " + err.message);
                console.error("Connection Error:", err);
            });

            const handleReceiveMessages = async (message) => {
                console.log("message received\n", message)
                const { selectedChatData, selectedChatType, addMessage } = useAppStore.getState();
                // if (selectedChatType !== undefined &&
                //     selectedChatData.id === message.sender.id
                //     || selectedChatData.id === message.recipient._id) {

                //     console.log("message: ", message);
                //     addMessage(message)
                //     await getContacts()
                // }
                console.log("message: ", message);
                addMessage(message)
                await getContacts()
            }

            socket.current.on("receive-message", handleReceiveMessages);

            return () => {
                socket.current?.disconnect(); // Cleanup socket on unmount
            };
        }
    }, [userInfo]);  // Effect depends on userInfo, triggers when userInfo changes

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    );
};
