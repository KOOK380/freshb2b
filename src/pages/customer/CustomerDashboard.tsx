import { useDataStore } from "@/store/dataStore";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ShoppingBag, ArrowRight, Star, Check, MapPin } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

const CATEGORIES = [
  { id: 1, name: "Fresh Produce", icon: "🍎", count: 120 },
  { id: 2, name: "Dairy & Eggs", icon: "🥚", count: 45 },
  { id: 3, name: "Bakery", icon: "🥖", count: 32 },
  { id: 4, name: "Meat & Poultry", icon: "🥩", count: 56 },
  { id: 5, name: "Pantry", icon: "🥫", count: 210 },
  { id: 6, name: "Beverages", icon: "🧃", count: 88 },
];

export default function CustomerDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [deliveryLocation, setDeliveryLocation] = useState(localStorage.getItem("CUSTOMER_LOCATION") || "");
  const [tempLocation, setTempLocation] = useState("");
  const navigate = useNavigate();
  const { products, cart, addToCart } = useDataStore();

  useEffect(() => {
    const q = searchParams.get("search");
    if (q) setSearch(q);
  }, [searchParams]);

  const handleSaveLocation = () => {
    localStorage.setItem("CUSTOMER_LOCATION", tempLocation);
    setDeliveryLocation(tempLocation);
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
  }, [search, products]);

  return (
    <div className="space-y-6 flex flex-col min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 md:pt-0">
        <div className="flex justify-between items-start md:block">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Market! 👋</h1>
            {deliveryLocation ? (
               <p className="text-sm text-zinc-400 mt-1 flex items-center gap-1 cursor-pointer hover:text-white transition" onClick={() => setDeliveryLocation("")}>
                 <MapPin className="w-3.5 h-3.5" /> Delivering to: <span className="text-white font-medium truncate max-w-[150px]">{deliveryLocation}</span>
               </p>
            ) : (
               <p className="text-sm text-zinc-400 mt-1">Order your daily groceries delivered in minutes.</p>
            )}
          </div>
          <button onClick={() => navigate('/customer/cart')} className="md:hidden relative p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors shrink-0">
            <ShoppingBag className="w-5 h-5" />
            <AnimatePresence>
              {totalCartItems > 0 && (
                <motion.span 
                  key={totalCartItems}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 text-zinc-950 font-bold text-[10px] flex items-center justify-center rounded-full border-2 border-zinc-950"
                >
                  {totalCartItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search groceries..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-zinc-800 bg-zinc-900/80 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all shadow-sm"
            />
          </div>
          <button onClick={() => navigate('/customer/cart')} className="hidden md:flex relative p-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors shrink-0">
            <ShoppingBag className="w-5 h-5" />
            <AnimatePresence>
              {totalCartItems > 0 && (
                <motion.span 
                  key={totalCartItems}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 text-zinc-950 font-bold text-[10px] flex items-center justify-center rounded-full border-2 border-zinc-950"
                >
                  {totalCartItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Location Modal */}
      {!deliveryLocation && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 shadow-2xl">
            <CardContent className="p-6">
               <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                 <MapPin className="w-6 h-6 text-emerald-500" />
               </div>
               <h2 className="text-xl font-bold text-white mb-2">Check Delivery Area</h2>
               <p className="text-sm text-zinc-400 mb-6">Enter your address to see fresh products available in your area based on our service radius.</p>
               <div className="space-y-4">
                 <input 
                   type="text" 
                   value={tempLocation}
                   onChange={(e) => setTempLocation(e.target.value)}
                   autoFocus
                   placeholder="Enter your street address..."
                   className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 text-white rounded-xl focus:outline-none focus:border-emerald-500"
                 />
                 <button 
                   onClick={handleSaveLocation}
                   disabled={!tempLocation.trim()}
                   className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-bold py-3 rounded-xl transition"
                 >
                   Find Food
                 </button>
               </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Hero Banner / Promo */}
      <div className="bg-emerald-500 rounded-3xl p-5 md:p-8 flex items-center justify-between shadow-[0_10px_40px_rgba(16,185,129,0.15)] relative overflow-hidden">
        <div className="relative z-10 max-w-sm">
          <span className="inline-block px-2.5 py-1 md:px-3 md:py-1 bg-zinc-950 text-emerald-400 text-[10px] md:text-xs font-bold rounded-full mb-2 md:mb-3 shadow-lg">New Customers</span>
          <h2 className="text-xl md:text-3xl font-bold text-zinc-950 leading-tight mb-2">Get 20% off your first delivery order!</h2>
          <p className="text-zinc-900/80 text-xs md:text-sm font-medium mb-4">Use code <strong className="text-zinc-950 bg-white/20 px-1 rounded">FRESH20</strong> at checkout.</p>
          <button className="bg-zinc-950 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-xl text-xs md:text-sm font-bold shadow-xl hover:bg-zinc-800 transition flex items-center gap-2">
            Claim Offer <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
          </button>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-zinc-900/20 to-transparent flex items-center justify-end pr-4 md:pr-8">
          <div className="text-[80px] md:text-[120px] leading-none opacity-20 transform rotate-12 select-none">🥦</div>
        </div>
      </div>

      {/* Main Grid: Categories & Featured */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* Categories Panel */}
        <Card className="lg:col-span-1 border-zinc-800 bg-zinc-900/50 flex flex-col">
          <div className="p-5 border-b border-zinc-800/80 flex justify-between items-center">
            <h3 className="font-bold text-white tracking-wide text-sm uppercase">Shop by Category</h3>
            <span className="text-emerald-500 text-xs font-bold hover:underline cursor-pointer">View All</span>
          </div>
          <CardContent className="p-4 flex-1">
            <div className="grid grid-cols-2 gap-3 h-full">
              {CATEGORIES.map((cat) => (
                <div 
                  key={cat.id} 
                  onClick={() => setSearch(cat.name)}
                  className="bg-zinc-950/50 border border-zinc-800/80 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-zinc-800/50 hover:border-zinc-700 transition cursor-pointer text-center group"
                >
                  <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-200">{cat.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-medium uppercase mt-0.5">{cat.count} Items</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Featured Items Grid */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-4 pl-2">
            <h3 className="font-bold text-white tracking-wide text-sm uppercase">Featured Products</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.slice(0, 4).map((item) => {
              const cartItem = cart.find(c => c.id === item.id);
              const quantityInCart = cartItem ? cartItem.quantity : 0;
              
              return (
                <Card key={item.id} className="bg-zinc-900/50 border-zinc-800 flex overflow-hidden hover:border-zinc-700 transition relative">
                  {quantityInCart > 0 && (
                    <span className="absolute top-2 left-2 bg-emerald-500 text-zinc-950 text-[10px] font-bold px-1.5 py-0.5 rounded-md z-10 shadow-sm">
                      {quantityInCart} in cart
                    </span>
                  )}
                  <div className="w-1/3 bg-zinc-950 flex items-center justify-center border-r border-zinc-800/50 text-4xl relative overflow-hidden shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      item.category === 'Vegetables' ? '🥬' : item.category === 'Grains' ? '🌾' : item.category === 'Oils' ? '🫒' : '🥖'
                    )}
                  </div>
                  <div className="w-2/3 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-white text-sm line-clamp-1">{item.name}</h4>
                        <div className="flex items-center gap-1 bg-zinc-950 px-1.5 py-0.5 rounded text-[10px] font-bold text-zinc-300">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> 4.9
                        </div>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">Per {item.unit}</p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="font-bold text-emerald-400">${item.price.toFixed(2)}</span>
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => addToCart(item, 1)}
                        className="bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-white p-1.5 rounded-lg transition-colors overflow-hidden"
                      >
                        <AnimatePresence mode="wait">
                          {quantityInCart > 0 ? (
                            <motion.div key="check" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}>
                              <Check className="w-4 h-4" />
                            </motion.div>
                          ) : (
                            <motion.div key="bag" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}>
                              <ShoppingBag className="w-4 h-4" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </div>
                  </div>
                </Card>
              );
            })}
            
            {/* Quick action card */}
            <Card className="sm:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800 px-6 py-5 flex items-center justify-between">
               <div>
                  <h4 className="text-sm font-bold text-white">Repeat Last Order</h4>
                  <p className="text-xs text-zinc-400 mt-1">Get your usual items in just one tap.</p>
               </div>
               <button className="bg-zinc-100 hover:bg-white text-zinc-950 px-4 py-2 rounded-xl text-sm font-bold transition">
                 Reorder $45.20
               </button>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
