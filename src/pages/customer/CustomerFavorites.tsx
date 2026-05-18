import { Heart, ShoppingBag } from 'lucide-react';
import { useDataStore } from '@/store/dataStore';

export default function CustomerFavorites() {
  const { products, addToCart } = useDataStore();
  
  // Just show first 2 products as favorites for demo
  const favorites = products.slice(0, 2);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20 md:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Saved Favorites</h1>
        <p className="text-sm text-zinc-400 mt-1">Quick reorder your most loved items.</p>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-4 text-rose-500/20 text-4xl">
             <Heart className="w-8 h-8 fill-rose-500/20 text-rose-500/20" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No favorites yet</h2>
          <p className="text-zinc-500">Tap the heart icon on products to save them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((item) => (
            <div key={item.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl flex overflow-hidden hover:border-zinc-700 transition relative">
              <button className="absolute top-2 right-2 p-1.5 bg-zinc-950/80 backdrop-blur rounded-full text-rose-500 z-10 transition hover:scale-110">
                <Heart className="w-4 h-4 fill-rose-500" />
              </button>
              <div className="w-1/3 bg-zinc-950 flex items-center justify-center border-r border-zinc-800/50 text-4xl">
                {item.category === 'Vegetables' ? '🥬' : item.category === 'Grains' ? '🌾' : item.category === 'Oils' ? '🫒' : '🥖'}
              </div>
              <div className="w-2/3 p-4 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm line-clamp-1 pr-6">{item.name}</h4>
                  <p className="text-xs text-zinc-500 mt-1">Per {item.unit}</p>
                </div>
                <div className="flex justify-between items-center mt-4 border-t border-zinc-800/50 pt-3">
                  <span className="font-bold text-emerald-400">${item.price.toFixed(2)}</span>
                  <button 
                    onClick={() => addToCart(item)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-3 py-1.5 rounded-lg transition-colors text-xs font-bold flex items-center gap-1"
                  >
                    <ShoppingBag className="w-3 h-3" /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
