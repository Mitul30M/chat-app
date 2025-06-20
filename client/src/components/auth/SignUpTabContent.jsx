import React from 'react'
import { TabsContent, } from "@/components/ui/tabs";
import reactLogo from '../../assets/react.svg';
import Google from '../ui/icons/Google';
import Github from '../ui/icons/Github';
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
import { toast } from "sonner";
import { SIGNUP_ROUTE } from "@/utils/constants";
import api from "@/lib/api";

function SignUpTabContent() {

    const submit = useSubmit();
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append('mode', 'signup');
        submit(formData, { method: 'post' });
    };

    return (
        <TabsContent value="SignUp">
            <Form onSubmit={handleSubmit}>
                <Card className="mx-auto max-w-sm shadow-none border-0 dark:border-0 ">
                    <CardHeader>
                        <div className="flex gap-3 mb-6 items-center justify-center">
                            <img src={reactLogo} alt="React Logo" className="w-8" />
                            <h1 className=" text-xl font-semibold  ">Direct Messaging</h1>
                        </div>
                        <CardDescription>
                            Enter your information to create an account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="first-name" className="text-left">First name</Label>
                                    <Input
                                        id="first-name"
                                        name="firstName"
                                        placeholder="Max" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="last-name" className="text-left">Last name</Label>
                                    <Input
                                        id="last-name"
                                        name="lastName"
                                        placeholder="Robinson"
                                        required />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-left" htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-left" htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password" />
                            </div>
                            <Button type="submit" className="w-full">
                                Create an account
                            </Button>
                            <Button variant="outline" className="w-full flex justify-center gap-2">
                                <Google />
                                SignUp with Google
                            </Button>
                            <Button variant="outline" className="w-full gap-2 flex justify-center">
                                <Github />
                                SignUp with GitHub
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <a href="#" className="underline hover:text-primary">
                                Sign in
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </Form>
        </TabsContent>
    )
}

export default SignUpTabContent