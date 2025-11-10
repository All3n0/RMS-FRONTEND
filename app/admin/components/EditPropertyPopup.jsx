'use client';

import { useState } from 'react';
import { 
  XMarkIcon, 
  BuildingOfficeIcon, 
  MapPinIcon, 
  BuildingStorefrontIcon,
  FlagIcon,
  TagIcon
} from '@heroicons/react/24/outline';

export default function EditPropertyPopup({ property, onClose, onSave }) {
  const [formData, setFormData] = useState({
    property_name: property.property_name || '',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform transition-all duration-300 scale-100 hover:scale-[1.02]">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-2xl">
              <BuildingOfficeIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Edit Property</h2>
              <p className="text-blue-100 text-sm">Update property details and location information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-2xl transition-all duration-200"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Property Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <BuildingStorefrontIcon className="h-4 w-4 text-blue-500" />
              Property Name *
            </label>
            <input
              name="property_name"
              value={formData.property_name}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-400"
              placeholder="Enter property name"
              required
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <MapPinIcon className="h-4 w-4 text-blue-500" />
              Street Address *
            </label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-400"
              placeholder="Enter street address"
              required
            />
          </div>

          {/* City & State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <BuildingStorefrontIcon className="h-4 w-4 text-blue-500" />
                City *
              </label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-400"
                placeholder="Enter city"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FlagIcon className="h-4 w-4 text-blue-500" />
                State *
              </label>
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-400"
                placeholder="Enter state"
                required
              />
            </div>
          </div>

          {/* Zip Code */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <TagIcon className="h-4 w-4 text-blue-500" />
              Zip Code *
            </label>
            <input
              name="zip_code"
              value={formData.zip_code}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-400"
              placeholder="Enter zip code"
              required
            />
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button 
              type="button" 
              className="bg-white px-6 py-3 rounded-2xl border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 font-semibold transition-all duration-200 transform hover:-translate-y-0.5"
              onClick={onClose}
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