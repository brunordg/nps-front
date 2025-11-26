"use client";

import { campaignService } from "@/app/api/campaignService";
import { CampaignFormData } from "@/app/types/campaign";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";


const statusOptions = [
  { label: "Rascunho", value: "DRAFT", color: "bg-gray-400" },
  { label: "Agendada", value: "SCHEDULED", color: "bg-yellow-400" },
  { label: "Ativa", value: "ACTIVE", color: "bg-green-500" },
  { label: "Pausada", value: "PAUSED", color: "bg-orange-400" },
  { label: "Finalizada", value: "COMPLETED", color: "bg-gray-500" },
  { label: "Inativa", value: "INACTIVE", color: "bg-red-500" },
];

const emptyForm = (): CampaignFormData => ({
  name: "",
  description: "",
  status: "",
  createdAt: undefined,
  publishedAt: undefined,
  closedAt: undefined,
});

export default function NovaCampanhaModal({
  open,
  onOpenChange,
  onCampaignCreated,
  initialData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCampaignCreated: () => void;
  initialData?: CampaignFormData | null;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<CampaignFormData>(emptyForm());

  useEffect(() => {
    if (open) {
      if (initialData) {
        const parsed: CampaignFormData = {
          ...initialData,
          createdAt: initialData.createdAt ? new Date(initialData.createdAt) : undefined,
          publishedAt: initialData.publishedAt ? new Date(initialData.publishedAt) : undefined,
          closedAt: initialData.closedAt ? new Date(initialData.closedAt) : undefined,
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
        await campaignService.update(formData.id, formData);
      } else {
        await campaignService.create(formData);
      }

      onCampaignCreated();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setFormData(emptyForm());
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
          <DialogTitle className="text-2xl">{formData.id ? "Editar Campanha" : "Nova Campanha"}</DialogTitle>
          <DialogDescription className="text-base">Preencha os campos abaixo para criar ou alterar uma campanha de pesquisa.</DialogDescription>
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
            <Button type="button" variant="outline" onClick={() => { setFormData(emptyForm()); onOpenChange(false); }} className="h-11 mr-4">Cancelar</Button>
            <Button type="submit" className="h-11" disabled={loading}>{formData.id ? "Salvar Alterações" : "Criar Campanha"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
