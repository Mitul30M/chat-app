import { Button } from "@/components/ui/button";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import Loader from "../ui/icons/Loader";
import api from "@/lib/api";
import { CHANNELS_ROUTE, GET_ALL_CONTACTS, SEARCH_CONTACTS } from "@/utils/constants";
import { MessageSquare } from "@geist-ui/icons";
import { toast } from "sonner";
import { useAppStore } from "@/store";
import { Label } from "../ui/label";
import { Form } from "react-router-dom";
import MultiSelect from "../ui/multi-select";

export function NewChannel({ ...props }) {


    const { setSelectedChatType, setSelectedChatData, setSelectedChatMessages, addChannel, channels } = useAppStore();
    const [allContacts, setAllContacts] = useState();
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [channelName, setChannelName] = useState('');
    const [open, setOpen] = useState(false); // Manage modal open/close state

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await api.get(GET_ALL_CONTACTS, {
                    withCredentials: true,
                });
                if (response.data && response.data.contacts) {
                    setAllContacts(response.data.contacts); // Updated to correctly set contacts
                } else {
                    setAllContacts([]); // Set an empty array if no contacts found
                }
            } catch (error) {
                console.error('Failed to fetch contacts:', error);
                toast.error('Failed to load contacts.');
            }
        };

        getData();
    }, []);


    const createChannel = async () => {
        const dateTime = new Date();
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        try {
            if (channelName.length && selectedContacts.length) {
                const response = await api.post(CHANNELS_ROUTE, {
                    name: channelName,
                    members: selectedContacts.map(contact => contact)
                }, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    setSelectedContacts([]);
                    addChannel(response.data?.channel);
                    toast.success(`Channel created successfully, ${response.data.channel?.name}`, {
                        description: `${dateTime.toLocaleDateString(undefined, options)} ${dateTime.toLocaleTimeString()}`,
                        action: {
                            label: "Done",
                            onClick: () => console.log(`Channel created successfully, ${response.data.channel?.name}`),
                        }
                    }
                    )
                    setChannelName('');
                    setOpen(false);
                }
            }
            
        } catch (error) {
            toast.success(`Failed to create a New Channel`, {
                description: `${dateTime.toLocaleDateString(undefined, options)} ${dateTime.toLocaleTimeString()}`,
                action: {
                    label: "Done",
                    onClick: () => console.log(`Error creating New Channel: ${error.message}`),
                }
            }
            )
        }
    };



    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" {...props} onClick={() => setOpen(true)}>
                    <MessageSquare size={15} />
                    Add New
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] dark:text-white dark:bg-[#09090B]">
                {/* Search Contact */}
                <DialogHeader>
                    <DialogTitle>Create New Channel</DialogTitle>
                    <DialogDescription>
                        Chat together through a channel.
                    </DialogDescription>
                </DialogHeader>

                <Form onSubmit={createChannel} className="flex flex-col py-4 pb-1 gap-2">
                    <Label htmlFor="channel-name" className=" text-[12px]">Channel Name</Label>
                    <Input
                        required
                        id="channel-name"
                        value={channelName}
                        type="text"
                        onChange={(evt) => setChannelName(evt.target.value)}
                        placeholder="Some-Unique-Name"
                    />

                    <Label htmlFor="channel-members" className="mt-5 text-[12px]">Add Channel Members</Label>
                    <MultiSelect
                        options={allContacts || []} // Ensure options is an array (empty if undefined)
                        onValueChange={setSelectedContacts}
                        placeholder="Select Channel Members"
                        variant="inverted"
                        maxCount={3}
                    />

                    <Button className="mt-5" type="submit">
                        Create New Channel
                    </Button>
                </Form>


            </DialogContent>
        </Dialog>
    );
}

// <Separator className="my-2" />
// {/* Create New Contact */ }
//                 <DialogHeader>
//                     <DialogTitle>New Contact</DialogTitle>
//                     <DialogDescription>
//                         Add new contact to chat through direct messages.
//                     </DialogDescription>
//                 </DialogHeader>

//                 <div className="grid gap-4 py-4">
//                     <div className="grid grid-cols-4 items-center gap-4">
//                         <Label htmlFor="name" className="text-right">
//                             User Name
//                         </Label>
//                         <Input id="name" value="" className="col-span-3" />
//                     </div>
//                     <div className="grid grid-cols-4 items-center gap-4">
//                         <Label htmlFor="email" className="text-right">
//                             Email
//                         </Label>
//                         <Input
//                             id="email"
//                             value=""
//                             className="col-span-3" />
//                     </div>
//                 </div>
//        <DialogFooter>
//             <Button type="submit">Create New Chat</Button>
//        </DialogFooter >