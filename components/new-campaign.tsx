"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";


interface CampaignFormData {
  name: string;
  description: string;
  status: string;
  createdAt?: Date;
  publishedAt?: Date;
  closedAt?: Date;
}

const statusOptions = [
  { label: "Rascunho", value: "DRAFT", color: "bg-gray-400" },
  { label: "Agendada", value: "SCHEDULED", color: "bg-yellow-400" },
  { label: "Ativa", value: "ACTIVE", color: "bg-green-500" },
  { label: "Pausada", value: "PAUSED", color: "bg-orange-400" },
  { label: "Finalizada", value: "COMPLETED", color: "bg-gray-500" },
  { label: "Inativa", value: "INACTIVE", color: "bg-red-500" },
];

export default function NovaCampanhaModal({ open, onOpenChange, onCampaignCreated }: { open: boolean; onOpenChange: (open: boolean) => void; onCampaignCreated: () => void; }) {
  const [campaigns, setCampaigns] = useState<CampaignFormData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [formData, setFormData] = useState<CampaignFormData>({
    name: "",
    description: "",
    status: "",
    createdAt: undefined,
    publishedAt: undefined,
    closedAt: undefined,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/campaigns`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar campanhas.");

        const data = await res.json();
        setCampaigns(data); // Preenche o estado com as campanhas recebidas
      } catch (error) {
        console.error("Erro ao buscar campanhas:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchCampaigns(); // Chama a função somente se o token existir
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      
      const bodyData = {
        ...formData,        
        company: { id: 1 }
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/campaigns`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) throw new Error("Erro ao cadastrar campanha.");

      onCampaignCreated();

    } catch (error) {
      console.error(error);
    } finally {
      setFormData({ name: "", description: "", status: "", createdAt: undefined, publishedAt: undefined, closedAt: undefined });
      onOpenChange(false);
    }
  };

  const handleChange = (field: keyof CampaignFormData, value: string | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderDateField = (label: string, field: keyof CampaignFormData, placeholder: string, selectedDate: Date | undefined) => (
    <div className="grid gap-3">
      <Label className="text-sm font-medium">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={`h-11 justify-start text-left font-normal ${!selectedDate && "text-muted-foreground"}`}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => handleChange(field, date)}
            locale={ptBR}
            disabled={(date) => {              
              if (field === "closedAt" && formData.publishedAt) {
                return date < formData.publishedAt;
              }
              return false; 
            }}
          />

        </PopoverContent>
      </Popover>
    </div >
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Nova Campanha</DialogTitle>
          <DialogDescription className="text-base">Preencha os campos abaixo para criar uma nova campanha de pesquisa.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-6">
            <div className="grid gap-3">
              <Label htmlFor="name" className="text-sm font-medium">Nome da Campanha <span className="text-red-500">*</span></Label>
              <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Ex: NPS Trimestral Q4 2024" required className="h-11" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="description" className="text-sm font-medium">Descrição</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Descreva os objetivos e detalhes da campanha..." rows={4} className="resize-none" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="status" className="text-sm font-medium">Status <span className="text-red-500">*</span></Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)} required>
                <SelectTrigger id="status" className="h-11">
                  <SelectValue placeholder="Selecione o status da campanha" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${option.color}`} />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-6 pt-4 border-t">
              <h3 className="font-semibold text-sm text-gray-700">Datas da Campanha</h3>
              {renderDateField("Data de Publicação", "publishedAt", "Selecione quando será publicada", formData.publishedAt)}
              {renderDateField("Data de Encerramento", "closedAt", "Selecione a data de encerramento", formData.closedAt)}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-11 mr-4">Cancelar</Button>
            <Button type="submit" className="h-11">Criar Campanha</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
