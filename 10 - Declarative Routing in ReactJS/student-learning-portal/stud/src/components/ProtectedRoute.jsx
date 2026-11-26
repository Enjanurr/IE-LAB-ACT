import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

// Client-side guard for UX only. It is NOT authorization: a real server must
// verify identity on every request for protected data.
export default function ProtectedRoute() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Save the whole location object (pathname, search, hash) for after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}
