// src/App.jsx
import { Suspense, lazy } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';

// Lazy load components
const Login = lazy(() => import('./components/auth/Login'));
const Register = lazy(() => import('./components/auth/Register'));
const ForgotPassword = lazy(() => import('./components/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./components/auth/ResetPassword'));
const TwoFactorAuth = lazy(() => import('./components/auth/TwoFactorAuth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const DashboardHome = lazy(() => import('./pages/DashboardHome'));
const ProductList = lazy(() => import('./pages/ProductList'));
const AddProduct = lazy(() => import('./pages/AddProduct'));
const EditProduct = lazy(() => import('./pages/EditProduct'));
const PurchaseList = lazy(() => import('./pages/PurchaseList'));
const Reports = lazy(() => import('./pages/Reports'));
const Orders = lazy(() => import('./pages/Orders'));
const AddOrder = lazy(() => import('./pages/AddOrder'));
const EditOrder = lazy(() => import('./pages/EditOrder'));
const SupplierList = lazy(() => import('./pages/SupplierList'));
const AddSupplier = lazy(() => import('./pages/AddSupplier'));
const EditSupplier = lazy(() => import('./pages/EditSupplier'));
const Notifications = lazy(() => import('./pages/Notifications'));

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-2fa" element={<TwoFactorAuth />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/:id" element={<EditProduct />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="purchases" element={<PurchaseList />} />
            <Route path="reports" element={<Reports />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/new" element={<AddOrder />} />
            <Route path="orders/edit/:id" element={<EditOrder />} />
            <Route path="suppliers" element={<SupplierList />} />
            <Route path="suppliers/new" element={<AddSupplier />} />
            <Route path="suppliers/edit/:id" element={<EditSupplier />} />
          </Route>
          <Route path="/admin/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/:id" element={<EditProduct />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="purchases" element={<PurchaseList />} />
            <Route path="reports" element={<Reports />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/new" element={<AddOrder />} />
            <Route path="orders/edit/:id" element={<EditOrder />} />
            <Route path="suppliers" element={<SupplierList />} />
            <Route path="suppliers/new" element={<AddSupplier />} />
            <Route path="suppliers/edit/:id" element={<EditSupplier />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;