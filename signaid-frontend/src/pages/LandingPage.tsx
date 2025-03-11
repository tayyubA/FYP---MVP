import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Container,
  Fade,
  Button,
  useTheme,
  Alert,
  Zoom,
  Card,
  CardContent,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import Logo from '../components/landing/Logo';
import SearchBox from '../components/landing/SearchBox';
import { Patient } from '../types';

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const history = useHistory();
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<Patient | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  const handlePatientFound = (patient: Patient) => {
    setSearchResult(patient);
    setSearchError(null);
  };

  const handlePatientNotFound = (cnic: string) => {
    setSearchError('There are no records in our database with this CNIC.');
    setSearchResult(null);
  };

  const handleStartConsultation = () => {
    if (searchResult) {
      history.push(`/consultation/${searchResult.id}`);
    }
  };

  const handleNewRegistration = () => {
    history.push('/registration');
  };

  const handleSearchClick = () => {
    setShowSearch(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
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
          <Box sx={{ py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Logo size="medium" />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Zoom in={true}>
            <Typography 
              variant="h3" 
              gutterBottom 
              sx={{ 
                fontWeight: 700, 
                color: theme.palette.primary.main,
                mb: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Welcome to Sign Aid
            </Typography>
          </Zoom>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              maxWidth: 600, 
              mx: 'auto', 
              mb: 6 
            }}
          >
            Bridging communication gaps in healthcare through innovative sign language technology.
          </Typography>

          {/* Main Options */}
          {!showSearch ? (
            <Box sx={{ maxWidth: 900, mx: 'auto' }}>
              <Grid container spacing={4} justifyContent="center">
                {/* Search Previous Records */}
                <Grid item xs={12} sm={6}>
                  <Fade in={true} timeout={800}>
                    <Card 
                      elevation={3}
                      sx={{ 
                        height: '100%',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: theme.shadows[8],
                        }
                      }}
                    >
                      <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ mb: 3 }}>
                          <SearchIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
                        </Box>
                        <Typography variant="h5" gutterBottom>
                          Search Previous Records
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, flex: 1 }}>
                          Look up existing patient records using CNIC number to access medical history and start a consultation.
                        </Typography>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          size="large"
                          onClick={handleSearchClick}
                          startIcon={<SearchIcon />}
                        >
                          Search Records
                        </Button>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>

                {/* Start New Consultation */}
                <Grid item xs={12} sm={6}>
                  <Fade in={true} timeout={1200}>
                    <Card 
                      elevation={3}
                      sx={{ 
                        height: '100%',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: theme.shadows[8],
                        }
                      }}
                    >
                      <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ mb: 3 }}>
                          <PersonAddIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
                        </Box>
                        <Typography variant="h5" gutterBottom>
                          Start New Consultation
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, flex: 1 }}>
                          Register a new patient and begin a consultation session with real-time sign language support.
                        </Typography>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          size="large"
                          onClick={handleNewRegistration}
                          startIcon={<PersonAddIcon />}
                        >
                          New Patient
                        </Button>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Fade in={true}>
              <Box>
                <Grid container justifyContent="center">
                  <Grid item xs={12} md={8}>
                    <SearchBox
                      onPatientFound={handlePatientFound}
                      onPatientNotFound={handlePatientNotFound}
                    />
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => setShowSearch(false)}
                      sx={{ mt: 2 }}
                    >
                      ← Back to options
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Fade>
          )}

          {/* Search Results */}
          {(searchError || searchResult) && (
            <Fade in={true}>
              <Paper 
                elevation={3} 
                sx={{ 
                  mt: 4, 
                  p: 4, 
                  maxWidth: 600, 
                  mx: 'auto',
                  borderRadius: 2
                }}
              >
                {searchError ? (
                  <Box sx={{ textAlign: 'center' }}>
                    <Alert 
                      severity="info" 
                      sx={{ 
                        mb: 3,
                        '& .MuiAlert-message': { fontSize: '1rem' }
                      }}
                    >
                      {searchError}
                    </Alert>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNewRegistration}
                      startIcon={<PersonAddIcon />}
                    >
                      Register New Patient
                    </Button>
                  </Box>
                ) : searchResult && (
                  <>
                    <Typography variant="h6" gutterBottom color="primary">
                      Patient Found
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body1">
                          Name: <strong>{searchResult.name}</strong>
                        </Typography>
                        <Typography variant="body1">
                          Age: <strong>{searchResult.age}</strong>
                        </Typography>
                        <Typography variant="body1">
                          Gender: <strong>{searchResult.gender}</strong>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body1">
                          CNIC: <strong>{searchResult.cnic}</strong>
                        </Typography>
                        <Typography variant="body1">
                          Blood Type: <strong>{searchResult.bloodType}</strong>
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          onClick={handleStartConsultation}
                          sx={{ mt: 2 }}
                        >
                          Start Consultation
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                )}
              </Paper>
            </Fade>
          )}
        </Box>

        {/* Vision and Values Section */}
        <Box sx={{ py: 8, bgcolor: '#f5f5f5' }}>
          <Container maxWidth="lg">
            <Paper 
              elevation={3}
              sx={{ 
                p: 4, 
                borderRadius: 2,
                bgcolor: 'background.paper',
                overflow: 'hidden'
              }}
            >
              <Grid container spacing={4}>
                {/* Breaking Barriers Section */}
                <Grid item xs={12} md={5}>
                  <Fade in={true} timeout={800}>
                    <Box>
                      <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
                        Breaking Barriers
                      </Typography>
                      <Typography variant="body1" paragraph>
                        At Sign Aid, we're dedicated to revolutionizing healthcare communication. Our mission extends beyond simple translation - we're creating a future where language differences no longer impede quality healthcare.
                      </Typography>
                      <Typography variant="body1">
                        We achieve this through:
                      </Typography>
                      <Box component="ul" sx={{ mt: 1 }}>
                        <Typography component="li" variant="body1">
                          Advanced sign language recognition technology
                        </Typography>
                        <Typography component="li" variant="body1">
                          Intuitive user interfaces for both patients and doctors
                        </Typography>
                        <Typography component="li" variant="body1">
                          Comprehensive medical vocabulary support
                        </Typography>
                      </Box>
                    </Box>
                  </Fade>
                </Grid>

                {/* Values and Impact Grid */}
                <Grid item xs={12} md={7}>
                  <Grid container spacing={3}>
                    {/* Values Box */}
                    <Grid item xs={12} sm={6}>
                      <Fade in={true} timeout={1200}>
                        <Paper
                          elevation={2}
                          sx={{
                            p: 3,
                            height: '100%',
                            bgcolor: theme.palette.primary.light,
                            borderRadius: 2
                          }}
                        >
                          <Typography variant="h6" gutterBottom color="primary.dark" sx={{ fontWeight: 600 }}>
                            Our Values
                          </Typography>
                          <Box component="ul" sx={{ m: 0, pl: 2 }}>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                              Inclusivity in Healthcare
                            </Typography>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                              Accessibility for All
                            </Typography>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                              Innovation in Communication
                            </Typography>
                            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                              Patient Empowerment
                            </Typography>
                            <Typography component="li" variant="body2">
                              Quality Care Without Barriers
                            </Typography>
                          </Box>
                        </Paper>
                      </Fade>
                    </Grid>

                    {/* Impact Box */}
                    <Grid item xs={12} sm={6}>
                      <Fade in={true} timeout={1600}>
                        <Paper
                          elevation={2}
                          sx={{
                            p: 3,
                            height: '100%',
                            bgcolor: theme.palette.secondary.light,
                            borderRadius: 2
                          }}
                        >
                          <Typography variant="h6" gutterBottom color="secondary.dark" sx={{ fontWeight: 600 }}>
                            Our Impact
                          </Typography>
                          <Box>
                            <Typography variant="body2" paragraph>
                              Through our innovative platform:
                            </Typography>
                            <Box component="ul" sx={{ m: 0, pl: 2 }}>
                              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                100+ Healthcare Providers Connected
                              </Typography>
                              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                                1000+ Patient Consultations Facilitated
                              </Typography>
                              <Typography component="li" variant="body2">
                                Improved Healthcare Outcomes for Deaf Community
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Fade>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Container>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage; 