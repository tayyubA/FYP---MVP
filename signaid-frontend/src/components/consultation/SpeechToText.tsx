import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import SendIcon from '@mui/icons-material/Send';

interface SpeechToTextProps {
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
  onSend: (text: string) => void;
  placeholder?: string;
  buttonLabel?: string;
  color?: 'primary' | 'secondary';
}

const SpeechToText: React.FC<SpeechToTextProps> = ({
  onTypingStart,
  onTypingEnd,
  onSend,
  placeholder = 'Type or speak your message...',
  buttonLabel = 'Send',
  color = 'primary'
}) => {
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      recognitionInstance.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          setInputText(prevText => prevText + finalTranscript + ' ');
          if (onTypingStart) onTypingStart();
          setTimeout(() => {
            if (onTypingEnd) onTypingEnd();
          }, 500);
        } else if (interimTranscript) {
          setInputText(prevText => {
            const baseText = prevText.trim().split(' ').slice(0, -1).join(' ');
            return baseText ? baseText + ' ' + interimTranscript + ' ' : interimTranscript + ' ';
          });
          if (onTypingStart) onTypingStart();
        }
      };
      
      setRecognition(recognitionInstance);
    }
    
    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (e) {
          console.error('Error stopping recognition:', e);
        }
      }
    };
  }, [onTypingStart, onTypingEnd]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening, recognition]);

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      try {
        recognition?.start();
      } catch (e) {
        console.error('Error starting recognition:', e);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (e.target.value && !isListening && onTypingStart) {
      onTypingStart();
    } else if (!e.target.value && onTypingEnd) {
      onTypingEnd();
    }
  };

  const handleSend = () => {
    if (inputText.trim()) {
      onSend(inputText.trim());
      setInputText('');
      if (onTypingEnd) onTypingEnd();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <TextField
        fullWidth
        multiline
        maxRows={3}
        value={inputText}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        variant="outlined"
        size="medium"
        sx={{ 
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          }
        }}
      />
      
      <Tooltip title={isListening ? 'Stop listening' : 'Start listening'}>
        <IconButton 
          onClick={toggleListening} 
          color={color}
          sx={{ 
            bgcolor: isListening ? `${color}.light` : 'transparent',
            '&:hover': {
              bgcolor: isListening ? `${color}.main` : `${color}.light`,
            }
          }}
        >
          {isListening ? (
            <MicOffIcon />
          ) : (
            <MicIcon />
          )}
        </IconButton>
      </Tooltip>
      
      <Tooltip title={`Send as ${buttonLabel}`}>
        <IconButton 
          onClick={handleSend} 
          color={color}
          disabled={!inputText.trim()}
        >
          <SendIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default SpeechToText; 