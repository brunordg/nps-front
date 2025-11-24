"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

export type Company = {
    id?: number;
    document: string;
    name: string;
    subscriptionPlan: SubscriptionPlan | null;
    createdAt?: Date;
    updatedAt?: Date;
    subscription_plan_id: string;
}

type ColumnsParams = {
    onEdit: (company: Company) => void;
    onDelete: (company: Company) => void;
};

export const columns = ({ onEdit, onDelete }: ColumnsParams): ColumnDef<Company>[] => [
    {
        accessorKey: "name",
        header: "Nome da Empresa",
    },
    {
        accessorKey: "document",
        header: "Documento",
    },
    {
        accessorKey: "subscriptionPlan.name",
        header: "Plano de Assinatura",
    },
    {
        id: "actions",
        accessorKey: "action",
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
                            <DropdownMenuItem onClick={() => onDelete(row.original)}>Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    }
];
