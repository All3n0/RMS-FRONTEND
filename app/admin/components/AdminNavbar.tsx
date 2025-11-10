'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Home,
  Building2,
  CreditCard,
  Settings,
  LogOut,
  Wrench,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setExpanded(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    document.cookie = 'user=; Max-Age=0; path=/';
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setExpanded(!expanded);
    }
  };

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  const navigationItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/properties', label: 'Properties', icon: Building2 },
    { href: '/admin/rent', label: 'Rent', icon: CreditCard },
    { href: '/admin/maintenance', label: 'Maintenance', icon: Wrench },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-700 z-40 flex items-center justify-between px-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
          <h1 className="text-xl font-bold text-white">Renty Admin</h1>
          <div className="w-10"></div> {/* Spacer for balance */}
        </div>
      )}

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={closeMobileSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: isMobile ? (mobileOpen ? 0 : -280) : 0,
          width: isMobile ? 280 : (expanded ? 240 : 80)
        }}
        onMouseEnter={() => !isMobile && setExpanded(true)}
        onMouseLeave={() => !isMobile && setExpanded(false)}
        className="fixed h-full bg-gradient-to-b from-slate-900 to-slate-800 text-white z-40 flex flex-col shadow-2xl border-r border-slate-700/50"
      >
        {/* Header - Desktop */}
        {!isMobile && (
          <div className="p-6 border-b border-slate-700/50">
            <AnimatePresence mode="wait">
              {expanded ? (
                <motion.div
                  key="expanded-header"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-white">Renty Admin</h1>
                    <p className="text-sm text-slate-400">Manager</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed-header"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mx-auto"
                >
                  <Building2 className="w-6 h-6 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item, index) => (
            <SidebarLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={<item.icon className="w-5 h-5" />}
              expanded={isMobile ? true : expanded}
              isActive={pathname === item.href}
              delay={index * 0.1}
              onClick={isMobile ? closeMobileSidebar : undefined}
            />
          ))}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-slate-700/50">
          <motion.button
            whileHover={{ scale: isMobile ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200 group"
          >
            <div className="p-2 bg-red-500/20 rounded-lg group-hover:scale-110 transition-transform">
              <LogOut className="w-4 h-4" />
            </div>
            <AnimatePresence>
              {(isMobile || expanded) && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-medium whitespace-nowrap overflow-hidden"
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.aside>

      {/* Main content spacer */}
      {!isMobile && (
        <div
          style={{
            width: expanded ? 240 : 80,
            transition: 'width 0.3s ease'
          }}
          className="flex-shrink-0"
        />
      )}
      {isMobile && <div className="h-16 flex-shrink-0" />}
    </>
  );
}

function SidebarLink({
  href,
  label,
  icon,
  expanded,
  isActive,
  delay = 0,
  onClick
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  expanded: boolean;
  isActive?: boolean;
  delay?: number;
  onClick?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <Link href={href} onClick={onClick}>
        <motion.div
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          className={`
            relative flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 group
            ${isActive
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-lg'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }
          `}
        >
          {/* Active indicator */}
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}

          {/* Icon */}
          <div className={`
            p-2 rounded-lg transition-all duration-200 flex-shrink-0
            ${isActive
              ? 'bg-blue-500/20 text-blue-400'
              : 'bg-slate-700/50 group-hover:bg-slate-600/50 text-slate-400 group-hover:text-white'
            }
          `}>
            {icon}
          </div>

          {/* Label */}
          <AnimatePresence mode="wait">
            {expanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-medium whitespace-nowrap overflow-hidden flex-1"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Tooltip for collapsed state on desktop */}
          {!expanded && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 border border-slate-700">
              {label}
            </div>
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
}