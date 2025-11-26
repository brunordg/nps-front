"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { MoreHorizontal } from "lucide-react";
import { statusOptions } from "../types/statusOptions";

export type Campaign = {
    id?: number;
    name: string;
    description: string;
    status: string;
    createdAt?: Date;
    publishedAt?: Date;
    closedAt?: Date;
}

type ColumnsParams = {
    onEdit: (campaign: Campaign) => void;
    onDelete: (campaign: Campaign) => void;
};


const getStatusLabel = (status: string) => {
    const statusObj = statusOptions.find((option) => option.value === status);
    return statusObj ? statusObj.label : status;
}

const formatDate = (date: string | Date | undefined) => {
    if (!date) return "";
    const dateObj = new Date(date);
    return format(dateObj, "PPP", { locale: ptBR });
};

const getStatusColor = (status: string) => {
    const statusObj = statusOptions.find((option) => option.value === status);
    return statusObj ? statusObj.color : "bg-transparent";
};


export const columns = ({ onEdit, onDelete }: ColumnsParams): ColumnDef<Campaign>[] => [
    {
        accessorKey: "name",
        header: "Nome da Campanha",
    },
    {
        accessorKey: "createdAt",
        header: "Data de Início",
        cell: ({ row }) => {
            return <span className="text-sm">{formatDate(row.original.createdAt)}</span>;
        },
    },
    {
        accessorKey: "closedAt",
        header: "Data de Término",
        cell: ({ row }) => {
            return <span className="text-sm">{formatDate(row.original.closedAt)}</span>;
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            return (
                <div className="flex items-center">
                    <span className={`inline-block h-2 w-2 rounded-full mr-2 ${getStatusColor(status)}`} />
                    <span className="text-sm">{getStatusLabel(status)}</span>
                </div>
            );
        },
    },
    {
        id: "actions",
        accessorKey: "actions",
        header: () => <div className="text-center pr-4">Ações</div>,
        cell: ({ row }) => {
            return (
                <div className="flex justify-center pr-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <MoreHorizontal className="h-5 w-5 text-gray-500 cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>                    
                            <DropdownMenuItem onClick={() => onEdit(row.original)}>
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete(row.original)}>
                                Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    }
];
