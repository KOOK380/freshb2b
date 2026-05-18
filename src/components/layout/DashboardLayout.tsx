import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  Users, 
  ShoppingCart, 
  Settings,
  LogOut,
  Truck,
  Menu,
  Bell,
  Home,
  ShoppingBag,
  Heart,
  TrendingUp,
  Tag
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function DashboardLayout() {
  const { role, profile, signOut } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const adminLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Inventory', path: '/admin/inventory', icon: Package },
    { name: 'Reports', path: '/admin/reports', icon: TrendingUp },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Drivers', path: '/admin/drivers', icon: Truck },
    { name: 'Restaurants', path: '/admin/restaurants', icon: Users },
    { name: 'Coupons', path: '/admin/coupons', icon: Tag },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const restaurantLinks = [
    { name: 'Products', path: '/restaurant', icon: Package },
    { name: 'Cart', path: '/restaurant/cart', icon: ShoppingCart },
    { name: 'My Orders', path: '/restaurant/orders', icon: LayoutDashboard },
    { name: 'Settings', path: '/restaurant/settings', icon: Settings },
  ];

  const driverLinks = [
    { name: 'My Deliveries', path: '/driver', icon: Truck },
    { name: 'Route Map', path: '/driver/map', icon: MapPin },
    { name: 'History', path: '/driver/history', icon: LayoutDashboard },
  ];

  const customerLinks = [
    { name: 'Market', path: '/customer', icon: Home },
    { name: 'Categories', path: '/customer/categories', icon: Package },
    { name: 'My Cart', path: '/customer/cart', icon: ShoppingBag },
    { name: 'Favorites', path: '/customer/favorites', icon: Heart },
    { name: 'Orders', path: '/customer/orders', icon: LayoutDashboard },
  ];

  const links = role === 'admin' ? adminLinks 
    : role === 'driver' ? driverLinks 
    : role === 'customer' ? customerLinks 
    : restaurantLinks;

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      {/* Sidebar (Desktop only) */}
      <aside
        className={cn(
          "w-64 border-r border-zinc-800 flex-col p-6 bg-zinc-900/50 flex-shrink-0 hidden md:flex"
        )}
      >
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-zinc-950 font-bold italic">G</div>
          <span className="text-xl font-bold tracking-tight text-white">
            FreshLink<span className="text-emerald-500 text-sm align-top ml-0.5">B2B</span>
          </span>
        </div>
        
        <nav className="space-y-2 flex-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.name}
                onClick={() => navigate(link.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors",
                  isActive 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                    : "text-zinc-400 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{link.name}</span>
              </button>
            )
          })}
        </nav>
        
        <div className="mt-auto border-t border-zinc-800 pt-6 flex flex-col gap-3">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>

          <div className="flex items-center gap-3 mt-2 pr-2">
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-emerald-500 shrink-0">
               {profile?.full_name?.[0]?.toUpperCase() || role?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-sm font-semibold capitalize truncate">{role} Portal</p>
              <p className="text-xs text-zinc-500 truncate">demo@freshlink.io</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen relative overflow-hidden bg-zinc-950">
        {/* Header */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-4 md:px-6 flex-shrink-0 z-10 bg-zinc-900/10">
          <div className="flex items-center space-x-4 md:hidden">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-zinc-950 font-bold italic">G</div>
              <span className="font-bold tracking-tight text-white">
                FreshLink<span className="text-emerald-500 text-[10px] align-top ml-0.5">B2B</span>
              </span>
            </div>
          </div>
          <div className="hidden md:flex flex-1"></div>
          <div className="flex items-center gap-3">
               <div className="hidden sm:flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm text-zinc-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
                  Connected
               </div>
            <button className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-zinc-900"></span>
            </button>
            <button 
              onClick={handleSignOut}
              className="p-2 md:hidden rounded-full text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-8 scroll-smooth text-zinc-100">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 flex justify-around p-2 pb-[env(safe-area-inset-bottom,0.5rem)] z-50">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.name}
                onClick={() => navigate(link.path)}
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-colors",
                  isActive ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <Icon className={cn("w-5 h-5 mb-1 transition-transform", isActive && "scale-110")} />
                <span className="text-[10px] font-medium leading-none">{link.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
