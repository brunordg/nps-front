"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Home,
  Building,
  Users,
  FileText,
  BarChart2,
  Settings,
  CreditCard,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const data = {
  navMain: [
    {
      title: "Menu Principal",
      url: "#",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: Home,
        },
        {
          title: "Empresas",
          url: "/company",
          icon: Building,
        },
        {
          title: "Contatos",
          url: "#",
          icon: Users,
        },
      ],
    },
    {
      title: "Pesquisas NPS",
      url: "#",
      items: [
        {
          title: "Campanhas",
          url: "/campaign",
          icon: FileText,
        },
        {
          title: "Perguntas",
          url: "/quest",
          icon: FileText,
        },
        {
          title: "Links",
          url: "#",
          icon: FileText,
        },
        {
          title: "Respostas",
          url: "#",
          icon: FileText,
        },
        {
          title: "Análises",
          url: "#",
          icon: BarChart2,
        },
      ],
    },
    {
      title: "Sistema",
      url: "#",
      items: [
        {
          title: "Planos",
          url: "#",
          icon: CreditCard,
        },
        {
          title: "Configurações",
          url: "#",
          icon: Settings,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="px-4 py-3">
          <Link href="/" className="text-lg font-semibold">
            <div className="flex items-center gap-3">
              <div className="shrink-0 size-8 flex items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Zap className="size-4" />
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="truncate font-semibold">SparkFeel</span>
                <span className="truncate text-xs text-sidebar-foreground/70">Gestão de NPS</span>
              </div>
            </div>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.url;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                        <Link href={item.url} className="flex items-center gap-2">
                          {Icon && <Icon className="size-4" />}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
