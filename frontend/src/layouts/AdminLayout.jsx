import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROUTES } from '../constants'

function AdminLayout({ children }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to={ROUTES.ADMIN_LOGIN} replace />
  return <div className="min-h-screen bg-gray-100">{children}</div>
}

export default AdminLayout