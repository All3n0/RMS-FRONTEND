'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MaintenanceRequestForm from './components/MaintainanceRequestForm';
import PaymentForm from './components/PaymentForm';

export default function TenantDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
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

  if (loading) return (
    <div className="p-4 md:p-8 text-center">
      <div className="animate-pulse flex flex-col items-center space-y-4">
        <div className="rounded-full bg-gray-300 h-16 w-16 md:h-24 md:w-24"></div>
        <div className="h-4 bg-gray-300 rounded w-48"></div>
        <div className="h-4 bg-gray-300 rounded w-32"></div>
      </div>
    </div>
  );
  
  if (error) return <div className="p-4 md:p-8 text-center text-red-500 animate-fade-in">Error: {error}</div>;
  if (!dashboardData) return <div className="p-4 md:p-8 text-center animate-fade-in">No data available</div>;

  const { tenant, lease, unit, property, payments, payment_status } = dashboardData;
  const initials = `${tenant.first_name[0]}${tenant.last_name[0]}`.toUpperCase();
  const fullName = `${tenant.first_name} ${tenant.last_name}`;

  // Check if contact info is missing
  const hasMissingContactInfo = !tenant.phone || tenant.phone === 'Not provided' || 
                               !tenant.emergency_contact_name || tenant.emergency_contact_name === 'Not provided';

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Determine rent status message
  const getRentStatus = () => {
    if (!lease) {
      return { message: 'No active lease', color: 'bg-gray-500', textColor: 'text-white' };
    }
    if (payment_status.current_month_paid) {
      return { message: 'Rent paid', color: 'bg-green-500', textColor: 'text-white' };
    }
    return { message: 'Rent due', color: 'bg-red-500', textColor: 'text-white' };
  };

  const rentStatus = getRentStatus();

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 md:py-8 text-black">
      {/* Header with animation */}
      <div className={`text-center mb-8 transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <h1 className="text-2xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Tenant Portal
        </h1>
        <p className="text-center mb-4 md:mb-6 text-base md:text-lg text-gray-600 animate-pulse">
          Welcome back, {tenant.first_name}!
        </p>
      </div>

      {/* Welcome Card with staggered animation */}
      <div className={`card bg-white shadow-md md:shadow-lg rounded-lg mb-4 md:mb-6 p-4 md:p-6 text-center transform transition-all duration-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="flex flex-col items-center gap-3 md:gap-4">
          <div className="avatar placeholder animate-bounce-slow">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-16 h-16 md:w-24 md:h-24 flex items-center justify-center text-xl md:text-3xl font-bold shadow-lg transform hover:scale-105 transition-transform duration-300">
              {initials}
            </div>
          </div>
          
          <h2 className="text-xl md:text-2xl font-semibold animate-fade-in-up">{fullName}</h2>

          {/* Rent Status Bar with pulse animation */}
          <div className="w-full h-4 md:h-5 rounded-full mt-1 md:mt-2 bg-gray-200 overflow-hidden">
            <div
              className={`h-full rounded-full text-center text-xs font-semibold ${rentStatus.color} ${rentStatus.textColor} transition-all duration-1000 ease-out ${
                rentStatus.message === 'Rent due' ? 'animate-pulse' : ''
              }`}
              style={{ width: '100%' }}
            >
              {rentStatus.message}
            </div>
          </div>

          {/* Contact Info with Edit Button */}
          <div className="mt-3 md:mt-4 space-y-1 md:space-y-2 w-full text-left text-sm md:text-base animate-fade-in-up delay-100">
            <div className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors duration-300">
              <i className="bi bi-envelope-fill text-blue-500 animate-wiggle"></i>
              <p className="truncate">{tenant.email}</p>
            </div>
            <div className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors duration-300">
              <i className="bi bi-telephone-fill text-green-500"></i>
              <p>{tenant.phone || 'Not provided'}</p>
            </div>
            <div className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors duration-300">
              <i className="bi bi-person-lines-fill text-purple-500"></i>
              <p className="truncate">
                {tenant.emergency_contact_name || 'Not provided'} 
                {tenant.emergency_contact_number && ` (${tenant.emergency_contact_number})`}
              </p>
            </div>
            
            {hasMissingContactInfo && (
              <div className="mt-3 pt-3 border-t border-gray-200 animate-fade-in-up delay-200">
                <button 
                  onClick={() => router.push('/tenant/profile')}
                  className="btn btn-primary btn-sm w-full bg-gradient-to-r from-blue-500 to-purple-600 border-none text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <i className="bi bi-pencil-fill mr-2 animate-bounce"></i>
                  Complete Your Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Property Info with slide-in animation */}
      {property && unit && (
        <div className={`card bg-white shadow-md md:shadow-lg rounded-lg mb-4 md:mb-6 p-4 md:p-6 transform transition-all duration-500 delay-150 ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
          <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center gap-2">
            <i className="bi bi-house-door-fill text-blue-600 animate-pulse"></i> 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Property
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 text-sm md:text-base">
            <p className="sm:col-span-2 hover:text-blue-600 transition-colors duration-300">{property?.address || 'No property assigned'}</p>
            <p className="hover:translate-x-1 transition-transform duration-300"><strong>Type:</strong> {unit?.type || 'N/A'}</p>
            <p className="hover:translate-x-1 transition-transform duration-300"><strong>Bedrooms:</strong> {unit?.bedrooms || 'N/A'}</p>
            <p className="hover:translate-x-1 transition-transform duration-300"><strong>Bathrooms:</strong> {unit?.bathrooms || 'N/A'}</p>
            <p className="hover:translate-x-1 transition-transform duration-300"><strong>Rent:</strong> Ksh {unit?.monthly_rent?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
      )}

      {/* Payment Info with staggered card animations */}
      {lease && (
        <div className={`card bg-white shadow-md md:shadow-lg rounded-lg mb-4 md:mb-6 p-4 md:p-6 transform transition-all duration-500 delay-200 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
            <i className="bi bi-cash-coin text-green-600 animate-bounce"></i> 
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent ml-2">
              Payment Information
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {[
              { value: `Ksh ${lease?.monthly_rent?.toFixed(2) || '0.00'}`, label: 'Monthly Rent', color: 'green', delay: 0 },
              { value: formatDate(payment_status.next_payment_date), label: 'Next Payment Due', color: 'blue', delay: 100 },
              { value: formatDate(payment_status.last_payment_date), label: 'Last Payment', color: 'purple', delay: 200 }
            ].map((item, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br from-${item.color}-100 to-${item.color}-50 rounded-lg p-3 md:p-4 text-center border border-${item.color}-200 transform hover:scale-105 transition-all duration-300 animate-fade-in-up`}
                style={{ animationDelay: `${item.delay}ms` }}
              >
                <p className={`text-lg md:text-xl font-semibold text-${item.color}-700`}>{item.value}</p>
                <p className={`text-xs md:text-sm text-${item.color}-600`}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
        {/* Payment Position Section - UPDATED with exact decimals */}
      {lease && (
        <div className={`card bg-white shadow-md md:shadow-lg rounded-lg mb-4 md:mb-6 p-4 md:p-6 transform transition-all duration-500 delay-250 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
            <i className="bi bi-calculator-fill text-blue-600"></i> 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-2">
              Payment Status
            </span>
          </h2>
          
          {/* Payment Position Summary */}
          <div className={`bg-gradient-to-r rounded-xl p-4 md:p-6 mb-4 border ${
            payment_status.payment_position > 0 
              ? 'from-green-50 to-emerald-50 border-green-200' 
              : payment_status.payment_position < 0 
              ? 'from-red-50 to-orange-50 border-red-200 animate-pulse'
              : 'from-blue-50 to-purple-50 border-blue-200'
          }`}>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                {payment_status.payment_position > 0 ? (
                  <i className="bi bi-arrow-up-circle-fill text-green-600 text-2xl mr-2"></i>
                ) : payment_status.payment_position < 0 ? (
                  <i className="bi bi-arrow-down-circle-fill text-red-600 text-2xl mr-2"></i>
                ) : (
                  <i className="bi bi-check-circle-fill text-blue-600 text-2xl mr-2"></i>
                )}
                <p className={`text-lg font-semibold ${
                  payment_status.payment_position > 0 ? 'text-green-700' : 
                  payment_status.payment_position < 0 ? 'text-red-700' : 'text-blue-700'
                }`}>
                  {payment_status.payment_position > 0 ? 'Ahead on Payments' : 
                   payment_status.payment_position < 0 ? 'Payment Due' : 'All Payments Current'}
                </p>
              </div>
              
              <p className={`text-3xl md:text-4xl font-bold mb-2 ${
                payment_status.payment_position > 0 ? 'text-green-600' : 
                payment_status.payment_position < 0 ? 'text-red-600' : 'text-blue-600'
              }`}>
                {payment_status.payment_position > 0 ? '+' : ''}
                Ksh {(payment_status.payment_position || 0).toFixed(2)}
              </p>
              
              <div className="flex justify-center gap-4 text-sm">
                {payment_status.months_ahead > 0 && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {payment_status.months_ahead.toFixed(2)} month(s) ahead
                  </span>
                )}
                {payment_status.months_behind > 0 && (
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    {payment_status.months_behind.toFixed(2)} month(s) behind
                  </span>
                )}
                {payment_status.payment_position === 0 && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    Up to date
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Payment Timeline */}
          <div className="space-y-3">
            <h3 className="text-md font-semibold text-gray-700 mb-2">Payment Timeline</h3>
            {payment_status.payment_details?.map((detail, index) => {
              const isCurrentMonth = new Date().getMonth() === new Date(detail.due_date).getMonth() && 
                                   new Date().getFullYear() === new Date(detail.due_date).getFullYear();
              const isFuture = new Date(detail.due_date) > new Date();
              
              return (
                <div 
                  key={index}
                  className={`flex justify-between items-center p-3 rounded-lg border transition-all duration-300 ${
                    detail.status === 'paid' 
                      ? 'bg-green-50 border-green-200 text-green-700' 
                      : detail.status === 'due'
                      ? 'bg-red-50 border-red-200 text-red-700 animate-pulse'
                      : isFuture
                      ? 'bg-gray-50 border-gray-200 text-gray-600'
                      : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                  } ${isCurrentMonth ? 'ring-2 ring-blue-300' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <i className={`bi ${
                      detail.status === 'paid' ? 'bi-check-circle-fill text-green-500' : 
                      detail.status === 'due' ? 'bi-exclamation-circle-fill text-red-500' :
                      isFuture ? 'bi-clock-fill text-gray-400' : 'bi-question-circle-fill text-yellow-500'
                    }`}></i>
                    <div>
                      <p className="font-medium">{detail.period}</p>
                      <p className="text-xs opacity-75">
                        Due: {formatDate(detail.due_date)}
                        {isCurrentMonth && <span className="ml-1 text-blue-600 font-semibold">• Current</span>}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Ksh {detail.amount?.toFixed(2)}</p>
                    <p className={`text-xs font-medium ${
                      detail.status === 'paid' ? 'text-green-600' : 
                      detail.status === 'due' ? 'text-red-600' :
                      isFuture ? 'text-gray-500' : 'text-yellow-600'
                    }`}>
                      {detail.status === 'paid' ? 'Paid' : 
                       detail.status === 'due' ? 'Overdue' :
                       isFuture ? 'Upcoming' : 'Pending'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            {payment_status.payment_position < 0 ? (
              <div className="space-y-2">
                <button 
                  onClick={() => setShowPaymentForm(true)}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
                >
                  <i className="bi bi-lightning-charge-fill mr-2"></i>
                  Pay Outstanding Amount (Ksh {Math.abs(payment_status.payment_position || 0).toFixed(2)})
                </button>
                <p className="text-xs text-red-600 text-center">
                  You are {payment_status.months_behind.toFixed(2)} month(s) behind
                </p>
              </div>
            ) : payment_status.payment_position > 0 ? (
              <div className="text-center">
                <p className="text-green-600 font-semibold mb-2">
                  <i className="bi bi-star-fill mr-1"></i>
                  Great! You're {payment_status.months_ahead.toFixed(2)} month(s) ahead
                </p>
                <button 
                  onClick={() => setShowPaymentForm(true)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  Make Additional Payment
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowPaymentForm(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                Make Payment
              </button>
            )}
          </div>
        </div>
      )}
      {/* Lease Details with fade animation */}
      {lease && (
        <div className={`card bg-white shadow-md md:shadow-lg rounded-lg mb-4 md:mb-6 p-4 md:p-6 transform transition-all duration-500 delay-300 ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
          <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
            <i className="bi bi-calendar-check-fill text-indigo-600 animate-spin-slow"></i> 
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent ml-2">
              Lease Details
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 p-2 md:p-4 text-sm md:text-base">
            <div className="hover:bg-indigo-50 rounded-lg p-2 transition-all duration-300">
              <p><strong>Lease Start:</strong> {formatDate(lease.start_date)}</p>
            </div>
            <div className="hover:bg-indigo-50 rounded-lg p-2 transition-all duration-300">
              <p><strong>Lease End:</strong> {formatDate(lease.end_date)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Payments with table row animations */}
      <div className={`card bg-white shadow-md md:shadow-lg rounded-lg mb-4 md:mb-6 p-4 md:p-6 transform transition-all duration-500 delay-400 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
          <i className="bi bi-clock-history text-orange-500 animate-ping-slow"></i> 
          <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent ml-2">
            Recent Payments
          </span>
        </h2>
        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table w-full text-sm md:text-base">
              <thead>
                <tr className="animate-fade-in">
                  <th className="px-2 py-1 md:px-4 md:py-2">Date</th>
                  <th className="px-2 py-1 md:px-4 md:py-2">Amount</th>
                  <th className="px-2 py-1 md:px-4 md:py-2 hidden sm:table-cell">Period</th>
                  <th className="px-2 py-1 md:px-4 md:py-2 hidden md:table-cell">Method</th>
                  <th className="px-2 py-1 md:px-4 md:py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
                  <tr 
                    key={payment.payment_id} 
                    className="hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <td className="px-2 py-1 md:px-4 md:py-2">{formatDate(payment.payment_date)}</td>
                    <td className="px-2 py-1 md:px-4 md:py-2">Ksh {payment.amount.toFixed(2)}</td>
                    <td className="px-2 py-1 md:px-4 md:py-2 hidden sm:table-cell">
                      {formatDate(payment.period_start)} - {formatDate(payment.period_end)}
                    </td>
                    <td className="px-2 py-1 md:px-4 md:py-2 hidden md:table-cell">{payment.payment_method}</td>
                    <td className="px-2 py-1 md:px-4 md:py-2">
                      <span className={`badge rounded text-xs md:text-sm animate-pulse ${
                        payment.status.toLowerCase() === 'paid' ? 'badge-success bg-green-100 text-green-800' : 
                        payment.status.toLowerCase() === 'pending' ? 'badge-warning bg-yellow-100 text-yellow-800' : 
                        'badge-error bg-red-100 text-red-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm md:text-base animate-fade-in">No payment records available.</p>
        )}
      </div>

      {/* Quick Actions with hover animations */}
      <div className={`card bg-white shadow-md md:shadow-lg rounded-lg p-4 md:p-6 transform transition-all duration-500 delay-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center gap-2">
          <i className="bi bi-lightning-fill text-blue-600 animate-pulse"></i> 
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Quick Actions
          </span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { icon: 'bi-credit-card', label: 'Make Payment', color: 'blue', action: () => setShowPaymentForm(true), disabled: !lease },
            { icon: 'bi-envelope-check', label: 'Contact Landlord', color: 'green', action: () => {}, disabled: false },
            { icon: 'bi-tools', label: 'Maintenance', color: 'orange', action: () => setShowMaintenanceForm(true), disabled: !lease },
            { icon: 'bi-file-earmark-text', label: 'Lease Doc', color: 'purple', action: () => {}, disabled: !lease }
          ].map((action, index) => (
            <button 
              key={index}
              className={`flex flex-col items-center justify-center gap-3 p-4 text-xs md:text-sm rounded-xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up ${
                action.disabled 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : `bg-${action.color}-50 text-${action.color}-700 hover:bg-${action.color}-100 hover:shadow-md border border-${action.color}-100`
              }`}
              onClick={action.action}
              disabled={action.disabled}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <i className={`${action.icon} text-2xl ${action.disabled ? '' : 'animate-bounce-slow'}`}></i>
              <span className="font-semibold">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Maintenance Form Popup */}
      {showMaintenanceForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full max-w-md relative animate-scale-in">
            <button
              className="absolute bg-transparent top-2 right-2 md:top-3 md:right-3 text-blue-500 hover:text-black text-lg transform hover:scale-110 transition-transform duration-200"
              onClick={() => setShowMaintenanceForm(false)}
            >
              <i className="bi bi-x-lg"></i>
            </button>
            <MaintenanceRequestForm
              onSuccess={() => {
                setShowMaintenanceForm(false);
              }}
              onClose={() => setShowMaintenanceForm(false)}
            />
          </div>
        </div>
      )}

      {/* Payment Form Popup */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full max-w-md relative animate-scale-in">
            <button
              className="absolute bg-transparent top-2 right-2 md:top-3 md:right-3 text-blue-500 hover:text-black text-lg transform hover:scale-110 transition-transform duration-200"
              onClick={() => setShowPaymentForm(false)}
            >
              <i className="bi bi-x-lg"></i>
            </button>
            <PaymentForm
              onSuccess={() => {
                setShowPaymentForm(false);
                setShowPaymentSuccess(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Payment Success Popup */}
      {showPaymentSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-auto transform transition-all duration-300 scale-100 animate-bounce-in">
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4 animate-pulse">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Submitted!</h3>
              <p className="text-gray-600 mb-6">
                Your payment has been submitted for review. The landlord will confirm it shortly.
              </p>
              <button
                onClick={() => {
                  setShowPaymentSuccess(false);
                  window.location.reload();
                }}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add custom animation styles */}
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
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out forwards;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-wiggle {
          animation: wiggle 1s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}