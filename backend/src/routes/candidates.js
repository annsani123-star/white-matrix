const router = require("express").Router();
const Candidate = require("../models/Candidate");

router.get("/", async (req, res) => {
  const candidates = await Candidate.find({});
  res.json(candidates);
});

module.exports = router;
