// Patient Types
export interface Patient {
  id: string;
  cnic: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  medicalHistory: string;
  allergies: string;
  previousTreatments: string;
  bloodType: string;
  prescriptions: Prescription[];
  pastPrescriptions?: string;
}

// Prescription Types
export interface Prescription {
  id: string;
  patientId: string;
  date: string;
  medicines: Medicine[];
  instructions: string;
  doctorNotes: string;
}

export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

// Consultation Types
export interface Consultation {
  id: string;
  patientId: string;
  date: string;
  notes: string;
  status: 'ongoing' | 'completed';
}

// Message Types
export interface Message {
  id: string;
  sender: 'doctor' | 'patient' | 'system';
  content: string;
  timestamp: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
} 