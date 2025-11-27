'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { BuildingOfficeIcon, HomeModernIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import AddPropertyPopup from '../components/AddPropertyPopup';
import { ArrowRightIcon, MapPinIcon, PlusIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PropertiesPage() {
  const [showForm, setShowForm] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
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
              setTimeout(() => setIsVisible(true), 300);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
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
            <HomeModernIcon className="h-8 w-8 md:h-10 md:w-10 text-white" />
          </motion.div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">Loading Properties</h3>
          <p className="text-gray-600 text-sm md:text-base">Preparing your property portfolio...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-40"></div>
      </div>

      <div className="space-y-6 sm:space-y-8 sm:space-y-10 pt-4 sm:pt-6 px-4 sm:px-6 pb-6 sm:pb-8 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center space-y-2 sm:space-y-3"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center justify-center gap-2 sm:gap-3 mb-1 sm:mb-2"
          >
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-2 sm:p-3 bg-blue-100 rounded-xl sm:rounded-2xl"
            >
              <HomeModernIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Properties
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm sm:text-base md:text-lg text-gray-500 font-medium max-w-md mx-auto leading-relaxed"
          >
            These are your properties
          </motion.p>
        </motion.div>

        {/* Add Property Button */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <motion.button 
            onClick={() => setShowForm(true)} 
            whileHover={{ scale: isMobile ? 1 : 1.05, y: isMobile ? 0 : -2 }}
            whileTap={{ scale: 0.95 }}
            className="group relative bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2.5 sm:py-3 md:py-4 px-6 sm:px-8 md:px-10 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center max-w-sm"
          >
            <motion.div 
              whileHover={{ rotate: 90 }}
              className="p-1 bg-white/20 rounded sm:rounded-lg"
            >
              <PlusIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
            </motion.div>
            Add New Property
            <div className="absolute inset-0 bg-white/10 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        </motion.div>

        {/* Add Property Form Popup */}
        <AnimatePresence>
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
        </AnimatePresence>

        {/* Properties Grid or Empty State */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  variants={itemVariants}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/admin/properties/${property.id}`}>
                    <motion.div 
                      whileHover={{ 
                        scale: isMobile ? 1 : 1.05, 
                        y: isMobile ? 0 : -5 
                      }}
                      className="group bg-white rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 p-4 sm:p-6 cursor-pointer border border-gray-100 hover:border-blue-100 relative overflow-hidden"
                    >
                      {/* Gradient accent */}
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600" 
                      />
                      
                      {/* Property icon and status */}
                      <div className="flex items-start justify-between mb-3 sm:mb-4 md:mb-5">
                        <motion.div 
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className="p-2 sm:p-3 bg-blue-50 rounded-xl sm:rounded-2xl group-hover:bg-blue-100 transition-colors duration-300"
                        >
                          <HomeModernIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-blue-600" />
                        </motion.div>
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                          className={`px-2 sm:px-3 py-1 rounded-full border text-xs sm:text-sm ${
                            property.total_units > 0 && property.occupied_units === property.total_units 
                              ? 'bg-emerald-50 border-emerald-200' 
                              : property.occupied_units > 0 
                                ? 'bg-blue-50 border-blue-200'
                                : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <span className={`font-medium flex items-center gap-1 ${
                            property.total_units > 0 && property.occupied_units === property.total_units 
                              ? 'text-emerald-600' 
                              : property.occupied_units > 0 
                                ? 'text-blue-600'
                                : 'text-gray-600'
                          }`}>
                            <motion.div 
                              animate={{ 
                                scale: [1, 1.2, 1],
                                opacity: [0.7, 1, 0.7]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                                property.total_units > 0 && property.occupied_units === property.total_units 
                                  ? 'bg-emerald-400' 
                                  : property.occupied_units > 0 
                                    ? 'bg-blue-400'
                                    : 'bg-gray-400'
                              }`}
                            ></motion.div>
                            <span className="hidden xs:inline">
                              {property.total_units === 0 ? 'No Units' : 
                              property.occupied_units === property.total_units ? 'Fully Occupied' :
                              `${property.occupied_units}/${property.total_units} Occupied`}
                            </span>
                            <span className="xs:hidden">
                              {property.total_units === 0 ? 'No Units' : 
                              property.occupied_units === property.total_units ? 'Full' :
                              `${property.occupied_units}/${property.total_units}`}
                            </span>
                          </span>
                        </motion.div>
                      </div>

                      {/* Property details */}
                      <div className="space-y-3 sm:space-y-4">
                        <motion.h2 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.4 }}
                          className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 leading-tight line-clamp-2"
                        >
                          {property.property_name}
                        </motion.h2>
                        
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.5 }}
                          className="flex items-center gap-1.5 sm:gap-2 text-gray-500"
                        >
                          <MapPinIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-700 flex-shrink-0" />
                          <span className="font-medium text-sm sm:text-base truncate">
                            {property.city}, {property.zip_code}
                          </span>
                        </motion.div>

                        {/* Stats row */}
                        <div className="flex gap-2 sm:gap-3 md:gap-4 pt-2 sm:pt-3 border-t border-gray-100">
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.6 }}
                            className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500"
                          >
                            <BuildingOfficeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
                            <span>{property.total_units || 0} Units</span>
                          </motion.div>
                          <motion.div 
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.7 }}
                            className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500"
                          >
                            <UserGroupIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
                            <span>{property.occupied_units || 0} Occupied</span>
                          </motion.div>
                        </div>

                        {/* Occupancy rate */}
                        {property.total_units > 0 && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.8 }}
                            className="pt-1 sm:pt-2"
                          >
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Occupancy Rate</span>
                              <span>{Math.round((property.occupied_units / property.total_units) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(property.occupied_units / property.total_units) * 100}%` }}
                                transition={{ delay: index * 0.1 + 1, duration: 1 }}
                                className="h-1.5 sm:h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                              ></motion.div>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl" />
                      
                      {/* View details hint */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        className="absolute bottom-3 sm:bottom-4 md:bottom-6 right-3 sm:right-4 md:right-6 transform translate-y-1 sm:translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                      >
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          className="p-1.5 sm:p-2 bg-blue-500 text-white rounded-full"
                        >
                          <ArrowRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-sm p-6 sm:p-8 md:p-12 lg:p-16 text-center border border-gray-100"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl sm:rounded-3xl flex items-center justify-center"
              >
                <HomeModernIcon className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-gray-400" />
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4"
              >
                No Properties Yet
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-500 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 md:mb-8 max-w-md mx-auto leading-relaxed"
              >
                Start building your rental portfolio by adding your first property
              </motion.p>
              <motion.button 
                onClick={() => setShowForm(true)}
                whileHover={{ scale: isMobile ? 1 : 1.05, y: isMobile ? 0 : -2 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2.5 sm:py-3 md:py-4 px-6 sm:px-8 md:px-10 lg:px-12 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center max-w-sm mx-auto"
              >
                <motion.div 
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </motion.div>
                Add Your First Property
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                </motion.div>
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}