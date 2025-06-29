'use client';

import { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function PaymentRecordingModal({ show, onHide, onSubmit, lease }) {
  const [formData, setFormData] = useState({
    payment_date: '',
    amount: lease?.monthly_rent || '',
    payment_method: 'bank_transfer',
    transaction_reference: '',
    period_start: '',
    period_end: '',
    admin_id: 1,
    payment_month: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {}; 
    if (!formData.payment_date) {
      newErrors.payment_date = "Payment date is required.";
    }

    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Enter a valid amount.";
    }

    if (!formData.period_start || !formData.period_end) {
      newErrors.period = "Both period dates are required.";
    } else if (new Date(formData.period_start) > new Date(formData.period_end)) {
      newErrors.period = "Start date must be before end date.";
    }

    if (!formData.payment_month) {
      newErrors.payment_month = "Payment month is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nextMonthStr = nextMonth.toISOString().split('T')[0];
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

    setFormData((prev) => ({
      ...prev,
      payment_date: todayStr,
      period_start: todayStr,
      period_end: nextMonthStr,
      payment_month: currentMonth
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, date) => {
    const dateStr = date ? dayjs(date).format('YYYY-MM-DD') : '';
    setFormData((prev) => ({ ...prev, [name]: dateStr }));
    
    // If changing payment date, update payment month
    if (name === 'payment_date' && date) {
      const month = dayjs(date).format('YYYY-MM');
      setFormData((prev) => ({ ...prev, payment_month: month }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = {
      ...formData,
      amount: parseFloat(formData.amount),
      admin_id: parseInt(formData.admin_id),
    };
    onSubmit(data);
  };

  if (!show) return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-black mb-4 border-b pb-2">Record New Payment</h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Payment Date</label>
                <DatePicker
                  value={dayjs(formData.payment_date)}
                  onChange={(date) => handleDateChange('payment_date', date)}
                  className="w-full"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined',
                      error: !!errors.payment_date,
                      helperText: errors.payment_date
                    }
                  }}
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
                {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Payment Month</label>
              <input
                type="month"
                name="payment_month"
                value={formData.payment_month}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              />
              {errors.payment_month && <p className="text-red-500 text-sm mt-1">{errors.payment_month}</p>}
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
                <DatePicker
                  value={dayjs(formData.period_start)}
                  onChange={(date) => handleDateChange('period_start', date)}
                  className="w-full"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined',
                      error: !!errors.period,
                      helperText: errors.period
                    }
                  }}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Period End</label>
                <DatePicker
                  value={dayjs(formData.period_end)}
                  onChange={(date) => handleDateChange('period_end', date)}
                  className="w-full"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined',
                      error: !!errors.period,
                    }
                  }}
                />
                {errors.period && <p className="text-red-500 text-sm mt-1">{errors.period}</p>}
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-2">
              <button
                type="button"
                onClick={onHide}
                className="btn btn-outline border-gray-400 hover:bg-red-400 text-black px-4 py-2 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-outline border-blue-600  text-blue-600 px-4 py-2 rounded-md transition-colors"
              >
                Record Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </LocalizationProvider>
  );
}