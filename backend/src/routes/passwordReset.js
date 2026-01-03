const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../config/email");

/* =======================
   FORGOT PASSWORD
   ======================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Forgot password request for:", email);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    console.log("User found:", user ? "Yes" : "No");

    // For security, always return success even if user doesn't exist
    if (!user) {
      return res.json({ 
        message: "If an account exists with this email, a password reset link has been sent" 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    console.log("Generated reset token");

    // Save reset token and expiry (1 hour)
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    console.log("Saved reset token to user");

    // Construct reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    console.log("Reset URL:", resetUrl);
    
    // Send email
    try {
      console.log("Attempting to send email...");
      console.log("EMAIL_USER:", process.env.EMAIL_USER);
      console.log("EMAIL_PASSWORD configured:", !!process.env.EMAIL_PASSWORD);
      
      await sendPasswordResetEmail(email, resetUrl, user.name);
      console.log("Password reset email sent successfully to:", email);
      
      res.json({ 
        message: "Password reset instructions have been sent to your email"
      });
    } catch (emailError) {
      console.error("Failed to send email - Full error:", emailError);
      console.error("Error message:", emailError.message);
      console.error("Error stack:", emailError.stack);
      
      // Clear the reset token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      
      return res.status(500).json({ 
        message: "Failed to send password reset email. Please try again later.",
        error: emailError.message 
      });
    }
  } catch (error) {
    console.error("Forgot password error - Full error:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/* =======================
   RESET PASSWORD
   ======================= */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Hash the token to compare with stored hash
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ 
        message: "Invalid or expired reset token. Please request a new password reset." 
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
