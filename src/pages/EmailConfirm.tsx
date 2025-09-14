import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export default function EmailConfirm() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const confirmEmail = async () => {
      const token = searchParams.get('token')
      const type = searchParams.get('type')

      if (!token || type !== 'signup') {
        setStatus('error')
        setMessage('Link de confirmação inválido.')
        return
      }

      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup'
        })

        if (error) {
          setStatus('error')
          setMessage('Erro ao confirmar email. O link pode ter expirado.')
        } else {
          setStatus('success')
          setMessage('Email confirmado com sucesso! Você pode fazer login agora.')
          
          toast({
            title: "Email confirmado!",
            description: "Sua conta foi ativada com sucesso.",
          })

          // Redirecionar para login após 3 segundos
          setTimeout(() => {
            navigate('/login', { replace: true })
          }, 3000)
        }
      } catch (error) {
        setStatus('error')
        setMessage('Erro inesperado ao confirmar email.')
      }
    }

    confirmEmail()
  }, [searchParams, navigate, toast])

  const handleGoToLogin = () => {
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'loading' && (
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            )}
            {status === 'success' && (
              <CheckCircle className="h-12 w-12 text-green-600" />
            )}
            {status === 'error' && (
              <XCircle className="h-12 w-12 text-red-600" />
            )}
          </div>
          
          <CardTitle className="text-2xl font-bold">
            {status === 'loading' && 'Confirmando email...'}
            {status === 'success' && 'Email confirmado!'}
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
                Você será redirecionado para a página de login em alguns segundos...
              </p>
              <Button onClick={handleGoToLogin} className="w-full">
                Ir para Login
              </Button>
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
