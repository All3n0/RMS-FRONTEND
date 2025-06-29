'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function AddPropertyPopup({ onClose }) {
  const [formData, setFormData] = useState({
    property_name: '',
    address: '',
    city: '',
    state: '',
    zip_code: ''
  });

  const [adminId, setAdminId] = useState(null);
  const [error, setError] = useState('');

  // Load admin ID from cookie
  useEffect(() => {
    const cookie = Cookies.get('user');
    if (cookie) {
      try {
        const data = JSON.parse(cookie);
        const id = data?.user?.user_id;
        if (id) setAdminId(id);
      } catch (err) {
        console.error('Cookie parse error', err);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  const { property_name, address, city, state, zip_code } = formData;

  // ✅ Field validation
  if (!property_name||!address || !city || !state || !zip_code) {
    setError('All fields are required');
    return;
  }

  try {
    const cookie = Cookies.get('user');
    const user = JSON.parse(cookie);

    // ✅ Admin check
    if (!user?.user_id || user.role !== 'admin') {
      setError('You must be logged in as an admin');
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
      onClose(); // ✅ Close popup/modal
      window.location.reload(); // ✅ Refresh to show new property
    } else {
      const errData = await res.json();
      setError(errData?.error || 'Failed to create property');
      console.error('Error creating property:', errData);
    }
  } catch (err) {
    setError('Request failed. Please try again.');
    console.error('Request failed:', err);
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-black">Add Property</h2>

        {/* ✅ Error Display */}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <label className="text-black">Property Name</label>
        <input
          type="text"
          placeholder="Property Name"
          value={formData.property_name}
          onChange={(e) => setFormData({ ...formData, property_name: e.target.value })}
          className="input input-bordered w-full"
          required
        />
        <label className="text-black">Address</label>
        <input
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="input input-bordered w-full"
          required
        />
        <label className="text-black">City</label>
        <input
          type="text"
          placeholder="City"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className="input input-bordered w-full"
          required
        />
        <label className="text-black">State</label>
        <input
          type="text"
          placeholder="State"
          value={formData.state}
          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          className="input input-bordered w-full"
          required
        />
        <label className="text-black pt-2">Zip Code</label>
        <input
          type="text"
          placeholder="Zip Code"
          value={formData.zip_code}
          onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
          className="input input-bordered w-full"
          required
        />

        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="btn btn-secondary rounded-md tn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl">Cancel</button>
          <button type="submit" className="btn btn-neutral rounded-md tn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl ">Add</button>
        </div>
      </form>
    </div>
  );
}
