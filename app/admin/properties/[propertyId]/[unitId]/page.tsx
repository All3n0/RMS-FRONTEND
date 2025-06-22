'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import TenantAssignmentModal from '../../../components/TenantAssignmentModal';
import PaymentRecordingModal from '../../../components/PaymentReordingModal';
import LeaseEndModal from '../../../components/LeaseEndModal';

export default function PropertyUnitPage() {
  const { unitId } = useParams();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEndLeaseModal, setShowEndLeaseModal] = useState(false);

  useEffect(() => {
    if (!unitId) return;
    const fetchUnitData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5556/units/${unitId}`);
        setUnit(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch unit data');
      } finally {
        setLoading(false);
      }
    };

    fetchUnitData();
  }, [unitId]);

  const handleAssignTenant = async (tenantData) => {
    try {
      const response = await axios.post(`http://127.0.0.1:5556/units/${unitId}/assign-tenant`, tenantData);
      setUnit(prev => ({
        ...prev,
        current_tenant: response.data.tenant,
        current_lease: response.data.lease,
      }));
      setShowAssignModal(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to assign tenant');
    }
  };

  const handleRecordPayment = async (paymentData) => {
    try {
      const response = await axios.post(`http://127.0.0.1:5556/units/${unitId}/record-payment`, paymentData);
      
      const newPayment = response.data.payment;
      const status = response.data.payment_status;

      setUnit(prev => ({
        ...prev,
        payment_history: [newPayment, ...prev.payment_history],
        payment_status: status
      }));

      setShowPaymentModal(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to record payment');
    }
  };

  const handleEndLease = async (endDate) => {
    try {
      await axios.post(`http://127.0.0.1:5556/units/${unitId}/end-lease`, { end_date: endDate });
      setUnit(prev => ({
        ...prev,
        current_lease: null,
        current_tenant: null,
      }));
      setShowEndLeaseModal(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to end lease');
    }
  };

  if (loading) return <div className="text-center mt-8 md:mt-10">Loading...</div>;
  if (error) return <div className="alert alert-error text-white max-w-md mx-auto mt-8">{error}</div>;

  const { unit: unitData, current_tenant, current_lease, payment_history } = unit;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
      <div className="bg-white text-black rounded-lg md:rounded-xl shadow-md p-4 md:p-6 border border-gray-200">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 pb-4 border-b border-gray-200 gap-3">
          <h2 className="text-2xl md:text-3xl font-bold underline">Unit: {unitData.unit_number}</h2>
          <div className="flex flex-wrap gap-2">
            {current_lease ? (
              <>
                <button 
                  className="btn btn-outline btn-primary text-sm md:text-base px-3 py-1 md:px-4 md:py-2"
                  onClick={() => setShowPaymentModal(true)}
                >
                  Record Payment
                </button>
                <button 
                  className="btn btn-outline btn-error text-sm md:text-base px-3 py-1 md:px-4 md:py-2"
                  onClick={() => setShowEndLeaseModal(true)}
                >
                  End Lease
                </button>
              </>
            ) : (
              <button 
                className="btn btn-neutral text-white rounded-md text-sm md:text-base px-3 py-1 md:px-4 md:py-2"
                onClick={() => setShowAssignModal(true)}
              >
                Assign Tenant
              </button>
            )}
          </div>
        </div>

        {/* Unit and Tenant Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">Unit Information</h3>
            <div className="space-y-2 text-sm md:text-base">
              <p><span className="font-bold">Name:</span> {unitData.unit_name}</p>
              <p><span className="font-bold">Status:</span> {unitData.status}</p>
              <p><span className="font-bold">Monthly Rent:</span> ${unitData.monthly_rent.toFixed(2)}</p>
              <p><span className="font-bold">Deposit:</span> ${unitData.deposit_amount.toFixed(2)}</p>
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

        {/* Lease Details */}
        {current_lease && (
          <div className="mt-4 md:mt-6">
            <h3 className="text-lg md:text-xl font-semibold mb-2">Lease Details</h3>
            <div className="space-y-2 text-sm md:text-base">
              <p><span className="font-bold">Start:</span> {new Date(current_lease.start_date).toLocaleDateString()}</p>
              <p><span className="font-bold">End:</span> {new Date(current_lease.end_date).toLocaleDateString()}</p>
              <p><span className="font-bold">Payment Due:</span> Day {current_lease.payment_due_day} of each month</p>
            </div>
          </div>
        )}

        {/* Payment History */}
        {payment_history?.length > 0 && (
          <div className="mt-4 md:mt-6">
            <h3 className="text-lg md:text-xl font-semibold mb-2 underline">Payment History</h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 rounded-md overflow-hidden text-sm md:text-base">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-3 md:px-4 border-b border-gray-300 text-left">Period</th>
                    <th className="py-2 px-3 md:px-4 border-b border-gray-300 text-left">Amount</th>
                    <th className="py-2 px-3 md:px-4 border-b border-gray-300 text-left">Date</th>
                    <th className="py-2 px-3 md:px-4 border-b border-gray-300 text-left">Method</th>
                    <th className="py-2 px-3 md:px-4 border-b border-gray-300 text-left">Ref</th>
                    <th className="py-2 px-3 md:px-4 border-b border-gray-300 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payment_history.map((payment) => (
                    <tr key={payment.payment_id} className="border-b border-gray-200">
                      <td className="py-2 px-3 md:px-4">
                        {new Date(payment.period_start).toLocaleDateString()} - {new Date(payment.period_end).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-3 md:px-4">${payment.amount.toFixed(2)}</td>
                      <td className="py-2 px-3 md:px-4">{new Date(payment.payment_date).toLocaleDateString()}</td>
                      <td className="py-2 px-3 md:px-4">{payment.payment_method.replace('_', ' ')}</td>
                      <td className="py-2 px-3 md:px-4">{payment.transaction_reference_number || 'N/A'}</td>
                      <td className="py-2 px-3 md:px-4">{payment.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {unit.payment_status && (
              <div className="mt-4 md:mt-6 bg-gray-50 p-3 md:p-4 rounded-md border border-gray-200 text-sm md:text-base">
                <h4 className="font-bold text-md md:text-lg mb-2">Payment Summary</h4>
                <div className="grid grid-cols-2 gap-2">
                  <p><span className="font-semibold">Months:</span> {unit.payment_status.total_months}</p>
                  <p><span className="font-semibold">Expected:</span> ${unit.payment_status.expected_total_rent}</p>
                  <p><span className="font-semibold">Paid:</span> ${unit.payment_status.total_paid}</p>
                  <p><span className="font-semibold">Balance:</span> ${unit.payment_status.balance_due}</p>
                  <p><span className="font-semibold">Behind:</span> {unit.payment_status.months_behind} month(s)</p>
                </div>
              </div>
            )}
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

      {current_lease && (
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
    </div>
  );
}