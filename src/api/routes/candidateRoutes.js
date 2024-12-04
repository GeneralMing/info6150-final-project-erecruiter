const express = require('express');
const multer = require('multer');
const candidateController = require('../controllers/candidateController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads/resume',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/', upload.single('resume'), candidateController.createCandidate);
router.get('/', candidateController.getAllCandidates);
router.get('/:candidateId', candidateController.getCandidateById);
router.put('/:candidateId', upload.single('resume'), candidateController.updateCandidate);
router.delete('/:candidateId', candidateController.deleteCandidate);

module.exports = router;
