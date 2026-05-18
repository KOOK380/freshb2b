import { CheckCircle2 } from 'lucide-react';

const MOCK_HISTORY = [
  { id: 'ORD-1042', restaurant: 'Le Petit Bistro', date: 'Oct 24, 2:30 PM', items: 12, earnings: 15.50 },
  { id: 'ORD-1041', restaurant: 'Ocean Blue Seafood', date: 'Oct 24, 11:15 AM', items: 5, earnings: 8.25 },
  { id: 'ORD-1039', restaurant: 'Mama\'s Kitchen', date: 'Oct 23, 4:45 PM', items: 24, earnings: 22.00 },
  { id: 'ORD-1035', restaurant: 'Green Leaf Caffe', date: 'Oct 23, 1:20 PM', items: 8, earnings: 10.50 },
];

export default function DriverHistory() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Delivery History</h1>
          <p className="text-sm text-zinc-400 mt-1">Past completed deliveries and earnings.</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-center">
          <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Total Earnings</p>
          <p className="text-xl font-bold text-emerald-400">$340.50</p>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 md:p-6 space-y-4">
        {MOCK_HISTORY.map(delivery => (
          <div key={delivery.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-zinc-800/50 last:border-0 gap-4 sm:gap-0">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 mt-1">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">{delivery.restaurant}</h3>
                <p className="text-sm text-zinc-500 font-mono mb-2">{delivery.id} &bull; {delivery.items} items</p>
                <div className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded inline-block">
                  {delivery.date}
                </div>
              </div>
            </div>
            <div className="text-left sm:text-right flex sm:flex-col justify-between items-center sm:items-end border-t border-zinc-800 pt-3 sm:pt-0 sm:border-0 pl-14 sm:pl-0">
               <span className="text-xs text-zinc-500 sm:mb-1 block">Payout</span>
               <span className="font-bold text-white text-lg">${delivery.earnings.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
