'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { DollarSign, Home, User, Calendar, CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';

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

 const handleEndLease = async () => {
  try {
    // Use today's date for ending the lease
    const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    
    const response = await axios.post(
      `http://127.0.0.1:5556/units/${unitId}/end-lease`, 
      { end_date: today }
    );

    // Update local state
    setUnit(prev => ({
      ...prev,
      current_lease: null,
      current_tenant: null,
      unit: response.data.unit
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

  if (loading) return <div className="text-center mt-8 md:mt-10">Loading...</div>;
  if (error) return <div className="alert alert-error text-white max-w-md mx-auto mt-8">{error}</div>;
  if (!unit) return <div className="text-center mt-8 md:mt-10">Unit not found</div>;

  const { unit: unitData, current_tenant, current_lease, payment_history } = unit;
  const leaseEnded = current_lease && new Date(current_lease.end_date) <= new Date();
  const leaseStatus = leaseEnded ? 'ended' : (current_lease?.lease_status || 'inactive');

  return (
    <div className="bg-gray-50 min-h-screen max-w-6xl mx-auto px-4 py-6 md:py-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h2 className="text-3xl font-bold text-black underline mb-3 md:mb-0">Unit - {unitData.unit_number}</h2>
        <div className="flex flex-wrap gap-2">
          {current_lease && leaseStatus === 'active' ? (
            <>
              <button className="btn btn-outline btn-primary" onClick={() => setShowPaymentModal(true)}>
                Record Payment
              </button>
              <button className="btn btn-outline btn-error" onClick={() => setShowEndLeaseModal(true)}>
                End Lease
              </button>
            </>
          ) : (
            <button className="btn btn-outline border-blue-600 text-blue-600" onClick={() => setShowAssignModal(true)}>
              Assign Tenant
            </button>
          )}
        </div>
      </div>

      {/* Unit Info Section */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-3 text-blue-900 underline">Unit Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">

          <div className="border rounded-lg p-4 shadow-sm bg-white flex items-center gap-3">
            <Home className="text-blue-500" />
            <div>
              <p className="text-sm text-gray-500 font-bold">Unit Number</p>
              <p className="text-lg font-bold text-purple-600">{unitData.unit_number}</p>
            </div>
          </div>

          <div className="border rounded-lg p-4 shadow-sm bg-white flex items-center gap-3">
            <Clock className="text-green-500" />
            <div>
              <p className="text-sm text-gray-500 font-bold">Status</p>
              <p className={`text-lg font-bold ${
                unitData.status === 'occupied' ? 'text-green-600' :
                unitData.status === 'vacant' ? 'text-blue-600' : 'text-gray-600'
              }`}>{unitData.status}</p>
            </div>
          </div>

          <div className="border rounded-lg p-4 shadow-sm bg-white flex items-center gap-3">
            <DollarSign className="text-yellow-500" />
            <div>
              <p className="text-sm text-gray-500 font-bold">Monthly Rent</p>
              <p className="text-lg font-bold text-green-600">Ksh {unitData.monthly_rent?.toFixed(2)}</p>
            </div>
          </div>

          <div className="border rounded-lg p-4 shadow-sm bg-white flex items-center gap-3">
            <CreditCard className="text-purple-500" />
            <div>
              <p className="text-sm text-gray-500 font-bold">Deposit</p>
              <p className="text-lg font-bold text-indigo-600">Ksh {unitData.deposit_amount?.toFixed(2)}</p>
            </div>
          </div>

          <div className="border rounded-lg p-4 shadow-sm bg-white flex items-center gap-3">
            <Home className="text-teal-500" />
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="text-lg font-bold text-teal-600">{unitData.type}</p>
            </div>
          </div>

          <div className="border rounded-lg p-4 shadow-sm bg-white flex items-center gap-3">
            <User className="text-indigo-500" />
            <div>
              <p className="text-sm text-gray-500 font-bold">Unit Name</p>
              <p className="text-lg font-bold text-indigo-600">{unitData.unit_name}</p>
            </div>
          </div>

        </div>
      </div>

      {/* Tenant Info Section */}
      {current_tenant && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-3 text-blue-900 underline">Tenant Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="border rounded-lg p-4 shadow-sm bg-white flex items-center gap-3">
              <User className="text-indigo-500" />
              <div>
                <p className="text-sm text-gray-500 font-bold">Name</p>
                <p className="text-lg font-bold text-indigo-600">{current_tenant.first_name} {current_tenant.last_name}</p>
              </div>
            </div>

            <div className="border rounded-lg p-4 shadow-sm bg-white flex items-center gap-3">
              <XCircle className="text-red-500" />
              <div>
                <p className="text-sm text-gray-500 font-bold">Email</p>
                <p className="text-lg font-bold text-red-600">{current_tenant.email}</p>
              </div>
            </div>

            <div className="border rounded-lg p-4 shadow-sm bg-white flex items-center gap-3">
              <Clock className="text-green-500" />
              <div>
                <p className="text-sm text-gray-500 font-bold">Phone</p>
                <p className="text-lg font-bold text-green-600">{current_tenant.phone}</p>
              </div>
            </div>

            <div className="border rounded-lg p-4 shadow-sm bg-white md:col-span-3 flex items-center gap-3">
              <Calendar className="text-yellow-500" />
              <div>
                <p className="text-sm text-gray-500 font-bold">Move In Date</p>
                <p className="text-lg font-bold text-yellow-600">{new Date(current_tenant.move_in_date).toLocaleDateString()}</p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Lease Info Section */}
      {current_lease && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-3 text-blue-900 underline">Lease Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="border rounded-lg p-4 shadow-sm bg-white flex items-center gap-3">
              <CheckCircle className="text-green-500" />
              <div>
                <p className="text-sm text-gray-500 font-bold">Status</p>
                <p className={`text-lg font-bold ${
                  leaseStatus === 'active' ? 'text-green-600' :
                  leaseStatus === 'ended' ? 'text-red-600' : 'text-gray-600'
                }`}>{leaseStatus}</p>
              </div>
            </div>

            <div className="border rounded-lg p-4 shadow-sm bg-white flex items-center gap-3">
              <Calendar className="text-blue-500" />
              <div>
                <p className="text-sm text-gray-500 font-bold">Start Date</p>
                <p className="text-lg font-bold text-blue-600">{new Date(current_lease.start_date).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="border rounded-lg p-4 shadow-sm bg-white flex items-center gap-3">
              <Calendar className="text-red-500" />
              <div>
                <p className="text-sm text-gray-500 font-bold">End Date</p>
                <p className="text-lg font-bold text-red-600">{new Date(current_lease.end_date).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="border rounded-lg p-4 shadow-sm bg-white md:col-span-3 flex items-center gap-3">
              <Clock className="text-yellow-500" />
              <div>
                <p className="text-sm text-gray-500 font-bold">Payment Due</p>
                <p className="text-lg font-bold text-yellow-600">Day {current_lease.payment_due_day} of each month</p>
              </div>
            </div>

          </div>

          {leaseEnded && (
            <p className="text-red-600 font-medium mt-3">
              This lease has ended. The unit has been automatically marked as vacant.
            </p>
          )}
        </div>
      )}

      {/* Edit/Delete Buttons */}
      <div className="flex gap-3 justify-end mt-6">
        <button 
          className="btn btn-outline border-blue-600 text-blue-600 rounded-md" 
          onClick={() => setShowEditUnitModal(true)}
        >
          Edit Unit
        </button>
        <button 
          className="btn btn-outline btn-error rounded-md" 
          onClick={() => setShowDeleteModal(true)}
          disabled={!!current_tenant}
        >
          Delete Unit
        </button>
      </div>

      {/* Payment History & Summary remains same */}
      {payment_history?.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 underline text-blue-900">Payment History</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-md text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 text-left text-blue-900">Period</th>
                  <th className="py-2 px-4 text-left text-blue-900">Amount</th>
                  <th className="py-2 px-4 text-left text-blue-900">Date</th>
                  <th className="py-2 px-4 text-left text-blue-900">Method</th>
                  <th className="py-2 px-4 text-left  text-blue-900">Ref</th>
                  <th className="py-2 px-4 text-left text-blue-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {payment_history.map((payment) => (
                  <tr key={payment.payment_id} className="border-b">
                    <td className="py-2 px-4 text-black">{new Date(payment.period_start).toLocaleDateString()} - {new Date(payment.period_end).toLocaleDateString()}</td>
                    <td className="py-2 px-4 text-green-600 font-bold">${payment.amount.toFixed(2)}</td>
                    <td className="py-2 px-4 text-red-600 ">{new Date(payment.payment_date).toLocaleDateString()}</td>
                    <td className="py-2 px-4 text-yellow-600">{payment.payment_method.replace('_', ' ')}</td>
                    <td className="py-2 px-4 text-purple-600">{payment.transaction_reference_number || 'N/A'}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>{payment.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {unit.payment_status && (
        <div className="mt-6 bg-gray-50 p-4 rounded border">
          <h4 className="font-bold mb-2 text-blue-900">Payment Summary</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p className='text-blue-500 font-bold'><strong>Months:</strong> {unit.payment_status.total_months}</p>
            <p  className='text-purple-500 font-bold'><strong>Expected:</strong> ${unit.payment_status.expected_total_rent?.toFixed(2) || '0.00'}</p>
            <p  className='text-green-500 font-bold'><strong>Paid:</strong> ${unit.payment_status.total_paid?.toFixed(2) || '0.00'}</p>
            <p  className='text-red-500 font-bold'><strong>Balance:</strong> ${unit.payment_status.balance_due?.toFixed(2) || '0.00'}</p>
            <p  className='text-orange-500 font-bold'><strong>Behind:</strong> {unit.payment_status.months_behind} month(s)</p>
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
  );
}
