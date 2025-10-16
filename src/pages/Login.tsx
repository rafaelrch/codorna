import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '@/components/AuthLayout'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      alert('Por favor, preencha todos os campos')
      return
    }

    setLoading(true)
    const { error } = await signIn(email, password)
    
    if (!error) {
      // Redirecionar para o dashboard após login bem-sucedido
      navigate('/dashboard')
    }
    
    setLoading(false)
  }

  return (
    <AuthLayout
      title="Bem-vindo de volta ao Codorna! 👋"
      subtitle=""
      description="Gerencie suas finanças de forma simples e eficiente."
      backgroundImage="/tenis.jpg"
      backgroundImageAlt="Tênis e aplicativo Codorna"
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
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <Button type="submit" className="w-full h-12 text-base font-medium bg-[#208251] hover:bg-[#1e774a] transition-all duration-200" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Entrar
        </Button>

        <div className="text-center">
          <Link 
            to="/forgot-password" 
            className="text-sm text-slate-600 hover:text-blue-600 font-medium"
          >
            Esqueceu sua senha?
          </Link>
        </div>

        <div className="text-center">
          <span className="text-sm text-slate-600">
            Não tem uma conta?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline font-medium">
              Cadastre-se
            </Link>
          </span>
        </div>
      </form>
    </AuthLayout>
  )
}
