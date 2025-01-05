import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, Brain, Award } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center py-12">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
        Breaking Communication Barriers
      </h1>
      <p className="text-xl text-gray-600 text-center max-w-2xl mb-12">
        SignAid bridges the gap between healthcare providers and patients through real-time sign language translation.
      </p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {[
          {
            icon: MessageSquare,
            title: 'Real-time Translation',
            description: 'Instant text-to-sign language conversion for seamless communication'
          },
          {
            icon: Users,
            title: 'Patient-Centric',
            description: 'Designed to enhance doctor-patient interaction and understanding'
          },
          {
            icon: Brain,
            title: 'Smart AI',
            description: 'Advanced AI-powered translation for accurate sign language representation'
          },
          {
            icon: Award,
            title: 'Accessibility',
            description: 'Making healthcare communication accessible to everyone'
          }
        ].map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <feature.icon className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      <Link
        to="/chat"
        className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
      >
        Start Communication
      </Link>
    </div>
  );
}