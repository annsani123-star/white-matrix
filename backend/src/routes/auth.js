const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const User = require("../models/User");
const auth = require("../middleware/auth");

/* =======================
   GET CURRENT USER
   ======================= */

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user data" });
  }
});

/* =======================
   UPDATE LINKEDIN URL
   ======================= */

router.post("/update-linkedin-url", auth, async (req, res) => {
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
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "LinkedIn profile URL updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating LinkedIn URL:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =======================
   REGISTER (Email/Password)
   ======================= */

router.post("/register", async (req, res) => {
  try {
    const { email, password, name, linkedinProfileUrl } = req.body;

    if (!email || !password || !name || !linkedinProfileUrl) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate LinkedIn URL
    if (!linkedinProfileUrl.includes("linkedin.com")) {
      return res.status(400).json({ message: "Please provide a valid LinkedIn URL" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      linkedinProfileUrl,
    });

    // Generate token
    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(201).json({ 
      message: "Account created successfully",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

/* =======================
   LOGIN (Email/Password)
   ======================= */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.json({ 
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

/* =======================
   GOOGLE LOGIN
   ======================= */

// Start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = generateToken(req.user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set true in production (HTTPS)
      sameSite: "lax",
    });

    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

/* =======================
   LOGOUT
   ======================= */

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

module.exports = router;
