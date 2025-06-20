import {
    CardHeader,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Power, X } from '@geist-ui/icons'
import { useAppStore } from "@/store";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

function ChatHeader() {

    const { setSelectedChatType, setSelectedChatData, selectedChatData: receiver, selectedChatType } = useAppStore();

    const handleChatClose = () => {
        setSelectedChatType(undefined);
        setSelectedChatData(undefined);
    }

    return (
        <CardHeader className="flex rounded-3xl flex-row w-full justify-between items-center gap-5 p-2  ">

            {selectedChatType === 'direct-message' ?

                <div className='flex flex-row w-full text-left justify-start items-center gap-2'>
                    <Avatar className="border-2">
                        <AvatarImage src={receiver.profileImg ? receiver.profileImg.url : ''} alt={receiver.name} />

                        <AvatarFallback
                            className="dark:bg-primary bg-secondary text-xs font-semibold text-primary dark:text-black text-center"
                        >
                            {receiver.firstName && (receiver.firstName.split('')[0] + receiver.lastName.split('')[0]).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <h1 className="font-medium text-md group-hover:text-white">{receiver.name}</h1>
                        <p className="font-medium text-sm group-hover:text-white">{receiver.email}</p>
                    </div>
                </div>

                :

                <div className='flex flex-row w-full text-left justify-start items-center gap-2'>
                    <Avatar className="border-2">

                        <AvatarFallback
                            className="dark:primary bg-secondary text-sm font-semibold dark:text-primary  text-black text-center"
                        >
                            #
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <h1 className="font-medium text-md group-hover:text-white">{receiver.name}</h1>
                        <p className="font-medium text-sm group-hover:text-white">{receiver.email}</p>
                    </div>
                </div>
            }


            <Button
                variant="outline"
                onClick={handleChatClose}
                className="h-max p-2 w-max flex justify-center items-center rounded-full">
                <X size={18} className="" />
            </Button>

        </CardHeader>
    )
}

export default ChatHeader