'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { HomeModernIcon } from '@heroicons/react/24/solid';
import AddPropertyPopup from '../components/AddPropertyPopup';

export default function PropertiesPage() {
  const [showForm, setShowForm] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [properties, setProperties] = useState([]);

  // Get admin ID from cookie
  useEffect(() => {
    const cookie = Cookies.get('user');
    if (cookie) {
      try {
        const userData = JSON.parse(cookie);
        const id = userData?.user?.user_id;
        setAdminId(id);

        if (id) {
          fetch(`http://127.0.0.1:5556/properties/admin/${id}`)
            .then((res) => res.json())
            .then((data) => setProperties(data));
        }
      } catch (error) {
        console.error('Failed to parse user cookie:', error);
      }
    }
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-black">Properties</h1>
        <p className="text-gray-600 mt-1">Manage your rental properties and details</p>
      </div>

      {/* Add Property Button */}
      <div>
        <button onClick={() => setShowForm(true)} className="btn btn-neutral px-6">
          + Add Property
        </button>
      </div>

      {/* Add Property Form Popup */}
      {showForm && (
        <AddPropertyPopup
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            // re-fetch properties
            fetch(`http://127.0.0.1:5555/properties/admin/${adminId}`)
              .then((res) => res.json())
              .then((data) => setProperties(data));
          }}
        />
      )}

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Link key={property.id} href={`admin/properties/${property.id}`}>
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 flex items-center gap-4 cursor-pointer border-l-8 border-neutral">
              <HomeModernIcon className="h-10 w-10 text-black bg-white p-1 rounded" />
              <div>
                <h2 className="text-xl font-semibold text-black">{property.address}</h2>
                <p className="text-gray-600">{property.city}, {property.zip_code}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
