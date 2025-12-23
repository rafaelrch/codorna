import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebar } from '@/components/ui/sidebar';
import { PanelLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Sparkles, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface SubscriptionStatus {
  isPro: boolean;
  trialEndDate: string | null;
  planStatus: 'active' | 'pending' | null;
  rawStatus?: string | null; // Status original da tabela usuario_compra
}

export default function Subscription() {
  const { user } = useAuth();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    isPro: false,
    trialEndDate: null,
    planStatus: null,
  });

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!user?.id) {
        return;
      }

      try {
        // Verificar se é PRO através de usuario_compra
        const { data: allData, error: allError } = await supabase
          .from('usuario_compra')
          .select('*')
          .eq('auth_id', user.id);

        // Agora a query original
        const { data: compraData, error: compraError } = await supabase
          .from('usuario_compra')
          .select('status')
          .eq('auth_id', user.id)
          .maybeSingle();

        // Se houver dados na tabela usuario_compra, o usuário é PRO
        const hasCompraData = allData && allData.length > 0;
        const statusData = compraData || (allData && allData.length > 0 ? allData[0] : null);

        if (!compraError && !allError && (hasCompraData || compraData)) {
          const rawStatus = (statusData?.status || '').toUpperCase();
          const planStatus = rawStatus === 'APPROVED' ? 'active' : 'pending';

          setSubscriptionStatus({
            isPro: true,
            trialEndDate: null,
            planStatus: planStatus,
            rawStatus: statusData?.status || null,
          });
          setLoading(false);
          return;
        }

        // Verificar se é PRO através de user_metadata
        const metadataIsPro = user.user_metadata?.subscription_type === 'pro' || 
                              user.user_metadata?.is_pro === true;

        if (metadataIsPro) {
          setSubscriptionStatus({
            isPro: true,
            trialEndDate: null,
            planStatus: 'active',
          });
          setLoading(false);
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

          setSubscriptionStatus({
            isPro: false,
            trialEndDate: formattedDate,
            planStatus: null,
          });
          setLoading(false);
          return;
        }

        // Se não encontrou nada, assumir PRO (fallback)
        setSubscriptionStatus({
          isPro: true,
          trialEndDate: null,
          planStatus: 'active',
        });
      } catch (error) {
        // Em caso de erro, assumir PRO
        setSubscriptionStatus({
          isPro: true,
          trialEndDate: null,
          planStatus: 'active',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [user?.id, user?.user_metadata]);

  const handleSubscribe = () => {
    window.open('https://pay.hotmart.com/J103502971C?off=winzekg6', '_blank');
  };

  const handleRenew = () => {
    window.open('https://pay.hotmart.com/J103502971C?off=winzekg6', '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EBEBEB] flex flex-col justify-center">
        <Card className="max-w-2xl bg-[#F8F6F7] rounded-2xl mx-auto w-full">
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
              Gerenciar Assinatura
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBEBEB] flex flex-col justify-center p-4">
      <Card className="max-w-2xl bg-[#F8F6F7] rounded-2xl mx-auto w-full">
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
            Gerenciar Assinatura
          </CardTitle>
          <CardDescription>
            Visualize e gerencie seu plano atual
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!subscriptionStatus.isPro ? (
            // Trial User
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#D1F2E8] rounded-lg border border-[#1f8150]/20">
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="secondary" 
                    className="bg-[#D1F2E8] text-[#1f8150] hover:bg-[#D1F2E8]/90 border-0 rounded-full font-semibold px-3 py-1.5 flex items-center gap-1.5"
                  >
                    <span className="text-sm font-semibold">Trial</span>
                    <Sparkles className="h-3.5 w-3.5 fill-[#1f8150] text-[#1f8150]" />
                  </Badge>
                  <div>
                    <p className="font-medium text-gray-900">Plano Trial Ativo</p>
                    {subscriptionStatus.trialEndDate && (
                      <p className="text-sm text-gray-600">
                        Expira em {subscriptionStatus.trialEndDate}
                      </p>
                    )}
                  </div>
                </div>
                <Clock className="h-5 w-5 text-[#1f8150]" />
              </div>

              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Benefícios do Plano PRO</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#1f8150]" />
                    Registro de despesas e receitas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#1f8150]" />
                    Registro de metas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#1f8150]" />
                    Pergunte o que quiser
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#1f8150]" />
                    Dashboard detalhado para acompanhamento e relatórios
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#1f8150]" />
                    Saldo do mês
                  </li>
                </ul>
              </div>

              <Button
                onClick={handleSubscribe}
                className="w-full bg-gradient-to-r from-[#1f8150] to-[#2ba366] hover:from-[#1a6b42] hover:to-[#1f8150] text-white"
                size="lg"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Assinar Plano PRO
              </Button>
            </div>
          ) : (
            // Pro User
            <div className="space-y-4">
              <div className={`flex items-center justify-between p-4 rounded-lg border ${
                subscriptionStatus.planStatus === 'active' 
                  ? 'bg-[#D1F2E8] border-[#1f8150]/20' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="default" 
                    className={`${
                      subscriptionStatus.planStatus === 'active'
                        ? 'bg-[#D1F2E8] text-[#1f8150] hover:bg-[#D1F2E8]/90'
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/90'
                    } border-0 rounded-full font-semibold px-3 py-1.5 flex items-center gap-1.5`}
                  >
                    <span className="text-sm">PRO</span>
                    <Sparkles className="h-3.5 w-3.5 fill-current" />
                  </Badge>
                  <div>
                    <p className="font-medium text-gray-900">Plano PRO</p>
                    <p className="text-sm text-gray-600">
                      Status: {subscriptionStatus.planStatus === 'active' ? 'Ativo' : 'Pendente'}
                    </p>
                  </div>
                </div>
                {subscriptionStatus.planStatus === 'active' ? (
                  <CheckCircle2 className="h-5 w-5 text-[#1f8150]" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                )}
              </div>

              {subscriptionStatus.planStatus === 'pending' && (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-yellow-900 mb-1">
                        Assinatura Pendente
                      </p>
                      <p className="text-sm text-yellow-700">
                        Sua assinatura está pendente de pagamento. Renove agora para continuar aproveitando todos os benefícios do plano PRO.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {subscriptionStatus.planStatus === 'pending' && (
                <Button
                  onClick={handleRenew}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
                  size="lg"
                >
                  Renovar Assinatura
                </Button>
              )}

              {subscriptionStatus.planStatus === 'active' && (
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Seu Plano PRO está Ativo</h3>
                  <p className="text-sm text-gray-600">
                    Você está aproveitando todos os benefícios do plano PRO. Continue usando a plataforma sem restrições.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

