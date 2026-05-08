import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
    }} className="px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '10px',
              padding: '6px 10px'
            }}>
              <span className="text-white font-black text-sm">TM</span>
            </div>
            <span className="text-white font-bold text-lg">TaskFlow</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {[
              { path: '/dashboard', label: 'Dashboard' },
              { path: '/projects', label: 'Projects' },
              { path: '/tasks', label: 'My Tasks' },
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                style={{
                  background: isActive(path) ? 'rgba(255,255,255,0.15)' : 'transparent',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  color: isActive(path) ? 'white' : 'rgba(255,255,255,0.7)',
                  fontWeight: isActive(path) ? '600' : '400',
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '700',
              fontSize: '13px'
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block">
              <p style={{ color: 'white', fontSize: '13px', fontWeight: '600', margin: 0 }}>{user?.name}</p>
              <span className={user?.role === 'admin' ? 'badge-admin' : 'badge-member'}>
                {user?.role?.toUpperCase()}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;