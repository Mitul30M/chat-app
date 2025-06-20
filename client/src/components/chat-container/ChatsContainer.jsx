import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Send, Paperclip, Emoji } from '@geist-ui/icons'
import { Textarea } from "@/components/ui/textarea"
import { Button } from "../ui/button";
import { useReducer, useRef, useState, useEffect, useCallback } from "react";
import ChatHeader from "./ChatHeader";
import ChatsSection from "./ChatsSection";
import EmojiPicker from "emoji-picker-react";
import { useTheme } from "../theme-provider/ThemeProvider"
import { useAppStore } from "@/store";
import { useSocket } from "@/context/SocektContext";
import { toast } from "sonner";
import { GET_DM_CONTACTS, UPLOAD_FILE } from "@/utils/constants";
import api from "@/lib/api";
import { Input } from "../ui/input";
import { Progress } from "../ui/progress";

function ChatsContainer() {

    const { selectedChatType, selectedChatData, userInfo, setSelectedChatMessages, selectedChatMessages, dms, setDms,  } = useAppStore();
    const socket = useSocket();
    const { theme } = useTheme();
    const emojiRef = useRef();
    const fileRef = useRef();
    const [message, setMessage] = useState('');
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);



    useEffect(() => {
        function handleClickOutside(evt) {
            if (emojiRef.current && !emojiRef.current.contains(evt.target)) {
                setIsEmojiPickerOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [emojiRef])

    const handleAddEmoji = (emoji) => {
        setMessage(msg => msg + emoji.emoji);
    }

    const handleAttachmentClick = () => {
        if (fileRef.current) {
            fileRef.current.click();
        }
    }

    const handleAttachmentChange = async (evt) => {
        const dateTime = new Date();
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        try {
            const file = evt.target.files[0];
            if (file) {
                console.log(file)
                const formData = new FormData();
                formData.append("uploaded-file", file);
                const response = await api.post(UPLOAD_FILE, formData, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (response.status === 200 && response.data) {
                    if (selectedChatType === 'direct-message') {
                        const newMessage = {
                            sender: userInfo.id,
                            content: undefined,
                            recipient: selectedChatData.id,
                            messageType: 'file',
                            fileUrl: response.data.file.path,
                            fileName: response.data.file.filename,
                            originalFileName: response.data.file.originalname
                        };
                        await socket.emit('send-message', newMessage);
                        await getContacts();
                    }

                    toast.success("Files Uploaded Successfully", {
                        description: (
                            `${dateTime.toLocaleDateString(undefined, options)} ${dateTime.toLocaleTimeString()}`,
                            <Progress value={100} className="mt-2" />
                        ),
                        action: {
                            label: "Done",
                            onClick: () => console.log(response.data.file),
                        }
                    })
                }
            }

        } catch (error) {
            toast.error(`Error Uploading File!`, {
                description: `${dateTime.toLocaleDateString(undefined, options)} ${dateTime.toLocaleTimeString()}`,
                action: {
                    label: "Done",
                    onClick: () => console.log("error in uploading attached files"),
                }
            }
            )
        }
    }

    const getContacts = useCallback(async () => {
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
    }, [setDms]);


    const handleSendMessage = async () => {
        if (message.trim() === "") return;  // Prevent sending empty messages

        console.log("send-message emitted")

        if (selectedChatType === 'direct-message') {
            const newMessage = {
                sender: userInfo.id,
                content: message,
                recipient: selectedChatData.id,
                messageType: 'text',
                fileUrl: undefined,
            };
            await socket.emit('send-message', newMessage);
            await getContacts();
        }

        setMessage("");  // Clear the input after sending
    }

    return (
        <Card className={(selectedChatData ? 'flex sm:rounded-l-none ' : 'hidden') + " sm:sticky sm:top-10 flex-1 dark:bg-background dark:border-2 flex-col max-w-[22rem] h-[90vh] sm:flex items-center justify-between p-4 pb-0"}>


            {/* //chat header */}
            <ChatHeader />

            {/* //chats container */}
            <ChatsSection />


            {/* //chat new message */}
            <CardFooter className="flex relative flex-row w-full justify-start items-center gap-2 p-2 pt-2 mb-4 ">
                <div className="flex-1 flex flex-row gap-2 justify-center items-center">
                    <Button
                        onClick={handleAttachmentClick}
                        variant="outline" className="h-max p-2 w-max rounded-2xl">
                        <Paperclip size={18} />
                    </Button>
                    {/* <Button
                        onClick={() => setIsEmojiPickerOpen(prev => !prev)}
                        variant="outline"
                        className="h-max p-2 w-max rounded-2xl">
                        <Emoji size={18} />
                    </Button> */}
                    <div ref={emojiRef} className="absolute bottom-20 right-0">
                        <EmojiPicker
                            className="w-36"
                            theme={theme}
                            open={isEmojiPickerOpen}
                            onEmojiClick={handleAddEmoji}
                            autoFocusSearch={false}
                        />
                    </div>
                    <Input
                        className="hidden"
                        onChange={handleAttachmentChange}
                        type="file"
                        ref={fileRef}
                    />
                    <Textarea
                        type="text"
                        value={message}
                        onChange={evt => setMessage(evt.target.value)}
                        placeholder="Type your message here."
                    />
                </div>

                <Button

                    onClick={handleSendMessage}
                    className="h-max p-2 w-max hover:rounded-lg flex justify-center items-center">
                    <Send size={18} />
                </Button>

            </CardFooter>

        </Card>
    )
}

export default ChatsContainer