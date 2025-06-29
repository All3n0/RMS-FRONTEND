'use client';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Edit Unit</h2>
            <button
              type="button"
              onClick={onHide}
              className="text-black-500 hover:text-blue-800 text-xl"
            >
              &times;
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-large mb-1" style={{ color: 'black' }}>Unit Name</label>
              <input
                style={{color: "black"}}
                type="text"
                name="unit_name"
                value={form.unit_name}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-large mb-1" style={{ color: 'black' }}>Unit Number</label>
              <input
                style={{color: "black"}}
                type="text"
                name="unit_number"
                value={form.unit_number}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-large mb-1" style={{ color: 'black' }}>Monthly Rent</label>
              <input
                style={{color: "black"}}
                type="number"
                step="0.01"
                name="monthly_rent"
                value={form.monthly_rent}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-large mb-1" style={{ color: 'black' }}>Deposit Amount</label>
              <input
                style={{color: "black"}}
                type="number"
                step="0.01"
                name="deposit_amount"
                value={form.deposit_amount}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onHide}
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 hover:bg-blue-100 bg-white btn btn-rounded border-blue-600 text-blue-600 rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}