import { useState } from 'react';
import { useDataStore, Product } from '@/store/dataStore';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Plus, X, Save, Trash2, Upload, ImageIcon } from 'lucide-react';

export default function AdminInventory() {
  const { products, addProduct, updateProduct, deleteProduct } = useDataStore();
  const [search, setSearch] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    setCurrentProduct({ name: '', category: 'Vegetables', price: 0, stock: 0, unit: 'kg', image: '' });
    setIsEditing(true);
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct({ ...product });
    setIsEditing(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloudName = localStorage.getItem('CLOUDINARY_CLOUD_NAME') || import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = localStorage.getItem('CLOUDINARY_UPLOAD_PRESET') || import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert("Cloudinary credentials are not configured in settings or .env");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.secure_url) {
        setCurrentProduct(prev => prev ? { ...prev, image: data.secure_url } : null);
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Check console.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!currentProduct || !currentProduct.name) return;
    
    if (currentProduct.id) {
      await updateProduct(currentProduct.id, currentProduct);
    } else {
      await addProduct(currentProduct as Omit<Product, 'id'>);
    }
    
    setIsEditing(false);
    setCurrentProduct(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventory Management</h1>
          <p className="text-sm text-zinc-400">Manage your product catalog and stock levels.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={handleAdd}
            className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 py-2 rounded-xl font-bold transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        )}
      </div>

      {isEditing && currentProduct && (
        <Card className="bg-zinc-900/80 border-emerald-500/30">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white">{currentProduct.id ? 'Edit Product' : 'Add New Product'}</h2>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">Product Name</label>
                <input 
                  type="text" 
                  value={currentProduct.name || ''} 
                  onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">Category</label>
                <select 
                  value={currentProduct.category || ''} 
                  onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option>Vegetables</option>
                  <option>Grains</option>
                  <option>Oils</option>
                  <option>Meat</option>
                  <option>Baking</option>
                  <option>Beverages</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">Price ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={currentProduct.price || 0} 
                  onChange={e => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">Unit (e.g. kg, 5L)</label>
                <input 
                  type="text" 
                  value={currentProduct.unit || ''} 
                  onChange={e => setCurrentProduct({...currentProduct, unit: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">Stock</label>
                <input 
                  type="number" 
                  value={currentProduct.stock || 0} 
                  onChange={e => setCurrentProduct({...currentProduct, stock: parseInt(e.target.value, 10)})}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-zinc-400">Product Image</label>
                <div className="flex items-center gap-4 mt-1">
                  {currentProduct.image ? (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-zinc-800">
                      <img src={currentProduct.image} alt="Product" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setCurrentProduct({...currentProduct, image: undefined})}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="flex items-center justify-center w-full max-w-[200px] gap-2 px-4 py-2 border border-dashed border-zinc-700 rounded-xl cursor-pointer hover:bg-zinc-800/50 transition bg-zinc-900">
                      <Upload className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-medium text-zinc-300">
                        {isUploading ? 'Uploading...' : 'Upload Image'}
                      </span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
                    <p className="text-[10px] text-zinc-500 mt-2 flex gap-1">
                      Powered by Cloudinary (Max 5MB)
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-lg text-sm font-bold transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Product
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden text-sm">
        <div className="p-4 border-b border-zinc-800">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full sm:max-w-xs bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-950/50 text-zinc-400">
              <tr>
                <th className="px-6 py-3 font-semibold uppercase tracking-wider text-[10px]">Product Name</th>
                <th className="px-6 py-3 font-semibold uppercase tracking-wider text-[10px]">Category</th>
                <th className="px-6 py-3 font-semibold uppercase tracking-wider text-[10px]">Price</th>
                <th className="px-6 py-3 font-semibold uppercase tracking-wider text-[10px]">Stock</th>
                <th className="px-6 py-3 font-semibold uppercase tracking-wider text-[10px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {filtered.map(product => (
                <tr key={product.id} className="hover:bg-zinc-800/20 transition">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                    {product.image ? (
                      <div className="w-8 h-8 rounded-lg overflow-hidden border border-zinc-800 shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-emerald-500 shrink-0">
                        <Package className="w-4 h-4" />
                      </div>
                    )}
                    <span className="line-clamp-1">{product.name}</span>
                  </td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">${typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2)} / {product.unit}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${product.stock < 50 ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-3">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="text-emerald-400 hover:text-emerald-300 font-medium text-xs transition"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="text-red-400 hover:text-red-300 font-medium text-xs transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
