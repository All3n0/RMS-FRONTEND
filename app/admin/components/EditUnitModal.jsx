'use client';
import React, { useState, useEffect } from 'react';
import { XMarkIcon, HomeModernIcon, HashtagIcon, CurrencyDollarIcon, BanknotesIcon } from '@heroicons/react/24/outline';

export default function EditUnitModal({ show, onHide, onSubmit, unit }) {
  const [form, setForm] = useState({
    unit_name: '',
    unit_number: '',
    monthly_rent: '',
    deposit_amount: ''
  });

  useEffect(() => {
    if (unit) {
      setForm({
        unit_name: unit.unit_name || '',
        unit_number: unit.unit_number || '',
        monthly_rent: unit.monthly_rent || '',
        deposit_amount: unit.deposit_amount || ''
      });
    }
  }, [unit]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    onHide();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform transition-all duration-300 scale-100 hover:scale-[1.02]">
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-2xl">
                <HomeModernIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Edit Unit</h2>
                <p className="text-blue-100 text-sm">Update unit details</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onHide}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-2xl transition-all duration-200"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* Unit Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <HomeModernIcon className="h-4 w-4 text-blue-500" />
                Unit Name
              </label>
              <input
                type="text"
                name="unit_name"
                value={form.unit_name}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-400"
                placeholder="Enter unit name"
                required
              />
            </div>

            {/* Unit Number */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <HashtagIcon className="h-4 w-4 text-blue-500" />
                Unit Number
              </label>
              <input
                type="text"
                name="unit_number"
                value={form.unit_number}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-400"
                placeholder="Enter unit number"
                required
              />
            </div>

            {/* Monthly Rent */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <CurrencyDollarIcon className="h-4 w-4 text-green-500" />
                Monthly Rent
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-medium">Ksh</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  name="monthly_rent"
                  value={form.monthly_rent}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-2xl pl-16 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-400"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Deposit Amount */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <BanknotesIcon className="h-4 w-4 text-amber-500" />
                Deposit Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-medium">Ksh</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  name="deposit_amount"
                  value={form.deposit_amount}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-2xl pl-16 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-400"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
            <button
              type="button"
              onClick={onHide}
              className="bg-white px-6 py-3 rounded-2xl border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 font-semibold transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}