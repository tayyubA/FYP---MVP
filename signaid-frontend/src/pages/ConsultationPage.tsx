import React, { useState, useEffect, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  Divider,
  Avatar,
  Fade,
  Button,
  Grid,
  Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { mockPatientApi, mockConsultationApi } from '../services/mockData';
import { Patient, Message } from '../types';
import PatientInfo from '../components/consultation/PatientInfo';
import SpeechToText from '../components/consultation/SpeechToText';
import Header from '../components/common/Header';
import PrescriptionForm from '../components/consultation/PrescriptionForm';

interface ConsultationParams {
  patientId: string;
}

interface Medicine {
  name: string;
  dosage: string;
  instructions: string;
}

const ConsultationPage = (): JSX.Element => {
  const { patientId } = useParams<ConsultationParams>();
  const history = useHistory();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [consultationId, setConsultationId] = useState<string | null>(null);
  const [doctorTyping, setDoctorTyping] = useState(false);
  const [patientTyping, setPatientTyping] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<'doctor' | 'patient'>('doctor');
  const [consultationNotes, setConsultationNotes] = useState('');
  const [isPrescriptionFormOpen, setIsPrescriptionFormOpen] = useState(false);
  const [prescription, setPrescription] = useState<Medicine[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch patient data and start consultation
  useEffect(() => {
    const fetchPatientAndStartConsultation = async () => {
      try {
        setLoading(true);
        const patientResponse = await mockPatientApi.getPatientById(patientId);
        
        if (!patientResponse.success || !patientResponse.data) {
          setError('Failed to load patient data');
          setLoading(false);
          return;
        }
        
        setPatient(patientResponse.data);
        
        // Start a new consultation
        const consultationResponse = await mockConsultationApi.startConsultation(patientId);
        
        if (!consultationResponse.success || !consultationResponse.data) {
          setError('Failed to start consultation');
          setLoading(false);
          return;
        }
        
        setConsultationId(consultationResponse.data.id);
        
        // Add welcome message
        setMessages([
          {
            id: 'welcome',
            sender: 'system',
            content: `Welcome to your consultation. Dr. Smith will be assisting you today.`,
            timestamp: new Date().toISOString(),
          }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError('An unexpected error occurred');
        setLoading(false);
      }
    };
    
    fetchPatientAndStartConsultation();
  }, [patientId]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (content: string, sender: 'doctor' | 'patient') => {
    if (!content.trim() || !consultationId) return;
    
    try {
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        sender,
        content,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
      // Toggle speaker after message is sent
      setCurrentSpeaker(sender === 'doctor' ? 'patient' : 'doctor');
      
      // Save message to consultation
      await mockConsultationApi.addMessage(consultationId, newMessage);
      
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Handle typing indicators
  const handleTypingStart = (sender: 'doctor' | 'patient') => {
    if (sender === 'doctor') {
      setDoctorTyping(true);
    } else {
      setPatientTyping(true);
    }
  };

  const handleTypingEnd = (sender: 'doctor' | 'patient') => {
    if (sender === 'doctor') {
      setDoctorTyping(false);
    } else {
      setPatientTyping(false);
    }
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handlePrescriptionSave = (medicines: Medicine[], notes: string) => {
    setPrescription(medicines);
    setConsultationNotes(notes);
    // Here you would typically save to your backend
    console.log('Saving prescription:', medicines);
    console.log('Saving notes:', notes);
  };

  const handleCompleteConsultation = async () => {
    try {
      // Here you would typically save all consultation data to your backend
      const consultationData = {
        consultationId,
        patientId,
        prescription,
        notes: consultationNotes,
        messages,
      };
      console.log('Completing consultation:', consultationData);
      setIsCompleted(true);
      // Redirect to home after a brief delay
      setTimeout(() => history.push('/'), 1500);
    } catch (error) {
      console.error('Error completing consultation:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !patient) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          {error || 'Patient not found'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
      <Header />
      
      <Box sx={{ flexGrow: 1, p: 2, overflow: 'hidden' }}>
        <Grid container spacing={2} sx={{ height: '100%' }}>
          {/* Left Column - Patient Info and Actions */}
          <Grid item xs={12} md={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Patient Info with adjusted size */}
            <Paper 
              elevation={3}
              sx={{ 
                mb: 2,
                overflow: 'auto',
                flexShrink: 0,
                maxHeight: '65vh',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}
            >
              <Box 
                sx={{ 
                  p: 2, 
                  borderBottom: 1, 
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Patient Information
                </Typography>
                <Tooltip title="Return to Home">
                  <IconButton 
                    size="small" 
                    onClick={() => history.push('/')}
                    sx={{ 
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'primary.main'
                      }
                    }}
                  >
                    <ArrowBackIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ p: 2, flexGrow: 1 }}>
                <PatientInfo patient={patient} />
              </Box>
            </Paper>
            
            {/* Action Buttons with improved spacing */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2,
              mb: 2,
              mt: 'auto'  // Push buttons to the bottom of available space
            }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<NoteAddIcon />}
                onClick={() => setIsPrescriptionFormOpen(true)}
                sx={{ 
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 500
                }}
              >
                Prescription & Notes
              </Button>
              
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={handleCompleteConsultation}
                disabled={isCompleted}
                sx={{ 
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 500
                }}
              >
                Complete Consultation
              </Button>
            </Box>

            {/* Notes Preview */}
            {consultationNotes && (
              <Paper 
                elevation={3}
                sx={{ 
                  p: 2,
                  flexGrow: 1,
                  overflow: 'auto',
                  minHeight: '20vh',  // Added minimum height
                  maxHeight: '25vh'   // Added maximum height
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Consultation Notes
                </Typography>
                <Typography variant="body2">
                  {consultationNotes}
                </Typography>
              </Paper>
            )}
          </Grid>

          {/* Center Column - SIGML Avatar */}
          <Grid item xs={12} md={6} sx={{ height: '100%' }}>
            <Paper 
              elevation={3}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#000',
                position: 'relative'
              }}
            >
              {/* Placeholder for SIGML Avatar Player */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                  textAlign: 'center'
                }}
              >
                <Typography variant="h6">
                  SIGML Avatar Player
                </Typography>
                <Typography variant="body2" color="grey.500">
                  Sign language interpretation will appear here
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column - Chat */}
          <Grid item xs={12} md={3} sx={{ height: '100%' }}>
            <Paper 
              elevation={3}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              {/* Messages */}
              <Box sx={{ 
                flexGrow: 1, 
                overflow: 'auto', 
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}>
                {messages.map((message) => (
                  <Fade key={message.id} in={true} timeout={500}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: message.sender === 'doctor' ? 'flex-end' : 
                                  message.sender === 'patient' ? 'flex-start' : 'center',
                        alignSelf: message.sender === 'doctor' ? 'flex-end' : 
                                message.sender === 'patient' ? 'flex-start' : 'center',
                        maxWidth: message.sender === 'system' ? '100%' : '80%',
                        width: message.sender === 'system' ? '100%' : 'auto',
                      }}
                    >
                      {message.sender !== 'system' && (
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          mb: 0.5,
                          ml: message.sender === 'patient' ? 1 : 0,
                          mr: message.sender === 'doctor' ? 1 : 0,
                        }}>
                          {message.sender === 'patient' && (
                            <Avatar 
                              sx={{ 
                                width: 24, 
                                height: 24, 
                                mr: 1, 
                                bgcolor: 'secondary.main' 
                              }}
                            >
                              <PersonIcon fontSize="small" />
                            </Avatar>
                          )}
                          <Typography variant="caption" color="text.secondary">
                            {message.sender === 'doctor' ? 'Doctor' : 'Patient'} • {formatTime(message.timestamp)}
                          </Typography>
                          {message.sender === 'doctor' && (
                            <Avatar 
                              sx={{ 
                                width: 24, 
                                height: 24, 
                                ml: 1, 
                                bgcolor: 'primary.main' 
                              }}
                            >
                              <LocalHospitalIcon fontSize="small" />
                            </Avatar>
                          )}
                        </Box>
                      )}
                      
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: message.sender === 'doctor' 
                            ? 'primary.light' 
                            : message.sender === 'patient'
                              ? 'secondary.light'
                              : 'background.paper',
                          color: message.sender === 'system' ? 'text.primary' : 'text.primary',
                          width: message.sender === 'system' ? '100%' : 'auto',
                          textAlign: message.sender === 'system' ? 'center' : 'left',
                          border: message.sender === 'system' ? '1px dashed #ccc' : 'none',
                        }}
                      >
                        <Typography variant="body1">
                          {message.content}
                        </Typography>
                      </Paper>
                    </Box>
                  </Fade>
                ))}
                
                {/* Typing indicators */}
                {(doctorTyping || patientTyping) && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      alignSelf: doctorTyping ? 'flex-end' : 'flex-start',
                      mt: 1,
                      mb: 1,
                    }}
                  >
                    <Paper
                      elevation={1}
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: doctorTyping ? 'primary.light' : 'secondary.light',
                      }}
                    >
                      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        {doctorTyping ? 'Doctor is typing...' : 'Patient is typing...'}
                      </Typography>
                    </Paper>
                  </Box>
                )}
                
                <div ref={messagesEndRef} />
              </Box>
              
              <Divider />
              
              {/* Input Area */}
              <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                <SpeechToText
                  onSend={(text) => handleSendMessage(text, currentSpeaker)}
                  onTypingStart={() => handleTypingStart(currentSpeaker)}
                  onTypingEnd={() => handleTypingEnd(currentSpeaker)}
                  placeholder={`Type or speak as ${currentSpeaker === 'doctor' ? 'Doctor' : 'Patient'}...`}
                  buttonLabel={currentSpeaker === 'doctor' ? 'Doctor' : 'Patient'}
                  color={currentSpeaker === 'doctor' ? 'primary' : 'secondary'}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Prescription Form Dialog */}
      <PrescriptionForm
        open={isPrescriptionFormOpen}
        onClose={() => setIsPrescriptionFormOpen(false)}
        onSave={handlePrescriptionSave}
        existingNotes={consultationNotes}
      />
    </Box>
  );
};

export default ConsultationPage; 