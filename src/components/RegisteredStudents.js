import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';

const StudentsList = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/students')
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error('Error fetching students:', err));
  }, []);

  return (
    <Container maxWidth="lg" style={{ marginTop: '50px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Registered Students
      </Typography>
      <Grid container spacing={3}>
        {students.map((student) => (
          <Grid item xs={12} sm={6} md={4} key={student.id}>
            <Box
              p={2}
              boxShadow={3}
              borderRadius={2}
              style={{ backgroundColor: '#f9f9f9' }}
            >
              <Typography variant="h6">{`${student.first_name} ${student.last_name}`}</Typography>
              <Typography variant="body2">{`Project: ${student.project_title}`}</Typography>
              <Typography variant="body2">{`Email: ${student.email}`}</Typography>
              <Typography variant="body2">{`Phone: ${student.phone}`}</Typography>
              <Typography variant="body2">{`Time Slot: ${student.time_slot}`}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default StudentsList;
