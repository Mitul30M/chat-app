import React from 'react'
import { TabsContent, } from "@/components/ui/tabs";
import reactLogo from '../../assets/react.svg';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, useSubmit } from "react-router-dom";
import Google from '../ui/icons/Google';
import Github from '../ui/icons/Github';


function LoginTabContent() {

    const submit = useSubmit();
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append('mode', 'login');
        submit(formData, { method: 'post' });
    };

    return (
        <TabsContent value="Login">
            <Form onSubmit={handleSubmit}>
                <Card className="mx-auto max-w-sm shadow-none border-0 dark:border-0 ">
                    <CardHeader>
                        <div className="flex gap-3 mb-6 items-center justify-center">
                            <img src={reactLogo} alt="React Logo" className="w-8 " />
                            <h1 className=" text-xl font-semibold ">Direct Messaging</h1>
                        </div>
                        <CardDescription>
                            Enter your email below to login to your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-left">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a href="#" className="ml-auto inline-block text-sm underline">
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required />
                            </div>
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                            <Button variant="outline" className="w-full flex justify-center gap-2">
                                <Google />
                                Login with Google
                            </Button>
                            <Button variant="outline" className="w-full gap-2 flex justify-center">
                                <Github />
                                Login with GitHub
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <a href="#" className="underline hover:text-primary">
                                Sign up
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </Form>
        </TabsContent>
    )
}

export default LoginTabContent;