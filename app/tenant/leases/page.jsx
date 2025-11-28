'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TenantLeases() {
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const fetchLeases = async () => {
      try {
        const res = await fetch('http://localhost:5556/tenant-leases', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          if (res.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch lease history');
        }

        const data = await res.json();
        setLeases(data.leases || []);
      } catch (err) {
        setError(err.message || 'Error fetching leases');
      } finally {
        setLoading(false);
      }
    };

    fetchLeases();
  }, [router]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expired':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'terminated':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bi-check-circle-fill text-green-500';
      case 'expired':
        return 'bi-clock-fill text-gray-500';
      case 'terminated':
        return 'bi-x-circle-fill text-red-500';
      case 'pending':
        return 'bi-hourglass-split text-yellow-500';
      default:
        return 'bi-question-circle-fill text-blue-500';
    }
  };

  if (loading) return (
    <div className="p-6 text-center">
      <div className="animate-pulse flex flex-col items-center space-y-4">
        <div className="rounded-full bg-gray-300 h-16 w-16 md:h-20 md:w-20"></div>
        <div className="h-4 bg-gray-300 rounded w-48"></div>
        <div className="h-4 bg-gray-300 rounded w-32"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-6 text-center text-red-500 animate-fade-in">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 max-w-md mx-auto">
        <i className="bi bi-exclamation-triangle-fill text-red-500 text-xl mb-2"></i>
        <p>Error: {error}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-10 text-black">
      {/* Header with animation */}
      <div className={`text-center mb-8 transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <h1 className="text-2xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Lease History
        </h1>
        <p className="text-center mb-4 md:mb-6 text-base md:text-lg text-gray-600">
          Your rental journey through time
        </p>
      </div>

      {leases.length === 0 ? (
        <div className={`text-center py-12 transform transition-all duration-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
            <i className="bi bi-file-earmark-text text-gray-400 text-2xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Lease History</h3>
          <p className="text-gray-500">You don't have any lease records yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {leases.map((lease, index) => (
            <div 
              key={lease.lease_id} 
              className={`card bg-white shadow-md md:shadow-lg rounded-xl p-6 transform transition-all duration-500 hover:shadow-xl hover:scale-[1.02] ${
                mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ 
                animationDelay: `${index * 100}ms`,
                borderLeft: `4px solid ${
                  lease.lease_status?.toLowerCase() === 'active' ? '#10b981' :
                  lease.lease_status?.toLowerCase() === 'expired' ? '#6b7280' :
                  lease.lease_status?.toLowerCase() === 'terminated' ? '#ef4444' : '#3b82f6'
                }`
              }}
            >
              {/* Header Section */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                      <i className="bi bi-building text-white text-lg"></i>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {lease.property?.property_name || 'Unknown Property'}
                      </h2>
                      <p className="text-gray-600 flex items-center gap-1">
                        <i className="bi bi-geo-alt-fill text-red-500"></i>
                        {lease.property?.address || 'Address not available'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className="mt-2 md:mt-0">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(lease.lease_status)}`}>
                    <i className={`bi ${getStatusIcon(lease.lease_status)}`}></i>
                    {lease.lease_status?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </div>
              </div>

              {/* Lease Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                {/* Left Column - Lease Period & Financials */}
                <div className="space-y-4">
                  {/* Lease Period */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
                    <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <i className="bi bi-calendar-range text-blue-600"></i>
                      Lease Period
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Start Date</p>
                        <p className="font-semibold text-gray-800">{formatDate(lease.start_date)}</p>
                      </div>
                      <i className="bi bi-arrow-right text-gray-400 mx-2"></i>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">End Date</p>
                        <p className="font-semibold text-gray-800">{formatDate(lease.end_date)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Financial Information */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 text-center border border-green-200">
                      <p className="text-lg font-bold text-green-700">Ksh {lease.monthly_rent?.toFixed(2) || '0.00'}</p>
                      <p className="text-xs text-green-600">Monthly Rent</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 text-center border border-blue-200">
                      <p className="text-lg font-bold text-blue-700">Ksh {lease.deposit_amount?.toFixed(2) || '0.00'}</p>
                      <p className="text-xs text-blue-600">Security Deposit</p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Unit Information */}
                <div className="space-y-4">
                  {/* Unit Details */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                    <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <i className="bi bi-house-door text-gray-600"></i>
                      Unit Details
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Unit Name</p>
                        <p className="font-semibold text-gray-800">{lease.unit?.unit_name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Unit Number</p>
                        <p className="font-semibold text-gray-800">#{lease.unit?.unit_number || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Type</p>
                        <p className="font-semibold text-gray-800">{lease.unit?.type || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Payment Due Day</p>
                        <p className="font-semibold text-gray-800">{lease.payment_due_day ? `${lease.payment_due_day}th` : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                {lease.lease_status?.toLowerCase() === 'active' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    <i className="bi bi-lightning-fill"></i>
                    Currently Active
                  </span>
                )}
                {new Date(lease.end_date) < new Date() && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    <i className="bi bi-clock-history"></i>
                    Lease Ended
                  </span>
                )}
                {lease.deposit_amount > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    <i className="bi bi-shield-check"></i>
                    Deposit Held
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}