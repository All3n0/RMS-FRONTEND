'use client';

import { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { XMarkIcon, CurrencyDollarIcon, CalendarDaysIcon, CreditCardIcon } from '@heroicons/react/24/outline';

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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-2xl">
                  <CurrencyDollarIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Record New Payment</h2>
                  <p className="text-blue-100 text-sm">Enter payment details for the tenant</p>
                </div>
              </div>
              <button
                onClick={onHide}
                className="p-2 hover:bg-white/20 rounded-2xl transition-all duration-300 group"
              >
                <XMarkIcon className="h-5 w-5 text-white group-hover:text-gray-200" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Amount & Payment Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Amount ($)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className={`w-full border border-gray-200 rounded-2xl px-3 py-3 pl-9 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                      errors.amount ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                    }`}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    required
                  />
                </div>
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <XMarkIcon className="h-3 w-3" />
                    {errors.amount}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Payment Date</label>
                <DatePicker
                  value={dayjs(formData.payment_date)}
                  onChange={(date) => handleDateChange('payment_date', date)}
                  className="w-full"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined',
                      error: !!errors.payment_date,
                      helperText: errors.payment_date,
                      className: 'rounded-2xl',
                      InputProps: {
                        className: 'rounded-2xl py-3',
                        startAdornment: <CalendarDaysIcon className="h-4 w-4 text-gray-400 mr-2" />
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Payment Month */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Payment Month</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="month"
                  name="payment_month"
                  value={formData.payment_month}
                  onChange={handleChange}
                  className={`w-full border border-gray-200 rounded-2xl px-3 py-3 pl-9 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                    errors.payment_month ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                  }`}
                  required
                />
              </div>
              {errors.payment_month && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <XMarkIcon className="h-3 w-3" />
                  {errors.payment_month}
                </p>
              )}
            </div>

            {/* Payment Method & Reference */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Payment Method</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCardIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-2xl px-3 py-3 pl-9 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 appearance-none bg-white"
                    required
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="check">Check</option>
                    <option value="cash">Cash</option>
                    <option value="mobile_payment">Mobile Payment</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Transaction Reference</label>
                <input
                  type="text"
                  name="transaction_reference"
                  value={formData.transaction_reference}
                  onChange={handleChange}
                  placeholder="Enter reference number"
                  className="w-full border border-gray-200 rounded-2xl px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
            </div>

            {/* Period Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Period Start</label>
                <DatePicker
                  value={dayjs(formData.period_start)}
                  onChange={(date) => handleDateChange('period_start', date)}
                  className="w-full"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined',
                      error: !!errors.period,
                      helperText: errors.period,
                      className: 'rounded-2xl',
                      InputProps: {
                        className: 'rounded-2xl py-3'
                      }
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Period End</label>
                <DatePicker
                  value={dayjs(formData.period_end)}
                  onChange={(date) => handleDateChange('period_end', date)}
                  className="w-full"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined',
                      error: !!errors.period,
                      className: 'rounded-2xl',
                      InputProps: {
                        className: 'rounded-2xl py-3'
                      }
                    }
                  }}
                />
                {errors.period && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <XMarkIcon className="h-3 w-3" />
                    {errors.period}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onHide}
                className="group bg-white text-gray-700 hover:text-red-600 border border-gray-200 hover:border-red-200 py-3 px-6 rounded-2xl font-semibold shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
              >
                <XMarkIcon className="h-4 w-4" />
                Cancel
              </button>
              <button
                type="submit"
                className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
              >
                <CurrencyDollarIcon className="h-4 w-4" />
                Record Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </LocalizationProvider>
  );
}