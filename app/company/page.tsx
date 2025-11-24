"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { DataTable } from "./data-table";

import { companieservice } from "../api/companiesService";
import { CompanyFormData } from "../types/company";
import { columns } from "./columns";
import NovaCompanyModal from "./new-company";

export default function Companies() {
  const [token, setToken] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [companies, setCompanies] = useState<CompanyFormData[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyFormData | null>(null);

  const columnsDef = columns({
    onEdit: (company) => {
      setSelectedCompany(company);
      setModalOpen(true);
    },
    onDelete: (company) => {
      handleDeleteCompany(company);
    },
  });

  useEffect(() => {
    setToken(sessionStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (token) fetchCompanies();
  }, [token]);

  const fetchCompanies = async () => {
    try {
      const data = await companieservice.list();
      setCompanies(data);
    } catch (error) {
      console.error("Erro ao buscar empresas:", error);
    }
  };

  const filteredCompanies = companies.filter((company) => {
    const matchesName = company.name.toLowerCase().includes(search.toLowerCase());
    const matchesPlan = selectedPlan ? company.subscriptionPlan?.name === selectedPlan : true;
    return matchesName && matchesPlan;
  });

  const uniquePlans = [...new Set(companies.map((c) => c.subscriptionPlan?.name))].filter(Boolean);

  const hasFilters = search || selectedPlan;

  const clearFilters = () => {
    setSearch("");
    setSelectedPlan("");
  };

  const handleDeleteCompany = (company: CompanyFormData) => {
    setSelectedCompany(company);
    setDialogOpen(true);
  };

  const confirmDeleteCompany = async () => {
    if (!selectedCompany?.id) return;

    try {
      await companieservice.delete(selectedCompany.id);
      setCompanies((prev) => prev.filter((c) => c.id !== selectedCompany.id));
    } catch (err) {
      console.error("Erro ao deletar empresa:", err);
    } finally {
      setDialogOpen(false);
      setSelectedCompany(null);
    }
  };

  return (
    <div className="flex flex-col items-start p-6 space-y-6 sm:ml-14">

      <div className="flex justify-between items-center w-full">
        <h1 className="text-3xl font-bold tracking-tight">Minhas Empresas</h1>

        <Button className="cursor-pointer" onClick={() => { setSelectedCompany(null); setModalOpen(true); }}>
          Nova Empresa
        </Button>
      </div>

      <div className="flex gap-4 w-full mb-4">

        <div className="relative w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome da empresa"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedPlan} onValueChange={setSelectedPlan}>
          <SelectTrigger className="w-1/4">
            <SelectValue placeholder="Filtrar por plano" />
          </SelectTrigger>

          <SelectContent>
            {uniquePlans.map((plan) => (
              <SelectItem key={plan} value={plan}>
                {plan}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="outline" className="flex gap-2 cursor-pointer" onClick={clearFilters}>
            <X className="h-4 w-4" />
            Limpar
          </Button>
        )}
      </div>

      <DataTable
        columns={columnsDef}
        data={filteredCompanies}
        onEdit={(company) => { setSelectedCompany(company); setModalOpen(true); }}
        onDelete={handleDeleteCompany}
      />

      <NovaCompanyModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onCompanyCreated={fetchCompanies}
        initialData={selectedCompany}
      />

      <ConfirmationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={confirmDeleteCompany}
        onCancel={() => setDialogOpen(false)}
        title="Confirmar Exclusão"
        description={`Deseja excluir a empresa "${selectedCompany?.name}"?`}
      />
    </div>
  );
}
