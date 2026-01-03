const router = require("express").Router();
const axios = require("axios");

// Proxy LinkedIn profile images to avoid ad blockers
router.get("/linkedin-image", async (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ message: "URL parameter is required" });
  }

  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    // Set appropriate headers
    res.set('Content-Type', response.headers['content-type'] || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
    res.send(response.data);
  } catch (error) {
    console.error("Error proxying image:", error.message);
    res.status(500).json({ message: "Failed to load image" });
  }
});

module.exports = router;
