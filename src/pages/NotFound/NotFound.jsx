import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <FaExclamationTriangle className="text-warning text-6xl mx-auto mb-4" />
      <h1 className="text-8xl font-extrabold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
      <p className="text-base-content/60 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <div className="flex gap-4 justify-center">
        <Link to="/" className="btn btn-primary">Go Home</Link>
        <Link to="/contests" className="btn btn-ghost">Browse Contests</Link>
      </div>
    </div>
  </div>
);

export default NotFound;
