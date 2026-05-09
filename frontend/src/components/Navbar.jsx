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
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      padding: '12px 24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '10px',
              padding: '6px 10px'
            }}>
              <span style={{ color: 'white', fontWeight: '900', fontSize: '14px' }}>TM</span>
            </div>
            <span style={{ color: 'white', fontWeight: '700', fontSize: '18px' }}>TaskFlow</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
              fontSize: '13px',
              flexShrink: 0
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
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