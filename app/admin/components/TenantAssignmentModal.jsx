'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date, field) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      date_of_birth: formData.date_of_birth?.toISOString().split('T')[0],
      move_in_date: formData.move_in_date?.toISOString().split('T')[0],
      lease_start: formData.lease_start?.toISOString().split('T')[0],
      lease_end: formData.lease_end?.toISOString().split('T')[0],
      admin_id: parseInt(formData.admin_id),
    };
    onSubmit(data);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
        <form onSubmit={handleSubmit} className="flex flex-col h-[85vh]">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">
              Assign Tenant to Unit {unit.unit_number}
            </h2>
            <button
              type="button"
              onClick={onHide}
              className="text-black-500 hover:text-blue-800 text-xl"
            >
              &times;
            </button>
          </div>

          {/* Body */}
          <div className="p-4 overflow-y-auto flex-1 space-y-4">
            {/* Use existing toggle */}
            <label className="flex items-center gap-2 font-large" style={{color:'black'}}>
              <input style={{color:"black"}}
                type="checkbox"
                
                checked={formData.use_existing}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    use_existing: e.target.checked,
                  }))
                }
              />
              Use existing tenant
            </label>

            {formData.use_existing ? (
              <div>
                <label className="block text-sm font-large mb-1" style={{ color: 'black' }}>Tenant ID</label>
                <input 
                  style={{color:"black"}} 
                  type="text"
                  name="tenant_id"
                  value={formData.tenant_id}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Enter tenant ID"
                />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-large mb-1"style={{ color: 'black' }}>First Name</label>
                    <input style={{color:"black"}}
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder='EG: John'
                      className="w-full border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-large mb-1 "style={{ color: 'black' }}>Last Name</label>
                    <input style={{color:"black"}}
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder='EG: Doe'
                      className="w-full border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-large mb-1"style={{ color: 'black' }}>Email</label>
                    <input style={{color:"black"}}
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder='EG: Johndoe@example.com'
                      className="w-full border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-large mb-1"style={{ color: 'black' }}>Phone</label>
                    <input style={{color:"black"}}
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder='EG: 123-456-7890'
                      className="w-full border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-large mb-1"style={{ color: 'black' }}>Date of Birth</label>
                  <DatePicker
                    selected={formData.date_of_birth}
                    onChange={(date) => handleDateChange(date, 'date_of_birth')}
                    className="w-full border rounded-md px-3 py-2"
                    dateFormat="yyyy-MM-dd"
                    placeholderText="YYYY-MM-DD"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-large mb-1"style={{ color: 'black' }}>Emergency Contact Name</label>
                    <input style={{color:"black"}}
                      type="text"
                      name="emergency_contact_name"
                      value={formData.emergency_contact_name}
                      onChange={handleChange}
                      placeholder='EG: Jane Doe'
                      className="w-full border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-large mb-1"style={{ color: 'black' }}>Emergency Contact Number</label>
                    <input style={{color:"black"}}
                      type="tel"
                      name="emergency_contact_number"
                      value={formData.emergency_contact_number}
                      onChange={handleChange}
                      placeholder='EG: 123-456-7890'
                      className="w-full border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-large mb-1"style={{ color: 'black' }}>Move In Date</label>
              <DatePicker
                selected={formData.move_in_date}
                onChange={(date) => handleDateChange(date, 'move_in_date')}
                className="w-full border rounded-md px-3 py-2"
                dateFormat="yyyy-MM-dd"
                placeholderText="YYYY-MM-DD"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-large mb-1"style={{ color: 'black' }}>Lease Start</label>
                <DatePicker
                  selected={formData.lease_start}
                  onChange={(date) => handleDateChange(date, 'lease_start')}
                  className="w-full border rounded-md px-3 py-2"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="YYYY-MM-DD"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-large mb-1"style={{ color: 'black' }}>Lease End</label>
                <DatePicker
                  selected={formData.lease_end}
                  onChange={(date) => handleDateChange(date, 'lease_end')}
                  className="w-full border rounded-md px-3 py-2"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="YYYY-MM-DD"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-large mb-1"style={{ color: 'black' }}>Payment Due Day (1-28)</label>
              <input style={{color:"black"}}
                type="number"
                name="payment_due_day"
                min="1"
                max="28"
                value={formData.payment_due_day}
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
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md"
            >
              Assign Tenant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
