import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  List, 
  Target,
  User, 
  LogOut,
  Crown,
  Clock
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

// Logo component matching the reference design
function CodornaLogo() {
  return (
    <div className="flex items-center gap-3 px-2">
      <img 
        src="/CODORNA-LOGO.png" 
        alt="Codorna Logo" 
        className="h-12 w-auto"
      />
    </div>
  );
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Lançamentos", href: "/transactions", icon: List },
  { name: "Metas", href: "/goals", icon: Target },
  { name: "Minha conta", href: "/account", icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { signOut, user } = useAuth();

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  // Determinar status do usuário (Trial ou Pro)
  const getUserStatus = () => {
    // Lógica para determinar se é Pro ou Trial
    // Por padrão, vamos considerar Pro se tiver um campo específico nos metadados
    // ou se for um usuário com email específico, etc.
    const isPro = user?.user_metadata?.subscription_type === 'pro' || 
                  user?.user_metadata?.is_pro === true ||
                  user?.email?.includes('@pro.') || // Exemplo: usuários com @pro.
                  false; // Por padrão, todos são Trial
    
    return isPro ? 'Pro' : 'Trial';
  };

  const userStatus = getUserStatus();

  return (
    <Sidebar className="border-sidebar-border [&_[data-sidebar=sidebar]]:bg-[#F8F6F7]">
      <SidebarHeader className="p-4 pt-10">
        <CodornaLogo />
      </SidebarHeader>
      
      <SidebarContent className="flex flex-col pt-3">
        <div className="flex-1">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {navigation.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive(item.href)}>
                      <NavLink 
                        to={item.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-regular transition-colors transition-all easy-in-out duration-200 ${
                          isActive(item.href)
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        {state !== "collapsed" && <span>{item.name}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
        
        {/* User info and logout */}
        <div className=" p-4 border-t border-sidebar-border">
          {state !== "collapsed" && user && (
            <div className="mb-7">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-sidebar-accent-foreground">
                  {user.user_metadata?.first_name || user.email}
                </p>
                <Badge 
                  variant={userStatus === 'Pro' ? 'default' : 'secondary'}
                  className={`text-xs px-2 py-1 ${
                    userStatus === 'Pro' 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0' 
                      : 'bg-gray-100 text-gray-600 border-gray-200'
                  }`}
                >
                  {userStatus === 'Pro' ? (
                    <Crown className="h-3 w-3 mr-1" />
                  ) : (
                    <Clock className="h-3 w-3 mr-1" />
                  )}
                  {userStatus}
                </Badge>
              </div>
              <p className="text-xs text-sidebar-accent-foreground">{user.email}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="w-full justify-center gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="h-4 w-4" />
            {state !== "collapsed" && <span>Sair</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}