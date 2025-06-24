'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TenantDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:5556/tenant-dashboard', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error('Error fetching dashboard:', err);
        setError(err.message || 'Failed to load dashboard');
        if (err.message.includes('401')) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (!dashboardData) return <div className="p-8 text-center">No data available</div>;

  const { tenant, lease, unit, property, payments, payment_status } = dashboardData;
  const initials = `${tenant.first_name[0]}${tenant.last_name[0]}`.toUpperCase();
  const fullName = `${tenant.first_name} ${tenant.last_name}`;

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tenant Portal</h1>
      
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Welcome back, {tenant.first_name}</h2>
        
        <div className="flex items-center gap-6">
          <div className="avatar placeholder">
            <div className="bg-blue-500 text-white rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold">
              {initials}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-medium">{fullName}</h3>
            <div className={`badge ${payment_status.current_month_paid ? 'badge-success' : 'badge-error'} mt-2`}>
              {payment_status.current_month_paid ? 'Rent Paid' : 'Rent Due'}
            </div>
            
            <div className="mt-4 space-y-1">
              <p><span className="font-medium">Email:</span> {tenant.email}</p>
              <p><span className="font-medium">Phone:</span> {tenant.phone}</p>
              <p><span className="font-medium">Emergency Contact:</span> {tenant.emergency_contact_name} ({tenant.emergency_contact_number})</p>
            </div>
          </div>
        </div>
      </div>

      {/* Property Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Unit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {property ? (
  <div>
    <h3 className="font-medium text-lg">{property.property_name}</h3>
    <p className="text-gray-600">{property.address}</p>
  </div>
) : (
  <div className="text-gray-500">Property info not available</div>
)}

          <div>
            <p><span className="font-medium">Unit:</span> {unit.unit_name} ({unit.type})</p>
            <p><span className="font-medium">Unit Number:</span> {unit.unit_number}</p>
            <p><span className="font-medium">Monthly Rent:</span> ${unit.monthly_rent.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium">Monthly Rent</h3>
            <p className="text-2xl font-bold">${lease.monthly_rent.toFixed(2)}</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium">Next Payment Due</h3>
            <p>{formatDate(payment_status.next_payment_date)}</p>
            <p className="text-sm text-gray-500">Due on {lease.payment_due_day} of each month</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium">Last Payment</h3>
            <p>{formatDate(payment_status.last_payment_date)}</p>
          </div>
        </div>
      </div>

      {/* Lease Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Lease Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><span className="font-medium">Start Date:</span> {formatDate(lease.start_date)}</p>
            <p><span className="font-medium">End Date:</span> {formatDate(lease.end_date)}</p>
          </div>
          <div>
            <p><span className="font-medium">Security Deposit:</span> ${lease.deposit_amount.toFixed(2)}</p>
            <p><span className="font-medium">Status:</span> <span className="capitalize">{lease.lease_status.toLowerCase()}</span></p>
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>
        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Period</th>
                  <th>Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                  <tr key={payment.payment_id}>
                    <td>{formatDate(payment.payment_date)}</td>
                    <td>${payment.amount.toFixed(2)}</td>
                    <td>{formatDate(payment.period_start)} to {formatDate(payment.period_end)}</td>
                    <td className="capitalize">{payment.payment_method.toLowerCase()}</td>
                    <td>
                      <span className={`badge ${payment.status.toLowerCase() === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No payment history found</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <button className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
            Make Payment
          </button>
          <button className="btn btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Contact Landlord
          </button>
          <button className="btn btn-accent">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Request Maintenance
          </button>
          <button className="btn btn-neutral">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            View Lease Document
          </button>
        </div>
      </div>
    </div>
  );
}