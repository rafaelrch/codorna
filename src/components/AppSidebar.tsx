import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  ChartBarSquareIcon,
  CreditCardIcon,
  FlagIcon,
  Cog6ToothIcon,
  RectangleStackIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import {
  ChartBarSquareIcon as ChartBarSquareIconSolid,
  CreditCardIcon as CreditCardIconSolid,
  FlagIcon as FlagIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  RectangleStackIcon as RectangleStackIconSolid,
  QuestionMarkCircleIcon as QuestionMarkCircleIconSolid,
} from "@heroicons/react/24/solid";
import { BotMessageSquare, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
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
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { supabase } from "@/lib/supabase";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Logo component
function CodornaLogo({ isCollapsed }: { isCollapsed: boolean }) {
  if (isCollapsed) {
    return (
      <div className="flex items-center justify-center w-full">
        <img
          src="/icon-codorna-2.png"
          alt="Codorna"
          className="h-8 w-8 object-contain m-2"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <img
        src="/CODORNA-LOGO.png"
        alt="Codorna Financeiro"
        className="h-auto w-full max-w-[140px] object-contain"
      />
    </div>
  );
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  activeIcon: React.ComponentType<{ className?: string }>;
  isLucide?: boolean;
}

const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: ChartBarSquareIcon,
    activeIcon: ChartBarSquareIconSolid,
  },
  {
    name: "Lançamentos",
    href: "/transactions",
    icon: CreditCardIcon,
    activeIcon: CreditCardIconSolid,
  },
  {
    name: "Metas",
    href: "/goals",
    icon: FlagIcon,
    activeIcon: FlagIconSolid,
  },
  {
    name: "IA",
    href: "/ia",
    icon: BotMessageSquare,
    activeIcon: BotMessageSquare,
    isLucide: true, // Flag para identificar ícones do Lucide
  },
  {
    name: "Gerenciar Assinatura",
    href: "/subscription",
    icon: RectangleStackIcon,
    activeIcon: RectangleStackIconSolid,
  },
  {
    name: "Suporte",
    href: "/support",
    icon: QuestionMarkCircleIcon,
    activeIcon: QuestionMarkCircleIconSolid,
  },
  {
    name: "Configurações",
    href: "/account",
    icon: Cog6ToothIcon,
    activeIcon: Cog6ToothIconSolid,
  },
];

// Função para obter iniciais do nome
function getInitials(nome: string | null | undefined): string {
  if (!nome) return "U";
  
  const parts = nome.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  }
  
  if (parts[0].length >= 2) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  return parts[0].charAt(0).toUpperCase();
}

export function AppSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [userTotalData, setUserTotalData] = React.useState<{ nome: string; email: string } | null>(null);
  const [userStatus, setUserStatus] = React.useState<{ isPro: boolean; trialEndDate: string | null } | null>(null);

  React.useEffect(() => {
    const fetchUserTotalData = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('users_total')
          .select('nome, email')
          .eq('id', user.id)
          .single();

        if (error) {
          return;
        }

        if (data) {
          setUserTotalData({
            nome: data.nome || '',
            email: data.email || user?.email || ''
          });
        }
      } catch (error) {
        // Erro silencioso
      }
    };

    fetchUserTotalData();
  }, [user?.id]);

  React.useEffect(() => {
    const fetchUserStatus = async () => {
      if (!user?.id) return;

      try {
        // Verificar se é PRO através de usuario_compra
        const { data: compraData, error: compraError } = await supabase
          .from('usuario_compra')
          .select('status')
          .eq('auth_id', user.id)
          .maybeSingle();

        // Se não houver erro e houver dados com status APPROVED
        if (!compraError && compraData && compraData.status === 'APPROVED') {
          setUserStatus({ isPro: true, trialEndDate: null });
          return;
        }

        // Verificar se é PRO através de user_metadata
        const metadataIsPro = user.user_metadata?.subscription_type === 'pro' || user.user_metadata?.is_pro === true;
        if (metadataIsPro) {
          setUserStatus({ isPro: true, trialEndDate: null });
          return;
        }

        // Verificar trial
        const { data: trialData } = await supabase
          .from('users_trial')
          .select('trial_end_at')
          .eq('id', user.id)
          .maybeSingle();

        if (trialData?.trial_end_at) {
          const trialEndDate = new Date(trialData.trial_end_at);
          const formattedDate = trialEndDate.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
          setUserStatus({ isPro: false, trialEndDate: formattedDate });
          return;
        }

        // Se não encontrou nada, assumir PRO (fallback)
        setUserStatus({ isPro: true, trialEndDate: null });
      } catch (error) {
        // Em caso de erro, assumir PRO
        setUserStatus({ isPro: true, trialEndDate: null });
      }
    };

    fetchUserStatus();
  }, [user?.id, user?.user_metadata]);

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const userName = userTotalData?.nome || user?.user_metadata?.first_name || user?.email?.split("@")[0] || "Usuário";
  const userEmail = userTotalData?.email || user?.email || "";
  const userInitials = getInitials(userName);

  return (
    <Sidebar
      collapsible="icon"
      className="border-sidebar-border [&_[data-sidebar=sidebar]]:bg-sidebar"
    >
      <SidebarHeader className={`border-b border-sidebar-border ${isCollapsed ? "p-2" : "p-4"}`}>
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-start"}`}>
          <CodornaLogo isCollapsed={isCollapsed} />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className={`mt-2 ${isCollapsed ? "flex items-center" : ""}`}>
          <SidebarGroupLabel className={isCollapsed ? "hidden" : "block"}>
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent className={isCollapsed ? "w-full flex items-center" : ""}>
            <SidebarMenu className={isCollapsed ? "items-center w-full" : ""}>
              {navigation.map((item) => {
                const isItemActive = isActive(item.href);
                const IconComponent = isItemActive ? item.activeIcon : item.icon;
                const isLucideIcon = item.isLucide === true;

                return (
                  <SidebarMenuItem key={item.name} className={isCollapsed ? "flex justify-center" : ""}>
                    {isCollapsed ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton asChild isActive={isItemActive}>
                              <NavLink
                                to={item.href}
                                className="flex items-center justify-center"
                              >
                                {isLucideIcon ? (
                                  <IconComponent
                                    className={`h-4 w-4 ${
                                      isItemActive ? "text-[#1f8150]" : ""
                                    }`}
                                  />
                                ) : (
                                  <IconComponent
                                    className={`h-4 w-4 ${
                                      isItemActive ? "text-[#1f8150]" : ""
                                    }`}
                                  />
                                )}
                              </NavLink>
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            {item.name}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <SidebarMenuButton asChild isActive={isItemActive}>
                        <NavLink
                          to={item.href}
                          className="flex items-center gap-2"
                        >
                          {isLucideIcon ? (
                            <IconComponent
                              className={`h-4 w-4 flex-shrink-0 ${
                                isItemActive ? "text-[#1f8150]" : ""
                              }`}
                            />
                          ) : (
                            <IconComponent
                              className={`h-4 w-4 flex-shrink-0 ${
                                isItemActive ? "text-[#1f8150]" : ""
                              }`}
                            />
                          )}
                          <span>{item.name}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={`border-t border-sidebar-border ${isCollapsed ? "p-2 flex flex-col justify-center items-center gap-2" : "p-4 flex flex-col gap-2"}`}>
        {/* Badge de Status */}
        {userStatus && (
          <div className={`${isCollapsed ? "w-full flex justify-center" : "w-full"}`}>
            {userStatus.isPro ? (
              <Badge 
                variant="default" 
                className="bg-[#D1F2E8] text-[#1f8150] hover:bg-[#D1F2E8]/90 border-0 rounded-full font-semibold px-3 py-1.5 flex items-center gap-1.5 justify-center w-full"
              >
                <span className="text-sm">PRO</span>
                <Sparkles className="h-3.5 w-3.5 fill-[#1f8150] text-[#1f8150]" />
              </Badge>
            ) : (
              <Badge 
                variant="secondary" 
                className="bg-[#D1F2E8] text-[#1f8150] hover:bg-[#D1F2E8]/90 border-0 rounded-full font-semibold px-3 py-1.5 flex flex-col items-center gap-0.5 justify-center w-full"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold">Trial</span>
                  <Sparkles className="h-3.5 w-3.5 fill-[#1f8150] text-[#1f8150]" />
                </div>
                {userStatus.trialEndDate && (
                  <span className="text-[10px] opacity-80 leading-tight">
                    Expira em {userStatus.trialEndDate}
                  </span>
                )}
              </Badge>
            )}
          </div>
        )}
        
        <DropdownMenu>
          {isCollapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 rounded-full p-0 flex items-center justify-center"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <div className="flex flex-col space-y-1 justify-start items-start">
                    <p className="text-sm font-medium leading-none">
                      {userName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userEmail}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-auto p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start flex-1 min-w-0 overflow-hidden text-left">
                  <span className="text-sm font-medium text-sidebar-foreground truncate block w-full text-left">
                    {userName}
                  </span>
                  <span className="text-xs text-sidebar-foreground/70 truncate block w-full text-left">
                    {userEmail}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
          )}
          <DropdownMenuContent side="right" align="end" className="w-56">
            <DropdownMenuItem onClick={handleLogout}>
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}


