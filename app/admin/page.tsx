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
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState({
  properties: 0,
  totalUnits: 0,       // Changed from occupiedUnits
  occupiedUnits: 0,    // New field
  activeTenants: 0,
  expectedRevenue: 0,
  collectedRent: 0,
  outstanding: 0,
  recentActivity: [],
  upcomingPayments: []
});

  const [adminName, setAdminName] = useState<string>('Admin');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   const fetchAdminStats = async () => {
  try {
    const userCookie = Cookies.get('user');
    if (!userCookie) return;
    
    const userData = JSON.parse(userCookie);
    const adminId = userData?.user?.user_id;
    const name = userData?.user?.username;
    
    if (name) setAdminName(name);
    if (!adminId) return;

    // Fetch admin stats
    const statsRes = await fetch(`http://127.0.0.1:5556/admin/stats/${adminId}`);
    if (!statsRes.ok) throw new Error('Failed to fetch stats');
    const statsData = await statsRes.json();

    setData(prev => ({
      ...prev,
      properties: statsData.property_count || 0,
      totalUnits: statsData.total_units || 0,  // Make sure to include this
      occupiedUnits: statsData.occupied_units || 0,
      potentialRevenue: statsData.potential_revenue || 0,
      occupancyRate: statsData.occupancy_rate || 0
    }));

    // Rest of your code...
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
 finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen text-black space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <h1 className="text-3xl font-semibold mb-4">Loading...</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4 h-24 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const occupancyRate = data.totalUnits > 0 ? (data.occupiedUnits / data.totalUnits) * 100 : 0;
  const rentRate = data.expectedRevenue > 0 ? (data.collectedRent / data.expectedRevenue) * 100 : 0;

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-black space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <h1 className="text-3xl font-semibold mb-4">Hey, {adminName}</h1>
        <p className="text-sm text-gray-700">Welcome back! Here's what's happening with your properties.</p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Properties" 
          value={data.properties} 
          subtitle={`${data.totalUnits} units in total`} 
          icon={<Building2 />} 
        />
        <StatCard 
          title="Active Tenants" 
          value={data.activeTenants} 
          subtitle={`${occupancyRate.toFixed(0)}% occupancy rate`} 
          icon={<Users />} 
        />
        <StatCard 
          title="Monthly Revenue" 
          value={`$${data.expectedRevenue.toLocaleString()}`} 
          subtitle="Expected monthly income" 
          icon={<DollarSign />} 
        />
        <StatCard 
          title="Outstanding" 
          value={`$${data.outstanding.toLocaleString()}`} 
          subtitle="Pending payments" 
          icon={<AlertCircle />} 
        />
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProgressCard 
          title="Occupancy Rate" 
          value={`${data.occupiedUnits}/${data.totalUnits}`} 
          percentage={occupancyRate} 
        />
        <ProgressCard 
          title="Rent Collection" 
          value={`$${data.collectedRent.toLocaleString()}/$${data.expectedRevenue.toLocaleString()}`} 
          percentage={rentRate} 
        />
      </div>

      {/* Recent Activity + Payments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ActivityCard 
          title="Recent Activity" 
          activities={data.recentActivity} 
        />
        <PaymentsCard 
          title="Upcoming Payments" 
          payments={data.upcomingPayments} 
        />
      </div>
    </div>
  );
}

// StatCard component (unchanged from your original)
function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-start gap-4 w-full">
      <div className="p-2 rounded-md bg-gray-200 text-black">{icon}</div>
      <div>
        <h4 className="text-sm text-gray-600">{title}</h4>
        <h3 className="text-xl font-bold text-black">{value}</h3>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

// ProgressCard component (unchanged from your original)
function ProgressCard({ title, value, percentage }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 w-full">
      <h4 className="font-semibold text-black">{title}</h4>
      <div className="flex justify-between text-sm mt-2">
        <span>{value}</span>
        <span>{percentage.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
        <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}

// ActivityCard component (unchanged from your original)
function ActivityCard({ title, activities }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 w-full">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="text-black" />
        <h4 className="font-semibold">{title}</h4>
      </div>
      <ul className="space-y-3">
        {activities.map((item, idx) => (
          <li key={idx} className="text-sm">
            <p className="font-medium text-black">{item.text}</p>
            <p className="text-gray-500 text-xs">{item.time}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// PaymentsCard component (unchanged from your original)
function PaymentsCard({ title, payments }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 w-full">
      <div className="flex items-center gap-2 mb-4">
        <CalendarCheck className="text-black" />
        <h4 className="font-semibold">{title}</h4>
      </div>
      <ul className="space-y-4">
        {payments.map((payment, idx) => (
          <li key={idx} className="flex justify-between items-center">
            <div>
              <p className="font-medium text-black">{payment.name}</p>
              <p className="text-sm text-gray-600">${payment.amount}</p>
            </div>
            <span className={`text-sm px-2 py-1 rounded-full ${
              payment.status === 'overdue'
                ? 'bg-red-100 text-red-600'
                : 'bg-blue-100 text-blue-600'
            }`}>
              {payment.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}