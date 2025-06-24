'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  if (loading) return <div className="p-6 text-center">Loading payment history...</div>;
  if (error) return <div className="p-6 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-black">
      <h1 className="text-4xl font-bold text-center mb-8">💳 Rent Payment History</h1>

      {payments.length === 0 ? (
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
                  <td>{formatDate(payment.period_start)} - {formatDate(payment.period_end)}</td>
                  <td className="capitalize">{payment.payment_method}</td>
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
      )}
    </div>
  );
}
