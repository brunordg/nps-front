"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Payment = {
    id?: number;
    document: string;
    name: string;
    subscriptionPlan: SubscriptionPlan | null;
    createdAt?: Date;
    updatedAt?: Date;
    subscription_plan_id: string;
}

export const columns: ColumnDef<Payment>[] = [
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
    }
]

