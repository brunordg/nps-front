"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { authService } from "../api/authService";
import { toast, Toaster } from "sonner";


export default function Login() {

    const router = useRouter();

    const errorRef = useRef<HTMLParagraphElement | null>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        setIsLoading(true);

        try {

            const res = await authService.login(email, password);

            console.log('Login successful:', res);

            sessionStorage.setItem('token', res.token)
            sessionStorage.setItem("userEmail", email)

            router.push('/');

        } catch (err: any) {
            console.error('Login failed:', err);
            toast.error(err.message || "Erro ao fazer login");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-svh items-center justify-center">
            <div className="w-full max-w-md">
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Login na sua conta</CardTitle>
                            <CardDescription>Por favor, insira suas credenciais para continuar</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form>
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="email">Email</FieldLabel>
                                        <Input id="email" type="email" placeholder="m@example.com" required onChange={(e) => setEmail(e.target.value)} value={email} />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
                                        <Input id="password" type="password" placeholder="********" required className="w-full" onChange={(e) => setPassword(e.target.value)} value={password} />
                                        <div className="flex justify-end mt-2">
                                            <a href="#" className="text-sm underline-offset-4 hover:underline">Esqueceu a senha?</a>
                                        </div>
                                    </Field>
                                    <Field>
                                        <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
                                            {isLoading ? (
                                                <span className="flex items-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Logging in...
                                                </span>
                                            ) : (
                                                "Login"
                                            )}
                                        </Button>

                                        <Button variant="outline" type="button">Login com Google</Button>
                                        <FieldDescription className="text-center">
                                            Não tem uma conta? <a href="/signup" className="underline-offset-4 hover:underline">Registre-se</a>
                                        </FieldDescription>
                                    </Field>
                                </FieldGroup>
                            </form>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
