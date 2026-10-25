import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

// For react-router-dom v7 compatibility

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/admin/login" replace />
  }
  return <>{children}</>
}
