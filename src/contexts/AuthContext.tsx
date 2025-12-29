import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { userService } from '@/services/userService'
import { useNavigate } from 'react-router-dom'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, userData: {
    nome: string
    telefone?: string
  }, navigate?: any) => Promise<{ error: any }>
  signUpPro: (email: string, password: string, userData: {
    nome: string
    telefone?: string
  }, navigate?: any) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
  updatePassword: (password: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      if (event === 'SIGNED_OUT') {
        toast({
          title: "Logout",
          description: "Você foi desconectado com sucesso.",
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [toast])

  const signUp = async (email: string, password: string, userData: {
    nome: string
    telefone?: string
  }, navigate?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.nome,
          last_name: '',
          phone: userData.telefone
        }
      }
    })

    if (error) {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      })
      return { error }
    }
    
    // Se o usuário foi criado com sucesso, salvar nas tabelas
    if (data.user) {
      try {
        const { data: rpcData, error: rpcError } = await supabase.rpc('create_trial_user', {
          p_user_id: data.user.id,
          p_user_email: data.user.email,
          p_user_nome: userData.nome,
          p_user_telefone: userData.telefone || ''
        })

        if (rpcError) {
          toast({
            title: "Aviso",
            description: "Usuário criado, mas houve um problema ao salvar dados adicionais.",
            variant: "destructive",
          })
        } else {
          if (rpcData && rpcData.success === false) {
            toast({
              title: "Erro",
              description: `Erro na função RPC: ${rpcData.message}`,
              variant: "destructive",
            })
          } else {
            toast({
              title: "Cadastro realizado!",
              description: "Bem-vindo ao Codorna! Seu período de teste de 7 dias começou agora.",
            })
          }
        }
      } catch (error) {
        toast({
          title: "Aviso",
          description: "Usuário criado, mas houve um problema ao salvar dados adicionais.",
          variant: "destructive",
        })
      }

      // Redirecionar para o dashboard
      if (navigate) {
        setTimeout(() => {
          navigate('/dashboard')
        }, 1000)
      }
    }

    return { error: null }
  }

  const signUpPro = async (email: string, password: string, userData: {
    nome: string
    telefone?: string
  }, navigate?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.nome,
          last_name: '',
          phone: userData.telefone,
          subscription_type: 'pro',
          is_pro: true
        }
      }
    })

    if (error) {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      })
      return { error }
    }

    // Se o usuário foi criado com sucesso, salvar na tabela users_2
    if (data.user) {
      try {
        const { data: rpcData, error: rpcError } = await supabase.rpc('create_pro_user', {
          p_user_id: data.user.id,
          p_user_email: data.user.email,
          p_user_nome: userData.nome,
          p_user_telefone: userData.telefone
        })

        if (rpcError) {
          toast({
            title: "Erro",
            description: "Erro ao criar usuário PRO.",
            variant: "destructive",
          })
        } else {
          if (rpcData && rpcData.success === false) {
            toast({
              title: "Erro",
              description: `Erro na função RPC: ${rpcData.message}`,
              variant: "destructive",
            })
          } else {
            toast({
              title: "Cadastro PRO realizado!",
              description: "Bem-vindo ao Codorna PRO!",
            })
          }
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao salvar dados do usuário.",
          variant: "destructive",
        })
      }

      // Redirecionar para o login
      if (navigate) {
        setTimeout(() => {
          navigate('/login')
        }, 1000)
      }
    }

    return { error: null }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast({
        title: "Erro no login",
        description:
          error.message === 'Invalid login credentials'
            ? 'Algum dos dados está inválido. Tente novamente.'
            : error.message,
        variant: "destructive",
      })
    }

    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer logout.",
        variant: "destructive",
      })
    }
  }

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "E-mail enviado!",
        description: "Verifique seu e-mail para redefinir a senha.",
      })
    }

    return { error }
  }

  const updatePassword = async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Senha atualizada!",
        description: "Sua senha foi redefinida com sucesso.",
      })
    }

    return { error }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signUpPro,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}