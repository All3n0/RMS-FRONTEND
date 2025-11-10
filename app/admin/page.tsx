'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {
  Building2,
  Users,
  DollarSign,
  AlertCircle,
  TrendingUp,
  Activity,
  CalendarCheck,
  Loader2,
  FileText,
  CheckCircle2,
  Clock,
  Home,
  UserCheck,
  CreditCard,
  BarChart3,
  Shield,
  Receipt,
  Target,
  Key,
  Wallet,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActivityItem {
  text: string;
  description: string;
  time: string;
  status: string;
}

interface PaymentItem {
  id: number;
  name: string;
  unit: string;
  amount: number;
  status: 'due' | 'paid' | 'overdue';
  due_date: string;
}

interface DashboardData {
  property_count: number;
  total_units: number;
  occupied_units: number;
  active_tenants: number;
  potential_revenue: number;
  collected_rent: number;
  outstanding: number;
  occupancy_rate: number;
  recent_activity: ActivityItem[];
  upcoming_payments: PaymentItem[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminName, setAdminName] = useState('Admin');
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if mobile on mount and on resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const fetchDashboardData = async () => {
      try {
        const userCookie = Cookies.get('user');
        if (!userCookie) {
          throw new Error('User not authenticated');
        }

        const userData = JSON.parse(userCookie);
        const adminId = userData?.user_id;
        const name = userData?.username;

        if (name) setAdminName(name);
        if (!adminId) {
          throw new Error('Admin ID not found');
        }

        const response = await fetch(`http://localhost:5556/admin/stats/${adminId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch dashboard data');
        }

        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch dashboard data');
        }

        setData(result.data);
        setTimeout(() => setIsVisible(true), 300);
      } catch (err) {
        console.error('Dashboard error:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20 relative z-10 mx-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-6 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center"
          >
            <Building2 className="h-8 w-8 md:h-10 md:w-10 text-white" />
          </motion.div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Loading Dashboard</h3>
          <p className="text-blue-100 text-sm md:text-base">Preparing your property management overview...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-amber-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20 max-w-md w-full mx-4"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-red-400/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <AlertCircle className="h-8 w-8 md:h-10 md:w-10 text-red-300" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3">Unable to Load Dashboard</h2>
          <p className="text-red-100 mb-6 text-sm md:text-base">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-500 to-orange-600 text-white py-3 px-6 md:px-8 rounded-2xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 text-sm md:text-base"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20 mx-4"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-gray-400/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <AlertCircle className="h-8 w-8 md:h-10 md:w-10 text-gray-300" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">No Data Available</h3>
          <p className="text-gray-300 text-sm md:text-base">Waiting for property data to load...</p>
        </motion.div>
      </div>
    );
  }

  const rentCollectionRate = data.potential_revenue > 0 
    ? (data.collected_rent / data.potential_revenue) * 100 
    : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 md:mb-12 text-center px-2"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-lg rounded-2xl px-4 py-2 md:px-6 md:py-3 border border-white/10 mb-3 md:mb-4"
          >
            <Shield className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
            <span className="text-blue-300 text-xs md:text-sm font-medium">PROPERTY MANAGEMENT DASHBOARD</span>
          </motion.div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-3 md:mb-4 px-2">
            Property Overview
          </h1>
          <p className="text-blue-200 text-sm md:text-lg px-2">
            Welcome back, <span className="font-semibold text-white">{adminName}</span>. Here's your property management summary.
          </p>
        </motion.div>

        {/* Main Stats Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12"
        >
          <motion.div variants={itemVariants}>
            <StatCard 
              icon={<Building2 className="h-5 w-5 md:h-7 md:w-7" />}
              title="Total Properties"
              value={data.property_count}
              subtitle={`${data.total_units} units managed`}
              color="blue"
              delay={0}
              isMobile={isMobile}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <StatCard 
              icon={<UserCheck className="h-5 w-5 md:h-7 md:w-7" />}
              title="Active Tenants"
              value={data.active_tenants}
              subtitle={`${data.occupancy_rate}% occupancy rate`}
              color="purple"
              delay={0.1}
              isMobile={isMobile}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <StatCard 
              icon={<Wallet className="h-5 w-5 md:h-7 md:w-7" />}
              title="Monthly Revenue"
              value={`$${data.potential_revenue.toLocaleString()}`}
              subtitle={`$${data.collected_rent.toLocaleString()} collected`}
              color="green"
              delay={0.2}
              isMobile={isMobile}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <StatCard 
              icon={<Target className="h-5 w-5 md:h-7 md:w-7" />}
              title="Outstanding Balance"
              value={`$${data.outstanding.toLocaleString()}`}
              subtitle="Pending collections"
              color="orange"
              delay={0.3}
              isMobile={isMobile}
            />
          </motion.div>
        </motion.div>

        {/* Progress Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12"
        >
          <motion.div variants={itemVariants}>
            <ProgressCard
              title="Property Occupancy"
              value={`${data.occupied_units} of ${data.total_units} units occupied`}
              percentage={data.occupancy_rate}
              icon={<Key className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />}
              color="blue"
              isMobile={isMobile}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <ProgressCard
              title="Rent Collection"
              value={`$${data.collected_rent.toLocaleString()} collected of $${data.potential_revenue.toLocaleString()} expected`}
              percentage={rentCollectionRate}
              icon={<TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-green-400" />}
              color="green"
              isMobile={isMobile}
            />
          </motion.div>
        </motion.div>

        {/* Activity & Payments Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8"
        >
          <motion.div variants={itemVariants}>
            <ActivityCard activities={data.recent_activity} isMobile={isMobile} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <PaymentsCard payments={data.upcoming_payments} isMobile={isMobile} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// Enhanced responsive StatCard with property management theme
function StatCard({ icon, title, value, subtitle, color = "blue", delay = 0, isMobile = false }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-emerald-500 to-green-500',
    purple: 'from-purple-500 to-pink-500',
    orange: 'from-orange-500 to-red-500'
  };

  const glowColors = {
    blue: 'shadow-blue-500/25',
    green: 'shadow-emerald-500/25',
    purple: 'shadow-purple-500/25',
    orange: 'shadow-orange-500/25'
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ 
        scale: isMobile ? 1 : 1.05, 
        y: isMobile ? 0 : -5,
        transition: { duration: 0.2 }
      }}
      className="relative group"
    >
      {/* Animated Background Glow */}
      <div className={`absolute inset-0 bg-gradient-to-r ${colorClasses[color]} rounded-2xl md:rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
      
      <div className={`relative bg-slate-800/60 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 border border-slate-700/50 ${glowColors[color]} shadow-2xl group-hover:shadow-3xl transition-all duration-500`}>
        <div className="flex items-center gap-3 md:gap-4">
          <motion.div 
            whileHover={{ rotate: isMobile ? 0 : 360 }}
            transition={{ duration: 0.5 }}
            className={`p-2 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-r ${colorClasses[color]} text-white shadow-lg flex-shrink-0`}
          >
            {icon}
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm font-semibold text-slate-300 mb-1 md:mb-2 truncate">{title}</p>
            <motion.h3 
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.3, type: "spring" }}
              className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2 truncate"
            >
              {value}
            </motion.h3>
            <p className="text-xs text-slate-400 truncate">{subtitle}</p>
          </div>
        </div>
        
        {/* Animated particles */}
        {!isMobile && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-white rounded-full"
            ></motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Enhanced responsive ProgressCard
function ProgressCard({ title, value, percentage, icon, color = "blue", isMobile = false }: ProgressCardProps) {
  const colorClasses = {
    blue: 'bg-gradient-to-r from-blue-400 to-cyan-400',
    green: 'bg-gradient-to-r from-emerald-400 to-green-400',
    purple: 'bg-gradient-to-r from-purple-400 to-pink-400',
    orange: 'bg-gradient-to-r from-orange-400 to-red-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: isMobile ? 1 : 1.02 }}
      className="bg-slate-800/60 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 border border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500"
    >
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className="p-1 md:p-2 bg-slate-700/50 rounded-lg md:rounded-xl backdrop-blur-sm flex-shrink-0">
            {icon}
          </div>
          <h3 className="font-semibold text-white text-base md:text-lg truncate">{title}</h3>
        </div>
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="text-lg md:text-xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent flex-shrink-0 ml-2"
        >
          {percentage.toFixed(1)}%
        </motion.span>
      </div>
      
      <p className="text-slate-300 text-xs md:text-sm mb-4 md:mb-6 line-clamp-2">{value}</p>
      
      <div className="w-full bg-slate-700/50 rounded-full h-2 md:h-3 shadow-inner overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          className={`h-2 md:h-3 rounded-full ${colorClasses[color]} shadow-lg relative overflow-hidden`}
        >
          {/* Shimmer effect */}
          {!isMobile && (
            <motion.div
              animate={{ x: [-100, 300] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
            ></motion.div>
          )}
        </motion.div>
      </div>
      
      <div className="flex justify-between text-xs text-slate-400 mt-2 md:mt-3">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </motion.div>
  );
}

// Enhanced responsive ActivityCard with property management activities
function ActivityCard({ activities, isMobile = false }: { activities: ActivityItem[], isMobile?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/60 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 border border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 h-full"
    >
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <div className="p-1 md:p-2 bg-blue-500/20 rounded-lg md:rounded-xl flex-shrink-0">
          <Activity className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
        </div>
        <h3 className="text-base md:text-lg font-semibold text-white">Recent Activity</h3>
      </div>
      
      {activities.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-6 md:py-8"
        >
          <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 bg-slate-700/50 rounded-xl md:rounded-2xl flex items-center justify-center">
            <Activity className="h-5 w-5 md:h-6 md:w-6 text-slate-400" />
          </div>
          <p className="text-slate-400 text-sm">No recent activity</p>
        </motion.div>
      ) : (
        <div className="space-y-3 md:space-y-4 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {activities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: isMobile ? 0 : 5 }}
                className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-slate-700/30 border border-slate-600/30 hover:bg-slate-700/50 transition-all duration-300 group"
              >
                <div className="flex-shrink-0">
                  <motion.div 
                    whileHover={{ scale: isMobile ? 1 : 1.1 }}
                    className={`p-1 md:p-2 rounded-lg ${
                      activity.status === 'completed' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : activity.status === 'maintenance'
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {activity.status === 'completed' ? (
                      <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4" />
                    ) : activity.status === 'maintenance' ? (
                      <FileText className="h-3 w-3 md:h-4 md:w-4" />
                    ) : (
                      <Clock className="h-3 w-3 md:h-4 md:w-4" />
                    )}
                  </motion.div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-xs md:text-sm group-hover:text-blue-200 transition-colors line-clamp-1">
                    {activity.text}
                  </p>
                  <p className="text-slate-300 text-xs mt-1 line-clamp-2">{activity.description}</p>
                  <p className="text-slate-400 text-xs mt-1 md:mt-2 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

// Enhanced responsive PaymentsCard with rent management focus
function PaymentsCard({ payments, isMobile = false }: { payments: PaymentItem[], isMobile?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/60 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 border border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 h-full"
    >
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <div className="p-1 md:p-2 bg-emerald-500/20 rounded-lg md:rounded-xl flex-shrink-0">
          <Receipt className="h-4 w-4 md:h-5 md:w-5 text-emerald-400" />
        </div>
        <h3 className="text-base md:text-lg font-semibold text-white">Rent Payments</h3>
      </div>
      
      {payments.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-6 md:py-8"
        >
          <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 bg-slate-700/50 rounded-xl md:rounded-2xl flex items-center justify-center">
            <CreditCard className="h-5 w-5 md:h-6 md:w-6 text-slate-400" />
          </div>
          <p className="text-slate-400 text-sm">No payment records</p>
        </motion.div>
      ) : (
        <div className="space-y-3 md:space-y-4 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {payments.map((payment) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: isMobile ? 1 : 1.02 }}
                className="flex justify-between items-center p-3 md:p-4 rounded-xl md:rounded-2xl bg-slate-700/30 border border-slate-600/30 hover:bg-slate-700/50 transition-all duration-300 group"
              >
                <div className="flex-1 min-w-0 mr-2 md:mr-3">
                  <div className="flex items-center gap-1 md:gap-2 mb-1">
                    <p className="font-medium text-white text-xs md:text-sm truncate group-hover:text-emerald-200 transition-colors">
                      {payment.name}
                    </p>
                    <span className="text-xs text-slate-400 bg-slate-600/50 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full flex-shrink-0">
                      {payment.unit}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs flex items-center gap-1 truncate">
                    <Calendar className="h-3 w-3 flex-shrink-0" />
                    Due: {new Date(payment.due_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <motion.p 
                    whileHover={{ scale: isMobile ? 1 : 1.1 }}
                    className="font-bold text-white text-xs md:text-sm"
                  >
                    ${payment.amount.toLocaleString()}
                  </motion.p>
                  <motion.span 
                    whileHover={{ scale: isMobile ? 1 : 1.05 }}
                    className={`inline-flex items-center px-1.5 py-0.5 md:px-2 md:py-1 rounded-full text-xs font-medium mt-1 ${
                      payment.status === 'paid' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : payment.status === 'overdue' 
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                          : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    }`}
                  >
                    {payment.status === 'paid' ? (
                      <CheckCircle2 className="mr-0.5 md:mr-1 h-3 w-3" />
                    ) : payment.status === 'overdue' ? (
                      <AlertTriangle className="mr-0.5 md:mr-1 h-3 w-3" />
                    ) : (
                      <Clock className="mr-0.5 md:mr-1 h-3 w-3" />
                    )}
                    <span className="hidden xs:inline">
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                    <span className="xs:hidden">
                      {payment.status.charAt(0).toUpperCase()}
                    </span>
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  delay?: number;
  isMobile?: boolean;
}

interface ProgressCardProps {
  title: string;
  value: string;
  percentage: number;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  isMobile?: boolean;
}