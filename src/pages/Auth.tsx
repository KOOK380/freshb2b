import { useState, FormEvent } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Box, User, Truck, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'restaurant' | 'driver' | 'customer'>('restaurant');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { signIn } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      const res = await signIn(email || 'demo@freshlink.io', role, isSignUp);
      if (res.error) {
        setErrorMsg(res.error.message);
      } else {
        const activeRole = useAuthStore.getState().role || role;
        if (activeRole === 'admin') navigate('/admin');
        if (activeRole === 'restaurant') navigate('/restaurant');
        if (activeRole === 'driver') navigate('/driver');
        if (activeRole === 'customer') navigate('/customer');
      }
    } catch (err) {
      setErrorMsg(String(err));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 font-sans flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-zinc-950 font-bold italic text-xl">G</div>
        </div>
        <h2 className="text-4xl font-extrabold text-white tracking-tight">
          FreshLink<span className="text-emerald-500 align-top text-xl ml-1">B2B</span>
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          B2B Grocery Delivery Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-zinc-900 py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-zinc-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-zinc-800 rounded-xl shadow-sm bg-zinc-950 text-white placeholder-zinc-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="demo@freshlink.io"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Select your role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('restaurant')}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 border rounded-xl transition-all cursor-pointer",
                    role === 'restaurant' 
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                      : "border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white bg-zinc-950/50"
                  )}
                >
                  <User className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">Restaurant</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('driver')}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 border rounded-xl transition-all cursor-pointer",
                    role === 'driver' 
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                      : "border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white bg-zinc-950/50"
                  )}
                >
                  <Truck className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">Driver</span>
                </button>
                 <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 border rounded-xl transition-all cursor-pointer",
                    role === 'admin' 
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                      : "border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white bg-zinc-950/50"
                  )}
                >
                  <Box className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 border rounded-xl transition-all cursor-pointer",
                    role === 'customer' 
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                      : "border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white bg-zinc-950/50"
                  )}
                >
                  <ShoppingBag className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">Customer</span>
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-sm font-medium">
                {errorMsg}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-zinc-950 bg-emerald-500 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-zinc-950 transition-colors"
              >
                {isLoading ? (isSignUp ? 'Signing up...' : 'Signing in...') : (isSignUp ? 'Sign Up' : 'Sign In')}
              </button>
            </div>
            
            <div className="flex flex-col space-y-2 mt-6 text-sm text-zinc-400 bg-zinc-950/50 p-4 border border-zinc-800 rounded-xl text-left">
              <p className="font-bold text-white mb-1">Demo Accounts (Click to use):</p>
              <button type="button" onClick={() => { setEmail('admin_demo@freshlink.io'); setRole('admin'); }} className="text-left py-1 hover:text-white transition flex items-center gap-2">🟢 admin_demo@freshlink.io <span className="text-xs border border-zinc-700 bg-zinc-900 px-1.5 rounded text-zinc-300">Admin</span></button>
              <button type="button" onClick={() => { setEmail('restaurant_demo@freshlink.io'); setRole('restaurant'); }} className="text-left py-1 hover:text-white transition flex items-center gap-2">🟢 restaurant_demo@freshlink.io <span className="text-xs border border-zinc-700 bg-zinc-900 px-1.5 rounded text-zinc-300">Restaurant</span></button>
              <button type="button" onClick={() => { setEmail('driver_demo@freshlink.io'); setRole('driver'); }} className="text-left py-1 hover:text-white transition flex items-center gap-2">🟢 driver_demo@freshlink.io <span className="text-xs border border-zinc-700 bg-zinc-900 px-1.5 rounded text-zinc-300">Driver</span></button>
              <button type="button" onClick={() => { setEmail('customer_demo@freshlink.io'); setRole('customer'); }} className="text-left py-1 hover:text-white transition flex items-center gap-2">🟢 customer_demo@freshlink.io <span className="text-xs border border-zinc-700 bg-zinc-900 px-1.5 rounded text-zinc-300">Customer</span></button>
              <p className="mt-2 text-xs text-amber-500/80 italic font-medium">Important: Make sure "Confirm email" is disabled in Supabase Authentication Settings!</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
