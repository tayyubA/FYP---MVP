import React from 'react';

export default function ChatHistory({ messages }) {
  return (
    <div className="h-[calc(100%-7rem)] overflow-y-auto space-y-4 p-2">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.isPatient ? 'justify-start' : 'justify-end'}`}
        >
          <div
            className={`max-w-[80%] rounded-lg px-4 py-2 ${
              message.isPatient
                ? 'bg-gray-100 text-gray-800'
                : 'bg-indigo-600 text-white'
            }`}
          >
            <div className="text-sm font-medium mb-1">
              {message.isPatient ? 'John Doe (Patient)' : 'Dr. Smith'}
            </div>
            <p>{message.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}