import { Link } from 'react-router-dom'
import { ExclamationCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { TrophyIcon } from '@heroicons/react/24/solid'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TrialExpired() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <LockClosedIcon className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Período de Teste Expirado
          </CardTitle>
          <CardDescription className="text-base">
            Seu período de teste de 7 dias chegou ao fim.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <ExclamationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-900">
                Para continuar usando o Codorna, você precisa criar uma conta PRO.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Benefícios da conta PRO:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Acesso completo à plataforma</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>IA no WhatsApp</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Acesso antecipado a novas funcionalidades</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Suporte prioritário</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3 pt-2">
            <Button 
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white" 
              size="lg"
              asChild
            >
              <a 
                href="https://pay.hotmart.com/J103502971C?off=winzekg6" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <TrophyIcon className="mr-2 h-4 w-4" />
                Assinar Conta PRO
              </a>
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
        </CardContent>
      </Card>
    </div>
  )
}

