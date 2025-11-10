'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { 
  XMarkIcon, 
  HomeModernIcon, 
  HashtagIcon, 
  CheckBadgeIcon,
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  PlusIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

export default function AddUnitPopup({ propertyId, onClose, onUnitAdded }) {
  const [unit, setUnit] = useState({
    unit_number: '',
    unit_name: '',
    status: '',
    type: '',
    monthly_rent: '',
    deposit_amount: '',
    other_type: '',
    statusOpen: false,
    typeOpen: false
  });

  const statusOptions = ['occupied', 'vacant', 'maintenance'];
  const typeOptions = ['bedsitter', 'studio', 'One bedroom', 'Two bedroom', 'condo', 'villa', 'Three bedroom', 'mansionate', 'other'];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setUnit(prev => ({
          ...prev,
          statusOpen: false,
          typeOpen: false
        }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setUnit({ ...unit, [e.target.name]: e.target.value });
  };

  const handleStatusSelect = (option) => {
    setUnit(prev => ({ 
      ...prev, 
      status: option, 
      statusOpen: false 
    }));
  };

  const handleTypeSelect = (option) => {
    setUnit(prev => ({ 
      ...prev, 
      type: option, 
      typeOpen: false 
    }));
  };

  const handleSubmit = async () => {
    try {
      const cookie = Cookies.get('user');
      const user = JSON.parse(cookie);

      if (!user?.user_id || user.role !== 'admin') {
        alert('You must be logged in as an admin');
        return;
      }

      const finalType = unit.type === 'other' ? unit.other_type : unit.type;

      const payload = {
        ...unit,
        type: finalType,
        admin_id: user.user_id,
        property_id: parseInt(propertyId),
        monthly_rent: parseFloat(unit.monthly_rent),
        deposit_amount: parseFloat(unit.deposit_amount)
      };

      delete payload.other_type;
      delete payload.statusOpen;
      delete payload.typeOpen;

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
      if (onUnitAdded) onUnitAdded();
      onClose();

    } catch (error) {
      console.error("❌ Error adding unit:", error.message);
      alert("Failed to add unit: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform transition-all duration-300 scale-100 overflow-y-auto max-h-[95vh] sm:max-h-[90vh]">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-4 sm:p-6 sticky top-0 z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-white/20 rounded-xl sm:rounded-2xl">
              <PlusIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-white truncate">Add New Unit</h2>
              <p className="text-blue-100 text-xs sm:text-sm truncate">Create a new unit for this property</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl sm:rounded-2xl transition-all duration-200"
          >
            <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Unit Number */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <HashtagIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
              Unit Number *
            </label>
            <input 
              name="unit_number" 
              value={unit.unit_number}
              className="w-full border border-gray-200 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-400 text-sm sm:text-base"
              placeholder="e.g., 101, A1, Ground-1" 
              onChange={handleInputChange} 
              required
            />
          </div>

          {/* Unit Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <HomeModernIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
              Unit Name
            </label>
            <input 
              name="unit_name" 
              value={unit.unit_name}
              className="w-full border border-gray-200 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-400 text-sm sm:text-base"
              placeholder="e.g., Garden View Suite, Penthouse, Corner Unit" 
              onChange={handleInputChange} 
            />
          </div>

          {/* Status and Type Grid */}
          <div className="grid grid-cols-1 gap-4">
            {/* Status Dropdown */}
            <div className="space-y-2 dropdown-container">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <CheckBadgeIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                Status *
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full border border-gray-200 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 text-left flex justify-between items-center text-sm sm:text-base"
                  onClick={() => setUnit(prev => ({ ...prev, statusOpen: !prev.statusOpen, typeOpen: false }))}
                >
                  <span className={`truncate ${unit.status ? 'text-gray-800' : 'text-gray-400'}`}>
                    {unit.status ? unit.status.charAt(0).toUpperCase() + unit.status.slice(1) : 'Select status'}
                  </span>
                  <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${unit.statusOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Options */}
                {unit.statusOpen && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg max-h-32 sm:max-h-48 overflow-y-auto">
                    {statusOptions.map(option => (
                      <button
                        key={option}
                        type="button"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-gray-50 focus:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150 first:rounded-t-xl sm:first:rounded-t-2xl last:rounded-b-xl sm:last:rounded-b-2xl text-sm sm:text-base"
                        onClick={() => handleStatusSelect(option)}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Type Dropdown */}
            <div className="space-y-2 dropdown-container">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <BuildingStorefrontIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                Type *
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full border border-gray-200 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 text-left flex justify-between items-center text-sm sm:text-base"
                  onClick={() => setUnit(prev => ({ ...prev, typeOpen: !prev.typeOpen, statusOpen: false }))}
                >
                  <span className={`truncate ${unit.type ? 'text-gray-800' : 'text-gray-400'}`}>
                    {unit.type ? unit.type.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Select unit type'}
                  </span>
                  <ChevronDownIcon className={`h-4 w-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${unit.typeOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Options */}
                {unit.typeOpen && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg max-h-32 sm:max-h-48 overflow-y-auto">
                    {typeOptions.map(option => (
                      <button
                        key={option}
                        type="button"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-gray-50 focus:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150 first:rounded-t-xl sm:first:rounded-t-2xl last:rounded-b-xl sm:last:rounded-b-2xl text-sm sm:text-base"
                        onClick={() => handleTypeSelect(option)}
                      >
                        {option.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Other Type Input */}
          {unit.type === 'other' && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <BuildingStorefrontIcon className="h-4 w-4 text-amber-500 flex-shrink-0" />
                Specify Unit Type *
              </label>
              <input 
                name="other_type" 
                value={unit.other_type}
                className="w-full border border-gray-200 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-amber-50 hover:bg-white text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                placeholder="Enter custom unit type" 
                onChange={handleInputChange} 
                required
              />
            </div>
          )}

          {/* Monthly Rent */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <CurrencyDollarIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
              Monthly Rent *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <span className="text-gray-600 font-medium text-sm sm:text-base">Ksh</span>
              </div>
              <input 
                name="monthly_rent" 
                type="number" 
                value={unit.monthly_rent}
                className="w-full border border-gray-200 rounded-xl sm:rounded-2xl pl-12 sm:pl-14 pr-3 sm:pr-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                placeholder="0.00" 
                onChange={handleInputChange} 
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Deposit Amount */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <BanknotesIcon className="h-4 w-4 text-amber-500 flex-shrink-0" />
              Deposit Amount *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <span className="text-gray-600 font-medium text-sm sm:text-base">Ksh</span>
              </div>
              <input 
                name="deposit_amount" 
                type="number" 
                value={unit.deposit_amount}
                className="w-full border border-gray-200 rounded-xl sm:rounded-2xl pl-12 sm:pl-14 pr-3 sm:pr-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                placeholder="0.00" 
                onChange={handleInputChange} 
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-100 bg-gray-50 sticky bottom-0">
          <button 
            type="button"
            className="bg-white px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 font-semibold transition-all duration-200 transform hover:-translate-y-0.5 text-xs sm:text-sm md:text-base flex-1 sm:flex-none"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            type="button"
            className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base flex-1 sm:flex-none"
            onClick={handleSubmit}
          >
            <PlusIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Add Unit
          </button>
        </div>
      </div>
    </div>
  );
}