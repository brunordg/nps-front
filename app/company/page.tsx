"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Search, X } from "lucide-react";
import NovaCompanyModal from "@/components/new-company";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ConfirmationDialog } from "@/components/confirmation-dialog";

interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  maxCampaigns: number;
  maxResponsesPerMonth: number;
}

interface CompanyData {
  id: number;
  document: string;
  name: string;
  subscriptionPlan: SubscriptionPlan | null;
  createdAt: string;
  updatedAt: string;
}

export default function Companies() {
  const [token, setToken] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);

  const clearFilters = () => {
    setSearch("");
    setSelectedPlan("");
  };

  const hasActiveFilters = search || selectedPlan;

  const filteredCompanies = companies.filter((company: CompanyData) => {
    return (
      company.name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedPlan ? company.subscriptionPlan?.name === selectedPlan : true)
    );
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) fetchCompanies();
  }, [token]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/companies`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao buscar empresas.");

      const data = await res.json();
      setCompanies(data);
    } catch (error) {
      console.error("Erro ao buscar empresas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyCreated = () => {
    if (token) fetchCompanies();
  };

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "";
    const dateObj = new Date(date);
    return format(dateObj, "PPP", { locale: ptBR });
  };

  const handleDeleteCompany = async (company: CompanyData) => {
    setSelectedCompany(company);
    setDialogOpen(true);
  };

  const confirmDeleteCompany = async () => {
    if (!selectedCompany || !token) return;

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/companies/${selectedCompany.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao deletar empresa.");

      setCompanies((prevCompanies) =>
        prevCompanies.filter((company) => company.id !== selectedCompany.id)
      );
    } catch (error) {
      console.error("Erro ao deletar empresa:", error);
    } finally {
      setLoading(false);
      setDialogOpen(false);
      setSelectedCompany(null);
    }
  };

  // Extrair planos de assinatura únicos para o filtro
  const uniquePlans = Array.from(new Set(companies.map((company) => company.subscriptionPlan?.name))).filter(Boolean);

  return (
    <div className="flex flex-col items-start p-6 space-y-6 sm:ml-14">
      <div className="flex justify-between w-full mb-6">
        <h1 className="text-3xl font-semibold">Minhas Empresas</h1>
        <Button variant="outline" className="ml-4" onClick={() => { setSelectedCompany(null); setModalOpen(true); }}>
          Nova Empresa
        </Button>
      </div>

      <div className="flex gap-4 w-full mb-4">
        <div className="relative w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome da empresa"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedPlan} onValueChange={setSelectedPlan}>
          <SelectTrigger className="w-1/4">
            <SelectValue placeholder="Filtrar por Plano de Assinatura" />
          </SelectTrigger>
          <SelectContent>
            {uniquePlans.map((plan, index) => (
              <SelectItem key={index} value={plan}>
                {plan}
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
          <CardTitle>Empresas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-gray-600">Nome da Empresa</TableHead>
                <TableHead className="font-semibold text-gray-600">Documento</TableHead>
                <TableHead className="font-semibold text-gray-600">Plano de Assinatura</TableHead>
                <TableHead className="font-semibold text-gray-600">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : (
                filteredCompanies.map((company, index) => (
                  <TableRow key={index}>
                    <TableCell>{company.name}</TableCell>
                    <TableCell>{company.document}</TableCell>
                    <TableCell>{company.subscriptionPlan?.name || "Sem plano"}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical className="h-5 w-5 text-gray-500 cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => { setSelectedCompany(company); setModalOpen(true); }}>
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteCompany(company)}>Excluir</DropdownMenuItem>
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

      <NovaCompanyModal open={modalOpen} onOpenChange={setModalOpen} onCompanyCreated={handleCompanyCreated} initialData={selectedCompany} />

      <ConfirmationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={confirmDeleteCompany}
        onCancel={() => setDialogOpen(false)}
        title="Confirmar Exclusão"
        description={`Você tem certeza que deseja excluir a empresa "${selectedCompany?.name}"?`}
      />
    </div>
  );
}
