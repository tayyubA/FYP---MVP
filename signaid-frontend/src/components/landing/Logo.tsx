import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import PanToolIcon from '@mui/icons-material/PanTool';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ size = 'medium' }) => {
  const theme = useTheme();
  
  const sizes = {
    small: { icon: 24, text: 'h6' },
    medium: { icon: 32, text: 'h5' },
    large: { icon: 40, text: 'h4' },
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ position: 'relative' }}>
        {/* Palm Icon */}
        <PanToolIcon 
          sx={{ 
            fontSize: sizes[size].icon * 1.5,
            color: theme.palette.primary.main,
            transform: 'rotate(0deg)',
            position: 'relative',
            zIndex: 1
          }} 
        />
        
        {/* First Aid Box */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: sizes[size].icon * 0.9,
            height: sizes[size].icon * 0.9,
            backgroundColor: theme.palette.secondary.main,
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          <LocalHospitalIcon 
            sx={{ 
              fontSize: sizes[size].icon * 0.6,
              color: 'white'
            }} 
          />
        </Box>
      </Box>
      
      <Typography 
        variant={sizes[size].text as any} 
        component="h1"
        sx={{ 
          fontWeight: 700,
          color: theme.palette.primary.main,
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
          letterSpacing: '0.5px'
        }}
      >
        Sign Aid
      </Typography>
    </Box>
  );
};

export default Logo; 