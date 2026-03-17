import { useNavigate, Link, useLocation } from 'react-router-dom';
import { getUser, clearAuth } from '../api';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  if (!user) return null;

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-brand">
          <span className="brand-icon-sm">🛡️</span>
          <span>Zomato Shield</span>
        </Link>
        <div className="navbar-links">
          <Link
            to="/dashboard"
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link
            to="/admin"
            className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
          >
            Admin
          </Link>
        </div>
        <div className="navbar-user">
          <span className="user-badge">{user.name?.charAt(0)?.toUpperCase()}</span>
          <span className="user-name">{user.name}</span>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}
