'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';

export default function AddUnitPopup({ propertyId, onClose }) {
  const [unit, setUnit] = useState({
    unit_number: '',
    unit_name: '',
    status: '',
    type: '',
    monthly_rent: '',
    deposit_amount: '',
    other_type: '' // For when "other" is selected
  });

  const statusOptions = ['occupied', 'vacant', 'maintenance'];
  const typeOptions = ['bedsitter', 'studio', 'One bedroom','Two bedroom', 'condo', 'villa', 'Three bedroom', 'mansionate', 'other'];

  const handleChange = (e) => {
    setUnit({ ...unit, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const cookie = Cookies.get('user');
      const user = JSON.parse(cookie);

      if (!user?.user_id || user.role !== 'admin') {
      setError('You must be logged in as an admin');
      return;
    }

      // If type is "other", use the other_type value
      const finalType = unit.type === 'other' ? unit.other_type : unit.type;

      const payload = {
        ...unit,
        type: finalType,
        admin_id: user.user_id,
        property_id: parseInt(propertyId),
        monthly_rent: parseFloat(unit.monthly_rent),
        deposit_amount: parseFloat(unit.deposit_amount)
      };

      // Remove other_type if it exists since we've already used it
      delete payload.other_type;

      console.log("🟨 Submitting payload:", payload);

      const res = await fetch('http://127.0.0.1:5556/units', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add unit");
      }

      console.log("✅ Unit created successfully");
      onClose();
      window.location.reload();

    } catch (error) {
      console.error("❌ Error adding unit:", error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl w-full max-w-xl space-y-6 text-black shadow-xl">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-gray-800">Add New Unit</h2>
          <p className="text-gray-600">Fill in the details for the new unit</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit Number *</label>
            <input 
              name="unit_number" 
              className="input input-bordered w-full rounded-lg" 
              placeholder="e.g., 101, A1" 
              onChange={handleChange} 
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit Name</label>
            <input 
              name="unit_name" 
              className="input input-bordered w-full rounded-lg" 
              placeholder="e.g., Garden View Suite" 
              onChange={handleChange} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
            <select 
              name="status" 
              className="select select-bordered w-full rounded-lg" 
              onChange={handleChange}
              required
            >
              <option value="">Select status</option>
              {statusOptions.map(option => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
            <select 
              name="type" 
              className="select select-bordered w-full rounded-lg" 
              onChange={handleChange}
              required
            >
              <option value="">Select unit type</option>
              {typeOptions.map(option => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {unit.type === 'other' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specify Unit Type *</label>
              <input 
                name="other_type" 
                className="input input-bordered w-full rounded-lg" 
                placeholder="Enter unit type" 
                onChange={handleChange} 
                required
              />
            </div>
          )}

          <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent *</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">Ksh</span>
            <input 
              name="monthly_rent" 
              type="number" 
              className="input input-bordered w-full rounded-lg pl-16"  // Increased left padding
              placeholder="0.00" 
              onChange={handleChange} 
              required
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Updated Deposit Amount field with proper currency symbol */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Amount *</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">Ksh</span>
            <input 
              name="deposit_amount" 
              type="number" 
              className="input input-bordered w-full rounded-lg pl-16"  // Increased left padding
              placeholder="0.00" 
              onChange={handleChange} 
              required
              min="0"
              step="0.01"
            />
          </div>
        </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button 
            className="btn btn-outline border-gray-300 rounded-lg hover:bg-gray-100" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary bg-black text-white rounded-lg hover:bg-gray-800" 
            onClick={handleSubmit}
          >
            Add Unit
          </button>
        </div>
      </div>
    </div>
  );
}