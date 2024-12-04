const Candidate = require('../models/Candidate');

exports.createCandidate = async (candidateData) => {
  const candidate = new Candidate(candidateData);
  return await candidate.save();
};

exports.getAllCandidates = async () => {
  return await Candidate.find();
};

exports.getCandidateById = async (candidateId) => {
  return await Candidate.findOne({ candidateId });
};

exports.updateCandidate = async (candidateId, updateData) => {
  return await Candidate.findOneAndUpdate({ candidateId }, { $set: updateData }, { new: true });
};

exports.deleteCandidate = async (candidateId) => {
  return await Candidate.findOneAndDelete({ candidateId });
};
