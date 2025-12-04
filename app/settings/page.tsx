"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { userService, UserAccount } from "../api/userService";
import { Skeleton } from "@/components/ui/skeleton";

export default function Settings() {
    const [formData, setFormData] = useState({
        id: undefined as number | undefined,
        name: "",
        email: "",
        phone: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [notifications, setNotifications] = useState({
        newResponses: true,
        weeklyReports: true,
        lowNpsAlerts: true,
        newsletter: false,
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log("Buscando dados do usuário...");
                console.log("Session Storage:", sessionStorage.getItem("userEmail"));

                setLoading(true);
                const userEmail = sessionStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");

                if (userEmail) {
                    const userData = await userService.getByEmail(userEmail);
                    setFormData({
                        id: userData.id,
                        name: userData.name || "",
                        email: userData.email || "",
                        phone: userData.phone || "",
                    });
                }
            } catch (error) {
                console.error("Erro ao buscar dados do usuário:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNotificationToggle = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSaveChanges = async () => {
        if (!formData.id) return;

        try {
            setSaving(true);
            await userService.update(formData.id, formData as UserAccount);
            alert("Alterações salvas com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar alterações:", error);
            alert("Erro ao salvar alterações. Tente novamente.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col p-6 space-y-6 sm:ml-14">
            <div className="mb-6">
                <h1 className="text-3xl font-semibold">Configurações</h1>
                <p className="text-muted-foreground mt-1">
                    Gerencie as configurações da sua conta e preferências
                </p>
            </div>

            {/* Informações da Conta */}
            <Card>
                <CardHeader>
                    <CardTitle>Informações da Conta</CardTitle>
                    <CardDescription>Atualize suas informações pessoais</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {loading ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </>
                    ) : (
                        <>

                            <div className="space-y-2">
                                <Label htmlFor="firstName">Nome</Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefone</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>



                            <Button onClick={handleSaveChanges} className="mt-4" disabled={saving}>
                                {saving ? "Salvando..." : "Salvar Alterações"}
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Notificações</CardTitle>
                    <CardDescription>Configure como você deseja ser notificado</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="newResponses" className="text-base font-medium">
                                Novas Respostas
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Receba notificação quando houver novas respostas
                            </p>
                        </div>
                        <Switch
                            id="newResponses"
                            checked={notifications.newResponses}
                            onCheckedChange={() => handleNotificationToggle('newResponses')}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="weeklyReports" className="text-base font-medium">
                                Relatórios Semanais
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Receba um resumo semanal das suas métricas
                            </p>
                        </div>
                        <Switch
                            id="weeklyReports"
                            checked={notifications.weeklyReports}
                            onCheckedChange={() => handleNotificationToggle('weeklyReports')}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="lowNpsAlerts" className="text-base font-medium">
                                Alertas de NPS Baixo
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Notificação quando o NPS cair abaixo de um limite
                            </p>
                        </div>
                        <Switch
                            id="lowNpsAlerts"
                            checked={notifications.lowNpsAlerts}
                            onCheckedChange={() => handleNotificationToggle('lowNpsAlerts')}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="newsletter" className="text-base font-medium">
                                Newsletter
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Receba dicas e novidades sobre NPS
                            </p>
                        </div>
                        <Switch
                            id="newsletter"
                            checked={notifications.newsletter}
                            onCheckedChange={() => handleNotificationToggle('newsletter')}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}