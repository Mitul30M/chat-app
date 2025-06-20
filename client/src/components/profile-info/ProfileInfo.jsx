import React from 'react'
import { CardHeader } from '../ui/card'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import api from "@/lib/api";
import { LOGOUT_ROUTE } from "@/utils/constants";
import { toast } from "sonner";
import { useAppStore } from '@/store';
import { Edit, Edit2, Edit3, LogOut, ThumbsDown, ThumbsUp } from '@geist-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';


function ProfileInfo() {

    const { userInfo, setUserInfo, closeChat } = useAppStore();
    const navigate = useNavigate();

    const logout = async () => {
        const logoutDateTime = new Date();
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        try {
            const response = await api.post(LOGOUT_ROUTE, { withCredentials: true });
            if (response.status === 200) {
                localStorage.setItem('accessToken', null);
                localStorage.setItem('refreshToken', null);

                closeChat()
                setUserInfo(null);
                toast.success(`Account Logout successful!`, {
                    description: `${logoutDateTime.toLocaleDateString(undefined, options)} ${logoutDateTime.toLocaleTimeString()}`,
                    action: {
                        label: "Done",
                        onClick: () => console.log("logged out successfully"),
                    }
                }
                )

                return navigate('/auth');
            }
        } catch (error) {
            toast.error(`Error Logging Out Account!`, {
                description: `${logoutDateTime.toLocaleDateString(undefined, options)} ${logoutDateTime.toLocaleTimeString()}`,
                action: {
                    label: "Done",
                    onClick: () => console.log("error in logging out"),
                }
            }
            );
            return navigate('/chats');
        }
    }

    return (
        <CardHeader className="flex flex-row w-full justify-between items-center gap-2 p-4 border-b-2  dark:border-white ">

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <div className='flex flex-row w-full justify-start items-center gap-2'>
                            <Avatar className="border-2">
                                <AvatarImage src={userInfo.profileImg ? userInfo.profileImg.url : ''} alt={userInfo.name} />

                                <AvatarFallback
                                    className="dark:primary bg-secondary text-xs font-semibold dark:text-primary  text-black text-center"
                                >
                                    {userInfo.firstName && (userInfo.firstName.split('')[0] + userInfo.lastName.split('')[0]).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <h1 className="font-medium text-md">{userInfo.name}</h1>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{userInfo.email}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>


            <div className='flex flex-row justify-center items-center gap-2 '>
                <TooltipProvider>
                    <Button variant="outline" className="h-max p-2 pb-1 w-max rounded-2xl">
                        <Link to={'/profile'}>
                            <Tooltip>
                                <TooltipTrigger><Edit3 size={14} /></TooltipTrigger>
                                <TooltipContent>
                                    <Link to={'/profile'}>
                                        <p>Edit Profile</p>
                                    </Link>
                                </TooltipContent>
                            </Tooltip>
                        </Link>
                    </Button>

                </TooltipProvider>

                <TooltipProvider>
                    <Link to={'/profile'}>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button
                                    onClick={logout}
                                    variant="outline"
                                    className="h-max p-2 flex justify-center items-center w-max rounded-2xl">
                                    <LogOut size={14} color='#DC2626' />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Log Out</p>
                            </TooltipContent>
                        </Tooltip>
                    </Link>
                </TooltipProvider>
            </div>



        </CardHeader>
    )
}

export default ProfileInfo













// < img src = "https://res.cloudinary.com/dksgyvcfl/image/upload/v1725612043/Direct%20Messaging/fxk5bbrqlhflby6xymrk.jpg" alt = "" />