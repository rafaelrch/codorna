import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { ArrowPathIcon, ShieldCheckIcon } from '@heroicons/react/24/solid'
import { useToast } from '@/hooks/use-toast'

const ADMIN_EMAIL = 'codornaco@gmail.com'
const ADMIN_PASSWORD = 'Prosperidade@8'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    // Verificação simples de credenciais
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Salvar sessão admin no localStorage
      localStorage.setItem('admin_authenticated', 'true')
      localStorage.setItem('admin_email', email)
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para o painel...",
      })
      
      setTimeout(() => {
        navigate('/admin/dashboard', { replace: true })
      }, 500)
    } else {
      toast({
        title: "Erro no login",
        description: "Credenciais inválidas. Acesso negado.",
        variant: "destructive",
      })
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <Card className="w-full max-w-md shadow-2xl" style={{ borderColor: '#475569', backgroundColor: '#1e293b', color: 'white' }}>
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
            <ShieldCheckIcon className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold" style={{ color: 'white' }}>Painel Administrativo</CardTitle>
          <CardDescription style={{ color: '#cbd5e1' }}>
            Acesso restrito ao administrador
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" style={{ color: '#e2e8f0' }}>E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
                style={{ backgroundColor: '#334155', borderColor: '#475569', color: 'white' }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" style={{ color: '#e2e8f0' }}>Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pr-12"
                  style={{ backgroundColor: '#334155', borderColor: '#475569', color: 'white' }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-12 px-3 py-2"
                  style={{ color: '#cbd5e1' }}
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

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium text-white" 
              style={{ backgroundColor: '#2563eb' }}
              disabled={loading}
            >
              {loading && <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />}
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

