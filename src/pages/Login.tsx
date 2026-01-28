import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { ArrowPathIcon } from '@heroicons/react/24/solid'
import { AuthLayout } from '@/components/AuthLayout'
import { userService } from '@/services/userService'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      alert('Por favor, preencha todos os campos')
      return
    }

    setLoading(true)
    
    const { error } = await signIn(email, password)
    
    if (!error) {
      // Nova checagem de acesso considerando tabelas users_trial e usuario_compra
      try {
        const accessResult = await userService.evaluateAccessStatus()

        if (accessResult.userTotalId) {
          localStorage.setItem('user_total_id', accessResult.userTotalId)
        }

        if (accessResult.redirectTo) {
          navigate(accessResult.redirectTo)
        } else {
          const from = location.state?.from?.pathname || '/dashboard'
          navigate(from, { replace: true })
        }
      } catch (error: any) {
        navigate('/dashboard')
      }
    }
    setLoading(false)
  }

  return (
    <AuthLayout
      title="Bem-vindo ao Codorna! 👋"
      subtitle=""
      description="Gerencie suas finanças de forma simples e eficiente."
      backgroundImage="/joaoLucas-3.png"
      backgroundImageAlt="João Lucas e aplicativo Codorna"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Sua senha"
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
                <EyeSlashIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <Button type="submit" className="w-full h-12 text-base font-medium bg-[#208251] hover:bg-[#1e774a] transition-all duration-200" disabled={loading}>
          {loading && <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />}
          Entrar
        </Button>

        <div className="text-center">
          <span className="text-sm text-slate-600">
            Não tem uma conta?{' '}
            <a href="https://wa.me/5571983486204?text=Ol%C3%A1%20Codorna!!" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
              Cadastre-se
            </a>
          </span>
        </div>
      </form>
    </AuthLayout>
  )
}
