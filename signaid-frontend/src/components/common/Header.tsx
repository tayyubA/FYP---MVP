import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Container, useTheme } from '@mui/material';
import Logo from '../landing/Logo';

const Header: React.FC = () => {
  const theme = useTheme();
  const history = useHistory();

  const handleLogoClick = () => {
    history.push('/');
  };

  return (
    <Box 
      sx={{ 
        bgcolor: 'background.paper',
        boxShadow: theme.shadows[2],
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            py: 2, 
            display: 'flex', 
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': {
              '& .logo': {
                transform: 'scale(1.02)',
                transition: 'transform 0.2s ease-in-out',
              }
            }
          }}
          onClick={handleLogoClick}
        >
          <Box className="logo">
            <Logo size="medium" />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Header; 