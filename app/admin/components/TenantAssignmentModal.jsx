'use client';

import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { 
  XMarkIcon, 
  UserPlusIcon, 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function TenantAssignmentModal({ show, onHide, onSubmit, unit }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: null,
    emergency_contact_name: '',
    emergency_contact_number: '',
    move_in_date: null,
    lease_start: null,
    lease_end: null,
    payment_due_day: 1,
    admin_id: 1,
    use_existing: false,
    tenant_id: ''
  });

  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch tenants when modal opens and use_existing is true
  useEffect(() => {
    if (show && formData.use_existing) {
      fetchTenants();
    }
  }, [show, formData.use_existing]);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching tenants for admin ID:', formData.admin_id);
      
      const response = await axios.get(`http://127.0.0.1:5556/tenants/by-admin/${formData.admin_id}`);
      console.log('Tenants response:', response.data);
      
      // Log the structure of the first tenant to debug
      if (response.data.tenants && response.data.tenants.length > 0) {
        console.log('First tenant structure:', response.data.tenants[0]);
        console.log('Available keys:', Object.keys(response.data.tenants[0]));
      }
      
      setTenants(response.data.tenants || []);
    } catch (err) {
      console.error('Full error details:', err);
      setError(`Failed to fetch tenants: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date, field) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
  };

  const handleTenantSelect = (e) => {
    const selectedTenantId = e.target.value;
    console.log('Selected tenant ID:', selectedTenantId);
    console.log('Available tenants:', tenants);
    
    // Find the selected tenant - use safe access to properties
    const selectedTenant = tenants.find(tenant => {
      // Try different possible ID property names
      const tenantId = tenant.tenant_id || tenant.id || tenant.user_id;
      console.log('Checking tenant:', tenant, 'with ID:', tenantId);
      return tenantId && tenantId.toString() === selectedTenantId;
    });
    
    console.log('Found selected tenant:', selectedTenant);
    
    if (selectedTenant) {
      setFormData((prev) => ({
        ...prev,
        tenant_id: selectedTenantId,
        first_name: selectedTenant.first_name || '',
        last_name: selectedTenant.last_name || '',
        email: selectedTenant.email || '',
        phone: selectedTenant.phone || selectedTenant.phone_number || '',
        date_of_birth: selectedTenant.date_of_birth ? new Date(selectedTenant.date_of_birth) : null
      }));
    } else {
      console.error('No tenant found with ID:', selectedTenantId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Form data being submitted:', formData);
      
      const data = {
        ...formData,
        date_of_birth: formData.date_of_birth?.toISOString().split('T')[0],
        move_in_date: formData.move_in_date?.toISOString().split('T')[0],
        lease_start: formData.lease_start?.toISOString().split('T')[0],
        lease_end: formData.lease_end?.toISOString().split('T')[0],
        admin_id: parseInt(formData.admin_id),
      };
      
      console.log('Processed data for submission:', data);
      
      const response = await onSubmit(data);
      
      // Show success message with password info if new tenant was created
      if (!formData.use_existing && response.data) {
        const defaultPassword = `${formData.first_name.toLowerCase().replace(/\s+/g, '')}@123`;
        alert(`Tenant created successfully! Their temporary password is: ${defaultPassword}`);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-2xl">
                <UserPlusIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Assign Tenant</h2>
                <p className="text-blue-100 text-sm">Unit {unit.unit_number} - {unit.unit_name}</p>
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
        <form onSubmit={handleSubmit} className="flex flex-col h-[85vh]">
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
           {/* Use existing toggle — Pixel-perfect custom checkbox */}
<div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
  <label className="inline-flex items-center gap-3 cursor-pointer">
    {/* visually hidden native checkbox for accessibility */}
    <input
      type="checkbox"
      checked={formData.use_existing}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          use_existing: e.target.checked,
          tenant_id: '',
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          date_of_birth: null
        }))
      }
      className="sr-only"
      aria-hidden="false"
    />

    {/* visible square */}
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center w-5 h-5 border rounded-sm transition-all
        ${formData.use_existing ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}
      style={{ lineHeight: 1 }} // helps browsers render exactly centered
    >
      {formData.use_existing && (
        <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="none" stroke="currentColor">
          <path d="M4 10l3 3 9-9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>

    <span className="text-sm font-semibold text-gray-700 leading-none select-none">
      Use existing tenant
    </span>
  </label>
</div>


            {formData.use_existing ? (
              <div className="space-y-4">
                

                {error ? (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-2xl">
                    <div className="flex items-center gap-2 text-red-700">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">{error}</span>
                    </div>
                    <div className="text-xs text-red-600 mt-1">
                      Check if the backend route '/tenants/by-admin/{formData.admin_id}' exists
                    </div>
                  </div>
                ) : tenants.length === 0 && !loading ? (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-center">
                    <UserIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No tenants found for this admin.</p>
                    {!error && (
                      <p className="text-xs text-gray-500 mt-1">
                        The API endpoint might not be implemented yet.
                      </p>
                    )}
                  </div>
                ) : <div className="space-y-4">
  <div className="flex items-center justify-between">
    <label className="block text-sm font-semibold text-gray-700">
      Select Existing Tenant
    </label>
    <button
      type="button"
      onClick={fetchTenants}
      className="group flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition-all duration-300"
      disabled={loading}
    >
      <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
      {loading ? 'Loading...' : 'Refresh'}
    </button>
  </div>

  {error ? (
    <div className="p-3 bg-red-50 border border-red-200 rounded-2xl">
      <div className="flex items-center gap-2 text-red-700">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <span className="text-sm font-medium">{error}</span>
      </div>
      <div className="text-xs text-red-600 mt-1">
        Check if the backend route '/tenants/by-admin/{formData.admin_id}' exists
      </div>
    </div>
  ) : tenants.length === 0 && !loading ? (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-center">
      <UserIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
      <p className="text-sm text-gray-600">No tenants found for this admin.</p>
      {!error && (
        <p className="text-xs text-gray-500 mt-1">
          The API endpoint might not be implemented yet.
        </p>
      )}
    </div>
  ) : (
    <div className="relative">
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <select
        value={formData.tenant_id}
        onChange={handleTenantSelect}
        className=" text-black w-full border border-gray-200 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 appearance-none bg-white pr-12 cursor-pointer bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-white shadow-sm hover:shadow-md"
        required
      >
        <option value="" className="text-red-500 py-3">
          👤 Choose a tenant ({tenants.length} available)...
        </option>
        {tenants.map((tenant) => {
          const tenantId = tenant.tenant_id || tenant.id || tenant.user_id;
          const displayName = `${tenant.first_name || ''} ${tenant.last_name || ''}`.trim();
          const email = tenant.email || '';
          const phone = tenant.phone || tenant.phone_number || '';
          
          return (
            <option 
              key={tenantId} 
              value={tenantId}
              className="py-4 px-2 border-b border-gray-100 last:border-b-0 bg-white hover:bg-blue-50 text-gray-700 cursor-pointer group "
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white font-semibold text-sm">
                    {displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 text-sm truncate">{displayName} ||  </span>
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium ml-2">
                       ID: {tenantId} ||  
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs truncate mt-1 flex items-center gap-1">
                    <span>   📧</span>
                    {email}  ||
                  </p>
                  {phone && (
                    <p className="text-gray-500 text-xs truncate mt-1 flex items-center gap-1">
                      <span>  📞</span>
                      {phone}
                    </p>
                  )}
                </div>
              </div>
            </option>
          );
        })}
      </select>
    </div>
  )}
  
  {/* Display selected tenant info */}
  {formData.tenant_id && (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
      <h4 className="font-semibold text-sm text-blue-800 mb-3">Selected Tenant</h4>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-600">Name:</span>
          <p className="font-medium text-gray-800">{formData.first_name} {formData.last_name}</p>
        </div>
        <div>
          <span className="text-gray-600">Email:</span>
          <p className="font-medium text-gray-800">{formData.email}</p>
        </div>
        <div>
          <span className="text-gray-600">Phone:</span>
          <p className="font-medium text-gray-800">{formData.phone}</p>
        </div>
        <div>
          <span className="text-gray-600">Tenant ID:</span>
          <p className="font-medium text-gray-800">{formData.tenant_id}</p>
        </div>
      </div>
    </div>
  )}
</div>}
                
                
              </div>
            ) : (
              <>
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">First Name</label>
                      <div className="relative">
                        <div className="absolute top-1/3 left-0 pl-3 -translate-y-1/2 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input 
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          placeholder="John"
                          className="w-full border border-gray-200 rounded-2xl px-3 py-3 pl-9 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Last Name</label>
                      <div className="relative">
                        <div className="absolute top-1/3 left-0 pl-3 -translate-y-1/2 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input 
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          placeholder="Doe"
                          className="w-full border border-gray-200 rounded-2xl px-3 py-3 pl-9 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Email</label>
                      <div className="relative">
                        <div className="absolute top-1/3 left-0 pl-3 -translate-y-1/2 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input 
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="johndoe@example.com"
                          className="w-full border border-gray-200 rounded-2xl px-3 py-3 pl-9 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Phone</label>
                      <div className="relative">
                        <div className="absolute top-1/3 left-0 pl-3 -translate-y-1/2 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <PhoneIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input 
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="123-456-7890"
                          className="w-full border border-gray-200 rounded-2xl px-3 py-3 pl-9 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Date of Birth</label>
                    <div className="relative">
                      <div className="absolute top-1/3 left-0 pl-3 -translate-y-1/2 inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
                      </div>
                      <DatePicker
                        selected={formData.date_of_birth}
                        onChange={(date) => handleDateChange(date, 'date_of_birth')}
                        className="w-full border border-gray-200 rounded-2xl px-3 py-3 pl-9 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select date of birth"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Emergency Contact
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Contact Name</label>
                      <input 
                        type="text"
                        name="emergency_contact_name"
                        value={formData.emergency_contact_name}
                        onChange={handleChange}
                        placeholder="Jane Doe"
                        className="w-full border border-gray-200 rounded-2xl px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Contact Number</label>
                      <div className="relative">
                        <div className="  absolute top-1/3 left-0 pl-3 -translate-y-1/2 inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <PhoneIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input 
                          type="tel"
                          name="emergency_contact_number"
                          value={formData.emergency_contact_number}
                          onChange={handleChange}
                          placeholder="123-456-7890"
                          className="w-full border border-gray-200 rounded-2xl px-3 py-3 pl-9 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Lease Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Lease Information
              </h3>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Move In Date</label>
                <div className="relative">
                  <div className="absolute top-1/3 left-0 pl-3 -translate-y-1/2 inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <DatePicker
                    selected={formData.move_in_date}
                    onChange={(date) => handleDateChange(date, 'move_in_date')}
                    className="w-full border border-gray-200 rounded-2xl px-3 py-3 pl-9 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select move in date"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Lease Start Date</label>
                  <div className="relative">
                    <div className="absolute top-1/3 left-0 pl-3 -translate-y-1/2 inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <DatePicker
                      selected={formData.lease_start}
                      onChange={(date) => handleDateChange(date, 'lease_start')}
                      className="w-full border border-gray-200 rounded-2xl px-3 py-3 pl-9 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Select start date"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Lease End Date</label>
                  <div className="relative">
                    <div className="absolute top-1/3 left-0 pl-3 -translate-y-1/2 inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <DatePicker
                      selected={formData.lease_end}
                      onChange={(date) => handleDateChange(date, 'lease_end')}
                      className="w-full border border-gray-200 rounded-2xl px-3 py-3 pl-9 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Select end date"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Payment Due Day (1-28)</label>
                <input 
                  type="number"
                  name="payment_due_day"
                  min="1"
                  max="28"
                  value={formData.payment_due_day}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-2xl px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
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
              className="group bg-white text-gray-700 hover:text-red-600 border border-gray-200 hover:border-red-200 py-3 px-6 rounded-2xl font-semibold shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
            >
              <XMarkIcon className="h-4 w-4" />
              Cancel
            </button>
            <button
              type="submit"
              className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
            >
              <UserPlusIcon className="h-4 w-4" />
              Assign Tenant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}