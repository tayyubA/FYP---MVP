import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

export default function SummaryModal({ isOpen, onClose, consultationData }) {
  const navigate = useNavigate();
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    setIsGenerating(true);
    // TODO: API call to generate summary
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
    setSummary('Sample consultation summary...');
    setIsGenerating(false);
  };

  const handleSave = async () => {
    // TODO: Save to database
    navigate('/');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Consultation Summary</h2>
        
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-8">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">Generating summary...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-end space-x-4 mb-4">
              <button
                onClick={generateSummary}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Generate Summary
              </button>
            </div>
            
            {summary && (
              <>
                <div className="border rounded-lg p-4 min-h-[200px] bg-gray-50">
                  {summary}
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Save & Complete
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}