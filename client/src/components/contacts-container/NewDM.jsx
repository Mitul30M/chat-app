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
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import Loader from "../ui/icons/Loader";
import api from "@/lib/api";
import { SEARCH_CONTACTS } from "@/utils/constants";
import { MessageSquare } from "@geist-ui/icons";
import { toast } from "sonner";
import { useAppStore } from "@/store";

export function NewDM({ ...props }) {


    const { setSelectedChatType, setSelectedChatData, setSelectedChatMessages } = useAppStore();
    const [contacts, setContacts] = useState([]);
    const [open, setOpen] = useState(false); // Manage modal open/close state

    const searchContacts = async (searchTerm) => {
        try {
            if (searchTerm.length) {
                const response = await api.post(SEARCH_CONTACTS, {
                    searchTerm
                }, { withCredentials: true });

                if (response.status === 200 && response.data.contacts) {
                    setContacts(response.data.contacts);
                }
            } else {
                setContacts([]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const selectNewContact = (contact) => {

        setSelectedChatMessages([]);
        setSelectedChatType(undefined);
        setSelectedChatData(undefined);

        const chatBeginDateTime = new Date();
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        // Handle contact selection (e.g., initiate chat with contact)
        setOpen(false);

        setSelectedChatType('direct-message');
        setSelectedChatData(contact);

        setContacts([]);
        toast.success(`Chat with ${contact.name}`, {
            description: `${chatBeginDateTime.toLocaleDateString(undefined, options)} ${chatBeginDateTime.toLocaleTimeString()}`,
            action: {
                label: "Done",
                onClick: () => console.log(`new DM with ${contact.name}`),
            }
        }
        )


    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" {...props} onClick={() => setOpen(true)}>
                    <MessageSquare size={15} />
                    Add New
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] dark:text-white dark:bg-background">
                {/* Search Contact */}
                <DialogHeader>
                    <DialogTitle>Search Contacts</DialogTitle>
                    <DialogDescription>
                        Create new chat through direct messages.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center py-4 pb-1">
                    <Input
                        type="email"
                        onChange={(evt) => searchContacts(evt.target.value)}
                        placeholder="Search Contacts"
                    />
                </div>

                <ScrollArea className="h-72 dark:bg-primary/10 bg-primary/5 w-full rounded-md p-4">
                    {contacts.length ? (
                        contacts.map((contact) => (
                            <div
                                key={contact.id}
                                onClick={() => selectNewContact(contact)} // Close modal when clicked
                                className="hover:cursor-pointer first:mt-0 flex flex-row items-center w-full my-2 rounded-md p-2 group hover:bg-primary justify-start gap-2"
                            >
                                <Avatar className="border-2">
                                    <AvatarImage src={contact.profileImg ? contact.profileImg.url : ''} alt={contact.name} />

                                    <AvatarFallback
                                        className="dark:bg-primary bg-secondary text-xs font-semibold text-primary dark:text-black text-center"
                                    >
                                        {contact.firstName && (contact.firstName.split('')[0] + contact.lastName.split('')[0]).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div>
                                    <h1 className="font-medium text-md group-hover:text-white">{contact.name}</h1>
                                    <p className="font-medium text-sm group-hover:text-white">{contact.email}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col h-full w-full gap-1 py-4 justify-center items-center">
                            <Loader />
                            <CardTitle>No Contacts</CardTitle>
                            <CardDescription>Add New Contacts.</CardDescription>
                        </div>
                    )}
                </ScrollArea>
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