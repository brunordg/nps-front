"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type State = {
    "UF-id": number;
    "UF-sigla": string;
    "UF-nome": string;
};

type City = {
    id: number;
    nome: string;
};

const fetchStates = async (): Promise<State[]> => {
    const statesResponse = await fetch(`${process.env.SERVICO_DADOS}/api/v1/localidades/estados?view=nivelado`);

    const statesData = await statesResponse.json();
    statesData.sort((a: State, b: State) => a["UF-nome"].localeCompare(b["UF-nome"]));
    return statesData;
};

const fetchCities = async (ufId: number): Promise<City[]> => {
    const citiesResponse = await fetch(`${process.env.SERVICO_DADOS}/api/v1/localidades/estados/${ufId}/municipios`);
    const citiesData = await citiesResponse.json();
    citiesData.sort((a: City, b: City) => a.nome.localeCompare(b.nome));
    return citiesData;
};

export default function Signup() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errors, setErrors] = useState({
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        confirmPassword: false,
    });

    const [states, setStates] = useState<State[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        let formErrors = {
            firstName: false,
            lastName: false,
            email: false,
            password: false,
            confirmPassword: false,
        };


        if (!firstName) formErrors.firstName = true;
        if (!lastName) formErrors.lastName = true;
        if (!email || !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) formErrors.email = true;
        if (password !== confirmPassword) formErrors.confirmPassword = true;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) formErrors.password = true;

        setErrors(formErrors);

        if (Object.values(formErrors).includes(true)) {
            toast.error("Por favor, corrija os erros no formulário.");
            return;
        }

        const name = `${firstName} ${lastName}`.trim();

        const company = {
            id: "1",
        };

        const bodyData = {
            company,
            name,
            email,
            password,
        };

        setIsLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user-accounts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                toast.error(errorData.message || "Falha no cadastro.");
                return;
            }

            const data = await res.json();
            toast.success("Cadastro realizado com sucesso!");

            sessionStorage.setItem('token', data.token);

            router.push('/');
        } catch (error) {
            toast.error("Ocorreu um erro ao realizar o cadastro. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStates().then(setStates);
    }, []);

    useEffect(() => {
        if (selectedState) {
            const ufId = states.find((state) => state["UF-sigla"] === selectedState)?.["UF-id"];
            if (ufId) {
                fetchCities(ufId).then(setCities);
            }
        }
    }, [selectedState, states]);

    const handleStateChange = (state: string) => {
        setSelectedState(state);
        setSelectedCity("");
    };

    const handleCityChange = (city: string) => {
        setSelectedCity(city);
    };


    const getInputClass = (field: keyof typeof errors) => {
        return errors[field] ? 'border-red-500 bg-red-50' : '';
    };


    return (
        <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto p-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Crie sua conta</CardTitle>
                        <CardDescription>Preencha os campos abaixo para se cadastrar</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="firstName">Nome</FieldLabel>
                                    <Input
                                        id="firstName"
                                        type="text"
                                        placeholder="João"
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className={`${getInputClass("firstName")
                                            }`}
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="lastName">Sobrenome</FieldLabel>
                                    <Input
                                        id="lastName"
                                        type="text"
                                        placeholder="Silva"
                                        required
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className={`${getInputClass("lastName")
                                            }`}
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="email@exemplo.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`${getInputClass("email")
                                            }`}
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="company">Companhia</FieldLabel>
                                    <Input
                                        id="company"
                                        type="text"
                                        placeholder="Nome da sua empresa"
                                        required
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="phone">Telefone</FieldLabel>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="(99) 99999-9999"
                                        required
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="state">Estado</FieldLabel>
                                    <Select value={selectedState} onValueChange={handleStateChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o estado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {states.map((state) => (
                                                <SelectItem key={state["UF-id"]} value={state["UF-sigla"]}>
                                                    {state["UF-nome"]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="city">Cidade</FieldLabel>
                                    <Select value={selectedCity} onValueChange={handleCityChange} disabled={!selectedState}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione a cidade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cities.map((city) => (
                                                <SelectItem key={city.id} value={city.nome}>
                                                    {city.nome}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="password"
                                        className={`${getInputClass("password")
                                            }`}
                                    />
                                    <FieldDescription>
                                        Sua senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números.
                                    </FieldDescription>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="confirm-password">
                                        Confirmar Senha
                                    </FieldLabel>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        autoComplete="confirm-password"
                                        className={`${getInputClass("confirmPassword")
                                            }`}
                                    />
                                    <FieldDescription>Por favor confirme sua senha.</FieldDescription>
                                </Field>

                                <Field>
                                    <Button type="submit" className="w-full" onClick={handleSubmit} disabled={isLoading}>
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Carregando...
                                            </span>
                                        ) : (
                                            "Cadastrar"
                                        )}
                                    </Button>
                                    <FieldDescription className="text-center mt-4">
                                        Já tem uma conta? <a href="/login" className="underline-offset-4 hover:underline">Faça login</a>
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
