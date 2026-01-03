const router = require("express").Router();
const Team = require("../models/Team");
const Candidate = require("../models/Candidate");

router.get("/", async (req, res) => {
  try {
    const teams = await Team.find({ isActive: true });
    const candidates = await Candidate.find({}).populate("teamId");
    
    // Group candidates by team
    const teamsWithCandidates = teams.map(team => ({
      _id: team._id,
      name: team.name,
      description: team.description,
      candidates: candidates.filter(c => String(c.teamId._id) === String(team._id))
    }));
    
    res.json(teamsWithCandidates);
  } catch (err) {
    res.status(500).json({ message: "Error fetching teams", error: err.message });
  }
});

module.exports = router;
