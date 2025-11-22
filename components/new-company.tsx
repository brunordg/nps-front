"use client";

import { companieservice } from "@/app/api/companiesService";
import { CompanyFormData } from "@/app/types/company";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";


const subscriptionPlans = [
    { label: "Plano Básico", value: "BASIC" },
    { label: "Plano Pro", value: "PRO" },
    { label: "Plano Enterprise", value: "ENTERPRISE" },
];

const emptyForm = (): CompanyFormData => ({
    name: "",
    document: "",
    subscriptionPlan: null,
    subscription_plan_id: "",
    createdAt: undefined,
    updatedAt: undefined,
});


export default function NovaCompanyModal({
    open,
    onOpenChange,
    onCompanyCreated,
    initialData,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCompanyCreated: () => void;
    initialData?: CompanyFormData | null;
}) {
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<CompanyFormData>(emptyForm());

    useEffect(() => {
        if (open) {
            if (initialData) {
                const parsed: CompanyFormData = {
                    ...initialData,
                    createdAt: initialData.createdAt ? new Date(initialData.createdAt) : undefined,
                    updatedAt: initialData.updatedAt ? new Date(initialData.updatedAt) : undefined,
                };
                setFormData(parsed);
            } else {
                setFormData(emptyForm());
            }
        }
    }, [open, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {

            if (formData.id) {
                await companieservice.update(formData.id, formData);
            } else {
                await companieservice.create(formData);
            }

            onCompanyCreated();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setFormData(emptyForm());
            onOpenChange(false);
        }
    };


    const handleChange = (field: keyof CompanyFormData, value: string | Date | undefined) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">{formData.id ? "Editar Empresa" : "Nova Empresa"}</DialogTitle>
                    <DialogDescription className="text-base">Preencha os campos abaixo para criar ou alterar uma empresa.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 py-6">
                        <div className="grid gap-3">
                            <Label htmlFor="name" className="text-sm font-medium">Nome da Empresa <span className="text-red-500">*</span></Label>
                            <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Ex: Empresa XYZ" required className="h-11" />
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="document" className="text-sm font-medium">Documento</Label>
                            <Input id="document" value={formData.document} onChange={(e) => handleChange("document", e.target.value)} placeholder="CNPJ ou CPF" className="h-11" />
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="subscription_plan_id" className="text-sm font-medium">Plano de Assinatura <span className="text-red-500">*</span></Label>
                            <Select value={formData.subscription_plan_id} onValueChange={(value) => handleChange("subscription_plan_id", value)} required>
                                <SelectTrigger id="subscription_plan_id" className="h-11">
                                    <SelectValue placeholder="Selecione o plano de assinatura" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subscriptionPlans.map((plan) => (
                                        <SelectItem key={plan.value} value={plan.value}>
                                            {plan.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={() => { setFormData(emptyForm()); onOpenChange(false); }} className="h-11 mr-4">Cancelar</Button>
                        <Button type="submit" className="h-11" disabled={loading}>{formData.id ? "Salvar Alterações" : "Criar Empresa"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
