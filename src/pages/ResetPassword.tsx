import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, CheckCircle } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthLayout } from '@/components/AuthLayout'
import { supabase } from '@/lib/supabase'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isValidSession, setIsValidSession] = useState(false)
  const { updatePassword } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Verificar se há token de acesso nos parâmetros da URL
  const accessToken = searchParams.get('access_token')
  const refreshToken = searchParams.get('refresh_token')
  const type = searchParams.get('type')

  useEffect(() => {
    const handlePasswordReset = async () => {
      // Se é um link de reset de senha, processar os tokens
      if (type === 'recovery' && accessToken && refreshToken) {
        try {
          // Fazer login automático com os tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })
          
          if (error) {
            console.error('Erro ao processar tokens:', error)
            setError('Link inválido ou expirado. Solicite um novo link de redefinição.')
            return
          }
          
          if (data.session) {
            setIsValidSession(true)
          }
        } catch (err) {
          console.error('Erro ao processar reset de senha:', err)
          setError('Erro ao processar o link. Tente novamente.')
        }
      } else {
        // Verificar se já existe uma sessão válida
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          setIsValidSession(true)
        } else {
          setError('Link inválido ou expirado. Solicite um novo link de redefinição.')
        }
      }
    }

    handlePasswordReset()
  }, [accessToken, refreshToken, type])

  // Se não há sessão válida, mostrar erro
  if (!isValidSession && error) {
    return (
      <AuthLayout
        title="Link Inválido ❌"
        subtitle="Não foi possível processar o link de redefinição"
        description="O link pode ter expirado ou ser inválido."
      >
        <div className="text-center space-y-6">
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
          
          <Link to="/forgot-password">
            <Button className="w-full h-12 text-base font-medium">
              Solicitar Novo Link
            </Button>
          </Link>
          
          <Link to="/login">
            <Button variant="outline" className="w-full h-12 text-base font-medium">
              Voltar para Login
            </Button>
          </Link>
        </div>
      </AuthLayout>
    )
  }

  // Se ainda está carregando, mostrar loading
  if (!isValidSession && !error) {
    return (
      <AuthLayout
        title="Processando... ⏳"
        subtitle="Verificando o link de redefinição"
        description="Aguarde enquanto processamos sua solicitação."
      >
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
          <p className="text-sm text-slate-600">
            Verificando o link de redefinição...
          </p>
        </div>
      </AuthLayout>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setLoading(true)
    
    try {
      const { error } = await updatePassword(password)
      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 3000)
      }
    } catch (err) {
      setError('Erro ao atualizar senha. Tente novamente.')
    }
    
    setLoading(false)
  }

  if (success) {
    return (
      <AuthLayout
        title="Senha Atualizada! ✅"
        subtitle="Sua senha foi redefinida com sucesso"
        description="Você será redirecionado para a página de login."
      >
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              Sua senha foi redefinida com sucesso! Você pode fazer login com sua nova senha.
            </p>
          </div>
          
          <div className="text-sm text-slate-600">
            Redirecionando para o login em alguns segundos...
          </div>
          
          <Link to="/login">
            <Button className="w-full h-12 text-base font-medium">
              Ir para Login
            </Button>
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Redefinir Senha 🔑"
      subtitle="Digite sua nova senha"
      description="Crie uma nova senha segura para sua conta."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="password">Nova Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 pr-12"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirme sua nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="h-12 pr-12"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </Button>
          </div>
        </div>

        <Button type="submit" className="w-full h-12 text-base font-medium" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Redefinir Senha
        </Button>

        <div className="text-center">
          <Link 
            to="/login" 
            className="text-sm text-slate-600 hover:text-blue-600 font-medium"
          >
            Voltar para Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}
