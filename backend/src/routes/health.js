const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({ status: "OK", message: "Server is healthy" });
});

module.exports = router;
