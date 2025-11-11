import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

export default function Protected() {
  const user = useSelector(s => s.auth.user)
  const loc = useLocation()
  if (!user) {
    return <Navigate to="/auth/sign-in" replace state={{ from: loc }} />
  }
  return <Outlet />
}
