import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

const CustomerLayout = lazy(() => import('./layouts/CustomerLayout'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));

const Home = lazy(() => import('./pages/Customer/Home'));
const Checkout = lazy(() => import('./pages/Customer/Checkout'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));

const Dashboard = lazy(() => import('./pages/Admin/Dashboard'));
const Orders = lazy(() => import('./pages/Admin/Orders'));
const Inventory = lazy(() => import('./pages/Admin/Inventory'));
const Settings = lazy(() => import('./pages/Admin/Settings'));

function AppLoading() {
  return (
    <div className="app-loading">
      <div className="app-loading__panel">
        <p className="app-loading__eyebrow">ShopSync</p>
        <h1 className="app-loading__title">Loading your workspace...</h1>
        <p className="app-loading__text">
          Preparing customer and admin portals.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Suspense fallback={<AppLoading />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/" element={<CustomerLayout />}>
                <Route index element={<Home />} />
                <Route
                  path="checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
              </Route>

              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="orders" element={<Orders />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}