'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import AddUnitPopup from '../../components/AddUnitPopup';
import EditPropertyPopup from '../../components/EditPropertyPopup';
import Link from 'next/link';
import { 
  BuildingOfficeIcon, 
  HomeModernIcon, 
  MapPinIcon, 
  PlusIcon, 
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and on resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse animation-delay-4000"></div>
        </div>
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20 relative z-10 mx-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-6 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center"
          >
            <BuildingOfficeIcon className="h-8 w-8 md:h-10 md:w-10 text-white" />
          </motion.div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">Loading Property</h3>
          <p className="text-gray-600 text-sm md:text-base">Preparing your property details...</p>
        </motion.div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse animation-delay-4000"></div>
        </div>
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20 relative z-10 mx-4 max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-red-100 rounded-2xl flex items-center justify-center"
          >
            <HomeModernIcon className="h-8 w-8 sm:h-10 sm:w-10 text-red-500" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3"
          >
            Property Not Found
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 text-sm sm:text-base mb-4 sm:mb-6"
          >
            The property you're looking for doesn't exist or you don't have access.
          </motion.p>
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: isMobile ? 1 : 1.05, y: isMobile ? 0 : -2 }}
            whileTap={{ scale: 0.95 }}
            className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2 text-sm sm:text-base"
            onClick={() => router.push('/admin/properties')}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Properties
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Calculate property stats
  const totalUnits = units.length;
  const occupiedUnits = units.filter(unit => unit.status === 'occupied').length;
  const vacantUnits = units.filter(unit => unit.status === 'vacant').length;
  const totalRent = units.reduce((sum, unit) => sum + (unit.monthly_rent || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-40"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 pt-4 sm:pt-6 px-4 sm:px-6 relative z-10">
        {/* Header Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6"
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <motion.button 
              variants={itemVariants}
              whileHover={{ scale: isMobile ? 1 : 1.05, x: isMobile ? 0 : -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/admin/properties')}
              className="group p-2 sm:p-3 bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200 mt-1 flex-shrink-0"
            >
              <ArrowLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
            </motion.button>
            
            <div className="space-y-2 sm:space-y-3 flex-1 min-w-0">
              <motion.div 
                variants={itemVariants}
                className="flex items-center gap-2 sm:gap-3"
              >
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="p-2 sm:p-3 bg-blue-100 rounded-xl sm:rounded-2xl flex-shrink-0"
                >
                  <BuildingOfficeIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </motion.div>
                <div className="min-w-0 flex-1">
                  <motion.h1 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 truncate pt-1"
                  >
                    {property.property_name}
                  </motion.h1>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-1.5 sm:gap-2 text-gray-500 mt-1"
                  >
                    <MapPinIcon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base truncate">
                      {property.address}, {property.city}, {property.state} {property.zip_code}
                    </span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Property Stats */}
              <motion.div 
                variants={containerVariants}
                className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 pt-1 sm:pt-2"
              >
                {[
                  { value: totalUnits, label: 'Total Units', color: 'gray' },
                  { value: occupiedUnits, label: 'Occupied', color: 'emerald' },
                  { value: vacantUnits, label: 'Vacant', color: 'blue' },
                  { value: `Ksh ${totalRent.toLocaleString()}`, label: 'Monthly Rent', color: 'purple' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    variants={itemVariants}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    whileHover={{ scale: isMobile ? 1 : 1.05, y: isMobile ? 0 : -2 }}
                    className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 min-w-[100px] sm:min-w-[120px] md:min-w-[140px] flex-1 sm:flex-none"
                  >
                    <motion.div 
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.7, type: "spring" }}
                      className={`text-lg sm:text-xl md:text-2xl font-bold ${
                        stat.color === 'emerald' ? 'text-emerald-600' :
                        stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'purple' ? 'text-purple-600' :
                        'text-gray-800'
                      }`}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-xs sm:text-sm text-gray-500">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <motion.div 
            variants={containerVariants}
            className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start"
          >
            {[
              { 
                icon: <PencilIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />, 
                label: 'Edit Property', 
                onClick: () => setShowEditPropertyPopup(true),
                style: 'bg-white text-gray-700 hover:text-blue-600 border border-gray-200 hover:border-blue-200'
              },
              { 
                icon: <TrashIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />, 
                label: 'Delete Property', 
                onClick: () => setShowDeleteModal(true),
                style: 'bg-white text-gray-700 hover:text-red-600 border border-gray-200 hover:border-red-200'
              },
              { 
                icon: <PlusIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:h-5 sm:w-5" />, 
                label: 'Add Unit', 
                onClick: () => setShowPopup(true),
                style: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
              }
            ].map((button, index) => (
              <motion.button
                key={button.label}
                variants={itemVariants}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ scale: isMobile ? 1 : 1.05, y: isMobile ? 0 : -2 }}
                whileTap={{ scale: 0.95 }}
                className={`py-2 sm:py-3 px-3 sm:px-4 md:px-6 rounded-xl sm:rounded-2xl font-semibold shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm flex-1 sm:flex-none justify-center min-w-[120px] ${button.style}`}
                onClick={button.onClick}
              >
                {button.icon}
                <span className="truncate">{button.label}</span>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Popups */}
        <AnimatePresence>
          {showPopup && (
            <AddUnitPopup
              propertyId={propertyId}
              onClose={() => setShowPopup(false)}
              onUnitAdded={fetchUnits}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showEditPropertyPopup && (
            <EditPropertyPopup
              property={property}
              onClose={() => setShowEditPropertyPopup(false)}
              onSave={handleUpdateProperty}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showDeleteModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 sm:p-6"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full border border-gray-100 mx-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-red-100 rounded-2xl flex items-center justify-center"
                >
                  <TrashIcon className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
                </motion.div>
                <motion.h3 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-2 sm:mb-3"
                >
                  Delete Property
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-600 text-center text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed"
                >
                  This will <strong className="text-red-600">permanently delete</strong> the property and <strong className="text-red-600">all its units</strong>. This action cannot be undone.
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-2 sm:gap-3"
                >
                  <motion.button
                    whileHover={{ scale: isMobile ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 text-sm sm:text-base"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: isMobile ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
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
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Units Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 sm:space-y-6 px-4 sm:px-0"
        >
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Units</h2>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-gray-500"
            >
              {totalUnits} unit{totalUnits !== 1 ? 's' : ''} total
            </motion.div>
          </motion.div>

          {/* Units Grid */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
          >
            {units.length > 0 ? (
              units.map((unit, index) => (
                <motion.div
                  key={unit.unit_id}
                  variants={itemVariants}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    href={`/admin/properties/${propertyId}/${unit.unit_id}`}
                    className="group block"
                  >
                    <motion.div 
                      whileHover={{ 
                        scale: isMobile ? 1 : 1.05, 
                        y: isMobile ? 0 : -5 
                      }}
                      className="bg-white rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 p-4 sm:p-6 cursor-pointer border border-gray-100 hover:border-blue-100 relative overflow-hidden"
                    >
                      {/* Status indicator bar */}
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                        className={`absolute top-0 left-0 w-full h-1.5 sm:h-2 ${
                          unit.status === 'occupied' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                          unit.status === 'vacant' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                          'bg-gradient-to-r from-amber-500 to-amber-600'
                        }`} 
                      />
                      
                      <div className="space-y-3 sm:space-y-4">
                        {/* Unit header */}
                        <div className="flex items-start justify-between">
                          <motion.div 
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className="p-2 sm:p-3 bg-blue-50 rounded-xl sm:rounded-2xl group-hover:bg-blue-100 transition-colors duration-300"
                          >
                            <HomeModernIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                          </motion.div>
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                            className={`px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                              unit.status === 'occupied' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                              unit.status === 'vacant' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                              'bg-amber-50 text-amber-600 border border-amber-200'
                            }`}
                          >
                            {unit.status?.charAt(0)?.toUpperCase() + unit.status?.slice(1) || 'Unknown'}
                          </motion.div>
                        </div>

                        {/* Unit details */}
                        <div className="space-y-2 sm:space-y-3">
                          <motion.h3 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.4 }}
                            className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1"
                          >
                            {unit.unit_name?.charAt(0)?.toUpperCase() + unit.unit_name?.slice(1)?.toLowerCase() || 'Unnamed Unit'}
                          </motion.h3>
                          
                          <div className="space-y-1.5 sm:space-y-2">
                            {[
                              { label: 'Unit Number', value: unit.unit_number, color: 'gray' },
                              { 
                                label: 'Type', 
                                value: unit.type?.split(' ')
                                  ?.map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                  ?.join(' ') || 'Unknown', 
                                color: 'gray' 
                              },
                              { label: 'Monthly Rent', value: `Ksh ${unit.monthly_rent?.toLocaleString() || '0'}`, color: 'green' },
                              { label: 'Deposit', value: `Ksh ${unit.deposit_amount?.toLocaleString() || '0'}`, color: 'amber' }
                            ].map((detail, detailIndex) => (
                              <motion.div
                                key={detail.label}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 + 0.5 + (detailIndex * 0.1) }}
                                className="flex justify-between items-center py-1.5 sm:py-2 border-b border-gray-100 last:border-b-0"
                              >
                                <span className="text-gray-500 font-medium text-xs sm:text-sm">{detail.label}</span>
                                <span className={`font-semibold text-sm sm:text-base ${
                                  detail.color === 'green' ? 'text-green-600' :
                                  detail.color === 'amber' ? 'text-amber-600' :
                                  'text-gray-800'
                                }`}>
                                  {detail.value}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* View details hint */}
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.9 }}
                          className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100"
                        >
                          <span className="text-xs sm:text-sm text-gray-500">View details</span>
                          <motion.div 
                            whileHover={{ scale: 1.1 }}
                            className="p-1.5 sm:p-2 bg-gray-100 group-hover:bg-blue-500 text-gray-500 group-hover:text-white rounded-full transition-all duration-300"
                          >
                            <EyeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </motion.div>
                        </motion.div>
                      </div>

                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl" />
                    </motion.div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <motion.div 
                variants={itemVariants}
                className="col-span-full"
              >
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl sm:rounded-3xl shadow-sm p-6 sm:p-8 md:p-12 text-center border border-gray-100"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center"
                  >
                    <HomeModernIcon className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                  </motion.div>
                  <motion.h3 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3"
                  >
                    No Units Yet
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-500 text-sm sm:text-base mb-4 sm:mb-6 max-w-md mx-auto leading-relaxed"
                  >
                    Get started by adding the first unit to this property
                  </motion.p>
                  <motion.button 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: isMobile ? 1 : 1.05, y: isMobile ? 0 : -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2 text-sm sm:text-base"
                    onClick={() => setShowPopup(true)}
                  >
                    <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    Add Your First Unit
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}