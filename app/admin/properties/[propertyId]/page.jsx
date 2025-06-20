'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import AddUnitPopup from '../../components/AddUnitPopup';
import EditPropertyPopup from '../../components/EditPropertyPopup';
import Link from 'next/link';

export default function PropertyDetailPage() {
  const { propertyId } = useParams();
  const router = useRouter();
  const [units, setUnits] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showEditPropertyPopup, setShowEditPropertyPopup] = useState(false);
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminId, setAdminId] = useState(null);

  useEffect(() => {
    const cookie = Cookies.get('user');
    if (cookie) {
      const user = JSON.parse(cookie);
      setAdminId(user?.user?.user_id);
    }
  }, []);

  useEffect(() => {
    if (propertyId && adminId) {
      fetchProperty();
      fetchUnits();
    }
  }, [propertyId, adminId]);

  const fetchProperty = async () => {
    try {
      // First get all properties for this admin
      const propertiesRes = await fetch(`http://127.0.0.1:5556/properties/admin/${adminId}`);
      if (!propertiesRes.ok) throw new Error('Failed to fetch admin properties');
      const properties = await propertiesRes.json();

      // Find the specific property we want
      const foundProperty = properties.find(p => p.id === parseInt(propertyId));
      
      if (!foundProperty) {
        throw new Error('Property not found for this admin');
      }

      setProperty(foundProperty);
    } catch (error) {
      console.error('Error fetching property:', error);
      setProperty(null);
    }
  };

  const fetchUnits = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5556/units/property/${propertyId}`);
      if (!res.ok) throw new Error('Failed to fetch units');
      const data = await res.json();
      setUnits(data);
    } catch (error) {
      console.error('Error fetching units:', error);
    } finally {
      setIsLoading(false);
    }
  };

const handleDeleteProperty = async () => {
  if (!confirm('Are you sure you want to delete this property? This will PERMANENTLY delete the property and ALL its units.')) {
    return;
  }

  try {
    const cookie = Cookies.get('user');
    const user = JSON.parse(cookie)?.user;
    if (!user?.user_id) throw new Error("Unauthorized");

    const res = await fetch(`http://127.0.0.1:5556/properties/${propertyId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to delete property");
    }

    router.push('/admin/properties');
  } catch (error) {
    console.error("Error deleting property:", error.message);
    alert("Failed to delete property: " + error.message);
  }
};

  const handleUpdateProperty = async (updatedData) => {
    try {
      const cookie = Cookies.get('user');
      const user = JSON.parse(cookie)?.user;
      if (!user?.user_id) throw new Error("Unauthorized");

      const res = await fetch(`http://127.0.0.1:5556/properties/${propertyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(updatedData)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update property");
      }

      const data = await res.json();
      setProperty(data);
      setShowEditPropertyPopup(false);
      alert("Property updated successfully!");
      fetchProperty(); // Refresh the property data
    } catch (error) {
      console.error("Error updating property:", error.message);
      alert("Failed to update property: " + error.message);
    }
  };

  if (!property) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Property not found</h1>
          <button 
            className="btn btn-neutral mt-4"
            onClick={() => router.push('/admin/properties')}
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-8 text-black">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{property.address}</h1>
          <p className="text-gray-600">
            {property.city}, {property.state} {property.zip_code}
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            className="btn btn-outline rounded-md"
            onClick={() => setShowEditPropertyPopup(true)}
          >
            Edit Property
          </button>
          <button 
            className="btn btn-error text-white rounded-md"
            onClick={handleDeleteProperty}
          >
            Delete Property
          </button>
          <button 
            className="btn btn-neutral rounded-md" 
            onClick={() => setShowPopup(true)}
          >
            + Add Unit
          </button>
        </div>
      </div>

      {showPopup && (
        <AddUnitPopup
          propertyId={propertyId}
          onClose={() => setShowPopup(false)}
          onUnitAdded={fetchUnits}
        />
      )}

      {showEditPropertyPopup && (
        <EditPropertyPopup
          property={property}
          onClose={() => setShowEditPropertyPopup(false)}
          onSave={handleUpdateProperty}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.length > 0 ? (
          units.map((unit) => (
            <Link 
              key={unit.unit_id} 
              href={`/units/${unit.unit_id}`}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {unit.unit_name?.charAt(0)?.toUpperCase() + unit.unit_name?.slice(1)?.toLowerCase() || 'Unnamed Unit'}
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Unit Number:</span>
                      <span className="font-medium">#{unit.unit_number}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className={`font-medium ${
                        unit.status === 'vacant' ? 'text-green-600' : 
                        unit.status === 'occupied' ? 'text-red-600' : 
                        'text-yellow-600'
                      }`}>
                        {unit.status?.charAt(0)?.toUpperCase() + unit.status?.slice(1) || 'Unknown'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type:</span>
                      <span className="font-medium">
                        {unit.type?.split(' ')
                          ?.map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          ?.join(' ') || 'Unknown'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-500">Monthly Rent:</span>
                      <span className="text-green-600 font-semibold">
                        Ksh {unit.monthly_rent?.toLocaleString() || '0'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-500">Deposit:</span>
                      <span className="text-yellow-600 font-semibold">
                        Ksh {unit.deposit_amount?.toLocaleString() || '0'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500">No units found for this property</div>
            <button 
              className="btn btn-neutral mt-4"
              onClick={() => setShowPopup(true)}
            >
              Add Your First Unit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}