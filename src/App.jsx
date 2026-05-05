import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import OrderSuccess from './pages/OrderSuccess';
import PaymentFailed from './pages/PaymentFailed';
import Dashboard from './pages/admin/Dashboard';
import ProductsList from './pages/admin/ProductsList';
import AddProduct from './pages/admin/AddProduct';
import OrdersList from './pages/admin/OrdersList';
import UsersList from './pages/admin/UsersList';
import Expenses from './pages/admin/Expenses';
import StorefrontSettings from './pages/admin/StorefrontSettings';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:slug" element={<ProductDetails />} />
          <Route path="shop/:id" element={<ProductDetails />} />
          <Route path="order-success/:orderId" element={<OrderSuccess />} />
          <Route path="payment-failed" element={<PaymentFailed />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Route>

        <Route path="/admin" element={
          <ProtectedRoute requireRole="Admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<OrdersList />} />
          <Route path="users" element={<UsersList />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<AddProduct />} />
          <Route path="storefront" element={<StorefrontSettings />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
