'use client';

import { useState, useEffect } from 'react';

export default function PaymentRecordingModal({ show, onHide, onSubmit, lease }) {
  const [formData, setFormData] = useState({
    payment_date: '',
    amount: lease?.monthly_rent || '',
    payment_method: 'bank_transfer',
    transaction_reference: '',
    period_start: '',
    period_end: '',
    admin_id: 1
  });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nextMonthStr = nextMonth.toISOString().split('T')[0];

    setFormData((prev) => ({
      ...prev,
      payment_date: today,
      period_start: today,
      period_end: nextMonthStr
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      amount: parseFloat(formData.amount),
      admin_id: parseInt(formData.admin_id)
    };
    onSubmit(data);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-black mb-4 border-b pb-2">Record New Payment</h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Payment Date</label>
              <input
                type="date"
                name="payment_date"
                value={formData.payment_date}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Amount ($)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Payment Method</label>
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              required
            >
              <option value="bank_transfer">Bank Transfer</option>
              <option value="credit_card">Credit Card</option>
              <option value="check">Check</option>
              <option value="cash">Cash</option>
              <option value="mobile_payment">Mobile Payment</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Transaction Reference</label>
            <input
              type="text"
              name="transaction_reference"
              value={formData.transaction_reference}
              onChange={handleChange}
              placeholder="Enter reference number"
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Period Start</label>
              <input
                type="date"
                name="period_start"
                value={formData.period_start}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Period End</label>
              <input
                type="date"
                name="period_end"
                value={formData.period_end}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-2">
            <button
              type="button"
              onClick={onHide}
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md"
            >
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
