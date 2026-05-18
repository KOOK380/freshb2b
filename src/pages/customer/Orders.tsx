import { useDataStore } from '@/store/dataStore';
import { useAuthStore } from '@/store/authStore';
import { Package, Truck } from 'lucide-react';

export default function OrdersPage() {
  const { orders, drivers, assignDriver, updateOrderStatus } = useDataStore();
  const { user, role } = useAuthStore();
  
  // Basic filtering for demo simplicity. Admin/Driver see all, others see theirs.
  const myOrders = (role === 'admin' || role === 'driver') 
    ? orders 
    : orders.filter((o) => o.userId === user?.id);

  if (myOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 pt-20">
        <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center text-4xl mb-4 text-emerald-500">
           <Package className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-white">No Orders Found</h2>
        <p className="text-zinc-500">You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white tracking-tight">
        {role === 'admin' ? 'All Orders' : 'My Orders'}
      </h1>
      
      <div className="grid grid-cols-1 gap-4">
        {myOrders.map((order) => (
          <div key={order.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-sm text-zinc-500">{order.id}</span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                  order.status === 'Delivered' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' :
                  order.status === 'En Route' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                  'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                }`}>
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-zinc-400 mb-2">Placed: {new Date(order.date).toLocaleString()}</p>
              <div className="flex gap-2">
                 {order.items.map((item, idx) => (
                   <span key={idx} className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-300">
                     {item.quantity}x {item.name}
                   </span>
                 ))}
              </div>
            </div>
            
            <div className="flex flex-col items-start md:items-end justify-between border-t border-zinc-800 pt-4 md:pt-0 md:border-0 hover:bg-transparent min-w-[200px]">
               <div className="text-xl font-bold text-emerald-400">${order.total.toFixed(2)}</div>
               
               {role === 'admin' && (
                 <div className="mt-4 flex flex-col gap-2 w-full">
                   <div className="flex flex-col gap-1 w-full">
                     <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Assign Driver</label>
                     <select 
                       value={order.driverId || ''} 
                       onChange={(e) => assignDriver(order.id, e.target.value)}
                       className="bg-zinc-950 border border-zinc-800 text-white rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                     >
                       <option value="">Unassigned</option>
                       {drivers.filter(d => d.status === 'Active').map(d => (
                         <option key={d.id} value={d.id}>{d.name}</option>
                       ))}
                     </select>
                   </div>
                   <div className="flex flex-col gap-1 w-full">
                     <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Status</label>
                     <select 
                       value={order.status} 
                       onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                       className="bg-zinc-950 border border-zinc-800 text-white rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
                     >
                       <option value="Processing">Processing</option>
                       <option value="En Route">En Route</option>
                       <option value="Delivered">Delivered</option>
                       <option value="Cancelled">Cancelled</option>
                     </select>
                   </div>
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
