import ChatsContainer from "@/components/chat-container/ChatsContainer";
import ContactsContainer from "@/components/contacts-container/ContactsContainer";
import EmptyChatContainer from "@/components/empty-chat/EmptyChatContainer";
import { useAppStore } from "@/store"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Chat = () => {

    const { userInfo, selectedChatType, } = useAppStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo.profileSetup) {
            const toastId = toast.warning("Please setup your profile to continue...");
            navigate('/profile');
            return () => { }
        }
    }, [userInfo, navigate])

    return (
        <div className=" flex py-10 w-full  dark:bg-background justify-center min-h-[100vh] h-max  gap-2">
            <ContactsContainer />
            {
                selectedChatType ?
                    <ChatsContainer />
                    :
                    <EmptyChatContainer />
            }

        </div>
    )
}

export default Chat