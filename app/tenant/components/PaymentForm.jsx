'use client';
import { useEffect, useState } from 'react';

export default function PaymentForm({ onSuccess }) {
  const [leaseInfo, setLeaseInfo] = useState(null);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

      alert('✅ Payment submitted for review');
      if (onSuccess) onSuccess();
      window.location.reload();
    } catch (err) {
      setError(err.message || 'Error submitting payment');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <p className="text-red-600 text-center">{error}</p>;
  }

  if (!leaseInfo) {
    return <p className="text-center text-black">Loading lease info...</p>;
  }

  return (
<form
  onSubmit={handleSubmit}
  className="space-y-5 bg-white p-6 rounded-xl shadow-xl text-black"
>
  <div>
    <label className="block mb-1 font-semibold text-blue-600">Amount (KES)</label>
    <input
      type="number"
      required
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      className="w-full rounded-lg border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm px-3 py-2"
    />
  </div>

  <div>
    <label className="block mb-1 font-semibold text-blue-600">Payment Method</label>
    <select
      value={paymentMethod}
      onChange={(e) => setPaymentMethod(e.target.value)}
      required
      className="w-full rounded-lg border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm px-3 py-2"
    >
      <option value="">-- Select Method --</option>
      <option value="mpesa">Mpesa</option>
      <option value="bank">Bank</option>
      <option value="cash">Cash</option>
    </select>
  </div>

  <div>
    <label className="block mb-1 font-semibold text-blue-600">Transaction Ref No.</label>
    <input
      type="text"
      required
      value={reference}
      onChange={(e) => setReference(e.target.value)}
      className="w-full rounded-lg border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm px-3 py-2"
    />
  </div>

  <button
    type="submit"
    disabled={loading}
    className="btn btn-outline w-full flex flex-col items-center justify-center gap-1 px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm text-blue-600 border-blue-600"
  >
    {loading ? 'Submitting...' : 'Submit Payment'}
  </button>
</form>

  );
}
