const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");

require("./config/passport");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
// Routes (placeholders)
app.use("/api/health", require("./routes/health"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/auth", require("./routes/passwordReset"));
app.use("/api/teams", require("./routes/teams"));
app.use("/api/candidates", require("./routes/candidates"));
app.use("/api/vote", require("./routes/vote"));
app.use("/api/results", require("./routes/results"));
app.use("/api/auth/linkedin", require("./routes/linkedin"));
app.use("/api/auth/linkedin", require("./routes/linkedinCallback"));
app.use("/api/proxy", require("./routes/proxy"));

module.exports = app;
