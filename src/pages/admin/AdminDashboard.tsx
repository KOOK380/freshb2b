import { useDataStore } from "@/store/dataStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Truck, Users, ArrowUpRight } from "lucide-react";

export default function AdminDashboard() {
  const { orders } = useDataStore();

  const stats = [
    { title: "Total Orders", value: orders.length.toString(), change: "+12.5%", icon: ShoppingCart },
    { title: "Active Drivers", value: "24", change: "+4.1%", icon: Truck },
    { title: "Restaurants", value: "48", change: "+2.4%", icon: Users },
    { title: "Inventory Items", value: "2,450", change: "-1.2%", icon: Package },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-zinc-400">Track your daily deliveries and inventory.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-4">
        {stats.map((stat, i) => (
          <Card key={i} className="p-3 md:p-6 bg-zinc-900/50 border-zinc-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-2 md:pb-4 border-b border-zinc-800/50 mb-2 md:mb-4">
              <span className="text-[10px] md:text-sm font-bold tracking-wider uppercase text-zinc-500 order-2 md:order-1 mt-2 md:mt-0">
                {stat.title}
              </span>
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-zinc-800 flex items-center justify-center order-1 md:order-2">
                <stat.icon className="w-3 h-3 md:w-4 md:h-4 text-emerald-500" />
              </div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
              <p className={stat.change.startsWith('+') ? "text-[10px] md:text-xs text-emerald-400 font-medium flex items-center mt-1" : "text-[10px] md:text-xs text-red-400 font-medium flex items-center mt-1"}>
                {stat.change} <ArrowUpRight className="w-3 h-3 ml-1" />
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-400">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orders.slice(0,5).map((order, i) => {
                const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
                const colorMap = {
                  'Delivered': 'text-zinc-500 bg-zinc-800 border-zinc-700',
                  'En Route': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                  'Processing': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                  'Cancelled': 'text-red-400 bg-red-500/10 border-red-500/20'
                };
                const classStr = colorMap[order.status] || colorMap['Processing'];

                return (
                  <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:bg-zinc-800/50 cursor-pointer transition gap-3 sm:gap-0">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-300 text-xs sm:text-base shrink-0">
                        {order.userId.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm sm:text-base">{order.userId}</p>
                        <p className="text-[10px] sm:text-sm text-zinc-500 font-mono">{order.id} &bull; {totalItems} items</p>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-0 border-zinc-800 pt-2 sm:pt-0">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase border ${classStr}`}>
                        ● {order.status}
                      </span>
                      <p className="text-sm font-bold sm:mt-1 text-white">${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-400">Active Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "James T.", route: "Route D-802", stops: 3, status: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" },
                { name: "Sarah M.", route: "Route D-803", stops: 1, status: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" },
                { name: "Mike R.", route: "Route D-804", stops: 5, status: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" },
                { name: "Linda B.", route: "Route D-805", stops: 0, status: "bg-zinc-500" },
              ].map((driver, i) => (
                <div key={i} className="flex items-center space-x-4 p-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-400">{driver.name.charAt(0)}</div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-white">{driver.name}</p>
                    <p className="text-xs text-zinc-500">{driver.route} &bull; {driver.stops} stops left</p>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${driver.status}`}></span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
