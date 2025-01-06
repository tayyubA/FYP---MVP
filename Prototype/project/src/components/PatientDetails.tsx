import React from 'react';

export default function PatientDetails({ patientData }) {
  if (!patientData) return null;

  const displayFields = {
    name: 'Name',
    age: 'Age',
    gender: 'Gender',
    maritalStatus: 'Marital Status',
    bloodGroup: 'Blood Group',
    allergies: 'Allergies',
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Patient Details</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(displayFields).map(([key, label]) => (
          <div key={key}>
            <div className="text-sm font-medium text-gray-500">
              {label}
            </div>
            <div className="text-gray-800">
              {patientData[key] || 'N/A'}
            </div>
          </div>
        ))}
      </div>
      {patientData.medicalHistory && (
        <div className="mt-4">
          <div className="text-sm font-medium text-gray-500">Medical History</div>
          <div className="text-gray-800 mt-1">{patientData.medicalHistory}</div>
        </div>
      )}
    </div>
  );
}