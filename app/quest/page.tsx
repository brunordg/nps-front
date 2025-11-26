"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

type Question = {
  id: string;
  title: string;
  type: "short" | "multiple" | "checkbox" | "nps";
  options: string[];
  required: boolean;
};

export default function FormBuilder() {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: crypto.randomUUID(),
      title: "",
      type: "short",
      options: [],
      required: false,
    },
  ]);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: "",
        type: "short",
        options: [],
        required: false,
      },
    ]);
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const addOption = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, options: [...q.options, `Opção ${q.options.length + 1}`] }
          : q
      )
    );
  };

  const selectNpsValue = (id: string, value: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, options: [String(value)] } : q
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="max-w-3xl w-full space-y-4">
        
        <Card className="border-t-4 border-gray-500 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <Input
              placeholder="Título do formulário"
              className="text-2xl font-semibold bg-transparent shadow-none focus-visible:ring-0"
            />
            <Input
              placeholder="Descrição do formulário"
              className="bg-transparent shadow-none focus-visible:ring-0"
            />
          </CardContent>
        </Card>
        
        {questions.map((q) => (
          <Card key={q.id} className="shadow-sm">
            <CardContent className="p-6 space-y-4">

              <div className="flex items-start justify-between gap-4">
                <Input
                  placeholder="Escreva a pergunta"
                  value={q.title}
                  onChange={(e) => updateQuestion(q.id, "title", e.target.value)}
                  className="flex-1"
                />

                <div className="flex flex-col items-end gap-2">
                  <Select
                    value={q.type}
                    onValueChange={(v) => updateQuestion(q.id, "type", v)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Resposta curta</SelectItem>
                      <SelectItem value="paragraph">Parágrafo</SelectItem>
                      <SelectItem value="multiple">Múltipla escolha (rádio)</SelectItem>
                      <SelectItem value="checkbox">Múltipla escolha (checkbox)</SelectItem>
                      <SelectItem value="nps">NPS (0 a 10)</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Obrigatória</span>
                    <Switch
                      checked={q.required}
                      onCheckedChange={(v) => updateQuestion(q.id, "required", Boolean(v))}
                    />
                  </div>
                </div>
              </div>
              
              {(q.type === "multiple" || q.type === "checkbox") && (
                <div className="space-y-2">
                  {q.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <input
                        type={q.type === "checkbox" ? "checkbox" : "radio"}
                        disabled
                        className="mt-1"
                      />
                      <Input
                        value={opt}
                        className="w-full"
                        onChange={(e) => {
                          const newOptions = [...q.options];
                          newOptions[idx] = e.target.value;
                          updateQuestion(q.id, "options", newOptions);
                        }}
                      />
                    </div>
                  ))}

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-700 hover:bg-gray-200"
                    onClick={() => addOption(q.id)}
                  >
                    + Adicionar opção
                  </Button>
                </div>
              )}
              
              {q.type === "nps" && (
                <div className="flex gap-2 flex-wrap">
                  {[...Array(11)].map((_, i) => {
                    const selected = q.options[0] === String(i);

                    return (
                      <div
                        key={i}
                        onClick={() => selectNpsValue(q.id, i)}
                        className={`
                          w-10 h-10 border rounded-md flex items-center justify-center cursor-pointer transition
                          ${selected ? "bg-gray-800 text-white" : "hover:bg-gray-200"}
                        `}
                      >
                        {i}
                      </div>
                    );
                  })}
                </div>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:bg-red-50"
                onClick={() => removeQuestion(q.id)}
              >
                <Trash2 className="w-4 h-4 mr-1" /> Remover pergunta
              </Button>

            </CardContent>
          </Card>
        ))}
        
        <div className="flex justify-center">
          <Button
            onClick={addQuestion}
            className="bg-gray-800 hover:bg-gray-700 text-white"
          >
            <Plus className="mr-2 w-4 h-4" /> Adicionar pergunta
          </Button>
        </div>

      </div>
    </div>
  );
}
