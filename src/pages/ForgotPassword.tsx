import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowPathIcon } from '@heroicons/react/24/solid'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { AuthLayout } from '@/components/AuthLayout'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    const { error } = await resetPassword(email)
    if (!error) {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <AuthLayout
        title="E-mail Enviado! ✅"
        subtitle="Verifique sua caixa de entrada para redefinir sua senha"
        description="Enviamos um link para redefinir sua senha."
        backgroundImage="/idosoSenha.jpg"
        backgroundImageAlt="Idoso usando o aplicativo Codorna"
      >
        <div className="text-center space-y-6">
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              Enviamos um link para <strong>{email}</strong> para você redefinir sua senha.
            </p>
          </div>
          
          <Link to="/login">
            <Button className="w-full h-12 text-base font-medium">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Voltar para Login
            </Button>
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Esqueceu a Senha? 🔑"
      subtitle="Digite seu e-mail para receber um link de redefinição"
      description="Recupere o acesso à sua conta de forma segura."
      backgroundImage="/idosoSenha.jpg"
      backgroundImageAlt="Idoso usando o aplicativo Codorna"
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

        <Button type="submit" className="w-full h-12 text-base font-medium" disabled={loading}>
          {loading && <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />}
          Enviar Link
        </Button>

        <div className="text-center">
          <Link 
            to="/login" 
            className="text-sm text-slate-600 hover:text-blue-600 font-medium inline-flex items-center"
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            Voltar para Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}
