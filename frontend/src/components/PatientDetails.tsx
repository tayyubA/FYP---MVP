import React from 'react';

export default function PatientDetails() {
  const patient = {
    name: 'John Doe',
    age: 32,
    gender: 'Male',
    maritalStatus: 'Married',
    bloodGroup: 'O+',
    allergies: 'None',
    lastVisit: '2024-02-15',
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Patient Details</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(patient).map(([key, value]) => (
          <div key={key}>
            <div className="text-sm font-medium text-gray-500 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </div>
            <div className="text-gray-800">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}