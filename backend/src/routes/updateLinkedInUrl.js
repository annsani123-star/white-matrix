const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { authenticate } = require("../middleware/auth");

router.post("/update-linkedin-url", authenticate, async (req, res) => {
  try {
    const { linkedinProfileUrl } = req.body;

    if (!linkedinProfileUrl) {
      return res.status(400).json({ message: "LinkedIn profile URL is required" });
    }

    // Basic validation - check if it's a LinkedIn URL
    if (!linkedinProfileUrl.includes("linkedin.com")) {
      return res.status(400).json({ message: "Please provide a valid LinkedIn URL" });
    }

    // Update user's LinkedIn profile URL
    const user = await User.findByIdAndUpdate(
      req.userId,
      { linkedinProfileUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "LinkedIn profile URL updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        linkedinProfileUrl: user.linkedinProfileUrl,
      },
    });
  } catch (error) {
    console.error("Error updating LinkedIn URL:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
