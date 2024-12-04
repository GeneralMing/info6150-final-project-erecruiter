const candidateService = require('../services/candiateService');
const nodemailer = require('nodemailer');
const jobService = require('../services/jobService');
const { v4: uuidv4 } = require('uuid');

// Create a new candidate
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: 'dineshreddy2805@gmail.com',
    pass: 'ngjp zoex vsaw uxwb',
  },
});

// Helper function to send an email
const sendEmail = async (recipientEmail, subject, text) => {
  try {
    await transporter.sendMail({
      from: '"Recruiter System" <dineshreddy2805@gmail.com>',
      to: recipientEmail,
      subject,
      text,
    });
    console.log(`Email sent to ${recipientEmail}`);
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};

// Create a new candidate
exports.createCandidate = async (req, res) => {
  const { firstName, lastName, mobileNo, email, jobId, stage } = req.body;

  if (!firstName || !lastName || !mobileNo || !email || !req.file || !jobId || !stage) {
    return res.status(400).json({ message: 'All fields are required, including the resume.' });
  }

  try {
    const job = await jobService.getJobById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    const candidateData = {
      candidateId: uuidv4(),
      firstName,
      lastName,
      mobileNo,
      email,
      resume: req.file.path,
      jobId,
      stage,
    };

    const candidate = await candidateService.createCandidate(candidateData);

    // Send email notification
    const subject = 'Candidate Registration Successful';
    const text = `Hello ${firstName} ${lastName},\n\nYou have been successfully registered for the job position: ${job.jobPostingName}.\n\nStage: ${stage}\n\nThank you,\nRecruiter System`;
    await sendEmail(email, subject, text);

    res.status(201).json({ message: 'Candidate created successfully', candidate });
  } catch (error) {
    console.error('Error creating candidate:', error.message);
    res.status(500).json({ message: 'Error creating candidate', error: error.message });
  }
};

// Update candidate
exports.updateCandidate = async (req, res) => {
  const { candidateId } = req.params;
  const { stage, interviewDate, interviewLocation } = req.body;
  const updateData = { ...req.body };

  if (req.file) {
    updateData.resume = req.file.path;
  }

  try {
    const updatedCandidate = await candidateService.updateCandidate(candidateId, updateData);
    if (!updatedCandidate) {
      return res.status(404).json({ message: 'Candidate not found.' });
    }

    // Send stage-specific email notifications
    if (stage) {
      let subject = '';
      let text = '';

      switch (stage.toLowerCase()) {
        case 'shortlisted':
          subject = 'Application Shortlisted';
          text = `Hello ${updatedCandidate.firstName} ${updatedCandidate.lastName},\n\nCongratulations! Your application has been shortlisted for the job position.\n\nNext steps will be shared with you soon.\n\nThank you,\nRecruiter System`;
          break;

        case 'scheduled':
          subject = 'Interview Scheduled';
          text = `Hello ${updatedCandidate.firstName} ${updatedCandidate.lastName},\n\nYour interview has been scheduled.\n\nDetails:\n- Date: ${interviewDate}\n- Location: ${interviewLocation}\n\nPlease make sure to arrive on time.\n\nThank you,\nRecruiter System`;
          break;

        case 'selected':
          subject = 'Congratulations! You Have Been Selected';
          text = `Hello ${updatedCandidate.firstName} ${updatedCandidate.lastName},\n\nWe are thrilled to inform you that you have been selected for the job position.\n\nFurther details regarding the offer will be shared with you soon.\n\nThank you,\nRecruiter System`;
          break;

        case 'rejected':
          subject = 'Application Status: Rejected';
          text = `Hello ${updatedCandidate.firstName} ${updatedCandidate.lastName},\n\nWe regret to inform you that your application for the job position has been rejected at this time.\n\nThank you for applying and we encourage you to apply for future opportunities.\n\nBest regards,\nRecruiter System`;
          break;

        default:
          console.log('No specific email content for the given stage.');
          break;
      }

      if (subject && text) {
        await sendEmail(updatedCandidate.email, subject, text);
      }
    }

    res.status(200).json({ message: 'Candidate updated successfully', updatedCandidate });
  } catch (error) {
    console.error('Error updating candidate:', error.message);
    res.status(500).json({ message: 'Error updating candidate', error: error.message });
  }
};

// Get all candidates
exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await candidateService.getAllCandidates();
    res.status(200).json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error.message);
    res.status(500).json({ message: 'Error fetching candidates', error: error.message });
  }
};

// Get candidate by candidateId
exports.getCandidateById = async (req, res) => {
  const { candidateId } = req.params;

  try {
    const candidate = await candidateService.getCandidateById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json(candidate);
  } catch (error) {
    console.error('Error fetching candidate:', error.message);
    res.status(500).json({ message: 'Error fetching candidate', error: error.message });
  }
};

// Update a candidate by candidateId


// Delete a candidate by candidateId
exports.deleteCandidate = async (req, res) => {
  const { candidateId } = req.params;

  try {
    const candidate = await candidateService.deleteCandidate(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json({ message: 'Candidate deleted successfully', candidate });
  } catch (error) {
    console.error('Error deleting candidate:', error.message);
    res.status(500).json({ message: 'Error deleting candidate', error: error.message });
  }
};
