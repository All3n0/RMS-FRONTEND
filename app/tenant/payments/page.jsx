'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PaymentForm from '../components/PaymentForm';

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const fetchPayments = async () => {
      try {
        const res = await fetch('http://localhost:5556/tenant-payments', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          if (res.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch payment history');
        }

        const data = await res.json();
        setPayments(data.payments || []);
      } catch (err) {
        setError(err.message || 'Failed to load payments');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [router]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'declined':
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'completed':
        return 'bi-check-circle-fill text-green-500';
      case 'pending':
        return 'bi-clock-fill text-yellow-500';
      case 'declined':
      case 'failed':
        return 'bi-x-circle-fill text-red-500';
      default:
        return 'bi-question-circle-fill text-gray-500';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'mpesa':
        return 'bi-phone-fill text-green-500';
      case 'bank':
        return 'bi-bank text-blue-500';
      case 'cash':
        return 'bi-cash-coin text-yellow-500';
      default:
        return 'bi-credit-card text-purple-500';
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
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-10 text-black">
      {/* Header with animation */}
      <div className={`text-center mb-8 transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <h1 className="text-2xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Payment History
        </h1>
        <p className="text-center mb-4 md:mb-6 text-base md:text-lg text-gray-600">
          Track and manage all your rent payments
        </p>
      </div>

      {/* Header Action Bar */}
      <div className={`flex flex-col md:flex-row md:items-center md:justify-between mb-6 p-4 md:p-6 bg-white rounded-xl shadow-md md:shadow-lg transform transition-all duration-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <i className="bi bi-credit-card-2-front-fill text-blue-600"></i>
            Payment Records
          </h2>
          <p className="text-gray-600 text-sm">
            {payments.length} payment{payments.length !== 1 ? 's' : ''} recorded
          </p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <i className="bi bi-plus-circle-fill"></i>
          File New Payment
        </button>
      </div>

      {payments.length === 0 ? (
        <div className={`text-center py-12 transform transition-all duration-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
            <i className="bi bi-credit-card text-gray-400 text-2xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Payment History</h3>
          <p className="text-gray-500 mb-4">You haven't made any payments yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Make Your First Payment
          </button>
        </div>
      ) : (
        <div className={`bg-white rounded-xl shadow-md md:shadow-lg overflow-hidden transform transition-all duration-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
              <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-semibold text-blue-800 uppercase">
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-3">Period</div>
                <div className="col-span-2">Method</div>
                <div className="col-span-2">Reference</div>
                <div className="col-span-1">Status</div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {payments.map((payment, index) => (
                <div 
                  key={payment.payment_id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-blue-50 transition-all duration-200 animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="col-span-2">
                    <p className="font-semibold text-gray-800">{formatDate(payment.payment_date)}</p>
                  </div>
                  
                  <div className="col-span-2">
                    <p className="text-lg font-bold text-green-600">Ksh {payment.amount?.toFixed(2)}</p>
                  </div>
                  
                  <div className="col-span-3">
                    <p className="text-gray-700">
                      {formatDate(payment.period_start)} – {formatDate(payment.period_end)}
                    </p>
                  </div>
                  
                  <div className="col-span-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                      <i className={`bi ${getPaymentMethodIcon(payment.payment_method)}`}></i>
                      {payment.payment_method}
                    </span>
                  </div>
                  
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 font-mono truncate" title={payment.transaction_reference_number}>
                      {payment.transaction_reference_number || 'N/A'}
                    </p>
                  </div>
                  
                  <div className="col-span-1">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(payment.status)}`}>
                      <i className={`bi ${getStatusIcon(payment.status)}`}></i>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 p-4">
            {payments.map((payment, index) => (
              <div 
                key={payment.payment_id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-800">{formatDate(payment.payment_date)}</p>
                    <p className="text-lg font-bold text-green-600 mt-1">Ksh {payment.amount?.toFixed(2)}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(payment.status)}`}>
                    <i className={`bi ${getStatusIcon(payment.status)}`}></i>
                    {payment.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Period:</span>
                    <span className="text-gray-800">
                      {formatDate(payment.period_start)} – {formatDate(payment.period_end)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Method:</span>
                    <span className="inline-flex items-center gap-1 text-gray-800">
                      <i className={`bi ${getPaymentMethodIcon(payment.payment_method)}`}></i>
                      {payment.payment_method}
                    </span>
                  </div>
                  
                  {payment.transaction_reference_number && (
                    <div className="flex justify-between">
                      <span>Reference:</span>
                      <span className="text-gray-800 font-mono text-xs truncate max-w-[120px]" title={payment.transaction_reference_number}>
                        {payment.transaction_reference_number}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto transform transition-all duration-300 scale-100 animate-scale-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">File New Payment</h3>
                <button
                  className="text-gray-500 hover:text-red-500 text-xl transition-colors duration-200 transform hover:scale-110"
                  onClick={() => setShowForm(false)}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <PaymentForm onSuccess={() => setShowForm(false)} />
            </div>
          </div>
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
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}