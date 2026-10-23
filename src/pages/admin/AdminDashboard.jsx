import React from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Gem,
  ShoppingBag,
  Users,
  DollarSign,
  ArrowUpRight,
  TrendingUp,
  Download,
  Calendar,
  Clock
} from 'lucide-react';

const COLORS = ['#0D2B4E', '#6B4B2E', '#B09A82', '#091B2B', '#8C6226'];

export default function AdminDashboard({
  products = [],
  orders = [],
  consultations = [],
  goldRate = 78500,
  silverRate = 92000,
  setActiveTab
}) {
  // Aggregate stats
  const totalProducts = products.length;
  const activeOrdersCount = orders.filter(o => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled').length;
  const totalCustomers = Array.from(new Set(orders.map(o => o.email || o.phone))).length;

  // Recent 5 orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdDate || b.date) - new Date(a.createdDate || a.date))
    .slice(0, 5);

  // Upcoming consultations
  const upcomingConsultations = [...consultations]
    .filter(c => new Date(c.date) >= new Date().setHours(0,0,0,0))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 4);

  // Chart data: Calculated dynamically from orders for the last 6 months
  const salesData = React.useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const result = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mIdx = d.getMonth();
      const y = d.getFullYear();
      const mName = monthNames[mIdx];
      
      const monthlyTotal = (orders || []).reduce((sum, o) => {
        const orderDate = new Date(o.createdDate || o.date || (o.createdAt?.seconds ? o.createdAt.seconds * 1000 : null));
        if (orderDate && !isNaN(orderDate.getTime()) && orderDate.getMonth() === mIdx && orderDate.getFullYear() === y) {
          return sum + (Number(o.totalAmount || o.summary?.total || o.amount) || 0);
        }
        return sum;
      }, 0);
      
      result.push({ name: mName, sales: Math.round(monthlyTotal) });
    }
    return result;
  }, [orders]);

  // Pie chart categories distribution
  const categoryDistribution = React.useMemo(() => {
    const counts = {};
    products.forEach(p => {
      const cat = p.category || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [products]);

  return (
    <div className="space-y-6 text-[#1A1A1A] dark:text-zinc-100 font-sans text-left w-full overflow-x-hidden">
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Products */}
        <div className="bg-white dark:bg-[#15151A] border border-solid border-zinc-200 dark:border-zinc-805 p-6 rounded-2xl shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-extrabold tracking-wider text-zinc-450 uppercase block">Showroom Items</span>
              <span className="text-3xl font-black mt-2 block tracking-tight">{totalProducts}</span>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-solid border-zinc-100 dark:border-zinc-800 rounded-xl text-[#C8A646]">
              <Gem className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10.5px] text-zinc-400 dark:text-zinc-550 mt-3 font-semibold">Registered catalogue designs</p>
        </div>

        {/* Live Orders */}
        <div className="bg-white dark:bg-[#15151A] border border-solid border-zinc-200 dark:border-zinc-805 p-6 rounded-2xl shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-extrabold tracking-wider text-zinc-450 uppercase block">Active Orders</span>
              <span className="text-3xl font-black mt-2 block tracking-tight">{activeOrdersCount}</span>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-solid border-zinc-100 dark:border-zinc-800 rounded-xl text-[#DDA0DD]">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10.5px] text-zinc-400 dark:text-zinc-550 mt-3 font-semibold">Pending fulfillment queues</p>
        </div>

        {/* CRM Customers */}
        <div className="bg-white dark:bg-[#15151A] border border-solid border-zinc-200 dark:border-zinc-805 p-6 rounded-2xl shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-extrabold tracking-wider text-zinc-450 uppercase block">Lounge Profiles</span>
              <span className="text-3xl font-black mt-2 block tracking-tight">{totalCustomers}</span>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-solid border-zinc-100 dark:border-zinc-800 rounded-xl text-blue-500">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10.5px] text-zinc-400 dark:text-zinc-550 mt-3 font-semibold">Active directory accounts</p>
        </div>

        {/* Live Gold rates */}
        <div className="bg-white dark:bg-[#15151A] border border-solid border-zinc-200 dark:border-zinc-805 p-6 rounded-2xl shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-extrabold tracking-wider text-zinc-450 uppercase block">Gold Rate (24K/10g)</span>
              <span className="text-3xl font-black mt-2 block tracking-tight">₹{goldRate.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-solid border-zinc-100 dark:border-zinc-800 rounded-xl text-amber-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10.5px] text-zinc-400 dark:text-zinc-550 mt-3 font-semibold">Showroom market valuation</p>
        </div>

      </div>

      {/* 2 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Projections Chart */}
        <div className="bg-white dark:bg-[#15151A] border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b border-solid border-zinc-100 dark:border-zinc-850 pb-4">
            <div>
              <h3 className="text-sm font-black tracking-wider uppercase text-zinc-900 dark:text-[#E6C687]">Sales Projections</h3>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">Boutique storefront order projections.</p>
            </div>
            <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-[9px] font-bold text-zinc-650 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> 6M forecast
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C8A646" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#C8A646" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ECECEC" className="dark:stroke-zinc-800" />
                <XAxis dataKey="name" stroke="#A1A1AA" fontSize={10} tickLine={false} />
                <YAxis stroke="#A1A1AA" fontSize={10} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#C8A646" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category breakdown pie chart */}
        <div className="bg-white dark:bg-[#15151A] border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="border-b border-solid border-zinc-100 dark:border-zinc-850 pb-4">
            <h3 className="text-sm font-black tracking-wider uppercase text-zinc-900 dark:text-[#E6C687]">Catalog Shares</h3>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">Product count spread by categories.</p>
          </div>
          
          {categoryDistribution.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-xs text-zinc-400">
              No categories mapped
            </div>
          ) : (
            <>
              <div className="h-44 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-black">{totalProducts}</span>
                  <span className="text-[8px] uppercase tracking-wider text-zinc-450">items</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] text-zinc-600 dark:text-zinc-400 pt-3 border-t border-solid border-zinc-100 dark:border-zinc-850">
                {categoryDistribution.slice(0, 4).map((entry, idx) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                    <span className="truncate font-semibold uppercase">{entry.name} ({entry.value})</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>

      {/* 2 Tables Grid (Recent orders & consultations) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent orders */}
        <div className="bg-white dark:bg-[#15151A] border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-solid border-zinc-100 dark:border-zinc-850 pb-4">
            <div>
              <h3 className="text-sm font-black tracking-wider uppercase text-zinc-900 dark:text-[#E6C687]">Recent bookings</h3>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">Bespoke catalog checkout listings.</p>
            </div>
            <button
              onClick={() => setActiveTab('orders')}
              className="text-[9px] uppercase font-bold tracking-widest text-[#C8A646] hover:underline cursor-pointer border-none bg-transparent"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-solid border-zinc-100 dark:border-zinc-800 text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  <th className="py-2.5">Buyer</th>
                  <th className="py-2.5">Sum</th>
                  <th className="py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-solid divide-zinc-100 dark:divide-zinc-850">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-6 text-center text-zinc-400">No orders registered</td>
                  </tr>
                ) : (
                  recentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                      <td className="py-3">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 block">{order.recipientName || order.name || 'Anonymous'}</span>
                        <span className="text-[9px] text-zinc-400 block">{order.mobile || order.phone}</span>
                      </td>
                      <td className="py-3 font-semibold font-sans">
                        ₹{(order.total || order.totalAmount || order.price || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 text-right">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-widest border border-solid ${
                          order.orderStatus === 'delivered'
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-200'
                            : order.orderStatus === 'pending'
                            ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 border-amber-200'
                            : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-500 border-zinc-200'
                        }`}>
                          {order.orderStatus || 'pending'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Consultations */}
        <div className="bg-white dark:bg-[#15151A] border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-solid border-zinc-100 dark:border-zinc-850 pb-4">
            <div>
              <h3 className="text-sm font-black tracking-wider uppercase text-zinc-900 dark:text-[#E6C687]">Lounge consults</h3>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">Bespoke lounge appointment slots.</p>
            </div>
            <button
              onClick={() => setActiveTab('orders')}
              className="text-[9px] uppercase font-bold tracking-widest text-[#C8A646] hover:underline cursor-pointer border-none bg-transparent"
            >
              View Calendars
            </button>
          </div>

          <div className="space-y-3.5">
            {upcomingConsultations.length === 0 ? (
              <p className="text-xs text-zinc-450 text-center py-8">No scheduled consultation slots</p>
            ) : (
              upcomingConsultations.map(c => (
                <div key={c.id} className="p-3 bg-zinc-50 dark:bg-zinc-900/50 border border-solid border-zinc-150 dark:border-zinc-800 rounded-2xl flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 block">{c.name}</span>
                    <span className="text-[9px] text-[#C8A646] font-bold block">{c.preferredType || 'Virtual consult'}</span>
                    <span className="text-[9.5px] text-zinc-400 block">{c.phone}</span>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <span className="px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-400 text-[8.5px] font-bold flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-zinc-400" /> {new Date(c.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-400 text-[8.5px] font-bold flex items-center gap-1 mt-1 justify-end">
                      <Clock className="w-3 h-3 text-zinc-400" /> {c.timeSlot}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
