import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TenantAssignmentModal from './TenantAssignmentModal';
import PaymentRecordingModal from './PaymentRecordingModal';
import LeaseEndModal from './LeaseEndModal';

const UnitDetails = () => {
  const { unitId } = useParams();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEndLeaseModal, setShowEndLeaseModal] = useState(false);

  useEffect(() => {
    const fetchUnitData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5556/units/${unitId}`);
        setUnit(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch unit data');
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
        current_lease: response.data.lease
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
        payment_history: [response.data.payment, ...prev.payment_history]
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
        current_tenant: null
      }));
      setShowEndLeaseModal(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to end lease');
    }
  };

  if (loading) return <div className="text-center text-white mt-10">Loading...</div>;
  if (error) return <div className="alert alert-error text-white">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white text-black rounded-2xl shadow-2xl p-8 border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-gray-300 pb-4">
          <h2 className="text-3xl font-bold mb-4 md:mb-0">🏠 Unit {unit.unit.unit_number}</h2>
          <div className="flex flex-wrap gap-3">
            {unit.current_lease ? (
              <>
                <button
                  className="btn bg-[#1e3a8a] hover:bg-[#1e40af] text-white"
                  onClick={() => setShowPaymentModal(true)}
                >
                  💳 Record Payment
                </button>
                <button
                  className="btn bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => setShowEndLeaseModal(true)}
                >
                  ❌ End Lease
                </button>
              </>
            ) : (
              <button
                className="btn bg-[#1e3a8a] hover:bg-[#1e40af] text-white"
                onClick={() => setShowAssignModal(true)}
              >
                ➕ Assign Tenant
              </button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Unit Info */}
          <div className="bg-gray-50 rounded-xl p-6 shadow border">
            <h3 className="text-xl font-semibold mb-4">🏢 Unit Information</h3>
            <p><strong>Name:</strong> {unit.unit.unit_name}</p>
            <p><strong>Status:</strong> {unit.unit.status}</p>
            <p><strong>Monthly Rent:</strong> ${unit.unit.monthly_rent.toFixed(2)}</p>
            <p><strong>Deposit:</strong> ${unit.unit.deposit_amount.toFixed(2)}</p>
          </div>

          {/* Tenant Info */}
          {unit.current_tenant && (
            <div className="bg-gray-50 rounded-xl p-6 shadow border">
              <h3 className="text-xl font-semibold mb-4">👤 Current Tenant</h3>
              <p><strong>Name:</strong> {unit.current_tenant.first_name} {unit.current_tenant.last_name}</p>
              <p><strong>Email:</strong> {unit.current_tenant.email}</p>
              <p><strong>Phone:</strong> {unit.current_tenant.phone}</p>
              <p><strong>Move In Date:</strong> {new Date(unit.current_tenant.move_in_date).toLocaleDateString()}</p>
            </div>
          )}
        </div>

        {/* Lease Info */}
        {unit.current_lease && (
          <div className="bg-gray-50 rounded-xl p-6 mt-8 shadow border">
            <h3 className="text-xl font-semibold mb-4">📄 Lease Details</h3>
            <p><strong>Start Date:</strong> {new Date(unit.current_lease.start_date).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {new Date(unit.current_lease.end_date).toLocaleDateString()}</p>
            <p><strong>Payment Due Day:</strong> {unit.current_lease.payment_due_day} of each month</p>
          </div>
        )}

        {/* Payment History */}
        {unit.payment_history.length > 0 && (
          <div className="mt-10 overflow-x-auto">
            <h3 className="text-xl font-semibold mb-4">📆 Payment History</h3>
            <table className="table w-full text-sm">
              <thead className="bg-[#1e3a8a] text-white">
                <tr>
                  <th>Period</th>
                  <th>Amount</th>
                  <th>Payment Date</th>
                  <th>Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {unit.payment_history.map(payment => (
                  <tr key={payment.payment_id} className="hover:bg-blue-100 transition">
                    <td>
                      {new Date(payment.period_start).toLocaleDateString()} -{' '}
                      {new Date(payment.period_end).toLocaleDateString()}
                    </td>
                    <td>${payment.amount.toFixed(2)}</td>
                    <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                    <td>{payment.payment_method}</td>
                    <td>{payment.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <TenantAssignmentModal
        show={showAssignModal}
        onHide={() => setShowAssignModal(false)}
        onSubmit={handleAssignTenant}
        unit={unit.unit}
      />

      {unit.current_lease && (
        <>
          <PaymentRecordingModal
            show={showPaymentModal}
            onHide={() => setShowPaymentModal(false)}
            onSubmit={handleRecordPayment}
            lease={unit.current_lease}
          />
          <LeaseEndModal
            show={showEndLeaseModal}
            onHide={() => setShowEndLeaseModal(false)}
            onSubmit={handleEndLease}
            lease={unit.current_lease}
          />
        </>
      )}
    </div>
  );
};

export default UnitDetails;
