const router = require("express").Router();
const auth = require("../middleware/auth");
const Vote = require("../models/Vote");
const Candidate = require("../models/Candidate");
const User = require("../models/User");

// View results (only after user has voted)
router.get("/", auth, async (req, res) => {
  const results = await Vote.aggregate([
    { $group: { _id: "$candidateId", votes: { $sum: 1 } } }
  ]);

  const candidates = await Candidate.find({});

  const merged = candidates.map(c => {
    const r = results.find(x => String(x._id) === String(c._id));
    return { candidate: c, votes: r ? r.votes : 0 };
  });

  // Determine winner
  const sorted = [...merged].sort((a, b) => b.votes - a.votes);
  const winner = sorted[0];

  res.json({ results: merged, winner });
});

// Get all voted users
router.get("/voted-users", async (req, res) => {
  try {
    const votedUsers = await User.find(
      { hasVoted: true },
      { 
        name: 1, 
        linkedinProfileUrl: 1,
        "linkedin.email": 1,
        "linkedin.picture": 1
      }
    );
    
    res.json(votedUsers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching voted users", error: err.message });
  }
});

// Get vote counts for all candidates
router.get("/vote-counts", async (req, res) => {
  try {
    const voteCounts = await Vote.aggregate([
      { 
        $group: { 
          _id: "$candidateId", 
          votes: { $sum: 1 } 
        } 
      },
      {
        $project: {
          candidateId: { $toString: "$_id" },
          votes: 1,
          _id: 0
        }
      }
    ]);
    
    res.json(voteCounts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching vote counts", error: err.message });
  }
});

module.exports = router;
