'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MaintenanceRequestForm from './components/MaintainanceRequestForm';
export default function TenantDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:5556/tenant-dashboard', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-black">
      <h1 className="text-4xl font-bold mb-2 text-center">Tenant Portal</h1>
      <p className="text-center mb-6 text-lg">Welcome back, {tenant.first_name}!</p>

      {/* Welcome */}
      <div className="card bg-white shadow-lg rounded-lg mb-6 p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="avatar placeholder">
            <div className="bg-neutral text-white rounded-full w-24 h-24 flex items-center justify-center text-3xl font-bold">
              {initials}
            </div>
          </div>
          <h2 className="text-2xl font-semibold">{fullName}</h2>

          <div className={`w-full h-5 rounded-full mt-2 ${payment_status.current_month_paid ? 'bg-green-200' : 'bg-red-200'}`}>
            <div
              className={`h-full rounded-full text-center text-xs font-semibold ${payment_status.current_month_paid ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
              style={{ width: '100%' }}
            >
              {payment_status.current_month_paid ? 'Rent paid' : 'Rent due'}
            </div>
          </div>

          <div className="mt-4 space-y-2 w-full text-left">
            <div className="flex items-center gap-2 text-gray-700">
              <i className="bi bi-envelope-fill text-blue-500"></i>
              <p>{tenant.email}</p>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <i className="bi bi-telephone-fill text-green-500"></i>
              <p>{tenant.phone}</p>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <i className="bi bi-person-lines-fill text-purple-500"></i>
              <p>{tenant.emergency_contact_name} ({tenant.emergency_contact_number})</p>
            </div>
          </div>
        </div>
      </div>

      {/* Property Info */}
      <div className="card bg-white shadow-lg rounded-lg mb-6 p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <i className="bi bi-house-door-fill text-blue-600"></i> Your Property
        </h2>
        <p>{property.address}</p>
        <p><strong>Type:</strong> {unit.type}</p>
        <p><strong>Bedrooms:</strong> {unit.bedrooms}</p>
        <p><strong>Bathrooms:</strong> {unit.bathrooms}</p>
        <p><strong>Rent:</strong> ${unit.monthly_rent.toFixed(2)}</p>
      </div>

      {/* Payment Info */}
      <div className="card bg-white shadow-lg rounded-lg mb-6 p-6">
        <h2 className="text-xl font-bold mb-4"><i className="bi bi-cash-coin text-green-600"></i> Payment Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-100 rounded-lg p-4 text-center">
            <p className="text-xl font-semibold text-green-600">${lease.monthly_rent.toFixed(2)}</p>
            <p className="text-sm">Monthly Rent</p>
          </div>
          <div className="bg-blue-100 rounded-lg p-4 text-center">
            <p className="text-lg font-semibold text-blue-600">{formatDate(payment_status.next_payment_date)}</p>
            <p className="text-sm">Next Payment Due</p>
          </div>
          <div className="bg-purple-100 rounded-lg p-4 text-center">
            <p className="text-lg font-semibold text-purple-600">{formatDate(payment_status.last_payment_date)}</p>
            <p className="text-sm">Last Payment</p>
          </div>
        </div>
      </div>

      {/* Lease Details */}
      <div className="card bg-white shadow-lg rounded-lg mb-6 p-6">
        <h2 className="text-xl font-bold mb-4"><i className="bi bi-calendar-check-fill text-indigo-600"></i> Lease Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
          <div>
            <p><strong>Lease Start:</strong> {formatDate(lease.start_date)}</p>
          </div>
          <div>
            <p><strong>Lease End:</strong> {formatDate(lease.end_date)}</p>
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="card bg-white shadow-lg rounded-lg mb-6 p-10">
        <h2 className="text-xl font-bold mb-4"><i className="bi bi-clock-history text-orange-500"></i> Recent Payments</h2>
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
                {payments.map((payment) => (
                  <tr key={payment.payment_id}>
                    <td>{formatDate(payment.payment_date)}</td>
                    <td>${payment.amount.toFixed(2)}</td>
                    <td>{formatDate(payment.period_start)} - {formatDate(payment.period_end)}</td>
                    <td>{payment.payment_method}</td>
                    <td>
                      <span className="badge badge-success">{payment.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No payment records available.</p>
        )}
      </div>

      {/* Quick Actions */}
<div className="card bg-white shadow-lg rounded-lg p-6">
  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
    <i className="bi bi-lightning-fill text-yellow-500"></i> Quick Actions
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    <button className="btn btn-neutral w-full flex items-center justify-center gap-2 px-4 py-3 text-sm">
      <i className="bi bi-credit-card text-base"></i>
      <span className="text-center">Make Payment</span>
    </button>

    <button className="btn btn-outline w-full flex items-center justify-center gap-2 px-4 py-3 text-sm">
      <i className="bi bi-envelope-check text-base"></i>
      <span className="text-center">Contact Landlord</span>
    </button>

    <button className="btn btn-outline w-full flex items-center justify-center gap-2 px-4 py-3 text-sm" onClick={() => setShowMaintenanceForm(true)}>
      <i className="bi bi-tools text-base"></i>
      <span className="text-center">Maintenance</span>
    </button>

    <button className="btn btn-outline w-full flex items-center justify-center gap-2 px-4 py-3 text-sm">
      <i className="bi bi-file-earmark-text text-base"></i>
      <span className="text-center">Lease Document</span>
    </button>
  </div>
</div>

{/* Maintenance Form Popup */}
{showMaintenanceForm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg"
        onClick={() => setShowMaintenanceForm(false)}
      >
        <i className="bi bi-x-lg"></i>
      </button>
      <MaintenanceRequestForm
        onSuccess={() => {
          setShowMaintenanceForm(false);
        }}
        onCancel={() => setShowMaintenanceForm(false)}
      />
    </div>
  </div>
)}
    </div>
  );
}
