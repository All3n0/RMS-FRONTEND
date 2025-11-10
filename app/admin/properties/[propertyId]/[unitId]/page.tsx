'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  DollarSign, 
  Home, 
  User, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Clock,
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  EyeIcon
} from 'lucide-react';

import TenantAssignmentModal from '../../../components/TenantAssignmentModal';
import PaymentRecordingModal from '../../../components/PaymentReordingModal';
import LeaseEndModal from '../../../components/LeaseEndModal';
import DeleteUnitModal from '../../../components/DeleteUnitModal';
import EditUnitModal from '../../../components/EditUnitModal';
import { Notification } from '../../../components/Notification';

export default function PropertyUnitPage() {
  const { unitId } = useParams();
  const router = useRouter();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEndLeaseModal, setShowEndLeaseModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditUnitModal, setShowEditUnitModal] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!unitId) return;
    
    const fetchUnitData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5556/units/${unitId}`);
        const unitData = response.data;
        
        // Check if lease has ended automatically
        if (unitData.current_lease && new Date(unitData.current_lease.end_date) <= new Date()) {
          const refreshedResponse = await axios.get(`http://127.0.0.1:5556/units/${unitId}`);
          setUnit(refreshedResponse.data);
          showNotification('Lease has automatically ended', 'info');
        } else {
          setUnit(unitData);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch unit data');
      } finally {
        setLoading(false);
      }
    };

    fetchUnitData();
  }, [unitId]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleAssignTenant = async (tenantData) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:5556/units/${unitId}/assign-tenant`, 
        tenantData
      );
      setUnit(prev => ({
        ...prev,
        current_tenant: response.data.tenant,
        current_lease: response.data.lease,
        unit: { ...prev.unit, status: 'occupied' }
      }));
      setShowAssignModal(false);
      showNotification('Tenant assigned successfully');
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to assign tenant', 'error');
    }
  };

  const handleRecordPayment = async (paymentData) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:5556/units/${unitId}/record-payment`, 
        paymentData
      );
      const newPayment = response.data.payment;
      const status = response.data.payment_status;

      setUnit(prev => ({
        ...prev,
        payment_history: [newPayment, ...prev.payment_history],
        payment_status: status
      }));

      setShowPaymentModal(false);
      showNotification('Payment recorded successfully');
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to record payment', 'error');
    }
  };

  const handleEndLease = async (endDate) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:5556/units/${unitId}/end-lease`, 
        {end_date: endDate}
      );

      setUnit(prev => ({
        ...prev,
        current_lease: null,
        current_tenant: null,
        unit: { ...prev.unit, status: 'vacant' }
      }));

      setShowEndLeaseModal(false);
      showNotification('Lease ended successfully', 'success');
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to end lease', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:5556/units/${unitId}`);
      showNotification('Unit deleted successfully');
      router.push('/admin/properties');
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to delete unit', 'error');
    }
  };

  const handleEditSubmit = async (formData) => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:5556/units/${unitId}`, 
        formData
      );
      setUnit(prev => ({ ...prev, unit: response.data }));
      showNotification('Unit updated successfully');
      setShowEditUnitModal(false);
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to update unit', 'error');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading unit details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="text-center bg-white rounded-3xl shadow-sm p-8 max-w-md w-full border border-gray-100">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
          <XCircle className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">Error Loading Unit</h1>
        <p className="text-gray-500 text-sm mb-6">{error}</p>
        <button 
          className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center gap-2"
          onClick={() => router.push('/admin/properties')}
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Properties
        </button>
      </div>
    </div>
  );

  if (!unit) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="text-center bg-white rounded-3xl shadow-sm p-8 max-w-md w-full border border-gray-100">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
          <Home className="h-8 w-8 text-gray-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">Unit Not Found</h1>
        <p className="text-gray-500 text-sm mb-6">The unit you're looking for doesn't exist.</p>
        <button 
          className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center gap-2"
          onClick={() => router.push('/admin/properties')}
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Properties
        </button>
      </div>
    </div>
  );

  const { unit: unitData, current_tenant, current_lease, payment_history } = unit;
  const leaseEnded = current_lease && new Date(current_lease.end_date) <= new Date();
  const leaseStatus = leaseEnded ? 'ended' : (current_lease?.lease_status || 'inactive');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto space-y-8 pt-6 px-4 sm:px-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            <button 
              onClick={() => router.back()}
              className="group p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-200 mt-1 flex-shrink-0"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
            </button>
            
            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-2xl flex-shrink-0">
                  <Home className="h-8 w-8 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 truncate pt-1">
                    {unitData.unit_name || `Unit ${unitData.unit_number}`}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-500 mt-1">
                    <span className="font-medium text-sm truncate">
                      Unit {unitData.unit_number} • {unitData.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Unit Stats */}
              <div className="flex flex-wrap gap-3 md:gap-4 pt-2">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 min-w-[120px] md:min-w-[140px] flex-1 sm:flex-none">
                  <div className="text-xl md:text-2xl font-bold text-gray-800">{unitData.unit_number}</div>
                  <div className="text-xs text-gray-500">Unit Number</div>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 min-w-[120px] md:min-w-[140px] flex-1 sm:flex-none">
                  <div className={`text-xl md:text-2xl font-bold ${
                    unitData.status === 'occupied' ? 'text-emerald-600' : 'text-blue-600'
                  }`}>
                    {unitData.status?.charAt(0)?.toUpperCase() + unitData.status?.slice(1)}
                  </div>
                  <div className="text-xs text-gray-500">Status</div>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 min-w-[120px] md:min-w-[140px] flex-1 sm:flex-none">
                  <div className="text-xl md:text-2xl font-bold text-green-600">
                    Ksh {unitData.monthly_rent?.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Monthly Rent</div>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 min-w-[120px] md:min-w-[140px] flex-1 sm:flex-none">
                  <div className="text-xl md:text-2xl font-bold text-purple-600">
                    Ksh {unitData.deposit_amount?.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Deposit</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
            {current_lease && leaseStatus === 'active' ? (
              <>
                <button 
                  className="group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2 text-sm"
                  onClick={() => setShowPaymentModal(true)}
                >
                  <DollarSign className="h-4 w-4" />
                  Record Payment
                </button>
                <button 
                  className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2 text-sm"
                  onClick={() => setShowEndLeaseModal(true)}
                >
                  <XCircle className="h-4 w-4" />
                  End Lease
                </button>
              </>
            ) : (
              <button 
                className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2 text-sm"
                onClick={() => setShowAssignModal(true)}
              >
                <PlusIcon className="h-4 w-4" />
                Assign Tenant
              </button>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Unit & Tenant Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Unit Information Card */}
            <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <Home className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Unit Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Unit Number</label>
                  <p className="text-lg font-semibold text-gray-800">{unitData.unit_number}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className={`text-lg font-semibold ${
                    unitData.status === 'occupied' ? 'text-emerald-600' : 'text-blue-600'
                  }`}>
                    {unitData.status?.charAt(0)?.toUpperCase() + unitData.status?.slice(1)}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Monthly Rent</label>
                  <p className="text-lg font-semibold text-green-600">Ksh {unitData.monthly_rent?.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Deposit Amount</label>
                  <p className="text-lg font-semibold text-purple-600">Ksh {unitData.deposit_amount?.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Unit Type</label>
                  <p className="text-lg font-semibold text-gray-800">{unitData.type}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">Unit Name</label>
                  <p className="text-lg font-semibold text-gray-800">{unitData.unit_name}</p>
                </div>
              </div>
            </div>

            {/* Tenant Information Card */}
            {current_tenant && (
              <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-green-50 rounded-xl">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Tenant Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-lg font-semibold text-gray-800">
                      {current_tenant.first_name} {current_tenant.last_name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-lg font-semibold text-gray-800">{current_tenant.email}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-lg font-semibold text-gray-800">{current_tenant.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Move In Date</label>
                    <p className="text-lg font-semibold text-gray-800">
                      {new Date(current_tenant.move_in_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Lease Information Card */}
            {current_lease && (
              <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-purple-50 rounded-xl">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Lease Details</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Lease Status</label>
                    <p className={`text-lg font-semibold ${
                      leaseStatus === 'active' ? 'text-emerald-600' : 
                      leaseStatus === 'ended' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {leaseStatus?.charAt(0)?.toUpperCase() + leaseStatus?.slice(1)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Start Date</label>
                    <p className="text-lg font-semibold text-gray-800">
                      {new Date(current_lease.start_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">End Date</label>
                    <p className="text-lg font-semibold text-gray-800">
                      {new Date(current_lease.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Payment Due Day</label>
                    <p className="text-lg font-semibold text-gray-800">
                      Day {current_lease.payment_due_day} of each month
                    </p>
                  </div>
                </div>

                {leaseEnded && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl">
                    <p className="text-red-600 font-medium text-sm">
                      This lease has ended. The unit has been automatically marked as vacant.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Actions & Payment Summary */}
          <div className="space-y-8">
            {/* Management Actions */}
            <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Management Actions</h3>
              <div className="space-y-3">
                <button 
                  className="w-full group bg-white text-gray-700 hover:text-blue-600 border border-gray-200 hover:border-blue-200 py-3 px-4 rounded-2xl font-semibold shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2 justify-center text-sm"
                  onClick={() => setShowEditUnitModal(true)}
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit Unit
                </button>
                <button 
                  className="w-full group bg-white text-gray-700 hover:text-red-600 border border-gray-200 hover:border-red-200 py-3 px-4 rounded-2xl font-semibold shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2 justify-center text-sm"
                  onClick={() => setShowDeleteModal(true)}
                  disabled={!!current_tenant}
                >
                  <TrashIcon className="h-4 w-4" />
                  Delete Unit
                </button>
              </div>
            </div>

            {/* Payment Summary */}
            {unit.payment_status && (
              <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 font-medium text-sm">Total Months</span>
                    <span className="font-semibold text-gray-800">{unit.payment_status.total_months}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 font-medium text-sm">Expected Rent</span>
                    <span className="font-semibold text-purple-600">
                      ${unit.payment_status.expected_total_rent?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 font-medium text-sm">Total Paid</span>
                    <span className="font-semibold text-green-600">
                      ${unit.payment_status.total_paid?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500 font-medium text-sm">Balance Due</span>
                    <span className="font-semibold text-red-600">
                      ${unit.payment_status.balance_due?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-500 font-medium text-sm">Months Behind</span>
                    <span className="font-semibold text-orange-600">
                      {unit.payment_status.months_behind} month(s)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment History */}
        {payment_history?.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-amber-50 rounded-xl">
                <CreditCard className="h-5 w-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Payment History</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Period</th>
                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Amount</th>
                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Date</th>
                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Method</th>
                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Reference</th>
                    <th className="py-3 px-4 text-left text-gray-600 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payment_history.map((payment) => (
                    <tr key={payment.payment_id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-700">
                        {new Date(payment.period_start).toLocaleDateString()} - {new Date(payment.period_end).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-semibold text-green-600">${payment.amount.toFixed(2)}</td>
                      <td className="py-3 px-4 text-gray-700">{new Date(payment.payment_date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-gray-700 capitalize">{payment.payment_method.replace('_', ' ')}</td>
                      <td className="py-3 px-4 text-gray-700">{payment.transaction_reference_number || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modals */}
        <TenantAssignmentModal show={showAssignModal} onHide={() => setShowAssignModal(false)} onSubmit={handleAssignTenant} unit={unitData} />
        {current_lease && leaseStatus === 'active' && (
          <>
            <PaymentRecordingModal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} onSubmit={handleRecordPayment} lease={current_lease} />
            <LeaseEndModal show={showEndLeaseModal} onHide={() => setShowEndLeaseModal(false)} onSubmit={handleEndLease} lease={current_lease} />
          </>
        )}
        <DeleteUnitModal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} onConfirm={handleDelete} unitNumber={unitData.unit_number} />
        <EditUnitModal show={showEditUnitModal} onHide={() => setShowEditUnitModal(false)} onSubmit={handleEditSubmit} unit={unitData} />

        {notification && (
          <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
        )}
      </div>
    </div>
  );
}