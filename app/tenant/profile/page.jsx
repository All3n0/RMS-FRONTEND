'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    emergency_contact_name: '',
    emergency_contact_number: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [changing, setChanging] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    phone: '',
    emergency_contact_number: ''
  });

  const [requests, setRequests] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  const getNationalNumber = (phone) => {
    return phone ? phone.replace(/^\+\d{1,4}/, '') : '';
  };

  const validatePhoneNumbers = () => {
    const nationalPhone = getNationalNumber(formData.phone);
    const nationalEmergency = getNationalNumber(formData.emergency_contact_number);
    
    let isValid = true;
    const newErrors = {
      phone: '',
      emergency_contact_number: ''
    };

    if (nationalPhone && nationalPhone.length > 12) {
      newErrors.phone = 'Phone number must be no more than 9 digits after country code';
      isValid = false;
    }

    if (formData.emergency_contact_number && nationalEmergency.length > 12) {
      newErrors.emergency_contact_number = 'Emergency number must be no more than 9 digits after country code';
      isValid = false;
    }

    setFieldErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePhoneNumbers()) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('http://localhost:5556/tenant-profile/update', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Update failed');
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setChanging(true);
    setPasswordError('');
    setPasswordSuccess('');

    try {
      const res = await fetch('http://localhost:5556/tenant-profile/change-password', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordData)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Password change failed');
      setPasswordSuccess('Password changed successfully!');
      setPasswordData({ current_password: '', new_password: '' });
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setChanging(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:5556/tenant-profile', {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          if (res.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to load profile');
        }

        const data = await res.json();
        setFormData(data);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    const fetchRequests = async () => {
      try {
        const res = await fetch('http://localhost:5556/tenant/maintenance', {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch maintenance requests');
        const data = await res.json();
        setRequests(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchProfile();
    fetchRequests();
  }, [router]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (loading) return (
    <div className="p-8 text-center">
      <div className="animate-pulse flex flex-col items-center space-y-4">
        <div className="rounded-full bg-gray-300 h-16 w-16 md:h-20 md:w-20"></div>
        <div className="h-4 bg-gray-300 rounded w-48"></div>
        <div className="h-4 bg-gray-300 rounded w-32"></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-10 text-black">
      {/* Header with animation */}
      <div className={`text-center mb-8 transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <h1 className="text-2xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Profile Settings
        </h1>
        <p className="text-center mb-4 md:mb-6 text-base md:text-lg text-gray-600">
          Manage your personal information and preferences
        </p>
      </div>

      {/* Profile Information Card */}
      <div className={`card bg-white shadow-md md:shadow-lg rounded-xl p-6 mb-6 transform transition-all duration-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <i className="bi bi-person-circle text-blue-600"></i>
            Personal Information
          </h2>
          {!editing && (
            <button
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
              onClick={() => setEditing(true)}
            >
              <i className="bi bi-pencil-square"></i> Edit Profile
            </button>
          )}
        </div>

        {!editing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">First Name</p>
                <p className="font-semibold text-gray-800">{formData.first_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Name</p>
                <p className="font-semibold text-gray-800">{formData.last_name}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold text-gray-800">{formData.email}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-semibold text-gray-800">{formData.phone || 'Not provided'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Emergency Contact</p>
              <p className="font-semibold text-gray-800">
                {formData.emergency_contact_name || 'Not provided'}
                {formData.emergency_contact_number && ` (${formData.emergency_contact_number})`}
              </p>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4 animate-fade-in">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4 animate-fade-in">
                <p className="text-green-700 text-sm font-medium">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">First Name</label>
                  <input 
                    name="first_name" 
                    type="text" 
                    value={formData.first_name} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="First Name" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Last Name</label>
                  <input 
                    name="last_name" 
                    type="text" 
                    value={formData.last_name} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="Last Name" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  readOnly 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed" 
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                <PhoneInput
                  country={'ke'}
                  value={formData.phone}
                  onChange={(value) => {
                    setFormData((prev) => ({ ...prev, phone: value }));
                    setFieldErrors((prev) => ({ ...prev, phone: '' }));
                  }}
                  inputProps={{
                    required: false,
                  }}
                  inputStyle={{ 
                    width: '100%', 
                    borderRadius: '0.75rem', 
                    height: '3rem', 
                    paddingLeft: '60px',
                    border: '1px solid #d1d5db',
                    fontSize: '16px'
                  }}
                  buttonStyle={{ 
                    height: '3rem', 
                    borderRadius: '0.75rem 0 0 0.75rem', 
                    borderRight: '1px solid #d1d5db', 
                    backgroundColor: '#f9fafb',
                    padding: '0 8px'
                  }}
                  dropdownStyle={{ marginTop: '4px', borderRadius: '0.75rem' }}
                />
                {fieldErrors.phone && <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Emergency Contact Name</label>
                <input 
                  name="emergency_contact_name" 
                  type="text" 
                  value={formData.emergency_contact_name} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="Emergency Contact Name" 
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Emergency Contact Number</label>
                <PhoneInput
                  country={'ke'}
                  value={formData.emergency_contact_number}
                  onChange={(value) => {
                    setFormData((prev) => ({ ...prev, emergency_contact_number: value }));
                    setFieldErrors((prev) => ({ ...prev, emergency_contact_number: '' }));
                  }}
                  inputProps={{
                    required: false,
                  }}
                  inputStyle={{ 
                    width: '100%', 
                    borderRadius: '0.75rem', 
                    height: '3rem', 
                    paddingLeft: '60px',
                    border: '1px solid #d1d5db',
                    fontSize: '16px'
                  }}
                  buttonStyle={{ 
                    height: '3rem', 
                    borderRadius: '0.75rem 0 0 0.75rem', 
                    borderRight: '1px solid #d1d5db', 
                    backgroundColor: '#f9fafb',
                    padding: '0 8px'
                  }}
                />
                {fieldErrors.emergency_contact_number && <p className="text-red-500 text-xs mt-1">{fieldErrors.emergency_contact_number}</p>}
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setEditing(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={saving}
                >
                  {saving ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </div>
                  ) : (
                    'Update Profile'
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Password Change Card */}
      <div className={`card bg-white shadow-md md:shadow-lg rounded-xl p-6 mb-6 transform transition-all duration-500 delay-100 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <i className="bi bi-shield-lock text-blue-600"></i>
          Change Password
        </h2>

        {passwordError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4 animate-fade-in">
            <p className="text-red-700 text-sm font-medium">{passwordError}</p>
          </div>
        )}
        {passwordSuccess && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4 animate-fade-in">
            <p className="text-green-700 text-sm font-medium">{passwordSuccess}</p>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Current Password</label>
            <div className="relative">
              <input 
                type={showCurrentPassword ? 'text' : 'password'} 
                name="current_password" 
                value={passwordData.current_password} 
                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })} 
                placeholder="Enter current password" 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white pr-12"
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowCurrentPassword(!showCurrentPassword)} 
                className="bg-transparent absolute right-4 top-1/3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                style={{ right: '12px' }}
              >
                <i className={`bi ${showCurrentPassword ? 'bi-eye-slash' : 'bi-eye'} text-lg`}></i>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">New Password</label>
            <div className="relative">
              <input 
                type={showNewPassword ? 'text' : 'password'} 
                name="new_password" 
                value={passwordData.new_password} 
                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })} 
                placeholder="Enter new password" 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white pr-12"
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowNewPassword(!showNewPassword)} 
                className="bg-transparent absolute right-4 top-1/3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                style={{ right: '12px' }}
              >
                <i className={`bi ${showNewPassword ? 'bi-eye-slash' : 'bi-eye'} text-lg`}></i>
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={changing}
          >
            {changing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Updating...
              </div>
            ) : (
              'Change Password'
            )}
          </button>
        </form>
      </div>

      {/* Maintenance Requests Card */}
      {!editing && (
        <div className={`card bg-white shadow-md md:shadow-lg rounded-xl p-6 transform transition-all duration-500 delay-200 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <i className="bi bi-tools text-orange-600"></i>
              Maintenance Requests
            </h2>
            {!showRequestForm && (
              <button 
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                onClick={() => setShowRequestForm(true)}
              >
                <i className="bi bi-plus-circle"></i> New Request
              </button>
            )}
          </div>

          {requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map((req, index) => (
                <div 
                  key={req.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <p className="font-semibold text-gray-800 mb-2">{req.request_description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      req.status === 'completed' ? 'bg-green-100 text-green-800' :
                      req.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      <i className={`bi ${
                        req.status === 'completed' ? 'bi-check-circle-fill' :
                        req.status === 'in_progress' ? 'bi-clock-fill' :
                        req.status === 'pending' ? 'bi-hourglass-split' :
                        'bi-question-circle-fill'
                      }`}></i>
                      {req.status}
                    </span>
                    <span className="text-gray-500">
                      {new Date(req.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <i className="bi bi-inbox text-4xl mb-2 opacity-50"></i>
              <p>No maintenance requests yet</p>
            </div>
          )}

          {showRequestForm && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-scale-in">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const desc = e.target.description.value.trim();
                  if (!desc) return;

                  try {
                    const res = await fetch('http://localhost:5556/maintenance-requests', {
                      method: 'POST',
                      credentials: 'include',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ request_description: desc }),
                    });

                    const result = await res.json();
                    if (!res.ok) throw new Error(result.error || 'Failed');

                    const refreshed = await fetch('http://localhost:5556/maintenance-requests', {
                      method: 'GET',
                      credentials: 'include',
                    });
                    const newData = await refreshed.json();
                    setRequests(newData);
                    setShowRequestForm(false);
                  } catch (err) {
                    alert('Failed to submit request');
                    console.error(err);
                  }
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Request Description</label>
                  <textarea 
                    name="description" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white resize-none"
                    placeholder="Describe the issue in detail..." 
                    rows={4}
                    required 
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowRequestForm(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}