import React from 'react';
import { 
  LayoutDashboard, 
  Gem, 
  Boxes, 
  ShoppingBag, 
  Users,
  TrendingUp,
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import hrLogo from '../assets/logo.png';

export default function Sidebar({
  activeTab,
  setActiveTab,
  adminUser,
  adminRole,
  handleAdminLogout,
  isSidebarCollapsed,
  setIsSidebarCollapsed
}) {
  return (
    <aside className={`bg-white dark:bg-[#09090B] border-r border-solid border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-400 flex flex-col justify-between shrink-0 hidden md:flex transition-all duration-200 select-none sticky top-0 h-screen overflow-y-hidden ${isSidebarCollapsed ? 'w-[72px] p-4' : 'w-[240px] p-6'}`}>
      <div className="space-y-6">

        {/* Logo Branding */}
        <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center pb-4 border-b border-solid border-zinc-100 dark:border-zinc-850' : 'pb-4 border-b border-solid border-zinc-100 dark:border-zinc-850'}`}>
          <div className="w-9 h-9 rounded-full bg-zinc-950 dark:bg-zinc-800 flex items-center justify-center shrink-0 shadow-sm border border-solid border-zinc-700/50 overflow-hidden">
            <img src={hrLogo} alt="MANISH & CO" className="w-7 h-7 object-contain" />
          </div>
          {!isSidebarCollapsed && (
            <div className="min-w-0">
              <h2 className="text-xs font-black tracking-wider leading-none text-zinc-950 dark:text-zinc-100">MANISH & CO</h2>
              <span className="text-[7.5px] uppercase tracking-[0.25em] text-[#BCA057] font-bold block mt-1">VAULT ADMIN</span>
            </div>
          )}
        </div>

        {/* Navigation list */}
        <nav className="space-y-6 text-xs font-semibold">
          <div>
            {!isSidebarCollapsed ? (
              <span className="text-[9px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-bold block mb-2 px-3">Dashboard</span>
            ) : (
              <div className="w-8 h-[1px] bg-zinc-200 dark:bg-zinc-800 mx-auto mb-3"></div>
            )}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 py-2 transition-all relative cursor-pointer border-none bg-transparent text-left ${isSidebarCollapsed ? 'justify-center rounded-lg px-2' : 'px-3 rounded-lg'
                } ${activeTab === 'dashboard'
                  ? 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-950 dark:text-zinc-100 border border-solid border-zinc-200 dark:border-zinc-700/60 shadow-xs font-bold'
                  : 'hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              title="Dashboard"
            >
              <LayoutDashboard className={`w-4.5 h-4.5 ${activeTab === 'dashboard' ? 'text-zinc-950 dark:text-[#E6C687]' : 'text-zinc-400 dark:text-zinc-500'}`} />
              {!isSidebarCollapsed && <span>Overview</span>}
              {activeTab === 'dashboard' && !isSidebarCollapsed && (
                <span className="absolute right-3 w-1 h-1 bg-zinc-950 dark:bg-[#E6C687] rounded-full"></span>
              )}
            </button>
          </div>

          <div>
            {!isSidebarCollapsed ? (
              <span className="text-[9px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-bold block mb-2 px-3">Catalogs</span>
            ) : (
              <div className="w-8 h-[1px] bg-zinc-200 dark:bg-zinc-800 mx-auto mb-3"></div>
            )}
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center gap-3 py-2 transition-all relative cursor-pointer border-none bg-transparent text-left ${isSidebarCollapsed ? 'justify-center rounded-lg px-2' : 'px-3 rounded-lg'
                  } ${activeTab === 'products'
                    ? 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-950 dark:text-zinc-100 border border-solid border-zinc-200 dark:border-zinc-700/60 shadow-xs font-bold'
                    : 'hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                title="Add jewellery"
              >
                <Gem className={`w-4.5 h-4.5 ${activeTab === 'products' ? 'text-zinc-950 dark:text-[#E6C687]' : 'text-zinc-400 dark:text-zinc-500'}`} />
                {!isSidebarCollapsed && <span>Add Jewellery</span>}
                {activeTab === 'products' && !isSidebarCollapsed && (
                  <span className="absolute right-3 w-1 h-1 bg-zinc-950 dark:bg-[#E6C687] rounded-full"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('inventory')}
                className={`w-full flex items-center gap-3 py-2 transition-all relative cursor-pointer border-none bg-transparent text-left ${isSidebarCollapsed ? 'justify-center rounded-lg px-2' : 'px-3 rounded-lg'
                  } ${activeTab === 'inventory'
                    ? 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-950 dark:text-zinc-100 border border-solid border-zinc-200 dark:border-zinc-700/60 shadow-xs font-bold'
                    : 'hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                title="Add Categories"
              >
                <Boxes className={`w-4.5 h-4.5 ${activeTab === 'inventory' ? 'text-zinc-950 dark:text-[#E6C687]' : 'text-zinc-400 dark:text-zinc-500'}`} />
                {!isSidebarCollapsed && <span>Add Categories</span>}
                {activeTab === 'inventory' && !isSidebarCollapsed && (
                  <span className="absolute right-3 w-1 h-1 bg-zinc-950 dark:bg-[#E6C687] rounded-full"></span>
                )}
              </button>
            </div>
          </div>

          <div>
            {!isSidebarCollapsed ? (
              <span className="text-[9px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-bold block mb-2 px-3">Operations</span>
            ) : (
              <div className="w-8 h-[1px] bg-zinc-200 dark:bg-zinc-800 mx-auto mb-3"></div>
            )}
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 py-2 transition-all relative cursor-pointer border-none bg-transparent text-left ${isSidebarCollapsed ? 'justify-center rounded-lg px-2' : 'px-3 rounded-lg'
                  } ${activeTab === 'orders'
                    ? 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-950 dark:text-zinc-100 border border-solid border-zinc-200 dark:border-zinc-700/60 shadow-xs font-bold'
                    : 'hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                title="Consults & Orders"
              >
                <ShoppingBag className={`w-4.5 h-4.5 ${activeTab === 'orders' ? 'text-zinc-950 dark:text-[#E6C687]' : 'text-zinc-400 dark:text-zinc-500'}`} />
                {!isSidebarCollapsed && <span>Consults &amp; Orders</span>}
                {activeTab === 'orders' && !isSidebarCollapsed && (
                  <span className="absolute right-3 w-1 h-1 bg-zinc-950 dark:bg-[#E6C687] rounded-full"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('customers')}
                className={`w-full flex items-center gap-3 py-2 transition-all relative cursor-pointer border-none bg-transparent text-left ${isSidebarCollapsed ? 'justify-center rounded-lg px-2' : 'px-3 rounded-lg'
                  } ${activeTab === 'customers'
                    ? 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-950 dark:text-[#E6C687] border border-solid border-zinc-200 dark:border-zinc-700/60 shadow-xs font-bold'
                    : 'hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                title="Customers CRM"
              >
                <Users className={`w-4.5 h-4.5 ${activeTab === 'customers' ? 'text-zinc-950 dark:text-[#E6C687]' : 'text-zinc-400 dark:text-zinc-500'}`} />
                {!isSidebarCollapsed && <span>Customers CRM</span>}
                {activeTab === 'customers' && !isSidebarCollapsed && (
                  <span className="absolute right-3 w-1 h-1 bg-zinc-950 dark:bg-[#E6C687] rounded-full"></span>
                )}
              </button>
            </div>

          <div>
            {!isSidebarCollapsed ? (
              <span className="text-[9px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-bold block mb-2 px-3">Pricing &amp; Settings</span>
            ) : (
              <div className="w-8 h-[1px] bg-zinc-200 dark:bg-zinc-800 mx-auto mb-3"></div>
            )}
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('pricing')}
                className={`w-full flex items-center gap-3 py-2 transition-all relative cursor-pointer border-none bg-transparent text-left ${isSidebarCollapsed ? 'justify-center rounded-lg px-2' : 'px-3 rounded-lg'
                  } ${activeTab === 'pricing'
                    ? 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-950 dark:text-zinc-100 border border-solid border-zinc-200 dark:border-zinc-700/60 shadow-xs font-bold'
                    : 'hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                title="Gold Rate Management"
              >
                <TrendingUp className={`w-4.5 h-4.5 ${activeTab === 'pricing' ? 'text-zinc-950 dark:text-[#E6C687]' : 'text-zinc-400 dark:text-zinc-500'}`} />
                {!isSidebarCollapsed && <span>Gold Pricing</span>}
                {activeTab === 'pricing' && !isSidebarCollapsed && (
                  <span className="absolute right-3 w-1 h-1 bg-zinc-950 dark:bg-[#E6C687] rounded-full"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 py-2 transition-all relative cursor-pointer border-none bg-transparent text-left ${isSidebarCollapsed ? 'justify-center rounded-lg px-2' : 'px-3 rounded-lg'
                  } ${activeTab === 'security'
                    ? 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-950 dark:text-zinc-100 border border-solid border-zinc-200 dark:border-zinc-700/60 shadow-xs font-bold'
                    : 'hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                title="Vault Security & Password"
              >
                <KeyRound className={`w-4.5 h-4.5 ${activeTab === 'security' ? 'text-zinc-950 dark:text-[#E6C687]' : 'text-zinc-400 dark:text-zinc-500'}`} />
                {!isSidebarCollapsed && <span>Vault Security</span>}
                {activeTab === 'security' && !isSidebarCollapsed && (
                  <span className="absolute right-3 w-1 h-1 bg-zinc-950 dark:bg-[#E6C687] rounded-full"></span>
                )}
              </button>
            </div>
          </div>
          </div>
        </nav>
      </div>

      {/* Collapse switch and Profile footer info */}
      <div className="space-y-4">
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="w-full hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-solid border-zinc-200 dark:border-zinc-800 py-1.5 px-3 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-all flex items-center justify-between text-[10px] uppercase font-bold tracking-wider cursor-pointer bg-transparent"
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {!isSidebarCollapsed && <span className="text-[9px] lowercase tracking-widest font-mono">Collapse</span>}
          <span>{isSidebarCollapsed ? '→' : '←'}</span>
        </button>

        {adminUser && (
          <div className="pt-4 border-t border-solid border-zinc-200 dark:border-zinc-800 space-y-2">
            <div 
              onClick={() => setActiveTab('security')}
              title="Click to manage Vault Password & Security"
              className={`flex items-center rounded-xl bg-zinc-50 hover:bg-amber-50/50 dark:bg-zinc-900/50 dark:hover:bg-zinc-800/70 border border-solid border-zinc-150 dark:border-zinc-800/60 cursor-pointer transition-all duration-200 ${isSidebarCollapsed ? 'justify-center p-2' : 'space-x-3 p-3'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-zinc-250 dark:bg-zinc-800 border border-solid border-zinc-300 dark:border-zinc-700 flex items-center justify-center shrink-0 text-zinc-950 dark:text-[#E6C687] font-black text-xs">
                {adminUser.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              {!isSidebarCollapsed && (
                <div className="min-w-0 flex-1">
                  <span className="font-semibold text-[10px] text-zinc-900 dark:text-zinc-100 block truncate leading-none mb-1">
                    {adminUser.email}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-400 text-[7.5px] font-extrabold tracking-wider uppercase inline-block leading-none border border-solid border-zinc-300/40 dark:border-zinc-700/40">
                      {adminRole}
                    </span>
                    <span className="text-[8px] text-[#A88038] font-bold">Key 🔑</span>
                  </div>
                </div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <div className="flex justify-between items-center px-1 text-[8.5px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                <span>Version</span>
                <span>v1.2.0</span>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
