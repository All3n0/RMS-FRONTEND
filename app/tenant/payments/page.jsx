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
    <div className="max-w-5xl mx-auto px-4 py-10 text-black relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">💳 Rent Payment History</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Add Payment
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading payment history...</p>
      ) : error ? (
        <p className="text-center text-red-600">Error: {error}</p>
      ) : payments.length === 0 ? (
        <p className="text-center text-gray-600">No payment records available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full border rounded-lg">
            <thead className="bg-gray-100 text-gray-700">
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
                <tr key={payment.payment_id} className="hover:bg-gray-50">
                  <td>{formatDate(payment.payment_date)}</td>
                  <td>${payment.amount.toFixed(2)}</td>
                  <td>
                    {formatDate(payment.period_start)} - {formatDate(payment.period_end)}
                  </td>
                  <td className="capitalize">{payment.payment_method}</td>
                  <td>
                    <span
  className={`badge ${
    payment.status.toLowerCase() === 'paid'
      ? 'badge-success'
      : payment.status.toLowerCase() === 'pending'
      ? 'badge-warning'
      : payment.status.toLowerCase() === 'declined'
      ? 'badge-error'
      : 'badge-ghost'
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

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl relative shadow-lg">
           <button
  className="absolute top-3 right-3 text-blue-600 text-xl font-bold hover:scale-110 transition-all"style={{backgroundColor: 'transparent', border: 'none', cursor: 'pointer'}}
  onClick={() => setShowForm(false)}
>
  ✖
</button>

            <h2 className="text-xl font-semibold mb-4 text-center">📥 File a Rent Payment</h2>
            <PaymentForm onSuccess={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
