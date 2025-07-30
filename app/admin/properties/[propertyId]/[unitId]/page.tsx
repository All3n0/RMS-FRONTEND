'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
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
          // If lease has ended but status wasn't updated, refresh the data
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
        unit: {
          ...prev.unit,
          status: 'occupied' // Update unit status immediately
        }
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
        { end_date: endDate }
      );

      setUnit(prev => ({
  ...prev,
  current_lease: null,
  current_tenant: null,
  unit: response.data.unit
}));


      setShowEndLeaseModal(false);
      showNotification('Lease ended successfully');
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
      setUnit(prev => ({ 
        ...prev, 
        unit: response.data 
      }));
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

  // Check if lease has ended (frontend validation)
  const leaseEnded = current_lease && new Date(current_lease.end_date) <= new Date();
  const leaseStatus = leaseEnded ? 'ended' : (current_lease?.lease_status || 'inactive');

  return (
    <div className="bg-white min-h-screen max-w-5xl mx-auto px-4 py-6 md:py-8">
      <div className="bg-white text-black rounded-lg md:rounded-xl shadow-md p-4 md:p-6 border border-gray-200">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 pb-4 border-b border-gray-200 gap-3">
          <h2 className="text-2xl md:text-3xl font-bold underline text-blue-600">Unit: {unitData.unit_number}</h2>
          <div className="flex flex-wrap gap-2">
            {current_lease && leaseStatus === 'active' ? (
              <>
                <button 
                  className="btn btn-outline btn-primary" 
                  onClick={() => setShowPaymentModal(true)}
                >
                  Record Payment
                </button>
                <button 
                  className="btn btn-outline btn-error" 
                  onClick={() => setShowEndLeaseModal(true)}
                >
                  End Lease
                </button>
              </>
            ) : (
              <button 
                className="btn btn-outline border-blue-600 text-blue-600" 
                onClick={() => setShowAssignModal(true)}
              >
                Assign Tenant
              </button>
            )}
          </div>
        </div>

        {/* Unit Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">Unit Information</h3>
            <div className="space-y-2 text-sm md:text-base">
              <p><span className="font-bold text-blue-600">Name:</span> {unitData.unit_name}</p>
              <p>
                <span className="font-bold text-blue-600">Status:</span> 
                <span className={`ml-1 px-2 py-1 rounded text-xs ${
                  unitData.status === 'occupied' ? 'bg-green-100 text-green-800' :
                  unitData.status === 'vacant' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {unitData.status}
                </span>
              </p>
              <p><span className="font-bold text-blue-600">Monthly Rent:</span> ${unitData.monthly_rent?.toFixed(2) || '0.00'}</p>
              <p><span className="font-bold text-blue-600">Deposit:</span> ${unitData.deposit_amount?.toFixed(2) || '0.00'}</p>
              <p><span className="font-bold text-blue-600">Type:</span> {unitData.type}</p>
            </div>
          </div>

          {current_tenant && (
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Current Tenant</h3>
              <div className="space-y-2 text-sm md:text-base">
                <p><span className="font-bold">Name:</span> {current_tenant.first_name} {current_tenant.last_name}</p>
                <p><span className="font-bold">Email:</span> {current_tenant.email}</p>
                <p><span className="font-bold">Phone:</span> {current_tenant.phone}</p>
                <p><span className="font-bold">Move In:</span> {new Date(current_tenant.move_in_date).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Lease Info */}
        {current_lease && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Lease Details</h3>
            <div className="space-y-2 text-sm md:text-base">
              <p>
                <span className="font-bold">Status:</span> 
                <span className={`ml-1 px-2 py-1 rounded text-xs ${
                  leaseStatus === 'active' ? 'bg-green-100 text-green-800' :
                  leaseStatus === 'ended' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {leaseStatus}
                </span>
              </p>
              <p><span className="font-bold">Start:</span> {new Date(current_lease.start_date).toLocaleDateString()}</p>
              <p><span className="font-bold">End:</span> {new Date(current_lease.end_date).toLocaleDateString()}</p>
              <p><span className="font-bold">Payment Due:</span> Day {current_lease.payment_due_day} of each month</p>
              {leaseEnded && (
                <p className="text-red-600 font-medium">
                  This lease has ended. The unit has been automatically marked as vacant.
                </p>
              )}
            </div>
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

        {/* Payment History */}
        {payment_history?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 underline">Payment History</h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 rounded-md text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left">Period</th>
                    <th className="py-2 px-4 text-left">Amount</th>
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Method</th>
                    <th className="py-2 px-4 text-left">Ref</th>
                    <th className="py-2 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payment_history.map((payment) => (
                    <tr key={payment.payment_id} className="border-b">
                      <td className="py-2 px-4">
                        {new Date(payment.period_start).toLocaleDateString()} - {' '}
                        {new Date(payment.period_end).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4">${payment.amount.toFixed(2)}</td>
                      <td className="py-2 px-4">{new Date(payment.payment_date).toLocaleDateString()}</td>
                      <td className="py-2 px-4">{payment.payment_method.replace('_', ' ')}</td>
                      <td className="py-2 px-4">{payment.transaction_reference_number || 'N/A'}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
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

        {/* Payment Summary */}
        {unit.payment_status && (
          <div className="mt-6 bg-gray-50 p-4 rounded border">
            <h4 className="font-bold mb-2">Payment Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><strong>Months:</strong> {unit.payment_status.total_months}</p>
              <p><strong>Expected:</strong> ${unit.payment_status.expected_total_rent?.toFixed(2) || '0.00'}</p>
              <p><strong>Paid:</strong> ${unit.payment_status.total_paid?.toFixed(2) || '0.00'}</p>
              <p><strong>Balance:</strong> ${unit.payment_status.balance_due?.toFixed(2) || '0.00'}</p>
              <p><strong>Behind:</strong> {unit.payment_status.months_behind} month(s)</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <TenantAssignmentModal 
        show={showAssignModal} 
        onHide={() => setShowAssignModal(false)} 
        onSubmit={handleAssignTenant} 
        unit={unitData} 
      />

      {current_lease && leaseStatus === 'active' && (
        <>
          <PaymentRecordingModal 
            show={showPaymentModal} 
            onHide={() => setShowPaymentModal(false)} 
            onSubmit={handleRecordPayment} 
            lease={current_lease} 
          />
          <LeaseEndModal 
            show={showEndLeaseModal} 
            onHide={() => setShowEndLeaseModal(false)} 
            onSubmit={handleEndLease} 
            lease={current_lease} 
          />
        </>
      )}

      <DeleteUnitModal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)} 
        onConfirm={handleDelete} 
        unitNumber={unitData.unit_number} 
      />

      <EditUnitModal 
        show={showEditUnitModal} 
        onHide={() => setShowEditUnitModal(false)} 
        onSubmit={handleEditSubmit} 
        unit={unitData} 
      />

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}