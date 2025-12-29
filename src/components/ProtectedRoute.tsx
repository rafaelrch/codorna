import { useAuth } from '@/contexts/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'
import { ArrowPathIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'
import { userService } from '@/services/userService'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()
  const [accessLoading, setAccessLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(true)

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setAccessLoading(false)
        return
      }

      try {
        const accessResult = await userService.evaluateAccessStatus()
        
        // Se há um redirecionamento necessário, significa que não tem acesso
        if (accessResult.redirectTo) {
          setHasAccess(false)
        } else {
          setHasAccess(true)
        }
      } catch (error) {
        // Em caso de erro, negar acesso por segurança
        setHasAccess(false)
      } finally {
        setAccessLoading(false)
      }
    }

    if (!loading && user) {
      checkAccess()
    } else if (!loading && !user) {
      setAccessLoading(false)
    }
  }, [user, loading])

  // Loading de autenticação ou verificação de acesso
  if (loading || accessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ArrowPathIcon className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Se o trial expirou e não é PRO, redirecionar para página de trial expirado
  if (!hasAccess) {
    return <Navigate to="/trial-expired" replace />
  }

  return <>{children}</>
}
