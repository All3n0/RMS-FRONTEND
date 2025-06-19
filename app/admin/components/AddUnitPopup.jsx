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
    deposit_amount: ''
  });

  const handleChange = (e) => {
    setUnit({ ...unit, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const cookie = Cookies.get('user');
      const user = JSON.parse(cookie)?.user;

      if (!user?.user_id) throw new Error("Admin ID missing from cookie");

      const payload = {
        ...unit,
        admin_id: user.user_id,
        property_id: parseInt(propertyId),
        monthly_rent: parseFloat(unit.monthly_rent),
        deposit_amount: parseFloat(unit.deposit_amount)
      };

      const res = await fetch('http://127.0.0.1:5556/units', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add unit");
      }

      console.log("Unit created successfully");
      onClose();
      window.location.reload(); // Refresh page

    } catch (error) {
      console.error("Error adding unit:", error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-xl space-y-4">
        <h2 className="text-2xl font-bold">Add Unit</h2>

        <input name="unit_number" className="input input-bordered w-full" placeholder="Unit Number" onChange={handleChange} />
        <input name="unit_name" className="input input-bordered w-full" placeholder="Unit Name" onChange={handleChange} />
        <input name="status" className="input input-bordered w-full" placeholder="Status" onChange={handleChange} />
        <input name="type" className="input input-bordered w-full" placeholder="Type" onChange={handleChange} />
        <input name="monthly_rent" className="input input-bordered w-full" placeholder="Monthly Rent" type="number" onChange={handleChange} />
        <input name="deposit_amount" className="input input-bordered w-full" placeholder="Deposit Amount" type="number" onChange={handleChange} />

        <div className="flex justify-end space-x-2">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}
