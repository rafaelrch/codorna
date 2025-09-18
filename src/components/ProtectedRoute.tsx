import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { fetchSubscriber, isSubscriptionActive } from '@/services/subscriptionService'
import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  // Comentado temporariamente - permitir acesso a todos os usuários logados
  // const [checkingSub, setCheckingSub] = useState(true)
  // const [allowed, setAllowed] = useState(false)
  const location = useLocation()

  // Comentado temporariamente - verificação de assinatura
  // useEffect(() => {
  //   const run = async () => {
  //     if (!user) {
  //       setAllowed(false)
  //       setCheckingSub(false)
  //       return
  //     }
  //     const { subscriber } = await fetchSubscriber()
  //     setAllowed(isSubscriptionActive(subscriber))
  //     setCheckingSub(false)
  //   }
  //   run()
  // }, [user])

  // Comentado temporariamente - loading de verificação de assinatura
  // if (loading || checkingSub) {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Comentado temporariamente - bloqueio por assinatura
  // if (!allowed) {
  //   return <Navigate to="/" replace />
  // }

  return <>{children}</>
}
