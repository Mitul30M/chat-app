import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Card, } from "@/components/ui/card";
import { redirect, useActionData, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import api from "@/lib/api";
import LoginTabContent from "@/components/auth/LoginTabContent";
import SignUpTabContent from "@/components/auth/SignUpTabContent";
import { useAppStore } from "@/store";
import { useEffect } from "react";

const Auth = () => {

    const { setUserInfo } = useAppStore();
    const actionData = useActionData();
    const { user, tokens } = actionData || {};
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setUserInfo(user);
            return navigate('/profile');
        }
    }, [user, setUserInfo, navigate])



    return (
        <div className="w-full h-[100vh] dark:bg-background flex flex-col gap-8 items-center justify-center">

            <Tabs defaultValue="Login" className="w-[400px]  flex justify-center items-center flex-col gap-4 rounded-md">

                <TabsList className="rounded-full w-fit  ">
                    <TabsTrigger
                        className=" data-[state=active]:bg-primary rounded-full font-semibold w-full data-[state=inactive]:bg-white dark:data-[state=inactive]:bg-background  data-[state=active]:text-gray-50 px-6 data-[state=inactive]:shadow-sm rounded-r-none"
                        value="Login">Login</TabsTrigger>

                    <TabsTrigger
                        className=" data-[state=active]:bg-primary rounded-full font-semibold w-full data-[state=inactive]:bg-white dark:data-[state=inactive]:bg-background  data-[state=active]:text-gray-50 px-6 data-[state=inactive]:shadow-sm rounded-l-none"
                        value="SignUp">SignUp</TabsTrigger>
                </TabsList>

                <Card className="dark:bg-[#030712]" >
                    <LoginTabContent />
                    <SignUpTabContent />
                </Card>
            </Tabs>

        </div>
    );
};

export default Auth;



export async function action({ request }) {
    const formData = await request.formData();
    const mode = formData.get('mode');

    if (mode === 'login') {

        // Handle login
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const response = await api.post(LOGIN_ROUTE, { email, password }, { withCredentials: true });

            const { user, tokens } = response.data;
            const loginDateTime = new Date();
            const options = {
                weekday: 'short',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            };
            localStorage.setItem('accessToken', tokens.accessToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);
            toast.success(`Account Login successful!`, {
                description: `${loginDateTime.toLocaleDateString(undefined, options)} ${loginDateTime.toLocaleTimeString()}`,
                action: {
                    label: "Done",
                    onClick: () => console.log(user, tokens),
                },
            });
            redirect('/profile');
            return { user, tokens };
            // return redirect('/'); // Redirect to chatapp
        } catch (error) {
            toast.error('Login failed');
            return null;
        }

    } else if (mode === 'signup') {
        // Handle signup
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const response = await api.post(SIGNUP_ROUTE, { firstName, lastName, email, password }, { withCredentials: true });

            const { user, tokens } = response.data;
            const loginDateTime = new Date();
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            };
            localStorage.setItem('accessToken', tokens.accessToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);
            toast.success(`Account Registered successfully!`, {
                description: `${loginDateTime.toLocaleDateString(undefined, options)} ${loginDateTime.toLocaleTimeString()}`,
                action: {
                    label: "Done",
                    onClick: () => console.log(user, tokens),
                },
            });
            redirect('/profile');
            return { user, tokens };
            // return redirect('/'); // Redirect to  login page
        } catch (error) {
            toast.error('Signup failed');
            return null;
        }
    }
}