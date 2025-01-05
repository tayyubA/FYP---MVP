import React, { useState, useEffect } from 'react';

export default function NotesModal({ isOpen, onClose, notes, onSave }) {
  const [localNotes, setLocalNotes] = useState(notes);

  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Consultation Notes</h2>
        <textarea
          value={localNotes}
          onChange={(e) => setLocalNotes(e.target.value)}
          className="w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Add consultation notes here..."
        />
        <div className="flex justify-end space-x-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(localNotes);
              onClose();
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
}