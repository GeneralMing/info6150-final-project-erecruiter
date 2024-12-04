import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from '../App/Login/login';
import Signup from '../App/Signup/signup';
import Layout from '../App/Layout/Layout';
import Home from '../App/Home/Home';
import JobDescriptionPage from '../App/JobDescription/JobDescription';
import ProtectedRoute from './protectedRoute';
import Contact from '../App/Contact/contact';
import Company from '../App/Company/Company';
import JobView from '../App/ViewJobDescription/ViewJobDescription';
import CandidateDetails from '../App/CandidateDetails/CandidateDetails'
import Profile from '../App/Profile/Profile';
import SignupCandidate from '../App/Signup/SignupCandidate';
import UserList from '../App/Users/UserList';
const AppRouter = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  // Redirect to /layout if token exists and user tries to access login or signup
  useEffect(() => {
    if (token && (location.pathname === '/' || location.pathname === '/signup')) {
      window.location.href = '/layout';
    }
  }, [token, location]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={!token ? <Login /> : <Navigate to="/layout" replace />} />
      <Route path="/signup" element={!token ? <Signup /> : <Navigate to="/layout" replace />} />
      <Route path="/signup/candidate" element={<SignupCandidate />} />
      {/* Protected Routes */}
      <Route path="/layout" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Home />} />
        <Route path="jobdescription" element={<JobDescriptionPage />} />
        <Route path="viewjob/:jobId" element={<JobView />} />
        <Route path="candidate" element={<CandidateDetails />} />
        <Route path="userlist" element={<UserList />} />
        <Route path="profile" element={<Profile />} />
        <Route path="contact" element={<Contact />} />
        <Route path="company" element={<Company />} />
      </Route>

      {/* Catch-all route to redirect to login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
