import { Plus, X, Save, Edit2, Trash2, Tag } from 'lucide-react';
import { useState } from 'react';
import { useDataStore, Coupon } from '@/store/dataStore';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminCoupons() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useDataStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState<Partial<Coupon> | null>(null);

  const handleAdd = () => {
    setCurrentCoupon({ code: '', discountPercent: 10, active: true });
    setIsEditing(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setCurrentCoupon({ ...coupon });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!currentCoupon || !currentCoupon.code || !currentCoupon.discountPercent) return;
    
    if (currentCoupon.id) {
      updateCoupon(currentCoupon.id, currentCoupon);
    } else {
      addCoupon({ 
        code: currentCoupon.code, 
        discountPercent: Number(currentCoupon.discountPercent),
        active: currentCoupon.active ?? true
      });
    }
    
    setIsEditing(false);
    setCurrentCoupon(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      deleteCoupon(id);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Tag className="w-6 h-6" /> Coupons Management
          </h1>
          <p className="text-sm text-zinc-400">Create promo codes and discounts for your customers.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={handleAdd}
            className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 py-2 rounded-xl font-bold transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Coupon
          </button>
        )}
      </div>

      {isEditing && currentCoupon && (
        <Card className="bg-zinc-900/80 border-emerald-500/30">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white">{currentCoupon.id ? 'Edit Coupon' : 'Add New Coupon'}</h2>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">Coupon Code</label>
                <input 
                  type="text" 
                  value={currentCoupon.code || ''} 
                  onChange={e => setCurrentCoupon({...currentCoupon, code: e.target.value.toUpperCase()})}
                  placeholder="e.g. SUMMER20"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">Discount Percent (%)</label>
                <input 
                  type="number" 
                  value={currentCoupon.discountPercent || ''} 
                  onChange={e => setCurrentCoupon({...currentCoupon, discountPercent: Number(e.target.value)})}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">Status</label>
                <select 
                  value={currentCoupon.active ? 'true' : 'false'} 
                  onChange={e => setCurrentCoupon({...currentCoupon, active: e.target.value === 'true'})}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="true">Active</option>
                  <option value="false">Disabled</option>
                </select>
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
                <Save className="w-4 h-4" /> Save Coupon
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {coupons.map(coupon => (
          <div key={coupon.id} className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl flex flex-col gap-4 group/card relative overflow-hidden transition-all hover:border-zinc-700">
            <div className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity bg-zinc-950/80 backdrop-blur-sm rounded-lg border border-zinc-800 p-1 flex items-center gap-1">
              <button 
                onClick={() => handleEdit(coupon)}
                className="p-1.5 text-emerald-400 hover:bg-zinc-800 rounded-md transition"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => handleDelete(coupon.id)}
                className="p-1.5 text-red-400 hover:bg-zinc-800 rounded-md transition"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-xl font-bold text-emerald-500 border border-emerald-500/20 shrink-0">
                %
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-widest">{coupon.code}</h3>
              <div className="mt-2 flex items-center gap-3">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${coupon.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                  {coupon.active ? 'Active' : 'Disabled'}
                </span>
                <span className="text-sm font-bold text-emerald-500">
                  {coupon.discountPercent}% OFF
                </span>
              </div>
            </div>
          </div>
        ))}
        {coupons.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500">
            No coupons found. Create some for your users to enjoy!
          </div>
        )}
      </div>
    </div>
  );
}
