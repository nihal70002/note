import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const PaymentFailed = lazy(() => import('./pages/PaymentFailed'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProductsList = lazy(() => import('./pages/admin/ProductsList'));
const AddProduct = lazy(() => import('./pages/admin/AddProduct'));
const OrdersList = lazy(() => import('./pages/admin/OrdersList'));
const UsersList = lazy(() => import('./pages/admin/UsersList'));
const Expenses = lazy(() => import('./pages/admin/Expenses'));
const StorefrontSettings = lazy(() => import('./pages/admin/StorefrontSettings'));

function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div className="container mx-auto py-24 text-center text-taupe">Loading...</div>}>
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
      </Suspense>
    </>
  );
}

export default App;
