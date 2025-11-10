'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { 
  XMarkIcon, 
  BuildingOfficeIcon,
  MapPinIcon,
  BuildingStorefrontIcon,
  FlagIcon,
  TagIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

export default function AddPropertyPopup({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    property_name: '',
    address: '',
    city: '',
    state: '',
    zip_code: ''
  });

  const [adminId, setAdminId] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load admin ID from cookie
  useEffect(() => {
    const cookie = Cookies.get('user');
    if (cookie) {
      try {
        const data = JSON.parse(cookie);
        const id = data?.user?.user_id || data?.user_id;
        if (id) setAdminId(id);
      } catch (err) {
        console.error('Cookie parse error', err);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const { property_name, address, city, state, zip_code } = formData;

    // ✅ Field validation
    if (!property_name || !address || !city || !state || !zip_code) {
      setError('All fields are required');
      setIsSubmitting(false);
      return;
    }

    try {
      const cookie = Cookies.get('user');
      const user = JSON.parse(cookie);

      // ✅ Admin check
      if (!user?.user_id || user.role !== 'admin') {
        setError('You must be logged in as an admin');
        setIsSubmitting(false);
        return;
      }

      const payload = {
        ...formData,
        admin_id: user.user_id, // ✅ Include admin_id in body
      };

      const res = await fetch('http://127.0.0.1:5556/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': user.user_id,
          'X-User-Role': user.role,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Success:', data);
        if (onSuccess) onSuccess(); // ✅ Call success callback
        onClose(); // ✅ Close popup/modal
      } else {
        const errData = await res.json();
        setError(errData?.error || 'Failed to create property');
        console.error('Error creating property:', errData);
      }
    } catch (err) {
      setError('Request failed. Please try again.');
      console.error('Request failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-white/20 rounded-xl sm:rounded-2xl">
              <PlusIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Add New Property</h2>
              <p className="text-blue-100 text-xs sm:text-sm">Create a new property for your portfolio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl sm:rounded-2xl transition-all duration-200"
          >
            <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4">
              <p className="text-red-600 text-sm sm:text-base text-center">{error}</p>
            </div>
          )}

          {/* Property Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <BuildingStorefrontIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
              Property Name *
            </label>
            <input
              name="property_name"
              type="text"
              placeholder="e.g., Skyline Apartments, Garden Villas"
              value={formData.property_name}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-400 text-sm sm:text-base"
              required
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <MapPinIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
              Street Address *
            </label>
            <input
              name="address"
              type="text"
              placeholder="e.g., 123 Main Street"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-400 text-sm sm:text-base"
              required
            />
          </div>

          {/* City & State Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* City */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <BuildingOfficeIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                City *
              </label>
              <input
                name="city"
                type="text"
                placeholder="e.g., Nairobi"
                value={formData.city}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                required
              />
            </div>

            {/* State */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FlagIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                State *
              </label>
              <input
                name="state"
                type="text"
                placeholder="e.g., Nairobi County"
                value={formData.state}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                required
              />
            </div>
          </div>

          {/* Zip Code */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <TagIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
              Zip Code *
            </label>
            <input
              name="zip_code"
              type="text"
              placeholder="e.g., 00100"
              value={formData.zip_code}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-400 text-sm sm:text-base"
              required
            />
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-100">
            <button 
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="bg-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 font-semibold transition-all duration-200 transform hover:-translate-y-0.5 text-sm sm:text-base flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-2 text-sm sm:text-base flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Adding...
                </>
              ) : (
                <>
                  <PlusIcon className="h-4 w-4" />
                  Add Property
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}