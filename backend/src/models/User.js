const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    google: {
      id: String,
      email: String
    },
    linkedin: {
      id: String,
      email: String,
      profileUrl: String,
      picture: String
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    linkedinProfileUrl: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    hasVoted: {
      type: Boolean,
      default: false,
    },
    votedCandidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
    },
  },
  { timestamps: true }
);

// Remove the problematic index - we'll use email-based uniqueness instead
// userSchema.index({ authProvider: 1, providerUserId: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
