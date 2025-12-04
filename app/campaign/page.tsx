"use client";

import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Search, Send, Target, TrendingUp, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { campaignService } from "../api/campaignService";
import { CampaignFormData } from "../types/campaign";
import { statusOptions } from "../types/statusOptions";
import { columns } from "./columns";
import NovaCampanhaModal from "./new-campaign";


export default function MinhasCampanhas() {
    const [search, setSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [campaigns, setCampaigns] = useState<CampaignFormData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<CampaignFormData | null>(null);

    const columnsDef = columns({
        onEdit: (campaign) => {
            setSelectedCampaign(campaign);
            setModalOpen(true);
        },
        onDelete: (campaign) => {
            handleDeleteCampaign(campaign);
        },
    });

    const clearFilters = () => {
        setSearch("");
        setSelectedStatus("");
    };

    const hasActiveFilters = search || selectedStatus;

    const filteredCampaigns = campaigns.filter((campaign: CampaignFormData) => {
        return (
            campaign.name.toLowerCase().includes(search.toLowerCase()) &&
            (selectedStatus ? campaign.status === selectedStatus : true)
        );
    });

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
    }, []);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            setLoading(true);

            const data = await campaignService.list();

            setCampaigns(data);
        } catch (error) {
            console.error("Erro ao buscar campanhas:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCampaignCreated = () => {
        fetchCampaigns();
    };



    const getStatusLabel = (status: string) => {
        const statusObj = statusOptions.find((option) => option.value === status);
        return statusObj ? statusObj.label : status;
    }


    const getStatusColor = (status: string) => {
        const statusObj = statusOptions.find((option) => option.value === status);
        return statusObj ? statusObj.color : "bg-transparent";
    };

    const handleDeleteCampaign = async (campaign: CampaignFormData) => {
        setSelectedCampaign(campaign);
        setDialogOpen(true);
    };

    const confirmDeleteCampaign = async () => {
        if (!selectedCampaign) return;
        setLoading(true);

        try {
            await campaignService.delete(selectedCampaign.id!);
            setCampaigns((prev) => prev.filter((c) => c.id !== selectedCampaign.id));
        } catch (error) {
            console.error("Erro ao deletar:", error);
        } finally {
            setLoading(false);
            setDialogOpen(false);
            setSelectedCampaign(null);
        }
    };

    const formatDate = (date: Date | undefined) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('pt-BR');
    };

    const handleToggleCampaignStatus = async (campaign: CampaignFormData) => {
        try {
            setLoading(true);
            let newStatus: string;

            // Se for DRAFT, inicia a campanha como ACTIVE
            if (campaign.status === 'DRAFT') {
                newStatus = 'ACTIVE';
            } else {
                // Alterna entre ACTIVE e PAUSED
                newStatus = campaign.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
            }

            await campaignService.update(campaign.id!, {
                ...campaign,
                status: newStatus
            });


            setCampaigns((prev) =>
                prev.map((c) =>
                    c.id === campaign.id ? { ...c, status: newStatus } : c
                )
            );
        } catch (error) {
            console.error('Erro ao atualizar status da campanha:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-start p-6 space-y-6 sm:ml-14">
            <div className="flex justify-between w-full mb-6">
                <h1 className="text-3xl font-semibold">Minhas Campanhas</h1>
                <Button className="ml-4" onClick={() => { setSelectedCampaign(null); setModalOpen(true); }}>
                    Nova Campanha
                </Button>
            </div>

            <div className="flex gap-4 w-full mb-4">
                <div className="relative w-1/3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Buscar por nome da campanha"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-1/4">
                        <SelectValue placeholder="Filtrar por Status" />
                    </SelectTrigger>
                    <SelectContent>
                        {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.label}>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${option.color}`} />
                                    {option.label}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {hasActiveFilters && (
                    <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                        <X className="h-4 w-4" />
                        Limpar Filtros
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Campanhas Ativas</h3>
                        <Send className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {campaigns.filter(c => c.status === 'ACTIVE').length}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Em execução</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Total de Envios</h3>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">1.305</div>
                        <p className="text-xs text-muted-foreground mt-1">Este mês</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Taxa de Resposta</h3>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">83%</div>
                        <p className="text-xs text-muted-foreground mt-1">Média geral</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <h3 className="text-sm font-medium text-muted-foreground">NPS Médio</h3>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">73</div>
                        <p className="text-xs text-muted-foreground mt-1">Todas campanhas ativas</p>
                    </CardContent>
                </Card>
            </div>

            <div className="w-full space-y-4">
                {filteredCampaigns.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        Nenhuma campanha encontrada
                    </div>
                ) : (
                    filteredCampaigns.map((campaign) => {
                        const npsScore = Math.floor(Math.random() * 30) + 60;
                        const enviadas = Math.floor(Math.random() * 500) + 200;
                        const respostas = Math.floor(enviadas * (0.7 + Math.random() * 0.3));
                        const taxa = Math.floor((respostas / enviadas) * 100);
                        const progresso = taxa;

                        return (
                            <Card key={campaign.id} className="w-full">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold">{campaign.name}</h3>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(campaign.status)} text-white`}>
                                                    {getStatusLabel(campaign.status)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{campaign.description}</p>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(campaign.createdAt)} - {formatDate(campaign.closedAt)}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-4xl font-bold">{npsScore}</div>
                                            <div className="text-xs text-muted-foreground">NPS Score</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                                        <div>
                                            <div className="text-xs text-muted-foreground">Enviadas</div>
                                            <div className="text-lg font-semibold">{enviadas}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-muted-foreground">Respostas</div>
                                            <div className="text-lg font-semibold">{respostas}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-muted-foreground">Taxa</div>
                                            <div className="text-lg font-semibold text-yellow-600">{taxa}%</div>
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-muted-foreground">Progresso</span>
                                            <span className="text-xs font-medium">{progresso}%</span>
                                        </div>
                                        <Progress value={progresso} className="h-2" />
                                    </div>

                                    <div className="flex gap-2 mt-4 pt-4 border-t">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedCampaign(campaign);
                                                setModalOpen(true);
                                            }}
                                            className="w-[130px]"
                                        >
                                            Ver Detalhes
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled
                                            className="w-[130px]"
                                        >
                                            Relatório
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleToggleCampaignStatus(campaign)}
                                            disabled={loading}
                                            className="w-[130px]"
                                        >
                                            {campaign.status === 'DRAFT' ? 'Iniciar' : campaign.status === 'ACTIVE' ? 'Pausar' : 'Retomar'}
                                        </Button>
                                    </div>
                                </CardHeader>
                            </Card>
                        );
                    })
                )}
            </div>

            <NovaCampanhaModal open={modalOpen} onOpenChange={setModalOpen} onCampaignCreated={handleCampaignCreated} initialData={selectedCampaign} />

            <ConfirmationDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onConfirm={confirmDeleteCampaign}
                onCancel={() => setDialogOpen(false)}
                title="Confirmar Exclusão"
                description={`Você tem certeza que deseja excluir a campanha "${selectedCampaign?.name}"?`}
            />

        </div>
    );
}
