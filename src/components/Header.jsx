import React from 'react';
import { 
  Bell, 
  CheckCheck,
  ExternalLink, 
  LogOut,
  KeyRound
} from 'lucide-react';


const safeFormatNotifTime = (timeVal) => {
  try {
    let d = timeVal;
    if (d && typeof d.toDate === 'function') {
      d = d.toDate();
    } else if (d && d.seconds !== undefined) {
      d = new Date(d.seconds * 1000);
    } else {
      d = new Date(d);
    }
    if (!d || isNaN(d.getTime())) d = new Date();
    
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ', ' + d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  } catch (e) {
    return new Date().toLocaleDateString();
  }
};

export default function Header({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  adminUser,
  handleAdminLogout,
  adminRole,
  notifications = [],
  showNotifications,
  setShowNotifications,
  setOrderSearch,
  setOrderStatusFilter,
  setCrmSearch,
  markAllRead
}) {
  const getBreadcrumbs = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Admin / Dashboard';
      case 'products':
        return 'Admin / Jewellery Catalog';
      case 'inventory':
        return 'Admin / Categories';
      case 'orders':
        return 'Admin / Orders & Consults';
      case 'customers':
        return 'Admin / Customers CRM';
      case 'pricing':
        return 'Admin / Gold Rate Management';
      case 'security':
        return 'Admin / Security & Password';
      default:
        return 'Admin';
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'products':
        return 'Manage Jewellery';
      case 'inventory':
        return 'Manage Categories';
      case 'orders':
        return 'Orders & Bookings';
      case 'customers':
        return 'CRM Directory';
      case 'pricing':
        return 'Gold Rate Management';
      case 'security':
        return 'Vault Security & Password';
      default:
        return 'Admin Console';
    }
  };

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border-b border-solid border-zinc-200 text-zinc-900 px-4 sm:px-6 py-3.5 sm:py-4 gap-3 sm:gap-4 mb-6 sm:mb-8 select-none w-full shadow-sm">
      <div className="flex flex-col text-left min-w-0">
        <span className="text-[9px] font-mono tracking-wider text-zinc-400 dark:text-zinc-500 font-bold block mb-0.5 uppercase truncate">
          {getBreadcrumbs()}
        </span>
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-55 leading-none">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex gap-2 items-center flex-wrap w-full sm:w-auto justify-start sm:justify-end">
        {adminUser && (
          <>
            {/* Notifications icon */}
            <div className="relative z-50">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg border border-solid border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer transition-all focus:outline-none flex items-center justify-center"
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 bg-amber-500 text-white text-[8px] font-black rounded-full flex items-center justify-center px-1 border border-solid border-white dark:border-zinc-900 shadow-sm animate-pulse">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40 bg-black/20 sm:bg-transparent backdrop-blur-[1px] sm:backdrop-blur-none" onClick={() => setShowNotifications(false)}></div>
                  <div className="max-sm:fixed max-sm:inset-x-3 max-sm:top-16 max-sm:w-auto sm:absolute sm:right-0 sm:w-96 mt-2.5 bg-white dark:bg-zinc-900 border border-solid border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.18)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.4)] z-50 overflow-hidden text-zinc-800 dark:text-zinc-200 max-w-[calc(100vw-24px)] mx-auto">
                    <div className="flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border-b border-solid border-zinc-200 dark:border-zinc-800">
                      <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                        Action Centre ({notifications.length})
                      </span>
                      {notifications.length > 0 && (
                        <button
                          onClick={markAllRead}
                          className="flex items-center gap-1 text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest hover:text-amber-800 dark:hover:text-amber-300 transition-colors cursor-pointer border-none bg-transparent p-0 animate-pulse hover:animate-none"
                          title="Mark all as read"
                        >
                          <CheckCheck className="w-3 h-3" />
                          Read All
                        </button>
                      )}
                    </div>

                    <div className="max-h-[320px] overflow-y-auto divide-y divide-solid divide-zinc-150 dark:divide-zinc-850">
                      {notifications.length === 0 ? (
                        <div className="py-8 px-4 text-center">
                          <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">All caught up!</p>
                          <p className="text-[9px] text-zinc-400 dark:text-zinc-505 mt-0.5 font-medium">No pending orders or lounge bookings.</p>
                        </div>
                      ) : (
                        notifications.map(notif => {
                          const dateStr = safeFormatNotifTime(notif.time);
                          return (
                            <div 
                              key={notif.id}
                              onClick={() => {
                                setActiveTab(notif.targetTab);
                                if (notif.type === 'order') {
                                  if (typeof setOrderSearch === 'function') setOrderSearch(notif.raw.orderId || '');
                                  if (typeof setOrderStatusFilter === 'function') setOrderStatusFilter('all');
                                } else {
                                  if (typeof setCrmSearch === 'function') setCrmSearch(notif.raw.phone || notif.raw.name || '');
                                }
                                setShowNotifications(false);
                              }}
                              className="p-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer text-left transition-colors duration-200"
                            >
                              <div className="flex justify-between items-start gap-2">
                                <span className="text-[11px] font-extrabold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 leading-none">
                                  {notif.type === 'order' ? 'Order' : notif.title.includes('Lounge') ? 'Lounge' : 'Custom'}
                                  {notif.title}
                                </span>
                                <span className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 shrink-0 whitespace-nowrap">
                                  {dateStr}
                                </span>
                              </div>
                              <p className="text-[10px] text-zinc-505 dark:text-zinc-450 mt-1.5 font-medium leading-relaxed">
                                {notif.desc}
                              </p>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Security & Password Quick Action */}
            <button
              onClick={() => setActiveTab('security')}
              className={`border border-solid font-bold text-xs px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap ${
                activeTab === 'security'
                  ? 'bg-amber-50 border-[#D5A529] text-[#8A6623]'
                  : 'border-zinc-200 hover:border-[#D5A529]/60 text-zinc-700 hover:text-zinc-950 bg-white'
              }`}
              title="Change Vault Password & Security"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#A88038]" />
              <span className="hidden sm:inline">Password &amp; Security</span>
              <span className="sm:hidden">Security</span>
            </button>

            {/* Storefront redirect */}
            <a
              href="/"
              className="border border-solid border-zinc-200 hover:border-zinc-300 text-zinc-700 bg-white font-bold text-xs px-3 py-2 rounded-lg transition-all text-center flex items-center gap-1.5 shadow-xs whitespace-nowrap"
            >
              <span>Visit Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Logout button */}
            <button
              onClick={handleAdminLogout}
              className="bg-zinc-900 hover:bg-zinc-700 text-white font-bold text-xs px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-xs cursor-pointer border-none whitespace-nowrap"
            >
              <span>Log Out</span>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </header>
  );
}
