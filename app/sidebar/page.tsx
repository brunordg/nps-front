"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Building2, Compass, Home, LogOut, NotebookText, Package, PanelBottom, Settings2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";


export function Sidebar() {
    const hiddenPages = ["/login", "/signup"];

    const pathName = usePathname();

    const showSidebar = !hiddenPages.includes(pathName);

    if (!showSidebar) {
        return null;
    }

    return (
        <div className="flex w-full flex-col bg-muted/40">

            <aside className="fixed inset-y-0 let-0 z-10 hidden w-14 border-r bg-background sm:flex flex-col">
                <nav className="flex flex-col items-center gap-4 px-2 py-5">
                    <TooltipProvider >
                        <Link href="#" className="flex h-9 w-9 shrink-0 items-center justify-center bg-primary text-primary-foreground rounded-full">
                            <Package className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">Dashboard Avatar</span>
                        </Link>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
                                    <Home className="h-4 w-4" />
                                    <span className="sr-only">Inicio</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                Início
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/campaign" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
                                    <Compass className="h-4 w-4" />
                                    <span className="sr-only">Campanhas</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                Campanhas
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/quest" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
                                    <NotebookText className="h-4 w-4" />
                                    <span className="sr-only">Pesquisas</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                Pesquisas
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/company" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
                                    <Building2 className="h-4 w-4" />
                                    <span className="sr-only">Companhias</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                Companhias
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="#" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
                                    <Settings2 className="h-4 w-4" />
                                    <span className="sr-only">Configurações</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                Configurações
                            </TooltipContent>
                        </Tooltip>



                    </TooltipProvider>

                </nav>
                <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-5">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="#" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
                                    <LogOut className="h-5 w-5" />
                                    <span className="sr-only">  </span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                Sair
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                </nav>
            </aside>

            <div className="sm:hidden flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <header className="sticky top-0 z-30 flex h-14 items-center px-4 border-b bg-background gap-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button size="icon" variant="outline" className="sm:hidden">
                                <PanelBottom className="w-5 h-5" />
                                <span className="sr-only">Abrir / Fechar Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="sm:max-w-x" side="left">
                            <nav className="grid gap-6 text-lg font-medium">
                                <Link
                                    href="#"
                                    className="flex h-10 w-10 bg-primary rounded-full text-primary-foreground items-center justify-center md:text-base"
                                    prefetch={false}
                                >
                                    <Package className="w-5 h-5" aria-hidden="true" />
                                    <span className="sr-only">Logo do projeto</span>
                                </Link>
                                <Link
                                    href="/"
                                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                    prefetch={false}
                                >
                                    <Home className="w-5 h-5" aria-hidden="true" />
                                    <span>Inicio</span>
                                </Link>
                                <Link
                                    href="campaign"
                                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                    prefetch={false}
                                >
                                    <Compass className="w-5 h-5" aria-hidden="true" />
                                    <span>Campanhas</span>
                                </Link>
                                <Link
                                    href="#"
                                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                    prefetch={false}
                                >
                                    <NotebookText className="w-5 h-5" aria-hidden="true" />
                                    <span>Pesquisas</span>
                                </Link>
                                <Link
                                    href="/company"
                                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                    prefetch={false}
                                >
                                    <Building2 className="w-5 h-5" aria-hidden="true" />
                                    <span>Companhias</span>
                                </Link>
                                <Link
                                    href="#"
                                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                    prefetch={false}
                                >
                                    <Settings2 className="w-5 h-5" aria-hidden="true" />
                                    <span>Configuraçoes</span>
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </header>
            </div>
        </div>
    );
}