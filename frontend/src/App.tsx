import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartCountProvider } from './contexts/CartCountContext';
import { ToastProvider } from './contexts/ToastContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';
import SellerActivationPage from './pages/SellerActivationPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import CategoryPage from './pages/CategoryPage';

function App() {
  return (
    <AuthProvider>
      <CartCountProvider>
        <ToastProvider>
          <Router>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                {/* Rotas públicas */}
                <Route index element={<HomePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="product/:id" element={<ProductPage />} />
                <Route path="category/:id" element={<CategoryPage />} />

                {/* Rotas protegidas — exigem autenticação */}
                <Route element={<ProtectedRoute />}>
                  <Route path="cart" element={<CartPage />} />
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="orders" element={<MyOrdersPage />} />
                  <Route path="seller/activate" element={<SellerActivationPage />} />
                  <Route path="seller/dashboard" element={<SellerDashboardPage />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </ToastProvider>
      </CartCountProvider>
    </AuthProvider>
  );
}

export default App;
