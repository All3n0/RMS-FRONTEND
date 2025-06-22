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
  Wrench,
  CheckCircle2,
  Clock,
  Menu,
  X
} from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  
  useEffect(() => {
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
      } catch (err) {
        console.error('Dashboard error:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-500" />
          <p className="mt-4 text-lg font-medium text-gray-900">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-6 max-w-md bg-white rounded-lg shadow-md">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">Error Loading Dashboard</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-lg font-medium text-gray-900">No data available</p>
        </div>
      </div>
    );
  }

  const rentCollectionRate = data.potential_revenue > 0 
    ? (data.collected_rent / data.potential_revenue) * 100 
    : 0;

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between mb-4">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-200"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <div className="w-6"></div> {/* Spacer for alignment */}
      </div>

      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="hidden md:block text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
          Welcome back, <span className="font-semibold text-blue-600">{adminName}</span>. Here's your property overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <StatCard 
          icon={<Building2 className="h-5 w-5 md:h-6 md:w-6" />}
          title="Properties"
          value={data.property_count}
          change={null}
          subtitle={`${data.total_units} total units`}
        />
        
        <StatCard 
          icon={<Users className="h-5 w-5 md:h-6 md:w-6" />}
          title="Active Tenants"
          value={data.active_tenants}
          change={null}
          subtitle={`${data.occupancy_rate}% occupancy`}
        />
        
        <StatCard 
          icon={<DollarSign className="h-5 w-5 md:h-6 md:w-6" />}
          title="Monthly Revenue"
          value={`$${data.potential_revenue.toLocaleString()}`}
          change={null}
          subtitle={`$${data.collected_rent.toLocaleString()} collected`}
        />
        
        <StatCard 
          icon={<AlertCircle className="h-5 w-5 md:h-6 md:w-6" />}
          title="Outstanding"
          value={`$${data.outstanding.toLocaleString()}`}
          change={null}
          subtitle="Pending payments"
        />
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <ProgressCard
          title="Occupancy Rate"
          value={`${data.occupied_units}/${data.total_units} units`}
          percentage={data.occupancy_rate}
          icon={<TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />}
        />
        
        <ProgressCard
          title="Rent Collection"
          value={`$${data.collected_rent.toLocaleString()}/$${data.potential_revenue.toLocaleString()}`}
          percentage={rentCollectionRate}
          icon={<DollarSign className="h-4 w-4 md:h-5 md:w-5 text-green-500" />}
        />
      </div>

      {/* Activity and Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <ActivityCard activities={data.recent_activity} />
        <PaymentsCard payments={data.upcoming_payments} />
      </div>
    </div>
  );
}

// StatCard component with responsive adjustments
function StatCard({ icon, title, value, subtitle, change }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <div className="flex items-center gap-3 md:gap-4">
        <div className="p-2 md:p-3 rounded-full bg-blue-50 text-blue-600">
          {icon}
        </div>
        <div>
          <p className="text-xs md:text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900">{value}</h3>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

// ProgressCard component with responsive adjustments
function ProgressCard({ title, value, percentage, icon }: ProgressCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm md:text-base font-medium text-gray-900">{title}</h3>
        <span className="text-xs md:text-sm font-medium text-gray-500">{percentage.toFixed(1)}%</span>
      </div>
      <p className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4">{value}</p>
      <div className="w-full bg-gray-200 rounded-full h-2 md:h-2.5">
        <div 
          className="bg-blue-600 h-2 md:h-2.5 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

// ActivityCard component with responsive adjustments
function ActivityCard({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <Activity className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
        <h3 className="text-sm md:text-base font-medium text-gray-900">Recent Activity</h3>
      </div>
      
      {activities.length === 0 ? (
        <p className="text-xs md:text-sm text-gray-500 py-3 md:py-4 text-center">No recent activity</p>
      ) : (
        <ul className="space-y-3 md:space-y-4">
          {activities.map((activity, index) => (
            <li key={index} className="flex gap-3 md:gap-4">
              <div className="flex-shrink-0 mt-0.5 md:mt-1">
                <div className={`p-1.5 md:p-2 rounded-full ${
                  activity.status === 'completed' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  <Wrench className="h-3 w-3 md:h-4 md:w-4" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm md:text-base font-medium text-gray-900 truncate">{activity.text}</p>
                <p className="text-xs md:text-sm text-gray-500 truncate">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-0.5 md:mt-1">{activity.time}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// PaymentsCard component with responsive adjustments
function PaymentsCard({ payments }: { payments: PaymentItem[] }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <CalendarCheck className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
        <h3 className="text-sm md:text-base font-medium text-gray-900">Upcoming Payments</h3>
      </div>
      
      {payments.length === 0 ? (
        <p className="text-xs md:text-sm text-gray-500 py-3 md:py-4 text-center">No upcoming payments</p>
      ) : (
        <ul className="space-y-3 md:space-y-4">
          {payments.map((payment) => (
            <li key={payment.id} className="flex justify-between items-center gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm md:text-base font-medium text-gray-900 truncate">{payment.name}</p>
                <p className="text-xs md:text-sm text-gray-500 truncate">{payment.unit}</p>
                <p className="text-xs text-gray-400 mt-0.5 md:mt-1">
                  Due: {new Date(payment.due_date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right pl-2">
                <p className="text-sm md:text-base font-medium text-gray-900">${payment.amount.toLocaleString()}</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  payment.status === 'paid' 
                    ? 'bg-green-100 text-green-800' 
                    : payment.status === 'overdue' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {payment.status === 'paid' ? (
                    <CheckCircle2 className="mr-1 h-2.5 w-2.5" />
                  ) : (
                    <Clock className="mr-1 h-2.5 w-2.5" />
                  )}
                  {payment.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  change?: number | null;
}

interface ProgressCardProps {
  title: string;
  value: string;
  percentage: number;
  icon: React.ReactNode;
}