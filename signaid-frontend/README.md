# SignAid Telemedicine System

A responsive web application for a telemedicine system designed for deaf patients. The system facilitates doctor-patient communication using speech-to-text conversion, SIGML animation, and a structured consultation process.

## Features

- **Patient Search**: Doctors can search for patients using their CNIC.
- **Patient Registration**: New patients can be registered with their personal and medical details.
- **Consultation Screen**: Real-time transcription of doctor's speech with SIGML animation for sign language translation.
- **Doctor's Notes**: Doctors can take and save notes during the consultation.
- **Prescription Management**: Doctors can create prescriptions with medicines, dosages, and instructions.
- **Printable Prescriptions**: Generate printable prescriptions for patients.

## Technologies Used

- React with TypeScript
- Material UI for responsive design
- React Router for navigation
- Formik and Yup for form handling and validation
- React Speech Recognition for speech-to-text conversion
- React-to-Print for prescription printing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/signaid-frontend.git
   cd signaid-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

- `src/components`: UI components organized by feature
- `src/pages`: Page components for different routes
- `src/services`: API services for backend communication
- `src/utils`: Utility functions for speech-to-text and SIGML
- `src/types`: TypeScript interfaces and types

## Usage

1. **Landing Page**: Enter a patient's CNIC to search for their records.
2. **Patient Registration**: If the patient is not found, register them with their details.
3. **Consultation**: Start a consultation session with speech-to-text and sign language translation.
4. **Prescription**: Create a prescription with medicines and instructions.
5. **Print**: Print the prescription for the patient.

## Note on SIGML Implementation

This project includes a simplified implementation of SIGML animation. In a production environment, you would integrate with a proper SIGML library or service for accurate sign language translation.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This project was created as a demonstration of a telemedicine system for deaf patients.
- The SIGML animation is a simplified representation and would require integration with specialized libraries for production use.
