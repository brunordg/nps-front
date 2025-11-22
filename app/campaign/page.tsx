"use client";

import { ConfirmationDialog } from "@/components/confirmation-dialog";
import NovaCampanhaModal from "@/components/new-campaign";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MoreVertical, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { campaignService } from "../api/campaignService";
import { CampaignFormData } from "../types/campaign";


const statusOptions = [
    { label: "Rascunho", value: "DRAFT", color: "bg-gray-400" },
    { label: "Agendada", value: "SCHEDULED", color: "bg-yellow-400" },
    { label: "Ativa", value: "ACTIVE", color: "bg-green-500" },
    { label: "Pausada", value: "PAUSED", color: "bg-orange-400" },
    { label: "Finalizada", value: "COMPLETED", color: "bg-gray-500" },
    { label: "Inativa", value: "INACTIVE", color: "bg-red-500" },
];


export default function MinhasCampanhas() {
    const [search, setSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [campaigns, setCampaigns] = useState<CampaignFormData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<CampaignFormData | null>(null);


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

    const formatDate = (date: string | Date | undefined) => {
        if (!date) return "";
        const dateObj = new Date(date);
        return format(dateObj, "PPP", { locale: ptBR });
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
                                    {option.value}
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

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Campanhas</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-semibold text-gray-600">Nome da Campanha</TableHead>
                                <TableHead className="font-semibold text-gray-600">Data de Início</TableHead>
                                <TableHead className="font-semibold text-gray-600">Data de Término</TableHead>
                                <TableHead className="font-semibold text-gray-600">Status</TableHead>
                                <TableHead className="font-semibold text-gray-600">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">
                                        Carregando...
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCampaigns.map((campaign, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{campaign.name}</TableCell>
                                        <TableCell>{campaign.createdAt ? formatDate(campaign.createdAt) : '-'}</TableCell>
                                        <TableCell>{campaign.closedAt ? formatDate(campaign.closedAt) : '-'}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${getStatusColor(campaign.status)}`} />
                                                    {getStatusLabel(campaign.status)}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <MoreVertical className="h-5 w-5 text-gray-500 cursor-pointer" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={() => { setSelectedCampaign(campaign); setModalOpen(true); }}>
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDeleteCampaign(campaign)}>Excluir</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

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
