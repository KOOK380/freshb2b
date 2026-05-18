import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useDataStore } from '@/store/dataStore';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import Auth from '@/pages/Auth';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminInventory from '@/pages/admin/AdminInventory';
import AdminDrivers from '@/pages/admin/AdminDrivers';
import AdminRestaurants from '@/pages/admin/AdminRestaurants';
import AdminReports from '@/pages/admin/AdminReports';
import AdminCoupons from '@/pages/admin/AdminCoupons';
import AdminSettings from '@/pages/admin/AdminSettings';
import RestDashboard from '@/pages/restaurant/RestDashboard';
import RestSettings from '@/pages/restaurant/RestSettings';
import DriverDashboard from '@/pages/driver/DriverDashboard';
import DriverMap from '@/pages/driver/DriverMap';
import DriverHistory from '@/pages/driver/DriverHistory';
import CustomerDashboard from '@/pages/customer/CustomerDashboard';
import CustomerCategories from '@/pages/customer/CustomerCategories';
import CustomerFavorites from '@/pages/customer/CustomerFavorites';
import CartPage from '@/pages/customer/Cart';
import OrdersPage from '@/pages/customer/Orders';

export default function App() {
  const { user, role, isLoading, checkUser } = useAuthStore();
  const { initializeData } = useDataStore();

  useEffect(() => {
    checkUser();
    initializeData();
  }, [checkUser, initializeData]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-pulse flex flex-col items-center"><div className="h-12 w-12 rounded-full bg-orange-200 mb-4"></div><div className="h-4 w-24 bg-gray-200 rounded"></div></div></div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/auth" 
          element={!user ? <Auth /> : <Navigate to={`/${role}`} replace />} 
        />
        
        {/* Protected Routes */}
        <Route element={user ? <DashboardLayout /> : <Navigate to="/auth" replace />}>
          
            {/* Admin Routes */}
          {role === 'admin' && (
            <Route path="/admin">
              <Route index element={<AdminDashboard />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="drivers" element={<AdminDrivers />} />
              <Route path="restaurants" element={<AdminRestaurants />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="coupons" element={<AdminCoupons />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          )}

          {/* Restaurant Routes */}
          {role === 'restaurant' && (
            <Route path="/restaurant">
              <Route index element={<RestDashboard />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="settings" element={<RestSettings />} />
            </Route>
          )}

          {/* Driver Routes */}
          {role === 'driver' && (
            <Route path="/driver">
              <Route index element={<DriverDashboard />} />
              <Route path="map" element={<DriverMap />} />
              <Route path="history" element={<DriverHistory />} />
            </Route>
          )}

          {/* Customer Routes */}
          {role === 'customer' && (
            <Route path="/customer">
              <Route index element={<CustomerDashboard />} />
              <Route path="categories" element={<CustomerCategories />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="favorites" element={<CustomerFavorites />} />
              <Route path="orders" element={<OrdersPage />} />
            </Route>
          )}

          {/* Fallback */}
          <Route path="/" element={<Navigate to={user ? `/${role}` : "/auth"} replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
