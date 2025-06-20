import { ScrollArea } from "@/components/ui/scroll-area";
import { CardContent } from "@/components/ui/card";
import { useAppStore } from "@/store";
import { useEffect, useRef, useCallback, useState } from "react";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import api from "@/lib/api";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Folder, Download, File } from '@geist-ui/icons'
import { DM_MESSAGES } from "@/utils/constants";
import { Progress } from "../ui/progress";
function ChatsSection() {
    const { selectedChatType, selectedChatData, selectedChatMessages, setSelectedChatMessages, dms, isDownloading, setIsDownloading, downloadProgress, setDownloadProgress } = useAppStore();
    const scrollRef = useRef();



    // Load messages for the dm chat
    const loadMessages = useCallback(async () => {
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
    }, [selectedChatData.id, setSelectedChatMessages]);

    // Fetch messages when selectedChatData changes
    useEffect(() => {
        if (selectedChatData.id && selectedChatType === 'direct-message') {
            loadMessages();
        }
    }, [selectedChatType, selectedChatData.id, dms]);

    // Scroll to the latest message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedChatMessages]);

    //chec if the file is an img
    const checkIfImg = (filepath) => {
        // Regex pattern to match common image file extensions
        const imgRegex = /\.(jpg|jpeg|png|gif|bmp|webp|tiff|tif|svg|ico)$/i;
        return imgRegex.test(filepath);
    }
    // Render messages
    const renderMessages = () => {
        let lastDate = null;
        return selectedChatMessages.map((message, idx) => {
            const messageDate = moment(message.createdAt).format('DD-MM-YYYY');
            const showDate = messageDate !== lastDate;
            lastDate = messageDate;

            return (
                <div key={idx}>
                    {showDate && (
                        <div className="font-semibold text-xs mb-8">
                            {moment(message.createdAt).format('ddd, MMM D, YYYY')}
                        </div>
                    )}
                    {selectedChatType === "direct-message" && renderDmMessages(message)}
                </div>
            );
        });
    };

    // Downloads files
    const downloadFile = async (fileUrl, fileName) => {
        setIsDownloading(true);
        const dateTime = new Date();
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };

        try {
            // Fetch the file data from the provided URL
            const response = await fetch(fileUrl);

            if (!response.ok) {
                throw new Error('File download failed');
            }

            // Get total size from headers
            const contentLength = response.headers.get('Content-Length');
            const total = parseInt(contentLength, 10);

            // Create a writable stream to download the file
            const reader = response.body.getReader();
            const chunks = [];
            let loaded = 0;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                chunks.push(value);
                loaded += value.length;

                // Calculate the percentage completed
                const percentCompleted = Math.round((loaded * 100) / total);
                setDownloadProgress(percentCompleted);
            }

            // Create a blob from the chunks
            const blob = new Blob(chunks);

            // Create a link element in the DOM
            const link = document.createElement('a');

            // Create a download URL for the blob data
            const url = window.URL.createObjectURL(blob);

            // Set the link's href to the blob URL
            link.href = url;

            // Set the download attribute to the provided file name
            link.download = fileName;

            // Append the link to the document body (required for some browsers)
            document.body.appendChild(link);

            // Trigger a click event on the link to download the file
            link.click();

            // Clean up by removing the link element and revoking the object URL
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            setIsDownloading(false);

            toast.success(`File Downloaded Successfully`, {
                description: (
                    `${dateTime.toLocaleDateString(undefined, options)} ${dateTime.toLocaleTimeString()}`,
                    <Progress value={100} className="mt-2" />
                ),
                action: {
                    label: "Done",
                    onClick: () => console.log("file download successful"),
                }
            });

        } catch (error) {
            setIsDownloading(false);
            toast.error(`Error Downloading File!`, {
                description: `${dateTime.toLocaleDateString(undefined, options)} ${dateTime.toLocaleTimeString()}`,
                action: {
                    label: "Done",
                    onClick: () => console.log("error whilst downloading file", error),
                }
            });
        }
    };



    // Render direct message
    const renderDmMessages = (message) => {
        return (
            <div className={(message.sender !== selectedChatData.id ? 'text-right ' : 'text-left ') + 'mb-3'}>

                {message.messageType === 'text' && (
                    <Badge
                        variant={message.sender !== selectedChatData.id ? 'default' : 'outline'}
                        className={`p-2 text-left px-4 text-sm max-w-[90%] text-wrap break-words whitespace-pre-wrap ${message.sender !== selectedChatData.id ? 'rounded-br-none' : 'rounded-bl-none'}`}
                    >
                        {message.content}
                    </Badge>
                )}

                {message.messageType === 'file' && (
                    <Badge
                        variant='outline'
                        className={`text-left p-2 pb-1 text-sm text-wrap max-w-[90%] break-words whitespace-pre-wrap ${message.sender !== selectedChatData.id ? 'rounded-br-none' : 'rounded-bl-none'}`}
                    >
                        {checkIfImg(message.fileUrl) ?

                            <div className="cursor-pointer" onClick={() => {
                                setShowImage(true)
                                setImgUrl(message.fileUrl)
                            }}>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <img src={message.fileUrl} alt="" onClick={() => downloadFile(message.fileUrl, message.originalFileName)} className="rounded-[8px]" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Download Image</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                            </div>
                            :
                            <div className="flex gap-2 text-[12px] p-2 items-center justify-center">
                                <File size={16} />
                                {message.originalFileName}
                                <Download size={16} className="cursor-pointer"
                                    onClick={() => {
                                        downloadFile(message.fileUrl, message.originalFileName)
                                    }} />
                            </div>}

                    </Badge>
                )}

                <div className="font-semibold text-slate-800/70 text-[10px] my-1 dark:text-white/70">
                    {moment(message.createdAt).format('LT')}
                </div>
            </div>
        );
    };

    return (
        <CardContent className="w-full overflow-hidden dark:bg-white/5 mt-4 border-gray-100 border-2 dark:border-0 p-0 flex-1 rounded-2xl mb-2">
            <ScrollArea className="h-full w-full rounded-md p-4 ">
                {renderMessages()}
                <div ref={scrollRef}></div>
            </ScrollArea>
        </CardContent>
    );
}

export default ChatsSection;
