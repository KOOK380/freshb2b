import { useState, useEffect } from 'react';
import { useDataStore } from '@/store/dataStore';
import { useAuthStore } from '@/store/authStore';
import { Trash2, ArrowRight, MapPin, Navigation, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, placeOrder, coupons } = useDataStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [address, setAddress] = useState(localStorage.getItem("CUSTOMER_LOCATION") || '');
  const [phone, setPhone] = useState(user?.user_metadata?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, pct: number} | null>(null);
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lng, setLng] = useState<number | undefined>(undefined);
  const [locating, setLocating] = useState(false);
  
  const subtotal = cart.reduce((sum, item) => sum + ((typeof item.price === 'number' ? item.price : parseFloat(item.price)) * item.quantity), 0);
  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.pct / 100) : 0;
  const total = Math.max(0, subtotal - discountAmount);

  const handleCheckout = async () => {
    if (!address) {
      alert("Please enter a delivery address.");
      return;
    }
    if (!phone || !email) {
      alert("Please provide both phone number and email.");
      return;
    }
    await placeOrder(user?.id || 'guest', address, lat || 40.7128, lng || -74.0060, phone, email, discountAmount);
    alert("Order placed successfully!");
    navigate('/customer/orders');
  };

  const getUserLocation = () => {
    setLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
          setAddress(`GPS Location: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
          setLocating(false);
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Couldn't fetch location. Please enter it manually.");
          setLocating(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
      setLocating(false);
    }
  };

  const applyCoupon = () => {
    if (!couponCode) return;
    const found = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase() && c.active);
    if (found) {
      setAppliedCoupon({ code: found.code, pct: found.discountPercent });
    } else {
      alert("Invalid or inactive coupon code.");
      setAppliedCoupon(null);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center text-4xl mb-4">🛒</div>
        <h2 className="text-xl font-bold text-white">Your cart is empty</h2>
        <p className="text-zinc-500">Go back and add some fresh products!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white tracking-tight">Your Cart</h1>
      
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-4 md:p-6 space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-4 border-b border-zinc-800/50 last:border-0">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-zinc-800 rounded-xl flex items-center justify-center text-2xl">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  item.category === 'Vegetables' ? '🥬' : item.category === 'Grains' ? '🌾' : item.category === 'Oils' ? '🫒' : '🥖'
                )}
              </div>
              <div>
                <h3 className="font-bold text-white">{item.name}</h3>
                <p className="text-xs text-zinc-500">{item.unit}</p>
                <p className="text-sm font-medium text-emerald-400 mt-1">${(typeof item.price === 'number' ? item.price : parseFloat(item.price)).toFixed(2)} x {item.quantity}</p>
              </div>
            </div>
            <button 
              onClick={() => removeFromCart(item.id)}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
        
        <div className="pt-4 border-t border-zinc-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Contact Phone</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  className="bg-zinc-950 border border-zinc-800 text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Contact Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-zinc-950 border border-zinc-800 text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Delivery Address</span>
                  <button onClick={getUserLocation} className="text-emerald-500 hover:text-emerald-400 flex items-center gap-1 normal-case text-xs">
                    <Navigation className="w-3 h-3" /> Get Location
                  </button>
                </label>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter address manually..."
                  className="bg-zinc-950 border border-zinc-800 text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> Coupon Code
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 bg-zinc-950 border border-zinc-800 text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-500 uppercase"
                  />
                  <button 
                    onClick={applyCoupon}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-xs text-emerald-400 font-medium">Coupon {appliedCoupon.code} applied! (-{appliedCoupon.pct}%)</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-zinc-800 space-y-4">
          
          <div className="flex flex-col gap-1 items-end pt-2">
             {appliedCoupon && (
               <>
                 <div className="text-sm font-medium text-zinc-400">Subtotal: ${subtotal.toFixed(2)}</div>
                 <div className="text-sm font-bold text-emerald-400">Discount: -${discountAmount.toFixed(2)}</div>
               </>
             )}
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xl font-bold text-white">
              Total: <span className="text-emerald-400">${total.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={!address || !phone || !email}
              className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-bold px-8 py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              Checkout <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
