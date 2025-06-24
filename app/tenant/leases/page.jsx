'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TenantLeases() {
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchLeases = async () => {
      try {
        const res = await fetch('http://localhost:5556/tenant-leases', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          if (res.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch lease history');
        }

        const data = await res.json();
        setLeases(data.leases || []);
      } catch (err) {
        setError(err.message || 'Error fetching leases');
      } finally {
        setLoading(false);
      }
    };

    fetchLeases();
  }, [router]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="p-6 text-center">Loading leases...</div>;
  if (error) return <div className="p-6 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-black">
      <h1 className="text-4xl font-bold text-center mb-8">🏠 Lease History</h1>

      {leases.length === 0 ? (
        <p className="text-center text-gray-600">No lease history available.</p>
      ) : (
        <div className="grid gap-6">
          {leases.map((lease) => (
            <div key={lease.lease_id} className="card bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2 text-blue-700 flex items-center">
                <i className="bi bi-building me-2 text-lg"></i>
                {lease.property?.property_name || 'Unknown Property'}
              </h2>

              <p className="text-gray-600 mb-2">
                <i className="bi bi-geo-alt-fill text-red-500 me-2"></i>
                {lease.property?.address}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <p><strong>Lease Period:</strong> {formatDate(lease.start_date)} - {formatDate(lease.end_date)}</p>
                  <p><strong>Status:</strong> <span className="capitalize">{lease.lease_status}</span></p>
                </div>
                <div>
                  <p><strong>Monthly Rent:</strong> ${lease.monthly_rent?.toFixed(2)}</p>
                  <p><strong>Deposit:</strong> ${lease.deposit_amount?.toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-700">
                <p><strong>Unit:</strong> {lease.unit?.unit_name || 'N/A'} ({lease.unit?.type})</p>
                <p><strong>Unit Number:</strong> #{lease.unit?.unit_number}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
