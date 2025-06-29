'use client';
import React from 'react';

export default function DeleteUnitModal({ show, onHide, onConfirm, unitNumber }) {
  const handleConfirm = () => {
    onConfirm();
    onHide();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Confirm Deletion</h2>
            <button
              type="button"
              onClick={onHide}
              className="text-black-500 hover:text-blue-800 text-xl"
            >
              &times;
            </button>
          </div>

          {/* Body */}
          <div className="p-4">
            <p className="text-black">
              Are you sure you want to delete <strong>Unit {unitNumber}</strong>? This action cannot be undone.
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onHide}
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-black"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete Unit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}