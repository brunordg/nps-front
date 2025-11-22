"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

type Question = {
  id: string;
  title: string;
  type: "short" | "paragraph" | "multiple";
  options: string[];
};

export default function FormBuilder() {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: crypto.randomUUID(),
      title: "",
      type: "short",
      options: [],
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

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="max-w-3xl w-full space-y-4">

        {/* Header estilo Google Forms minimalista */}
        <Card className="border-t-4 border-gray-500 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <Input
              placeholder="Título do formulário"
              className="text-2xl font-semibold bg-transparent border-none shadow-none focus-visible:ring-0"
            />
            <Input
              placeholder="Descrição do formulário"
              className="bg-transparent border-none shadow-none focus-visible:ring-0"
            />
          </CardContent>
        </Card>

        {/* Perguntas */}
        {questions.map((q) => (
          <Card key={q.id} className="shadow-sm">
            <CardContent className="p-6 space-y-4">

              {/* Título da pergunta + Tipo */}
              <div className="flex justify-between gap-4">
                <Input
                  placeholder="Escreva a pergunta"
                  value={q.title}
                  onChange={(e) => updateQuestion(q.id, "title", e.target.value)}
                />

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
                    <SelectItem value="multiple">Múltipla escolha</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Múltipla escolha */}
              {q.type === "multiple" && (
                <div className="space-y-2">
                  {q.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <input type="radio" disabled className="mt-1" />
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

        {/* Botão Adicionar Pergunta */}
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
