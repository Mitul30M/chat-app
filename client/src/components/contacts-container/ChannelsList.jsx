import { Button } from "@/components/ui/button";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import Loader from "../ui/icons/Loader";
import { Folder } from '@geist-ui/icons'
import api from "@/lib/api";
import { SEARCH_CONTACTS } from "@/utils/constants";
import { MessageSquare } from "@geist-ui/icons";
import { toast } from "sonner";
import { useAppStore } from "@/store";
import moment from "moment";


function ChannelsList({ isChannel = true }) {

    const { setSelectedChatType, setSelectedChatData, selectedChatData, selectedChatType, setSelectedChatMessages, channels } = useAppStore();


    const selectNewChannel = (channel) => {

        if (selectedChatData && selectedChatData.id === channel.id) {
            return
        }
        const chatBeginDateTime = new Date();
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };

        setSelectedChatType(isChannel ? 'channel' : 'direct-message')
        setSelectedChatData(channel);
        if (selectedChatData && selectedChatData._id !== channel.id) {
            setSelectedChatMessages([])
        }

        toast.success(`'${channel.name}' channel loaded`, {
            description: `${chatBeginDateTime.toLocaleDateString(undefined, options)} ${chatBeginDateTime.toLocaleTimeString()}`,
            action: {
                label: "Done",
                onClick: () => {
                    console.log(selectedChatData);
                    console.log(dms);
                    console.log(`${channel.name} Channel loaded`)
                },
            }
        }
        )


    };


    return (
        <ScrollArea className="h-[300px] dark:bg-white/5 w-full dark:border-0 border-2 border-gray-50 rounded-md p-4 ">

            {channels.length ? (
                channels.map((channel) => (
                    <div
                        key={channel.id}
                        onClick={() => selectNewChannel(channel)}

                        className={(  channel.id ? ' text-white' : '') + " hover:cursor-pointer first:mt-0 flex flex-row items-center w-full my-2 rounded-md p-2 group hover:bg-primary justify-start gap-2"}
                    >

                        <Avatar className="border-2">
                            <AvatarImage alt='#' />

                            <AvatarFallback
                                className="dark:primary bg-secondary text-sm font-semibold dark:text-primary  text-black text-center"
                            >
                                #
                            </AvatarFallback>
                        </Avatar>
                        
                        <div className=" dark:group-hover:text-black group-hover:text-white dark:text-white text-left rounded-xl text-black ">
                            
                            <h1 className="text-md font-semibold">{channel.name}</h1>
                            {/* <p className="font-semibold text-[10px]">{channel.contactInfo.email}</p> */}

                        </div>
                    </div>
                ))
            ) : (
                <div className="flex flex-col h-full w-full gap-1 py-4 justify-center items-center">
                    <Loader />
                    <CardTitle>No Channels</CardTitle>
                    <CardDescription>Add New Channels.</CardDescription>
                </div>
            )}

        </ScrollArea>
    )
}

export default ChannelsList