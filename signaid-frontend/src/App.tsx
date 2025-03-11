import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import LandingPage from './pages/LandingPage';
import ConsultationPage from './pages/ConsultationPage';
import PrescriptionPage from './pages/PrescriptionPage';
import RegistrationPage from './pages/RegistrationPage';

// Create a custom theme with Crimson Red and Dark Gray
const theme = createTheme({
  palette: {
    primary: {
      main: '#DC143C', // Crimson Red
      dark: '#B01030',
      light: '#E54C6A',
    },
    secondary: {
      main: '#444444', // Dark Gray
      dark: '#333333',
      light: '#666666',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/consultation/:patientId" component={ConsultationPage} />
          <Route path="/prescription/:patientId/:consultationId" component={PrescriptionPage} />
          <Route path="/registration" component={RegistrationPage} />
          <Route path="*" render={() => <Redirect to="/" />} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
