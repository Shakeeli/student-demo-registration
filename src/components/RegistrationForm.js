import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
    Alert,
    Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegistrationForm = () => {
    const [studentId, setStudentId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [projectTitle, setProjectTitle] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [timeSlots, setTimeSlots] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    // Fetch available time slots when the component mounts
    useEffect(() => {
        axios.get('http://localhost:5001/timeslots')
            .then(response => {
                setTimeSlots(response.data);  // Update state with the time slots
            })
            .catch(error => {
                console.error('Error fetching time slots:', error);
                setError('Error fetching time slots');
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            student_id: studentId,
            first_name: firstName,
            last_name: lastName,
            project_title: projectTitle,
            email: email,
            phone: phone,
            time_slot: timeSlot,
        };

        fetch('http://localhost:5001/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                    setSuccess('');
                } else {
                    setSuccess(data.message);
                    setError('');
                    // Redirect to students page after successful registration
                    setTimeout(() => navigate('/students'), 2000);
                }
            })
            .catch((err) => {
                setError('Error submitting the registration');
                setSuccess('');
            });
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '50px' }}>
            <Box>
                <Typography variant="h4" align="center" gutterBottom>
                    Student Registration
                </Typography>

                {error && (
                    <Alert severity="error" style={{ marginBottom: '20px' }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" style={{ marginBottom: '20px' }}>
                        {success}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Student ID"
                        fullWidth
                        required
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        style={{ marginBottom: '15px' }}
                    />
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                label="First Name"
                                fullWidth
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Last Name"
                                fullWidth
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </Grid>
                    </Grid>

                    <TextField
                        label="Project Title"
                        fullWidth
                        required
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        style={{ marginTop: '15px' }}
                    />

                    <TextField
                        label="Email"
                        fullWidth
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ marginTop: '15px' }}
                    />

                    <TextField
                        label="Phone Number"
                        fullWidth
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ marginTop: '15px' }}
                    />

                    <FormControl fullWidth style={{ marginTop: '15px' }} required>
                        <InputLabel>Time Slot</InputLabel>
                        <Select
                            value={timeSlot}
                            onChange={(e) => setTimeSlot(e.target.value)}
                        >
                            {timeSlots.length > 0 ? (
                                timeSlots.map((slot) => (
                                    <MenuItem key={slot.id} value={slot.time_slot}>
                                        {slot.time_slot} - {slot.seats_remaining} seats remaining
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem value="" disabled>
                                    No available time slots
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={{ marginTop: '30px' }}
                    >
                        Submit
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default RegistrationForm;
