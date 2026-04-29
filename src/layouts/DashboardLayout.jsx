import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaTrophy, FaList, FaUsers, FaPlus, FaUpload, FaUser, FaMedal, FaSignOutAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

const DashboardLayout = () => {
  const { dbUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({ title: 'Logout?', icon: 'question', showCancelButton: true, confirmButtonText: 'Yes, logout', confirmButtonColor: '#e74c3c' });
    if (result.isConfirmed) { await logout(); navigate('/login'); }
  };

  const adminLinks = [
    { to: '/dashboard/admin', label: 'Overview', icon: <FaHome /> },
    { to: '/dashboard/admin/users', label: 'Manage Users', icon: <FaUsers /> },
    { to: '/dashboard/admin/contests', label: 'Manage Contests', icon: <FaList /> },
  ];

  const creatorLinks = [
    { to: '/dashboard/creator', label: 'Overview', icon: <FaHome /> },
    { to: '/dashboard/creator/add-contest', label: 'Add Contest', icon: <FaPlus /> },
    { to: '/dashboard/creator/my-contests', label: 'My Contests', icon: <FaList /> },
  ];

  const userLinks = [
    { to: '/dashboard/user', label: 'Overview', icon: <FaHome /> },
    { to: '/dashboard/user/participated', label: 'Participated', icon: <FaTrophy /> },
    { to: '/dashboard/user/won', label: 'Won Contests', icon: <FaMedal /> },
    { to: '/dashboard/user/profile', label: 'My Profile', icon: <FaUser /> },
  ];

  const links = dbUser?.role === 'admin' ? adminLinks : dbUser?.role === 'creator' ? creatorLinks : userLinks;

  return (
    <div className="drawer lg:drawer-open min-h-screen">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="navbar bg-base-100 lg:hidden shadow-sm">
          <label htmlFor="dashboard-drawer" className="btn btn-ghost drawer-button">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <span className="text-xl font-bold text-primary ml-2">Dashboard</span>
        </div>
        <main className="flex-1 p-6 bg-base-200">
          <Outlet />
        </main>
      </div>
      <div className="drawer-side z-40">
        <label htmlFor="dashboard-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <aside className="bg-base-100 w-64 min-h-full flex flex-col">
          <div className="p-4 border-b border-base-200">
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img src={dbUser?.photoUrl || `https://ui-avatars.com/api/?name=${dbUser?.name || 'U'}`} alt={dbUser?.name} />
                </div>
              </div>
              <div>
                <p className="font-semibold text-sm">{dbUser?.name}</p>
                <p className="text-xs text-base-content/50 capitalize">{dbUser?.role}</p>
              </div>
            </div>
          </div>
          <ul className="menu p-4 flex-1">
            {links.map(({ to, label, icon }) => (
              <li key={to}>
                <NavLink to={to} end className={({ isActive }) => isActive ? 'active' : ''}>
                  {icon} {label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="p-4 border-t border-base-200">
            <NavLink to="/" className="btn btn-ghost btn-sm w-full mb-2">
              <FaHome /> Back to Home
            </NavLink>
            <button onClick={handleLogout} className="btn btn-error btn-sm w-full">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;
