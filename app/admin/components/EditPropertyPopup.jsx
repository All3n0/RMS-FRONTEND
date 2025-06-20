'use client';

import { useState } from 'react';

export default function EditPropertyPopup({ property, onClose, onSave }) {
  const [formData, setFormData] = useState({
    address: property.address || '',
    city: property.city || '',
    state: property.state || '',
    zip_code: property.zip_code || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl w-full max-w-xl space-y-6 text-black shadow-xl">
        <h2 className="text-2xl font-bold">Edit Property</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <input
              name="address"
              className="input input-bordered w-full rounded-lg"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input
                name="city"
                className="input input-bordered w-full rounded-lg"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
              <input
                name="state"
                className="input input-bordered w-full rounded-lg"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code *</label>
            <input
              name="zip_code"
              className="input input-bordered w-full rounded-lg"
              value={formData.zip_code}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button 
              type="button" 
              className="btn btn-outline border-gray-300 rounded-lg hover:bg-gray-100" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}