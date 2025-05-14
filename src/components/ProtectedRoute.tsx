import { Navigate, Outlet } from 'react-router-dom';
import { useAuthState } from '../hooks/useAuthState';
import LoadingScreen from './LoadingScreen';

const ProtectedRoute = () => {
  const { user, loading } = useAuthState();

  if (loading) {
    return <LoadingScreen />;
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;