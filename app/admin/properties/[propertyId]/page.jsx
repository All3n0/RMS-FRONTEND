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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminId, setAdminId] = useState(null);

  useEffect(() => {
    const cookie = Cookies.get('user');
    console.log(cookie)
    if (cookie) {
      const user = JSON.parse(cookie);
      setAdminId(user?.user_id);
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
      const propertiesRes = await fetch(`http://127.0.0.1:5556/properties/admin/${adminId}`);
      if (!propertiesRes.ok) throw new Error('Failed to fetch admin properties');
      const properties = await propertiesRes.json();

      const foundProperty = properties.find(p => p.id === parseInt(propertyId));
      if (!foundProperty) throw new Error('Property not found for this admin');

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

// const handleDeleteProperty = async () => {
//   if (
//     !confirm(
//       'Are you sure you want to delete this property? This will PERMANENTLY delete the property and ALL its units.'
//     )
//   ) {
//     return;
//   }

//   try {
//     const cookie = Cookies.get('user');
//     const user = JSON.parse(cookie);

//     // Check for user and admin role
//     if (!user?.user_id || user.role !== 'admin') {
//       throw new Error('Only admins can delete properties.');
//     }

//     const res = await fetch(`http://127.0.0.1:5556/properties/${propertyId}`, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//         // You can add custom headers if needed
//         'X-User-ID': user.user_id,
//         'X-User-Role': user.role,
//       },
//     });

//     if (!res.ok) {
//       const err = await res.json();
//       throw new Error(err.error || 'Failed to delete property');
//     }

//     router.push('/admin/properties');
//   } catch (error) {
//     console.error('Error deleting property:', error.message);
//     alert('Failed to delete property: ' + error.message);
//   }
// };



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
      fetchProperty();
    } catch (error) {
      console.error("Error updating property:", error.message);
      alert("Failed to update property: " + error.message);
    }
  };

  if (!property) {
    return (
      <div className="p-4 md:p-6 bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-bold">Property not found</h1>
          <button 
            className="btn btn-neutral mt-4 px-4 py-2 rounded-md"
            onClick={() => router.push('/admin/properties')}
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen space-y-6 md:space-y-8 text-black">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{property.property_name}</h1>
          <p className="text-sm md:text-base text-gray-600">
            {property.city}, {property.state} {property.zip_code}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 md:gap-3">
          <button 
            className="btn btn-outline rounded-md text-sm md:text-base px-3 py-1 md:px-4 md:py-2"
            onClick={() => setShowEditPropertyPopup(true)}
          >
            Edit Property
          </button>
          <button 
            className="btn btn-error text-white rounded-md text-sm md:text-base px-3 py-1 md:px-4 md:py-2"
            onClick={()=> setShowDeleteModal(true)}
          >
            Delete Property
          </button>
          <button 
            className="btn btn-neutral rounded-md text-sm md:text-base px-3 py-1 md:px-4 md:py-2" 
            onClick={() => setShowPopup(true)}
          >
            + Add Unit
          </button>
        </div>
      </div>

      {/* Popups */}
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
      {showDeleteModal && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md border">
      <h3 className="text-xl font-bold mb-4 text-red-600">Delete Property</h3>
      <p className="text-gray-700 mb-4">
        Are you sure you want to delete this property? This will <strong>permanently</strong> delete the property and <strong>all its units</strong>.
      </p>
      <div className="flex justify-end space-x-3">
        <button
          className="btn btn-outline rounded-md"
          onClick={() => setShowDeleteModal(false)}
        >
          Cancel
        </button>
        <button
          className="btn btn-error text-white rounded-md"
          onClick={async () => {
            try {
              const cookie = Cookies.get('user');
              const user = JSON.parse(cookie);

              if (!user?.user_id || user.role !== 'admin') {
                throw new Error('Only admins can delete properties.');
              }

              const res = await fetch(`http://127.0.0.1:5556/properties/${propertyId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'X-User-ID': user.user_id,
                  'X-User-Role': user.role,
                },
              });

              if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to delete property');
              }

              setShowDeleteModal(false);
              router.push('/admin/properties');
            } catch (error) {
              console.error('Error deleting property:', error.message);
              alert('Failed to delete property: ' + error.message);
              setShowDeleteModal(false);
            }
          }}
        >
          Confirm Delete
        </button>
      </div>
    </div>
  </div>
)}

      {/* Units Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {units.length > 0 ? (
          units.map((unit) => (
            <Link 
              key={unit.unit_id} 
              href={`/admin/properties/${propertyId}/${unit.unit_id}`}
              className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm md:shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex items-start space-x-3 md:space-x-4">
                <div className="bg-blue-50 p-2 md:p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                
                <div className="flex-1">
                  <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-1 md:mb-2">
                    {unit.unit_name?.charAt(0)?.toUpperCase() + unit.unit_name?.slice(1)?.toLowerCase() || 'Unnamed Unit'}
                  </h2>
                  
                  <div className="space-y-2 md:space-y-3 text-sm md:text-base">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Unit :</span>
                      <span className="font-medium">{unit.unit_number}</span>
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
                      <span className="text-gray-500">Rent:</span>
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
          <div className="col-span-full text-center py-8 md:py-12">
            <div className="text-gray-500 text-sm md:text-base">No units found for this property</div>
            <button 
              className="btn btn-neutral mt-3 md:mt-4 px-3 py-1 md:px-4 md:py-2 text-sm md:text-base"
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