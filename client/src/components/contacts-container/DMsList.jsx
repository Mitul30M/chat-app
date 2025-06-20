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
import { File, Folder } from '@geist-ui/icons'
import api from "@/lib/api";
import { SEARCH_CONTACTS } from "@/utils/constants";
import { MessageSquare } from "@geist-ui/icons";
import { toast } from "sonner";
import { useAppStore } from "@/store";
import moment from "moment";


function DMsList({ isChannel = false }) {

  const { setSelectedChatType, setSelectedChatData, selectedChatData, selectedChatType, setSelectedChatMessages, dms } = useAppStore();


  const selectNewContact = (contact) => {
    if (selectedChatData && selectedChatData.id === contact.id) {
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
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact.id) {
      setSelectedChatMessages([])
    }

    toast.success(`Chat with ${contact.firstName} ${contact.lastName}`, {
      description: `${chatBeginDateTime.toLocaleDateString(undefined, options)} ${chatBeginDateTime.toLocaleTimeString()}`,
      action: {
        label: "Done",
        onClick: () => {
          console.log(selectedChatData);
          console.log(dms);
          console.log(`new DM with ${contact.firstName} ${contact.lastName}`)
        },
      }
    }
    )

  };


  return (
    <ScrollArea className="h-[300px] dark:bg-white/5 w-full dark:border-0 border-2 border-gray-50 rounded-md p-4 ">

      {dms.length ? (
        dms.map((dm) => (
          <div
            key={dm.contactInfo.id}
            onClick={() => selectNewContact(dm.contactInfo)}

            className={(selectedChatData && selectedChatData.id === dm.contactInfo.id ? 'bg-primary text-white dark:text-black' : 'hover:bg-secondary dark:group-hover:text-white ') + " hover:cursor-pointer first:mt-0 flex flex-row items-center w-full my-2 rounded-md p-2 group  justify-start gap-2"}
          >
            <Avatar className="border-2">
              <AvatarImage src={dm.contactInfo.profileImg ? dm.contactInfo.profileImg.url : ''} alt={dm.contactInfo.name} />

              <AvatarFallback
                className=" bg-secondary text-xs font-semibold text-primary dark:text-md text-center"
              >
                {dm.contactInfo.firstName && (dm.contactInfo.firstName.split('')[0] + dm.contactInfo.lastName.split('')[0]).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="   dark:group-hover:text-black text-left rounded-xl ">
              <h1 className="text-md font-semibold">{dm.contactInfo.firstName} {dm.contactInfo.lastName}</h1>
              {/* <p className="font-semibold text-[10px]">{dm.contactInfo.email}</p> */}
              <p className=" font-semibold flex items-center gap-2 text-nowrap text-[10px]">{moment(dm.lastMsgTime).format('HH:mm, ddd, MMM D, YY')
              }: 
                {dm.messageType === 'text' && dm.lastMessage.length > 10 ? dm.lastMessage.slice(0, 10) + '...' : dm.lastMessage}
                {/* {dm.messageType === 'file' && dm.originalFileName.length > 10 ? dm.originalFileName.slice(0, 10) + '...' : dm.originalFileName} */}
                {dm.messageType === 'file' && <File size={15} />}

              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col h-full w-full gap-1 py-4 justify-center items-center">
          <Loader />
          <CardTitle>No DMs</CardTitle>
          <CardDescription>Add New DMs.</CardDescription>
        </div>
      )}

    </ScrollArea>
  )
}

export default DMsList