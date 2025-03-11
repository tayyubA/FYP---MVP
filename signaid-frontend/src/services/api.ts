import axios from 'axios';
import { Patient, Prescription, Consultation, ApiResponse } from '../types';

// Base URL for the API
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Patient API calls
export const patientApi = {
  // Get patient by CNIC
  getPatientByCNIC: async (cnic: string): Promise<ApiResponse<Patient>> => {
    try {
      const response = await api.get(`/patients/cnic/${cnic}`);
      return response.data;
    } catch (error) {
      // For now, we'll mock the API response for development
      // In a real application, you would handle the error properly
      console.error('Error fetching patient:', error);
      return {
        success: false,
        error: 'Failed to fetch patient data',
      };
    }
  },

  // Register a new patient
  registerPatient: async (patient: Omit<Patient, 'id' | 'prescriptions'>): Promise<ApiResponse<Patient>> => {
    try {
      const response = await api.post('/patients', patient);
      return response.data;
    } catch (error) {
      console.error('Error registering patient:', error);
      return {
        success: false,
        error: 'Failed to register patient',
      };
    }
  },
};

// Consultation API calls
export const consultationApi = {
  // Start a new consultation
  startConsultation: async (patientId: string): Promise<ApiResponse<Consultation>> => {
    try {
      const response = await api.post('/consultations', { patientId });
      return response.data;
    } catch (error) {
      console.error('Error starting consultation:', error);
      return {
        success: false,
        error: 'Failed to start consultation',
      };
    }
  },

  // Update consultation notes
  updateNotes: async (consultationId: string, notes: string): Promise<ApiResponse<Consultation>> => {
    try {
      const response = await api.patch(`/consultations/${consultationId}`, { notes });
      return response.data;
    } catch (error) {
      console.error('Error updating notes:', error);
      return {
        success: false,
        error: 'Failed to update notes',
      };
    }
  },

  // Complete consultation
  completeConsultation: async (consultationId: string): Promise<ApiResponse<Consultation>> => {
    try {
      const response = await api.patch(`/consultations/${consultationId}/complete`);
      return response.data;
    } catch (error) {
      console.error('Error completing consultation:', error);
      return {
        success: false,
        error: 'Failed to complete consultation',
      };
    }
  },
};

// Prescription API calls
export const prescriptionApi = {
  // Create a new prescription
  createPrescription: async (prescription: Omit<Prescription, 'id'>): Promise<ApiResponse<Prescription>> => {
    try {
      const response = await api.post('/prescriptions', prescription);
      return response.data;
    } catch (error) {
      console.error('Error creating prescription:', error);
      return {
        success: false,
        error: 'Failed to create prescription',
      };
    }
  },

  // Get prescriptions by patient ID
  getPatientPrescriptions: async (patientId: string): Promise<ApiResponse<Prescription[]>> => {
    try {
      const response = await api.get(`/prescriptions/patient/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      return {
        success: false,
        error: 'Failed to fetch prescriptions',
      };
    }
  },
}; 