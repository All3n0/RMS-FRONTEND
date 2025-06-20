'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import AddUnitPopup from '../../components/AddUnitPopup';

export default function PropertyDetailPage() {
  const { propertyId } = useParams();
  const parsedPropertyId = parseInt(propertyId);
  const [units, setUnits] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (propertyId) {
      fetch(`http://127.0.0.1:5556/units/property/${propertyId}`)
        .then((res) => res.json())
        .then((data) => setUnits(data))
        .catch((err) => console.error('Error fetching units:', err));
    }
  }, [propertyId]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-8 text-black">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Property Units</h1>
        <button className="btn btn-primary" onClick={() => setShowPopup(true)}>
          + Add Units
        </button>
      </div>

      {showPopup && (
        <AddUnitPopup
          propertyId={parsedPropertyId}
          onClose={() => setShowPopup(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {units.map((unit) => (
          <div key={unit.unit_id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">{unit.unit_name} (#{unit.unit_number})</h2>
            <p>Status: <span className="font-medium">{unit.status}</span></p>
            <p>Type: <span className="font-medium">{unit.type}</span></p>
            <p>Rent: <span className="text-green-600 font-semibold">Ksh {unit.monthly_rent}</span></p>
            <p>Deposit: <span className="text-yellow-600 font-semibold">Ksh {unit.deposit_amount}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}