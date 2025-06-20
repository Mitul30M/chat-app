import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ModeToggle } from "../theme-provider/ModeToggle";
import ProfileInfo from "../profile-info/ProfileInfo";
import { NewDM } from "./NewDM";
import Loader from "../ui/icons/Loader";
import { useEffect, useCallback } from "react";
import { CHANNELS_ROUTE, GET_DM_CONTACTS } from "@/utils/constants";
import api from "@/lib/api";
import { toast } from "sonner";
import DMsList from "./DMsList";
import { useAppStore } from "@/store";
import ChannelsList from "./ChannelsList";
import { NewChannel } from "./NewChannel";

function ContactsContainer() {
    const { dms, setDms,channels,setChannels,selectedChatData } = useAppStore();

    const getDMs = useCallback(async () => {
        const dateTime = new Date();
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };

        try {
            const response = await api.get(GET_DM_CONTACTS, { withCredentials: true });

            if (response.status === 200 && response.data.contacts?.length) {
                setDms(response.data.contacts);
                toast.success(`DMs Loaded Successfully`, {
                    description: `${dateTime.toLocaleDateString(undefined, options)} ${dateTime.toLocaleTimeString()}`,
                    action: {
                        label: "Done",
                        onClick: () => console.log("DMs loaded successfully"),
                    },
                });
            } else {
                setDms([]);
                toast.error("No contacts found!");
            }
        } catch (error) {
            console.error("Failed to load contacts:", error);
            setDms([]);
            toast.error("Error Loading DMs!", {
                description: `${dateTime.toLocaleDateString(undefined, options)} ${dateTime.toLocaleTimeString()}`,
                action: {
                    label: "Done",
                    onClick: () => console.log("error whilst loading previous DMs"),
                },
            });
        }
    }, [setDms]);

    useEffect(() => {
        getDMs();
    }, [getDMs]);

    const getChannels = useCallback(async () => {
        const dateTime = new Date();
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };

        try {
            const response = await api.get(CHANNELS_ROUTE, { withCredentials: true });

            if (response.status === 200 && response.data.channels?.length) {
                setChannels(response.data.channels);
                toast.success(`Channels Loaded Successfully`, {
                    description: `${dateTime.toLocaleDateString(undefined, options)} ${dateTime.toLocaleTimeString()}`,
                    action: {
                        label: "Done",
                        onClick: () => console.log("Channels loaded successfully"),
                    },
                });
            } else {
                setChannels([]);
                toast.error("No Channels found!");
            }
        } catch (error) {
            console.error("Failed to load Channels:", error);
            setChannels([]);
            toast.error("Error Loading Channels!", {
                description: `${dateTime.toLocaleDateString(undefined, options)} ${dateTime.toLocaleTimeString()}`,
                action: {
                    label: "Done",
                    onClick: () => console.log("error whilst loading previous Channels"),
                },
            });
        }
    }, [setChannels]);

    useEffect(() => {
        console.log("channels",channels)
        getChannels();
    }, [getChannels]);
    

    return (
        <Card className={(!selectedChatData ? 'flex  ' : 'hidden sm:flex ') + "h-full dark:bg-background dark:border-[1px] flex-col items-center sm:rounded-r-none justify-start  w-80 sm:h-max min-h-[90vh]"}>
            <CardHeader className="flex flex-row w-full justify-between items-center gap-2 p-4 border-b-2 dark:border-white">
                <div className="flex flex-row items-center justify-center gap-2">
                    <img src="/react.svg" alt="" className="w-6 h-6" />
                    <h1 className="font-medium text-md">Direct Message</h1>
                </div>
                <ModeToggle />
            </CardHeader>

            <ProfileInfo />

            <CardContent className="w-full mt-4">
                <Accordion className="w-full" type="multiple">
                    {/* DMs */}
                    <AccordionItem value="direct-messages">
                        <AccordionTrigger className="w-full text-sm capitalize">
                            DIRECT MESSAGES
                        </AccordionTrigger>
                        <AccordionContent className="w-full flex flex-col items-end gap-3">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <NewDM className="w-max text-sm flex gap-2 " variant="outline" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Add New Contact to Chat</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <DMsList />
                        </AccordionContent>
                    </AccordionItem>

                    {/* CHANNELS */}
                    <AccordionItem value="channels">
                        <AccordionTrigger className="w-full text-sm capitalize">
                            CHANNELS
                        </AccordionTrigger>
                        <AccordionContent className="w-full flex flex-col items-end gap-3">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <NewChannel className="w-max text-sm flex gap-2 " variant="outline" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Create New Channel</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <ChannelsList />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    );
}

export default ContactsContainer;
