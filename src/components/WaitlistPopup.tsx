import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ArrowPathIcon } from '@heroicons/react/24/solid'
import { sendToGoogleSheets } from '@/config/googleSheets'

interface WaitlistPopupProps {
  isOpen: boolean
  onClose: () => void
}

export const WaitlistPopup = ({ isOpen, onClose }: WaitlistPopupProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '55'
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    if (name === 'phone') {
      // Formatar telefone brasileiro
      const numbers = value.replace(/\D/g, '')
      if (!numbers.startsWith('55')) {
        setFormData({ ...formData, [name]: '55' + numbers })
      } else {
        setFormData({ ...formData, [name]: numbers })
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      alert('Por favor, preencha todos os campos')
      return
    }

    if (formData.phone.length < 13) {
      alert('O telefone deve ter  pelo menos 11 dígitos após o código do país (55)')
      return
    }

    setLoading(true)

    try {
      // Enviar dados para Google Sheets
      const sheetData = {
        nome: formData.name,
        email: formData.email,
        telefone: formData.phone
      }
      
      await sendToGoogleSheets(sheetData)
      
      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
        setFormData({ name: '', email: '', phone: '55' })
      }, 2000)
      
    } catch (error) {
      alert('Erro ao enviar dados. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="text-center mt-10">
          <DialogTitle className="text-3xl font-bold text-gray-900 text-center">
            Entre na fila de espera
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Seja um dos primeiros a utilizar quando estiver disponível!
          </p>
        </DialogHeader>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Sucesso! 🎉
            </h3>
            <p className="text-sm text-gray-600">
              Você foi adicionado à fila de espera. Em breve entraremos em contato!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Seu nome completo"
                value={formData.name}
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

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-regular bg-[#208251] hover:bg-[#1e774a] transition-all duration-200"
              disabled={loading}
            >
              {loading && <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />}
              Entrar na fila de espera
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Ao entrar na fila, você concorda em receber atualizações sobre o Codorna.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
