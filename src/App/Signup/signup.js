import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import api from '../../api/api';
import logo from '../../assets/e - Recruiter new.svg';
import './signup.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Corrected to an empty string
  const [userType, setUserType] = useState('employee'); // Default user type
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState(''); // Success or danger
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!username) {
      isValid = false;
      formErrors.username = 'Username is required';
    }

    if (!email) {
      isValid = false;
      formErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      isValid = false;
      formErrors.email = 'Email address is invalid';
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!password) {
      isValid = false;
      formErrors.password = 'Password is required';
    } else if (!passwordRegex.test(password)) {
      isValid = false;
      formErrors.password =
        'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character (!@#$%^&*).';
    }

    if (!confirmPassword) {
      isValid = false;
      formErrors.confirmPassword = 'Confirm Password is required';
    } else if (confirmPassword !== password) {
      isValid = false;
      formErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await api.post('/user/create', {
          fullName: username,
          email,
          password,
          role: userType,
        });
        setAlertMessage(
          userType === 'employee'
            ? 'Signup successful! Please contact your admin to activate your account.'
            : 'Signup successful! Redirecting to login...'
        );
        setAlertVariant('success');
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
          navigate('/'); // Redirect to login page
        }, 2000);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || 'Signup failed. Please try again.';
        setAlertMessage(
          errorMessage === 'User already exists'
            ? 'User already exists. Please login instead.'
            : errorMessage
        );
        setAlertVariant('danger'); // Set alert color to red for errors
        setShowAlert(true);
      }
    }
  };

  return (
    <Container fluid className="signup-page d-flex align-items-center justify-content-center">
      <Row className="justify-content-center w-100">
        <Col xs={11} sm={10} md={8} lg={6} xl={5}>
          <div className="text-center mb-4">
            <img src={logo} alt="Logo" className="signup-logo" />
          </div>

          {showAlert && (
            <Alert variant={alertVariant} className="text-center">
              {alertMessage}
            </Alert>
          )}

          <Card className="signup-card">
            <Card.Body>
              <h2 className="text-center mb-4">Sign Up</h2>
              <Form onSubmit={handleSubmit} noValidate>
                <Form.Group controlId="username" className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    isInvalid={!!errors.username}
                    placeholder="Enter your user name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={!!errors.email}
                    placeholder="Enter your email"
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
                    placeholder="Enter your strong password"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="confirmPassword" className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    isInvalid={!!errors.confirmPassword}
                    placeholder="Re-enter your password"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="userType" className="mb-3">
                  <Form.Label>User Type</Form.Label>
                  <Form.Select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                  </Form.Select>
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100">
                  Sign Up
                </Button>
              </Form>

              <div className="text-center mt-3">
                <p>
                  Already have an account?{' '}
                  <Link to="/" className="login-link">
                    Login
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Signup;
