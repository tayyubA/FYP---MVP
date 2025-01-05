import React, { useState } from 'react';
import { Mic, Send, FileText } from 'lucide-react';
import PatientDetails from './PatientDetails';
import ChatHistory from './ChatHistory';
import SigmlPlayer from './SigmlPlayer';
import NotesModal from './NotesModal';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [isPatient, setIsPatient] = useState(true);
  const [messages, setMessages] = useState([]);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      text: input,
      isPatient,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setInput('');

    if (!isPatient) {
      // Trigger SIGML animation
      // After animation completes:
      setIsPatient(true);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)]">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsNotesOpen(true)}
          className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <FileText className="w-5 h-5 text-indigo-600" />
          <span className="text-indigo-600 font-medium">Notes</span>
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Chat Section */}
        <div className="col-span-5">
          <div className="bg-white rounded-xl shadow-md p-4 h-[calc(100vh-16rem)]">
            <ChatHistory messages={messages} />
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Type your message..."
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPatient}
                    onChange={() => setIsPatient(!isPatient)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-700">
                    {isPatient ? 'Patient' : 'Doctor'}
                  </span>
                </label>
              </div>
            </form>
          </div>
        </div>

        {/* SIGML Player */}
        <div className="col-span-7">
          <div className="bg-white rounded-xl shadow-md p-4 h-[calc(100vh-16rem)]">
            <SigmlPlayer />
          </div>
        </div>
      </div>

      {/* Patient Details */}
      <div className="mt-6">
        <PatientDetails />
      </div>

      {/* Notes Modal */}
      <NotesModal
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        notes={notes}
        onSave={setNotes}
      />
    </div>
  );
}