const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Candidate = require("../models/Candidate");
const Vote = require("../models/Vote");

router.post("/", auth, async (req, res) => {
  const { candidateId } = req.body;

  if (!candidateId) {
    return res.status(400).json({ message: "candidateId is required" });
  }

  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.hasVoted) {
    return res.status(409).json({ message: "You have already voted" });
  }

  const candidate = await Candidate.findById(candidateId);
  if (!candidate) {
    return res.status(404).json({ message: "Invalid candidate" });
  }

  try {
    await Vote.create({
      userId: user._id,
      candidateId: candidate._id,
      teamId: candidate.teamId,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "You have already voted" });
    }
    throw err;
  }

  user.hasVoted = true;
  user.votedCandidateId = candidate._id;
  await user.save();

  res.json({ message: "Vote recorded successfully" });
});

module.exports = router;
