'use client';
import { useState } from 'react';

export default function MaintenanceRequestForm({ onClose, onSuccess }) {
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5556/tenant/maintenance', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ request_description: description })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Request failed');

      onSuccess?.(); // Refresh or notify
      onClose?.();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-4 space-y-4 mt-4">
      <h2 className="text-lg font-bold">🛠️ New Maintenance Request</h2>
      {error && <p className="text-red-500">{error}</p>}

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the issue..."
        className="textarea textarea-bordered w-full"
        rows={4}
        required
      />

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="btn btn-outline">
          Cancel
        </button>
        <button type="submit" className="btn btn-outline rounded-md border-blue-600 text-blue-600" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}
