import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebar } from '@/components/ui/sidebar';
import { PanelLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function Account() {
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const { user, session, loading: authLoading } = useAuth();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  const getUserName = () => {
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`;
    }
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name;
    }
    return user?.email?.split('@')[0] || 'Usuário não identificado';
  };

  const getUserPhone = () => {
    return user?.user_metadata?.phone || '';
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id || authLoading) return;

      try {
        // Buscar dados do users_total
        const { data: totalData } = await supabase
          .from('users_total')
          .select('nome, telefone')
          .eq('id', user.id)
          .single();

        if (totalData) {
          setNome(totalData.nome || getUserName());
          setTelefone(totalData.telefone || getUserPhone() || '');
        } else {
          setNome(getUserName());
          setTelefone(getUserPhone() || '');
        }
      } catch (error) {
        setNome(getUserName());
        setTelefone(getUserPhone() || '');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authLoading, user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-[#EBEBEB] flex flex-col justify-center">
        <Card className="max-w-full bg-[#F8F6F7] rounded-2xl mx-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleSidebar}
                      className="h-8 w-8 text-gray-900 hover:bg-gray-200"
                    >
                      <PanelLeft className="h-4 w-4" />
                      <span className="sr-only">
                        {isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              Minha conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <div className="bg-[#EEEEEE] rounded-lg px-3 py-3">
                  <Skeleton className="h-6 w-full" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBEBEB] flex flex-col justify-center">
      <Card className="max-w-full bg-[#F8F6F7] rounded-2xl mx-20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="h-8 w-8 text-gray-900 hover:bg-gray-200"
                  >
                    <PanelLeft className="h-4 w-4" />
                    <span className="sr-only">
                      {isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            Minha conta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nome */}
          <div className="space-y-2">
            <Label className="text-base font-medium flex items-center gap-2">
              Nome
            </Label>
            <div className="bg-[#EEEEEE] rounded-lg px-3 py-3 text-[#7D7D7D]">
              {nome || getUserName()}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-base font-medium flex items-center gap-2">
              Email
            </Label>
            <div className="bg-[#EEEEEE] rounded-lg px-3 py-3 text-[#7D7D7D]">
              {user?.email || 'Email não disponível'}
            </div>
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <Label className="text-base font-medium flex items-center gap-2">
              Telefone
            </Label>
            <div className="bg-[#EEEEEE] rounded-lg px-3 py-3 text-[#7D7D7D]">
              {telefone || getUserPhone() || 'Não informado'}
            </div>
          </div>

          {/* Data de Criação */}
          <div className="space-y-2">
            <Label className="text-base font-medium flex items-center gap-2">
              Membro desde
            </Label>
            <div className="bg-[#EEEEEE] rounded-lg px-3 py-3 text-[#7D7D7D]">
              {user?.created_at ? formatDate(user.created_at) : 'Data não disponível'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}