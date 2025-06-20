import Back from "@/components/ui/icons/Back";
import { useAppStore } from "@/store"
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Link, useNavigate, Form, redirect, useNavigation } from "react-router-dom";
import { Input } from "@/components/ui/input"
import Trash from "@/components/ui/icons/Trash";
import Plus from "@/components/ui/icons/Plus";
import { Button } from "@/components/ui/button";
import { Loader, Save, ThumbsDown, ThumbsUp } from '@geist-ui/icons'

import api from "@/lib/api";
import { USER_PROFILE, USER_PROFILE_IMG } from "@/utils/constants";
import { toast } from "sonner";
import { useTheme } from "@/components/theme-provider/ThemeProvider";

const Profile = () => {

    const navigate = useNavigate();
    const { userInfo, setUserInfo } = useAppStore();
    const [firstName, setFirstName] = useState(userInfo.firstName);
    const [email, setEmail] = useState(userInfo.email);
    const [lastName, setLastName] = useState(userInfo.lastName);
    const [profileImg, setProfileImg] = useState(userInfo.profileImg ? userInfo.profileImg.url : '');
    const [hover, setHover] = useState(false);
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const { theme } = useTheme();

    useEffect(() => {
        if (userInfo.profileSetup) {
            setFirstName(userInfo.firstName);
            setLastName(userInfo.lastName);
            setProfileImg(userInfo.profileImg ? userInfo.profileImg.url : '')
        }
    }, [userInfo]);

    const saveChanges = async (evt) => {
        const dateTime = new Date();
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        evt.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData(evt.target);
            formData.append('email', email);
            if (fileInputRef.current.files[0]) {
                formData.append("profileImg", fileInputRef.current.files[0]);
            }
            const response = await api.patch(USER_PROFILE, formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",// Important for sending files
                },
            });
            if (response.status === 200 && response.data) {
                setUserInfo(response.data);
                toast.success(`Account Update successful!`, {
                    description: `${dateTime.toLocaleDateString(undefined, options)} ${dateTime.toLocaleTimeString()}`,
                    action: {
                        label: "Done",
                        onClick: () => console.log("account info updated successfully"),
                    }
                }
                )
                return navigate('/chats');
            }
        } catch (error) {
            toast.error(`Error Updating Profile!`, {
                description: `${dateTime.toLocaleDateString(undefined, options)} ${dateTime.toLocaleTimeString()}`,
                action: {
                    label: "Done",
                    onClick: () => console.log("error in account info updation"),
                }
            }
            )
        } finally {
            setLoading(false);
        }

    };


    const handleFileInputClick = () => {
        fileInputRef.current.click();
    }

    const handleImgChange = async (evt) => {
        const file = evt.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setProfileImg(reader.result);
            }
            reader.readAsDataURL(file);
        }
    }

    const handleImgDelete = async (evt) => {
        console.log("delete img");
        try {
            if (userInfo.profileImg.url.length) {
                const response = await api.delete(USER_PROFILE_IMG, {
                    withCredentials: true,
                });
                if (response.status === 200 && response.data) {
                    setUserInfo(response.data);
                    toast(
                        <p className="font-medium flex gap-4 items-center text-teal-600 text-sm">
                            <ThumbsUp />
                            Profile Image Removed!
                        </p>
                    );
                } else {
                    throw new Error(response);
                }
            } else {
                setProfileImg('');
                toast(
                    <p className="font-medium flex gap-4 items-center text-teal-600 text-sm">
                        <ThumbsUp />
                        Profile Image Removed!
                    </p>
                );
            }
        } catch (error) {
            toast(
                <p className="font-medium flex gap-4 items-center text-rose-600 text-sm">
                    <ThumbsDown />
                    Error Deleting Profile Image!
                </p>
            );
        }
    }

    return (
        <div className="w-[100%] h-[100vh] dark:bg-background  flex items-center justify-center gap-12">

            <Card className="flex flex-col  dark:bg-background dark:gap-2">

                <CardHeader className="flex flex-row p-1 border-gray-200 dark:border-b-[1px] border-b-[1px] items-center gap-0 justify-center ">
                    <Link to='..' className="w-max p-4 ">
                        <Back w={14} fillColor={theme === 'light' ? 'black' : 'white'} h={14} className=" cursor-pointer" />
                    </Link>
                    <CardTitle className="mb-2">Profile Setup</CardTitle>
                </CardHeader>

                <CardContent className="flex min-w-16 flex-col p-2  md:flex-row gap-2 md:gap-2">

                    <div
                        className=" relative flex justify-center items-center p-2"
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                    >
                        <Avatar className="w-40 h-40 flex justify-start items-end self-start" >
                            <AvatarImage src={profileImg} className="object-cover  w-full h-full border-4 rounded-full" />
                            <div
                                onClick={handleImgDelete}
                                className={`absolute w-full h-full rounded-full flex justify-center items-center  hover:cursor-pointer z-20`}>
                                {profileImg && hover && <Trash w={30} h={30} fillColor={'white'} />}
                            </div>
                            <AvatarFallback className="bg-secondary border-4 text-4xl font-semibold text-primary text-center">
                                <div
                                    onClick={handleFileInputClick}
                                    className={`absolute w-full h-full rounded-full flex justify-center items-center hover:cursor-pointer ${hover ? 'bg-primary/10' : 'bg-transparent'} z-20`}>
                                    {!profileImg && hover && <Plus w={30} h={30} fillColor={'white'} />}
                                </div>
                                {firstName && (firstName.split('')[0] + lastName.split('')[0]).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="w-full p-2">

                        <Form onSubmit={saveChanges} encType="multipart/form-data" className="flex-col flex gap-4 items-end justify-center">
                            <Input
                                type="text"
                                name="firstName"
                                id="firstName"
                                required
                                onChange={e => setFirstName(e.target.value)}
                                placeholder="First Name" value={firstName}
                                className="rounded-md w-80  text-sm font-semibold  border-2"
                            />

                            <Input
                                type="text"
                                name="lastName"
                                id="lastName"
                                required
                                onChange={e => setLastName(e.target.value)}
                                placeholder="Last Name" value={lastName}
                                className="rounded-md w-80  text-sm font-semibold  border-2"
                            />

                            <Input
                                type="email"
                                name="email"
                                id="email"
                                disabled
                                required
                                placeholder="Email" value={email}
                                className="rounded-md w-80  text-sm font-semibold  border-2"
                            />

                            <Input
                                className="hidden w-80"
                                onChange={handleImgChange}
                                accept=".png, .jpg, .jpeg, .svg, .webp"
                                type="file"
                                ref={fileInputRef}
                            />


                            <CardFooter className="p-0">
                                <Button disabled={loading} className="flex gap-2 hover:shadow-md " type="submit">
                                    {
                                        loading ?
                                            <Loader size={20} color="white" />
                                            :
                                            <Save size={20} color="white" />

                                    }
                                    {loading ? 'Saving' : 'Save'}
                                </Button>
                            </CardFooter>


                        </Form>

                    </div>


                </CardContent>

            </Card>

        </div>

    )
}

export default Profile

