import React, { useState } from 'react';
import { Mail, Phone, ShoppingBag, Calendar } from 'lucide-react';

export default function AdminCustomers({
  orders = [],
  consultations = [],
  savingsEnrollments = []
}) {
  const [crmSearch, setCrmSearch] = useState('');

  // Extract unique customers from orders/consults/enrollments
  const customers = React.useMemo(() => {
    const list = {};

    // 1. Scan orders
    orders.forEach(o => {
      const key = o.email || o.phone || 'unknown';
      if (!list[key]) {
        list[key] = {
          name: o.recipientName || o.name || 'Anonymous Buyer',
          email: o.email || '',
          phone: o.mobile || o.phone || '',
          ordersCount: 0,
          totalSpent: 0,
          consultationsCount: 0,
          schemesCount: 0
        };
      }
      list[key].ordersCount += 1;
      list[key].totalSpent += (o.totalAmount || 0);
    });

    // 2. Scan consultations
    consultations.forEach(c => {
      const key = c.phone || 'unknown';
      if (!list[key]) {
        list[key] = {
          name: c.name || 'Anonymous lounge client',
          email: '',
          phone: c.phone || '',
          ordersCount: 0,
          totalSpent: 0,
          consultationsCount: 0,
          schemesCount: 0
        };
      }
      list[key].consultationsCount += 1;
    });

    // 3. Scan scheme enrollments
    savingsEnrollments.forEach(s => {
      const key = s.emailAddress || s.mobileNumber || 'unknown';
      if (!list[key]) {
        list[key] = {
          name: s.fullName || 'Anonymous scheme member',
          email: s.emailAddress || '',
          phone: s.mobileNumber || '',
          ordersCount: 0,
          totalSpent: 0,
          consultationsCount: 0,
          schemesCount: 0
        };
      }
      list[key].schemesCount += 1;
    });

    return Object.values(list);
  }, [orders, consultations, savingsEnrollments]);

  // Search filter
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(crmSearch.toLowerCase()) ||
    c.phone.includes(crmSearch) ||
    c.email.toLowerCase().includes(crmSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 text-[#1A1A1A] dark:text-zinc-100 font-sans text-left w-full overflow-x-hidden">
      
      {/* Search Header */}
      <div className="bg-white dark:bg-[#15151A] border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-solid border-zinc-100 dark:border-zinc-850 pb-4">
          <div>
            <h3 className="text-base font-black tracking-wider text-zinc-900 dark:text-[#E6C687] uppercase">Lounge CRM Directory</h3>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">Unified profiles of buyers, consult clients and savings scheme members.</p>
          </div>
          <input
            type="text"
            placeholder="Search CRM by name, mobile, email..."
            value={crmSearch}
            onChange={(e) => setCrmSearch(e.target.value)}
            className="bg-white dark:bg-zinc-905 border border-solid border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-1.5 text-xs w-full sm:w-80 text-zinc-850 dark:text-zinc-150 placeholder-zinc-450 focus:outline-none font-semibold"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.length === 0 ? (
            <p className="text-xs text-zinc-455 text-center py-8 md:col-span-2 lg:col-span-3">No CRM profiles match search filters</p>
          ) : (
            filteredCustomers.map((cust, idx) => (
              <div key={idx} className="bg-zinc-50 dark:bg-[#121216] border border-solid border-zinc-205 dark:border-zinc-850 p-5 rounded-2xl space-y-4 hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors shadow-xs">
                
                {/* Visual Circle & Name */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-250 dark:bg-zinc-800 flex items-center justify-center font-black text-sm text-[#C8A646]">
                    {cust.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-50">{cust.name}</h4>
                    <span className="text-[9.5px] uppercase tracking-wider text-zinc-400 font-bold">Lounge Member</span>
                  </div>
                </div>

                {/* Info contact */}
                <div className="space-y-2 text-[11px] text-zinc-600 dark:text-zinc-400 font-semibold">
                  {cust.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="font-mono">{cust.phone}</span>
                    </div>
                  )}
                  {cust.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="truncate">{cust.email}</span>
                    </div>
                  )}
                </div>

                {/* Segment tags summary count */}
                <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-solid border-zinc-150 dark:border-zinc-850">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-400 block font-bold">Orders</span>
                    <span className="text-xs font-black flex items-center justify-center gap-1">
                      <ShoppingBag className="w-3 h-3 text-zinc-400" /> {cust.ordersCount}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-400 block font-bold">Consults</span>
                    <span className="text-xs font-black flex items-center justify-center gap-1">
                      <Calendar className="w-3 h-3 text-zinc-400" /> {cust.consultationsCount}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-400 block font-bold">Schemes</span>
                    <span className="text-xs font-black text-amber-600">
                      {cust.schemesCount > 0 ? 'Enrolled' : 'None'}
                    </span>
                  </div>
                </div>

                {/* Total spent summary */}
                {cust.totalSpent > 0 && (
                  <div className="bg-white dark:bg-zinc-900/60 p-2.5 rounded-xl border border-solid border-zinc-200 dark:border-zinc-800 text-[11px] font-bold flex justify-between items-center">
                    <span className="text-zinc-450 text-[10px] uppercase font-bold tracking-wider">Total Value Purchased</span>
                    <span className="font-sans text-zinc-900 dark:text-zinc-100">₹{cust.totalSpent.toLocaleString('en-IN')}</span>
                  </div>
                )}

              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
