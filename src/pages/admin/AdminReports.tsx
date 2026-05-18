import { useDataStore } from '@/store/dataStore';
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';

export default function AdminReports() {
  const { orders, restaurants, drivers } = useDataStore();

  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + o.total, 0), [orders]);
  const activeRestaurants = useMemo(() => restaurants.filter(r => r.status === 'Active').length, [restaurants]);
  const totalOrders = orders.length;
  const activeDrivers = useMemo(() => drivers.filter(d => d.status === 'Active').length, [drivers]);

  // Aggregate orders by month for revenue chart
  const salesData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data: Record<string, number> = {};
    orders.forEach(o => {
      const d = new Date(o.date);
      const m = months[d.getMonth()];
      if (!data[m]) data[m] = 0;
      data[m] += o.total;
    });
    // Convert to array and take last 6 months (simplification)
    return Object.keys(data).map(k => ({ name: k, total: data[k] })).slice(-6);
  }, [orders]);

  // Mocking partner growth data over time as we don't have created_at on restaurants yet
  const newPartnersData = [
    { name: 'Jan', partners: 10 },
    { name: 'Feb', partners: 15 },
    { name: 'Mar', partners: 20 },
    { name: 'Apr', partners: 18 },
    { name: 'May', partners: activeRestaurants > 20 ? activeRestaurants - 2 : 25 },
    { name: 'Jun', partners: activeRestaurants },
  ];
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6" /> Platform Reports
        </h1>
        <p className="text-sm text-zinc-400">View analytics and sales performance over time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-400 font-medium text-sm">Total Revenue</span>
              <DollarSign className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="text-3xl font-bold text-white">${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            <p className="text-xs text-emerald-400 mt-2 font-medium">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-400 font-medium text-sm">Active Restaurants</span>
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-white">{activeRestaurants}</div>
            <p className="text-xs text-emerald-400 mt-2 font-medium">+180.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-400 font-medium text-sm">Total Orders</span>
              <ShoppingCart className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-white">{totalOrders}</div>
            <p className="text-xs text-emerald-400 mt-2 font-medium">+19% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-400 font-medium text-sm">Active Drivers</span>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-white">{activeDrivers}</div>
            <p className="text-xs text-emerald-400 mt-2 font-medium">+2 from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip cursor={{fill: '#27272a'}} contentStyle={{backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff'}} />
                  <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">Partner Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={newPartnersData}>
                  <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff'}} />
                  <Line type="monotone" dataKey="partners" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
