import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PanToolIcon from '@mui/icons-material/PanTool';

interface LogoProps {
  showText?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ showText = true, size = 'medium' }) => {
  const theme = useTheme();
  
  // Size mappings
  const sizeMap = {
    small: {
      iconSize: 24,
      fontSize: '1.2rem',
      spacing: 1,
    },
    medium: {
      iconSize: 36,
      fontSize: '1.5rem',
      spacing: 1.5,
    },
    large: {
      iconSize: 48,
      fontSize: '2rem',
      spacing: 2,
    },
  };
  
  const { iconSize, fontSize, spacing } = sizeMap[size];
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: spacing }}>
      <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <PanToolIcon 
          sx={{ 
            fontSize: iconSize, 
            color: theme.palette.primary.main,
            transform: 'rotate(0deg)',
            zIndex: 1,
          }} 
        />
        <LocalHospitalIcon 
          sx={{ 
            fontSize: iconSize * 1.5, 
            color: theme.palette.secondary.main,
            position: 'absolute',
            opacity: 0.7,
            zIndex: 0,
          }} 
        />
      </Box>
      
      {showText && (
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 700,
            fontSize,
            color: theme.palette.primary.main,
            letterSpacing: '0.5px',
          }}
        >
          Sign Aid
        </Typography>
      )}
    </Box>
  );
};

export default Logo; 