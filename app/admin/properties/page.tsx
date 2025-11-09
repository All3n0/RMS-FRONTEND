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
  const [loading, setLoading] = useState(true);

  // Get admin ID from cookie and fetch properties
  useEffect(() => {
    const cookie = Cookies.get('user');
    if (cookie) {
      try {
        const userData = JSON.parse(cookie);
        const id = userData?.user_id;
        setAdminId(id);

        if (id) {
          fetch(`http://127.0.0.1:5556/properties/admin/${id}`)
            .then((res) => res.json())
            .then((data) => {
              setProperties(data);
              setLoading(false);
            })
            .catch(() => setLoading(false));
        }
      } catch (error) {
        console.error('Failed to parse user cookie:', error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-blue-600">Properties</h1>
        <p className="text-gray-600 mt-1">Manage your rental properties and details</p>
      </div>

      {/* Add Property Button */}
      <div>
        <button 
          onClick={() => setShowForm(true)} 
          className="btn btn-outline border-blue-600 text-blue-600 py-2 rounded-md px-6"
        >
          + Add Property
        </button>
      </div>

      {/* Add Property Form Popup */}
      {showForm && (
        <AddPropertyPopup
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            // Re-fetch properties
            fetch(`http://127.0.0.1:5556/properties/admin/${adminId}`)
              .then((res) => res.json())
              .then((data) => setProperties(data));
          }}
        />
      )}

      {/* Properties Grid or Empty State */}
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Link key={property.id} href={`/admin/properties/${property.id}`}>
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 flex items-center gap-4 cursor-pointer border-l-8 border-blue-600">
                <HomeModernIcon className="h-10 w-10 text-black bg-white p-1 rounded" />
                <div>
                  <h2 className="text-xl font-semibold text-black">{property.property_name}</h2>
                  <p className="text-gray-600">{property.city}, {property.zip_code}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <HomeModernIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Properties Yet</h2>
          <p className="text-gray-500 mb-6">Get started by adding your first property</p>
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-neutral px-8 py-3 text-lg"
          >
            + Add Your First Property
          </button>
        </div>
      )}
    </div>
  );
}