'use client';
import { useEffect, useState } from 'react';

export default function PaymentForm({ onSuccess }) {
  const [leaseInfo, setLeaseInfo] = useState(null);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    const fetchLease = async () => {
      try {
        const res = await fetch('http://localhost:5556/tenant/active-lease', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch lease');
        const data = await res.json();
        setLeaseInfo(data.lease);
      } catch (err) {
        setError(err.message || 'Error loading lease');
      }
    };

    fetchLease();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!leaseInfo) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5556/tenant/file-payment', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lease_id: leaseInfo.lease_id,
          tenant_id: leaseInfo.tenant_id,
          admin_id: leaseInfo.admin_id,
          payment_date: new Date().toISOString().split('T')[0],
          amount,
          payment_method: paymentMethod,
          transaction_reference_number: reference,
          period_start: leaseInfo.start_date,
          period_end: leaseInfo.end_date,
          status: 'pending'
        })
      });

      if (!response.ok) throw new Error('Failed to submit payment');

      // Show custom success popup instead of alert
      setShowSuccessPopup(true);
      
      // Reset form
      setAmount('');
      setPaymentMethod('');
      setReference('');
      
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Error submitting payment');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
    window.location.reload();
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 text-center font-medium">{error}</p>
      </div>
    );
  }

  if (!leaseInfo) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading lease info...</span>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Make Payment</h3>
          <p className="text-gray-600">Complete your rent payment securely</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Amount (KES)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                KES
              </span>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white appearance-none"
            >
              <option value="">Select payment method</option>
              <option value="mpesa">M-Pesa</option>
              <option value="bank">Bank Transfer</option>
              <option value="cash">Cash</option>
            </select>
          </div>

          {/* Reference Number */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Transaction Reference Number
            </label>
            <input
              type="text"
              required
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Enter transaction reference"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              'Submit Payment'
            )}
          </button>
        </form>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-blue-700">
                Your payment will be reviewed and confirmed by the landlord. You'll receive a notification once processed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-auto transform transition-all duration-300 scale-100">
            <div className="p-6 text-center">
              {/* Success Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {/* Success Message */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Submitted!</h3>
              <p className="text-gray-600 mb-6">
                Your payment has been submitted for review. The landlord will confirm it shortly.
              </p>
              
              {/* Action Button */}
              <button
                onClick={handleSuccessClose}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}