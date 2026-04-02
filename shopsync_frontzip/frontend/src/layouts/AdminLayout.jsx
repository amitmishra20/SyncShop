import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Settings,
  LogOut,
  BarChart3,
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;

  const isAdmin =
    user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN';

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const rawName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    (user?.email ? user.email.split('@')[0] : 'Admin');

  const displayName =
    rawName && rawName.trim().length > 0 ? rawName : 'Admin';

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/admin' },
    { name: 'Orders', icon: <ShoppingCart size={18} />, path: '/admin/orders' },
    { name: 'Inventory', icon: <Package size={18} />, path: '/admin/inventory' },
    { name: 'Settings', icon: <Settings size={18} />, path: '/admin/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__title">ShopSync</div>
          <div className="admin-sidebar__sub">
            Admin SaaS workspace
          </div>
        </div>

        <nav className="admin-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `admin-nav__link${isActive ? ' active' : ''}`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <button className="admin-nav__link" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1 className="admin-topbar__title">Admin Portal</h1>
            <p className="admin-topbar__subtitle">
              Manage orders, inventory, and performance from one workspace.
            </p>
          </div>

          <div className="admin-userbox">
            <div className="admin-userbox__avatar">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>{displayName}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Administrator
              </div>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <div className="admin-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}