import { Link } from 'react-router-dom'
import { ExclamationCircleIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { Sparkles, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function SubscriptionPending() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
            <ClockIcon className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Assinatura Pendente
          </CardTitle>
          <CardDescription className="text-base">
            Seu pagamento está pendente de confirmação.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Badge 
              variant="secondary" 
              className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100/90 border-0 rounded-full font-semibold px-4 py-2 flex items-center gap-2"
            >
              <span className="text-sm">Status: Pendente</span>
              <ClockIcon className="h-4 w-4" />
            </Badge>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex gap-3">
              <ExclamationCircleIcon className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-900 mb-1">
                  Pagamento em Processamento
                </p>
                <p className="text-sm text-yellow-800">
                  Para configurar seu pagamento, siga o passo a passo abaixo na plataforma Hotmart.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Como configurar o pagamento:</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Faz login na Hotmart</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">2</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Acessa a aba "Minhas compras"</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">3</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Clica em "Mostrar detalhes" do produto Codorna</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">4</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">"Configurar pagamento"</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Button 
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white" 
              size="lg"
              onClick={() => window.open('https://hotmart.com/pt-br', '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Acessar Hotmart
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full" 
              size="lg"
              asChild
            >
              <Link to="/login">
                Voltar para Login
              </Link>
            </Button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-gray-500">
              Se você já realizou o pagamento, aguarde alguns minutos para a confirmação.
              Em caso de dúvidas, entre em contato com o suporte.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

