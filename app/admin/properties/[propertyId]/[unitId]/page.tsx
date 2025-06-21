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
      setUnit(prev => ({
        ...prev,
        payment_history: [response.data.payment, ...prev.payment_history],
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

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="alert alert-error text-white">{error}</div>;

  const { unit: unitData, current_tenant, current_lease, payment_history } = unit;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-white">
      <div className="bg-white text-black rounded-xl shadow-lg p-6 border border-gray-200">

        <div className="flex justify-between items-center mb-4 border-b border-white pb-4">
          <h2 className="text-3xl font-bold underline">Unit: {unitData.unit_number}</h2>
          <div className="flex gap-2">
            {current_lease ? (
              <>
                <button className="btn btn-outline btn-primary" onClick={() => setShowPaymentModal(true)}>
                  Record Payment
                </button>
                <button className="btn btn-outline btn-error" onClick={() => setShowEndLeaseModal(true)}>
                  End Lease
                </button>
              </>
            ) : (
              <button className="btn- btn-neutral hover:bg-[#1e40af] text-white rounded-md" onClick={() => setShowAssignModal(true)}>
                Assign Tenant
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Unit Information</h3>
            <p><span className="font-bold">Name:</span> {unitData.unit_name}</p>
            <p><span className="font-bold">Status:</span> {unitData.status}</p>
            <p><span className="font-bold">Monthly Rent:</span> ${unitData.monthly_rent.toFixed(2)}</p>
            <p><span className="font-bold">Deposit:</span> ${unitData.deposit_amount.toFixed(2)}</p>
          </div>

          {current_tenant && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Current Tenant</h3>
              <p><span className="font-bold">Name:</span> {current_tenant.first_name} {current_tenant.last_name}</p>
              <p><span className="font-bold">Email:</span> {current_tenant.email}</p>
              <p><span className="font-bold">Phone:</span> {current_tenant.phone}</p>
              <p><span className="font-bold">Move In:</span> {new Date(current_tenant.move_in_date).toLocaleDateString()}</p>
            </div>
          )}
        </div>

        {current_lease && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Lease Details</h3>
            <p><span className="font-bold">Start:</span> {new Date(current_lease.start_date).toLocaleDateString()}</p>
            <p><span className="font-bold">End:</span> {new Date(current_lease.end_date).toLocaleDateString()}</p>
            <p><span className="font-bold">Payment Due:</span> Day {current_lease.payment_due_day} of each month</p>
          </div>
        )}

        {payment_history?.length > 0 && (
<div className="mt-6 overflow-x-auto">
  <h3 className="text-xl font-semibold mb-2 text-black underline">Payment History</h3>
  <table className="w-full border border-gray-300 rounded-md overflow-hidden">
    <thead className="bg-white text-black">
      <tr>
        <th className="py-2 px-4 border-b border-gray-300 text-left">Period</th>
        <th className="py-2 px-4 border-b border-gray-300 text-left">Amount</th>
        <th className="py-2 px-4 border-b border-gray-300 text-left">Payment Date</th>
        <th className="py-2 px-4 border-b border-gray-300 text-left">Method</th>
        <th className="py-2 px-4 border-b border-gray-300 text-left">Reference</th>
        <th className="py-2 px-4 border-b border-gray-300 text-left">Status</th>
      </tr>
    </thead>
    <tbody>
      {payment_history.map((payment) => (
        <tr key={payment.payment_id} className="bg-white border-b border-gray-200">
          <td className="py-2 px-4 text-black">
            {new Date(payment.period_start).toLocaleDateString()} - {new Date(payment.period_end).toLocaleDateString()}
          </td>
          <td className="py-2 px-4 text-black">${payment.amount.toFixed(2)}</td>
          <td className="py-2 px-4 text-black">{new Date(payment.payment_date).toLocaleDateString()}</td>
          <td className="py-2 px-4 text-black">{payment.payment_method.replace('_', ' ')}</td>
          <td className="py-2 px-4 text-black">{payment.transaction_reference_number || 'N/A'}</td>
          <td className="py-2 px-4 text-black">{payment.status}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
        )}
      </div>

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
