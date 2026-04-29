import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

const CreatorRoute = ({ children }) => {
  const { user, dbUser, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user || !['creator', 'admin'].includes(dbUser?.role)) return <Navigate to="/" replace />;
  return children;
};

export default CreatorRoute;
