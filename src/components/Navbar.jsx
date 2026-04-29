import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon, FaTrophy } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Navbar = () => {
  const { user, dbUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout',
      confirmButtonColor: '#e74c3c',
    });
    if (result.isConfirmed) {
      await logout();
      navigate('/login');
    }
  };

  const navLinks = (
    <>
      <li><NavLink to="/">Home</NavLink></li>
      <li><NavLink to="/contests">All Contests</NavLink></li>
      <li><NavLink to="/leaderboard">Leaderboard</NavLink></li>
      <li><NavLink to="/about">About</NavLink></li>
      <li><NavLink to="/how-it-works">How It Works</NavLink></li>
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            {navLinks}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl font-bold text-primary flex items-center gap-2">
          <FaTrophy /> ContestHub
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navLinks}</ul>
      </div>

      <div className="navbar-end gap-2">
        <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>

        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt={dbUser?.name || user.displayName || 'User'}
                  src={dbUser?.photoUrl || user.photoURL || `https://ui-avatars.com/api/?name=${dbUser?.name || 'U'}`}
                />
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li className="menu-title px-4 py-2">
                <span className="font-semibold">{dbUser?.name || user.displayName}</span>
                <span className="text-xs text-base-content/50 capitalize">{dbUser?.role}</span>
              </li>
              <li>
                {dbUser?.role === 'admin' && <Link to="/dashboard/admin">Admin Dashboard</Link>}
                {dbUser?.role === 'creator' && <Link to="/dashboard/creator">Creator Dashboard</Link>}
                {dbUser?.role === 'user' && <Link to="/dashboard/user">My Dashboard</Link>}
              </li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
