'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PaymentForm from '../components/PaymentForm';

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
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
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-black relative">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-blue-700 mb-2">💳 Rent Payment History</h1>
          <p className="text-gray-600 text-sm">Track and manage all your rent payments below.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-outline border-blue-600 text-blue-600 px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition-all"
        >
          + Add Payment
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading payment history...</p>
      ) : error ? (
        <p className="text-center text-red-600 font-semibold">Error: {error}</p>
      ) : payments.length === 0 ? (
        <p className="text-center text-gray-600">No payment records available.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-blue-100 text-blue-800 text-sm uppercase font-semibold">
              <tr>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Amount (KES)</th>
                <th className="px-6 py-3 text-left">Period</th>
                <th className="px-6 py-3 text-left">Method</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {payments.map((payment) => (
                <tr
                  key={payment.payment_id}
                  className="border-t hover:bg-blue-50 transition"
                >
                  <td className="px-6 py-4">{formatDate(payment.payment_date)}</td>
                  <td className="px-6 py-4 font-semibold">Ksh {payment.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    {formatDate(payment.period_start)} – {formatDate(payment.period_end)}
                  </td>
                  <td className="px-6 py-4 capitalize">{payment.payment_method}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        payment.status.toLowerCase() === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : payment.status.toLowerCase() === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : payment.status.toLowerCase() === 'declined'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-xl relative shadow-xl">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl"
              style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
              onClick={() => setShowForm(false)}
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-5 text-center text-blue-700">
              📥 File a Rent Payment
            </h2>
            <PaymentForm onSuccess={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
