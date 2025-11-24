"use client";

import { ConfirmationDialog } from "@/components/confirmation-dialog";
import NovaCampanhaModal from "@/components/new-campaign";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { campaignService } from "../api/campaignService";
import { CampaignFormData } from "../types/campaign";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { statusOptions } from "../types/statusOptions";


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

            <DataTable
                columns={columnsDef}
                data={filteredCampaigns}
                onEdit={(campaign) => { setSelectedCampaign(campaign); setModalOpen(true); }}
                onDelete={handleDeleteCampaign}
            />

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
