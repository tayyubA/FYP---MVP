import { Patient, Prescription, ApiResponse, Message } from '../types';

// In-memory storage
let patients: Patient[] = [];
let prescriptions: Prescription[] = [];
let nextPatientId = 1;
let nextConsultationId = 1;
let nextPrescriptionId = 1;

interface Medicine {
  name: string;
  dosage: string;
  instructions: string;
}

// Define ConsultationData interface instead of Consultation to avoid conflict
interface ConsultationData {
  id: string;
  patientId: string;
  messages: Message[];
  prescription?: Medicine[];
  notes?: string;
  status: 'active' | 'completed';
  completedAt?: string;
}

// Initialize consultations array
let consultations: ConsultationData[] = [];

// Mock API functions
export const mockPatientApi = {
  registerPatient: async (patientData: Omit<Patient, 'id' | 'prescriptions'>): Promise<ApiResponse<Patient>> => {
    try {
      const newPatient: Patient = {
        id: `P${nextPatientId++}`,
        ...patientData,
        prescriptions: [],
        pastPrescriptions: patientData.pastPrescriptions || ''
      };
      patients.push(newPatient);
      return {
        success: true,
        data: newPatient
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to register patient'
      };
    }
  },

  getPatientByCNIC: async (cnic: string): Promise<ApiResponse<Patient>> => {
    try {
      const patient = patients.find(p => p.cnic === cnic);
      if (!patient) {
        return {
          success: false,
          error: 'Patient not found'
        };
      }
      return {
        success: true,
        data: patient
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch patient data'
      };
    }
  },

  getPatientById: async (id: string): Promise<ApiResponse<Patient>> => {
    try {
      const patient = patients.find(p => p.id === id);
      if (!patient) {
        return {
          success: false,
          error: 'Patient not found'
        };
      }
      return {
        success: true,
        data: patient
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch patient data'
      };
    }
  }
};

export const mockConsultationApi = {
  startConsultation: async (patientId: string): Promise<ApiResponse<ConsultationData>> => {
    try {
      const consultation: ConsultationData = {
        id: `consultation_${nextConsultationId++}`,
        patientId,
        messages: [],
        status: 'active'
      };
      
      consultations.push(consultation);
      
      return {
        success: true,
        data: consultation
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to start consultation'
      };
    }
  },

  updateNotes: async (consultationId: string, notes: string): Promise<ApiResponse<ConsultationData>> => {
    try {
      const consultation = consultations.find(c => c.id === consultationId);
      if (!consultation) {
        return {
          success: false,
          error: 'Consultation not found'
        };
      }
      consultation.notes = notes;
      return {
        success: true,
        data: consultation
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update notes'
      };
    }
  },

  savePrescription: async (consultationId: string, prescription: Medicine[], notes: string): Promise<ApiResponse<ConsultationData>> => {
    const consultation = consultations.find(c => c.id === consultationId);
    if (!consultation) {
      return { success: false, error: 'Consultation not found' };
    }

    consultation.prescription = prescription;
    consultation.notes = notes;

    return {
      success: true,
      data: consultation
    };
  },

  completeConsultation: async (consultationId: string): Promise<ApiResponse<ConsultationData>> => {
    const consultation = consultations.find(c => c.id === consultationId);
    if (!consultation) {
      return { success: false, error: 'Consultation not found' };
    }

    consultation.status = 'completed';
    consultation.completedAt = new Date().toISOString();

    return {
      success: true,
      data: consultation
    };
  },
  
  addMessage: async (consultationId: string, message: Message): Promise<ApiResponse<Message>> => {
    const consultation = consultations.find(c => c.id === consultationId);
    if (!consultation) {
      return { success: false, error: 'Consultation not found' };
    }

    consultation.messages.push(message);
    return {
      success: true,
      data: message
    };
  }
};

export const mockPrescriptionApi = {
  createPrescription: async (prescriptionData: Omit<Prescription, 'id'>): Promise<ApiResponse<Prescription>> => {
    try {
      const newPrescription: Prescription = {
        id: `P${nextPrescriptionId++}`,
        ...prescriptionData
      };
      prescriptions.push(newPrescription);
      
      // Add prescription to patient
      const patient = patients.find(p => p.id === prescriptionData.patientId);
      if (patient) {
        patient.prescriptions.push(newPrescription);
      }
      
      return {
        success: true,
        data: newPrescription
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create prescription'
      };
    }
  },

  getPatientPrescriptions: async (patientId: string): Promise<ApiResponse<Prescription[]>> => {
    try {
      const patientPrescriptions = prescriptions.filter(p => p.patientId === patientId);
      return {
        success: true,
        data: patientPrescriptions
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch prescriptions'
      };
    }
  }
}; 