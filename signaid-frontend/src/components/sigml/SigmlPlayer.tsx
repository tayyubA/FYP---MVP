import React, { useEffect, useRef } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { textToSIGML, loadSIGMLPlayer, playSIGML } from '../../utils/sigmlUtils';

interface SigmlPlayerProps {
  text: string;
}

const SigmlPlayer: React.FC<SigmlPlayerProps> = ({ text }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerInitialized = useRef(false);

  useEffect(() => {
    // Initialize the SIGML player once
    if (containerRef.current && !playerInitialized.current) {
      loadSIGMLPlayer('sigml-player-container');
      playerInitialized.current = true;
    }
  }, []);

  useEffect(() => {
    // Convert text to SIGML and play it
    if (text && playerInitialized.current) {
      const sigml = textToSIGML(text);
      playSIGML(sigml);
    }
  }, [text]);

  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Sign Language Translation
      </Typography>
      
      <Box 
        ref={containerRef}
        id="sigml-player-container"
        sx={{ 
          flex: 1,
          minHeight: '300px',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #ddd',
          borderRadius: '4px',
          position: 'relative'
        }}
      >
        {/* This is a placeholder for the SIGML player */}
        {/* In a real application, this would be replaced by the actual SIGML player */}
        <Box 
          sx={{ 
            width: '100px',
            height: '200px',
            backgroundColor: '#ccc',
            borderRadius: '50% 50% 0 0',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#ddd',
              top: '40px',
              left: '30px'
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '60px',
              height: '80px',
              backgroundColor: '#ccc',
              bottom: '-60px',
              left: '20px',
              borderRadius: '0 0 20px 20px'
            }
          }}
        />
        
        <Typography 
          variant="body2" 
          sx={{ 
            position: 'absolute', 
            bottom: '10px', 
            width: '100%', 
            textAlign: 'center',
            color: '#666'
          }}
        >
          {text ? 'Translating: ' + text : 'Waiting for speech input...'}
        </Typography>
      </Box>
    </Paper>
  );
};

export default SigmlPlayer; 