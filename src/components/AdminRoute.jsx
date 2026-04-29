import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

const AdminRoute = ({ children }) => {
  const { user, dbUser, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user || dbUser?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

export default AdminRoute;
