import React from 'react';

export default function SigmlPlayer() {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8">
      <img
        src="https://images.unsplash.com/photo-1639628735078-ed2f038a193e?auto=format&fit=crop&q=80&w=1000"
        alt="Avatar Placeholder"
        className="w-64 h-64 object-cover rounded-full mb-4 opacity-50"
      />
      <p className="text-gray-500 font-medium">SIGML Avatar</p>
      <p className="text-sm text-gray-400">Sign language animation will appear here</p>
    </div>
  );
}