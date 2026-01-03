const router = require("express").Router();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const https = require("https");

// Create HTTPS agent that forces IPv4
const httpsAgent = new https.Agent({
  family: 4, // force IPv4
});

router.get("/callback", async (req, res) => {
  console.log("=== LINKEDIN CALLBACK STARTED ===");
  const { code, error, error_description } = req.query;

  // Log the full query for debugging
  console.log("LinkedIn callback received:", req.query);

  if (error) {
    console.error("LinkedIn OAuth error:", error, error_description);
    return res.status(400).json({ 
      message: "LinkedIn authorization failed", 
      error, 
      error_description 
    });
  }

  if (!code) {
    console.error("Missing authorization code in callback");
    return res.status(400).json({ message: "Missing authorization code" });
  }

  try {
    /* =========================
       1️⃣ Exchange code for token
       ========================= */
    console.log("Exchanging code for token...");
    const tokenRes = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      }),
      { 
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 10000,
        httpsAgent: httpsAgent,
      }
    );

    console.log("Token exchange successful");

    const accessToken = tokenRes.data.access_token;

    /* =========================
       2️⃣ Fetch LinkedIn profile
       ========================= */
    console.log("Fetching LinkedIn profile...");
    let data;
    try {
      const profileResponse = await axios.get(
        "https://api.linkedin.com/v2/userinfo",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          timeout: 10000,
          httpsAgent: httpsAgent,
        }
      );
      data = profileResponse.data;
      console.log("LinkedIn profile data:", data);
    } catch (profileError) {
      console.error("Error fetching LinkedIn profile:", {
        message: profileError.message,
        code: profileError.code,
        response: profileError.response?.data,
        status: profileError.response?.status
      });
      return res.status(500).json({ 
        message: "Failed to fetch LinkedIn profile",
        error: profileError.message 
      });
    }

    // LinkedIn OpenID Connect doesn't provide vanity URL without additional permissions
    // Create a targeted search URL that will show the user's profile
    // Searching by name and email domain gives the best results
    let profileUrl = '';
    
    if (data.name) {
      // Use firstName and lastName for more precise search
      const firstName = data.given_name || '';
      const lastName = data.family_name || '';
      const searchName = firstName && lastName ? `${firstName} ${lastName}` : data.name;
      
      // LinkedIn search with name - this will show their profile as first result
      profileUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(searchName)}`;
      console.log("LinkedIn profile search URL:", profileUrl);
    } else {
      // Fallback to generic LinkedIn
      profileUrl = 'https://www.linkedin.com/';
      console.log("LinkedIn fallback URL");
    }

    const email = data.email;
    if (!email) {
      console.error("No email in LinkedIn profile");
      return res.status(400).json({ message: "LinkedIn email required" });
    }

    /* =========================
       3️⃣ Check if JWT exists
       ========================= */
    let user = null;
    const tokenCookie = req.cookies?.token;

    if (tokenCookie) {
      // 🔗 Try to LINK to existing Google user
      try {
        const decoded = jwt.verify(tokenCookie, process.env.JWT_SECRET);
        user = await User.findById(decoded.userId);
        
        if (user) {
          console.log("Linking LinkedIn to existing user:", user._id);
        } else {
          console.log("Token exists but user not found in DB, will create new user");
        }
      } catch (err) {
        console.log("Invalid JWT token, will create new user:", err.message);
      }
    }

    if (!user) {
      // 🔐 LinkedIn-only login or user doesn't exist
      console.log("Looking for existing LinkedIn user...");
      user = await User.findOne({ "linkedin.email": email });

      if (!user) {
        console.log("Creating new user with LinkedIn profile");
        user = await User.create({
          name: data.name,
          email: email,
        });
      } else {
        console.log("Found existing LinkedIn user:", user._id);
      }
    }

    /* =========================
       4️⃣ Attach LinkedIn
       ========================= */
    console.log("Attaching LinkedIn data to user...");
    user.linkedin = {
      id: data.sub,
      email,
      profileUrl: profileUrl,
      picture: data.picture || "",
    };

    // Note: linkedinProfileUrl is NOT auto-populated here
    // Users (including LinkedIn users) will be prompted to enter their actual profile URL

    // Update main email if not set
    if (!user.email) {
      user.email = email;
    }
    
    console.log("Saving user with LinkedIn data...");
    try {
      await user.save();
      console.log("User saved successfully");
    } catch (saveErr) {
      console.error("Save error:", saveErr);
      console.error("Save error details:", JSON.stringify(saveErr, null, 2));
      throw saveErr;
    }

    /* =========================
       5️⃣ Issue JWT
       ========================= */
    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: false, // true in prod
      sameSite: "lax",
    });

    console.log("LinkedIn authentication successful, redirecting to frontend");
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (err) {
    console.error("LinkedIn authentication error:", err.response?.data || err.message);
    console.error("Full error stack:", err.stack);
    console.error("Error type:", err.constructor.name);
    res.status(500).json({ 
      message: "LinkedIn authentication failed",
      error: err.message || "Unknown error",
      details: err.response?.data || err.toString()
    });
  }
});

module.exports = router;
