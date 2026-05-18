import { useDataStore } from "@/store/dataStore";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, ShoppingCart, Check } from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

export default function RestDashboard() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { products, cart, addToCart } = useDataStore();

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, products]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 md:pt-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Marketplace</h1>
          <p className="text-sm text-zinc-400 mt-1">Order fresh supplies for your restaurant.</p>
        </div>
        <button onClick={() => navigate('/restaurant/cart')} className="hidden md:flex items-center space-x-2 bg-emerald-500 text-zinc-950 px-4 py-2 rounded-xl hover:bg-emerald-400 font-bold transition">
          <ShoppingCart className="w-4 h-4" />
          <AnimatePresence mode="popLayout">
            <motion.span
              key={totalCartItems}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              Cart ({totalCartItems})
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input 
          type="text" 
          placeholder="Search products by name or category..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-zinc-900/80 text-white placeholder-zinc-500 transition-all shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredProducts.map((product) => {
          const cartItem = cart.find(c => c.id === product.id);
          const quantityInCart = cartItem ? cartItem.quantity : 0;
          
          return (
            <Card key={product.id} className="overflow-hidden flex flex-row sm:flex-col bg-zinc-900/50 border-zinc-800">
              <div className="w-1/3 sm:w-full h-32 sm:h-40 bg-zinc-950 flex flex-col items-center justify-center border-r sm:border-r-0 sm:border-b border-zinc-800 shrink-0 relative overflow-hidden">
                 {product.image ? (
                   <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                 ) : (
                   <>
                     <div className="w-12 h-12 sm:w-16 sm:h-16 bg-zinc-800 rounded-full mb-2 flex items-center justify-center text-xl">
                        {product.category === 'Vegetables' ? '🥬' : product.category === 'Grains' ? '🌾' : product.category === 'Oils' ? '🫒' : product.category === 'Meat' ? '🥩' : '🥖'}
                     </div>
                     <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider hidden sm:block">No Image</span>
                   </>
                 )}
                 {quantityInCart > 0 && (
                   <span className="absolute top-2 right-2 bg-emerald-500 text-zinc-950 text-xs font-bold px-2 py-1 rounded-lg">
                     {quantityInCart} in cart
                   </span>
                 )}
              </div>
              <CardContent className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1 sm:mb-2">
                    <div>
                      <h3 className="font-bold text-white text-sm sm:text-base leading-tight line-clamp-1">{product.name}</h3>
                      <p className="text-[10px] sm:text-xs text-zinc-400 mt-0.5">{product.category}</p>
                    </div>
                    <p className="font-bold text-emerald-400 text-sm sm:text-base ml-2">${product.price.toFixed(2)}</p>
                  </div>
                  <p className="text-[10px] sm:text-sm text-zinc-500 mb-2 sm:mb-4">Unit: {product.unit} &bull; In stock: {product.stock}</p>
                </div>
                
                <div className="mt-auto pt-2 sm:pt-4 border-t border-zinc-800/80 flex justify-between items-center">
                  <div className="flex items-center border border-zinc-700 bg-zinc-900 rounded-lg overflow-hidden">
                    <button 
                      onClick={() => addToCart(product, -1)}
                      disabled={quantityInCart === 0}
                      className="px-2.5 sm:px-3 py-1 sm:py-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300 font-medium transition disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-bold text-white border-l border-r border-zinc-800 bg-zinc-950">
                      {quantityInCart > 0 ? quantityInCart : 1}
                    </span>
                    <button 
                      onClick={() => addToCart(product, 1)}
                      className="px-2.5 sm:px-3 py-1 sm:py-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300 font-medium transition"
                    >
                      +
                    </button>
                  </div>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addToCart(product, 1)}
                    className="p-1.5 sm:p-2 bg-emerald-500 text-zinc-950 rounded-lg hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition relative overflow-hidden"
                  >
                    <AnimatePresence mode="wait">
                      {quantityInCart > 0 ? (
                        <motion.div key="check" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}>
                          <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.div>
                      ) : (
                        <motion.div key="plus" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}>
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Floating Action Cart Button on Mobile */}
      <button onClick={() => navigate('/restaurant/cart')} className="md:hidden fixed bottom-20 right-4 p-4 bg-emerald-500 text-zinc-950 rounded-full shadow-[0_4px_20px_rgba(16,185,129,0.4)] flex items-center justify-center z-40 transition-transform active:scale-95">
        <ShoppingCart className="w-6 h-6" />
        <AnimatePresence>
          {totalCartItems > 0 && (
            <motion.span 
              key={totalCartItems}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="absolute -top-1 -right-1 bg-zinc-950 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-emerald-500"
            >
              {totalCartItems}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
