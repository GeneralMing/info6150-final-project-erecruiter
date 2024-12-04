import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import api, { setAuthToken } from '../../api/api';
import logo from '../../assets/e - Recruiter new.svg'; // Replace with your actual logo path
import './login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('danger'); // Default variant is danger for alerts
  const navigate = useNavigate();

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!email) {
      isValid = false;
      formErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      isValid = false;
      formErrors.email = 'Email address is invalid';
    }

    if (!password) {
      isValid = false;
      formErrors.password = 'Password is required';
    } else if (password.length < 6) {
      isValid = false;
      formErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Check user details
        const userDetailsResponse = await api.get(`/user/details?email=${email}`);
        const userDetails = userDetailsResponse.data;

        // Check if the user's account is active
        if (userDetails.status === 'inactive') {
          setShowAlert(true);
          setAlertMessage('Your account is inactive. Please contact your admin.');
          setAlertVariant('danger');
          return;
        }

        // Login request
        const response = await api.post('/user/login', { email, password });

        // Get token from login response
        const { token } = response.data;

        // Save token in localStorage
        localStorage.setItem('token', token);

        // Set auth token for subsequent API requests
        setAuthToken(token);

        // Save user details in localStorage
        localStorage.setItem('userDetails', JSON.stringify(userDetails));

        setShowAlert(true);
        setAlertMessage('Login successful! Redirecting...');
        setAlertVariant('success');

        setTimeout(() => {
          setShowAlert(false);
          navigate('/layout'); // Redirect to dashboard or layout
        }, 2000);
      } catch (error) {
        setShowAlert(true);
        setAlertMessage(error.response?.data?.message || 'Login failed');
        setAlertVariant('danger');
      }
    }
  };

  return (
    <Container fluid className="login-page d-flex align-items-center justify-content-center">
      <Row className="justify-content-center w-100">
        <Col xs={11} sm={8} md={6} lg={5} xl={4}>
          <div className="text-center mb-4">
            <img src={logo} alt="Logo" className="login-logo" />
          </div>

          {showAlert && (
            <Alert variant={alertVariant} className="text-center">
              {alertMessage}
            </Alert>
          )}

          <Card className="login-card">
            <Card.Body>
              <h2 className="text-center mb-4">Login</h2>
              <Form onSubmit={handleSubmit} noValidate>
                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="password" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100">
                  Login
                </Button>
              </Form>

              <div className="text-center mt-3">
                <p>
                  Don't have an account?{' '}
                  <Link to="/signup" className="signup-link">Sign Up</Link>
                </p>
                <p>
                  Are you a candidate?{' '}
                  <Link to="/signup/candidate" className="signup-link">Sign Up as Candidate</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
