'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AdminMaintenancePage() {
  const [requests, setRequests] = useState([]);
  const [originalRequests, setOriginalRequests] = useState([]);
  const [adminId, setAdminId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchRequests = async (id) => {
      try {
        const res = await fetch(`http://localhost:5556/admin/maintenance-requests/${id}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch maintenance requests');
        const data = await res.json();
        setRequests(data);
        setOriginalRequests(data);
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    try {
      const cookie = Cookies.get('user');
      if (!cookie) {
        router.push('/login');
        return;
      }
      const parsed = JSON.parse(decodeURIComponent(cookie));
      if (parsed.role !== 'admin') {
        router.push('/login');
        return;
      }
      setAdminId(parsed.user_id);
      fetchRequests(parsed.user_id);
    } catch (err) {
      console.error('Cookie parsing error', err);
      router.push('/login');
    }
  }, [router]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const handleChange = (index, field, value) => {
    setRequests((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  };

  const handleSaveAll = async () => {
    setSaving(true);
    const updates = [];

    for (let i = 0; i < requests.length; i++) {
      const updated = requests[i];
      const original = originalRequests[i];
      if (
        updated.request_status !== original.request_status ||
        updated.request_priority !== original.request_priority ||
        updated.cost !== original.cost
      ) {
        updates.push(updated);
      }
    }

    try {
      await Promise.all(
        updates.map((r) =>
          fetch(`http://localhost:5556/admin/maintenance-request/${r.request_id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              request_status: r.request_status,
              request_priority: r.request_priority,
              cost: r.cost,
            }),
          })
        )
      );
      alert('✅ All updates saved successfully.');
      setOriginalRequests(JSON.parse(JSON.stringify(requests)));
    } catch (err) {
      console.error('Error saving updates:', err);
      alert('❌ Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 bg-white min-h-screen text-gray-900">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">🔧 Maintenance Requests</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : requests.length === 0 ? (
        <p className="text-center text-gray-500">No maintenance requests found.</p>
      ) : (
        <>
          <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">#</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Tenant ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Description</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Priority</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map((r, index) => (
                  <tr key={r.request_id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{r.request_id}</td>
                    <td className="px-4 py-2">{r.tenant_id}</td>
                    <td className="px-4 py-2 max-w-sm text-gray-800">{r.request_description}</td>
                    <td className="px-4 py-2">
                      <select
  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
  value={r.request_status}
  onChange={(e) => handleChange(index, 'request_status', e.target.value)}
>
  <option value="pending">pending</option>
  <option value="in progress">in progress</option>
  <option value="approved">approved</option>
  <option value="completed">completed</option>
  <option value="declined">declined</option>
</select>

                    </td>
                    <td className="px-4 py-2">
                      <select
  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
  value={r.request_priority}
  onChange={(e) => handleChange(index, 'request_priority', e.target.value)}
>
  <option value="low">low</option>
  <option value="secondary">secondary</option>
  <option value="high">high</option>
  <option value="urgent">urgent</option>
</select>

                    </td>
                    <td className="px-4 py-2">{formatDate(r.request_date)}</td>
                    <td className="px-4 py-2">
                      <input
  type="number"
  className="w-24 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
  value={r.cost !== null ? r.cost : ''}
  onChange={(e) => handleChange(index, 'cost', e.target.value)}
/>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-6">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
              onClick={handleSaveAll}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
