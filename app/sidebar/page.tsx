"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";

const breadcrumbMap: Record<string, { label: string; parent?: string }> = {
    "/": { label: "Dashboard" },
    "/company": { label: "Empresas", parent: "/" },
    "/campaign": { label: "Campanhas", parent: "/" },
    "/quest": { label: "Perguntas", parent: "/" },
    "/payment": { label: "Pagamentos", parent: "/" },
    "/settings": { label: "Configurações", parent: "/" },
};

export function Sidebar({ children }: { children: React.ReactNode }) {
    const hiddenPages = ["/login", "/signup"];
    const pathName = usePathname();
    const showSidebar = !hiddenPages.includes(pathName);

    if (!showSidebar) {
        return <>{children}</>;
    }

    const getBreadcrumbs = () => {
        const breadcrumbs: { label: string; href: string; isLast: boolean }[] = [];
        const currentRoute = breadcrumbMap[pathName];

        if (!currentRoute) {
            return [{ label: "Página", href: pathName, isLast: true }];
        }

        if (currentRoute.parent) {
            const parentRoute = breadcrumbMap[currentRoute.parent];
            if (parentRoute) {
                breadcrumbs.push({
                    label: parentRoute.label,
                    href: currentRoute.parent,
                    isLast: false,
                });
            }
        }

        breadcrumbs.push({
            label: currentRoute.label,
            href: pathName,
            isLast: true,
        });

        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            {breadcrumbs.map((crumb, index) => (
                                <div key={crumb.href} className="flex items-center">
                                    {index > 0 && <BreadcrumbSeparator className="mx-2" />}
                                    <BreadcrumbItem>
                                        {crumb.isLast ? (
                                            <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink href={crumb.href}>
                                                {crumb.href === "/" && <Home className="h-4 w-4" />}
                                                {crumb.href !== "/" && crumb.label}
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                </div>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>                
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
