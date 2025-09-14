import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';

export default function Account() {
  const [loading, setLoading] = useState(true);
  const { user, session, loading: authLoading } = useAuth();

  useEffect(() => {
    // Para de carregar quando a autenticação terminar
    if (!authLoading) {
      console.log('User data:', user); // Debug temporário
      const timer = setTimeout(() => {
        setLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
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
    return user?.user_metadata?.phone || 'Não informado';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EBEBEB] flex flex-col justify-center">
        <Card className="max-w-full bg-[#F8F6F7] rounded-2xl mx-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
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
              {getUserName()}
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
              {getUserPhone()}
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