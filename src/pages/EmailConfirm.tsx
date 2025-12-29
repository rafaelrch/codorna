import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'
import { ArrowPathIcon } from '@heroicons/react/24/solid'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export default function EmailConfirm() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Como o usuário chegou até esta página, significa que o email foi confirmado
    // O Supabase já processou a confirmação automaticamente
    setStatus('success')
    setMessage('Cadastro finalizado com sucesso! Sua conta foi ativada.')
    
    toast({
      title: "Email confirmado!",
      description: "Sua conta foi ativada com sucesso.",
    })
  }, [toast])

  const handleGoToLogin = () => {
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'loading' && (
              <ArrowPathIcon className="h-12 w-12 animate-spin text-blue-600" />
            )}
            {status === 'success' && (
              <CheckCircleIcon className="h-12 w-12 text-green-600" />
            )}
            {status === 'error' && (
              <XCircleIcon className="h-12 w-12 text-red-600" />
            )}
          </div>
          
          <CardTitle className="text-2xl font-bold">
            {status === 'loading' && 'Confirmando email...'}
            {status === 'success' && 'Cadastro finalizado!'}
            {status === 'error' && 'Erro na confirmação'}
          </CardTitle>
          
          <CardDescription>
            {message}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          {status === 'success' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Agora você pode começar a usar o Codorna!
              </p>
              <a 
                href="https://wa.me/5571993393322?text=Finalizei%20meu%20cadastro" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button className="w-full bg-[#208251] text-white hover:bg-[#208251]/90">
                  Iniciar no WhatsApp
                </Button>
              </a>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-4">
              <Button onClick={handleGoToLogin} className="w-full">
                Ir para Login
              </Button>
            </div>
          )}
          
          {status === 'loading' && (
            <p className="text-sm text-muted-foreground">
              Aguarde enquanto confirmamos seu email...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
