import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import CartDrawer from '../components/CartDrawer';
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  ShoppingCart,
  User,
} from 'lucide-react';

export default function CustomerLayout() {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount, toggleCart } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName = useMemo(() => {
    if (!user) return 'Guest';
    return (
      user.name ||
      user.fullName ||
      user.username ||
      (user.email ? user.email.split('@')[0] : 'User')
    );
  }, [user]);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/');
  };

  return (
    <div className="customer-shell">
      <header className="customer-header-dark">
        <div className="customer-header-dark__inner no-search">
          <Link to="/" className="customer-logo-dark">
            ShopSync
          </Link>

          <div className="customer-actions-dark">
            {user ? (
              <div className="customer-account-wrap">
                <button
                  className="customer-account-btn"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  type="button"
                >
                  <div className="customer-account-avatar">
                    {displayName.charAt(0).toUpperCase()}
                  </div>

                  <div className="customer-account-meta">
                    <span className="customer-account-name">{displayName}</span>
                    <span className="customer-account-sub">
                      Customer account
                    </span>
                  </div>

                  <ChevronDown size={16} />
                </button>

                {menuOpen && (
                  <div className="customer-account-menu">
                    <div className="customer-account-menu__head">
                      <div className="customer-account-avatar small">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="customer-account-name">{displayName}</div>
                        <div className="customer-account-sub">{user.email}</div>
                      </div>
                    </div>

                    {isAdmin && (
                      <button
                        className="customer-account-menu__item"
                        onClick={() => {
                          setMenuOpen(false);
                          navigate('/admin');
                        }}
                      >
                        <LayoutDashboard size={16} />
                        Admin Portal
                      </button>
                    )}

                    <button
                      className="customer-account-menu__item danger"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="customer-login-btn">
                <User size={16} />
                Login
              </Link>
            )}

            <button className="customer-cart-btn upgraded" onClick={toggleCart}>
              <ShoppingCart size={18} />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="customer-cart-badge">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="customer-main-dark">
        <Outlet />
      </main>

      <CartDrawer />

      <footer className="customer-footer-dark">
        © {new Date().getFullYear()} ShopSync
      </footer>
    </div>
  );
}