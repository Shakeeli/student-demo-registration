import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import StudentsList from './components/RegisteredStudents'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegistrationForm />} />
        <Route path="/students" element={<StudentsList />} />
      </Routes>
    </Router>
  );
}

export default App;
