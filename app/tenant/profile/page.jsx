'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PhoneInput from 'react-phone-input-2';

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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
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

    if (nationalPhone.length > 12) {
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
    
    if (!validatePhoneNumbers()) {
      return;
    }

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

      setSuccess('✅ Profile updated successfully!');
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

      setPasswordSuccess('✅ Password changed successfully!');
      setPasswordData({ current_password: '', new_password: '' });
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setChanging(false);
    }
  };

  useEffect(() => {
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
        setError(err.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 text-black">
      <h1 className="text-4xl font-bold mb-6 text-center">👤 Profile</h1>

      {error && <div className="alert alert-error mb-4">{error}</div>}
      {success && <div className="alert alert-success mb-4">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            name="first_name"
            type="text"
            value={formData.first_name}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="First Name"
            required
          />
          <input
            name="last_name"
            type="text"
            value={formData.last_name}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Last Name"
            required
          />
        </div>

        <input
          type="email"
          name="email"
          value={formData.email}
          className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
          readOnly
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium">Phone Number</label>
          <PhoneInput
            country={'ke'}
            value={formData.phone}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, phone: value }));
              setFieldErrors(prev => ({ ...prev, phone: '' }));
            }}
            inputProps={{
              name: 'phone',
              required: true,
              className: 'w-full'
            }}
            containerStyle={{ width: '100%' }}
            inputStyle={{
              width: '100%',
              borderRadius: '0.5rem',
              height: '3rem',
              paddingLeft: '60px'
            }}
            buttonStyle={{
              height: '3rem',
              borderTopLeftRadius: '0.5rem',
              borderBottomLeftRadius: '0.5rem',
              borderRight: '1px solid #ccc',
              backgroundColor: '#f9f9f9',
              padding: '0 5px 0 8px'
            }}
            dropdownStyle={{
              marginTop: '4px'
            }}
          />
          {fieldErrors.phone && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>
          )}
        </div>

        <input
          name="emergency_contact_name"
          type="text"
          value={formData.emergency_contact_name}
          onChange={handleChange}
          className="input input-bordered w-full"
          placeholder="Emergency Contact Name"
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium">Emergency Contact Number</label>
          <PhoneInput
            country={'ke'}
            value={formData.emergency_contact_number}
            onChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                emergency_contact_number: value
              }));
              setFieldErrors(prev => ({ ...prev, emergency_contact_number: '' }));
            }}
            inputProps={{
              name: 'emergency_contact_number',
              className: 'w-full'
            }}
            containerStyle={{ width: '100%' }}
            inputStyle={{
              width: '100%',
              borderRadius: '0.5rem',
              height: '3rem',
              paddingLeft: '60px'
            }}
            buttonStyle={{
              height: '3rem',
              borderTopLeftRadius: '0.5rem',
              borderBottomLeftRadius: '0.5rem',
              borderRight: '1px solid #ccc',
              backgroundColor: '#f9f9f9',
              padding: '0 5px 0 8px'
            }}
            dropdownStyle={{
              marginTop: '4px'
            }}
          />
          {fieldErrors.emergency_contact_number && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.emergency_contact_number}</p>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Update Profile'}
        </button>
      </form>

      <hr className="my-8" />
      <h2 className="text-2xl font-semibold mb-4">🔐 Change Password</h2>

      {passwordError && <div className="alert alert-error mb-4">{passwordError}</div>}
      {passwordSuccess && <div className="alert alert-success mb-4">{passwordSuccess}</div>}

      <form onSubmit={handlePasswordChange} className="space-y-4">
       <div className="relative">
  <input
    type={showCurrentPassword ? 'text' : 'password'}
    name="current_password"
    placeholder="Current Password"
    value={passwordData.current_password}
    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
    className="input input-bordered w-full pr-10"
    required
  />
  <button
    type="button"
    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none bg-transparent p-0 border-none"
  >
    <i className={`bi ${showCurrentPassword ? 'bi-eye-slash' : 'bi-eye'} text-base`}></i>
  </button>
</div>

<div className="relative">
  <input
    type={showNewPassword ? 'text' : 'password'}
    name="new_password"
    placeholder="New Password"
    value={passwordData.new_password}
    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
    className="input input-bordered w-full pr-10"
    required
  />
  <button
    type="button"
    onClick={() => setShowNewPassword(!showNewPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none bg-transparent p-0 border-none"
  >
    <i className={`bi ${showNewPassword ? 'bi-eye-slash' : 'bi-eye'} text-base`}></i>
  </button>
</div>

        <button
          type="submit"
          className="btn btn-secondary w-full"
          disabled={changing}
        >
          {changing ? 'Updating Password...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}