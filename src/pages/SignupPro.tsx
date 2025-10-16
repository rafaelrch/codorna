import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Loader2, Crown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '@/components/AuthLayout'

export default function SignupPro() {
  const [formData, setFormData] = useState({
    nome: '',
    phone: '55',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUpPro } = useAuth()
  const navigate = useNavigate()

  // Função para formatar telefone brasileiro
  const formatPhone = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    
    // Se não começar com 55, adiciona automaticamente
    if (!numbers.startsWith('55')) {
      return '55' + numbers
    }
    
    return numbers
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    if (name === 'phone') {
      const formattedPhone = formatPhone(value)
      setFormData({
        ...formData,
        [name]: formattedPhone
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar campos obrigatórios
    if (!formData.nome.trim()) {
      alert('O nome é obrigatório')
      return
    }

    if (!formData.email.trim()) {
      alert('O e-mail é obrigatório')
      return
    }

    if (!formData.phone.trim()) {
      alert('O telefone é obrigatório')
      return
    }

    // Validar formato do telefone (55 + 11 dígitos = 13 dígitos total)
    if (formData.phone.length < 13) {
      alert('O telefone deve ter pelo menos 11 dígitos após o código do país (55)')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem')
      return
    }

    if (formData.password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setLoading(true)
    const { error } = await signUpPro(formData.email, formData.password, {
      nome: formData.nome,
      telefone: formData.phone
    }, navigate)
    
    // If signup successful, redirect will happen automatically via AuthContext
    setLoading(false)
  }

  return (
    <AuthLayout
      title="Cadastro PRO - Codorna 👑"
      subtitle=""
      description="Acesso completo a todas as funcionalidades premium."
      backgroundImage="/mulherCadastro.jpg"
      backgroundImageAlt="Mulher usando o aplicativo Codorna"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
    

        <div className="space-y-2">
          <Label htmlFor="nome">Nome Completo *</Label>
          <Input
            id="nome"
            name="nome"
            placeholder="João Silva"
            value={formData.nome}
            onChange={handleChange}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="5511999999999"
            value={formData.phone}
            onChange={handleChange}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChange={handleChange}
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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar Senha</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirme sua senha"
              value={formData.confirmPassword}
              onChange={handleChange}
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
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <Button type="submit" className="w-full h-12 text-base font-medium bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white border-0" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Crown className="mr-2 h-4 w-4" />
          Criar Conta PRO
        </Button>

        <div className="text-center">
          <span className="text-sm text-slate-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Faça login
            </Link>
          </span>
        </div>

        <div className="text-center">
          <span className="text-sm text-slate-600">
            Quer uma conta gratuita?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline font-medium">
              Cadastro Trial
            </Link>
          </span>
        </div>
      </form>
    </AuthLayout>
  )
}
