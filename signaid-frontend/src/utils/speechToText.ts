import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// Check if browser supports speech recognition
export const isSpeechRecognitionSupported = () => {
  return SpeechRecognition.browserSupportsSpeechRecognition();
};

// Hook for using speech recognition
export const useSpeechToText = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const startListening = () => {
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    }
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  return {
    transcript,
    listening,
    resetTranscript,
    startListening,
    stopListening,
    isSupported: browserSupportsSpeechRecognition
  };
}; 